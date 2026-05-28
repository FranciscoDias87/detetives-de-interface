import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  ArrowDownRight, 
  ArrowUpRight, 
  Calendar, 
  Filter, 
  RefreshCw, 
  SlidersHorizontal, 
  HelpCircle, 
  CheckCircle, 
  Info,
  DollarSign,
  Briefcase,
  Layers,
  Search,
  AlertCircle
} from 'lucide-react';

interface DashboardShellProps {
  foundBugs: string[];
  onFindBug: (bugId: string) => void;
  isCorrected: boolean;
  setIsCorrected: (fixed: boolean) => void;
}

export default function DashboardShell({
  foundBugs,
  onFindBug,
  isCorrected,
  setIsCorrected
}: DashboardShellProps) {
  const [mobileTab, setMobileTab] = useState<'dash' | 'pistas'>('dash');

  // Estados dos filtros
  const [period, setPeriod] = useState<'hoje' | 'trinta' | 'ano'>('trinta');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterRefreshing, setIsFilterRefreshing] = useState(false);
  const [selectedDept, setSelectedDept] = useState<'todos' | 'ti' | 'mkt'>('todos');

  // Dados dinâmicos calculados por período
  const getMetrics = () => {
    switch (period) {
      case 'hoje':
        return { gross: 'R$ 1.250,00', net: 'R$ 820,00', margin: '65.6%', valNet: 820, valExp: 430 };
      case 'ano':
        return { gross: 'R$ 520.400,00', net: 'R$ 380.120,00', margin: '73.0%', valNet: 380120, valExp: 140280 };
      case 'trinta':
      default:
        return { gross: 'R$ 48.200,00', net: 'R$ 32.900,00', margin: '68.2%', valNet: 32900, valExp: 15300 };
    }
  };

  const metrics = getMetrics();

  // Tratador de alteração de período com o BUG embutido
  const handlePeriodChange = (newPeriod: 'hoje' | 'trinta' | 'ano') => {
    setIsFilterRefreshing(true);
    
    setTimeout(() => {
      setPeriod(newPeriod);
      setIsFilterRefreshing(false);
      
      // BUG: Ao mudar o período no modo bugado, limpa-se os outros inputs colaterais (Query de busca e departamento)
      if (!isCorrected) {
        setSearchQuery('');
        setSelectedDept('todos');
        
        // Dispara reconhecimento do bug de perda de filtros
        if (!foundBugs.includes('dash-ux-refresh')) {
          onFindBug('dash-ux-refresh');
        }
      }
    }, 800);
  };

  const handleDeptChange = (dept: 'todos' | 'ti' | 'mkt') => {
    setSelectedDept(dept);
  };

  // Identificação do Bug de Contraste de Gráfico ao clicar ou hover
  const handleChartClick = () => {
    if (!isCorrected && !foundBugs.includes('dash-ui-charts')) {
      onFindBug('dash-ui-charts');
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 items-center lg:items-start justify-center p-2 sm:p-4 w-full max-w-5xl mx-auto font-sans">
      
      {/* Seletor Segmentado para Mobile */}
      <div className="sm:hidden flex w-full bg-slate-150 p-1 rounded-xl border border-slate-200/60 mb-2 gap-1 shrink-0">
        <button 
          type="button"
          onClick={() => setMobileTab('dash')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
            mobileTab === 'dash' 
              ? 'bg-purple-650 text-white shadow-sm' 
              : 'text-slate-600'
          }`}
        >
          📊 Dashboard
        </button>
        <button 
          type="button"
          onClick={() => setMobileTab('pistas')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
            mobileTab === 'pistas' 
              ? 'bg-purple-650 text-white shadow-sm' 
              : 'text-slate-600'
          }`}
        >
          🔍 Pistas ({foundBugs.filter(b => b.startsWith('dash')).length}/2)
        </button>
      </div>

      {/* Caixa do Simulador de Dashboard */}
      <div className={`flex-1 min-w-[300px] sm:min-w-[420px] max-w-2xl bg-slate-900 border-4 border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between font-sans relative overflow-hidden text-slate-100 min-h-[580px] ${
        mobileTab === 'dash' ? 'flex' : 'hidden sm:flex'
      }`}>
        
        {/* Shimmer de Hard Refresh/Lock de Loading */}
        <AnimatePresence>
          {isFilterRefreshing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/85 z-55 flex flex-col items-center justify-center gap-2.5"
            >
              <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
              <div className="text-center">
                <p className="text-xs font-mono font-bold tracking-wider text-purple-400 animate-pulse">RECARREGANDO PAINEL FINANCEIRO...</p>
                {!isCorrected && (
                  <p className="text-[9px] text-rose-450 mt-1 uppercase max-w-xs px-4">Aviso: Estado de busca local apagado devido ao hard refresh.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Topo do Painel */}
        <div className="border-b border-slate-800 pb-3 mb-4 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs uppercase tracking-tight text-white">SaaS Finance Analytics</span>
                {!isCorrected && (
                  <span className="text-[8px] font-mono bg-purple-900/40 text-purple-300 border border-purple-800 px-1 py-0.5 rounded uppercase font-bold tracking-wide animate-pulse">BUGGY STATE</span>
                )}
              </div>
              <span className="text-[9px] font-mono text-zinc-400 block mt-0.5">Versão v2.8 • Auditoria Ativa</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-750 font-mono">
              PRODUÇÃO
            </span>
          </div>
        </div>

        {/* Grid de Filtros */}
        <div className="bg-slate-850 p-3 rounded-xl border border-slate-800/60 mb-4 flex flex-col md:flex-row gap-3 items-end">
          
          {/* Seletor de Período dropdown */}
          <div className="w-full md:w-auto text-left flex-1 min-w-[120px]">
            <label className="text-[9px] font-bold tracking-widest uppercase text-slate-400 block mb-1">Período de Análise</label>
            <div className="relative">
              <select 
                value={period}
                onChange={(e) => handlePeriodChange(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="hoje">Hoje (24 horas)</option>
                <option value="trinta">Últimos 30 Dias</option>
                <option value="ano">Ano Fiscal Corrente</option>
              </select>
            </div>
          </div>

          {/* Input de Busca Colateral */}
          <div className="w-full md:w-auto text-left flex-2">
            <label className="text-[9px] font-bold tracking-widest uppercase text-slate-400 block mb-1">Filtrar por Cliente</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input 
                type="text"
                value={searchQuery}
                placeholder="Ex: Clientes VIP Ltda"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Filtro de Departamento */}
          <div className="w-full md:w-auto text-left flex-1 min-w-[100px]">
            <label className="text-[9px] font-bold tracking-widest uppercase text-slate-400 block mb-1">Setor</label>
            <select
              value={selectedDept}
              onChange={(e) => handleDeptChange(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="todos">Todos</option>
              <option value="ti">T.I.</option>
              <option value="mkt">Marketing</option>
            </select>
          </div>
        </div>

        {/* Grid de Métricas Principais */}
        <div className="grid grid-cols-3 gap-3.5 mb-4 text-left">
          {/* Faturamento Bruto */}
          <div className="bg-slate-850 border border-slate-800 p-3 rounded-xl flex flex-col justify-between">
            <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold font-mono">FATURAMENTO</span>
            <span className="text-white font-mono font-bold text-xs mt-1 md:text-sm">{metrics.gross}</span>
            <span className="text-[8px] text-emerald-400 mt-1 flex items-center gap-0.5"><TrendingUp className="w-2.5 h-2.5" /> +12%</span>
          </div>

          {/* Faturamento Líquido */}
          <div className="bg-slate-850 border border-slate-800 p-3 rounded-xl flex flex-col justify-between">
            <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold font-mono">LÍQUIDO REAL</span>
            <span className="text-white font-mono font-bold text-xs mt-1 md:text-sm">{metrics.net}</span>
            <span className="text-[8px] text-emerald-400 mt-1 flex items-center gap-0.5"><TrendingUp className="w-2.5 h-2.5" /> +8.4%</span>
          </div>

          {/* Margem */}
          <div className="bg-slate-850 border border-slate-800 p-3 rounded-xl flex flex-col justify-between">
            <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold font-mono">MARGEM LÍQUIDA</span>
            <span className="text-emerald-400 font-mono font-bold text-xs mt-1 md:text-sm">{metrics.margin}</span>
            <span className="text-[8px] text-slate-500 mt-1">Metas batidas ✔</span>
          </div>
        </div>

        {/* Bloco de Gráfico Financeiro Interativo */}
        <div 
          onClick={handleChartClick}
          className={`bg-slate-850 p-4 rounded-xl border flex-1 mb-4 flex flex-col justify-between text-left cursor-pointer transition-all duration-300 relative ${
            isCorrected 
              ? 'border-slate-800 hover:border-slate-700' 
              : `border-slate-800 hover:border-amber-400 ${
                  foundBugs.includes('dash-ui-charts') ? 'border-amber-500' : ''
                }`
          }`}
          title="Clique para auditar escala cromática do gráfico"
        >
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="font-bold text-xs">Análise de Lucros vs Despesas</p>
              <p className="text-[8px] text-slate-450">Demonstração de equilíbrio de caixa no período selecionado</p>
            </div>
            
            {!isCorrected && (
              <span className="text-[8px] text-amber-500 font-mono flex items-center gap-0.5 animate-pulse">
                <HelpCircle className="w-3 h-3" /> Auditar Cores
              </span>
            )}
          </div>

          {/* Gráfico Simulado */}
          <div className="flex-1 flex flex-col items-center justify-center p-2">
            
            {/* Visual em SVG/CSS da barra de fatias */}
            <div className="w-full flex h-14 bg-slate-900 rounded-lg overflow-hidden border border-slate-800 font-mono relative">
              
              {/* Seção 1: Margem Líquida */}
              <div 
                style={{ width: `${parseFloat(metrics.margin)}%` }} 
                className={`h-full flex items-center justify-center transition-all ${
                  isCorrected 
                    ? 'bg-emerald-600/90 text-white font-extrabold text-[10px]' 
                    : 'bg-zinc-700 text-zinc-350 text-[7px]'
                }`}
              >
                {/* No modo bugado, o número fica quase ilegível e em fonte minúscula */}
                <span className="truncate px-0.5">
                  {isCorrected ? `Líquido (${metrics.margin})` : `Liq. ${metrics.margin}`}
                </span>
              </div>

              {/* Seção 2: Despesas */}
              <div 
                style={{ width: `${100 - parseFloat(metrics.margin)}%` }} 
                className={`h-full flex items-center justify-center transition-all ${
                  isCorrected 
                    ? 'bg-orange-550/90 text-white font-bold text-[10px]' 
                    : 'bg-zinc-650 text-zinc-400 text-[7px]'
                }`}
              >
                <span className="truncate px-0.5 animate-pulse">
                  {isCorrected ? 'Despesas' : 'Dsp.'}
                </span>
              </div>
            </div>

            {/* Legenda Cromática:
                No modo ruim, as cores são absurdamente parecidas e sem labels claras.
                No modo corrigido, são bem contrastadas e com legenda bonita.
            */}
            <div className="flex justify-center gap-6 mt-4 w-full text-[10px]">
              <div className="flex items-center gap-2">
                <span className={`w-3.5 h-3.5 rounded transition-colors ${
                  isCorrected ? 'bg-emerald-600' : 'bg-zinc-700'
                }`}></span>
                <span className="text-zinc-300">Lucro Retido</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3.5 h-3.5 rounded transition-colors ${
                  isCorrected ? 'bg-orange-550' : 'bg-zinc-650'
                }`}></span>
                <span className="text-zinc-300">Gasto da Operação</span>
              </div>
            </div>

          </div>

          {/* Aviso sobre busca textual de forma sutil */}
          {searchQuery && (
            <div className="bg-slate-900/60 p-2 rounded-lg text-[9px] text-purple-400 font-mono border border-purple-950/40 mt-1 flex justify-between items-center">
              <span>Cliente Filtrado: "{searchQuery}"</span>
              <span className="text-[8px] text-zinc-500 uppercase font-bold">Filtro Ativo</span>
            </div>
          )}
        </div>

        {/* Rodapé do Painel */}
        <div className="border-t border-slate-800 pt-3 flex justify-between text-[9px] text-slate-500 font-mono items-center mt-2.5">
          <span>SaaS ID: SE-2026-XFIN</span>
          <span>Sincronização em tempo real</span>
        </div>

      </div>

      {/* Painel Lateral das Pistas */}
      <div className={`flex-1 max-w-md bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col justify-between align-stretch self-stretch text-zinc-900 ${
        mobileTab === 'pistas' ? 'flex' : 'hidden sm:flex'
      }`}>
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-100">
            <div>
              <span className="text-[9px] font-mono tracking-widest text-[#7c3aed] uppercase font-bold">FASE 2 • NÍVEL INTERMEDIÁRIO</span>
              <h3 className="font-serif font-black text-lg text-neutral-850 uppercase">Caso 4: Métricas Enganosas</h3>
            </div>
            <div className="p-1 px-2.5 rounded bg-purple-100/60 text-[#7c3aed] font-mono font-bold text-[10px] tracking-tight">
              SaaS Panel
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            Painéis gerenciais de tomada de decisão demandam precisão de visualização brutal. Um erro cromático ou perda de dados em filtros colaterais geram prejuízos diários gigantes de interpretação.
          </p>

          <div className="border-t border-slate-100 my-4"></div>

          {/* Lista de Erros para caçar */}
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Desvios de Design Críticos:</h4>

            {/* Card 1: Cores do Gráfico */}
            <div 
              onClick={() => {
                if (!isCorrected) onFindBug('dash-ui-charts');
              }}
              className={`p-3 rounded-xl border text-xs text-left cursor-pointer transition-all duration-300 relative overflow-hidden ${
                foundBugs.includes('dash-ui-charts')
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-850'
                  : 'bg-slate-50 border-slate-150 hover:border-purple-300 text-slate-700'
              }`}
            >
              <div className="flex justify-between items-center font-bold">
                <span>🔍 #01: O Gráfico Sem Alma</span>
                {foundBugs.includes('dash-ui-charts') ? (
                  <span className="text-[9px] text-emerald-700 font-mono font-bold">REVELADO</span>
                ) : (
                  <span className="text-[9px] text-amber-600 font-mono font-bold flex items-center gap-0.5 animate-pulse">INVESTIGAR</span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                Tente decifrar no gráfico qual proporção exata representa lucro e qual representa despesas sob luz forte. Consegue distinguir as fatias?
              </p>
              {foundBugs.includes('dash-ui-charts') && (
                <div className="mt-2 text-[9px] bg-white/80 p-1.5 rounded text-emerald-800 leading-tight">
                  <strong>Efeito:</strong> Usar a mesma escala cromática cinza/pastel impossibilita a leitura sob telas ruins, gerando conclusões erradas no conselho.
                </div>
              )}
            </div>

            {/* Card 2: Perda de Filtros */}
            <div 
              onClick={() => {
                if (!isCorrected) onFindBug('dash-ux-refresh');
              }}
              className={`p-3 rounded-xl border text-xs text-left cursor-pointer transition-all duration-300 relative overflow-hidden ${
                foundBugs.includes('dash-ux-refresh')
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-850'
                  : 'bg-slate-50 border-slate-150 hover:border-purple-300 text-slate-700'
              }`}
            >
              <div className="flex justify-between items-center font-bold">
                <span>🔍 #02: Filtros Amnésicos</span>
                {foundBugs.includes('dash-ux-refresh') ? (
                  <span className="text-[9px] text-emerald-700 font-mono font-bold">REVELADO</span>
                ) : (
                  <span className="text-[9px] text-amber-600 font-mono font-bold flex items-center gap-0.5 animate-pulse">INVESTIGAR</span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                Escreva algo no campo "Cliente" e mude a caixa "Período". Por que a busca foi apagada e você teve que recomeçar a preencher?
              </p>
              {foundBugs.includes('dash-ux-refresh') && (
                <div className="mt-2 text-[9px] bg-white/80 p-1.5 rounded text-emerald-800 leading-tight">
                  <strong>Efeito:</strong> Redefinir inputs textuais colaterais em dropdowns secundários força o usuário a refazer a digitação, desperdiçando tempo profissional.
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Rodapé Interno com Controle de Conserto do Professor */}
        <div className="border-t border-slate-150 pt-4 mt-6">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isCorrected ? 'bg-emerald-500' : 'bg-[#7c3aed] animate-pulse'}`}></span>
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">ESTADO DO PAINEL</span>
                <span className="font-bold text-[11px] text-zinc-800">
                  {isCorrected ? 'Design Consertado / Acessível' : 'Protótipo Original Ruim'}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => {
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                if (AudioContext) {
                  try {
                    const ctx = new AudioContext();
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.frequency.setValueAtTime(isCorrected ? 300 : 600, ctx.currentTime);
                    gain.gain.setValueAtTime(0.05, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.15);
                  } catch (e) {}
                }
                setIsCorrected(!isCorrected);
              }}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-0.5 ${
                isCorrected 
                  ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {isCorrected ? 'Voltar com Bug' : 'Consertar UI/UX'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
