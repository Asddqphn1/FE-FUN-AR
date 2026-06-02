import React, { useState, useEffect, useRef } from 'react';
import { useSchoolStore } from '../store/useSchoolStore';
import { useSSEGenerate } from '../hooks/useSSEGenerate';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BrainCircuit, FileEdit, Play, Square, Loader2, ArrowDownCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BuatSoal() {
  const { token } = useSchoolStore();
  const sse = useSSEGenerate();
  const [topic, setTopic] = useState('');
  
  const reasoningRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto-scroll logic for Reasoning Panel
  useEffect(() => {
    if (autoScroll && reasoningRef.current) {
      reasoningRef.current.scrollTop = reasoningRef.current.scrollHeight;
    }
  }, [sse.thinkText, autoScroll]);

  const handleScroll = () => {
    if (reasoningRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = reasoningRef.current;
      const isBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 10;
      setAutoScroll(isBottom);
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    sse.startGenerate({ token, topic });
  };

  const isGenerating = sse.status === 'CONNECTING' || sse.status === 'GENERATING';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-[calc(100vh-80px)] md:h-[calc(100vh-120px)] space-y-4"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-outfit font-bold text-slate-800 flex items-center">
            <FileEdit className="w-5 h-5 mr-2 text-indigo-600" />
            Pembuatan Soal Baru
          </h2>
          <p className="text-sm text-slate-500 mt-1">Konfigurasi parameter untuk di-generate oleh AI.</p>
        </div>
        {isGenerating && (
          <div className="mt-4 md:mt-0 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl flex items-center font-semibold text-sm border border-indigo-100">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Status: Sedang Menyusun... ({sse.progress}%)
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
        {/* Generate Form */}
        <div className="w-full md:w-1/3 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 p-5 overflow-y-auto">
          <h3 className="font-outfit font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Parameter</h3>
          <form onSubmit={handleGenerate} className="flex-1 flex flex-col space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Mata Pelajaran / Topik</label>
              <input 
                type="text" 
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={isGenerating}
                placeholder="Cth: Hukum Termodinamika" 
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all disabled:bg-slate-50"
              />
            </div>
            <div className="flex-1"></div>

            {sse.status === 'ERROR' && (
              <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-sm border border-rose-100">
                {sse.errorMsg}
              </div>
            )}

            {isGenerating ? (
              <button 
                type="button" 
                onClick={sse.abort}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex justify-center items-center transition-colors shadow-sm"
              >
                <Square className="w-4 h-4 mr-2 fill-current" />
                Batalkan Proses
              </button>
            ) : sse.status === 'ERROR' ? (
              <button 
                type="submit" 
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold flex justify-center items-center transition-colors shadow-sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Ulangi Generate
              </button>
            ) : (
              <button 
                type="submit" 
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex justify-center items-center transition-colors shadow-sm"
              >
                <Play className="w-4 h-4 mr-2 fill-current" />
                {sse.status === 'DONE' ? 'Buat Soal Baru ✨' : 'Mulai Buat Soal ✨'}
              </button>
            )}
          </form>
        </div>

        {/* Live Panels */}
        <div className="w-full md:w-2/3 flex flex-col md:flex-row gap-4 min-h-0">
          
          {/* Reasoning Panel */}
          <div className="flex-1 flex flex-col bg-slate-905 rounded-2xl shadow-sm border border-slate-800 overflow-hidden relative">
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center">
              <BrainCircuit className={`w-4 h-4 mr-2 ${isGenerating ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
              <h3 className="font-outfit font-semibold text-slate-200 text-sm">Alur Pikir AI (Live)</h3>
            </div>
            
            <div 
              ref={reasoningRef}
              onScroll={handleScroll}
              className="flex-1 p-4 overflow-y-auto text-xs font-mono text-emerald-400/90 whitespace-pre-wrap leading-relaxed"
              aria-live="polite"
            >
              {sse.thinkText || (
                <span className="text-slate-600 italic">
                  {isGenerating ? 'Menghubungkan ke Server AI...' : 'Menunggu instruksi generate...'}
                </span>
              )}
            </div>

            {!autoScroll && sse.thinkText && isGenerating && (
              <button 
                onClick={() => setAutoScroll(true)}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-full flex items-center hover:bg-slate-700 transition-colors border border-slate-700 shadow-lg"
              >
                <ArrowDownCircle className="w-3 h-3 mr-1.5" />
                Scroll ke bawah
              </button>
            )}
          </div>

          {/* Preview Panel */}
          <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center">
              <FileEdit className="w-4 h-4 mr-2 text-indigo-500" />
              <h3 className="font-outfit font-semibold text-slate-700 text-sm">Draft Soal (Preview)</h3>
            </div>
            
            <div className="flex-1 p-5 overflow-y-auto prose prose-sm max-w-none text-slate-700">
              {sse.answerText ? (
                <div>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {sse.answerText}
                  </ReactMarkdown>
                  {isGenerating && <span className="inline-block w-1.5 h-4 ml-1 bg-indigo-500 animate-blink align-middle"></span>}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                  ☕ Siap membuat soal...
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
