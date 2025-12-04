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
    title: 'Design & Identidade Visual',
    category: 'Design Gráfico',
    description: 'Transformamos marcas em presença visual forte e memorável com serviços completos de design.',
    shortDescription: 'Identidade visual profissional completa para sua marca.',
    price: 3500,
    priceNote: 'Preço pode variar conforme complexidade',
    features: [
      'Logotipos Profissionais',
      'Identidade Visual & Branding',
      'Posts e Carrosséis',
      'Cartazes Publicitários',
      'Banners e Materiais Impressos',
      'Cartões de Visita Digitais com QR',
      'Pacotes Semanais de Arte para Redes',
      'Templates personalizados'
    ],
    benefits: [
      'Diferenciação no mercado',
      'Reconhecimento instantâneo',
      'Profissionalismo aumentado',
      'Coerência visual em todos os meios',
      'Materiais prontos para uso imediato',
      'Arte profissional para redes sociais'
    ],
    deliveryTime: '7-14 dias úteis',
    revisions: '3 revisões inclusas',
    expertise: '8+ anos de experiência',
    projects: '150+ marcas criadas',
    rating: 4.9,
    clients: 150,
    tags: ['Branding', 'Logo', 'Design', 'Identidade Visual', 'Social Media', 'Materiais Impressos'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755337/Gemini_Generated_Image_qjaurwqjaurwqjau_k1fqgr.png',
    isIndividuallyAvailable: true,
    isPopular: true
  },
  {
    id: 2,
    title: 'Desenvolvimento Digital (Sites, Apps & Plataformas)',
    category: 'Desenvolvimento Web',
    description: 'Sites, apps e plataformas modernas com tecnologia de ponta e integração local.',
    shortDescription: 'Desenvolvimento completo de soluções digitais responsivas e integradas.',
    price: 4000,
    priceNote: 'Preço varia conforme complexidade e funcionalidades',
    features: [
      'Criação de Websites Responsivos (mobile-first)',
      'Desenvolvimento de Landing Pages Profissionais',
      'Criação de Plataformas Web (SaaS, Portais, Painéis)',
      'Desenvolvimento de Apps (no-code e low-code)',
      'Websites de Vendas / E-commerce',
      'Integração com APIs de Carteiras Locais (e-Mola, M-Pesa, Mkesh)',
      'Sistemas de Reservas e Agendamento',
      'Criação de Sistemas Internos Empresariais',
      'Otimização de velocidade',
      'SEO Técnico avançado'
    ],
    benefits: [
      'Presença digital profissional',
      'Gestão independente do conteúdo',
      'Melhor posicionamento no Google',
      'Conversão de visitantes em clientes',
      'Integração com pagamentos locais',
      'Soluções escaláveis e modernas'
    ],
    deliveryTime: '15-21 dias úteis',
    revisions: 'Revisões ilimitadas até aprovação',
    expertise: '6+ anos de experiência',
    projects: '200+ websites criados',
    rating: 4.8,
    clients: 200,
    tags: ['Website', 'Web Development', 'SEO', 'Apps', 'E-commerce', 'APIs Locais'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755411/Gemini_Generated_Image_3a9xn93a9xn93a9x_dhydbm.png',
    isIndividuallyAvailable: true,
    isPopular: true
  },
  {
    id: 3,
    title: 'Marketing Digital & Tráfego Pago',
    category: 'Marketing Digital',
    description: 'Campanhas completas com resultados mensuráveis, tráfego pago e otimização com IA.',
    shortDescription: 'Gestão completa da sua presença digital com foco em resultados e automação.',
    price: 3000,
    priceNote: 'Planos mensais disponíveis a partir de 2.000 MZN',
    features: [
      'Gestão Completa de Redes Sociais',
      'Criação de Conteúdos (Reels, Spots, Anúncios)',
      'Planeamento e Estratégia Digital',
      'Gestão de Tráfego Pago (Facebook & Google)',
      'Copywriting para Anúncios',
      'Relatórios de Performance',
      'Otimização contínua com IA',
      'Automação marketing (pré-configurado)'
    ],
    benefits: [
      'Aumento do tráfego qualificado',
      'Melhoria da taxa de conversão',
      'ROI mensurável e transparente',
      'Crescimento sustentável da marca',
      'Automação inteligente de campanhas',
      'Otimização com IA para melhores resultados'
    ],
    deliveryTime: '5-7 dias úteis para início',
    revisions: 'Ajustes e otimizações contínuas',
    expertise: '7+ anos de experiência',
    projects: '300+ campanhas realizadas',
    rating: 4.9,
    clients: 300,
    tags: ['Marketing', 'SEO', 'Ads', 'Social Media', 'IA', 'Automação'],
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
    title: 'Assistência Técnica GSM & Software Profissional',
    category: 'Assistência GSM',
    description: 'Ferramentas GSM completas e software profissional para técnicos. Desbloqueios, flashing, reparações e aluguer de boxes premium. Acesso ao painel profissional com mais de 500 ferramentas.',
    shortDescription: 'Ferramentas GSM profissionais completas com suporte técnico avançado.',
    price: 0,
    priceNote: 'Faça login para ver os preços completos',
    features: [
      'Desbloqueio de Smartphones',
      'Flashing / Atualização de Firmware',
      'Reparação IMEI legal',
      'Aluguer de Box GSM (Hydra, CM2, Sigma, EFT, Pandora, MRT, etc.)',
      'Diagnóstico e Reparações Lógicas',
      'Software e Ferramentas Profissionais',
      'Serviços avançados para técnicos independentes',
      'Acesso ao painel profissional: https://4youtech-rent-painel.com/',
      'Suporte técnico especializado 24/7'
    ],
    benefits: [
      'Mais de 500 ferramentas GSM profissionais',
      'Desbloqueio remoto com 99% de taxa de sucesso',
      'Atualizações constantes de ferramentas',
      'Interface profissional intuitiva',
      'Suporte completo para técnicos',
      'Ferramentas premium para reparações avançadas'
    ],
    deliveryTime: 'Acesso imediato após cadastro',
    revisions: 'Suporte técnico contínuo incluído',
    expertise: '15+ anos em ferramentas GSM',
    projects: '100000+ desbloqueios realizados',
    rating: 4.9,
    clients: 10000,
    tags: ['GSM', 'Desbloqueio', 'IMEI', 'Ferramentas Pro', 'Reparações', 'Software'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755441/Gemini_Generated_Image_66r0q266r0q266r0_kbpqc8.png',
    isIndividuallyAvailable: true
  },
  {
    id: 7,
    title: 'Logotipo Simples',
    category: 'Design Gráfico',
    description: 'Logotipo básico e funcional para pequenos negócios e startups.',
    shortDescription: 'Logotipo simples e profissional para seu negócio.',
    price: 1200,
    priceNote: 'Preço médio para logotipo básico',
    features: [
      'Conceito de logotipo simples',
      '2-3 opções de design',
      'Arquivos em formatos digitais',
      'Direito de uso comercial',
      '1 revisão incluída'
    ],
    benefits: [
      'Identidade visual básica',
      'Pronto para uso imediato',
      'Custo acessível para iniciantes',
      'Diferenciação no mercado local'
    ],
    deliveryTime: '3-5 dias úteis',
    revisions: '1 revisão incluída',
    expertise: '8+ anos de experiência',
    projects: '200+ logotipos criados',
    rating: 4.8,
    clients: 80,
    tags: ['Logo', 'Design', 'Identidade Visual', 'Iniciante'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755337/Gemini_Generated_Image_qjaurwqjaurwqjau_k1fqgr.png',
    isIndividuallyAvailable: true
  },
  {
    id: 8,
    title: 'Posts Individuais para Redes Sociais',
    category: 'Design Gráfico',
    description: 'Posts únicos e atraentes para Instagram, Facebook e outras redes sociais.',
    shortDescription: 'Posts profissionais para suas redes sociais.',
    price: 200,
    priceNote: 'Por post individual',
    features: [
      'Design de 1 post para rede social',
      'Otimização para Instagram/Facebook',
      'Elementos visuais modernos',
      'Texto integrado ao design',
      'Arquivos prontos para postagem'
    ],
    benefits: [
      'Conteúdo visual profissional',
      'Aumento do engajamento',
      'Custo acessível',
      'Resultado imediato'
    ],
    deliveryTime: '1-2 dias úteis',
    revisions: '1 revisão incluída',
    expertise: '6+ anos em design social',
    projects: '1000+ posts criados',
    rating: 4.7,
    clients: 120,
    tags: ['Social Media', 'Posts', 'Instagram', 'Facebook'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755337/Gemini_Generated_Image_qjaurwqjaurwqjau_k1fqgr.png',
    isIndividuallyAvailable: true
  },
  {
    id: 9,
    title: 'Pack Semanal de Posts (5 posts)',
    category: 'Design Gráfico',
    description: 'Pacote completo de 5 posts para uma semana de conteúdo nas redes sociais.',
    shortDescription: 'Conteúdo semanal completo para suas redes.',
    price: 900,
    priceNote: 'Pack de 5 posts otimizados',
    features: [
      '5 posts para redes sociais',
      'Temas variados e atraentes',
      'Otimização para engajamento',
      'Calendário de postagem sugerido',
      'Arquivos em alta resolução'
    ],
    benefits: [
      'Conteúdo para 1 semana',
      'Consistência nas redes',
      'Economia vs posts individuais',
      'Maior alcance orgânico'
    ],
    deliveryTime: '3-5 dias úteis',
    revisions: '2 revisões incluídas',
    expertise: '6+ anos em design social',
    projects: '500+ packs semanais',
    rating: 4.8,
    clients: 90,
    tags: ['Social Media', 'Pack', 'Semanal', 'Conteúdo'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755337/Gemini_Generated_Image_qjaurwqjaurwqjau_k1fqgr.png',
    isIndividuallyAvailable: true
  },
  {
    id: 10,
    title: 'Pack Mensal de Posts (15-20 posts)',
    category: 'Design Gráfico',
    description: 'Pacote mensal completo com 15-20 posts para conteúdo consistente durante o mês.',
    shortDescription: 'Conteúdo mensal profissional para suas redes.',
    price: 2800,
    priceNote: 'Pack mensal de 15-20 posts',
    features: [
      '15-20 posts mensais',
      'Estratégia de conteúdo incluída',
      'Variação de formatos (imagem, carrossel)',
      'Calendário editorial completo',
      'Otimização para algoritmos'
    ],
    benefits: [
      'Conteúdo para 1 mês inteiro',
      'Crescimento consistente',
      'Maior economia',
      'Presença profissional contínua'
    ],
    deliveryTime: '7-10 dias úteis',
    revisions: '3 revisões incluídas',
    expertise: '6+ anos em design social',
    projects: '300+ packs mensais',
    rating: 4.9,
    clients: 70,
    tags: ['Social Media', 'Pack', 'Mensal', 'Estratégia'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755337/Gemini_Generated_Image_qjaurwqjaurwqjau_k1fqgr.png',
    isIndividuallyAvailable: true
  },
  {
    id: 11,
    title: 'Cartazes Publicitários',
    category: 'Design Gráfico',
    description: 'Cartazes profissionais para divulgação de produtos, serviços e eventos.',
    shortDescription: 'Cartazes impactantes para sua publicidade.',
    price: 400,
    priceNote: 'Por cartaz individual',
    features: [
      'Design de cartaz A3/A4',
      'Layout profissional e atrativo',
      'Otimização para impressão',
      'Elementos visuais impactantes',
      'Arquivos prontos para gráfica'
    ],
    benefits: [
      'Publicidade offline eficaz',
      'Atrai clientes locais',
      'Custo acessível',
      'Resultado mensurável'
    ],
    deliveryTime: '2-3 dias úteis',
    revisions: '1 revisão incluída',
    expertise: '7+ anos em design gráfico',
    projects: '400+ cartazes criados',
    rating: 4.7,
    clients: 100,
    tags: ['Cartazes', 'Publicidade', 'Impressão', 'Offline'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755337/Gemini_Generated_Image_qjaurwqjaurwqjau_k1fqgr.png',
    isIndividuallyAvailable: true
  },
  {
    id: 12,
    title: 'Cartão Digital com QR Code',
    category: 'Design Gráfico',
    description: 'Cartões de visita digitais modernos com QR code para compartilhamento fácil.',
    shortDescription: 'Cartões digitais modernos com QR code.',
    price: 350,
    priceNote: 'Cartão digital profissional',
    features: [
      'Design de cartão digital',
      'QR code integrado',
      'Link para perfil/contato',
      'Otimização para mobile',
      'Arquivo digital para compartilhamento'
    ],
    benefits: [
      'Contato profissional digital',
      'Fácil compartilhamento',
      'Sempre atualizado',
      'Ecológico e moderno'
    ],
    deliveryTime: '1-2 dias úteis',
    revisions: '1 revisão incluída',
    expertise: '5+ anos em design digital',
    projects: '250+ cartões digitais',
    rating: 4.8,
    clients: 85,
    tags: ['Cartão', 'Digital', 'QR Code', 'Contato'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755337/Gemini_Generated_Image_qjaurwqjaurwqjau_k1fqgr.png',
    isIndividuallyAvailable: true
  },
  {
    id: 13,
    title: 'Banner Impresso Digitalizado',
    category: 'Design Gráfico',
    description: 'Banners profissionais para fachadas, eventos e pontos de venda.',
    shortDescription: 'Banners impactantes para sua visibilidade.',
    price: 600,
    priceNote: 'Banner personalizado',
    features: [
      'Design de banner personalizado',
      'Otimização para impressão em grande formato',
      'Elementos visuais de alto impacto',
      'Texto claro e legível',
      'Arquivos prontos para gráfica'
    ],
    benefits: [
      'Visibilidade máxima',
      'Atrai clientes de longe',
      'Profissionalismo instantâneo',
      'ROI comprovado'
    ],
    deliveryTime: '3-4 dias úteis',
    revisions: '2 revisões incluídas',
    expertise: '7+ anos em design gráfico',
    projects: '180+ banners criados',
    rating: 4.8,
    clients: 65,
    tags: ['Banner', 'Impresso', 'Visibilidade', 'Publicidade'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755337/Gemini_Generated_Image_qjaurwqjaurwqjau_k1fqgr.png',
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