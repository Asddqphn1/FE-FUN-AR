import { useState, useEffect } from 'react';
import { useSchoolStore } from '../store/useSchoolStore';
import { GraduationCap, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchApi } from '../lib/api';

// Mock data interface
interface StudentGrade {
  id: string;
  name: string;
  class: string;
  exam: string;
  score: number | null;
  status: 'Tuntas' | 'Remedial' | 'Belum Ikut';
}

export default function NilaiMurid() {
  const { token } = useSchoolStore();
  const [grades, setGrades] = useState<StudentGrade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!token) return;
    
    let isMounted = true;
    const fetchGrades = async () => {
      try {
        setIsLoading(true);
        const data = await fetchApi(`/ujian/nilai?token=${token}`);
        if (isMounted) {
          const mappedGrades = (data || []).map((item: any, idx: number) => {
            return {
              id: item.id?.toString() || idx.toString(),
              name: item.user?.full_name || item.user?.name || item.user?.email || 'Siswa Tanpa Nama',
              class: item.user?.kelas || item.user?.class || 'Umum',
              exam: item.topic || 'Ujian AI',
              score: item.total_score,
              status: item.status
            };
          });
          setGrades(mappedGrades);
        }
      } catch (err) {
        console.error("Gagal memuat data nilai:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchGrades();

    return () => { isMounted = false; };
  }, [token]);

  const filteredGrades = grades.filter(g => 
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-xl font-outfit font-bold text-slate-800 flex items-center">
            <GraduationCap className="w-6 h-6 mr-2 text-indigo-600" />
            Tabel Nilai Siswa
          </h2>
          <p className="text-sm text-slate-500 mt-1">Pemantauan hasil evaluasi otomatis oleh AI.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Cari nama siswa..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 w-full md:w-64"
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-sm font-semibold text-slate-600">
                <th className="px-6 py-4">Nama Siswa</th>
                <th className="px-6 py-4">Kelas</th>
                <th className="px-6 py-4">Ujian</th>
                <th className="px-6 py-4 text-center">Nilai</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Memuat data nilai...
                  </td>
                </tr>
              ) : filteredGrades.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Tidak ada siswa yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredGrades.map((grade, idx) => (
                  <motion.tr 
                    key={grade.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-700">{grade.name}</td>
                    <td className="px-6 py-4 text-slate-600">{grade.class}</td>
                    <td className="px-6 py-4 text-slate-600">{grade.exam}</td>
                    <td className="px-6 py-4 text-center font-bold font-mono text-lg text-slate-700">
                      {grade.score ?? '--'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        grade.status === 'Tuntas' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : grade.status === 'Remedial' 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {grade.status}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
          <span>Menampilkan {filteredGrades.length} murid</span>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50">Seb</button>
            <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50">Sel</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
