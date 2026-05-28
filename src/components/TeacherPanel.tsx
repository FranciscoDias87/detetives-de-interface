import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  HelpCircle, 
  KeyRound, 
  CheckCircle, 
  Unlock, 
  Clock, 
  Heart,
  Presentation,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ALL_BUGS } from '../types';

interface TeacherPanelProps {
  onUnlockAll: () => void;
  foundBugsCount: number;
}

export default function TeacherPanel({ onUnlockAll, foundBugsCount }: TeacherPanelProps) {
  const [showTeacherSecrets, setShowTeacherSecrets] = useState(false);
  const [activeStepTab, setActiveStepTab] = useState<'plan' | 'guide' | 'gabarito'>('plan');

  return (
    <div className="max-w-4xl mx-auto bg-slate-900 text-slate-100 rounded-2xl border-2 border-slate-800 p-6 shadow-xl font-sans">
      
      {/* Cabeçalho de Controle do Professor */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
            <Presentation className="w-6 h-6" />
          </span>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-sky-400 font-mono font-bold block">Espaço do Educador</span>
            <h2 className="font-bold text-xl text-white tracking-tight">Manual do Mestre & Gabarito</h2>
          </div>
        </div>

        {/* Botão para desbloquear todo o lab para fins de debate rápida */}
        <button 
          onClick={() => {
            const accept = window.confirm('Deseja revelar imediatamente TODOS os erros em modo demonstração para debater com os alunos no projetor?');
            if (accept) onUnlockAll();
          }}
          className="bg-sky-600 hover:bg-sky-500 text-white rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
        >
          <Unlock className="w-3.5 h-3.5" /> Revelar Tudo no Projetor
        </button>
      </div>

      {/* Navegação Interna de Recursos */}
      <div className="flex border-b border-slate-850 mb-6 gap-2">
        <button 
          onClick={() => setActiveStepTab('plan')}
          className={`px-4 py-2 text-xs font-bold transition-all relative -bottom-px rounded-t-lg ${
            activeStepTab === 'plan' 
              ? 'bg-slate-800 text-sky-400 border-b-2 border-sky-400' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📅 Plano de Aula (30 min)
        </button>
        <button 
          onClick={() => setActiveStepTab('guide')}
          className={`px-4 py-2 text-xs font-bold transition-all relative -bottom-px rounded-t-lg ${
            activeStepTab === 'guide' 
              ? 'bg-slate-800 text-sky-400 border-b-2 border-sky-400' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          💡 Perguntas para o Debate
        </button>
        <button 
          onClick={() => setActiveStepTab('gabarito')}
          className={`px-4 py-2 text-xs font-bold transition-all relative -bottom-px rounded-t-lg ${
            activeStepTab === 'gabarito' 
              ? 'bg-slate-800 text-sky-400 border-b-2 border-sky-400' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🔑 Respostas Comentadas
        </button>
      </div>

      {/* Conteúdos das Tabs */}
      {activeStepTab === 'plan' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-350 leading-relaxed">
            Esta dinâmica foi concebida para aproximar o entendimento de interfaces do cotidiano dos alunos ao mercado profissional, revelando a diferença crítica de contraste e fluxos.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Passo 1 */}
            <div className="bg-slate-850/60 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-sky-450 font-bold text-xs mb-2 font-mono">
                <Clock className="w-4 h-4" /> 5 MIN: INTRODUÇÃO
              </div>
              <h4 className="font-bold text-sm text-slate-100 mb-1.5">Conexão de Mundos</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mostre que o Instagram que usam e o sistema de caixa do supermercado dependem dos mesmos princípios. Divida a turma em grupos de investigação de 3 a 5 alunos.
              </p>
            </div>

            {/* Passo 2 */}
            <div className="bg-slate-850/60 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-sky-450 font-bold text-xs mb-2 font-mono">
                <Users className="w-4 h-4" /> 15 MIN: CAÇA AOS ERROS
              </div>
              <h4 className="font-bold text-sm text-slate-100 mb-1.5">Trabalho em Equipe</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Os grupos analisam os protótipos da Rede Social e do PDV. Eles devem encontrar os 5 erros e refletir sobre os impactos na usabilidade e no negócio.
              </p>
            </div>

            {/* Passo 3 */}
            <div className="bg-slate-850/60 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-sky-450 font-bold text-xs mb-2 font-mono">
                <CheckCircle className="w-4 h-4" /> 10 MIN: GABARITO & REFLEXÃO
              </div>
              <h4 className="font-bold text-sm text-slate-100 mb-1.5">Debate e Fechamento</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Use o painel para revelar as respostas corretas no projetor, mostrando as soluções de interface corrigidas e incentivando as conclusões do debate.
              </p>
            </div>
          </div>

          <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800/80 text-xs text-slate-350 leading-relaxed flex items-start gap-2.5">
            <span className="text-amber-500 mt-0.5">💡</span>
            <p>
              <strong>Dica Prática:</strong> Deixe o app projetado na lousa. Conforme os grupos descobrem e debatem verbalmente, ative o botão <strong>"Modo Corrigido"</strong> para ilustrar diretamente como um bom design transforma a velocidade de trabalho e a inclusão das pessoas.
            </p>
          </div>
        </div>
      )}

      {activeStepTab === 'guide' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-350 leading-relaxed">
            Estimule o senso crítico dos alunos com estas perguntas provocativas sobre cada cenário do jogo:
          </p>

          <div className="space-y-3">
            {/* Bloco Caso 1 */}
            <div className="bg-slate-850/40 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono font-bold tracking-wider text-rose-400 uppercase">Cenário 1: Redes Sociais</span>
              <ul className="list-decimal pl-4 mt-2 space-y-2 text-xs text-slate-350 leading-relaxed">
                <li>
                  <strong>"Se você usasse essa rede sob sol forte na praia, conseguiria ler?" </strong> 
                  <span className="block text-slate-400 mt-0.5 text-[11px] font-serif italic">Relação com falta de contraste prejudicando acessibilidade visual diária.</span>
                </li>
                <li>
                  <strong>"Esconder botões vitais como Curtir reduz o engajamento de uma empresa de rede social?"</strong> 
                  <span className="block text-slate-400 mt-0.5 text-[11px] font-serif italic">Menos curtidas = criadores abandonam o aplicativo = falência da rede. UX afeta faturamento!</span>
                </li>
              </ul>
            </div>

            {/* Bloco Caso 2 */}
            <div className="bg-slate-850/40 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400 uppercase">Cenário 2: Sistema de PDV</span>
              <ul className="list-decimal pl-4 mt-2 space-y-2 text-xs text-slate-350 leading-relaxed">
                <li>
                  <strong>"Quais perigos duas cores vermelhas iguais em botões extremistas trazem em momentos de pressa?"</strong> 
                  <span className="block text-slate-400 mt-0.5 text-[11px] font-serif italic">Estresse do operador, cliques acidentais em "Cancelar Venda", desperdício de tempo e prejuízos enormes com filas.</span>
                </li>
                <li>
                  <strong>"Quanto tempo o supermercado perde se o operador tiver que fazer 6 cliques para carregar um único copo de requeijão?"</strong> 
                  <span className="block text-slate-400 mt-0.5 text-[11px] font-serif italic">Eficiência de fluxo: atalhos de teclado e código de barras salvam grandes filas comerciais.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeStepTab === 'gabarito' && (
        <div className="space-y-3.5">
          <p className="text-xs text-slate-350 leading-relaxed mb-3">
            Guia técnico das falhas ocultas no simulador para uso direto do educador:
          </p>

          <div className="space-y-3 max-h-96 overflow-y-auto no-scrollbar pr-1">
            {ALL_BUGS.map((bug, idx) => (
              <div key={bug.id} className="bg-slate-850 p-3.5 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
                  <span className="font-bold text-sky-450 font-mono">#0{idx + 1} - {bug.title} ({bug.type})</span>
                  <span className="text-[10px] text-slate-500 font-mono uppercase">
                    {bug.scenario === 'social' ? 'Redes Sociais' : 'Frente de Caixa (PDV)'}
                  </span>
                </div>
                
                <div className="space-y-1.5 font-sans leading-relaxed text-slate-300">
                  <p><strong>Descrição do Defeito:</strong> <span className="text-slate-400">{bug.shortDesc}</span></p>
                  <p><strong>Análise Crítica:</strong> <span className="text-slate-450">{bug.detailedDesc}</span></p>
                  <p><strong>Impacto Financeiro/Social:</strong> <span className="text-rose-400">{bug.impact}</span></p>
                  <p><strong>Como o Design Resolve:</strong> <span className="text-emerald-400">{bug.solution}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
