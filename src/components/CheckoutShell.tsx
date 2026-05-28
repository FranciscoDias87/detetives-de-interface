import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  Lock, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Info,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface CheckoutShellProps {
  foundBugs: string[];
  onFindBug: (bugId: string) => void;
  isCorrected: boolean;
  setIsCorrected: (fixed: boolean) => void;
}

export default function CheckoutShell({ 
  foundBugs, 
  onFindBug, 
  isCorrected, 
  setIsCorrected 
}: CheckoutShellProps) {
  const [mobileTab, setMobileTab] = useState<'form' | 'pistas'>('form');
  
  // Estados do formulário de checkout
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardCpf, setCardCpf] = useState('');
  const [isPayClicked, setIsPayClicked] = useState(false);
  const [payStatus, setPayStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');

  // Máscaras automáticas no modo corrigido
  const handleCardNumberChange = (value: string) => {
    if (isCorrected) {
      // Limita a números e formata de 4 em 4
      const digits = value.replace(/\D/g, '').substring(0, 16);
      const parts = [];
      for (let i = 0; i < digits.length; i += 4) {
        parts.push(digits.substring(i, i + 4));
      }
      setCardNumber(parts.join(' '));
    } else {
      setCardNumber(value);
    }
  };

  const handleCardExpiryChange = (value: string) => {
    if (isCorrected) {
      const digits = value.replace(/\D/g, '').substring(0, 4);
      if (digits.length > 2) {
        setCardExpiry(`${digits.substring(0, 2)}/${digits.substring(2, 4)}`);
      } else {
        setCardExpiry(digits);
      }
    } else {
      setCardExpiry(value);
    }
  };

  const handleCvvChange = (value: string) => {
    const digits = value.replace(/\D/g, '').substring(0, 4);
    setCardCvv(digits);
  };

  const handleCpfChange = (value: string) => {
    if (isCorrected) {
      const digits = value.replace(/\D/g, '').substring(0, 11);
      let masked = digits;
      if (digits.length > 9) {
        masked = `${digits.substring(0, 3)}.${digits.substring(3, 6)}.${digits.substring(6, 9)}-${digits.substring(9, 11)}`;
      } else if (digits.length > 6) {
        masked = `${digits.substring(0, 3)}.${digits.substring(3, 6)}.${digits.substring(6, 9)}`;
      } else if (digits.length > 3) {
        masked = `${digits.substring(0, 3)}.${digits.substring(3, 6)}`;
      }
      setCardCpf(masked);
    } else {
      setCardCpf(value);
    }
  };

  // Clique na ára de falta de labels (Placeholders que somem)
  const handleLabelAreaClick = () => {
    if (!isCorrected && !foundBugs.includes('checkout-ui-labels')) {
      onFindBug('checkout-ui-labels');
    }
  };

  // Clique no botão "Limpar Tudo" perigoso
  const handleClearForm = () => {
    setCardName('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setCardCpf('');
    setPayStatus('idle');
    
    if (!isCorrected && !foundBugs.includes('checkout-ux-clear')) {
      onFindBug('checkout-ux-clear');
    }
  };

  const handleCardFieldClick = () => {
    // Clicar em campos sem máscara ajuda a deduzir a falta de formatação adaptativa
    if (!isCorrected && !foundBugs.includes('checkout-ui-mask')) {
      onFindBug('checkout-ui-mask');
    }
  };

  // Simulação de transação
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPayClicked(true);

    if (!cardName || !cardNumber || !cardExpiry || !cardCvv || !cardCpf) {
      alert("Preencha todos os campos para testar a finalização.");
      return;
    }

    setPayStatus('loading');
    
    setTimeout(() => {
      if (!isCorrected) {
        setPayStatus('error');
        // Se falhou no final e o bug de máscara/validação tardia não foi selecionado, ajuda a achar
        if (!foundBugs.includes('checkout-ui-mask')) {
          onFindBug('checkout-ui-mask');
        }
      } else {
        setPayStatus('success');
      }
    }, 1500);
  };

  // Validação em tempo real (inline) das entradas (só exibido no corrigido)
  const isCardNumberValid = cardNumber.replace(/\s/g, '').length === 16;
  const isCardExpiryValid = cardExpiry.includes('/') && cardExpiry.length === 5;
  const isCvvValid = cardCvv.length >= 3;
  const isCpfValid = cardCpf.replace(/\D/g, '').length === 11;
  const isCardNameValid = cardName.trim().split(' ').length >= 2;

  return (
    <div className="flex flex-col xl:flex-row gap-6 items-center lg:items-start justify-center p-2 sm:p-4 w-full max-w-5xl mx-auto font-sans">
      
      {/* Seletor Segmentado para Mobile */}
      <div className="sm:hidden flex w-full bg-slate-150 p-1 rounded-xl border border-slate-200/60 mb-2 gap-1">
        <button 
          type="button"
          onClick={() => setMobileTab('form')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
            mobileTab === 'form' 
              ? 'bg-orange-500 text-white shadow-sm' 
              : 'text-slate-600'
          }`}
        >
          📱 Compra Mobile
        </button>
        <button 
          type="button"
          onClick={() => setMobileTab('pistas')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
            mobileTab === 'pistas' 
              ? 'bg-orange-500 text-white shadow-sm' 
              : 'text-slate-600'
          }`}
        >
          🔍 Pistas ({foundBugs.filter(b => b.startsWith('checkout')).length}/3)
        </button>
      </div>

      {/* Simulador de Celular do Checkout */}
      <div className={`relative w-[340px] h-[670px] bg-neutral-950 rounded-[44px] shadow-2xl border-[10px] border-neutral-900 flex flex-col overflow-hidden shrink-0 select-none ${
        mobileTab === 'form' ? 'flex' : 'hidden sm:flex'
      }`}>
        {/* Notch */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-neutral-900 rounded-b-2xl z-50 flex items-center justify-between px-4">
          <div className="w-12 h-1 bg-neutral-800 rounded-full"></div>
          <div className="w-2.5 h-2.5 bg-neutral-850 rounded-full"></div>
        </div>

        {/* Barra de Status */}
        <div className="h-8 bg-neutral-950 flex justify-between items-center px-6 pt-3 text-[10px] font-mono text-neutral-450 z-40">
          <span>12:30</span>
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-zinc-500 mr-1">5G</span>
            <div className="w-4 h-2 border border-zinc-650 rounded-sm"></div>
          </div>
        </div>

        {/* App Container */}
        <div className="flex-1 bg-slate-50 flex flex-col overflow-y-auto no-scrollbar text-slate-800 relative">
          
          {/* Header do App de E-commerce */}
          <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-2 font-bold text-xs sticky top-0 z-30 justify-between">
            <div className="flex items-center gap-1.5 text-slate-800">
              <span className="text-sm">⚡</span>
              <div>
                <p className="font-bold leading-none">Checkout Seguro</p>
                <p className="text-[8px] text-slate-450 font-normal mt-0.5">VIA VIP-TRAVEL AGENCY</p>
              </div>
            </div>
            {!isCorrected && (
              <span className="text-[8px] font-mono font-bold tracking-widest text-orange-600 bg-orange-100/70 border border-orange-200 px-1.5 py-0.5 rounded uppercase animate-pulse flex items-center gap-0.5">
                <AlertTriangle className="w-2 h-2" /> Buggy UI
              </span>
            )}
          </div>

          {/* Carrinho Resumido */}
          <div className="p-3.5 bg-zinc-100 border-b border-slate-200 text-xs">
            <div className="flex justify-between items-center font-bold">
              <span>Pacote Natal Luz: Gramado/RS</span>
              <span className="text-zinc-900">R$ 180,00</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">1x Acomodação Standard • Transfer Grátis</p>
          </div>

          {/* Core Interactive Payment Card Form */}
          <form onSubmit={handlePaymentSubmit} className="p-4 flex-1 flex flex-col gap-4 text-left justify-between">
            <div className="flex flex-col gap-3.5">
              
              {/* Box Ilustrativo do Cartão de Crédito Fictício */}
              <div className="bg-gradient-to-br from-slate-800 to-indigo-900 text-white rounded-xl p-4 shadow-sm flex flex-col justify-between h-34 relative overflow-hidden transition-all">
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full pointer-events-none"></div>
                
                <div className="flex justify-between items-start">
                  <span className="text-xs font-mono font-bold tracking-widest text-zinc-300">CARD DE CRÉDITO</span>
                  <CreditCard className="w-6 h-6 text-indigo-300" />
                </div>

                <div className="my-1">
                  <p className="text-xs tracking-widest font-mono text-zinc-100 min-h-[16px]">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </p>
                </div>

                <div className="flex justify-between items-end text-[10px] font-mono">
                  <div>
                    <span className="text-[8px] text-zinc-400 block uppercase">Titular</span>
                    <span className="truncate max-w-[150px] inline-block font-bold">{cardName.toUpperCase() || 'M. INVESTIGADOR'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] text-zinc-400 block uppercase">Validade</span>
                    <span className="font-bold">{cardExpiry || 'MM/AA'}</span>
                  </div>
                </div>
              </div>

              {/* Formulário - Elementos com Erros Práticos */}
              <div className="flex flex-col gap-3">
                
                {/* Campo 1: Número do Cartão */}
                <div className="relative">
                  {isCorrected ? (
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-650 flex items-center justify-between mb-0.5">
                      Número do Cartão de Crédito
                      {isCardNumberValid && <span className="text-emerald-600 text-[9px] font-mono">✓ VÁLIDO</span>}
                    </label>
                  ) : (
                    // Clicar nesta label oculta (ou área correspondente) ajuda a identificar o bug de placeholders sumindo
                    <div 
                      onClick={handleLabelAreaClick}
                      className="h-2 cursor-pointer group"
                      title="Clique para auditar labels"
                    >
                      <span className="text-[9px] text-transparent group-hover:text-amber-600 font-mono transition-colors">⚠️ Falta de Rótulo Fixo! Detector</span>
                    </div>
                  )}
                  
                  <div className="relative">
                    <input 
                      type="text"
                      value={cardNumber}
                      onClick={handleCardFieldClick}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      placeholder={isCorrected ? "0000 0000 0000 0000" : "Número do Cartão (sem espaços ou letras)"}
                      className={`w-full bg-white border rounded-lg px-3 py-2 text-xs outline-none transition-all ${
                        isCorrected 
                          ? isCardNumberValid
                            ? 'border-emerald-500 focus:ring-1 focus:ring-emerald-400'
                            : 'border-slate-350 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                          : `border-slate-300 hover:border-amber-400 ${
                              foundBugs.includes('checkout-ui-mask') ? 'border-amber-500 focus:ring-2 focus:ring-amber-200' : 'focus:border-slate-500'
                            }`
                      }`}
                    />
                    {!isCorrected && (
                      <button 
                        type="button"
                        onClick={() => onFindBug('checkout-ui-labels')}
                        className="absolute right-2 top-2.5 text-amber-500/75 hover:text-amber-600 transition-colors"
                        title="Dica de UX"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Campo 2: Nome do Titular */}
                <div>
                  {isCorrected ? (
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-650 flex justify-between mb-0.5">
                      Nome Impresso no Cartão
                      {isCardNameValid && <span className="text-emerald-600 text-[9px] font-mono font-bold">✓ VÁLIDO</span>}
                    </label>
                  ) : (
                    <div onClick={handleLabelAreaClick} className="h-2 cursor-pointer" />
                  )}
                  <input 
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder={isCorrected ? "Ex: JULIA SILVA SANTOS" : "Nome do Titular do Cartão"}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-505 transition-all"
                  />
                </div>

                {/* Linha de Inputs Compostos (Validade e CVV) */}
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Validade */}
                  <div className="relative">
                    {isCorrected ? (
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-650 flex justify-between mb-0.5">
                        Validade
                        {isCardExpiryValid && <span className="text-emerald-600 text-[8px]">✓ OK</span>}
                      </label>
                    ) : (
                      <div onClick={handleLabelAreaClick} className="h-2 cursor-pointer" />
                    )}
                    <input 
                      type="text"
                      value={cardExpiry}
                      onClick={handleCardFieldClick}
                      onChange={(e) => handleCardExpiryChange(e.target.value)}
                      placeholder={isCorrected ? "MM/AA" : "Validade do Cartão (MMAA)"}
                      className={`w-full bg-white border rounded-lg px-3 py-2 text-xs outline-none transition-all ${
                        isCorrected 
                          ? isCardExpiryValid ? 'border-emerald-500' : 'border-slate-350'
                          : 'border-slate-300'
                      }`}
                    />
                  </div>

                  {/* CVV */}
                  <div>
                    {isCorrected ? (
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-650 flex justify-between mb-0.5">
                        CVV (Segurança)
                        {isCvvValid && <span className="text-emerald-600 text-[8px]">✓ OK</span>}
                      </label>
                    ) : (
                      <div onClick={handleLabelAreaClick} className="h-2 cursor-pointer" />
                    )}
                    <input 
                      type="text"
                      value={cardCvv}
                      onChange={(e) => handleCvvChange(e.target.value)}
                      placeholder="CVV"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Campo 4: CPF do Titular */}
                <div>
                  {isCorrected ? (
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-650 flex justify-between mb-0.5">
                      CPF do Titular do Cartão
                      {isCpfValid && <span className="text-emerald-600 text-[9px] font-mono">✓ VÁLIDO</span>}
                    </label>
                  ) : (
                    <div onClick={handleLabelAreaClick} className="h-2 cursor-pointer" />
                  )}
                  <input 
                    type="text"
                    value={cardCpf}
                    onClick={handleCardFieldClick}
                    onChange={(e) => handleCpfChange(e.target.value)}
                    placeholder={isCorrected ? "000.000.000-00" : "CPF do Titular (apenas números)"}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none transition-all"
                  />
                </div>

              </div>

              {/* Alerta de erro tardio simulado na versão bugada */}
              {isPayClicked && payStatus === 'error' && (
                <div 
                  onClick={() => onFindBug('checkout-ui-mask')}
                  className="bg-rose-100 border border-rose-300 text-rose-800 text-[10px] p-2.5 rounded-lg font-serif cursor-pointer hover:bg-rose-150 animate-shake"
                >
                  ❌ <strong>Erro no Servidor checkout-5002:</strong> Formato de data ("{cardExpiry}") ou número de dígitos do cartão inválido. Por favor, remova caracteres, insira máscara correta e submeta novamente para processamento.
                </div>
              )}

              {/* Alerta de sucesso verificado */}
              {payStatus === 'success' && (
                <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] p-2.5 rounded-lg flex items-center gap-1.5 font-bold animate-bounce">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Transação Concluída com Sucesso! R$ 180,00 Reservados.
                </div>
              )}
            </div>

            {/* Botoes de Controle e Gatilhos dos Erros */}
            <div className="flex flex-col gap-2 mt-4">
              
              {payStatus === 'loading' ? (
                <div className="w-full bg-slate-900 text-white rounded-lg p-3 text-center text-xs font-bold font-sans flex items-center justify-center gap-1.5">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Processando compra segura...
                </div>
              ) : (
                <div className="flex gap-2">
                  
                  {/* Botão destrutivo "Limpar Tudo":
                      - No Buggy Mode: Lado a Lado, idêntico ao de pagar, sem contraste hierárquico.
                      - No Corrected Mode: Eliminado ou transformado em botão neutro ultra discreto de texto.
                  */}
                  {!isCorrected ? (
                    <button
                      type="button"
                      onClick={handleClearForm}
                      className="flex-1 bg-red-650 hover:bg-red-700 text-white p-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                      title="Limpar todos os campos"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Limpar Tudo
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleClearForm}
                      className="text-neutral-400 hover:text-rose-500 hover:underline text-[9px] font-bold p-1 transition-all text-center self-center"
                    >
                      Limpar Form
                    </button>
                  )}

                  {/* Botão primário "Pagar Agora" */}
                  <button
                    type="submit"
                    className={`flex-2 p-3 rounded-lg text-xs font-bold text-white shadow transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer ${
                      isCorrected 
                        ? 'bg-emerald-600 hover:bg-emerald-505 shadow-emerald-200 shadow-md' 
                        : 'bg-red-650 hover:bg-red-700'
                    }`}
                  >
                    Confirmar Pagamento
                  </button>
                </div>
              )}

              <div className="flex justify-center items-center gap-1 text-[8px] text-zinc-400 font-mono mt-1">
                <Lock className="w-2.5 h-2.5 text-zinc-450" /> criptografia TLS SSL de ponta a ponta
              </div>
            </div>

          </form>
        </div>
      </div>

      {/* Painel Lateral de Direcionamento das Investigação */}
      <div className={`flex-1 max-w-md bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col justify-between align-stretch self-stretch ${
        mobileTab === 'pistas' ? 'flex' : 'hidden sm:flex'
      }`}>
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-100">
            <div>
              <span className="text-[9px] font-mono tracking-widest text-orange-500 uppercase font-bold">FASE 2 • NÍVEL INTERMEDIÁRIO</span>
              <h3 className="font-serif font-black text-lg text-neutral-850 uppercase">Caso 3: O Funil Quebrado</h3>
            </div>
            <div className="p-1 px-2.5 rounded bg-orange-100/60 text-orange-700 font-mono font-bold text-[10px] tracking-tight">
              Atrito de Checkout
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            Em e-commerces, o preenchimento de faturamento é a etapa onde há a maior perda de conversão. Qualquer impedimento, clique extra ou perda de dados faz o cliente recuar de comprar.
          </p>

          <div className="border-t border-slate-100 my-4"></div>

          {/* Seção das pistas de erro na tela */}
          <div className="space-y-3.5">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-450">Bugs a serem coletados neste caso:</h4>
            
            {/* Bug 1 Card */}
            <div 
              onClick={() => {
                if (!isCorrected) onFindBug('checkout-ui-labels');
              }}
              className={`p-3 rounded-xl border text-xs text-left cursor-pointer transition-all duration-300 relative overflow-hidden ${
                foundBugs.includes('checkout-ui-labels')
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-850'
                  : 'bg-slate-50 border-slate-150 hover:border-amber-300 text-slate-700'
              }`}
            >
              <div className="flex justify-between items-center font-bold">
                <span>🔍 #01: O Segredo Invisível</span>
                {foundBugs.includes('checkout-ui-labels') ? (
                  <span className="text-[9px] text-emerald-700 font-mono font-bold">REVELADO</span>
                ) : (
                  <span className="text-[9px] text-amber-600 font-mono font-bold flex items-center gap-0.5 animate-pulse">INVESTIGAR</span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                "Onde foi que eu devia digitar meu CPF mesmo?" Descubra o problema ao digitar dados em campos que removem o texto instrutivo.
              </p>
              {foundBugs.includes('checkout-ui-labels') && (
                <div className="mt-2 text-[9px] bg-white/80 p-1.5 rounded text-emerald-800 leading-tight">
                  <strong>Efeito:</strong> Usar placeholders como substituidores de labels apaga a identificação dos inputs ao escrever, causando desorientação.
                </div>
              )}
            </div>

            {/* Bug 2 Card */}
            <div 
              onClick={() => {
                if (!isCorrected) onFindBug('checkout-ux-clear');
              }}
              className={`p-3 rounded-xl border text-xs text-left cursor-pointer transition-all duration-300 relative overflow-hidden ${
                foundBugs.includes('checkout-ux-clear')
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-850'
                  : 'bg-slate-50 border-slate-150 hover:border-amber-300 text-slate-700'
              }`}
            >
              <div className="flex justify-between items-center font-bold">
                <span>🔍 #02: A Armadilha de Limpeza</span>
                {foundBugs.includes('checkout-ux-clear') ? (
                  <span className="text-[9px] text-emerald-700 font-mono font-bold">REVELADO</span>
                ) : (
                  <span className="text-[9px] text-amber-600 font-mono font-bold flex items-center gap-0.5 animate-pulse">INVESTIGAR</span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                Um botão que detona 2 minutos de digitação do cliente em menos de um segundo. Onde estão posicionados os botões com a mesma cor?
              </p>
              {foundBugs.includes('checkout-ux-clear') && (
                <div className="mt-2 text-[9px] bg-white/80 p-1.5 rounded text-emerald-800 leading-tight">
                  <strong>Efeito:</strong> Uma ação destrutiva ao lado do botão de sucesso, com o mesmo visual, induz cliques catastróficos em telas menores.
                </div>
              )}
            </div>

            {/* Bug 3 Card */}
            <div 
              onClick={() => {
                if (!isCorrected) onFindBug('checkout-ui-mask');
              }}
              className={`p-3 rounded-xl border text-xs text-left cursor-pointer transition-all duration-300 relative overflow-hidden ${
                foundBugs.includes('checkout-ui-mask')
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-850'
                  : 'bg-slate-50 border-slate-150 hover:border-amber-300 text-slate-700'
              }`}
            >
              <div className="flex justify-between items-center font-bold">
                <span>🔍 #03: O Erro em Lote Tarde Demais</span>
                {foundBugs.includes('checkout-ui-mask') ? (
                  <span className="text-[9px] text-emerald-700 font-mono font-bold">REVELADO</span>
                ) : (
                  <span className="text-[9px] text-amber-600 font-mono font-bold flex items-center gap-0.5 animate-pulse">INVESTIGAR</span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                Por que o celular não me ajuda a pontuar o cartão? Digite dados brutos e tente pagar para descobrir a falta de feedback instantâneo.
              </p>
              {foundBugs.includes('checkout-ui-mask') && (
                <div className="mt-2 text-[9px] bg-white/80 p-1.5 rounded text-emerald-800 leading-tight">
                  <strong>Efeito:</strong> A falta de máscaras físicas aumentam as chances de digitação errada e validação apenas no servidor remoto frustra o cliente.
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Rodapé Interno com Controle e Teclas de Alternar Estado de Conserto */}
        <div className="border-t border-slate-150 pt-4 mt-6">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isCorrected ? 'bg-emerald-500' : 'bg-red-505 animate-pulse'}`}></span>
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">ESTADO DA INTERFACE</span>
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
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
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
