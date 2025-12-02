// Single source of truth for all pricing and service data
export interface Service {
  id: number;
  title: string;
  category: string;
  description: string;
  shortDescription: string;
  price: number;
  priceNote: string;
  features: string[];
  benefits: string[];
  deliveryTime: string;
  revisions: string;
  expertise: string;
  projects: string;
  rating: number;
  clients: number;
  tags: string[];
  image: string;
  isPopular?: boolean;
  isIndividuallyAvailable?: boolean;
}

export interface Plan {
  name: string;
  price: number;
  originalPrice?: number;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  borderColor: string;
  priceColor: string;
  buttonColor: string;
  buttonText: string;
  buttonAction: string;
  icon: any;
  badge?: string;
  savings?: string;
}

// Individual Services Pricing (Base prices)
export const INDIVIDUAL_SERVICES: Service[] = [
  {
    id: 1,
    title: 'Design Gráfico & Identidade Visual',
    category: 'Design Gráfico',
    description: 'Transformamos marcas em presença visual forte e memorável.',
    shortDescription: 'Identidade visual profissional que fortalece sua marca.',
    price: 3500,
    priceNote: 'Preço pode variar conforme complexidade',
    features: [
      'Logotipos exclusivos e versáteis',
      'Manual completo da marca',
      'Paleta de cores profissional',
      'Tipografia estratégica',
      'Materiais impressos e digitais',
      'Identidade para redes sociais'
    ],
    benefits: [
      'Diferenciação no mercado',
      'Reconhecimento instantâneo',
      'Profissionalismo aumentado',
      'Coerência visual em todos os meios'
    ],
    deliveryTime: '7-14 dias úteis',
    revisions: '3 revisões inclusas',
    expertise: '8+ anos de experiência',
    projects: '150+ marcas criadas',
    rating: 4.9,
    clients: 150,
    tags: ['Branding', 'Logo', 'Design', 'Identidade Visual'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755337/Gemini_Generated_Image_qjaurwqjaurwqjau_k1fqgr.png',
    isIndividuallyAvailable: true,
    isPopular: true
  },
  {
    id: 2,
    title: 'Website Profissional',
    category: 'Desenvolvimento Web',
    description: 'Sites e apps modernos com tecnologia de ponta.',
    shortDescription: 'Websites responsivos com painel administrativo completo.',
    price: 4500,
    priceNote: 'Preço varia conforme complexidade e funcionalidades',
    features: [
      'Design responsivo e otimizado',
      'Painel administrativo completo',
      'SEO técnico básico incluído',
      'Hosting gratuito por 1 ano',
      'SSL certificate e segurança',
      'Formulários de contato integrados'
    ],
    benefits: [
      'Presença digital profissional',
      'Gestão independente do conteúdo',
      'Melhor posicionamento no Google',
      'Conversão de visitantes em clientes'
    ],
    deliveryTime: '15-21 dias úteis',
    revisions: 'Revisões ilimitadas até aprovação',
    expertise: '6+ anos de experiência',
    projects: '200+ websites criados',
    rating: 4.8,
    clients: 200,
    tags: ['Website', 'Web Development', 'SEO', 'Responsive'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755411/Gemini_Generated_Image_3a9xn93a9xn93a9x_dhydbm.png',
    isIndividuallyAvailable: true,
    isPopular: true
  },
  {
    id: 3,
    title: 'Marketing Digital Completo',
    category: 'Marketing Digital',
    description: 'Campanhas com resultados mensuráveis e ROI otimizado.',
    shortDescription: 'Gestão completa da sua presença digital com foco em resultados.',
    price: 4000,
    priceNote: 'Planos mensais disponíveis a partir de 2.500 MZN',
    features: [
      'Gestão de redes sociais (Instagram, Facebook, TikTok)',
      'Criação de conteúdo visual e textual',
      'Tráfego pago (Google Ads, Facebook Ads)',
      'SEO técnico e otimização',
      'E-mail marketing automatizado',
      'Relatórios mensais de performance'
    ],
    benefits: [
      'Aumento do tráfego qualificado',
      'Melhoria da taxa de conversão',
      'ROI mensurável e transparente',
      'Crescimento sustentável da marca'
    ],
    deliveryTime: '5-7 dias úteis para início',
    revisions: 'Ajustes e otimizações contínuas',
    expertise: '7+ anos de experiência',
    projects: '300+ campanhas realizadas',
    rating: 4.9,
    clients: 300,
    tags: ['Marketing', 'SEO', 'Ads', 'Social Media'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762747013/1762701812733_p93nsd.png',
    isIndividuallyAvailable: true,
    isPopular: true
  },
  {
    id: 4,
    title: 'Produção Audiovisual Profissional',
    category: 'Produção Audiovisual',
    description: 'Pacotes completos de cobertura de eventos com filmagem profissional, fotografia, edição e efeitos especiais. Oferecemos 4 pacotes diferenciados para atender todas as necessidades do seu evento.',
    shortDescription: 'Cobertura completa de eventos com vídeo, foto e edição profissional.',
    price: 10000,
    priceNote: 'Pacotes a partir de 10.000 MZN',
    features: [
      '🎬 Pacote Básico (10.000 MZN): Filmagem de vídeos, Seção fotográfica, Edição de vídeo, USB de Fotos, USB de Vídeo, Edição de vídeo do evento',
      '🎥 Pacote Médio (15.000 MZN): Filmagem de vídeos, Seção fotográfica, Edição de vídeo, Fogo de artifício, USB de Fotos, USB de Vídeo, Edição de vídeo do evento',
      '🎪 Pacote Clássico (25.000 MZN): Filmagem de vídeo, Seção fotográfica, Edição de vídeo, Bolas de Fumaça, USB de Fotos, USB de Vídeo, Edição de vídeo do evento',
      '👑 Pacote VIP (35.000 MZN): Filmagem de vídeo, Filmagem com drone, Seção fotográfica, Edição de vídeo, Bolas de Fumaça, Fogo de artifício, USB de Fotos, USB de Vídeo, Edição de vídeo do evento',
      '✨ Adicionais: Filmagem com drone (5.000 MZN), Bolas de Fumaça (5.000 MZN), Fogo de artifício (5.000 MZN)',
      '🎯 Equipamentos profissionais de última geração',
      '👥 Equipe especializada e experiente',
      '⚡ Entrega rápida com qualidade garantida'
    ],
    benefits: [
      'Cobertura completa do seu evento',
      'Memórias inesquecíveis em alta qualidade',
      'Pacotes flexíveis para todos os orçamentos',
      'Adicionais disponíveis para personalização',
      'Equipe profissional e equipamentos de ponta',
      'Entrega rápida e suporte completo'
    ],
    deliveryTime: '7-15 dias úteis após o evento',
    revisions: 'Edições inclusas no pacote',
    expertise: '8+ anos em produção audiovisual',
    projects: '200+ eventos cobertos',
    rating: 4.9,
    clients: 180,
    tags: ['Eventos', 'Filmagem', 'Fotografia', 'Drone', 'Efeitos Especiais'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755464/1762703721009_w7posw.png',
    isIndividuallyAvailable: true
  },
  {
    id: 5,
    title: 'E-commerce & Importação',
    category: 'E-commerce',
    description: 'Facilitamos compras seguras online e soluções completas de importação. Fazemos suas compras em plataformas como Alibaba, Shein e muito mais, com total segurança e rapidez. Assistência completa para importação internacional com documentação, frete e entrega garantida.',
    shortDescription: 'Compras seguras online e assistência completa de importação internacional.',
    price: 0,
    priceNote: 'Preços variam conforme valor da compra/importação',
    features: [
      'Compras seguras em Alibaba, Shein, AliExpress e outras plataformas',
      'Assistência completa para importação internacional',
      'Documentação aduaneira e despachante incluído',
      'Frete internacional otimizado e seguro',
      'Rastreamento completo da encomenda',
      'Suporte em português 24/7 durante todo o processo',
      'Garantia de entrega e reembolso se necessário',
      'Consultoria para escolher os melhores fornecedores'
    ],
    benefits: [
      'Economia de até 70% em compras internacionais',
      'Processo 100% seguro e acompanhado',
      'Sem burocracias - cuidamos de tudo',
      'Entrega porta a porta garantida',
      'Produtos originais com garantia',
      'Suporte completo em caso de problemas'
    ],
    deliveryTime: '7-21 dias úteis (depende do destino)',
    revisions: 'Acompanhamento completo até entrega',
    expertise: '6+ anos em importação internacional',
    projects: '2000+ importações realizadas com sucesso',
    rating: 4.8,
    clients: 500,
    tags: ['Importação', 'Compras Online', 'Alibaba', 'Shein', 'Seguro', 'Rápido'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762756410/Gemini_Generated_Image_ni5h1ani5h1ani5h_p8vvov.png',
    isIndividuallyAvailable: true
  },
  {
    id: 6,
    title: 'Assistência Técnica GSM',
    category: 'Assistência GSM',
    description: 'Ferramentas GSM Disponíveis. Escolha a ferramenta ideal para seu serviço. Downloads e soluções para flash, IMEI e muito mais. Serviços de IMEI: desbloqueio remoto com rapidez e confiabilidade. Serviços de servidor: ativações de boxes, créditos, ferramentas. Faça login para ver os preços completos. Entre, faça login, adicione saldo e seja direcionado para o painel profissional: https://4youtech-rent-painel.com/',
    shortDescription: 'Ferramentas GSM profissionais com desbloqueio remoto e soluções avançadas.',
    price: 0,
    priceNote: 'Faça login para ver os preços completos',
    features: [
      'Ferramentas GSM Disponíveis (Infinity Box, Z3X, Miracle Box)',
      'Downloads e soluções para flash, IMEI e muito mais',
      'Serviços de IMEI: desbloqueio remoto com rapidez e confiabilidade',
      'Serviços de servidor: ativações de boxes, créditos, ferramentas',
      'Acesso ao painel profissional: https://4youtech-rent-painel.com/',
      'Suporte técnico especializado 24/7'
    ],
    benefits: [
      'Mais de 500 ferramentas GSM profissionais',
      'Desbloqueio remoto com 99% de taxa de sucesso',
      'Atualizações constantes de ferramentas',
      'Interface profissional intuitiva'
    ],
    deliveryTime: 'Acesso imediato após cadastro',
    revisions: 'Suporte técnico contínuo incluído',
    expertise: '15+ anos em ferramentas GSM',
    projects: '100000+ desbloqueios realizados',
    rating: 4.9,
    clients: 10000,
    tags: ['GSM', 'Desbloqueio', 'IMEI', 'Ferramentas Pro'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755441/Gemini_Generated_Image_66r0q266r0q266r0_kbpqc8.png',
    isIndividuallyAvailable: true
  }
];

// Package Plans (Pre-configured combinations)
export const SERVICE_PLANS: Plan[] = [
  {
    name: 'KIT VENDER RÁPIDO',
    price: 3500,
    period: 'MZN',
    description: 'Solução rápida para começar a vender online com o essencial.',
    features: [
      'Website básico responsivo',
      'Identidade visual inicial (logo + cores)',
      'Gestão de redes sociais (1 mês)',
      'Suporte via WhatsApp',
      'Tutorial de configuração',
      'SSL certificate incluído'
    ],
    highlighted: false,
    borderColor: 'border-green-500 dark:border-green-400',
    priceColor: 'text-green-600 dark:text-green-400',
    buttonColor: 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400',
    buttonText: 'Começar agora',
    buttonAction: 'kit-vender',
    icon: 'Star',
    badge: 'Ideal para Iniciantes',
    savings: 'Economize 25% vs serviços individuais'
  },
  {
    name: 'DESCOLAR DIGITAL',
    price: 6500,
    originalPrice: 8000,
    period: 'MZN',
    description: 'Pacote completo para presença digital profissional e crescimento.',
    features: [
      'Website profissional completo',
      'Identidade visual premium',
      'Marketing Digital (2 meses)',
      'Motion Design básico',
      'Suporte prioritário (60 dias)',
      'Relatórios mensais de performance',
      'Otimização SEO incluída'
    ],
    highlighted: true,
    borderColor: 'border-blue-500 dark:border-blue-400',
    priceColor: 'text-blue-600 dark:text-blue-400',
    buttonColor: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400',
    buttonText: 'Descolar Digital',
    buttonAction: 'descolagem',
    icon: 'Zap',
    badge: 'MAIS POPULAR',
    savings: 'Economize 35% vs serviços individuais'
  },
  {
    name: 'ACELERAÇÃO MENSAL',
    price: 16000,
    period: 'MZN + 4.900/Mês',
    description: 'Crescimento acelerado com acompanhamento contínuo e suporte VIP.',
    features: [
      'Website avançado + E-commerce',
      'Identidade visual completa',
      'Marketing Digital Avançado (mensal)',
      'Motion Design & Vídeos Premium',
      'Suporte prioritário 24/7',
      'Consultoria estratégica mensal',
      'Gestão completa de campanhas',
      'Relatórios executivos detalhados'
    ],
    highlighted: false,
    borderColor: 'border-yellow-500',
    priceColor: 'text-yellow-600',
    buttonColor: 'bg-yellow-500 hover:bg-yellow-600',
    buttonText: 'Acelerar crescimento',
    buttonAction: 'aceleracao',
    icon: 'Zap',
    badge: 'Crescimento Garantido',
    savings: 'ROI médio 300% em 6 meses'
  },
  {
    name: 'ECOSSISTEMA MASTER',
    price: 25000,
    period: 'MZN + 9.500/Mês',
    description: 'Solução 360º para empresas que querem dominar completamente o mercado digital.',
    features: [
      'Plataforma personalizada completa',
      'Design gráfico premium ilimitado',
      'Marketing Digital Master (ilimitado)',
      'Motion Design Master (ilimitado)',
      'Suporte executivo dedicado',
      'Relatórios executivos VIP',
      'Consultoria estratégica semanal',
      'Acesso direto aos fundadores',
      'Garantia de resultados ou dinheiro de volta'
    ],
    highlighted: false,
    borderColor: 'border-orange-500',
    priceColor: 'text-orange-600',
    buttonColor: 'bg-orange-600 hover:bg-orange-700',
    buttonText: 'Orçamento exclusivo',
    buttonAction: 'master',
    icon: 'Smartphone',
    badge: 'Para Grandes Ambientes',
    savings: 'Solução completa com economia de 50%+'
  }
];

// Service Categories for filtering
export const SERVICE_CATEGORIES = [
  'Todos',
  'Design Gráfico',
  'Desenvolvimento Web',
  'Marketing Digital',
  'Produção Audiovisual',
  'E-commerce',
  'Assistência GSM'
];

// WhatsApp message templates
export const WHATSAPP_MESSAGES = {
  service: {
    'Design Gráfico & Identidade Visual': '🎨 Olá! Gostaria de orçamento para design gráfico e identidade visual.',
    'Website Profissional': '💻 Olá! Preciso de um website profissional para meu negócio.',
    'Marketing Digital Completo': '📈 Olá! Interessado em marketing digital para minha empresa.',
    'Produção Audiovisual Profissional': '🎬 Olá! Gostaria de orçamento para produção audiovisual.',
    'E-commerce & Importação': '🛒 Olá! Preciso de ajuda com compras seguras online ou importação internacional.',
    'Assistência Técnica GSM': '📱 Olá! Preciso de assistência técnica GSM para meus dispositivos.'
  },
  plan: {
    'KIT VENDER RÁPIDO': '🚀 Olá! Gostaria de contratar o Kit Vender Rápido.',
    'DESCOLAR DIGITAL': '⚡ Olá! Interessado no plano Descolar Digital.',
    'ACELERAÇÃO MENSAL': '📈 Olá! Gostaria de saber mais sobre o plano Aceleração Mensal.',
    'ECOSSISTEMA MASTER': '👑 Olá! Quero conhecer o Ecossistema Master.'
  }
};

// Helper functions
export const getServiceById = (id: number): Service | undefined => {
  return INDIVIDUAL_SERVICES.find(service => service.id === id);
};

export const getPlanByName = (name: string): Plan | undefined => {
  return SERVICE_PLANS.find(plan => plan.name === name);
};

export const getServicesByCategory = (category: string): Service[] => {
  if (category === 'Todos') return INDIVIDUAL_SERVICES;
  return INDIVIDUAL_SERVICES.filter(service => service.category === category);
};

export const getWhatsAppMessage = (type: 'service' | 'plan', title: string): string => {
  const messages = WHATSAPP_MESSAGES[type];
  return messages[title as keyof typeof messages] || `Olá! Gostaria de saber mais sobre ${title}.`;
};