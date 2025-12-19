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

  // Cartazes
  {
    id: 'cartaz-evento',
    name: 'Cartaz de Evento',
    category: 'cartazes',
    description: 'Cartazes para eventos culturais e sociais',
    prompt: 'Crie um cartaz vibrante para o evento "{evento}" organizado por {organizador}. Inclua data, local, horário e atrações principais. Use cores festivas e elementos culturais moçambicanos.',
    variables: ['evento', 'organizador'],
    examples: ['Festival Cultural', 'Concerto de Música', 'Feira de Emprego']
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