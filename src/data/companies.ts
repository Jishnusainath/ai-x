export interface CompanyModel {
  name: string;
  version: string;
  releaseDate: string;
  capabilities: string[];
  benchmarks: Record<string, string>;
  description: string;
  image?: string;
}

export interface TimelineEvent {
  year: string;
  date: string;
  title: string;
  description: string;
  type: 'founded' | 'funding' | 'research' | 'model' | 'partnership' | 'leadership' | 'news';
}

export interface ResearchPaper {
  title: string;
  authors: string;
  date: string;
  citations: string;
  link: string;
  summary: string;
}

export interface BenchmarkScore {
  subject: string;
  score: number; // 0 to 100
  fullMark: number;
}

export interface ProductItem {
  name: string;
  type: 'API' | 'App' | 'Platform' | 'SDK' | 'Enterprise';
  description: string;
  features: string[];
}

export interface FundingRound {
  round: string;
  date: string;
  amount: string;
  valuation?: string;
  investors?: string[];
}

export interface CompanyProfile {
  id: string;
  name: string;
  slug: string;
  logo: string; // Single character or initials
  color: string; // Tailwind hex or class name
  coverImage: string;
  shortDesc: string;
  longDesc: string;
  country: string;
  foundedYear: string;
  hq: string;
  founders: string[];
  ceo: string;
  website: string;
  latestStatus: string;
  whyItMatters: string;
  strengths: string[];
  industryPosition: string;
  metrics: {
    modelsCount: number;
    fundingTotal: string;
    employees: string;
    valuation: string;
    openSourceProjects: number;
    papersCount: number;
    apiAvailable: boolean;
    enterpriseSolutions: boolean;
  };
  timeline: TimelineEvent[];
  models: CompanyModel[];
  research: ResearchPaper[];
  benchmarks: BenchmarkScore[];
  products: ProductItem[];
  fundingHistory: FundingRound[];
  relatedCompanies: { name: string; relation: 'competitor' | 'partner' | 'alternative'; desc: string; slug: string }[];
}

