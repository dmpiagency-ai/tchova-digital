// Templates de IA personalizados para o público moçambicano
export interface AITemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  prompt: string;
  variables: string[];
  examples: string[];
}

export const MOZAMBICAN_AI_TEMPLATES: AITemplate[] = [
  // Logos
  {
    id: 'logo-restaurante',
    name: 'Logo para Restaurante',
    category: 'logos',
    description: 'Logo para restaurantes com elementos culturais moçambicanos',
    prompt: 'Crie um logo moderno para o restaurante "{nome}" em Moçambique. Use cores vibrantes como vermelho, verde e amarelo. Inclua elementos como pratos tradicionais, peixe ou frutas tropicais. Estilo: moderno com toques tradicionais moçambicanos.',
    variables: ['nome'],
    examples: ['Oceano Azul', 'Sabor de Moçambique', 'Praia Grill']
  },
  {
    id: 'logo-tecnologia',
    name: 'Logo para Empresa de Tecnologia',
    category: 'logos',
    description: 'Logo tech com referências à inovação africana',
    prompt: 'Desenhe um logo futurista para a empresa de tecnologia "{nome}" em Moçambique. Use elementos como circuitos, ondas de dados e referências à conectividade africana. Cores: azul, prata e verde. Estilo: moderno e inovador.',
    variables: ['nome'],
    examples: ['TechMoz Solutions', 'Digital Moçambique', 'Connect Africa']
  },
  {
    id: 'logo-moda',
    name: 'Logo para Loja de Moda',
    category: 'logos',
    description: 'Logo fashion com padrões africanos',
    prompt: 'Crie um logo elegante para a loja de moda "{nome}" em Moçambique. Incorpore padrões tradicionais africanos, tecidos e silhuetas modernas. Use cores vibrantes e sofisticadas. Estilo: fashion contemporâneo com raízes africanas.',
    variables: ['nome'],
    examples: ['Afro Chic', 'Moda Moçambique', 'Estilo Africano']
  },
  {
    id: 'logo-beleza',
    name: 'Logo para Beleza e Estética',
    category: 'logos',
    description: 'Logo para salões de beleza e estética',
    prompt: 'Desenhe um logo sofisticado para o salão de beleza "{nome}" em Moçambique. Use elementos como escovas, espelhos, flores ou símbolos de beleza africana. Cores: rosa, ouro e branco. Estilo: feminino e elegante.',
    variables: ['nome'],
    examples: ['Beleza Africana', 'Glam Moz', 'Estilo Natural']
  },
  {
    id: 'logo-educacao',
    name: 'Logo para Instituição Educacional',
    category: 'logos',
    description: 'Logo para escolas, universidades e institutos',
    prompt: 'Crie um logo institucional para a instituição educacional "{nome}" em Moçambique. Inclua elementos como livros, graduation caps, ou símbolos de conhecimento. Cores: azul, verde e amarelo. Estilo: sério e confiável.',
    variables: ['nome'],
    examples: ['Escola Maria Montessori', 'Universidade de Maputo', 'Instituto de Tecnologia']
  },

  // Posts para redes sociais
  {
    id: 'post-promocao',
    name: 'Post de Promoção',
    category: 'posts',
    description: 'Posts promocionais com gírias jovens moçambicanas',
    prompt: 'Crie um post atraente para Instagram sobre "{produto}" com desconto de {desconto}%. Use linguagem jovem moçambicana, emojis locais e chame para ação. Mantenha o texto conciso e impactante.',
    variables: ['produto', 'desconto'],
    examples: ['Smartphone Samsung', 'Curso de Inglês', 'Serviços de Design']
  },
  {
    id: 'post-evento',
    name: 'Post de Evento',
    category: 'posts',
    description: 'Posts para promover eventos locais',
    prompt: 'Anuncie o evento "{nome_evento}" que acontecerá em {local} no dia {data}. Destaque atrações como música, comida e diversão. Use linguagem animada e convide amigos. Inclua informações de contato.',
    variables: ['nome_evento', 'local', 'data'],
    examples: ['Festival de Música', 'Feira de Artesanato', 'Show de Kizomba']
  },
  {
    id: 'post-servico',
    name: 'Post de Serviço',
    category: 'posts',
    description: 'Posts para apresentar serviços profissionais',
    prompt: 'Apresente o serviço de "{servico}" da empresa {empresa}. Destaque benefícios, qualidade e atendimento personalizado. Use tom profissional mas acessível. Inclua chamada para contato.',
    variables: ['servico', 'empresa'],
    examples: ['Design Gráfico', 'Desenvolvimento Web', 'Consultoria Digital']
  },
  {
    id: 'post-dica',
    name: 'Post de Dica',
    category: 'posts',
    description: 'Posts informativos com dicas úteis',
    prompt: 'Crie um post educativo sobre "{tema}" com dicas práticas para o público moçambicano. Use linguagem simples e amigável. Inclua emojis relevantes e chamada para compartilhar.',
    variables: ['tema'],
    examples: ['Cuidado com a Pele', 'Investimentos para Iniciantes', 'Dicas de Estudo']
  },
  {
    id: 'post-cliente',
    name: 'Post de Depoimento',
    category: 'posts',
    description: 'Posts com depoimentos de clientes',
    prompt: 'Crie um post autêntico com depoimento do cliente "{nome_cliente}" sobre o serviço "{servico}". Destaque benefícios e resultados. Use linguagem natural e inclua hashtag de marca.',
    variables: ['nome_cliente', 'servico'],
    examples: ['Maria da Silva', 'João Santos', 'Ana Pereira']
  },

  // Banners
  {
    id: 'banner-restaurante',
    name: 'Banner para Restaurante',
    category: 'banners',
    description: 'Banners promocionais para restaurantes',
    prompt: 'Crie um banner atraente para o restaurante "{nome}" oferecendo {promocao}. Use imagens de comida moçambicana, cores quentes e texto legível. Inclua localização e horário de funcionamento.',
    variables: ['nome', 'promocao'],
    examples: ['Happy Hour', 'Pratos do Dia', 'Menu Especial']
  },
  {
    id: 'banner-curso',
    name: 'Banner para Cursos',
    category: 'banners',
    description: 'Banners para promoção de cursos e treinamentos',
    prompt: 'Desenhe um banner informativo para o curso de "{curso}" oferecido por {instituicao}. Destaque duração, preço e benefícios. Use layout clean com elementos educacionais e cores institucionais.',
    variables: ['curso', 'instituicao'],
    examples: ['Inglês Avançado', 'Programação Web', 'Design Gráfico']
  },
  {
    id: 'banner-ecommerce',
    name: 'Banner para E-commerce',
    category: 'banners',
    description: 'Banners para lojas online',
    prompt: 'Crie um banner dinâmico para a loja online "{nome_loja}" com a promoção "{promocao}". Use imagens de produtos, botões chamativos e countdown timer. Cores: vibrantes e atraentes.',
    variables: ['nome_loja', 'promocao'],
    examples: ['Black Friday', 'Cyber Monday', 'Semana do Consumidor']
  },
  {
    id: 'banner-empresa',
    name: 'Banner Corporativo',
    category: 'banners',
    description: 'Banners para empresas e marcas',
    prompt: 'Desenhe um banner profissional para a empresa "{nome_empresa}" destacando o slogan "{slogan}". Use cores da marca e elementos visuais que transmitem confiança. Inclua call to action.',
    variables: ['nome_empresa', 'slogan'],
    examples: ['Tchova Digital', 'Inovação em Moçambique', 'Solutions para Negócios']
  },

  // Cartazes
  {
    id: 'cartaz-evento',
    name: 'Cartaz de Evento',
    category: 'cartazes',
    description: 'Cartazes para eventos culturais e sociais',
    prompt: 'Crie um cartaz vibrante para o evento "{evento}" organizado por {organizador}. Inclua data, local, horário e atrações principais. Use cores festivas e elementos culturais moçambicanos.',
    variables: ['evento', 'organizador'],
    examples: ['Festival Cultural', 'Concerto de Música', 'Feira de Emprego']
  },
  {
    id: 'cartaz-show',
    name: 'Cartaz de Show',
    category: 'cartazes',
    description: 'Cartazes para shows e concertos',
    prompt: 'Desenhe um cartaz impactante para o show de "{artista}" em {local} no dia {data}. Use imagens do artista, cores vibrantes e fonte moderna. Inclua informações de ingresso.',
    variables: ['artista', 'local', 'data'],
    examples: ['Luisa Maita', 'DJ Magueta', 'Grupo Marrabenta']
  },
  {
    id: 'cartaz-festa',
    name: 'Cartaz de Festa',
    category: 'cartazes',
    description: 'Cartazes para festas e baladas',
    prompt: 'Crie um cartaz energético para a festa "{nome_festa}" em {local} no dia {data}. Use elementos de música, dança e neon. Cores: preto, roxo e azul. Inclua linha-up e horário.',
    variables: ['nome_festa', 'local', 'data'],
    examples: ['Festa do Kizomba', 'Night Club Party', 'Sábado da Dança']
  },

  // Áudios e Vídeos
  {
    id: 'audio-podcast',
    name: 'Capa para Podcast',
    category: 'audios',
    description: 'Capas atrativas para podcasts',
    prompt: 'Desenhe uma capa para o podcast "{nome_podcast}" com tema "{tema}". Use elementos relacionados ao tema, fonte legível e cores que transmitam energia. Estilo: moderno e profissional.',
    variables: ['nome_podcast', 'tema'],
    examples: ['Vozes de Moçambique', 'Tecnologia e Inovação', 'Cultura e Artes']
  },
  {
    id: 'video-thumbnail',
    name: 'Thumbnail para Vídeo',
    category: 'videos',
    description: 'Thumbnails que aumentam cliques',
    prompt: 'Crie uma thumbnail atraente para o vídeo sobre "{tema}". Use imagens relevantes, texto curto e elementos que gerem curiosidade. Cores: vibrantes e contrastantes.',
    variables: ['tema'],
    examples: ['10 Dicas para Negócios', 'Como Falar Inglês', 'Tour pela Cidade']
  }
];

// Função helper para obter templates por categoria
export const getTemplatesByCategory = (category: string): AITemplate[] => {
  return MOZAMBICAN_AI_TEMPLATES.filter(template => template.category === category);
};

// Função helper para obter template por ID
export const getTemplateById = (id: string): AITemplate | undefined => {
  return MOZAMBICAN_AI_TEMPLATES.find(template => template.id === id);
};

// Função para processar prompt com variáveis
export const processPrompt = (template: AITemplate, variables: Record<string, string>): string => {
  let prompt = template.prompt;
  template.variables.forEach(variable => {
    const value = variables[variable] || `{${variable}}`;
    prompt = prompt.replace(new RegExp(`{${variable}}`, 'g'), value);
  });
  return prompt;
};