import { useState, useCallback, useRef } from 'react';
import { API_BASE_URL } from '../lib/api';
import { useAuthStore } from '../store/useAuthStore';

export type GenState = 'IDLE' | 'CONNECTING' | 'GENERATING' | 'DONE' | 'ERROR' | 'CANCELLED';

export interface GenerateOptions {
  token: string;
  topic: string;
}

export function useSSEGenerate() {
  const [status, setStatus] = useState<GenState>('IDLE');
  const [thinkText, setThinkText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAYS = [2000, 4000, 8000]; // 2s, 4s, 8s

  const abort = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setStatus('CANCELLED');
    
    // Optional: Send abort to backend if supported
    // try {
    //   await fetch(`${API_BASE_URL}/api/generate/abort`, { method: 'POST' });
    // } catch {}
  }, []);

  const reset = useCallback(() => {
    setStatus('IDLE');
    setThinkText('');
    setAnswerText('');
    setProgress(0);
    setErrorMsg('');
    retryCountRef.current = 0;
  }, []);

  const startGenerate = useCallback(async (options: GenerateOptions) => {
    reset();
    setStatus('CONNECTING');

    const executeFetch = async () => {
      const abortCtrl = new AbortController();
      abortControllerRef.current = abortCtrl;
      const { accessToken } = useAuthStore.getState();

      try {
        const response = await fetch(`${API_BASE_URL}/soal/buatsoal`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
          },
          body: JSON.stringify({ ...options, difficulty: 1 }),
          signal: abortCtrl.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setStatus('GENERATING');
        
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        if (!reader) throw new Error('ReadableStream not supported');

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          
          // Parse SSE format: data chunks separated by \n\n
          const parts = buffer.split('\n\n');
          buffer = parts.pop() || ''; // Keep the incomplete part in the buffer

          for (const part of parts) {
            const lines = part.split('\n');
            let eventType = 'message';
            let eventData = '';

            for (const line of lines) {
              if (line.startsWith('event:')) {
                eventType = line.substring(6).trim();
              } else if (line.startsWith('data:')) {
                eventData += line.substring(5).trim();
              }
            }

            if (!eventData) continue;

            let parsedData;
            try {
              parsedData = JSON.parse(eventData);
            } catch (e) {
              continue; // Skip invalid JSON
            }

            // Handle specific events according to backend contract
            switch (eventType) {
              case 'start':
                // { total, per_difficulty, levels }
                break;
              case 'think':
              case 'thinking': // treat as think
                if (parsedData.text) {
                  setThinkText(prev => prev + parsedData.text);
                }
                break;
              case 'answer':
                if (parsedData.text) {
                  setAnswerText(prev => prev + parsedData.text);
                }
                break;
              case 'progress':
                if (parsedData.total && parsedData.saved !== undefined) {
                  setProgress(Math.round((parsedData.saved / parsedData.total) * 100));
                }
                break;
              case 'status':
                if (parsedData.message?.startsWith('generate soal difficulty')) {
                  const level = parsedData.difficulty;
                  const label = level === 1 ? 'Mudah' : level === 2 ? 'Sedang' : 'Sulit';
                  const marker = `\n\n### Generasi Soal - Tingkat: ${label} (Level ${level})\n\n`;
                  setAnswerText(prev => prev + marker);
                  setThinkText(prev => prev + marker);
                }
                break;
              case 'question':
              case 'warning':
                // handle other status updates if needed
                break;
              case 'done':
                setStatus('DONE');
                return; // exit stream successfully
              case 'error':
                throw new Error(parsedData.message || 'Stream error');
            }
          }
        }
        
        // If stream ends without 'done' event, consider it dropped
        if (status !== 'DONE' && abortCtrl.signal.reason?.name !== 'AbortError') {
           throw new Error('Connection dropped unexpectedly');
        }

      } catch (err: any) {
        if (err.name === 'AbortError') {
          // Handled by abort()
          return;
        }

        if (retryCountRef.current < MAX_RETRIES) {
          const delay = RETRY_DELAYS[retryCountRef.current];
          retryCountRef.current += 1;
          setErrorMsg(`Koneksi terganggu. Mencoba menghubungkan kembali dalam ${delay/1000} detik... (Percobaan ${retryCountRef.current}/${MAX_RETRIES})`);
          setStatus('ERROR'); // Show retry toast
          
          setTimeout(() => {
            if (abortControllerRef.current) { // Check if user hasn't cancelled
               setStatus('CONNECTING');
               executeFetch();
            }
          }, delay);
        } else {
          setStatus('ERROR');
          setErrorMsg(err.message || 'Terjadi kesalahan saat men-generate soal. Silakan coba lagi.');
        }
      }
    };

    await executeFetch();

  }, [reset]);

  return {
    status,
    thinkText,
    answerText,
    progress,
    errorMsg,
    startGenerate,
    abort,
    reset
  };
}
