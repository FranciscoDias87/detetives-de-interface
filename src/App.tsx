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
  Info
} from 'lucide-react';
import { ALL_BUGS, INSTAGRAM_BUGS, PDV_BUGS } from './types';
import PhoneShell from './components/PhoneShell';
import PosShell from './components/PosShell';
import NotebookReport from './components/NotebookReport';
import TeacherPanel from './components/TeacherPanel';

export default function App() {
  const [currentScenario, setCurrentScenario] = useState<'intro' | 'social' | 'pdv' | 'report' | 'teacher'>('intro');
  const [teamName, setTeamName] = useState('');
  const [foundBugs, setFoundBugs] = useState<string[]>([]);
  const [isSocialCorrected, setIsSocialCorrected] = useState(false);
  const [isPosCorrected, setIsPosCorrected] = useState(false);
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

  // Efeito de celebração ao bater 100% dos erros
  useEffect(() => {
    if (foundBugs.length === ALL_BUGS.length && ALL_BUGS.length > 0) {
      setIsCelebrate(true);
      playSound('cheer');
    } else {
      setIsCelebrate(false);
    }
  }, [foundBugs]);

  // Desbloquear instantaneamente tudo para fins de lousa/professor
  const handleUnlockAll = () => {
    setFoundBugs(ALL_BUGS.map(b => b.id));
    playSound('cheer');
  };

  const handleReset = () => {
    setFoundBugs([]);
    setIsSocialCorrected(false);
    setIsPosCorrected(false);
    setIsCelebrate(false);
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
              <strong className="font-extrabold uppercase">Dossiê 100% Resolvido!</strong> Excelente trabalho, <span className="underline font-bold">{teamName || 'Mestre Investigador'}</span>! Vocês identificaram as 5 grandes falhas de interface e estão prontos para o mercado real.
            </div>
            <button 
              onClick={() => setCurrentScenario('report')}
              className="mt-2 sm:mt-0 bg-white text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-50 active:scale-95 transition-all shadow-sm"
            >
              Ver e Imprimir Relatório Final
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
            className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900 text-white border-l-4 border-emerald-500 rounded-xl p-4 shadow-2xl flex items-start gap-3 font-sans"
          >
            <div className="p-1 px-2.5 rounded text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 mt-0.5">
              OK
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold leading-snug">{showNotification}</p>
              <button 
                onClick={() => {
                  playSound('click');
                  setCurrentScenario('report');
                  setShowNotification(null);
                }} 
                className="text-[10px] text-emerald-400 font-bold hover:underline mt-1.5 block uppercase font-mono tracking-wider"
              >
                Escrever no Dossiê →
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
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-1 rounded-md text-slate-900 font-extrabold px-2 text-xs uppercase tracking-tighter">
              Nível 01
            </div>
            <div>
              <h1 className="font-sans font-black text-sm md:text-lg text-white tracking-tight leading-none uppercase flex items-center gap-1.5">
                Detetives de Interface
              </h1>
              <span className="text-[9px] font-mono text-amber-500 uppercase tracking-widest block mt-0.5">ID: CLS-2026-UX • Investigação Ativa</span>
            </div>
          </div>

          {/* Abas Principais de Investigação */}
          <nav className="hidden lg:flex items-center gap-1.5">
            <button 
              onClick={() => { playSound('click'); setCurrentScenario('intro'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentScenario === 'intro' ? 'bg-amber-500 text-slate-900' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              🚀 Início
            </button>
            <button 
              onClick={() => { playSound('click'); setCurrentScenario('social'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentScenario === 'social' ? 'bg-sky-500 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" /> Caso 1: Rede Social
            </button>
            <button 
              onClick={() => { playSound('click'); setCurrentScenario('pdv'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentScenario === 'pdv' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" /> Caso 2: Ponto de Venda
            </button>
            <button 
              onClick={() => { playSound('click'); setCurrentScenario('report'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-grow ${
                currentScenario === 'report' ? 'bg-amber-400 text-slate-900' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Fingerprint className="w-3.5 h-3.5" /> Dossiê ({foundBugs.length}/5)
            </button>
            <button 
              onClick={() => { playSound('click'); setCurrentScenario('teacher'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentScenario === 'teacher' ? 'bg-slate-700 text-sky-450' : 'text-slate-350 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" /> Professor
            </button>
          </nav>

          {/* Score Counter & Reset */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono font-bold px-2.5 py-1.5 rounded-lg bg-slate-800 text-amber-500 border border-slate-700 shadow-sm flex items-center gap-1.5">
              🏆 {foundBugs.length * 100} PTS
            </span>
            <button 
              onClick={handleReset}
              className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-850 transition-colors"
              title="Reiniciar Atividade"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Barra de Navegação mobile compacta por causa do Iframe */}
        <div className="flex lg:hidden overflow-x-auto gap-1 px-4 py-2 bg-slate-100 border-t border-slate-200 justify-start no-scrollbar">
          <button 
            onClick={() => { playSound('click'); setCurrentScenario('intro'); }}
            className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 transition-all ${
              currentScenario === 'intro' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            🚀 Início
          </button>
          <button 
            onClick={() => { playSound('click'); setCurrentScenario('social'); }}
            className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 transition-all ${
              currentScenario === 'social' ? 'bg-sky-500 text-white' : 'text-slate-600'
            }`}
          >
            📱 Caso 1: Rede
          </button>
          <button 
            onClick={() => { playSound('click'); setCurrentScenario('pdv'); }}
            className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 transition-all ${
              currentScenario === 'pdv' ? 'bg-emerald-600 text-white' : 'text-slate-600'
            }`}
          >
            🛒 Caso 2: PDV
          </button>
          <button 
            onClick={() => { playSound('click'); setCurrentScenario('report'); }}
            className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 transition-all ${
              currentScenario === 'report' ? 'bg-amber-500 text-white' : 'text-slate-600'
            }`}
          >
            📂 Dossiê ({foundBugs.length})
          </button>
          <button 
            onClick={() => { playSound('click'); setCurrentScenario('teacher'); }}
            className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 transition-all ${
              currentScenario === 'teacher' ? 'bg-slate-800 text-sky-400' : 'text-slate-600'
            }`}
          >
            👨‍🏫 Mestre
          </button>
        </div>
      </header>

      {/* Conteúdo Dinâmico */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col justify-start">
        
        {currentScenario === 'intro' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6 items-start max-w-7xl mx-auto w-full font-sans">
            {/* HERÔ CARTER: 2 cols on wide screen */}
            <div className="lg:col-span-2 bg-white border-2 border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 bg-amber-500/10 text-amber-600 px-4 py-1.5 text-xs font-mono font-bold tracking-wider rounded-bl-xl uppercase border-l border-b border-amber-200/50">
                Atividade Acadêmica ativa
              </div>
              <div className="flex items-center gap-4">
                <span className="p-3 bg-slate-900 text-amber-400 rounded-2xl text-3xl shadow-md border-2 border-slate-800">🕵️‍♂️</span>
                <div>
                  <span className="text-[10px] font-mono font-extrabold tracking-widest text-amber-600 uppercase">MISSOES DE DESIGN COMERCIAL</span>
                  <h2 className="font-sans font-black text-2xl md:text-3xl lg:text-4xl text-slate-900 tracking-tight leading-none uppercase mt-1">
                    Detetives de Interface
                  </h2>
                </div>
              </div>

              <div className="border-t border-slate-100 my-1"></div>

              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-sans">
                Sejam bem-vindos à simulação! Vocês assumem o papel de <strong className="text-slate-950 font-semibold">Auditores de Design Júnior</strong>. Nossos analistas seniores prepararam protótipos de mercado propositalmente infestados com deslizes caros de <strong className="text-amber-600">UI (Estética)</strong> e <strong className="text-emerald-600">UX (Usabilidade)</strong>.
              </p>
              
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                Naveguem pelos casos práticos abaixo. Identifiquem as irregularidades tocando neles diretamente nas telas e, em seguida, consultem a aba <strong>Dossiê</strong> para embasar tecnicamente seus relatórios e calcular o impacto financeiro do erro!
              </p>

              {/* Configuração de Equipe */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mt-2 flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full text-left">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block mb-1.5">Identificação do Grupo / Detetive:</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Grupo Alfa (Alice e Pedro)" 
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full bg-white border border-slate-250 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-950 transition-all font-sans"
                  />
                </div>
                <button 
                  onClick={() => {
                    playSound('click');
                    setCurrentScenario('social');
                  }}
                  className="w-full md:w-auto shrink-0 bg-slate-950 hover:bg-slate-850 active:scale-95 text-white rounded-lg px-6 py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 font-sans uppercase tracking-wider shadow"
                >
                  Iniciar o Caso 1 <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>

            {/* BARRA STATUS BENTO */}
            <div className="flex flex-col gap-6 lg:col-span-1">
              {/* Card de Scoreboard */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 border-2 border-slate-800 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[180px]">
                <div className="absolute right-3 top-3 opacity-15">
                  <Award className="w-24 h-24 text-amber-400" />
                </div>
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-amber-400 uppercase">SUA CRONOLOGIA</span>
                  <h3 className="font-sans font-black text-xl text-white mt-1 uppercase">Placar da Operação</h3>
                </div>
                <div className="flex justify-between items-baseline mt-4">
                  <div>
                    <span className="text-3xl font-mono font-black text-amber-400">
                      {foundBugs.length * 100}
                    </span>
                    <span className="text-xs text-slate-400 font-mono italic ml-1">pts</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-mono font-bold text-white">
                      {foundBugs.length} / 5
                    </span>
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">Bugs Coletados</p>
                  </div>
                </div>
                <div className="border-t border-slate-800 pt-3 mt-4 text-[11px] text-slate-400 flex justify-between items-center font-mono">
                  <span>Equipe: {teamName || "Auditores Anônimos"}</span>
                  <span className="text-amber-400">Ativa ✔</span>
                </div>
              </div>

              {/* Manual Curto */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                <span className="text-xs font-mono font-extrabold tracking-widest text-indigo-600 uppercase flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-indigo-500" /> Manual Didático Rápido
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  Use os controles no topo para alternar entre os cenários interativos. Cada bug encontrado destrava um mistério do Dossiê, fornecendo embasamento prático essencial para relatórios de produto reais!
                </p>
                <button 
                  onClick={() => { playSound('click'); setCurrentScenario('teacher'); }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold transition-all text-left mt-1 hover:underline flex items-center gap-1 font-mono uppercase"
                >
                  Manual do Professor completo →
                </button>
              </div>
            </div>

            {/* CASO 1 & 2 GRID PREVIEWS */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Celular / Social */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-sky-300 transition-all duration-300 group">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-2xl p-2 bg-sky-50 rounded-xl">📱</span>
                    <span className="text-[10px] font-mono tracking-wider font-extrabold border border-sky-200 text-sky-750 bg-sky-50 px-2.5 py-1 rounded-full uppercase">
                      Cenário 1 • Social
                    </span>
                  </div>
                  <h4 className="font-sans font-extrabold text-lg text-slate-900 mt-4 group-hover:text-sky-600 transition-colors uppercase">
                    Rede Social: SocialCam
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Vocês foram contratados para avaliar um concorrente em ascensão. No entanto, o app está sofrendo com quedas severas de engajamento decorrentes de erros terríveis de acessibilidade por contraste, botões desproporcionais e feedback fantasma.
                  </p>
                </div>
                <div className="border-t border-slate-100 pt-4 mt-6 flex justify-between items-center">
                  <span className="text-[10.5px] font-mono text-slate-400">Progresso: {foundBugs.filter(id => id.startsWith('ig-')).length}/3 encontrados</span>
                  <button 
                    onClick={() => { playSound('click'); setCurrentScenario('social'); }}
                    className="bg-slate-50 group-hover:bg-sky-50 text-slate-800 group-hover:text-sky-800 px-4 py-2 rounded-lg text-xs font-bold font-sans transition-all flex items-center gap-1.5 border border-slate-200 group-hover:border-sky-200"
                  >
                    Investigar Protótipo →
                  </button>
                </div>
              </div>

              {/* POS / Ponto de Venda */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-all duration-300 group">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-2xl p-2 bg-emerald-50 rounded-xl">🛒</span>
                    <span className="text-[10px] font-mono tracking-wider font-extrabold border border-emerald-200 text-emerald-750 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">
                      Cenário 2 • Frente de Caixa
                    </span>
                  </div>
                  <h4 className="font-sans font-extrabold text-lg text-slate-900 mt-4 group-hover:text-emerald-600 transition-colors uppercase">
                    Mercado: PDV SuperCaixa
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Sistemas corporativos demandam eficiência brutal. Uma posição de botão errada pode adicionar 10 segundos ao atendimento, gerando filas e estresse. Ache botões destrutivos ocultos em cores neutras e conflito de feedback visual.
                  </p>
                </div>
                <div className="border-t border-slate-100 pt-4 mt-6 flex justify-between items-center">
                  <span className="text-[10.5px] font-mono text-slate-400">Progresso: {foundBugs.filter(id => id.startsWith('pdv-')).length}/2 encontrados</span>
                  <button 
                    onClick={() => { playSound('click'); setCurrentScenario('pdv'); }}
                    className="bg-slate-50 group-hover:bg-emerald-50 text-slate-800 group-hover:text-emerald-800 px-4 py-2 rounded-lg text-xs font-bold font-sans transition-all flex items-center gap-1.5 border border-slate-200 group-hover:border-emerald-200"
                  >
                    Investigar Protótipo →
                  </button>
                </div>
              </div>
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
