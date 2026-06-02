import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  BrainCircuit, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  FileEdit, 
  ArrowRightCircle,
  Play,
  RotateCcw
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state: any) => state.accessToken);
  const [selectedTopic, setSelectedTopic] = useState<'termodinamika' | 'fotosintesis' | 'tatasurya'>('termodinamika');
  const [simulatedStatus, setSimulatedStatus] = useState<'idle' | 'running' | 'done'>('idle');
  const [simulatedThink, setSimulatedThink] = useState('');
  const [simulatedOutput, setSimulatedOutput] = useState('');

  const demoData = {
    termodinamika: {
      think: `[ALUR PIKIR AI]
1. Menganalisis topik: "Hukum Termodinamika"
2. Mengambil standar kompetensi Fisika Kelas XI.
3. Merancang soal pilihan ganda bergradasi kesulitan.
4. Menyusun kunci jawaban beserta pembahasan analitis.
5. Selesai. Menampilkan preview draf soal...`,
      output: `### Soal 1: Konsep Keseimbangan Termal
Bila dua sistem berada dalam keseimbangan termal dengan sistem ketiga, maka mereka saling berada dalam keseimbangan termal satu sama lain. Pernyataan ini merupakan bunyi dari...
*   A. Hukum I Termodinamika
*   B. Hukum II Termodinamika
*   C. Hukum Ke-0 Termodinamika
*   D. Hukum Carnot

**Kunci Jawaban: C**
*Pembahasan: Hukum ke-0 Termodinamika mendefinisikan konsep temperatur secara operasional melalui keseimbangan termal.*`
    },
    fotosintesis: {
      think: `[ALUR PIKIR AI]
1. Menganalisis topik: "Fotosintesis & Reaksi Terang"
2. Memetakan sub-topik organel sel kloroplas.
3. Merancang pertanyaan pilihan ganda tentang fotolisis air.
4. Menyusun kunci jawaban beserta penjelasan mekanisme tilakoid.
5. Selesai. Menampilkan preview draf soal...`,
      output: `### Soal 1: Reaksi Terang Fotosintesis
Pada reaksi terang fotosintesis, pemecahan molekul air (fotolisis) menghasilkan oksigen, elektron, dan ion hidrogen. Proses fotolisis air ini terjadi pada bagian...
*   A. Stroma
*   B. Membran Tilakoid (Grana)
*   C. Sitoplasma
*   D. Ruang Antar Membran

**Kunci Jawaban: B**
*Pembahasan: Reaksi terang yang bergantung pada cahaya matahari terjadi di grana/membran tilakoid.*`
    },
    tatasurya: {
      think: `[ALUR PIKIR AI]
1. Menganalisis topik: "Sistem Tata Surya & Planet Jovian"
2. Mengambil materi IPA Terpadu.
3. Membuat soal klasifikasi planet dalam dan planet luar.
4. Menyusun opsi pengecoh yang logis bagi murid.
5. Selesai. Menampilkan preview draf soal...`,
      output: `### Soal 1: Karakteristik Planet Luar
Kelompok planet berikut ini yang seluruhnya termasuk planet luar (Jovian) dalam sistem Tata Surya kita adalah...
*   A. Merkurius, Venus, Bumi, Mars
*   B. Jupiter, Saturnus, Uranus, Neptunus
*   C. Mars, Jupiter, Saturnus, Uranus
*   D. Bumi, Mars, Jupiter, Saturnus

**Kunci Jawaban: B**
*Pembahasan: Planet luar (Jovian) adalah planet yang orbitnya berada di luar sabuk asteroid.*`
    }
  };

  const startSimulation = (topicKey: 'termodinamika' | 'fotosintesis' | 'tatasurya') => {
    setSelectedTopic(topicKey);
    setSimulatedStatus('running');
    setSimulatedThink('');
    setSimulatedOutput('');

    const thinkText = demoData[topicKey].think;
    const outputText = demoData[topicKey].output;
    
    let currentThinkIndex = 0;
    const thinkInterval = setInterval(() => {
      if (currentThinkIndex <= thinkText.length) {
        setSimulatedThink(thinkText.substring(0, currentThinkIndex));
        currentThinkIndex += 3;
      } else {
        clearInterval(thinkInterval);
        setSimulatedThink(thinkText); // ensure full text is set
        
        let currentOutputIndex = 0;
        const outputInterval = setInterval(() => {
          if (currentOutputIndex <= outputText.length) {
            setSimulatedOutput(outputText.substring(0, currentOutputIndex));
            currentOutputIndex += 4;
          } else {
            clearInterval(outputInterval);
            setSimulatedOutput(outputText); // ensure full text is set
            setSimulatedStatus('done');
          }
        }, 15);
      }
    }, 10);
  };

  const handleCTAClick = () => {
    if (accessToken) {
      navigate('/dashboard/buat-soal');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-x-hidden relative">
      {/* Background Gradients/Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-[150px] pointer-events-none" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/60 transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-outfit font-bold text-xl text-slate-800">
                GuruPintar
              </span>
              <span className="ml-1 px-1.5 py-0.5 rounded bg-indigo-50 text-[10px] text-indigo-700 font-bold border border-indigo-100 uppercase tracking-widest align-middle">AI</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <a href="#fitur" className="hover:text-indigo-600 transition-colors">Fitur Utama</a>
            <a href="#simulasi" className="hover:text-indigo-600 transition-colors">Simulasi Live</a>
            <a href="#alur-kerja" className="hover:text-indigo-600 transition-colors">Cara Kerja</a>
          </nav>

          <div>
            <button 
              onClick={handleCTAClick}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all bg-indigo-600 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-200 text-white active:scale-95 flex items-center gap-2"
            >
              {accessToken ? 'Masuk Dashboard' : 'Mulai Sekarang'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 text-center lg:text-left space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Platform Pembuat Soal Ujian Cerdas</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-outfit font-bold text-4xl sm:text-5xl lg:text-6xl text-slate-900 leading-tight tracking-tight"
            >
              Susun Soal Kuis Sekolah{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Lebih Efisien dengan AI
              </span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Kurangi beban administrasi Anda dalam menyusun latihan soal. Gunakan GuruPintar AI untuk membuat draf soal terstruktur beserta kunci jawaban dan pemantauan nilai otomatis.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4"
            >
              <button 
                onClick={handleCTAClick}
                className="px-8 py-4 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Coba GuruPintar AI
                <ArrowRightCircle className="w-5 h-5" />
              </button>
              <a 
                href="#simulasi"
                className="px-8 py-4 rounded-xl font-bold bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition-all flex items-center justify-center gap-2"
              >
                Coba Simulasi Pembuatan
              </a>
            </motion.div>

            {/* Social Proof Mini */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-8 flex flex-wrap justify-center lg:justify-start gap-6 text-xs text-slate-400 font-semibold"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Tanpa Ribet</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Alur AI Transparan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Evaluasi Nilai Siswa</span>
              </div>
            </motion.div>
          </div>

          {/* Clean Dashboard Preview Card */}
          <div className="flex-1 w-full lg:w-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative p-2 rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden group"
            >
              <div className="bg-slate-50 p-4 rounded-[20px] border border-slate-100 flex flex-col space-y-4">
                {/* Simulated Window Chrome */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex space-x-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-400" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">gurupintar.ai/dashboard</span>
                  <div className="w-8" />
                </div>

                {/* Dashboard Static Elements Mockup matching Nilai & Buat Soal */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center space-x-2.5">
                    <FileEdit className="w-5 h-5 text-indigo-600" />
                    <div>
                      <span className="block text-[10px] text-slate-400">Modul</span>
                      <span className="font-bold text-xs text-slate-700">Pembuat Soal</span>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center space-x-2.5">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                    <div>
                      <span className="block text-[10px] text-slate-400">Evaluasi</span>
                      <span className="font-bold text-xs text-slate-700">Tabel Nilai Siswa</span>
                    </div>
                  </div>
                </div>

                {/* Mockup screen showing live generating and quiz preview */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 min-h-[160px] flex flex-col justify-between shadow-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                      <span className="text-[11px] font-semibold text-indigo-600">Alur Pikir AI Aktif</span>
                    </div>
                    <div className="h-3 w-3/4 bg-slate-100 rounded" />
                    <div className="h-3 w-1/2 bg-slate-100 rounded" />
                  </div>
                  <div className="border-t border-slate-100 pt-3 mt-4 flex justify-between items-center text-[11px] text-slate-400">
                    <span>Siswa: <b>Budi Santoso</b></span>
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">Nilai: 85 (Tuntas)</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="fitur" className="py-20 bg-white border-y border-slate-200/60 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="font-outfit font-bold text-3xl text-slate-900">
              Dua Fitur Utama GuruPintar
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Membantu guru menyusun ujian dan melakukan rekapitulasi nilai secara akurat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-slate-50 border border-slate-200/60 p-8 rounded-2xl space-y-4 hover:border-indigo-400 hover:bg-white transition-all group">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 font-outfit">Pembuat Soal & Alur Pikir AI (Live)</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Buat kuis baru sesuai dengan topik materi pelajaran Anda. Pantau langsung logika berpikir AI secara real-time dari panel penalaran saat soal sedang disusun.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 border border-slate-200/60 p-8 rounded-2xl space-y-4 hover:border-indigo-400 hover:bg-white transition-all group">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 font-outfit">Tabel Nilai & Hasil Ujian Siswa</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Kelola nilai hasil pengerjaan kuis siswa secara otomatis. Pantau nama, kelas, mata pelajaran, nilai ujian, serta status kelulusan (Tuntas/Remedial).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Simulator Section (Live AI Experience) */}
      <section id="simulasi" className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h2 className="font-outfit font-bold text-3xl text-slate-900">
                Uji Coba Simulator Pembuatan Soal
              </h2>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                Pilih topik di bawah ini dan klik tombol untuk menyaksikan simulasi alur pikir AI saat merancang bank soal berkualitas tinggi.
              </p>

              {/* Topic Selectors */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => startSimulation('termodinamika')}
                  className={`px-5 py-3 rounded-xl font-medium text-sm transition-all border text-left flex items-center justify-between ${
                    selectedTopic === 'termodinamika' 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>🔥 Hukum Termodinamika</span>
                </button>
                <button 
                  onClick={() => startSimulation('fotosintesis')}
                  className={`px-5 py-3 rounded-xl font-medium text-sm transition-all border text-left flex items-center justify-between ${
                    selectedTopic === 'fotosintesis' 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>🍃 Fotosintesis Klorofil</span>
                </button>
                <button 
                  onClick={() => startSimulation('tatasurya')}
                  className={`px-5 py-3 rounded-xl font-medium text-sm transition-all border text-left flex items-center justify-between ${
                    selectedTopic === 'tatasurya' 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>🪐 Planet Tata Surya</span>
                </button>
              </div>

              {simulatedStatus === 'idle' ? (
                <button
                  onClick={() => startSimulation(selectedTopic)}
                  className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold rounded-xl transition-all flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Mulai Simulasi Generate ✨
                </button>
              ) : (
                <button
                  onClick={() => startSimulation(selectedTopic)}
                  className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold rounded-xl transition-all flex items-center gap-2 border border-slate-200"
                >
                  <RotateCcw className="w-4 h-4" />
                  Generate Ulang 🔁
                </button>
              )}
            </div>

            {/* Live Panels Container */}
            <div className="flex-1 w-full flex flex-col md:flex-row gap-4 min-h-[350px]">
              {/* Live Thinking */}
              <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
                <div className="px-4 py-3 bg-slate-950 border-b border-slate-850 flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-slate-400 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${simulatedStatus === 'running' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                    Alur Pikir AI (Live)
                  </span>
                </div>
                <div className="flex-1 p-4 font-mono text-[11px] text-emerald-400/90 leading-relaxed overflow-y-auto whitespace-pre-wrap">
                  {simulatedThink || <span className="text-slate-600 italic">Pilih topik dan tekan tombol Mulai Simulasi...</span>}
                </div>
              </div>

              {/* Output Preview */}
              <div className="flex-1 flex flex-col bg-white text-slate-800 border border-slate-250 rounded-2xl overflow-hidden shadow-md">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Draft Soal (Preview)</span>
                </div>
                <div className="flex-1 p-4 text-xs leading-relaxed overflow-y-auto whitespace-pre-wrap font-sans text-slate-700">
                  {simulatedOutput ? (
                    <div>
                      {simulatedOutput}
                      {simulatedStatus === 'running' && <span className="inline-block w-1.5 h-3 ml-1 bg-indigo-600 animate-pulse align-middle" />}
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">Hasil generate kuis akan muncul di sini...</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="alur-kerja" className="py-20 bg-slate-100/50 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="font-outfit font-bold text-3xl text-slate-900">
              Proses Kerja yang Sederhana
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Kemudahan menyusun evaluasi materi sekolah dalam hitungan detik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 border border-indigo-150 flex items-center justify-center text-indigo-600 text-xl font-bold font-outfit">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-800">Masukkan Topik</h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                Ketikkan materi / topik mata pelajaran sekolah yang ingin dijadikan kuis ujian.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 border border-indigo-150 flex items-center justify-center text-indigo-600 text-xl font-bold font-outfit">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-800">Lihat Alur Pikir AI</h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                Saksikan transparansi pembentukan butir soal secara real-time dari pemikiran cerdas AI.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 border border-indigo-150 flex items-center justify-center text-indigo-600 text-xl font-bold font-outfit">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-800">Evaluasi & Rekap Nilas</h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                Soal diujikan ke murid dan rekapitulasi nilainya terkelola secara rapi di tabel nilai.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Section */}
      <section className="py-24 px-6 text-center relative overflow-hidden bg-indigo-950 text-white">
        <div className="absolute inset-0 bg-indigo-900/40 pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <h2 className="font-outfit font-bold text-4xl sm:text-5xl text-white tracking-tight leading-tight">
            Optimalkan Waktu Pembuatan Soal Kuis Sekarang
          </h2>
          <p className="text-indigo-200 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Bergabunglah dan tingkatkan efektivitas pembelajaran di kelas Anda dengan asisten digital pembuat soal GuruPintar AI.
          </p>
          <div className="flex justify-center">
            <button 
              onClick={handleCTAClick}
              className="px-8 py-4 bg-white text-indigo-950 font-bold rounded-xl text-base shadow-xl shadow-white/5 hover:bg-slate-50 hover:shadow-2xl transition-all active:scale-95 flex items-center gap-2"
            >
              Mulai Gunakan Secara Gratis
              <ArrowRight className="w-5 h-5 text-indigo-600" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-slate-200 text-slate-400 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center">
              <BrainCircuit className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-slate-700 font-outfit">GuruPintar AI</span>
          </div>
          <p>© {new Date().getFullYear()} GuruPintar AI. Hak Cipta Dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
