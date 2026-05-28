import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Printer, 
  Share2, 
  Search,
  Sparkles,
  Zap,
  Fingerprint
} from 'lucide-react';
import { ALL_BUGS, Bug } from '../types';

interface NotebookReportProps {
  foundBugs: string[];
  teamName: string;
  setTeamName: (name: string) => void;
  onReset: () => void;
}

export default function NotebookReport({ 
  foundBugs, 
  teamName, 
  setTeamName, 
  onReset 
}: NotebookReportProps) {
  const percentage = Math.round((foundBugs.length / ALL_BUGS.length) * 100);

  const getBadgeTitle = (pct: number) => {
    if (pct === 100) return '🏅 Detetive Mestre (UI/UX Expert)';
    if (pct >= 60) return '🕵️ Investigador Sênior';
    if (pct >= 30) return '🔍 Detetive Júnior';
    return '🌱 Aspirante a Detetive';
  };

  const downloadReportText = () => {
    const lines = [
      `=========================================`,
      `🕵️ RELATÓRIO DE MISSÃO: DETETIVES DE INTERFACE`,
      `Grupo: ${teamName || 'Equipe Sem Nome'}`,
      `Progresso: ${foundBugs.length}/${ALL_BUGS.length} Erros Encontrados (${percentage}%)`,
      `Título Conquistado: ${getBadgeTitle(percentage)}`,
      `Data/Hora: ${new Date().toLocaleString()}`,
      `=========================================`,
      ``,
      `ERROS INVESTIGADOS E IDENTIFICADOS:`,
      ``
    ];

    const getScenarioLabel = (scenario: string) => {
      switch (scenario) {
        case 'social': return 'Fase 1 • Caso 1: Redes Sociais';
        case 'pdv': return 'Fase 1 • Caso 2: Sistema PDV';
        case 'checkout': return 'Fase 2 • Caso 3: Checkout de Viagem';
        case 'dashboard': return 'Fase 2 • Caso 4: Painel SaaS';
        default: return 'Cenário Desconhecido';
      }
    };

    ALL_BUGS.forEach((bug, idx) => {
      const found = foundBugs.includes(bug.id);
      lines.push(`${idx + 1}. [${found ? 'RESOLVIDO' : 'NÃO DETECTADO'}] ${bug.title} (${bug.type})`);
      lines.push(`   Cenário: ${getScenarioLabel(bug.scenario)}`);
      if (found) {
        lines.push(`   Problema: ${bug.detailedDesc}`);
        lines.push(`   Impacto Profissional: ${bug.impact}`);
        lines.push(`   Solução de Design: ${bug.solution}`);
      } else {
        lines.push(`   ??? Detalhes bloqueados até o grupo encontrar o bug ???`);
      }
      lines.push(`-----------------------------------------`);
    });

    lines.push(``);
    lines.push(`Conclusões do Aprendizado:`);
    lines.push(`- UI (Interface do Usuário) é a beleza, consistência e contraste. Sem contraste, há exclusão social.`);
    lines.push(`- UX (Experiência do Usuário) é a eficiência e fluxo. Cliques desnecessários geram perdas financeiras.`);
    lines.push(``);
    lines.push(`Assinatura do Inspetor Geral da Sala de Aula: ___________________________`);

    // Criar download direto
    const element = document.createElement("a");
    const file = new Blob([lines.join("\n")], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Relatorio-DetetiveUIUX-${teamName.replace(/\s+/g, '_') || 'Equipe'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-4xl mx-auto bg-amber-50 rounded-2xl border-2 border-amber-200/50 p-6 md:p-8 shadow-md relative overflow-hidden text-neutral-800">
      
      {/* Detalhes Estéticos de Caderno Antigo de Investigador */}
      <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-red-100 border-r border-dashed border-red-200 pointer-events-none hidden md:block"></div>
      
      <div className="md:pl-10">
        
        {/* Cabeçalho do Caderno */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-2 border-dashed border-amber-250/60 mb-6">
          <div className="flex items-center gap-3">
            <span className="p-2 w-12 h-12 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center border border-amber-200 shadow-inner">
              <Fingerprint className="w-8 h-8" />
            </span>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-amber-600 font-mono font-bold block">Caderno de Evidências</span>
              <h1 className="font-serif font-bold text-2xl md:text-3xl text-neutral-800 tracking-tight">Dossiê dos Investigadores</h1>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end font-mono">
            <div className="text-xs text-neutral-500">Status da Missão</div>
            <div className="text-lg font-bold text-amber-800 flex items-center gap-1.5 leading-none">
              <Sparkles className="w-5 h-5 text-amber-500 animate-bounce" /> {foundBugs.length} / {ALL_BUGS.length} Descobertos ({percentage}%)
            </div>
          </div>
        </div>

        {/* Input do Nome do Grupo / Turma */}
        <div className="bg-white/80 border border-amber-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between shadow-sm">
          <div className="flex-1">
            <label className="text-[10px] uppercase font-bold tracking-wider text-amber-700 block mb-1 font-mono">Nome da Equipe ou Aluno(s):</label>
            <input 
              type="text" 
              placeholder="Digite o nome do grupo ou investigadores..."
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full bg-amber-50/50 border border-amber-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-amber-400 font-serif"
            />
          </div>
          <div className="bg-amber-100/40 px-4 py-2.5 rounded-lg border border-amber-200/60 self-stretch sm:self-auto flex flex-col justify-center">
            <span className="text-[10px] text-amber-700 font-bold block uppercase tracking-wider font-mono">Classificação</span>
            <span className="text-xs font-bold text-neutral-800">{getBadgeTitle(percentage)}</span>
          </div>
        </div>

        {/* Dicas Gerais e Quadro Educacional do Tema */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-4 text-xs text-neutral-700 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sky-850 mb-1.5 font-sans">
                <BookOpen className="w-4 h-4 text-sky-600 font-bold" />
                <span>O que é UI (User Interface)?</span>
              </div>
              <p className="leading-relaxed mb-3">
                UI é a parte visual com a qual o usuário interage diretamente. Envolve fontes, paleta de cores, botões, ícones, layouts e o contraste. 
              </p>
              <div className="text-[11px] bg-sky-100/40 p-2 rounded leading-snug font-sans text-sky-800 border-l-2 border-sky-400">
                <strong>💡 O Tabu de mercado:</strong> Cores fracas ou botões sem destaque desviam o olhar do usuário e geram confusão rápida nas tarefas mais comuns do negócio.
              </div>
            </div>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-4 text-xs text-neutral-700 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-emerald-850 mb-1.5 font-sans">
                <Zap className="w-4 h-4 text-emerald-600" />
                <span>O que é UX (User Experience)?</span>
              </div>
              <p className="leading-relaxed mb-3">
                UX foca em como o usuário se sente ao utilizar o produto. É a jornada, o fluxo de cliques e a facilidade operacional para resolver tarefas diárias sem frustração.
              </p>
              <div className="text-[11px] bg-emerald-100/40 p-2 rounded leading-snug font-sans text-emerald-800 border-l-2 border-emerald-400">
                <strong>💼 O Tabu de mercado:</strong> Processos com muitos passos (excesso de janelas e cliques) geram estresse, filas em negócios presenciais e abandono em lojas online.
              </div>
            </div>
          </div>
        </div>

        {/* Detalhe de cada evidência descoberta */}
        <div className="space-y-4 mb-8">
          <h3 className="font-serif font-bold text-lg text-neutral-700 border-b border-amber-200 pb-2 mb-3">📋 Detalhamento Científico dos Bugs Descobertos</h3>
          
          {ALL_BUGS.map((bug, index) => {
            const found = foundBugs.includes(bug.id);
            return (
              <div 
                key={bug.id} 
                className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                  found 
                    ? 'bg-white border-emerald-200 shadow-sm' 
                    : 'bg-zinc-100/50 border-zinc-200/80 brightness-95 opacity-85 select-none'
                }`}
              >
                
                {/* Header do Item de Evidência */}
                <div className={`p-4 flex items-center justify-between gap-3 ${found ? 'bg-emerald-50/50' : 'bg-zinc-200/55'}`}>
                  <div className="flex items-center gap-2.5">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                      found ? 'bg-emerald-100 text-emerald-850' : 'bg-zinc-400 text-zinc-100'
                    }`}>
                      {index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[9px] font-mono tracking-wider font-bold uppercase rounded px-1.5 py-0.5 ${
                          bug.type === 'UI' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {bug.type}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {bug.scenario === 'social' ? 'Fase 1 • Caso 1: Redes Sociais' : 
                           bug.scenario === 'pdv' ? 'Fase 1 • Caso 2: Sistema PDV' :
                           bug.scenario === 'checkout' ? 'Fase 2 • Caso 3: Checkout de Viagem' :
                           'Fase 2 • Caso 4: Painel SaaS'}
                        </span>
                      </div>
                      <h4 className="font-sans font-bold text-sm text-neutral-850 mt-0.5">{bug.title}</h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {found ? (
                      <span className="text-[10px] font-bold text-emerald-700 font-mono tracking-wide uppercase flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> REVELADO
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-zinc-450 font-mono tracking-wide uppercase flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> AGUARDANDO
                      </span>
                    )}
                  </div>
                </div>

                {/* Corpo Detalhado das Evidências */}
                {found ? (
                  <div className="p-4 space-y-3.5 text-xs text-neutral-700 leading-relaxed font-sans">
                    <div>
                      <span className="font-bold text-neutral-800 block text-[11px] uppercase tracking-wider font-mono mb-0.5">📂 O Erro Comprovado:</span>
                      <p className="text-neutral-600">{bug.detailedDesc}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2.5 border-t border-zinc-100">
                      <div>
                        <span className="font-bold text-rose-700 block text-[11px] uppercase tracking-wider font-mono mb-0.5">📉 Impacto Profissional:</span>
                        <p className="text-zinc-600 text-[11.5px]">{bug.impact}</p>
                      </div>
                      <div>
                        <span className="font-bold text-emerald-700 block text-[11px] uppercase tracking-wider font-mono mb-0.5">🛠️ Solução Consolidada:</span>
                        <p className="text-zinc-600 text-[11.5px]">{bug.solution}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-zinc-400 font-mono">
                    ⚠️ Evidência Criptografada. Investigue os protótipos interativos para desbloquear esta análise!
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Botões de Exportação e Reset */}
        <div className="border-t-2 border-dashed border-amber-250/60 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-xs text-neutral-500 font-mono">
            * Complete 100% para se tornar um Detetive Mestre de Interface.
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button 
              onClick={downloadReportText}
              className="bg-neutral-800 hover:bg-neutral-900 text-white rounded-lg px-4 py-2 text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Exportar Relatório (.txt)
            </button>
            <button 
              onClick={() => {
                const conf = window.confirm('Deseja zerar a investigação para reiniciar com outra equipe?');
                if (conf) onReset();
              }}
              className="bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg px-4 py-2 text-xs font-bold border border-amber-300 transition-colors"
            >
              Limpar Dossiê
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