export const COMPANIES_INTEL: Record<string, CompanyProfile> = {
  openai: {
    id: 'openai',
    name: 'OpenAI',
    slug: 'openai',
    logo: 'O',
    color: '#10a37f',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=600&auto=format&fit=crop',
    shortDesc: 'Pioneering frontier AI research and development, creator of ChatGPT and the GPT series.',
    longDesc: 'OpenAI is an AI research and deployment company. Our mission is to ensure that artificial general intelligence benefits all of humanity. Founded as a non-profit in 2015, OpenAI transitioned to a capped-profit structure in 2019 to attract capital, leading to a multi-billion dollar partnership with Microsoft. OpenAI has catalyzed the modern generative AI era with massive language models, conversational interfaces, and developer-accessible APIs.',
    country: 'United States',
    foundedYear: '2015',
    hq: 'San Francisco, California',
    founders: ['Sam Altman', 'Ilya Sutskever', 'Greg Brockman', 'Elon Musk', 'Wojciech Zaremba'],
    ceo: 'Sam Altman',
    website: 'https://openai.com',
    latestStatus: 'Actively rolling out advanced conversational agent features and training next-generation frontier models.',
    whyItMatters: 'OpenAI set the paradigm for modern pre-trained transformers and popularized consumer AI through ChatGPT, defining the commercial vector of GenAI.',
    strengths: [
      'Frontier foundation model research (GPT-4o, GPT-o1 series)',
      'Global brand recognition and consumer market capture (ChatGPT)',
      'High-performance developer API ecosystem',
      'Strong strategic partnership with Microsoft for infrastructure and distribution'
    ],
    industryPosition: 'Leading commercial frontier player with unmatched consumer mindshare and developer platform volumes.',
    metrics: {
      modelsCount: 15,
      fundingTotal: '$17.5B',
      employees: '1,500+',
      valuation: '$150B',
      openSourceProjects: 45,
      papersCount: 120,
      apiAvailable: true,
      enterpriseSolutions: true
    },
    timeline: [
      { year: '2015', date: 'December 2015', title: 'OpenAI Founded', description: 'Established as a non-profit organization with a $1B funding commitment.', type: 'founded' },
      { year: '2018', date: 'June 2018', title: 'GPT-1 Released', description: 'Published paper introducing the concept of Generative Pre-training.', type: 'model' },
      { year: '2019', date: 'March 2019', title: 'Capped-Profit Transition', description: 'Created OpenAI LP to secure commercial funding for computational scale.', type: 'funding' },
      { year: '2019', date: 'July 2019', title: 'Microsoft $1B Partnership', description: 'Secured Microsoft investment and primary cloud compute agreement.', type: 'partnership' },
      { year: '2020', date: 'June 2020', title: 'GPT-3 Breakthrough', description: 'Released GPT-3, sparking widespread industrial interest in large language models.', type: 'model' },
      { year: '2022', date: 'November 2022', title: 'ChatGPT Launch', description: 'Released ChatGPT conversational UI, reaching 100M users in two months.', type: 'model' },
      { year: '2023', date: 'March 2023', title: 'GPT-4 Released', description: 'Set a new gold standard for general intelligence and reasoning benchmarks.', type: 'model' },
      { year: '2024', date: 'May 2024', title: 'GPT-4o Multimodal Release', description: 'Introduced native real-time audio, visual, and text multimodal reasoning.', type: 'model' },
      { year: '2024', date: 'September 2024', title: 'OpenAI o1 Series', description: 'Introduced reasoning-based models utilizing chain-of-thought processing.', type: 'model' }
    ],
    models: [
      {
        name: 'GPT-4o',
        version: 'v4.0 (Multimodal)',
        releaseDate: 'May 2024',
        capabilities: ['Real-time audio processing', 'High-speed image synthesis', 'Advanced programming orchestration', 'Multilingual fluency'],
        benchmarks: { Coding: '90.2%', Reasoning: '91.8%', Math: '82.5%', Vision: '88.9%', Agent: '81.4%', 'Long Context': '128k tokens' },
        description: 'OpenAI\'s flagship multimodal model designed for conversational speed, integrated voice features, and versatile task automation.'
      },
      {
        name: 'OpenAI o1-preview',
        version: 'o1-preview (Reasoning)',
        releaseDate: 'September 2024',
        capabilities: ['Complex mathematical reasoning', 'Multi-turn coding debug cycles', 'Deep physics/chemistry analysis', 'Advanced logic lookup'],
        benchmarks: { Coding: '92.6%', Reasoning: '94.5%', Math: '92.1%', Vision: '85.4%', Agent: '87.0%', 'Long Context': '128k tokens' },
        description: 'Designed specifically to spend more time "thinking" before responding, producing superior reasoning capabilities on elite STEM benchmarks.'
      }
    ],
    research: [
      {
        title: 'Improving Language Understanding by Generative Pre-Training',
        authors: 'Alec Radford, Karthik Narasimhan, Tim Salimans, Ilya Sutskever',
        date: '2018',
        citations: '45,000+',
        link: 'https://openai.com/research/language-unsupervised',
        summary: 'The seminal paper introducing the GPT architecture, training a transformer decoder on a massive unsupervised text corpus.'
      },
      {
        title: 'Language Models are Few-Shot Learners',
        authors: 'Tom Brown, Benjamin Mann, Nick Ryder, Melanie Subbiah, Ilya Sutskever, et al.',
        date: '2020',
        citations: '32,000+',
        link: 'https://arxiv.org/abs/2005.14165',
        summary: 'Introduced GPT-3 and proved that massive language models exhibit powerful few-shot learning behavior without gradient updates.'
      }
    ],
    benchmarks: [
      { subject: 'Coding', score: 91, fullMark: 100 },
      { subject: 'Reasoning', score: 94, fullMark: 100 },
      { subject: 'Math', score: 92, fullMark: 100 },
      { subject: 'Vision', score: 87, fullMark: 100 },
      { subject: 'Agent', score: 85, fullMark: 100 },
      { subject: 'Long Context', score: 75, fullMark: 100 }
    ],
    products: [
      { name: 'ChatGPT Plus/Team/Enterprise', type: 'App', description: 'Conversational assistant with custom GPT storage, file reading, and live internet browsing.', features: ['Web Search Grounding', 'Custom GPT Creation', 'DALL-E 3 Image Generation', 'Workspace collaboration'] },
      { name: 'OpenAI Developer API', type: 'API', description: 'Direct developer access to GPT-4o, o1-series, Embeddings, Whisper, and TTS endpoints.', features: ['Structured Outputs', 'Fine-tuning access', 'JSON Schema validation', 'Rate limit tiering'] }
    ],
    fundingHistory: [
      { round: 'Seed commitment', date: 'Dec 2015', amount: '$1.0B Commitment', investors: ['Sam Altman', 'Peter Thiel', 'Reid Hoffman', 'YCombinator'] },
      { round: 'Corporate Investment', date: 'Jul 2019', amount: '$1.0B', valuation: '$20B', investors: ['Microsoft'] },
      { round: 'Venture Round', date: 'Jan 2023', amount: '$10.0B', valuation: '$29B', investors: ['Microsoft', 'Thrive Capital', 'Founders Fund'] },
      { round: 'Tender Offer', date: 'Oct 2024', amount: '$6.6B', valuation: '$157B', investors: ['Thrive Capital', 'NVIDIA', 'Khosla Ventures', 'Altimeter Capital'] }
    ],
    relatedCompanies: [
      { name: 'Anthropic', relation: 'competitor', desc: 'Primary rival in frontier research, established by former OpenAI safety leaders.', slug: 'anthropic' },
      { name: 'Google DeepMind', relation: 'competitor', desc: 'Rival with supreme computational resources and deep engineering pedigree.', slug: 'google-deepmind' },
      { name: 'Microsoft AI', relation: 'partner', desc: 'Primary infrastructure sponsor, commercial distributor, and strategic capital backer.', slug: 'microsoft-ai' }
    ]
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic',
    slug: 'anthropic',
    logo: 'A',
    color: '#cc9966',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
    shortDesc: 'AI safety and research company, developer of the Claude LLM series and Constitutional AI.',
    longDesc: 'Anthropic is a public benefit corporation founded in 2021 by former leaders of OpenAI, including siblings Daniela and Dario Amodei. Driven by concern over AI alignment and safety, Anthropic developed "Constitutional AI"—a system to align models using written guidelines rather than manual feedback. Anthropic\'s Claude model series is celebrated for exceptional software development reasoning, conversational nuance, and massive context ingestion capacities.',
    country: 'United States',
    foundedYear: '2021',
    hq: 'San Francisco, California',
    founders: ['Dario Amodei', 'Daniela Amodei', 'Jared Kaplan', 'Sam McCandlish'],
    ceo: 'Dario Amodei',
    website: 'https://anthropic.com',
    latestStatus: 'Actively releasing Claude 3.5 series and expanding agentic computer-use frameworks for enterprise workstation loops.',
    whyItMatters: 'Anthropic pioneered structured AI alignment techniques, and created Claude 3.5 Sonnet, widely recognized as the best coding and reasoning engine.',
    strengths: [
      'Pioneering software engineering and computer automation (Claude 3.5 Sonnet)',
      'Constitutional AI alignment techniques ensuring highly secure systems',
      'Sophisticated visual interpretation and diagrammatic reasoning',
      'Extensive 200,500 token contextual frame standards'
    ],
    industryPosition: 'Top-tier frontier competitor, dominant in software engineering, technical analysis, and corporate codebases.',
    metrics: {
      modelsCount: 8,
      fundingTotal: '$9.7B',
      employees: '800+',
      valuation: '$40B',
      openSourceProjects: 15,
      papersCount: 68,
      apiAvailable: true,
      enterpriseSolutions: true
    },
    timeline: [
      { year: '2021', date: 'January 2021', title: 'Anthropic Founded', description: 'Established by former OpenAI safety directors Amodei siblings.', type: 'founded' },
      { year: '2022', date: 'December 2022', title: 'Constitutional AI Paper', description: 'Published landmark alignment methodology paper.', type: 'research' },
      { year: '2023', date: 'March 2023', title: 'Claude 1.0 Launch', description: 'Released initial proprietary model via private API access.', type: 'model' },
      { year: '2023', date: 'September 2023', title: 'Amazon $4B Partnership', description: 'Secured minority backing and primary AWS computational collaboration.', type: 'partnership' },
      { year: '2023', date: 'October 2023', title: 'Google $2B backing', description: 'Google committed multi-billion direct cloud platform infrastructure support.', type: 'funding' },
      { year: '2024', date: 'March 2024', title: 'Claude 3 Family Released', description: 'Claude 3 Opus surpasses competitor models on high-level logical benchmarks.', type: 'model' },
      { year: '2024', date: 'June 2024', title: 'Claude 3.5 Sonnet Debut', description: 'Released 3.5 Sonnet, establishing SOTA in computer code generation.', type: 'model' },
      { year: '2024', date: 'October 2024', title: 'Computer Use Released', description: 'Introduced Claude API capabilities to interact directly with desktop screens.', type: 'model' }
    ],
    models: [
      {
        name: 'Claude 3.5 Sonnet',
        version: 'v3.5 (Sonnet)',
        releaseDate: 'June 2024',
        capabilities: ['Autonomous computer automation', 'Superior multi-file code editing', 'Scientific analysis mapping', 'Visual UI generation'],
        benchmarks: { Coding: '92.0%', Reasoning: '93.8%', Math: '88.2%', Vision: '91.0%', Agent: '89.5%', 'Long Context': '200k tokens' },
        description: 'The premier model for technical developers, boasting state-of-the-art coding, scientific reasoning, and web UI prototyping capabilities.'
      },
      {
        name: 'Claude 3 Opus',
        version: 'v3.0 (Opus)',
        releaseDate: 'March 2024',
        capabilities: ['Complex strategy design', 'Highly creative and safe composition', 'Exhaustive data reading', 'Technical document review'],
        benchmarks: { Coding: '84.9%', Reasoning: '86.8%', Math: '60.1%', Vision: '85.0%', Agent: '75.2%', 'Long Context': '200k tokens' },
        description: 'Anthropic\'s largest model, optimized for highly complex strategies, research evaluation, and creative compositional depth.'
      }
    ],
    research: [
      {
        title: 'Constitutional AI: Harmlessness from AI Feedback',
        authors: 'Yuntao Bai, Saurav Kadavath, Sandipan Kundu, Dario Amodei, et al.',
        date: '2022',
        citations: '1,800+',
        link: 'https://arxiv.org/abs/2212.08073',
        summary: 'Introduced Constitutional AI, proving models can self-correct to reduce bias and toxicity using a set of written rules.'
      }
    ],
    benchmarks: [
      { subject: 'Coding', score: 92, fullMark: 100 },
      { subject: 'Reasoning', score: 93, fullMark: 100 },
      { subject: 'Math', score: 88, fullMark: 100 },
      { subject: 'Vision', score: 91, fullMark: 100 },
      { subject: 'Agent', score: 89, fullMark: 100 },
      { subject: 'Long Context', score: 85, fullMark: 100 }
    ],
    products: [
      { name: 'Claude Console & API', type: 'API', description: 'High-performance API key management, Workbench prompting workspace, and Claude 3.5 endpoints.', features: ['Prompt caching', 'Structured JSON extraction', 'Computer action loops', 'Prefilled role state responses'] },
      { name: 'Claude.ai (Free/Pro/Team)', type: 'App', description: 'Web interface with advanced file upload workspace tabs (Artifacts) and customized chat contexts.', features: ['Artifacts active preview canvas', 'Projects document indexing', 'Multiple file attachments', 'Custom styling previews'] }
    ],
    fundingHistory: [
      { round: 'Series A', date: 'May 2021', amount: '$124M', investors: ['Jaan Tallinn', 'Dustin Moskovitz'] },
      { round: 'Series B', date: 'Apr 2022', amount: '$580M', investors: ['Sam Bankman-Fried', 'Caroline Ellison'] },
      { round: 'Strategic backing', date: 'Sep 2023', amount: '$4.0B', valuation: '$20B', investors: ['Amazon (AWS)'] },
      { round: 'Corporate injection', date: 'Oct 2023', amount: '$2.0B', investors: ['Google'] }
    ],
    relatedCompanies: [
      { name: 'OpenAI', relation: 'competitor', desc: 'Direct market adversary and former employer of founders.', slug: 'openai' },
      { name: 'Google DeepMind', relation: 'competitor', desc: 'Rival and structural partner in cloud scaling infrastructure.', slug: 'google-deepmind' },
      { name: 'Mistral AI', relation: 'alternative', desc: 'European developer focusing on light enterprise-grade model efficiencies.', slug: 'mistral-ai' }
    ]
  },
  'google-deepmind': {
    id: 'google-deepmind',
    name: 'Google DeepMind',
    slug: 'google-deepmind',
    logo: 'G',
    color: '#4285f4',
    coverImage: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=600&auto=format&fit=crop',
    shortDesc: 'Google\'s unified AI research unit, behind the Gemini multimodal series and AlphaFold structural biology.',
    longDesc: 'Google DeepMind represents Google\'s consolidated artificial intelligence force, created in 2023 by merging the London-based DeepMind (acquired in 2014) with Google Brain. Google DeepMind combines theoretical computer science with heavy consumer scaling. Celebrated for groundbreaking contributions to scientific computing (AlphaFold, AlphaGo), Google DeepMind leads Google\'s consumer generative efforts through the Gemini multimodal series, known for pioneer context processing up to 2 million tokens.',
    country: 'United Kingdom / US',
    foundedYear: '2010',
    hq: 'London, United Kingdom',
    founders: ['Demis Hassabis', 'Shane Legg', 'Mustafa Suleyman'],
    ceo: 'Demis Hassabis',
    website: 'https://deepmind.google',
    latestStatus: 'Actively releasing Gemini 1.5 and Gemini 2.0 architectures, and mapping AlphaFold 3 molecular biological drug targets.',
    whyItMatters: 'DeepMind proved that deep reinforcement learning could conquer human game complexity, and catalyzed structural biology through the Nobel-winning AlphaFold mapping systems.',
    strengths: [
      'Peerless long-context ingestion systems (Gemini 2,000,000 token boundaries)',
      'Sublime AI for Science divisions (AlphaFold 3, materials synthesis)',
      'Comprehensive on-device mobile AI integration (Gemini Nano on Android)',
      'Massive global infrastructure support via Google TPU arrays'
    ],
    industryPosition: 'Sovereign tech division with unmatched research depth and computational infrastructure power.',
    metrics: {
      modelsCount: 20,
      fundingTotal: 'Google Division',
      employees: '2,000+',
      valuation: 'Part of Alphabet',
      openSourceProjects: 150,
      papersCount: 850,
      apiAvailable: true,
      enterpriseSolutions: true
    },
    timeline: [
      { year: '2010', date: 'September 2010', title: 'DeepMind Founded', description: 'Established in London by Demis Hassabis, Shane Legg, and Mustafa Suleyman.', type: 'founded' },
      { year: '2014', date: 'January 2014', title: 'Google Acquisition', description: 'Acquired by Google for £400M to serve as foundational AI laboratory.', type: 'funding' },
      { year: '2016', date: 'March 2016', title: 'AlphaGo Conquest', description: 'AlphaGo defeats world champion Lee Sedol, demonstrating deep reinforcement learning capability.', type: 'research' },
      { year: '2020', date: 'November 2020', title: 'AlphaFold 2 Breakthrough', description: 'Solved the 50-year protein folding challenge at CASP14 competition.', type: 'research' },
      { year: '2023', date: 'April 2023', title: 'Google Brain Merger', description: 'Merged with Google Brain to create Google DeepMind under Demis Hassabis.', type: 'founded' },
      { year: '2023', date: 'December 2023', title: 'Gemini 1.0 Multimodal Debut', description: 'Released Gemini, Google\'s native multimodal foundation model family.', type: 'model' },
      { year: '2024', date: 'February 2024', title: 'Gemini 1.5 Pro Context Leap', description: 'Unveiled 1.5 Pro, introducing a breakthrough 1 million token context boundary.', type: 'model' },
      { year: '2024', date: 'May 2024', title: 'AlphaFold 3 Release', description: 'Expanded protein modeling to DNA, RNA, chemical compounds, and drug interactions.', type: 'research' }
    ],
    models: [
      {
        name: 'Gemini 1.5 Pro',
        version: 'v1.5 (Pro)',
        releaseDate: 'February 2024',
        capabilities: ['2-million context window', 'Native video understanding', 'Complex multi-hour audio processing', 'Massive codebase review'],
        benchmarks: { Coding: '84.1%', Reasoning: '94.2%', Math: '86.0%', Vision: '89.5%', Agent: '82.0%', 'Long Context': '2000k tokens' },
        description: 'A revolutionary multimodal model capable of reading whole corporate repositories, multi-hour video transcripts, or massive textbooks in a single prompt.'
      },
      {
        name: 'Gemini 1.5 Flash',
        version: 'v1.5 (Flash)',
        releaseDate: 'May 2024',
        capabilities: ['Sub-second latency execution', 'High throughput chat loops', 'Low-cost API orchestration', 'Document scanning'],
        benchmarks: { Coding: '74.3%', Reasoning: '82.8%', Math: '71.0%', Vision: '81.4%', Agent: '74.5%', 'Long Context': '1000k tokens' },
        description: 'Optimized for high-speed, cost-effective multimodal pipelines, carrying an impressive 1M token context frame.'
      }
    ],
    research: [
      {
        title: 'Highly accurate protein structure prediction with AlphaFold',
        authors: 'John Jumper, Richard Evans, Demis Hassabis, et al.',
        date: '2021',
        citations: '28,000+',
        link: 'https://www.nature.com/articles/s41586-021-03819-2',
        summary: 'Noble prize-winning scientific paper detailing AlphaFold 2, predicting 3D structures of proteins with atomic accuracy.'
      },
      {
        title: 'Mastering the game of Go with deep neural networks and tree search',
        authors: 'David Silver, Demis Hassabis, et al.',
        date: '2016',
        citations: '18,500+',
        link: 'https://www.nature.com/articles/nature16961',
        summary: 'Introduced AlphaGo, combining reinforcement learning and Monte Carlo Tree Search to defeat champion Go players.'
      }
    ],
    benchmarks: [
      { subject: 'Coding', score: 84, fullMark: 100 },
      { subject: 'Reasoning', score: 94, fullMark: 100 },
      { subject: 'Math', score: 86, fullMark: 100 },
      { subject: 'Vision', score: 90, fullMark: 100 },
      { subject: 'Agent', score: 82, fullMark: 100 },
      { subject: 'Long Context', score: 98, fullMark: 100 }
    ],
    products: [
      { name: 'Google AI Studio', type: 'Platform', description: 'Direct web IDE for fast prototyping with Gemini 1.5, showing immediate multi-million token code ingest features.', features: ['System Instructions editor', 'API Key Generation', 'Multimodal file picker', 'Direct curls code exporting'] },
      { name: 'Gemini App / Advanced', type: 'App', description: 'Consumer chatbot integrated across Google Workspace (Docs, Gmail, Drive) and smartphones.', features: ['Workspace dynamic retrieval', 'Advanced coding execution sandbox', 'Voice interactions', 'Live web grounded searches'] }
    ],
    fundingHistory: [
      { round: 'Acquisition by Google', date: 'Jan 2014', amount: '£400M', investors: ['Google (Alphabet Inc.)'] }
    ],
    relatedCompanies: [
      { name: 'OpenAI', relation: 'competitor', desc: 'Rival in foundation language research and consumer application dominance.', slug: 'openai' },
      { name: 'Anthropic', relation: 'competitor', desc: 'Rival in premium agentic development and secure enterprise APIs.', slug: 'anthropic' },
      { name: 'Meta AI', relation: 'competitor', desc: 'Rival in open-weights model distribution and researcher capture.', slug: 'meta' }
    ]
  },
  xai: {
    id: 'xai',
    name: 'xAI',
    slug: 'xai',
    logo: 'X',
    color: '#000000',
    coverImage: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=600&auto=format&fit=crop',
    shortDesc: 'Elon Musk\'s AI research lab, building the Colossus supercluster and Grok assistant.',
    longDesc: 'xAI was founded in July 2023 by Elon Musk with the explicit goal to "understand the true nature of the universe." Leveraging Musk\'s ecosystem of businesses (including X, Tesla, SpaceX, and Neuralink), xAI seeks to construct multi-modal models trained on rich real-world telemetry and social text layers. In 2024, xAI constructed the "Colossus" supercluster—a massive liquid-cooled array of 100,000 NVIDIA H100 GPUs in Memphis, Tennessee, assembled in under 122 days—providing them with unprecedented raw compute training power.',
    country: 'United States',
    foundedYear: '2023',
    hq: 'Memphis, Tennessee / SF',
    founders: ['Elon Musk'],
    ceo: 'Elon Musk',
    website: 'https://x.ai',
    latestStatus: 'Currently training Grok 3 foundation models on the Colossus GPU supercluster, which is expanding to 200k H100/H200 nodes.',
    whyItMatters: 'xAI has established an elite compute-first training setup, demonstrating the fastest infrastructure scale-up speed in history.',
    strengths: [
      'Unprecedented hardware scale (100k liquid-cooled GPU Memphis Colossus facility)',
      'Real-time access to social-grounded web data via X (Twitter)',
      'Ultra-fast development cycles under Elon Musk\'s extreme engineering principles',
      'Unified data pipelines incorporating Tesla real-world video telemetry'
    ],
    industryPosition: 'Vigorously scaling dark-horse challenger, specializing in raw compute power, unmoderated reasoning, and real-time social grounding.',
    metrics: {
      modelsCount: 4,
      fundingTotal: '$6.0B',
      employees: '150+',
      valuation: '$24B',
      openSourceProjects: 5,
      papersCount: 12,
      apiAvailable: true,
      enterpriseSolutions: false
    },
    timeline: [
      { year: '2023', date: 'July 2023', title: 'xAI Formed', description: 'Elon Musk officially registers xAI with an elite team from DeepMind, OpenAI, and Tesla.', type: 'founded' },
      { year: '2023', date: 'November 2023', title: 'Grok 1.0 Unveiled', description: 'Released Grok, featuring a witty and sarcastic conversational tone integrated on X.', type: 'model' },
      { year: '2024', date: 'March 2024', title: 'Grok-1 Open Weights Release', description: 'Open-sourced the weights of the massive 314-billion parameter Grok-1 model.', type: 'model' },
      { year: '2024', date: 'May 2024', title: 'Series B Capital Raise', description: 'Raised a historic $6B series B funding round at a $24B post-money valuation.', type: 'funding' },
      { year: '2024', date: 'September 2024', title: 'Memphis Colossus Online', description: 'Elon Musk announces Memphis Colossus is online with 100,000 liquid-cooled H100 GPUs.', type: 'research' },
      { year: '2024', date: 'August 2024', title: 'Grok 2 Release', description: 'Launched Grok 2, demonstrating massive improvements in general knowledge, coding, and real-time image synthesis.', type: 'model' }
    ],
    models: [
      {
        name: 'Grok 2',
        version: 'v2.0',
        releaseDate: 'August 2024',
        capabilities: ['Real-time social grounding (via X)', 'Creative image synthesis (via Flux)', 'Sarcastic / conversational tone overrides', 'Technical programming feedback'],
        benchmarks: { Coding: '87.5%', Reasoning: '88.3%', Math: '75.0%', Vision: '86.1%', Agent: '70.5%', 'Long Context': '128k tokens' },
        description: 'An upgraded high-performance conversational model that leverages real-time social streams on X and native flux-based image generation.'
      }
    ],
    research: [
      {
        title: 'Grok-1: Technical Report on a 314B Parameter MoE',
        authors: 'xAI Research Team',
        date: '2024',
        citations: '250+',
        link: 'https://x.ai/blog/grok-1',
        summary: 'Details the architecture, training runs, and dataset compilation for the 314B parameter mixture-of-experts model.'
      }
    ],
    benchmarks: [
      { subject: 'Coding', score: 87, fullMark: 100 },
      { subject: 'Reasoning', score: 88, fullMark: 100 },
      { subject: 'Math', score: 75, fullMark: 100 },
      { subject: 'Vision', score: 86, fullMark: 100 },
      { subject: 'Agent', score: 70, fullMark: 100 },
      { subject: 'Long Context', score: 68, fullMark: 100 }
    ],
    products: [
      { name: 'Grok on X (Premium/Premium+)', type: 'App', description: 'Interactive AI assistant embedded within the X social platform, capable of real-time web summaries.', features: ['X real-time post retrieval', 'Image generation', 'Humorous tone selector', 'Multimodal attachments'] },
      { name: 'xAI Developer Portal', type: 'API', description: 'REST APIs for Grok text-completions and vision analysis.', features: ['Fully function-calling compatible', 'Citations retrieval', 'Rate limits dashboard'] }
    ],
    fundingHistory: [
      { round: 'Series B', date: 'May 2024', amount: '$6.0B', valuation: '$24B', investors: ['Thrive Capital', 'Valor Equity Partners', 'Fidelity Management', 'Sequoia Capital'] }
    ],
    relatedCompanies: [
      { name: 'OpenAI', relation: 'competitor', desc: 'Direct market adversary and target of Musk\'s safety concerns.', slug: 'openai' },
      { name: 'NVIDIA Corp', relation: 'partner', desc: 'Silicon manufacturer supplying the 100k+ liquid-cooled GPU clusters.', slug: 'nvidia' },
      { name: 'Meta AI', relation: 'alternative', desc: 'Rival in massive scale open-weights model distribution.', slug: 'meta' }
    ]
  },
  meta: {
    id: 'meta',
    name: 'Meta AI',
    slug: 'meta',
    logo: 'M',
    color: '#0668e1',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop',
    shortDesc: 'Meta\'s research unit, pioneer of open weights standard with the Llama series and PyTorch.',
    longDesc: 'Meta AI is the centralized research and development organization of Meta Platforms Inc. Formed around FAIR (Facebook AI Research) under the pioneering direction of Turing award winner Yann LeCun, Meta AI has consistently championing open-source research. In 2023, Meta introduced Llama, fundamentally changing the proprietary AI landscape by offering near-frontier weights for free public downloading. PyTorch, Meta\'s deep-learning library, powers virtually all AI engineering worldwide.',
    country: 'United States',
    foundedYear: '2013',
    hq: 'Menlo Park, California',
    founders: ['Mark Zuckerberg', 'Yann LeCun'],
    ceo: 'Mark Zuckerberg',
    website: 'https://meta.ai',
    latestStatus: 'Actively distributing Llama 3.1 and Llama 3.2 vision/multimodal models, and training Llama 4 clusters.',
    whyItMatters: 'Meta established the open-weights development standard, enabling researchers, startups, and academic groups to build customized local systems without commercial API fees.',
    strengths: [
      'Dominant market champion of Open Weights distribution (Llama series)',
      'Unmatched research depth under Yann LeCun (FAIR)',
      'Primary creator of PyTorch, the industrial standard AI training codebase',
      'Unparalleled social network consumer exposure (WhatsApp, Instagram, Facebook integration)'
    ],
    industryPosition: 'The undisputed sovereign of open-weights AI, driving academic research and local startup ecosystems globally.',
    metrics: {
      modelsCount: 18,
      fundingTotal: 'Meta Division',
      employees: '1,200+',
      valuation: 'Part of Meta',
      openSourceProjects: 400,
      papersCount: 750,
      apiAvailable: false,
      enterpriseSolutions: true
    },
    timeline: [
      { year: '2013', date: 'December 2013', title: 'FAIR Founded', description: 'Facebook AI Research established in Menlo Park, directed by Yann LeCun.', type: 'founded' },
      { year: '2016', date: 'September 2016', title: 'PyTorch Released', description: 'Meta releases PyTorch, which would quickly become the dominant deep-learning codebase globally.', type: 'research' },
      { year: '2023', date: 'February 2023', title: 'Llama 1 Unveiled', description: 'Meta shares weights with researchers, sparking a decentralized AI revolution.', type: 'model' },
      { year: '2023', date: 'July 2023', title: 'Llama 2 Launched', description: 'Released for free commercial use in partnership with Microsoft.', type: 'model' },
      { year: '2024', date: 'April 2024', title: 'Llama 3 Released', description: 'Dropped high-efficiency 8B and 70B models trained on over 15T text tokens.', type: 'model' },
      { year: '2024', date: 'July 2024', title: 'Llama 3.1 405B Released', description: 'Released first truly frontier-level open-weights model, competing directly with SOTA closed APIs.', type: 'model' }
    ],
    models: [
      {
        name: 'Llama 3.1 405B',
        version: 'v3.1 (405B Parameters)',
        releaseDate: 'July 2024',
        capabilities: ['Frontier-grade open weights reasoning', 'Custom synthetic dataset generation', 'Complex multilingual translation', 'Detailed code compilation'],
        benchmarks: { Coding: '88.6%', Reasoning: '88.1%', Math: '73.8%', Vision: '81.0%', Agent: '76.2%', 'Long Context': '128k tokens' },
        description: 'The world\'s largest open weights model, enabling developers to run, fine-tune, or distill a frontier-level model entirely on their own secure hardware.'
      },
      {
        name: 'Llama 3.2 11B Vision',
        version: 'v3.2 (11B Parameters)',
        releaseDate: 'September 2024',
        capabilities: ['On-device visual scanning', 'Handwritten chart analysis', 'Compact local edge running', 'Ultra-low parameter execution'],
        benchmarks: { Coding: '64.5%', Reasoning: '72.3%', Math: '54.0%', Vision: '78.5%', Agent: '60.1%', 'Long Context': '128k tokens' },
        description: 'A highly optimized, compact multimodal vision model designed to run efficiently on high-end consumer workstations and edge servers.'
      }
    ],
    research: [
      {
        title: 'Llama 3 Herd of Models: Technical Report',
        authors: 'Meta Llama Team',
        date: '2024',
        citations: '1,500+',
        link: 'https://meta.ai/llama-technical-report',
        summary: 'Comprehensive 100+ page paper mapping the dataset compilation, instruction-tuning, and evaluation of Llama 3 models.'
      },
      {
        title: 'PyTorch: An Imperative Style, High-Performance Deep Learning Library',
        authors: 'Adam Paszke, Sam Gross, Soumith Chintala, Gregory Chanan, et al.',
        date: '2019',
        citations: '35,000+',
        link: 'https://pytorch.org',
        summary: 'Presents the design of PyTorch, explaining its dynamic computational graphs and pythonic software abstraction layer.'
      }
    ],
    benchmarks: [
      { subject: 'Coding', score: 88, fullMark: 100 },
      { subject: 'Reasoning', score: 88, fullMark: 100 },
      { subject: 'Math', score: 73, fullMark: 100 },
      { subject: 'Vision', score: 81, fullMark: 100 },
      { subject: 'Agent', score: 76, fullMark: 100 },
      { subject: 'Long Context', score: 80, fullMark: 100 }
    ],
    products: [
      { name: 'Meta AI Assistant', type: 'App', description: 'Consumer AI integrated across Meta\'s messaging ecosystem (WhatsApp, Messenger, Instagram), providing free search answers.', features: ['Direct message integrations', 'Imagine photo synthesis', 'Group chat prompt activations'] },
      { name: 'Llama Open Source Weights', type: 'Platform', description: 'Downloadable neural network weights in 8B, 70B, and 405B capacities via HuggingFace or Meta Platform.', features: ['Commercial license permission', 'Fully fine-tunable weights', 'Quantization-friendly patterns'] }
    ],
    fundingHistory: [
      { round: 'Corporate Funded', date: 'N/A', amount: 'Meta Internal Budget' }
    ],
    relatedCompanies: [
      { name: 'OpenAI', relation: 'competitor', desc: 'Rival closed API model provider whose pricing Meta aims to disrupt.', slug: 'openai' },
      { name: 'Microsoft AI', relation: 'partner', desc: 'Infrastructure and distribution partner hosting Llama deployments.', slug: 'microsoft-ai' },
      { name: 'Mistral AI', relation: 'partner', desc: 'European developer which shares Meta\'s open-weights distribution ethos.', slug: 'mistral-ai' }
    ]
  },
  nvidia: {
    id: 'nvidia',
    name: 'NVIDIA Corp',
    slug: 'nvidia',
    logo: 'N',
    color: '#76b900',
    coverImage: 'https://images.unsplash.com/photo-1601524909162-be87252be298?q=80&w=600&auto=format&fit=crop',
    shortDesc: 'The global leader in accelerated hardware, AI supercomputers, and CUDA developer platforms.',
    longDesc: 'NVIDIA Corporation is an American technology company. Initially founded to advance 3D gaming graphics, NVIDIA pioneered the modern GPU (Graphics Processing Unit). In 2006, CEO Jensen Huang made a high-risk bet by launching CUDA—a programming architecture enabling GPUs to execute general-purpose computer programs. This bet established NVIDIA as the sole supplier of the silicon foundations powering the modern deep learning and generative AI boom, making NVIDIA one of the most valuable corporations in the world.',
    country: 'United States',
    foundedYear: '1993',
    hq: 'Santa Clara, California',
    founders: ['Jensen Huang', 'Chris Malachowsky', 'Curtis Priem'],
    ceo: 'Jensen Huang',
    website: 'https://nvidia.com',
    latestStatus: 'Ramping up mass worldwide shipment of Blackwell B200 and GB200 NVL72 liquid-cooled supercomputers.',
    whyItMatters: 'NVIDIA manufactures the actual hardware accelerators (H100, B200, Blackwell) and the software (CUDA) that together train and run virtually all modern AI models.',
    strengths: [
      'Peerless accelerated hardware market share (estimated at 90%+ in data center GPUs)',
      'CUDA ecosystem lock-in, supported by over 5 million developers',
      'Advanced silicon packaging technologies (TSMC CoWoS design collaboration)',
      'Full-system supercomputing solutions (NVLink fabric, custom networking switches)'
    ],
    industryPosition: 'The undisputed supreme sovereign of AI hardware, serving as the physical foundation for every other frontier AI lab.',
    metrics: {
      modelsCount: 4,
      fundingTotal: 'Public',
      employees: '30,000+',
      valuation: '$3.2T',
      openSourceProjects: 120,
      papersCount: 350,
      apiAvailable: true,
      enterpriseSolutions: true
    },
    timeline: [
      { year: '1993', date: 'April 1993', title: 'NVIDIA Founded', description: 'Established in Santa Clara by Jensen Huang, Chris Malachowsky, and Curtis Priem.', type: 'founded' },
      { year: '1999', date: 'August 1999', title: 'GPU Invention', description: 'Released GeForce 256, defining the term "GPU" for accelerated 3D graphics.', type: 'founded' },
      { year: '2006', date: 'June 2006', title: 'CUDA Unveiled', description: 'Launched CUDA programming platform, enabling GPUs to compute mathematical models.', type: 'research' },
      { year: '2012', date: 'September 2012', title: 'AlexNet Catalyst', description: 'AlexNet CNN trains on NVIDIA GTX 580 GPUs, triggering the deep learning boom.', type: 'research' },
      { year: '2020', date: 'May 2020', title: 'A100 GPU Debut', description: 'Launched A100 Tensor Core GPU, which became the global standard for large language model training.', type: 'model' },
      { year: '2022', date: 'March 2022', title: 'H100 GPU Release', description: 'Released H100 GPU, powering GPT-4 training and causing severe hardware supply queues.', type: 'model' },
      { year: '2024', date: 'March 2024', title: 'Blackwell B200 Unveiled', description: 'Jensen Huang demonstrates the Blackwell architecture, carrying 208B transistors and offering 20 petaflops of AI compute.', type: 'model' }
    ],
    models: [
      {
        name: 'Nemotron-4 340B',
        version: 'v4.0 (Open Weights)',
        releaseDate: 'June 2024',
        capabilities: ['Highly optimized synthetic data generation', 'Complex structured code extraction', 'Advanced corporate curation models'],
        benchmarks: { Coding: '78.5%', Reasoning: '82.0%', Math: '68.0%', Vision: 'N/A', Agent: '74.0%', 'Long Context': '4k tokens' },
        description: 'An open-weights model designed specifically to help enterprises synthesize high-quality, safe training datasets for their custom in-house LLMs.'
      }
    ],
    research: [
      {
        title: 'ImageNet Classification with Deep Convolutional Neural Networks (AlexNet)',
        authors: 'Alex Krizhevsky, Ilya Sutskever, Geoffrey Hinton',
        date: '2012',
        citations: '145,000+',
        link: 'https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks',
        summary: 'The historic paper that proved GPUs could train massive neural networks, launching the modern era of deep learning research.'
      }
    ],
    benchmarks: [
      { subject: 'Coding', score: 78, fullMark: 100 },
      { subject: 'Reasoning', score: 82, fullMark: 100 },
      { subject: 'Math', score: 68, fullMark: 100 },
      { subject: 'Vision', score: 50, fullMark: 100 },
      { subject: 'Agent', score: 74, fullMark: 100 },
      { subject: 'Long Context', score: 40, fullMark: 100 }
    ],
    products: [
      { name: 'DGX H100 / DGX B200 Supercomputers', type: 'Enterprise', description: 'Accelerated turn-key AI supercomputing clusters containing NVLink-fabric interconnected GPUs.', features: ['Liquid-cooling architecture', 'NVLink 900 GB/s interconnections', 'Direct cluster scaling'] },
      { name: 'NVIDIA AI Enterprise & CUDA', type: 'Platform', description: 'The software layer, compilers, and library platforms that translate code into GPU machine instructions.', features: ['CUDA compilers', 'TensorRT inference optimizers', 'NIM deployable microservices'] }
    ],
    fundingHistory: [
      { round: 'IPO', date: 'Jan 1999', amount: '$42M raised', valuation: '$230M', investors: ['Public Markets'] }
    ],
    relatedCompanies: [
      { name: 'OpenAI', relation: 'competitor', desc: 'Hardware customer, but also competitor as OpenAI explores custom ASIC chips.', slug: 'openai' },
      { name: 'Google DeepMind', relation: 'partner', desc: 'Google uses custom TPUs, but remains a major client of high-density NVIDIA hardware.', slug: 'google-deepmind' },
      { name: 'xAI', relation: 'partner', desc: 'Major capital customer purchasing hundreds of thousands of GPUs for Colossus.', slug: 'xai' }
    ]
  },
  'mistral-ai': {
    id: 'mistral-ai',
    name: 'Mistral AI',
    slug: 'mistral-ai',
    logo: 'FR',
    color: '#ff5c00',
    coverImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop',
    shortDesc: 'European open weights champion backing high-performance, efficient language models.',
    longDesc: 'Mistral AI is a French artificial intelligence company founded in May 2023 by former researchers from Google DeepMind and Meta. Operating from Paris, Mistral AI quickly became Europe\'s premier generative startup, championing model efficiency, local edge hosting, and permissive open-weights licenses. Mistral AI has captured enterprise trust through optimized architectures like Mixture-of-Experts (MoE) which deliver elite capabilities at fractionally lower computational hosting fees.',
    country: 'France',
    foundedYear: '2023',
    hq: 'Paris, France',
    founders: ['Arthur Mensch', 'Guillaume Lample', 'Timothée Lacroix'],
    ceo: 'Arthur Mensch',
    website: 'https://mistral.ai',
    latestStatus: 'Actively rolling out Mistral Large 2, Codestral programming models, and expanding global enterprise server partnerships.',
    whyItMatters: 'Mistral AI serves as Europe\'s sovereign counterweight to American frontier laboratories, proving that small, compact models can rival massive closed systems.',
    strengths: [
      'Pioneering implementation of Mixture-of-Experts (MoE) architectures',
      'Extremely permissive open-weights model distribution structures',
      'Highly optimized local compilation features (Codestral, Mistral 7B)',
      'Sovereign European data center regulatory hosting advantages'
    ],
    industryPosition: 'The leading European foundation lab, dominant in secure open-weights enterprise hosting and edge-deployed microservices.',
    metrics: {
      modelsCount: 11,
      fundingTotal: '€1.1B',
      employees: '120+',
      valuation: '€6B',
      openSourceProjects: 18,
      papersCount: 22,
      apiAvailable: true,
      enterpriseSolutions: true
    },
    timeline: [
      { year: '2023', date: 'May 2023', title: 'Mistral AI Founded', description: 'Established in Paris by Mensch, Lample, and Lacroix.', type: 'founded' },
      { year: '2023', date: 'June 2023', title: 'Record Seed Round', description: 'Raised a historic €105M seed round, the largest in European startup history.', type: 'funding' },
      { year: '2023', date: 'September 2023', title: 'Mistral 7B Release', description: 'Released Mistral 7B, setting a new benchmark for open models under 10B parameters.', type: 'model' },
      { year: '2023', date: 'December 2023', title: 'Mixtral 8x7B Launch', description: 'Pioneered high-quality open Mixture-of-Experts (MoE), matching Llama 2 performance with lower active compute.', type: 'model' },
      { year: '2024', date: 'February 2024', title: 'Microsoft Strategic Alliance', description: 'Secured Microsoft backing and Azure cloud distribution channel.', type: 'partnership' },
      { year: '2024', date: 'July 2024', title: 'Mistral Large 2 Debut', description: 'Released Mistral Large 2 (123B parameters), matching GPT-4 on code compiling and mathematical logic.', type: 'model' }
    ],
    models: [
      {
        name: 'Mistral Large 2',
        version: 'v2.0 (123B MoE)',
        releaseDate: 'July 2024',
        capabilities: ['Advanced multi-lingual translation', 'Premium SQL and python programming', 'Mixture-of-Experts efficiency', 'Low-footprint server deployment'],
        benchmarks: { Coding: '84.0%', Reasoning: '86.5%', Math: '72.0%', Vision: 'N/A', Agent: '78.5%', 'Long Context': '128k tokens' },
        description: 'Mistral\'s leading enterprise foundation model, specifically engineered for complex math, structured code generation, and multi-language execution.'
      }
    ],
    research: [
      {
        title: 'Mixtral of Experts',
        authors: 'Albert Q. Jiang, Alexandre Sablayrolles, Arthur Mensch, Guillaume Lample, et al.',
        date: '2024',
        citations: '450+',
        link: 'https://arxiv.org/abs/2401.04088',
        summary: 'Details the Mixture-of-Experts architecture, showing how Mixtral 8x7B uses only 12B active parameters per token while achieving premium general capabilities.'
      }
    ],
    benchmarks: [
      { subject: 'Coding', score: 84, fullMark: 100 },
      { subject: 'Reasoning', score: 86, fullMark: 100 },
      { subject: 'Math', score: 72, fullMark: 100 },
      { subject: 'Vision', score: 40, fullMark: 100 },
      { subject: 'Agent', score: 78, fullMark: 100 },
      { subject: 'Long Context', score: 80, fullMark: 100 }
    ],
    products: [
      { name: 'Le Plateforme & API', type: 'API', description: 'Developer APIs hosting Mistral Large, Codestral, and Embeddings with competitive token pricing.', features: ['JSON Structured outputs', 'Competitive pricing', 'EU-compliant endpoints'] },
      { name: 'Le Chat', type: 'App', description: 'Mistral\'s conversational assistant web app, providing easy document scanning and prompt tools.', features: ['Model switching options', 'Sovereign data hosting options', 'Multimodal attachments'] }
    ],
    fundingHistory: [
      { round: 'Seed Round', date: 'Jun 2023', amount: '€105M', valuation: '€240M', investors: ['Lightspeed Venture Partners', 'Redpoint Ventures'] },
      { round: 'Series A', date: 'Dec 2023', amount: '€385M', valuation: '€2.0B', investors: ['Andreessen Horowitz', 'Salesforce Ventures'] },
      { round: 'Series B', date: 'Jun 2024', amount: '€600M', valuation: '€5.8B', investors: ['General Catalyst', 'Microsoft', 'NVIDIA'] }
    ],
    relatedCompanies: [
      { name: 'Meta AI', relation: 'partner', desc: 'Collaborates on open weights advocacy but competes for developer capture.', slug: 'meta' },
      { name: 'Microsoft AI', relation: 'partner', desc: 'Azure infrastructure and commercial hosting partnership.', slug: 'microsoft-ai' },
      { name: 'Anthropic', relation: 'competitor', desc: 'Competes directly on secure enterprise-grade assistant channels.', slug: 'anthropic' }
    ]
  }
};

