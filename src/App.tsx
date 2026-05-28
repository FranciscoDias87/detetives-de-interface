import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  ShoppingCart, 
  Award, 
  Fingerprint, 
  Presentation, 
  HelpCircle, 
  Play, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  PartyPopper,
  Info,
  CreditCard,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { ALL_BUGS } from './types';
import PhoneShell from './components/PhoneShell';
import PosShell from './components/PosShell';
import CheckoutShell from './components/CheckoutShell';
import DashboardShell from './components/DashboardShell';
import NotebookReport from './components/NotebookReport';
import TeacherPanel from './components/TeacherPanel';

export default function App() {
  const [currentLevel, setCurrentLevel] = useState<1 | 2>(1);
  const [currentScenario, setCurrentScenario] = useState<'intro' | 'social' | 'pdv' | 'checkout' | 'dashboard' | 'report' | 'teacher'>('intro');
  const [teamName, setTeamName] = useState('');
  const [foundBugs, setFoundBugs] = useState<string[]>([]);
  
  // Estados de concertos de UI/UX individuais de cada simulador
  const [isSocialCorrected, setIsSocialCorrected] = useState(false);
  const [isPosCorrected, setIsPosCorrected] = useState(false);
  const [isCheckoutCorrected, setIsCheckoutCorrected] = useState(false);
  const [isDashboardCorrected, setIsDashboardCorrected] = useState(false);

  // Alerta e celebração
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [isCelebrate, setIsCelebrate] = useState(false);

  // Sintetizador Web Audio nativo para feedbacks sonoros (sem dependência externa)
  const playSound = (type: 'success' | 'cheer' | 'click') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      if (type === 'success') {
        // Acorde alegre de detetive decifrando uma pista (C major arpeggio)
        const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
          
          gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.1 + 0.3);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start(ctx.currentTime + idx * 0.1);
          osc.stop(ctx.currentTime + idx * 0.1 + 0.3);
        });
      } else if (type === 'cheer') {
        // Som festivo triunfal para conclusão de todo o jogo
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
          
          gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.08 + 0.5);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + idx * 0.08 + 0.5);
        });
      } else {
        // Clique básico para UI feedback
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(120, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch (e) {
      console.log('Audio Context unsupported in iframe or needs user gesture first.');
    }
  };

  // Lógica quando o aluno acha um bug no protótipo interativo
  const handleFindBug = (bugId: string) => {
    if (foundBugs.includes(bugId)) return;

    const newFound = [...foundBugs, bugId];
    setFoundBugs(newFound);
    playSound('success');

    // Buscar detalhes do bug encontrado
    const matched = ALL_BUGS.find(b => b.id === bugId);
    if (matched) {
      setShowNotification(`🔍 EXPÉCTO DETECTADO! Você identificou "${matched.title}" com sucesso! +100 Pontos.`);
    }

    // Auto sumir notificação depois de um tempo
    setTimeout(() => {
      setShowNotification(null);
    }, 4500);
  };

  // Efeito de celebração ao bater 100% dos erros acumulados
  useEffect(() => {
    if (foundBugs.length === ALL_BUGS.length && ALL_BUGS.length > 0) {
      setIsCelebrate(true);
      playSound('cheer');
    } else {
      setIsCelebrate(false);
    }
  }, [foundBugs]);

  // Desbloquear instantaneamente tudo para fins de estudo dirgido
  const handleUnlockAll = () => {
    setFoundBugs(ALL_BUGS.map(b => b.id));
    playSound('cheer');
  };

  const handleReset = () => {
    setFoundBugs([]);
    setIsSocialCorrected(false);
    setIsPosCorrected(false);
    setIsCheckoutCorrected(false);
    setIsDashboardCorrected(false);
    setIsCelebrate(false);
    setCurrentLevel(1);
    setCurrentScenario('intro');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans select-none antialiased selection:bg-amber-200">
      
      {/* Banner de Celebração de Missão Completa */}
      <AnimatePresence>
        {isCelebrate && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600 text-white p-4 text-center z-50 flex flex-col sm:flex-row items-center justify-center gap-2 font-sans shrink-0 border-b border-emerald-500 relative shadow-md"
          >
            <PartyPopper className="w-6 h-6 animate-bounce" />
            <div className="text-sm">
              <strong className="font-extrabold uppercase">GURUS DO DESIGN DE INTERFACE!</strong> Excelente trabalho, <span className="underline font-bold">{teamName || 'Investigadores Masters'}</span>! Vocês desvendaram os 10 grandes gargalos de interface (Básico & Intermediário) das simulações.
            </div>
            <button 
              onClick={() => setCurrentScenario('report')}
              className="mt-2 sm:mt-0 bg-white text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-50 active:scale-95 transition-all shadow-sm"
            >
              Imprimir Relatório Master
            </button>
            <button 
              onClick={() => setIsCelebrate(false)}
              className="absolute right-3 top-3 text-white/80 hover:text-white"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alerta de pista flutuante */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-55 max-w-sm bg-slate-900 text-white border-l-4 border-amber-500 rounded-xl p-4 shadow-2xl flex items-start gap-3 font-sans"
          >
            <div className="p-1 px-2 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 mt-0.5">
              ACHOU!
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs font-bold leading-snug">{showNotification}</p>
              <button 
                onClick={() => {
                  playSound('click');
                  setCurrentScenario('report');
                  setShowNotification(null);
                }} 
                className="text-[9px] text-amber-400 font-bold hover:underline mt-1.5 block uppercase font-mono tracking-wider"
              >
                Detalhar no Dossiê →
              </button>
            </div>
            <button onClick={() => setShowNotification(null)} className="text-zinc-500 hover:text-zinc-300 text-xs font-bold">
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Topo / Barra de Navegação Superior Integrada de Acordo com o Tema Bento Grid */}
      <header className="bg-slate-900 text-white border-b-4 border-amber-500 sticky top-0 z-40 shrink-0 shadow-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Logo e Nome */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-lg">🕵️‍♂️</span>
            <div className="flex flex-col text-left">
              <h1 className="font-sans font-black text-sm md:text-md text-white tracking-tight leading-none uppercase">
                Detetives de Interface
              </h1>
              <span className="text-[9px] font-mono text-amber-500 uppercase tracking-widest block mt-0.5">Fase 2 Atualizada • Nível Pro</span>
            </div>
          </div>

          {/* Seleção de Níveis / Fases Segmentada */}
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700/60 gap-1 text-[11px] font-bold font-sans">
            <button 
              onClick={() => { playSound('click'); setCurrentLevel(1); setCurrentScenario('intro'); }}
              className={`px-2.5 py-1 rounded-lg transition-all ${currentLevel === 1 ? 'bg-amber-500 text-slate-900 shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Fase 1 <span className="hidden sm:inline">• Iniciante</span>
            </button>
            <button 
              onClick={() => { playSound('click'); setCurrentLevel(2); setCurrentScenario('intro'); }}
              className={`px-2.5 py-1 rounded-lg transition-all ${currentLevel === 2 ? 'bg-amber-500 text-slate-900 shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Fase 2 <span className="hidden sm:inline">• Intermediário</span>
            </button>
          </div>

          {/* Abas Principais de Investigação */}
          <nav className="hidden lg:flex items-center gap-1.5">
            <button 
              onClick={() => { playSound('click'); setCurrentScenario('intro'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                currentScenario === 'intro' ? 'bg-slate-850 text-white border border-slate-700' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              🚀 Início
            </button>

            {currentLevel === 1 ? (
              <>
                <button 
                  onClick={() => { playSound('click'); setCurrentScenario('social'); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    currentScenario === 'social' ? 'bg-sky-500 text-white' : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" /> Caso 1: Rede
                </button>
                <button 
                  onClick={() => { playSound('click'); setCurrentScenario('pdv'); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    currentScenario === 'pdv' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" /> Caso 2: PDV
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => { playSound('click'); setCurrentScenario('checkout'); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    currentScenario === 'checkout' ? 'bg-orange-500 text-white shadow' : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" /> Caso 3: Checkout
                </button>
                <button 
                  onClick={() => { playSound('click'); setCurrentScenario('dashboard'); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    currentScenario === 'dashboard' ? 'bg-purple-650 text-white shadow' : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Caso 4: Métricas
                </button>
              </>
            )}

            <button 
              onClick={() => { playSound('click'); setCurrentScenario('report'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                currentScenario === 'report' ? 'bg-amber-500 text-slate-900 border border-amber-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Fingerprint className="w-3.5 h-3.5" /> Dossiê ({foundBugs.length}/{ALL_BUGS.length})
            </button>
            <button 
              onClick={() => { playSound('click'); setCurrentScenario('teacher'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                currentScenario === 'teacher' ? 'bg-slate-700 text-sky-400' : 'text-slate-350 hover:bg-slate-800'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" /> Manual
            </button>
          </nav>

          {/* Score Counter & Reset */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono font-bold px-2.5 py-1.5 rounded-lg bg-slate-800 text-amber-500 border border-slate-700 shadow flex items-center gap-1">
              🏆 {foundBugs.length * 100} PTS
            </span>
            <button 
              onClick={handleReset}
              className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
              title="Reiniciar Atividade"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Barra de Navegação mobile premium, alinhada com as melhores práticas de mobile first */}
        <div className="flex lg:hidden bg-slate-800 border-t border-slate-700/60 justify-around p-1.5 sticky top-0 z-40 shadow-md">
          <button 
            onClick={() => { playSound('click'); setCurrentScenario('intro'); }}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all grow ${
              currentScenario === 'intro' ? 'text-amber-400 bg-slate-900/50 font-bold' : 'text-slate-400'
            }`}
          >
            <span className="text-base leading-none">🚀</span>
            <span className="text-[9px] font-sans uppercase mt-0.5">Início</span>
          </button>
          
          {currentLevel === 1 ? (
            <>
              <button 
                onClick={() => { playSound('click'); setCurrentScenario('social'); }}
                className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all grow ${
                  currentScenario === 'social' ? 'text-sky-450 bg-slate-900/50 font-bold' : 'text-slate-400'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span className="text-[9px] font-sans uppercase mt-0.5">Caso 1</span>
              </button>
              <button 
                onClick={() => { playSound('click'); setCurrentScenario('pdv'); }}
                className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all grow ${
                  currentScenario === 'pdv' ? 'text-emerald-400 bg-slate-900/50 font-bold' : 'text-slate-400'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="text-[9px] font-sans uppercase mt-0.5">Caso 2</span>
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => { playSound('click'); setCurrentScenario('checkout'); }}
                className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all grow ${
                  currentScenario === 'checkout' ? 'text-orange-400 bg-slate-900/50 font-bold' : 'text-slate-400'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-[9px] font-sans uppercase mt-0.5">Caso 3</span>
              </button>
              <button 
                onClick={() => { playSound('click'); setCurrentScenario('dashboard'); }}
                className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all grow ${
                  currentScenario === 'dashboard' ? 'text-purple-450 bg-slate-900/50 font-bold' : 'text-slate-400'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-[9px] font-sans uppercase mt-0.5">Caso 4</span>
              </button>
            </>
          )}

          <button 
            onClick={() => { playSound('click'); setCurrentScenario('report'); }}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all grow ${
              currentScenario === 'report' ? 'text-amber-550 bg-slate-900/50 font-bold' : 'text-slate-400'
            }`}
          >
            <Fingerprint className="w-4 h-4" />
            <span className="text-[9px] font-sans uppercase mt-0.5">Dossiê</span>
          </button>
          <button 
            onClick={() => { playSound('click'); setCurrentScenario('teacher'); }}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all grow ${
              currentScenario === 'teacher' ? 'text-indigo-400 bg-slate-900/50 font-bold' : 'text-slate-400'
            }`}
          >
            <Presentation className="w-4 h-4" />
            <span className="text-[9px] font-sans uppercase mt-0.5">Mestre</span>
          </button>
        </div>
      </header>

      {/* Conteúdo Dinâmico */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col justify-start">
        
        {currentScenario === 'intro' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-4 items-start max-w-7xl mx-auto w-full font-sans">
            
            {/* HERÔ CARTER / Welcome */}
            <div className="lg:col-span-2 bg-white border-2 border-slate-200 rounded-2xl p-5 md:p-7 shadow-sm flex flex-col gap-5 relative overflow-hidden text-left">
              <div className="absolute right-0 top-0 bg-amber-500/10 text-amber-600 px-4 py-1.5 text-xs font-mono font-bold tracking-wider rounded-bl-xl uppercase border-l border-b border-amber-200/50 hidden sm:block">
                Laboratório UI/UX Ativo
              </div>
              
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-slate-900 text-amber-400 rounded-2xl text-2xl shadow border-2 border-slate-800">🕵️‍♂️</span>
                <div>
                  <span className="text-[9px] font-mono font-extrabold tracking-widest text-amber-600 uppercase">AUDITORIA COMPETITIVA EM GARGALOS</span>
                  <h2 className="font-sans font-black text-xl md:text-2xl lg:text-3xl text-slate-900 tracking-tight leading-none uppercase mt-0.5">
                    Detetives de Interface
                  </h2>
                </div>
              </div>

              <div className="border-t border-slate-100 my-0.5"></div>

              <p className="text-slate-650 text-xs md:text-sm leading-relaxed font-sans mt-1">
                Boas-vindas! Como <strong className="text-slate-900 font-semibold">Auditores de Interface</strong>, vocês analisam protótipos inspirados em cenários reais de mercado. Temos duas fases com níveis de dificuldade distintos:
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-1.5">
                <div onClick={() => setCurrentLevel(1)} className={`flex-1 p-3.5 rounded-xl border-2 transition-all cursor-pointer text-left ${currentLevel === 1 ? 'border-amber-500 bg-amber-50/45' : 'border-slate-150 hover:border-slate-350 bg-slate-50'}`}>
                  <span className="px-1.5 py-0.5 text-[8.5px] font-mono font-extrabold rounded bg-amber-200 text-amber-800 uppercase">FASE 1</span>
                  <h4 className="font-bold text-xs text-slate-850 mt-1 uppercase">Casos Básicos (Iniciante)</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-snug">Problemas fundamentais de contraste, affordance oculta e botão destrutivo em canais comuns.</p>
                </div>

                <div onClick={() => setCurrentLevel(2)} className={`flex-1 p-3.5 rounded-xl border-2 transition-all cursor-pointer text-left ${currentLevel === 2 ? 'border-amber-500 bg-amber-50/45' : 'border-slate-150 hover:border-slate-350 bg-slate-50'}`}>
                  <span className="px-1.5 py-0.5 text-[8.5px] font-mono font-extrabold rounded bg-purple-200 text-purple-800 uppercase">FASE 2</span>
                  <h4 className="font-bold text-xs text-slate-850 mt-1 uppercase">Intermediário (Gargalos de Conversão)</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-snug">Erros nocivos ao faturamento: placeholders perversos, falta de validações reativas e quebra de filtros.</p>
                </div>
              </div>
              
              {/* Identificação da Equipe */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-1 flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full text-left">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-slate-500 block mb-1">Equipe / Aluno auditor:</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Ana Clara e Marcos (Grupo Beta)" 
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 transition-all font-sans"
                  />
                </div>
                <button 
                  onClick={() => {
                    playSound('click');
                    if (currentLevel === 1) {
                      setCurrentScenario('social');
                    } else {
                      setCurrentScenario('checkout');
                    }
                  }}
                  className="w-full md:w-auto shrink-0 bg-slate-905 hover:bg-slate-850 active:scale-95 text-white bg-slate-900 rounded-lg px-5 py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider"
                >
                  Iniciar Investigação <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>

            {/* BARRA LATERAL STATUS BENTO */}
            <div className="flex flex-col gap-6 lg:col-span-1">
              
              {/* Card de Scoreboard */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 border-2 border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[170px] text-left">
                <div className="absolute right-3 top-3 opacity-10">
                  <Award className="w-20 h-20 text-amber-400" />
                </div>
                <div>
                  <span className="text-[8px] font-mono tracking-widest text-amber-400 uppercase">CRONOLOGIA UX</span>
                  <h3 className="font-sans font-black text-md text-white mt-0.5 uppercase">Placar Geral</h3>
                </div>
                <div className="flex justify-between items-baseline mt-4">
                  <div>
                    <span className="text-3xl font-mono font-black text-amber-400">
                      {foundBugs.length * 100}
                    </span>
                    <span className="text-xs text-slate-400 font-mono italic ml-1">pts</span>
                  </div>
                  <div className="text-right">
                    <span className="text-md font-mono font-bold text-white">
                      {foundBugs.length} / {ALL_BUGS.length}
                    </span>
                    <p className="text-[8px] text-slate-400 uppercase tracking-widest font-mono font-bold">Bugs Descobertos</p>
                  </div>
                </div>
                <div className="border-t border-slate-800 pt-2.5 mt-3 text-[10px] text-slate-450 flex justify-between items-center font-mono">
                  <span>Equipe: {teamName || "Auditor Júnior"}</span>
                  <span className="text-amber-500">CONECTADO ✔</span>
                </div>
              </div>

              {/* Manual Curto */}
              <div className="bg-white border-2 border-slate-200 text-left rounded-2xl p-5 shadow-sm flex flex-col gap-2.5">
                <span className="text-xs font-mono font-extrabold tracking-widest text-indigo-600 uppercase flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-indigo-500" /> Dicas Rápidas
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                  Alterne no topo entre a <strong>Fase 1 (Iniciante)</strong> e a nova <strong>Fase 2 (Intermediária)</strong>. Investigue os erros na tela para desbloquear o dossiê detalhado.
                </p>
                <button 
                  onClick={() => { playSound('click'); setCurrentScenario('teacher'); }}
                  className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold transition-all mt-1 hover:underline flex items-center gap-0.5 font-mono uppercase"
                >
                  Manual do Professor completo →
                </button>
              </div>
            </div>

            {/* CASO GRID PREVIEWS (BASEADO NO FILTRO SELECIONADO ATIVO) */}
            <div className="lg:col-span-3 pb-6 text-left">
              <span className="text-[10px] font-mono font-extrabold tracking-widest text-slate-500 uppercase block mb-3 pl-1">
                CATÁLOGO DE CASOS • {currentLevel === 1 ? 'FASE 1' : 'FASE 2'} ATIVO
              </span>

              {currentLevel === 1 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Caso 1: Rede */}
                  <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-sky-300 transition-all duration-300 group">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-xl p-2 bg-sky-50 rounded-xl">📱</span>
                        <span className="text-[9px] font-mono tracking-wider font-extrabold border border-sky-200 text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full uppercase">
                          Caso 1 • Social UI
                        </span>
                      </div>
                      <h4 className="font-sans font-black text-mg text-slate-900 mt-4 group-hover:text-sky-600 transition-colors uppercase">
                        Rede Social: SocialCam
                      </h4>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        Um concorrente do Instagram com queda drástica de adesão devido a problemas crônicos de acessibilidade cromática e affordance invisível.
                      </p>
                    </div>
                    <div className="border-t border-slate-100 pt-4 mt-6 flex justify-between items-center">
                      <span className="text-[10px] font-mono text-slate-400">Encontrados: {foundBugs.filter(id => id.startsWith('social-')).length}/3</span>
                      <button 
                        onClick={() => { playSound('click'); setCurrentScenario('social'); }}
                        className="bg-slate-50 hover:bg-sky-50 text-slate-800 hover:text-sky-800 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border border-slate-250 hover:border-sky-300 cursor-pointer"
                      >
                        Investigar Caso 1
                      </button>
                    </div>
                  </div>

                  {/* Caso 2: PDV */}
                  <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-all duration-300 group">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-xl p-2 bg-emerald-50 rounded-xl">🛒</span>
                        <span className="text-[9px] font-mono tracking-wider font-extrabold border border-emerald-200 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">
                          Caso 2 • PDV Terminal
                        </span>
                      </div>
                      <h4 className="font-sans font-black text-mg text-slate-900 mt-4 group-hover:text-emerald-600 transition-colors uppercase">
                        Frente de Caixa: SuperCaixa
                      </h4>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        Sistema corporativo onde cliques repetitivos somam atrasos operacionais perigosos e botões de pânico sem cores corretas causam perda de dados.
                      </p>
                    </div>
                    <div className="border-t border-slate-100 pt-4 mt-6 flex justify-between items-center">
                      <span className="text-[10px] font-mono text-slate-400">Encontrados: {foundBugs.filter(id => id.startsWith('pdv-')).length}/2</span>
                      <button 
                        onClick={() => { playSound('click'); setCurrentScenario('pdv'); }}
                        className="bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border border-slate-250 hover:border-emerald-300 cursor-pointer"
                      >
                        Investigar Caso 2
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Caso 3: Checkout */}
                  <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-orange-300 transition-all duration-300 group">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-xl p-2 bg-orange-50 rounded-xl">💳</span>
                        <span className="text-[9px] font-mono tracking-wider font-extrabold border border-orange-200 text-orange-800 bg-orange-50 px-2.5 py-1 rounded-full uppercase">
                          Caso 3 • E-Commerce Checkout
                        </span>
                      </div>
                      <h4 className="font-sans font-black text-mg text-slate-900 mt-4 group-hover:text-orange-600 transition-colors uppercase">
                        Gargalo de Conversão: VIP-TRAVEL
                      </h4>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        Nível Intermediário. Formulário de pagamento perversamente projetado com botões explosivos e ocultação criminosa de diretrizes no preenchimento.
                      </p>
                    </div>
                    <div className="border-t border-slate-100 pt-4 mt-6 flex justify-between items-center">
                      <span className="text-[10px] font-mono text-slate-400">Encontrados: {foundBugs.filter(id => id.startsWith('checkout-')).length}/3</span>
                      <button 
                        onClick={() => { playSound('click'); setCurrentLevel(2); setCurrentScenario('checkout'); }}
                        className="bg-slate-50 hover:bg-orange-50 text-slate-800 hover:text-orange-850 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border border-slate-250 hover:border-orange-300 cursor-pointer"
                      >
                        Investigar Caso 3
                      </button>
                    </div>
                  </div>

                  {/* Caso 4: Dashboard */}
                  <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-purple-300 transition-all duration-300 group">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-xl p-2 bg-purple-50 rounded-xl">📊</span>
                        <span className="text-[9px] font-mono tracking-wider font-extrabold border border-purple-200 text-purple-800 bg-purple-50 px-2.5 py-1 rounded-full uppercase">
                          Caso 4 • SaaS Panel
                        </span>
                      </div>
                      <h4 className="font-sans font-black text-mg text-slate-900 mt-4 group-hover:text-purple-650 transition-colors uppercase">
                        Painel Executivo: XFIN ANALYTICS
                      </h4>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        Nível Intermediário. Gráficos monocromáticos enganosos e comportamento reativo que sabota a memória de filtros do tomador de decisão.
                      </p>
                    </div>
                    <div className="border-t border-slate-100 pt-4 mt-6 flex justify-between items-center">
                      <span className="text-[10px] font-mono text-slate-400">Encontrados: {foundBugs.filter(id => id.startsWith('dash-')).length}/2</span>
                      <button 
                        onClick={() => { playSound('click'); setCurrentLevel(2); setCurrentScenario('dashboard'); }}
                        className="bg-slate-50 hover:bg-purple-50 text-slate-850 hover:text-purple-800 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border border-slate-250 hover:border-purple-300 cursor-pointer"
                      >
                        Investigar Caso 4
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {currentScenario === 'social' && (
          <PhoneShell 
            foundBugs={foundBugs}
            onFindBug={handleFindBug}
            isCorrected={isSocialCorrected}
            setIsCorrected={setIsSocialCorrected}
          />
        )}

        {currentScenario === 'pdv' && (
          <PosShell 
            foundBugs={foundBugs}
            onFindBug={handleFindBug}
            isCorrected={isPosCorrected}
            setIsCorrected={setIsPosCorrected}
          />
        )}

        {currentScenario === 'checkout' && (
          <CheckoutShell 
            foundBugs={foundBugs}
            onFindBug={handleFindBug}
            isCorrected={isCheckoutCorrected}
            setIsCorrected={setIsCheckoutCorrected}
          />
        )}

        {currentScenario === 'dashboard' && (
          <DashboardShell 
            foundBugs={foundBugs}
            onFindBug={handleFindBug}
            isCorrected={isDashboardCorrected}
            setIsCorrected={setIsDashboardCorrected}
          />
        )}

        {currentScenario === 'report' && (
          <NotebookReport 
            foundBugs={foundBugs}
            teamName={teamName}
            setTeamName={setTeamName}
            onReset={handleReset}
          />
        )}

        {currentScenario === 'teacher' && (
          <TeacherPanel 
            onUnlockAll={handleUnlockAll}
            foundBugsCount={foundBugs.length}
          />
        )}

      </main>

      {/* Footer Geral */}
      <footer className="bg-white border-t border-slate-250 py-4 h-12 text-center text-[10px] text-slate-500 font-mono flex items-center justify-center shrink-0">
        <span>© 2026 Detetives de Interface. Ferramenta para Sala de Aula Teórico/Ativa.</span>
      </footer>
    </div>
  );
}
