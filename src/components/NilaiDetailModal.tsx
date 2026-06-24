import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, Clock } from 'lucide-react';
import { fetchApi } from '../lib/api';

interface OptionResponse {
  id: number;
  text: string;
  label: string;
}

interface CorrectAnswerDetail {
  id: number;
  label: string;
  text: string;
}

interface QuestionDetail {
  exam_question_id: number;
  question_text: string;
  difficulty: number;
  batch_number: number;
  options: OptionResponse[];
  user_answer_label: string | null;
  user_answer_text: string | null;
  is_correct: boolean;
  correct_answer: CorrectAnswerDetail;
  thinking_time_seconds: number;
}

interface DetailNilaiData {
  session_id: number;
  topic: string;
  status: string;
  total_score: number;
  start_time: string;
  end_time: string | null;
  user: any;
  total_questions: number;
  total_correct: number;
  total_wrong: number;
  accuracy_percent: number;
  questions: QuestionDetail[];
}

interface NilaiDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  token: string;
}

export default function NilaiDetailModal({ isOpen, onClose, sessionId, token }: NilaiDetailModalProps) {
  const [data, setData] = useState<DetailNilaiData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !sessionId || !token) return;

    let isMounted = true;
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const response = await fetchApi(`/ujian/nilai/detail/${sessionId}?token=${token}`);
        if (isMounted) {
          if (response?.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
            setData(response.data as DetailNilaiData);
          } else if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
            setData(response.data[0]);
          } else if (response && response.session_id) {
            setData(response as DetailNilaiData);
          } else {
             setData(null);
          }
        }
      } catch (err) {
        console.error("Gagal memuat detail nilai:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchDetail();
    return () => { isMounted = false; };
  }, [isOpen, sessionId, token]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-800">Detail Evaluasi Siswa</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
            {isLoading ? (
              <div className="text-center py-12 text-slate-500">Memuat detail...</div>
            ) : !data ? (
              <div className="text-center py-12 text-slate-500">Data detail tidak ditemukan.</div>
            ) : (
              <div className="space-y-6">
                {/* Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <p className="text-sm text-slate-500 mb-1">Skor Akhir</p>
                    <p className="text-2xl font-bold text-indigo-600">{data.total_score}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <p className="text-sm text-slate-500 mb-1">Akurasi</p>
                    <p className="text-2xl font-bold text-slate-800">{data.accuracy_percent}%</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <p className="text-sm text-emerald-600 mb-1">Benar</p>
                    <p className="text-2xl font-bold text-slate-800">{data.total_correct}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <p className="text-sm text-rose-600 mb-1">Salah</p>
                    <p className="text-2xl font-bold text-slate-800">{data.total_wrong}</p>
                  </div>
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-800 text-lg">Riwayat Jawaban</h4>
                  {data.questions.map((q, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-3 items-start">
                          <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${q.is_correct ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {idx + 1}
                          </span>
                          <div>
                            <p className="text-slate-800 font-medium whitespace-pre-wrap">{q.question_text}</p>
                            <div className="flex items-center text-xs text-slate-500 mt-2 space-x-4">
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {q.thinking_time_seconds} detik
                              </span>
                              <span>Kesulitan: {q.difficulty}</span>
                            </div>
                          </div>
                        </div>
                        {q.is_correct ? (
                          <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-6 h-6 text-rose-500 flex-shrink-0" />
                        )}
                      </div>

                      <div className="ml-11 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <div>
                          <p className="text-slate-500 font-medium mb-1">Jawaban Siswa:</p>
                          {q.user_answer_label ? (
                            <div className={`p-2 rounded-md ${q.is_correct ? 'bg-emerald-100/50 text-emerald-800 border border-emerald-200' : 'bg-rose-100/50 text-rose-800 border border-rose-200'}`}>
                              <span className="font-bold mr-2">{q.user_answer_label}.</span>
                              {q.user_answer_text}
                            </div>
                          ) : (
                            <div className="p-2 rounded-md bg-slate-200 text-slate-500 italic">
                              Tidak dijawab
                            </div>
                          )}
                        </div>

                        {!q.is_correct && q.correct_answer && (
                          <div>
                            <p className="text-slate-500 font-medium mb-1">Kunci Jawaban:</p>
                            <div className="p-2 rounded-md bg-emerald-100/50 text-emerald-800 border border-emerald-200">
                              <span className="font-bold mr-2">{q.correct_answer.label}.</span>
                              {q.correct_answer.text}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
