export interface GameState {
  currentScenario: 'menu' | 'intro' | 'social' | 'pdv' | 'checkout' | 'dashboard' | 'report';
  teamName: string;
  foundBugs: string[]; // List of bug IDs found
  currentMode: 'student' | 'teacher';
}

export interface Bug {
  id: string;
  scenario: 'social' | 'pdv' | 'checkout' | 'dashboard';
  level: 1 | 2;
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
    level: 1,
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
    level: 1,
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
    level: 1,
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
    level: 1,
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
    level: 1,
    type: 'UX',
    title: 'Fluxo Excessivo para Adicionar Item',
    shortDesc: 'Necessidade de abrir caixas de diálogo e realizar múltiplos cliques para um único produto.',
    detailedDesc: 'Para adicionar um item ao carrinho, o operador deve: 1) Clicar em "Novo Item", 2) Digitar o nome por extenso, 3) Clicar em "Filtrar", 4) Escolher em uma lista, 5) Informar quantidade, 6) Clicar em "Confirmar". Não há suporte a leitor de código de barras ou busca instantânea.',
    impact: 'Processo extremamente lento. Em um supermercado ou lanchonete, isso causa filas gigantescas, estresse do operador, insatisfação de clientes e perdas financeiras.',
    solution: 'Permitir entrada rápida pelo código do produto (EAN) com foco automático no teclado, leitor de código de barras físico ou painel rápido com botões de atalho para os itens mais vendidos.'
  }
];

export const CHECKOUT_BUGS: Bug[] = [
  {
    id: 'checkout-ui-labels',
    scenario: 'checkout',
    level: 2,
    type: 'UI',
    title: 'Placeholders Desaparecidos em vez de Labels',
    shortDesc: 'Uso exclusivo de placeholders nos inputs que somem ao digitar.',
    detailedDesc: 'O formulário de checkout utiliza apenas placeholders cinzas internos para indicar o que preencher (ex: Número do Cartão, Validade, Nome, CPF). Assim que o usuário clica ou digita qualquer caractere, o texto com a instrução do campo desaparece completamente.',
    impact: 'Se o usuário for interrompido ou estiver preenchendo vários campos semelhantes (como CPF e CNPJ ou Número do cartão e agência), ele perde o contexto de qual campo estava editando, precisando apagar o conteúdo inteiro apenas para reler a instrução inicial.',
    solution: 'Sempre exibir labels visíveis e permanentes posicionados acima do campo, ou utilizar a técnica de "floating labels" (rótulos flutuantes) que se movem de forma sutil para o topo quando o campo ganha foco.'
  },
  {
    id: 'checkout-ux-clear',
    scenario: 'checkout',
    level: 2,
    type: 'UX',
    title: 'Botão de Ação Destrutiva Próximo do Confirma',
    shortDesc: 'Botão gigante de "Limpar Formulário" posicionado ao lado do botão primário de "Pagar".',
    detailedDesc: 'O botão secundário destrutivo ("Limpar Formulário") possui a mesma área de clique e realce que o botão primário de finalização ("Pagar Agora"). Eles estão lado a lado, sem distância ou tela de confirmação.',
    impact: 'Uso catastrófico por mouses imprecisos ou toques rápidos em smartphones. Um usuário pode acidentalmente limpar todos os dados do cartão de crédito preenchidos após 1-2 minutos de esforço, frustrando-se e abandonando o carrinho de compras.',
    solution: 'Remover o botão "Limpar Formulário" por completo (já que o usuário pode atualizar a página ou editar campos individualmente), ou estilizá-lo como um link de texto minimalista muito discreto, afastado do botão primário.'
  },
  {
    id: 'checkout-ui-mask',
    scenario: 'checkout',
    level: 2,
    type: 'UI',
    title: 'Ausência de Máscaras e Validação Tardia',
    shortDesc: 'Erro de formatação só é alertado no servidor final, sem máscaras digitadas para data/número.',
    detailedDesc: 'O checkout aceita digitação de caracteres brutos para data de expiração (MM/AA) e número do cartão sem pontuação estrutural automática. Erros de tamanho ou digitação não dão alerta visual imediato, exigindo que o formulário seja inteiramente enviado e devolvido pelo backend para destacar os erros.',
    impact: 'Aumento severo de atrito e frustração. Em dispositivos móveis, sem máscaras e feedback instantâneo de correção de campo (inline validation), o usuário falha repetidamente em dados básicos de pagamento.',
    solution: 'Aplicar máscaras que inserem espaços e barras automaticamente e validações inline dinâmicas usando cores sutis (como borda de sucesso/erro) imediatamente após o campo perder o foco (onBlur).'
  }
];

export const DASHBOARD_BUGS: Bug[] = [
  {
    id: 'dash-ui-charts',
    scenario: 'dashboard',
    level: 2,
    type: 'UI',
    title: 'Cores de Gráfico sem Contraste ou Diferenciação',
    shortDesc: 'Cores pastéis idênticas usadas para dados opostos de lucro e despesa.',
    detailedDesc: 'O gráfico do painel financeiro utiliza tons claros semelhantes de cinza-ardósia e verde pastel acinzentado para categorizar "Lucro Real" e "Despesas Operacionais". Além disso, as fontes das legendas estão em tamanho minúsculo e sem distinção anatômica.',
    impact: 'Leitura de métricas lenta e enganosa. Executivos ou analistas financeiros tomam decisões erradas por confundirem dados positivos e negativos sob luz externa ou em telas com calibração de cor ruim.',
    solution: 'Utilizar paletas de cores com contraste excelente e semântica clara (como azul/verde escuro para faturamento positivo, e laranja/cinza quente para despesas), acompanhadas por labels de dados diretos.'
  },
  {
    id: 'dash-ux-refresh',
    scenario: 'dashboard',
    level: 2,
    type: 'UX',
    title: 'Perda de Filtros Colaterais no dropdown',
    shortDesc: 'Mudar um filtro temporizador apaga os outros filtros de busca digitados na tela.',
    detailedDesc: 'Ao alternar o período do dashboard (ex: de "Hoje" para "Últimos 30 dias"), o sistema executa um "hard refresh" que redefine e apaga as buscas textuais por cliente ou filtros de departamento que o usuário já tinha selecionado.',
    impact: 'Frustração operacional crônica. O usuário precisa redigitar e refazer as configurações de busca todas as vezes que deseja comparar intervalos de tempo diferentes na mesma tela.',
    solution: 'Armazenar o estado dos filtros em um único objeto de estado consolidado no React de modo que reajustes de período atualizem apenas os dados numéricos, preservando a busca local ativa.'
  }
];

export const ALL_BUGS: Bug[] = [
  ...INSTAGRAM_BUGS,
  ...PDV_BUGS,
  ...CHECKOUT_BUGS,
  ...DASHBOARD_BUGS
];
