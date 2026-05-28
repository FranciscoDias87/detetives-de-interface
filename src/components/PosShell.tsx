import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, 
  Trash2, 
  CheckCircle, 
  Plus, 
  Search, 
  X, 
  AlertTriangle, 
  CornerDownRight, 
  Clock, 
  HelpCircle,
  FileCheck2,
  ListFilter,
  ArrowRight,
  Sparkles,
  Barcode
} from 'lucide-react';

interface PosShellProps {
  foundBugs: string[];
  onFindBug: (bugId: string) => void;
  isCorrected: boolean;
  setIsCorrected: (fixed: boolean) => void;
}

interface CartItem {
  id: number;
  code: string;
  name: string;
  qty: number;
  price: number;
}

export default function PosShell({ 
  foundBugs, 
  onFindBug, 
  isCorrected, 
  setIsCorrected 
}: PosShellProps) {
  const [mobileTab, setMobileTab] = useState<'terminal' | 'pistas'>('terminal');
  // Estado para os itens no carrinho
  const [cart, setCart] = useState<CartItem[]>([
    { id: 1, code: '78910001', name: 'Arroz Integral Camil 1kg', qty: 1, price: 6.90 },
    { id: 2, code: '78910002', name: 'Feijão Carioca Kicaldo 1kg', qty: 2, price: 8.50 }
  ]);

  // Controlo dos diálogos de erro e fluxos
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchStep, setSearchStep] = useState<'idle' | 'searching' | 'results' | 'qty' | 'done'>('idle');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [posErrorActive, setPosErrorActive] = useState<string | null>(null); // 'cancel-disaster' | 'click-mismatch'

  // Banco de dados simulado de produtos
  const dbProducts = [
    { code: '78910003', name: 'Óleo de Soja Liza 900ml', price: 5.80, category: 'Mercearia' },
    { code: '78910004', name: 'Café Melitta Vácuo 500g', price: 18.90, category: 'Mercearia' },
    { code: '78910005', name: 'Leite Condensado Moça 395g', price: 7.20, category: 'Doces' },
    { code: '78910006', name: 'Pão de Forma Visconti 400g', price: 9.90, category: 'Padaria' }
  ];

  const filteredProducts = dbProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCartValue = cart.reduce((sum, item) => sum + (item.qty * item.price), 0);

  // BUG DE UI: Botões críticos com a mesma cor (Vermelho) e tamanho
  const handleCriticalButtonClick = (action: 'finish' | 'cancel') => {
    if (isCorrected) {
      if (action === 'cancel') {
        const confirmClear = window.confirm('Deseja realmente cancelar toda a venda atual?');
        if (confirmClear) {
          setCart([]);
        }
      } else {
        alert('Venda Finalizada com Sucesso! Cupom fiscal impresso.');
        setCart([]);
      }
      return;
    }

    // Modo Bugado
    if (!foundBugs.includes('pdv-ui-buttons')) {
      onFindBug('pdv-ui-buttons');
    }

    if (action === 'cancel') {
      setPosErrorActive('cancel-disaster');
    } else {
      setPosErrorActive('click-mismatch');
    }
  };

  // BUG DE UX: Fluxo excessivo para adicionar item
  const openAddFlow = () => {
    setShowAddModal(true);
    setSearchQuery('');
    setSearchStep('idle');
    setSelectedProduct(null);
    setQuantity(1);
  };

  const startSearch = () => {
    if (!searchQuery.trim()) return;
    setSearchStep('searching');
    setTimeout(() => {
      setSearchStep('results');
    }, 1200); // tempo de espera exagerado simulando banco lento
  };

  const selectProduct = (prod: any) => {
    setSelectedProduct(prod);
    setSearchStep('qty');
  };

  const confirmAddProduct = () => {
    if (!selectedProduct) return;
    
    // Sucesso - Adicionar ao carrinho
    const newItem: CartItem = {
      id: Date.now(),
      code: selectedProduct.code,
      name: selectedProduct.name,
      qty: quantity,
      price: selectedProduct.price
    };
    
    setCart(prev => [...prev, newItem]);
    setShowAddModal(false);

    if (!isCorrected && !foundBugs.includes('pdv-ux-search')) {
      onFindBug('pdv-ux-search');
    }
  };

  // Modo Corrigido: Atalho Rápido para Adicionar Produto diretamente com 1 clique
  const quickAddItem = (prod: any) => {
    const existingIndex = cart.findIndex(item => item.code === prod.code);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].qty += 1;
      setCart(updated);
    } else {
      setCart(prev => [...prev, {
        id: Date.now(),
        code: prod.code,
        name: prod.name,
        qty: 1,
        price: prod.price
      }]);
    }
  };

  const deleteCartItem = (itemId: number) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 items-stretch justify-center p-2 sm:p-4 w-full max-w-6xl mx-auto">
      {/* Seletor Segmentado Exclusivo para Telas Mobile */}
      <div className="sm:hidden flex w-full bg-slate-150 p-1 rounded-xl border border-slate-200/60 mb-2 gap-1 shrink-0">
        <button 
          type="button"
          onClick={() => setMobileTab('terminal')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'terminal' 
              ? 'bg-emerald-600 text-white shadow-sm' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🛒 Terminal Frente de Caixa
        </button>
        <button 
          type="button"
          onClick={() => setMobileTab('pistas')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'pistas' 
              ? 'bg-emerald-600 text-white shadow-sm' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🔍 Pistas & Bugs ({foundBugs.filter(b => b.startsWith('pdv')).length}/2)
        </button>
      </div>

      {/* Container principal da tela de PDV */}
      <div className={`flex-1 min-w-[280px] sm:min-w-[320px] bg-neutral-900 text-zinc-100 rounded-2xl border-4 border-neutral-850 p-3 sm:p-4 shadow-xl flex flex-col justify-between font-mono relative overflow-hidden ${
        mobileTab === 'terminal' ? 'flex' : 'hidden sm:flex'
      }`}>
        
        {/* Topo do PDV - Identificação do Terminal */}
        <div className="border-b border-neutral-850 pb-3 mb-3 flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs tracking-wider uppercase text-zinc-400 font-bold">MERCADO SUPER-RÁPIDO - CAIXA #04</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-zinc-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 2026-05-27
            </span>
            <span className="bg-neutral-800 px-2 py-0.5 rounded text-neutral-300">
              Operador: João Silva
            </span>
          </div>
        </div>

        {/* Corpo principal do caixa */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
          
          {/* Coluna Esquerda: Lista de Itens no Carrinho (8 Colunas) */}
          <div className="lg:col-span-8 bg-black/40 rounded-xl p-3 border border-neutral-850 flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-sky-400 flex items-center gap-1">
                  <ShoppingCart className="w-4 h-4" /> Carrinho de Compras ({cart.length} itens)
                </span>
                {isCorrected && (
                  <span className="text-[10px] bg-sky-950 text-sky-400 border border-sky-850 px-2 py-0.5 rounded font-sans">
                    Leitor de código de barras ou atalhos ativos!
                  </span>
                )}
              </div>

              {/* Tabela de Itens (Desktop) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead>
                    <tr className="border-b border-neutral-800 text-zinc-500 text-[10px] uppercase">
                      <th className="py-2">Código</th>
                      <th className="py-2">Descrição do Produto</th>
                      <th className="py-2 text-right">Qtd</th>
                      <th className="py-2 text-right">P. Unit</th>
                      <th className="py-2 text-right">Subtotal</th>
                      <th className="py-2 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-zinc-650">
                          Carrinho vazio. Adicione um novo item!
                        </td>
                      </tr>
                    ) : (
                      cart.map((item) => (
                        <tr key={item.id} className="border-b border-neutral-850 hover:bg-neutral-850/60 transition-colors">
                          <td className="py-2.5 font-mono text-zinc-500">{item.code}</td>
                          <td className="py-2.5 font-sans font-medium text-zinc-200">{item.name}</td>
                          <td className="py-2.5 text-right">{item.qty}x</td>
                          <td className="py-2.5 text-right">R$ {item.price.toFixed(2)}</td>
                          <td className="py-2.5 text-right font-bold text-amber-400">R$ {(item.qty * item.price).toFixed(2)}</td>
                          <td className="py-2.5 text-center">
                            <button 
                              onClick={() => deleteCartItem(item.id)}
                              className="text-neutral-500 hover:text-red-400 p-1 rounded-full transition-colors"
                              title="Remover Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Lista Adaptativa para Dispositivos Mobile (Mobile First) */}
              <div className="block sm:hidden space-y-2 max-h-56 overflow-y-auto no-scrollbar">
                {cart.length === 0 ? (
                  <div className="text-center py-6 text-zinc-650 text-xs">
                    Carrinho vazio. Adicione um novo item!
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="bg-neutral-850/65 p-2.5 rounded-lg border border-neutral-800 flex flex-col gap-1 text-xs">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-sans font-bold text-zinc-200 truncate">{item.name}</span>
                        <button 
                          onClick={() => deleteCartItem(item.id)}
                          className="text-neutral-550 hover:text-red-400 p-1 rounded-full transition-colors shrink-0"
                          title="Remover Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-455 mt-1 border-t border-neutral-800/40 pt-1">
                        <span>Cód: {item.code}</span>
                        <span>{item.qty}x R$ {item.price.toFixed(2)}</span>
                        <span className="font-bold text-amber-500">R$ {(item.qty * item.price).toFixed(2)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Ações de Linha de Comando / Código do Carrinho */}
            <div className="mt-4 pt-3 border-t border-neutral-850 flex flex-wrap gap-2 items-center justify-between">
              
              {/* Se estiver no Modo Corrigido, exibe atalhos rápidos de 1 clique para produtos comuns */}
              {isCorrected ? (
                <div className="w-full">
                  <span className="text-[10px] text-zinc-500 font-bold block mb-1.5 font-sans uppercase">
                    ⚡ Painel de Teclas de Atalho Rápido (Lanches e Básicos):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {dbProducts.map(p => (
                      <button 
                        key={p.code}
                        onClick={() => quickAddItem(p)}
                        className="bg-neutral-800 hover:bg-neutral-750 active:scale-95 text-left p-2 rounded border border-neutral-700 transition-all text-[11px] flex gap-1.5 items-center justify-between group"
                      >
                        <span className="font-sans truncate text-zinc-300 group-hover:text-white">{p.name.split(' ')[0]}</span>
                        <span className="text-emerald-400 font-bold font-mono">+{p.price.toFixed(1)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full flex justify-between items-center bg-amber-950/25 border border-amber-800/40 p-2.5 rounded text-xs gap-2 leading-relaxed font-sans text-amber-300">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Nenhum código de barras pode ser lido e nenhum atalho rápido existe! É necessário utilizar o fluxo avançado de busca manual.</span>
                  </div>
                  <button 
                    onClick={() => onFindBug('pdv-ux-search')}
                    className="underline text-[10px] hover:text-amber-200 uppercase font-mono tracking-wider shrink-0"
                  >
                    Marcar como UX Bug
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Coluna Direita: Totais e Botões Críticos de Finalização (4 Colunas) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-4">
            
            {/* Bloco de Valores */}
            <div className="bg-black p-4 rounded-xl border border-neutral-850 flex flex-col justify-between align-stretch">
              <span className="text-[10px] uppercase text-zinc-500 tracking-wider font-bold mb-1">TOTAL DA COMPRA</span>
              <div className="text-3xl font-extrabold text-amber-400 tracking-tight leading-none my-1">
                R$ {totalCartValue.toFixed(2)}
              </div>
              <div className="border-t border-neutral-900 mt-2.5 pt-2 flex justify-between text-[11px] text-zinc-400">
                <span>Subtotal:</span>
                <span>R$ {totalCartValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-zinc-450">
                <span>Descontos:</span>
                <span>R$ 0,00</span>
              </div>
            </div>

            {/* Bloco de Botões de Ação de Fluxo */}
            <div className="space-y-2">
              <button 
                onClick={openAddFlow}
                className="w-full bg-sky-600 hover:bg-sky-500 text-white p-3 rounded-xl font-sans font-bold text-sm tracking-wide transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Adicionar Produto (Manual)
              </button>

              {/* MOTO DO ERRO DE UI: Botões "Finalizar Compra" e "Cancelar Venda" lado a lado, mesma cor e tamanho */}
              {isCorrected ? (
                // LOUCO MODE RETIFICADO: Cores semânticas perfeitas, tamanhos adequados e organizados
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-neutral-800">
                  <button 
                    onClick={() => handleCriticalButtonClick('finish')}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-4 rounded-xl font-sans font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md hover:shadow-emerald-900/35 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" /> Finalizar Venda (Verde)
                  </button>
                  <button 
                    onClick={() => handleCriticalButtonClick('cancel')}
                    className="w-full bg-neutral-800 hover:bg-neutral-750 text-rose-400 border border-neutral-750 py-2.5 rounded-xl font-sans text-xs transition-colors cursor-pointer"
                  >
                    Cancelar Compra Corrente
                  </button>
                </div>
              ) : (
                // MODO DO ERRO: Dois botões vermelhos, idênticos, lado a lado para causar estragos no cérebro sob velocidade
                <div className="mt-4 pt-4 border-t border-neutral-800">
                  <div className="text-[9px] text-amber-400/80 mb-1.5 text-center font-sans tracking-tight">
                    ⚠️ Atenção: Área de Alto Risco! Qual botão de ação você quer?
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleCriticalButtonClick('finish')}
                      className="bg-red-600 hover:bg-red-700 text-white py-3.5 px-1 rounded-lg text-center font-sans font-bold text-xs transition-colors cursor-pointer"
                    >
                      FINALIZAR VENDA
                    </button>
                    <button 
                      onClick={() => handleCriticalButtonClick('cancel')}
                      className="bg-red-650 hover:bg-red-700 text-white py-3.5 px-1 rounded-lg text-center font-sans font-bold text-xs transition-colors cursor-pointer"
                    >
                      CANCELAR VENDA
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FEEDBACK DOS ERROS DO CAIXA (Se clicar nos botões no modo com bug) */}
        <AnimatePresence>
          {posErrorActive && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 bg-neutral-950/95 z-50 flex items-center justify-center p-6 text-center font-sans"
            >
              <div className="max-w-md bg-neutral-900 border-2 border-red-500 rounded-2xl p-6 shadow-2xl">
                <div className="w-14 h-14 bg-red-100/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-500 animate-bounce" />
                </div>
                
                {posErrorActive === 'cancel-disaster' ? (
                  <>
                    <h4 className="text-xl font-bold text-red-500 mb-2">💥 DESASTRE NO CAIXA DETECTADO!</h4>
                    <p className="text-sm text-zinc-350 leading-relaxed mb-4">
                      O operador de caixa estava correndo para atender uma fila enorme. Graças ao fato dos botões <span className="font-semibold text-white bg-red-600 px-1 rounded">FINALIZAR</span> e <span className="font-semibold text-white bg-red-650 px-1 rounded">CANCELAR</span> serem idênticos, lado a lado e vermelhos, ele clicou em "CANCELAR" por engano. Toda a compra foi apagada do sistema!
                    </p>
                    <div className="bg-black/35 p-3 rounded-lg text-xs leading-normal border border-neutral-800 text-left text-neutral-400 mb-4 font-mono">
                      <span className="text-amber-500 font-bold">Relatório do Erro:</span>
                      <ul className="list-disc pl-4 mt-1 space-y-1 text-[11px]">
                        <li>Falta de coerência cromática (vermelho deve sinalizar cancelamento, verde conclusão).</li>
                        <li>Falta de barreira de segurança (confirmação).</li>
                        <li>Falta de distanciamento entre ações opostas.</li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="text-xl font-bold text-amber-500 mb-2">⚠️ ESTADO DE CONFUSÃO DO OP!</h4>
                    <p className="text-sm text-zinc-350 leading-relaxed mb-4">
                      Você tentou clicar em finalizar, mas o botão vermelho induz pânico! O operador pensa que se clicar lá irá apagar os dados ("Vermelho" universalmente significa perigo ou cancelamento). Ele hesita, o cliente fica impaciente e o processo atrasa.
                    </p>
                  </>
                )}

                <div className="flex gap-2 justify-center">
                  <button 
                    onClick={() => setPosErrorActive(null)}
                    className="bg-neutral-850 hover:bg-neutral-750 text-white rounded-lg px-4 py-2 text-xs font-semibold transition-colors"
                  >
                    Voltar a Investigar
                  </button>
                  <button 
                    onClick={() => {
                      setPosErrorActive(null);
                      setIsCorrected(true);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-4 py-2 text-xs font-semibold transition-colors"
                  >
                    Ativar Correção Automática (Ajustar UX/UI)
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL DO FLUXO DE ADICIONAR PRODUTO (REPRESENTA O ERRO DE MULTIPLOS CLIQUES E PASSOS) */}
        <AnimatePresence>
          {showAddModal && (
            <div className="absolute inset-0 bg-neutral-950/80 z-40 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl font-sans"
              >
                {/* Modal Header */}
                <div className="bg-neutral-850 p-4 border-b border-neutral-800 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="p-1 px-2.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500 text-amber-950">
                      {isCorrected ? 'FLUXO SAUDÁVEL' : 'UX COMPLEXA'}
                    </span>
                    <h3 className="font-bold text-md text-zinc-100">Adicionar Item Manual</h3>
                  </div>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="text-zinc-400 hover:text-white p-1 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-5 space-y-4">
                  
                  {isCorrected ? (
                    // FLUXO DO MODO CORRIGIDO: Busca instantânea e amigável
                    <div className="space-y-3">
                      <p className="text-xs text-zinc-400 leading-normal">
                        No design saudável, o sistema permite digitar qualquer parte do nome ou simplesmente clicar na lista instantânea atualizada abaixo. O foco é economizar o precioso tempo do operador de caixa!
                      </p>
                      
                      {/* Campo simples com lista instantânea */}
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Digite o nome do produto..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none pl-9 font-mono"
                          autoFocus
                        />
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                      </div>

                      <div className="max-h-52 overflow-y-auto space-y-1.5 border border-neutral-850 p-2 rounded-lg bg-black/20 text-xs no-scrollbar">
                        {filteredProducts.map(p => (
                          <div 
                            key={p.code} 
                            onClick={() => {
                              setSelectedProduct(p);
                              confirmAddProduct();
                            }}
                            className="bg-neutral-850 hover:bg-neutral-800 p-2 rounded border border-neutral-800 cursor-pointer flex justify-between items-center transition-colors text-zinc-300"
                          >
                            <span className="font-bold">{p.name}</span>
                            <span className="text-emerald-400 font-mono font-bold">R$ {p.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // FLUXO DO MODO BUGADO DO EXCELSO DE PASSOS
                    <div className="space-y-4 text-xs font-mono">
                      {/* Passo 1 do fluxo */}
                      {searchStep === 'idle' && (
                        <div className="space-y-3">
                          <div className="bg-amber-950/20 border border-amber-900/40 p-3 rounded text-[11px] leading-relaxed text-amber-400 font-sans">
                            🚨 <strong>Alerta de Fluxo Antigo:</strong> Para prosseguir, digite obrigatoriamente o nome parcial abaixo, depois você precisará clicar em "Buscar" e aguardar o filtro de sincronia manual do banco legando mais tempo de resposta.
                          </div>
                          
                          <label className="text-zinc-400 block mb-1">Nome Completo do Item:</label>
                          <input 
                            type="text" 
                            placeholder="Ex: Óleo de Soja Liza 900ml"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-zinc-200 outline-none focus:border-red-500 font-mono"
                          />

                          <button 
                            onClick={startSearch}
                            disabled={!searchQuery.trim()}
                            className="w-full bg-amber-600 border border-amber-500 text-neutral-950 py-2.5 rounded font-sans font-bold hover:bg-amber-500 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            Passo 1: Clicar para Buscar <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Passo 2: Carregando simulado */}
                      {searchStep === 'searching' && (
                        <div className="text-center py-6 space-y-3 font-sans">
                          <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto"></div>
                          <span className="text-xs text-amber-500 font-bold block animate-pulse">
                            Aguardando resposta do Servidor Local... (Isso simula atraso irritante no caixa)
                          </span>
                        </div>
                      )}

                      {/* Passo 3: Exibindo Lista de Resultados */}
                      {searchStep === 'results' && (
                        <div className="space-y-3">
                          <span className="text-[10px] uppercase text-zinc-500 font-bold">Passo 2: Selecione o item correto na lista:</span>
                          <div className="max-h-44 overflow-y-auto space-y-1.5 border border-neutral-850 p-2 rounded text-xs pr-1 bg-black/40">
                            {filteredProducts.length === 0 ? (
                              <div className="text-center py-6 text-zinc-500">
                                Nenhum produto batendo com "{searchQuery}". Tente pesquisar "Óleo" ou "Café"!
                              </div>
                            ) : (
                              filteredProducts.map(p => (
                                <div 
                                  key={p.code}
                                  onClick={() => selectProduct(p)}
                                  className="border border-neutral-800 bg-neutral-900 hover:bg-neutral-850 p-2 rounded cursor-pointer flex justify-between items-center transition-all hover:border-amber-500"
                                >
                                  <span>{p.name}</span>
                                  <span className="text-amber-500">R$ {p.price.toFixed(2)}</span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}

                      {/* Passo 4: Digitar Quantidade */}
                      {searchStep === 'qty' && selectedProduct && (
                        <div className="space-y-3 text-xs">
                          <div className="bg-neutral-850 p-3 rounded border border-neutral-800">
                            <span className="text-[10px] text-zinc-500 block">PRODUTO SELECIONADO</span>
                            <span className="text-sm font-bold text-white font-sans">{selectedProduct.name}</span>
                            <span className="text-xs text-amber-400 block mt-0.5">Valor unitário: R$ {selectedProduct.price.toFixed(2)}</span>
                          </div>

                          <label className="text-zinc-400 block mb-1">Passo 3: Digite a Quantidade do Item:</label>
                          <input 
                            type="number" 
                            min="1"
                            max="99"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-zinc-200 outline-none focus:border-red-500 font-mono"
                          />

                          <button 
                            onClick={confirmAddProduct}
                            className="w-full bg-emerald-600 border border-emerald-500 text-white py-2.5 rounded font-sans font-bold hover:bg-emerald-500 transition-colors cursor-pointer"
                          >
                            Passo 4: Confirmar e Gravar no Carrinho
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                </div>

                {/* Modal Footer */}
                <div className="bg-neutral-900 border-t border-neutral-850 p-3 text-[10px] text-zinc-500 flex justify-between font-mono">
                  <span>SISTEMA DE FILA SUPER-FÁCIL</span>
                  <span>v1.0.4-Lento</span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Painel Lateral de Guia dos Detetives */}
      <div className={`flex-1 max-w-md bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col justify-between align-stretch self-stretch text-zinc-900 ${
        mobileTab === 'pistas' ? 'flex' : 'hidden sm:flex'
      }`}>
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-100">
            <div>
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-emerald-600 block">Caso Corporativo</span>
              <h3 className="font-sans font-bold text-xl text-neutral-800">Cenário 2: Sistema de PDV</h3>
            </div>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <ShoppingCart className="w-5 h-5 animate-pulse" />
            </span>
          </div>

          {/* Contexto dos Detetives */}
          <p className="text-xs text-neutral-600 leading-relaxed mb-4">
            <strong className="text-neutral-800">💼 Caso:</strong> Você agora está avaliando o sistema comercial de um supermercado onde tempo é dinheiro! O operador precisa de alta agilidade e as filas dependem do design correto do aplicativo. 
            Uma falha aqui gera atrasos dolorosos e perdas de clientes estressados.
          </p>

          <div className="p-3.5 bg-neutral-50/50 rounded-xl border border-zinc-100 text-xs text-neutral-600 mb-4">
            <div className="flex items-center gap-1.5 font-bold text-neutral-800 mb-1.5">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Como encontrar os bugs do Caixa?</span>
            </div>
            <ul className="space-y-1.5 list-disc pl-4 leading-normal">
              <li>Examine os botões de controle de fluxo de venda. Veja se as cores e pesos diferenciam <span className="font-semibold text-zinc-800 underline decoration-emerald-300">"Finalizar Compra" de "Cancelar Venda"</span>. Clique neles para testar.</li>
              <li>Experimente <span className="font-semibold text-zinc-800 underline decoration-emerald-300">"Adicionar Produto"</span> manualmente e passe por todos os passos solicitados para sentir o atrito de usabilidade crônico.</li>
            </ul>
          </div>

          {/* Status dos Erros Encontrados específicos desse cenário */}
          <div className="space-y-2 mb-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Erros Encontrados neste Caso ({foundBugs.filter(b => b.startsWith('pdv')).length}/2)
            </span>

            {[
              { id: 'pdv-ui-buttons', title: 'Botões Idênticos (Falta de Hierarquia)' },
              { id: 'pdv-ux-search', title: 'Busca Lenta (Fluxo Excessivo)' }
            ].map((bug) => {
              const detected = foundBugs.includes(bug.id);
              return (
                <div 
                  key={bug.id}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition-all ${
                    detected 
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800' 
                      : 'bg-zinc-50 border-zinc-200 text-zinc-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {detected ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-dashed border-zinc-300 shrink-0" />
                    )}
                    <span className={detected ? 'line-through opacity-80' : 'font-medium'}>{bug.title}</span>
                  </div>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                    detected ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-150 text-zinc-400'
                  }`}>
                    {detected ? 'REVELADO' : 'OCULTO'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Seleção de Correção do Protótipo */}
        <div className="border-t border-zinc-100 pt-4 mt-auto">
          <div className="flex items-center justify-between bg-zinc-50 p-2.5 rounded-xl border border-zinc-200/60 w-full">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <div className="text-[11px] leading-snug">
                <span className="block font-bold text-zinc-800">Modo de Comparação</span>
                <span className="text-zinc-500">Veja o antes e depois do caixa!</span>
              </div>
            </div>
            <button 
              onClick={() => setIsCorrected(!isCorrected)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all active:scale-95 ${
                isCorrected 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-750' 
                  : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-250'
              }`}
            >
              {isCorrected ? '💡 Desativar Correção' : '⚡ Corrigir Tela do Caixa'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
