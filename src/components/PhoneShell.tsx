import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  MoreHorizontal, 
  Search, 
  Home, 
  PlusSquare, 
  Compass, 
  CornerDownRight,
  User,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Wifi,
  Battery,
  AlertTriangle
} from 'lucide-react';

interface PhoneShellProps {
  foundBugs: string[];
  onFindBug: (bugId: string) => void;
  isCorrected: boolean;
  setIsCorrected: (fixed: boolean) => void;
}

export default function PhoneShell({ 
  foundBugs, 
  onFindBug, 
  isCorrected, 
  setIsCorrected 
}: PhoneShellProps) {
  const [mobileTab, setMobileTab] = useState<'app' | 'pistas'>('app');
  const [activeMenuPostId, setActiveMenuPostId] = useState<number | null>(null);
  const [showTripleClickHint, setShowTripleClickHint] = useState(false);
  const [clicksCount, setClicksCount] = useState<{ [postId: number]: number }>({});
  const [showCommentsId, setShowCommentsId] = useState<number | null>(null);
  const [commentsList, setCommentsList] = useState<{ [postId: number]: string[] }>({
    1: ['Incrível! 🤠', 'Que foto linda!', 'Arrasou demais!'],
    2: ['Meu sonho de viagem 😍', 'Que lugar fantástico', 'Me leva junto!']
  });
  const [newCommentInput, setNewCommentInput] = useState('');
  const [likes, setLikes] = useState<{ [postId: number]: boolean }>({});
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  const posts = [
    {
      id: 1,
      user: 'julia.viajei',
      avatarGradient: 'from-pink-500 to-rose-400',
      location: 'Praia de Copacabana, Rio',
      imageUrl: 'from-blue-400 via-teal-100 to-amber-200',
      imageEmoji: '🏖️🌅',
      caption: 'Aproveitando o final de tarde perfeito no Rio! Sol, mar e essa brisa indescritível... ✨ #verao #trip',
      likes: 124,
    },
    {
      id: 2,
      user: 'gourmet_lucas',
      avatarGradient: 'from-amber-500 to-orange-400',
      location: 'Bistrô Paris 6, São Paulo',
      imageUrl: 'from-orange-400 via-amber-200 to-red-300',
      imageEmoji: '🥞🍓☕',
      caption: 'Brunch de domingo super especial! O waffle de morango com chocolate belga estava simplesmente espetacular. Recomendo muito! 🥐🥞',
      likes: 89,
    }
  ];

  // Identificação do Erro de UI: Baixo Contraste nas Legendas e Nomes de Usuários
  const handleCaptionClick = () => {
    if (!isCorrected && !foundBugs.includes('social-ui-contrast')) {
      onFindBug('social-ui-contrast');
    }
  };

  // Clique no menu de três pontos (onde o Curtiu está oculto no modo bugado)
  const togglePostMenu = (postId: number) => {
    if (activeMenuPostId === postId) {
      setActiveMenuPostId(null);
    } else {
      setActiveMenuPostId(postId);
    }
  };

  // Clique "Curtir" oculto no menu de três pontos
  const handleLikeInMenu = (postId: number) => {
    setLikes(prev => ({ ...prev, [postId]: !prev[postId] }));
    setActiveMenuPostId(null);
    if (!isCorrected && !foundBugs.includes('social-ux-like')) {
      onFindBug('social-ux-like');
    }
  };

  // Curtir diretamente (só disponível no modo corrigido)
  const handleDirectLike = (postId: number) => {
    setLikes(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Erro de comentários com 3 cliques na imagem no modo bugado
  const handleImageClick = (postId: number) => {
    if (isCorrected) {
      // No modo corrigido, duplo clique curte (comportamento nativo saudável)
      setLikes(prev => ({ ...prev, [postId]: true }));
      return;
    }

    const currentClicks = (clicksCount[postId] || 0) + 1;
    setClicksCount(prev => ({ ...prev, [postId]: currentClicks }));

    if (currentClicks === 1) {
      setShowTripleClickHint(true);
      setTimeout(() => setShowTripleClickHint(false), 2500);
    }

    if (currentClicks >= 3) {
      // Ativou o comentário por triplo clique! Erro de UX detectado
      setShowCommentsId(postId);
      setClicksCount(prev => ({ ...prev, [postId]: 0 }));
      if (!foundBugs.includes('social-ux-comments')) {
        onFindBug('social-ux-comments');
      }
    }

    // Resetar cliques após 1.5s de inatividade
    setTimeout(() => {
      setClicksCount(prev => ({ ...prev, [postId]: 0 }));
    }, 1500);
  };

  const handleCommentsIconClick = (postId: number) => {
    if (isCorrected) {
      setShowCommentsId(showCommentsId === postId ? null : postId);
    } else {
      // No modo bugado, clicar no ícone inexistente ou tentar interagir avisa
      alert('Puxa! Não há botão de comentários visível! Os comentários só abrem secretamente com 3 toques na imagem.');
    }
  };

  const handleAddComment = (postId: number) => {
    if (!newCommentInput.trim()) return;
    setCommentsList(prev => ({
      ...prev,
      [postId]: [...prev[postId], newCommentInput.trim()]
    }));
    setNewCommentInput('');
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 items-center lg:items-start justify-center p-2 sm:p-4 w-full max-w-5xl mx-auto">
      {/* Seletor Segmentado Exclusivo para Telas Mobile */}
      <div className="sm:hidden flex w-full bg-slate-150 p-1 rounded-xl border border-slate-200/60 mb-2 gap-1">
        <button 
          type="button"
          onClick={() => setMobileTab('app')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'app' 
              ? 'bg-sky-500 text-white shadow-sm' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📱 Simulador SocialCam
        </button>
        <button 
          type="button"
          onClick={() => setMobileTab('pistas')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'pistas' 
              ? 'bg-sky-500 text-white shadow-sm' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🔍 Pistas & Bugs ({foundBugs.filter(b => b.startsWith('social')).length}/3)
        </button>
      </div>

      {/* Container do Celular */}
      <div className={`relative w-full max-w-[340px] h-[580px] sm:h-[670px] bg-neutral-900 rounded-[32px] sm:rounded-[44px] shadow-2xl border-4 sm:border-[10px] border-neutral-800 flex flex-col overflow-hidden shrink-0 select-none ${
        mobileTab === 'app' ? 'flex' : 'hidden sm:flex'
      }`}>
        {/* Notch - Alto Falante e Câmera */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-neutral-800 rounded-b-2xl z-50 flex items-center justify-between px-4 sm:flex hidden">
          <div className="w-12 h-1 bg-neutral-750 rounded-full"></div>
          <div className="w-2.5 h-2.5 bg-neutral-900 rounded-full"></div>
        </div>

        {/* Barra de Status */}
        <div className="h-4 sm:h-8 bg-neutral-900 flex justify-between items-center px-6 pt-1 sm:pt-3 text-[9px] sm:text-[10px] font-mono text-neutral-400 z-40">
          <span>09:41</span>
          <div className="flex items-center gap-1">
            <Wifi className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <Battery className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>
        </div>

        {/* Corpo Interno do Aplicativo */}
        <div className="flex-1 bg-white flex flex-col overflow-y-auto no-scrollbar pt-1 pb-12 text-zinc-900">
          
          {/* Cabeçalho do App Social */}
          <header className="h-12 border-b border-zinc-100 flex items-center justify-between px-4 shrink-0 bg-white sticky top-0 z-30">
            <span className="font-serif font-bold text-xl tracking-tight text-neutral-800 flex items-center gap-1.5">
              SocialCam
              {!isCorrected && (
                <span className="text-[9px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center gap-0.5 animate-pulse">
                  <AlertTriangle className="w-2 h-2" /> Buggy UI
                </span>
              )}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-sky-500 cursor-pointer">Feed</span>
            </div>
          </header>

          {/* Feed de Posts */}
          <div className="flex-1 flex flex-col bg-zinc-50">
            {posts.map(post => {
              const isLiked = likes[post.id];
              const isPostCommentsOpen = showCommentsId === post.id;
              
              return (
                <div key={post.id} className="bg-white mb-3 border-y border-zinc-100 flex flex-col">
                  {/* Cabeçalho do Post */}
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${post.avatarGradient} flex items-center justify-center text-white text-xs font-bold font-mono`}>
                        {post.user[0].toUpperCase()}
                      </div>
                      <div className="flex flex-col leading-tight">
                        {/* BUG DE UI: Nome do usuário super claro no modo bugado */}
                        <span 
                          onClick={handleCaptionClick}
                          onMouseEnter={() => !isCorrected && setHoveredElement('username')}
                          onMouseLeave={() => setHoveredElement(null)}
                          className={`text-xs font-bold cursor-pointer transition-colors duration-250 ${
                            isCorrected 
                              ? 'text-zinc-900 hover:text-sky-500' 
                              : `text-yellow-250 bg-yellow-50/50 rounded px-1 -mx-1 border border-transparent ${
                                  foundBugs.includes('social-ui-contrast') 
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800' 
                                    : 'hover:border-amber-300 hover:bg-amber-50'
                                }`
                          }`}
                        >
                          {post.user}
                        </span>
                        {/* BUG DE UI: Localização super clara no modo bugado */}
                        <span 
                          onClick={handleCaptionClick}
                          className={`text-[10px] cursor-pointer transition-colors ${
                            isCorrected 
                              ? 'text-zinc-500' 
                              : `text-zinc-250 bg-gray-50/80 rounded px-1 -mx-1 ${
                                  foundBugs.includes('social-ui-contrast') 
                                    ? 'text-emerald-700 bg-emerald-55 border border-emerald-500' 
                                    : 'hover:bg-amber-50'
                                }`
                          }`}
                        >
                          {post.location}
                        </span>
                      </div>
                    </div>

                    {/* Botão de Mais Opções */}
                    <div className="relative">
                      <button 
                        onClick={() => togglePostMenu(post.id)}
                        className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 transition-colors"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>

                      {/* Menu de Três Pontos (Onde o Curtir está escondido no Bug) */}
                      <AnimatePresence>
                        {activeMenuPostId === post.id && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -5 }}
                            className="absolute right-0 top-8 bg-white border border-zinc-250 rounded-xl shadow-lg py-1 w-36 z-50 text-left text-xs text-zinc-700"
                          >
                            <button className="w-full text-left px-3 py-2 hover:bg-zinc-50">Compartilhar</button>
                            <button className="w-full text-left px-3 py-2 hover:bg-zinc-50">Salvar publicação</button>
                            
                            {/* BUG DE UX DE CURTIR: Forçar o like pelo menu de opções no modo bugado */}
                            {!isCorrected && (
                              <button 
                                onClick={() => handleLikeInMenu(post.id)}
                                className={`w-full text-left px-3 py-2 font-semibold flex items-center gap-1.5 transition-colors ${
                                  foundBugs.includes('social-ux-like') 
                                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                                }`}
                              >
                                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-neutral-500'}`} />
                                {isLiked ? 'Descurtir' : 'Curtir Post'}
                              </button>
                            )}
                            
                            <button className="w-full text-left px-3 py-2 hover:bg-zinc-50 border-t border-zinc-100 text-red-500">Denunciar</button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Imagem do Post (Área clicável para a dinâmica) */}
                  <div 
                    onClick={() => handleImageClick(post.id)}
                    className={`relative aspect-square bg-gradient-to-br ${post.imageUrl} flex items-center justify-center cursor-pointer overflow-hidden border-y border-zinc-100`}
                  >
                    <span className="text-6xl drop-shadow-md transform hover:scale-110 transition-transform duration-300">
                      {post.imageEmoji}
                    </span>

                    {/* Feedback visual de cliques */}
                    {!isCorrected && clicksCount[post.id] > 0 && (
                      <div className="absolute inset-x-0 bottom-4 flex justify-center z-20">
                        <div className="bg-slate-900/95 text-white border border-amber-500/30 px-3 py-1.5 rounded-full text-[10px] font-mono shadow-md flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                          Toques na imagem: {clicksCount[post.id]}/3
                        </div>
                      </div>
                    )}

                    {/* Ícone gigante de coração ao dar like no modo corrigido */}
                    {isCorrected && isLiked && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      >
                        <Heart className="w-24 h-24 text-red-500 fill-red-500 drop-shadow-lg" />
                      </motion.div>
                    )}
                  </div>

                  {/* Barra de Ações Rápidas */}
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-4">
                      {/* BOTÕES DE AÇÃO: Curioso modo BUGADO vs Saudável */}
                      {isCorrected ? (
                        <>
                          {/* Curtir diretamente */}
                          <button 
                            onClick={() => handleDirectLike(post.id)}
                            className="p-1 hover:bg-zinc-100 rounded-full transition-colors text-zinc-700 hover:text-red-500"
                          >
                            <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                          </button>
                          {/* Comentários diretamente */}
                          <button 
                            onClick={() => handleCommentsIconClick(post.id)}
                            className="p-1 hover:bg-zinc-100 rounded-full transition-colors text-zinc-700 hover:text-sky-500"
                          >
                            <MessageCircle className="w-6 h-6" />
                          </button>
                        </>
                      ) : (
                        <div className="text-[10px] font-mono text-zinc-400 max-w-xs leading-tight">
                          ⚠️ <span className="underline">Sem botões rápidos de interação!</span> Tente achar onde o botão de curtir foi escondido ou dê múltiplos toques rápidos na foto.
                        </div>
                      )}
                      
                      {isCorrected && (
                        <button className="p-1 hover:bg-zinc-100 rounded-full transition-colors text-zinc-700">
                          <Send className="w-6 h-6" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Contagem de curtidas e legenda */}
                  <div className="px-3 pb-3">
                    <span className="text-xs font-bold text-zinc-800 tracking-tight block mb-1">
                      {post.likes + (isLiked ? 1 : 0)} curtidas
                    </span>
                    
                    {/* Legenda com BUG/Ajustada */}
                    <div className="text-xs leading-relaxed">
                      <span className="font-bold mr-1.5 text-zinc-900">{post.user}</span>
                      <span 
                        onClick={handleCaptionClick}
                        className={`transition-colors cursor-pointer ${
                          isCorrected 
                            ? 'text-zinc-700' 
                            : `text-zinc-400 bg-gray-50/50 rounded px-1 -mx-0.5 border border-transparent inline-block ${
                                foundBugs.includes('social-ui-contrast') 
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-medium' 
                                  : 'hover:border-amber-300 hover:bg-amber-50'
                              }`
                        }`}
                      >
                        {post.caption}
                      </span>
                    </div>

                    {/* Espaço de Amostra de Comentários ou Alerta dependendo do modo */}
                    {isPostCommentsOpen && (
                      <div className="mt-3 pt-2.5 border-t border-zinc-100">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 block mb-1.5 font-mono">
                          Comentários do Post ({commentsList[post.id].length})
                        </span>
                        
                        <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1 no-scrollbar mb-2">
                          {commentsList[post.id].map((comment, index) => (
                            <div key={index} className="text-xs text-zinc-700 bg-zinc-50 p-1.5 rounded flex items-start gap-1">
                              <span className="font-mono text-[9px] text-zinc-400 mt-0.5">💬</span>
                              <p className="flex-1 leading-normal">{comment}</p>
                            </div>
                          ))}
                        </div>

                        {/* Adicionar Comentário */}
                        <div className="flex gap-1.5 mt-2">
                          <input 
                            type="text" 
                            placeholder="Adicione um comentário..."
                            value={newCommentInput}
                            onChange={(e) => setNewCommentInput(e.target.value)}
                            className="flex-1 border border-zinc-200 rounded px-2 py-1 text-xs outline-none focus:border-sky-500 bg-zinc-50"
                          />
                          <button 
                            onClick={() => handleAddComment(post.id)}
                            className="bg-sky-500 text-white rounded px-2.5 py-1 text-xs font-semibold hover:bg-sky-600 active:scale-95 transition-all flex items-center"
                          >
                            <Send className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Barra de Navegação Inferior do Celular */}
          <footer className="h-12 border-t border-zinc-100 flex items-center justify-around px-4 shrink-0 bg-white sticky bottom-0 z-30">
            <Home className="w-5 h-5 text-zinc-700 cursor-pointer" />
            <Search className="w-5 h-5 text-zinc-400 cursor-pointer" />
            <PlusSquare className="w-5 h-5 text-zinc-400 cursor-pointer" />
            <Compass className="w-5 h-5 text-zinc-400 cursor-pointer" />
            <div className="w-6 h-6 rounded-full bg-zinc-400 cursor-pointer border border-zinc-200 flex items-center justify-center text-[10px] font-bold text-white font-mono">
              D
            </div>
          </footer>
        </div>
      </div>

      {/* Painel Lateral de Pistas e Controle */}
      <div className={`flex-1 max-w-md bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col justify-between align-stretch self-stretch ${
        mobileTab === 'pistas' ? 'flex' : 'hidden sm:flex'
      }`}>
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-100">
            <div>
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-sky-600 block">Investigação Ativa</span>
              <h3 className="font-sans font-bold text-xl text-neutral-800">Cenário 1: Redes Sociais</h3>
            </div>
            <span className="p-2 bg-sky-50 text-sky-600 rounded-lg">
              <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
            </span>
          </div>

          {/* Contexto dos Detetives */}
          <p className="text-xs text-neutral-600 leading-relaxed mb-4">
            <strong className="text-neutral-800">💼 Contexto:</strong> Uma nova rede social chamada <span className="font-semibold text-zinc-800">SocialCam</span> quer competir com o Instagram e TikTok. Mas a primeira versão tem grandes falhas de experiência (UX) e acessibilidade (UI). 
            Se os usuários demorarem para interagir ou não conseguirem ler o aplicativo, eles vão excluí-lo!
          </p>

          <div className="p-3.5 bg-neutral-50/50 rounded-xl border border-zinc-100 text-xs text-neutral-600 mb-4">
            <div className="flex items-center gap-1.5 font-bold text-neutral-800 mb-1.5 font-sans">
              <Sparkles className="w-4 h-4 text-sky-500" />
              <span>Como encontrar os bugs no celular?</span>
            </div>
            <ul className="space-y-1.5 list-disc pl-4 leading-normal">
              <li>Clique ou toque no <span className="font-semibold text-zinc-800 underline decoration-sky-300">texto muito claro</span> (legendas ou perfis) para reportar o erro de Contraste.</li>
              <li>Tente <span className="font-semibold text-zinc-800 underline decoration-sky-300">Curtir</span> as fotos. Descubra onde o botão de Like foi escondido e clique nele para flagrar esse atrito desnecessário.</li>
              <li>Explore a imagem do post dando <span className="font-semibold text-zinc-800 underline decoration-sky-300">múltiplos cliques rápidos</span> para revelar os segredos dos Comentários.</li>
            </ul>
          </div>

          {/* Status dos Erros Encontrados específicos desse cenário */}
          <div className="space-y-2 mb-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Erros Encontrados neste Caso ({foundBugs.filter(b => b.startsWith('social')).length}/3)
            </span>

            {[
              { id: 'social-ui-contrast', title: 'Legendas Claras (Falta de Contraste)' },
              { id: 'social-ux-like', title: 'Curtir Escondido (Clique Excessivo)' },
              { id: 'social-ux-comments', title: 'Comentários Secretos (Falta de Indicação)' }
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
          <div className="flex items-center justify-between bg-zinc-50 p-2.5 rounded-xl border border-zinc-200/60">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-500" />
              <div className="text-[11px] leading-snug">
                <span className="block font-bold text-zinc-800">Modo de Comparação</span>
                <span className="text-zinc-500">Veja o antes e depois do design!</span>
              </div>
            </div>
            <button 
              onClick={() => setIsCorrected(!isCorrected)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all active:scale-95 ${
                isCorrected 
                  ? 'bg-sky-500 text-white hover:bg-sky-600' 
                  : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-250'
              }`}
            >
              {isCorrected ? '💡 Exibir Design Saudável' : '⚠️ Exibir Design Bugado'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
