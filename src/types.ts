export interface GameState {
  currentScenario: 'menu' | 'intro' | 'social' | 'pdv' | 'report';
  teamName: string;
  foundBugs: string[]; // List of bug IDs found
  currentMode: 'student' | 'teacher';
}

export interface Bug {
  id: string;
  scenario: 'social' | 'pdv';
  type: 'UI' | 'UX';
  title: string;
  shortDesc: string;
  detailedDesc: string;
  impact: string;
  solution: string;
}

export const INSTAGRAM_BUGS: Bug[] = [
  {
    id: 'social-ui-contrast',
    scenario: 'social',
    type: 'UI',
    title: 'Falta de Contraste na Legenda',
    shortDesc: 'Texto da legenda em cinza-claro em fundo branco.',
    detailedDesc: 'O texto da legenda está em cinza-claro sobre um fundo branco, violando as diretrizes de acessibilidade (WCAG) de contraste mínimo de 4.5:1 para leitura confortável.',
    impact: 'Estudantes com baixa visão ou sob luz solar não conseguem ler as legendas, gerando exclusão e cansaço visual.',
    solution: 'Usar cor escura (como preto ou cinza escuro) para fornecer alto contraste contra o fundo claro.'
  },
  {
    id: 'social-ux-like',
    scenario: 'social',
    type: 'UX',
    title: 'Botão "Curtir" Oculto no Menu',
    shortDesc: 'O botão de curtir foi escondido dentro do menu de três pontos.',
    detailedDesc: 'Para curtir uma foto, o usuário precisa clicar no menu de três pontos (...), abrir o submenu e depois clicar em "Curtir". Uma ação de altíssima frequência exige múltiplos toques desnecessários.',
    impact: 'Reduz o engajamento da rede social em até 80%, pois os usuários preferem rolar o feed a passar pelo atrito de clicar várias vezes para interagir.',
    solution: 'Colocar o botão de "Curtir" (ícone de coração) diretamente visível abaixo do post, alcançável com um único toque.'
  },
  {
    id: 'social-ux-comments',
    scenario: 'social',
    type: 'UX',
    title: 'Comentários com Triplo Clique',
    shortDesc: 'É necessário dar três toques na tela inteira para abrir os comentários.',
    detailedDesc: 'Não há botão visível de comentários ou campo de texto direto. O sistema exige uma ação oculta e incomum: clicar três vezes na área da imagem.',
    impact: 'Falta de affordance (indicação visual clara). Os usuários não sabem como interagir, deixando a seção de comentários vazia e o app parecendo quebrado.',
    solution: 'Fornecer um ícone de balão de fala visível ao lado do botão de curtir, que abre os comentários instantaneamente com um toque.'
  }
];

export const PDV_BUGS: Bug[] = [
  {
    id: 'pdv-ui-buttons',
    scenario: 'pdv',
    type: 'UI',
    title: 'Botões Críticos Idênticos e Lado a Lado',
    shortDesc: 'Os botões "Finalizar" e "Cancelar" têm a mesma cor vermelha e tamanho.',
    detailedDesc: 'O botão de concluir a compra e o botão de cancelar toda a venda estão posicionados lado a lado, têm o mesmo tamanho, forma e ambos são vermelhos chamativos, sem hierarquia semântica.',
    impact: 'Alta incidência de erros catastróficos. O operador de caixa, sob pressão e pressa para atender o cliente, clica acidentalmente em "Cancelar" em vez de "Finalizar", apagando toda a compra do cliente.',
    solution: 'Implementar hierarquia visual de cores coerente: "Finalizar Compra" deve ser um botão de destaque verde ou azul (ação primária positiva). "Cancelar Venda" deve ser uma ação secundária mais discreta, em cinza ou com contorno sutil (outline).'
  },
  {
    id: 'pdv-ux-search',
    scenario: 'pdv',
    type: 'UX',
    title: 'Fluxo Excessivo para Adicionar Item',
    shortDesc: 'Necessidade de abrir caixas de diálogo e realizar múltiplos cliques para um único produto.',
    detailedDesc: 'Para adicionar um item ao carrinho, o operador deve: 1) Clicar em "Novo Item", 2) Digitar o nome por extenso, 3) Clicar em "Filtrar", 4) Escolher em uma lista, 5) Informar quantidade, 6) Clicar em "Confirmar". Não há suporte a leitor de código de barras ou busca instantânea.',
    impact: 'Processo extremamente lento. Em um supermercado ou lanchonete, isso causa filas gigantescas, estresse do operador, insatisfação de clientes e perdas financeiras.',
    solution: 'Permitir entrada rápida pelo código do produto (EAN) com foco automático no teclado, leitor de código de barras físico ou painel rápido com botões de atalho para os itens mais vendidos.'
  }
];

export const ALL_BUGS: Bug[] = [...INSTAGRAM_BUGS, ...PDV_BUGS];