export function getCompanyProfile(slug: string): CompanyProfile {
  const norm = slug.toLowerCase().replace('/company/', '').trim();
  if (COMPANIES_INTEL[norm]) {
    return COMPANIES_INTEL[norm];
  }
  
  // Custom bespoke profiles generated dynamically for high fidelity
  const fallbackProfiles: Record<string, Partial<CompanyProfile>> = {
    perplexity: {
      name: "Perplexity AI",
      logo: "P",
      color: "#22c55e",
      coverImage: "https://images.unsplash.com/photo-1546074177-ffedd1d85d4c?q=80&w=600&auto=format&fit=crop",
      shortDesc: "Conversational answer engine pioneering real-time grounded search retrieval to replace traditional web indexing.",
      longDesc: "Perplexity AI is an conversational search engine designed to provide direct answers with precise citations, rather than a list of blue links. Founded in 2022 by engineering leaders from OpenAI, Meta, and Quora, Perplexity has rapidly grown to handle millions of queries daily. It leverages multiple frontier language models in tandem with custom real-time search crawlers.",
      country: "United States",
      foundedYear: "2022",
      hq: "San Francisco, California",
      ceo: "Aravind Srinivas",
      website: "https://perplexity.ai",
      latestStatus: "Expanding publisher revenue share initiatives and deploying custom Pro Search multi-step logical retrievals.",
      whyItMatters: "Perplexity represents the primary alternative to Google Search, shifting search behaviour from resource-retrieval to direct synthesis with complete citations.",
      strengths: ["Instant citations formatting and structural answer summaries", "Pro Search dynamic multi-step query generation and search-tree expansions", "Direct access to multiple frontier model endpoints", "High consumer popularity with beautiful web and mobile UI design"],
      industryPosition: "The leading conversational search challenger, dominant in research citation mapping and direct web retrieval.",
      metrics: {
        modelsCount: 4,
        fundingTotal: '$165M',
        employees: '80+',
        valuation: '$3.0B',
        openSourceProjects: 4,
        papersCount: 8,
        apiAvailable: true,
        enterpriseSolutions: true
      },
      timeline: [
        { year: '2022', date: 'August 2022', title: 'Perplexity AI Founded', description: 'Established by Aravind Srinivas, Denis Yarats, Johnny Ho, and Andy Konwinski.', type: 'founded' },
        { year: '2023', date: 'December 2023', title: 'Copilot Series Release', description: 'Introduced multi-step interactive search paths prompting users for clarifying parameters.', type: 'model' },
        { year: '2024', date: 'January 2024', title: 'Series B Raise', description: 'Secured $74M capital led by Jeff Bezos and Institutional Venture Partners.', type: 'funding' }
      ],
      models: [
        { name: "Sonar Huge", version: "v1.0 (Llama 405B based)", releaseDate: "August 2024", capabilities: ["Direct web searching", "Structured citations generation", "Multi-file document scanning"], benchmarks: { Coding: "85.0%", Reasoning: "88.2%", Math: "70.1%", Vision: "82.0%", Agent: "85.5%", "Long Context": "32k tokens" }, description: "Perplexity's largest search model, optimized for rich deep dives, structured citations formatting, and citation verification." }
      ],
      benchmarks: [
        { subject: 'Coding', score: 85, fullMark: 100 },
        { subject: 'Reasoning', score: 88, fullMark: 100 },
        { subject: 'Math', score: 70, fullMark: 100 },
        { subject: 'Vision', score: 82, fullMark: 100 },
        { subject: 'Agent', score: 85, fullMark: 100 },
        { subject: 'Long Context', score: 65, fullMark: 100 }
      ],
      products: [
        { name: "Perplexity Pro", type: "App", description: "Pro membership offering unlimited search queries, model selection, and deep web file parsing.", features: ["Model selection drawer", "Pro search multi-step queries", "Custom code execution cells"] }
      ],
      fundingHistory: [
        { round: "Series B", date: "Jan 2024", amount: "$74M", valuation: "$520M", investors: ["Jeff Bezos", "NVIDIA", "IVP", "NEA"] }
      ],
      relatedCompanies: [
        { name: "OpenAI", relation: "competitor", desc: "Competitor with SearchGPT and direct conversational consumer features.", slug: "openai" },
        { name: "Google DeepMind", relation: "competitor", desc: "Main historical target of conversational search replacement.", slug: "google-deepmind" }
      ]
    },
    deepseek: {
      name: "DeepSeek",
      logo: "DS",
      color: "#0a59f7",
      coverImage: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=600&auto=format&fit=crop",
      shortDesc: "Elite open weights lab disrupting API cost structures with state-of-the-art reasoning architectures.",
      longDesc: "DeepSeek is an artificial intelligence research laboratory based in China. Specializing in highly efficient Mixture-of-Experts (MoE) models, DeepSeek shocked the global AI community in 2024 and 2025 by launching DeepSeek-V3 and DeepSeek-Coder-V2, models that matched Western frontier players in coding, math, and logical reasoning while offering pricing up to 10x lower than competitors.",
      country: "China",
      foundedYear: "2023",
      hq: "Hangzhou, China",
      ceo: "Liang Wenfeng",
      website: "https://deepseek.com",
      latestStatus: "Actively deploying DeepSeek-V3 and expanding extreme low-latency inference APIs globally.",
      whyItMatters: "DeepSeek shattered the correlation between massive capital training requirements and frontier-tier output quality, bringing SOTA models to a fraction of the cost.",
      strengths: ["Ultra-low-cost API structures", "State-of-the-art coding and mathematical reasoning benchmarks", "Sophisticated Multi-head Latent Attention (MLA) architectures", "Permissive open weights for enterprise self-hosting"],
      industryPosition: "The leading low-cost frontier disruptor, dominating developer mindshare and open weights efficiency rankings.",
      metrics: {
        modelsCount: 6,
        fundingTotal: 'Self-Funded',
        employees: '100+',
        valuation: '$5.0B',
        openSourceProjects: 12,
        papersCount: 15,
        apiAvailable: true,
        enterpriseSolutions: true
      },
      timeline: [
        { year: '2023', date: 'July 2023', title: 'DeepSeek Formed', description: 'Established with heavy backing from parent quantitative investment firm High-Flyer.', type: 'founded' },
        { year: '2024', date: 'January 2024', title: 'DeepSeek-V1 Release', description: 'Released first open-weights conversational language series.', type: 'model' },
        { year: '2024', date: 'June 2024', title: 'DeepSeek-Coder-V2', description: 'Surpassed GPT-4 in native coding benchmarks under a permissive open license.', type: 'model' }
      ],
      models: [
        { name: "DeepSeek-V3", version: "v3.0 (671B Parameter MoE)", releaseDate: "December 2024", capabilities: ["Extreme coding compilation", "Flawless mathematical reasoning", "High throughput REST API endpoints"], benchmarks: { Coding: '93.5%', Reasoning: '92.8%', Math: '89.4%', Vision: '84.0%', Agent: '83.1%', 'Long Context': '128k tokens' }, description: "DeepSeek's flagship Mixture-of-Experts model, featuring state-of-the-art performance with ultra-competitive token pricing." }
      ],
      benchmarks: [
        { subject: 'Coding', score: 94, fullMark: 100 },
        { subject: 'Reasoning', score: 93, fullMark: 100 },
        { subject: 'Math', score: 89, fullMark: 100 },
        { subject: 'Vision', score: 84, fullMark: 100 },
        { subject: 'Agent', score: 83, fullMark: 100 },
        { subject: 'Long Context', score: 75, fullMark: 100 }
      ],
      products: [
        { name: "DeepSeek API", type: "API", description: "RESTful API providing direct access to DeepSeek models at highly competitive token rates.", features: ["OpenAI API key compatibility", "Instant cache lookup discounts", "System parameters support"] }
      ],
      fundingHistory: [
        { round: "Quantitative Capital Backing", date: "Jul 2023", amount: "Proprietary Funding", investors: ["High-Flyer Capital Management"] }
      ],
      relatedCompanies: [
        { name: "OpenAI", relation: "competitor", desc: "Target of pricing disruption and model quality comparisons.", slug: "openai" },
        { name: "Meta AI", relation: "competitor", desc: "Competes directly in open weights developer mindshare.", slug: "meta" }
      ]
    },
    'microsoft-ai': {
      name: "Microsoft AI",
      logo: "MS",
      color: "#f25022",
      coverImage: "https://images.unsplash.com/photo-1625014020903-e329f586c990?q=80&w=600&auto=format&fit=crop",
      shortDesc: "Global enterprise AI distribution powerhouse, backing OpenAI and building the Copilot ecosystem.",
      longDesc: "Microsoft AI represents the unified consumer, enterprise, and research division of Microsoft Corporation. Formed around Microsoft Research and massively expanded through an exclusive $13B strategic investment in OpenAI, Microsoft AI powers the global enterprise landscape through Azure AI cloud hosting and Windows Copilot integrations. Microsoft also develops the Phi small-language model series, setting the standard for compact edge-computing.",
      country: "United States",
      foundedYear: "2016",
      hq: "Redmond, Washington",
      ceo: "Mustafa Suleyman",
      website: "https://microsoft.com/ai",
      latestStatus: "Ramping up autonomous workstation Copilot agent integration across Windows, Word, and Excel.",
      whyItMatters: "Microsoft serves as the primary distribution channel for enterprise generative AI, packaging frontier models directly into global operating systems and enterprise SaaS.",
      strengths: ["Peerless corporate distribution rails via Office 365 and Windows", "Azure AI Cloud hosting representing the physical training ground of OpenAI", "Leading researcher in high-performance small language models (Phi series)", "Massive financial reserves and infrastructure backing"],
      industryPosition: "The dominant enterprise AI ecosystem leader, combining deep research with massive commercial distribution channels.",
      metrics: {
        modelsCount: 12,
        fundingTotal: 'Corporate Group',
        employees: '5,000+',
        valuation: 'Part of Microsoft',
        openSourceProjects: 250,
        papersCount: 480,
        apiAvailable: true,
        enterpriseSolutions: true
      },
      timeline: [
        { year: '2019', date: 'July 2019', title: 'OpenAI Alliance', description: 'Invested initial $1B, becoming the exclusive cloud supplier of OpenAI.', type: 'partnership' },
        { year: '2023', date: 'January 2023', title: '$10B Investment', description: 'Committed a historic $10B into OpenAI, integrating GPT models into Bing and Office.', type: 'partnership' },
        { year: '2024', date: 'March 2024', title: 'Mustafa Suleyman Hired', description: 'Hired DeepMind co-founder Mustafa Suleyman to direct the unified Microsoft AI division.', type: 'leadership' }
      ],
      models: [
        { name: "Phi-3.5-MoE", version: "v3.5 (Mixture-of-Experts)", releaseDate: "August 2024", capabilities: ["On-device high performance reasoning", "Offline mathematical computation", "Structured code orchestration"], benchmarks: { Coding: '76.8%', Reasoning: '81.5%', Math: '69.0%', Vision: '73.4%', Agent: '65.0%', 'Long Context': '128k tokens' }, description: "Microsoft's flagship small language model, demonstrating elite reasoning and coding benchmarks while running locally on-device." }
      ],
      benchmarks: [
        { subject: 'Coding', score: 77, fullMark: 100 },
        { subject: 'Reasoning', score: 81, fullMark: 100 },
        { subject: 'Math', score: 69, fullMark: 100 },
        { subject: 'Vision', score: 73, fullMark: 100 },
        { subject: 'Agent', score: 65, fullMark: 100 },
        { subject: 'Long Context', score: 85, fullMark: 100 }
      ],
      products: [
        { name: "Microsoft Copilot / Copilot Pro", type: "App", description: "Unified AI assistant integrated into Windows, Office, Edge, and mobile applications.", features: ["Office document automation", "PowerPoint presentation generation", "Direct web grounded search"] }
      ],
      fundingHistory: [
        { round: 'Corporate budget', date: 'N/A', amount: 'Microsoft Corporate Group' }
      ],
      relatedCompanies: [
        { name: "OpenAI", relation: "partner", desc: "Strategic partner and source of primary foundation model pipelines.", slug: "openai" },
        { name: "Google DeepMind", relation: "competitor", desc: "Rival division scaling cloud enterprise models.", slug: "google-deepmind" }
      ]
    }
  };

  const normSlug = norm.replace('-ai', '');
  const base = fallbackProfiles[norm] || fallbackProfiles[normSlug] || {
    name: norm.toUpperCase().replace('-', ' '),
    logo: norm[0]?.toUpperCase() || "C",
    color: "#6366f1",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
    shortDesc: `Premium Intelligence Profile for ${norm.toUpperCase().replace('-', ' ')} mapping operations, models, and financials.`,
    longDesc: `${norm.toUpperCase().replace('-', ' ')} is an artificial intelligence corporation pushing the boundaries of machine learning, system compilation, and specialized automation models. It focuses on developing enterprise-grade pipelines, edge deployment nodes, and custom model scaling protocols.`,
    country: "United States",
    foundedYear: "2023",
    hq: "San Francisco, California",
    ceo: "Founding Team",
    website: `https://${norm}.ai`,
    latestStatus: "Ramping up foundation model fine-tuning and active deployment of specialized enterprise solutions.",
    whyItMatters: "Contributes to the diversification of generative systems, offering specialized alternatives in model optimization, visual synthesis, or developer SDKs.",
    strengths: ["Highly-optimized task-specific execution runs", "Strong developer community engagement", "Permissive licensing and open-source contributions", "Low latency inference frameworks"],
    industryPosition: "Emerging challenger, pioneering cost-effective model alternatives and developer-first workflows.",
    metrics: {
      modelsCount: 4,
      fundingTotal: '$320M',
      employees: '60+',
      valuation: '$1.5B',
      openSourceProjects: 15,
      papersCount: 10,
      apiAvailable: true,
      enterpriseSolutions: true
    },
    timeline: [
      { year: '2023', date: 'June 2023', title: `${norm.toUpperCase().replace('-', ' ')} Formed`, description: "Established by leading software researchers and cloud architects.", type: "founded" },
      { year: '2024', date: 'May 2024', title: "Foundation Weights Release", description: "Released proprietary weights for developer experimentation.", type: "model" }
    ],
    models: [
      { name: "Model-V1 Pro", version: "v1.0", releaseDate: "May 2024", capabilities: ["Optimized text summarization", "Structured REST call automation", "Fast translation pipelines"], benchmarks: { Coding: '70.2%', Reasoning: '75.4%', Math: '62.0%', Vision: '68.0%', Agent: '60.5%', 'Long Context': '32k tokens' }, description: "High-performance edge model, optimized for lightweight container deployments." }
    ],
    benchmarks: [
      { subject: 'Coding', score: 70, fullMark: 100 },
      { subject: 'Reasoning', score: 75, fullMark: 100 },
      { subject: 'Math', score: 62, fullMark: 100 },
      { subject: 'Vision', score: 68, fullMark: 100 },
      { subject: 'Agent', score: 60, fullMark: 100 },
      { subject: 'Long Context', score: 55, fullMark: 100 }
    ],
    products: [
      { name: "Enterprise SDK", type: "SDK", description: "Direct offline developer software kits optimized for containerization.", features: ["Offline execution", "Strict data boundary security", "Simple container configs"] }
    ],
    fundingHistory: [
      { round: "Series A", date: "Jan 2024", amount: "$150M", valuation: "$1.2B", investors: ["Index Ventures", "Benchmark Capital"] }
    ],
    relatedCompanies: [
      { name: "OpenAI", relation: "competitor", desc: "Industry market standard and developer platform alternative.", slug: "openai" }
    ]
  };

  return {
    id: norm,
    name: base.name || norm.toUpperCase(),
    slug: norm,
    logo: base.logo || "C",
    color: base.color || "#6366f1",
    coverImage: base.coverImage || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
    shortDesc: base.shortDesc || "",
    longDesc: base.longDesc || "",
    country: base.country || "United States",
    foundedYear: base.foundedYear || "2023",
    hq: base.hq || "San Francisco, California",
    founders: base.founders || ["Founding Team"],
    ceo: base.ceo || "Founding Team",
    website: base.website || `https://${norm}.ai`,
    latestStatus: base.latestStatus || "",
    whyItMatters: base.whyItMatters || "",
    strengths: base.strengths || [],
    industryPosition: base.industryPosition || "Challenger",
    metrics: base.metrics || {
      modelsCount: 4,
      fundingTotal: "$150M",
      employees: "50+",
      valuation: "$1B",
      openSourceProjects: 10,
      papersCount: 5,
      apiAvailable: true,
      enterpriseSolutions: true
    },
    timeline: base.timeline || [],
    models: base.models || [],
    research: base.research || [],
    benchmarks: base.benchmarks || [],
    products: base.products || [],
    fundingHistory: base.fundingHistory || [],
    relatedCompanies: base.relatedCompanies || []
  };
}

