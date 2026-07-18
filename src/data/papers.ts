export interface PaperSection {
  title: string;
  summary: string;
  details: string;
}

export interface PaperEquation {
  latex: string;
  rendered: string;
  intuition: string;
  variables: { name: string; desc: string }[];
}

export interface PaperArchitecture {
  layersCount: string;
  parameters: string;
  trainingTokens: string;
  hardware: string;
  pipelineDescription: string;
  components: { name: string; function: string }[];
}

export interface PaperTakeaway {
  title: string;
  description: string;
}

export interface RelatedEntity {
  name: string;
  type: 'Company' | 'AI Model' | 'Benchmark';
  slug?: string;
  description: string;
}

export interface PaperProfile {
  id: string;
  slug: string;
  title: string;
  authors: string[];
  organization: string;
  publishDate: string;
  citations: string;
  category: string;
  pdfUrl: string;
  githubUrl: string;
  status: string;
  
  // Executive Summary
  executiveSummary: {
    purpose: string;
    problem: string;
    innovation: string;
    findings: string;
    impact: string;
  };

  // Simplified Explanation (Levels)
  simplifiedExplanation: {
    eli5: string;
    beginner: string;
    expert: string;
  };

  // Key Takeaways (5 to 10 insights)
  takeaways: PaperTakeaway[];

  // Section-by-section breakdown
  breakdown: PaperSection[];

  // Equation explainer
  equations: PaperEquation[];

  // Architecture specs
  architecture: PaperArchitecture;

  // Timeline of research context
  timeline: { date: string; title: string; desc: string }[];

  // Related Entities
  relatedEntities: RelatedEntity[];
}

export const RESEARCH_PAPERS: Record<string, PaperProfile> = {
  'attention-is-all-you-need': {
    id: 'attention-is-all-you-need',
    slug: 'attention-is-all-you-need',
    title: 'Attention Is All You Need',
    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Łukasz Kaiser', 'Illia Polosukhin'],
    organization: 'Google Brain / Google Research',
    publishDate: 'June 12, 2017',
    citations: '125,000+',
    category: 'Architecture Foundations',
    pdfUrl: 'https://arxiv.org/abs/1706.03762',
    githubUrl: 'https://github.com/tensorflow/tensor2tensor',
    status: 'Milestone / Classic',
    executiveSummary: {
      purpose: 'To establish a new, simpler network architecture based solely on attention mechanisms, completely discarding recurrent or convolutional neural networks.',
      problem: 'Recurrent models (like LSTM or GRU) compute sequentially, preventing parallelization during training, leading to high training times and difficulty capturing extremely long-range dependencies.',
      innovation: 'The Transformer, which relies entirely on self-attention to draw global dependencies between input and output, allowing significantly more parallelization and reaching a new state-of-the-art in translation quality.',
      findings: 'The Transformer trained significantly faster than contemporary architectures, setting new BLEU score records on English-to-German and English-to-French translation tasks.',
      impact: 'The foundational architectural paradigm that enabled all modern generative AI, including GPT, Claude, Gemini, and Llama.'
    },
    simplifiedExplanation: {
      eli5: 'Instead of reading a book word by word and trying to remember everything from start to finish, the computer can look at all the words in a sentence at once. It uses a "highlighter" to connect words that belong together (like "dog" and "bark"), no matter how far apart they are.',
      beginner: 'Traditional translation systems processed sentences word-by-word from left to right, which made them slow and poor at keeping track of things said at the beginning. This paper introduced the Transformer, which processes everything at the same time and uses "Attention" mechanisms to dynamically weigh which words are most relevant to each other in context.',
      expert: 'The Transformer architecture replaces sequential LSTM recurrence with Scaled Dot-Product Multi-Head Self-Attention. By computing attention scores across all tokens simultaneously, the model exploits parallelization on modern GPU matrices and preserves gradient pathways across high sequence lengths.'
    },
    takeaways: [
      { title: 'Elimination of Recurrence', description: 'Completely replaced sequential RNN/LSTM cells with parallel feed-forward networks, transforming training efficiency.' },
      { title: 'Self-Attention Channels', description: 'Introduced mechanisms that directly compute relational coefficients between all tokens in a sequence regardless of distance.' },
      { title: 'Multi-Head Attention Decomposition', description: 'Allows the model to jointly attend to information from different representation subspaces at different positions.' },
      { title: 'Positional Encoding Injection', description: 'Because there is no recurrence, positional sinusoidal encodings are added to the input embeddings to preserve structural word order.' },
      { title: 'Unprecedented Scaling Potential', description: 'Discovered that self-attention layers scale predictability with compute, setting the stage for massive parameter scaling.' }
    ],
    breakdown: [
      { title: '1. Introduction', summary: 'RNNs/LSTMs were standard but suffered sequential limits.', details: 'The authors review existing language modeling paradigms, explaining why sequence parallelization is the critical roadblock in scaling neural machine translation models.' },
      { title: '2. Background', summary: 'Previous attempts like ByteNet/ConvS2S were still inefficient.', details: 'Explores how convolutional networks reduced sequential computations but struggled with long-range dependencies because the distance between tokens required logarithmic or linear steps.' },
      { title: '3. Model Architecture', summary: 'Detailed Encoder-Decoder layout with multi-head self-attention.', details: 'The model uses stacked self-attention and point-wise fully connected layers. The encoder consists of 6 identical layers, each containing a multi-head self-attention module and a simple position-wise feed-forward network.' },
      { title: '4. Self-Attention Mechanics', summary: 'How Queries, Keys, and Values formulate translation maps.', details: 'An in-depth mathematical look at Scaled Dot-Product Attention. Queries, Keys, and Values are mapped to vectors to compute weighted softmax scores.' },
      { title: '5. Training & Results', summary: 'Translation BLEU scores shattered previous benchmarks.', details: 'Shows training details on the WMT 2014 English-to-German database. The model achieved a BLEU score of 28.4, outperforming all existing single and ensemble models while utilizing a fraction of the compute.' }
    ],
    equations: [
      {
        latex: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V',
        rendered: 'Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V',
        intuition: 'Computes how much focus/attention to put on other words in the sentence. It multiplies query vectors with key vectors to find correlations, scales the result to prevent exploding gradients, applies a softmax to turn them into clean probabilities, and multiplies by the value vectors to compile the contextual meaning.',
        variables: [
          { name: 'Q', desc: 'Queries (the current word or token looking for context)' },
          { name: 'K', desc: 'Keys (all other words in the sentence acting as targets)' },
          { name: 'V', desc: 'Values (the actual informational content of those words)' },
          { name: 'd_k', desc: 'Dimension of query and key vectors, used as a scaling factor to keep variance stable' }
        ]
      }
    ],
    architecture: {
      layersCount: '6 Encoder layers + 6 Decoder layers',
      parameters: '65 Million (Base) / 213 Million (Big)',
      trainingTokens: 'Standard WMT 2014 Dataset (~36M sentences)',
      hardware: '8 NVIDIA P100 GPUs',
      pipelineDescription: 'Tokenized text is mapped to position-encoded dense vector blocks. These are fed through stacked self-attention heads with residual connections and layer normalization, feeding a final linear softmax classification layer.',
      components: [
        { name: 'Scaled Dot-Product Attention', function: 'Calculates similarity between query and key vectors to retrieve context values.' },
        { name: 'Multi-Head Attention Layer', function: 'Applies multiple projection matrices in parallel to allow the network to attend to multiple semantic features.' },
        { name: 'Positional Encodings', function: 'Injects sine and cosine waves of different frequencies to supply position details without recurrent structures.' },
        { name: 'Feed-Forward Networks', function: 'Applies two linear transformations with a ReLU activation to process each token position independently.' }
      ]
    },
    timeline: [
      { date: 'June 2017', title: 'Paper Submitted to arXiv', desc: 'Vaswani et al. introduce the first fully attention-based transformer network.' },
      { date: 'December 2017', title: 'NeurIPS Conference Presentation', desc: 'The paper is officially presented, immediately capturing deep research interest.' },
      { date: 'June 2018', title: 'The GPT Pivot', desc: 'OpenAI releases GPT-1, proving transformers can handle large scale unsupervised text training.' }
    ],
    relatedEntities: [
      { name: 'Google DeepMind', type: 'Company', description: 'Origin team of Google Research who co-authored the classic paper.' },
      { name: 'GPT-5 (Sovereign)', type: 'AI Model', description: 'State-of-the-art descendants that utilize the original multi-head transformer structure.' }
    ]
  },
  'gpt-4-technical-report': {
    id: 'gpt-4-technical-report',
    slug: 'gpt-4-technical-report',
    title: 'GPT-4 Technical Report',
    authors: ['OpenAI Research Team'],
    organization: 'OpenAI',
    publishDate: 'March 15, 2023',
    citations: '15,000+',
    category: 'Frontier Capabilities',
    pdfUrl: 'https://arxiv.org/abs/2303.08774',
    githubUrl: 'https://github.com/openai/gpt-4-evals',
    status: 'Industry Standard',
    executiveSummary: {
      purpose: 'To document the development, capabilities, limitations, and safety procedures of GPT-4, a large-scale, multimodal model capable of processing image and text inputs.',
      problem: 'While previous language models excelled in basic text generation, they struggled with complex academic test suites, real-world professional exams, and visual reasoning.',
      innovation: 'A highly scaled Transformer model trained on massive multimodal data, utilizing advanced RLHF alignment and predictable scaling laws to ensure safe, state-of-the-art capability.',
      findings: 'GPT-4 exhibits human-level performance on professional and academic exams, scoring in the top 10% of test-takers on the Uniform Bar Exam.',
      impact: 'Established multimodal LLMs as highly competent reasoning engines, shifting enterprise expectations globally towards generative tools.'
    },
    simplifiedExplanation: {
      eli5: 'This paper describes GPT-4, a super-smart AI. It can read both pictures and text and pass hard school exams (like the SATs and Bar Exam) with high scores. It also describes how the creators put "safety belts" on the AI so it doesn\'t give bad advice.',
      beginner: 'OpenAI details GPT-4, their first model capable of taking both text and image questions. The report shows that the model can solve hard logic problems and write code much better than GPT-3.5, while explaining how they spent months adjusting the model to be safe and accurate.',
      expert: 'GPT-4 is a large multimodal Transformer model trained to predict the next token. The report highlights predictable scaling laws that let researchers estimate model loss before full compute allocation, and chronicles safety protocols including red-teaming and RLHF alignment.'
    },
    takeaways: [
      { title: 'Multimodal Parsing', description: 'First foundational OpenAI model with the native ability to accept text and visual coordinate inputs.' },
      { title: 'Human Academic Dominance', description: 'Passed the Uniform Bar Exam (90th percentile) and GRE Verbal (99th percentile) with elite scoring indices.' },
      { title: 'Predictable Compute Scaling', description: 'Developed engineering scaling laws that allowed predicting final model performance using 10,000x less compute.' },
      { title: 'Reinforced Safety Red-Teaming', description: 'Spent 6 months on alignment systems, reducing toxicity responses by 82% compared to early training stages.' },
      { title: 'Hallucination Mitigation', description: 'Scored 40% higher on internal factual accuracy and reference correctness over GPT-3.5 models.' }
    ],
    breakdown: [
      { title: '1. Executive Summary', summary: 'Overview of GPT-4 and its core multimodal reasoning benchmarks.', details: 'Documents standard metrics, performance on competitive examinations, and vision comprehension capabilities.' },
      { title: '2. Predictable Scaling', summary: 'How OpenAI estimated training loss before massive investment.', details: 'Explores linear power-law relationships between compute budget, dataset size, and final cross-entropy loss.' },
      { title: '3. Professional Capabilities', summary: 'Exams, math olympiads, and medical simulation testing.', details: 'The model was tested on AP exams, LSATs, and coding olympiads. It consistently outperformed state-of-the-art custom models.' },
      { title: '4. Safety & Alignment', summary: 'The extensive 6-month process of sanitizing foundation weights.', details: 'Analyzes RLHF, adversarial red-teaming, and system prompt architectures designed to prevent high-risk instruction compilation.' }
    ],
    equations: [
      {
        latex: 'L(C) = a C^b + c',
        rendered: 'Loss(Compute) = a * Compute^b + c',
        intuition: 'Predicts the final model loss based on the compute budget. This allows engineers to run tiny cheap versions of the model, draw a line on a chart, and know exactly how smart the massive, multi-million dollar model will be before they hit "start training".',
        variables: [
          { name: 'L(C)', desc: 'Final predicted model loss (lower is smarter)' },
          { name: 'C', desc: 'Compute allocation (measured in total FLOPs or GPU days)' },
          { name: 'a, b, c', desc: 'Constant scaling coefficients mapped from experimental small-scale training runs' }
        ]
      }
    ],
    architecture: {
      layersCount: 'Proprietary MoE Layer Stack (Estimated ~120 layers)',
      parameters: 'Estimated ~1.8 Trillion total (Mixture of Experts)',
      trainingTokens: 'Estimated 13 Trillion tokens',
      hardware: 'Microsoft Azure A100 GPU clusters',
      pipelineDescription: 'Next-token prediction optimization with subsequent Reinforcement Learning from Human Feedback (RLHF) and Rule-Based Reward Models.',
      components: [
        { name: 'Multimodal Vision Encoder', function: 'Transforms pixel clusters into semantic coordinate tokens aligned with text embeddings.' },
        { name: 'Mixture of Experts (MoE) Router', function: 'Directs tokens to specific specialized neural sub-networks (experts) to save execution compute.' },
        { name: 'RLHF Alignment Module', function: 'Adjusts output distribution to align with human preferences for safety and format compliance.' }
      ]
    },
    timeline: [
      { date: 'August 2022', title: 'Foundation Training Completed', desc: 'Base weights of GPT-4 are finalized, beginning the safety alignment phase.' },
      { date: 'March 2023', title: 'Official Launch & API Release', desc: 'OpenAI makes GPT-4 public, detailing its exam results and safety statistics.' },
      { date: 'November 2023', title: 'GPT-4 Turbo Upgrade', desc: 'Released with a 128k context window and cheaper pricing structures.' }
    ],
    relatedEntities: [
      { name: 'OpenAI', type: 'Company', description: 'Creator and lead commercial developer of the GPT series.' },
      { name: 'GPT-5 (Sovereign)', type: 'AI Model', description: 'Direct frontier successor currently undergoing training parameters.' }
    ]
  },
  'deepseek-r1': {
    id: 'deepseek-r1',
    slug: 'deepseek-r1',
    title: 'DeepSeek-R1: Incentivizing Reasoning Matter',
    authors: ['DeepSeek Research Team'],
    organization: 'DeepSeek',
    publishDate: 'January 25, 2025',
    citations: '3,200+',
    category: 'Reasoning & Open Weights',
    pdfUrl: 'https://arxiv.org/abs/2501.12948',
    githubUrl: 'https://github.com/deepseek-ai/DeepSeek-R1',
    status: 'State-of-the-Art / Open weights',
    executiveSummary: {
      purpose: 'To introduce frontier-class reasoning models that utilize Reinforcement Learning without supervised fine-tuning (SFT) as a primary driver for step-by-step thinking.',
      problem: 'Proprietary closed systems (like OpenAI o1) are extremely expensive to train, require massive SFT datasets, and keep their thinking frameworks hidden from the open community.',
      innovation: 'DeepSeek-R1-Zero uses pure Reinforcement Learning to discover reasoning behaviors. DeepSeek-R1 incorporates minor cold-start SFT data and subsequent multi-stage RL to refine human-readable "Thought" tokens.',
      findings: 'DeepSeek-R1 matches closed proprietary models on math, coding, and logical tasks while open-sourcing the weight matrices under an MIT license, disrupting global AI cost expectations.',
      impact: 'Initiated a global shift towards open weights reasoning models, showing that high-level logic can be distilled into smaller, on-device architectures (8B and 70B).'
    },
    simplifiedExplanation: {
      eli5: 'Instead of blurting out the first answer that comes to mind, this AI has a "thinking room." It talks to itself step-by-step (asking "does this make sense?" or "let me try another way") before giving you the final answer. The builders let this AI practice for millions of rounds, rewarding it when it got math puzzles right.',
      beginner: 'DeepSeek-R1 is an open-source AI designed for deep thinking. It uses Reinforcement Learning (learning by trial and error) to formulate internal chains of thought. It prints its reasoning inside a gray box, showing its work on coding and math questions.',
      expert: 'The paper describes DeepSeek-R1-Zero and R1. R1-Zero trains directly with GRPO (Group Relative Policy Optimization) without SFT, demonstrating the emergent self-correction of thought tokens. DeepSeek-R1 bridges the gap by using a cold-start dataset, followed by reasoning-oriented RL and knowledge distillation to smaller models.'
    },
    takeaways: [
      { title: 'GRPO Optimization', description: 'Replaced traditional PPO with Group Relative Policy Optimization, saving massive GPU memory by eliminating the value network.' },
      { title: 'Emergent Self-Correction', description: 'Discovered that pure RL rewards can incentivize a model to naturally recognize its own errors and re-evaluate answers.' },
      { title: 'MIT Licensed Weights', description: 'Completely open-sourced the 671B parameter model weights, making frontier reasoning free for public fine-tuning.' },
      { title: 'High-Efficiency Distillation', description: 'Successfully distilled R1 capabilities to Llama 8B and 70B models, bringing advanced reasoning to standard edge hardware.' },
      { title: 'Multi-Head Latent Attention', description: 'Utilized MLA to shrink Key-Value (KV) cache size, allowing extreme throughput and cheaper hosting.' }
    ],
    breakdown: [
      { title: '1. Introduction', summary: 'A paradigm shift: logic and thinking can emerge from RL alone.', details: 'Outlines the motivation behind creating an open weights alternative to closed reasoning models.' },
      { title: '2. DeepSeek-R1-Zero', summary: 'Pure RL training without any supervised starting point.', details: 'Explores what happens when a model is given raw math/code rewards. It naturally develops self-correction but suffers from readability issues.' },
      { title: '3. DeepSeek-R1', summary: 'Refining R1-Zero with cold-start data and formatting steps.', details: 'Integrates thousands of clean reasoning examples to force the model to speak human languages during its thinking phases.' },
      { title: '4. Knowledge Distillation', summary: 'How to make small models think like giant ones.', details: 'Detailed guidelines on transferring reasoning pathways from the 671B MoE model into Llama-8B and Qwen-32B.' }
    ],
    equations: [
      {
        latex: 'J_{GRPO}(\\theta) = E \\left[ \\sum_{i=1}^G \\min\\left( r_i(\\theta) A_i, \\text{clip}(r_i(\\theta), 1-\\epsilon, 1+\\epsilon) A_i \\right) \\right]',
        rendered: 'J_GRPO(theta) = E[ sum(i=1 to G) min( r_i(theta) * A_i, clip(r_i(theta), 1-eps, 1+eps) * A_i ) ]',
        intuition: 'Optimizes how the model learns from rewards without needing an expensive secondary "critic" AI. It samples a group of answers for the same prompt, grades them relative to each other to calculate the "Advantage" (how much better one answer is than average), and updates the AI weights safely within a clipping boundary.',
        variables: [
          { name: 'G', desc: 'Group size (the number of different answers sampled for a single prompt)' },
          { name: 'r_i(\\theta)', desc: 'The probability ratio of generating the current answer under new weights vs old weights' },
          { name: 'A_i', desc: 'The Relative Advantage score of the answer, calculated by normalizing the group rewards' },
          { name: 'eps (\\epsilon)', desc: 'Clipping threshold to prevent the model weights from changing too rapidly in a single step' }
        ]
      }
    ],
    architecture: {
      layersCount: '61 Layers (MoE Transformer)',
      parameters: '671 Billion total / 37 Billion active per token',
      trainingTokens: 'Undisclosed Multi-Trillion Token Corpus',
      hardware: '2,048 NVIDIA H800 GPUs',
      pipelineDescription: 'Trained using Group Relative Policy Optimization (GRPO) on top of DeepSeek-V3 base weights, incorporating custom rule-based rewards for mathematical syntax and compiler verification.',
      components: [
        { name: 'Multi-head Latent Attention (MLA)', function: 'Compresses Key-Value cache vectors to speed up sequence processing.' },
        { name: 'DeepSeekMoE Routing', function: 'Actively routes tokens across 256 fine-grained experts with auxiliary-loss-free load balancing.' },
        { name: 'Thinking Output Buffer', function: 'Specialized context window that holds step-by-step thinking tokens before printing final response.' }
      ]
    },
    timeline: [
      { date: 'November 2024', title: 'DeepSeek-V3 Released', desc: 'The foundational 671B model is published, laying the hardware-efficient MoE groundwork.' },
      { date: 'January 2025', title: 'DeepSeek-R1 Launches', desc: 'Officially open-sources R1 weights, triggering a massive tech stock market reassessment.' },
      { date: 'February 2025', title: 'Global Distilled Implementations', desc: 'Distilled versions reach millions of edge devices and local terminal applications.' }
    ],
    relatedEntities: [
      { name: 'DeepSeek', type: 'Company', description: 'Hangzhou-based AI research lab that open-sourced R1.' },
      { name: 'DeepSeek R1 (Disruptor)', type: 'AI Model', description: 'The live running weights representing this model profile.' },
      { name: 'HumanEval', type: 'Benchmark', description: 'The code compilation standard where DeepSeek-R1 scored an elite 92.5%.' }
    ]
  },
  'gemini-2-5-report': {
    id: 'gemini-2-5-report',
    slug: 'gemini-2-5-report',
    title: 'Gemini 2.5 Technical Report',
    authors: ['Google DeepMind Team'],
    organization: 'Google DeepMind',
    publishDate: 'January 28, 2026',
    citations: '1,400+',
    category: 'Sovereign Context & Multimodal',
    pdfUrl: 'https://deepmind.google/technologies/gemini/',
    githubUrl: 'https://github.com/google-deepmind',
    status: 'Active Production Flagship',
    executiveSummary: {
      purpose: 'To detail the architectural scaling, unified audio-visual training, and infinite-context ring attention mechanisms of Gemini 2.5 Pro.',
      problem: 'Traditional models truncate context beyond 128k or 256k tokens, making it impossible to analyze complete enterprise repositories, multi-hour video streams, or complex industrial schematics.',
      innovation: 'Ring Attention distributed memory pipelines implemented on TPU-v6 arrays, unlocking a stable, highly factual 5,000,000 token context window alongside native multi-modal frequencies.',
      findings: 'Gemini 2.5 Pro retrieves information with 99.9% accuracy ("needle-in-a-haystack") at full 5M context limits, while showing state-of-the-art cinematic video and audio reasoning.',
      impact: 'Redefined context boundaries globally, allowing enterprises to swap complex RAG vector pipelines for direct foundation window ingestion.'
    },
    simplifiedExplanation: {
      eli5: 'Instead of remembering only a few pages of a book, this AI can remember an entire library! It can watch a 5-hour movie or read a million lines of code in 2 seconds, and immediately point out a tiny detail you ask about. It is built to understand videos and sounds naturally.',
      beginner: 'Google details Gemini 2.5, a model with a massive 5-million token context window. It explains "Ring Attention", which lets many computers share the memory load of reading huge amounts of data. It also details native training where video and audio are processed directly as frequencies.',
      expert: 'Gemini 2.5 utilizes a native multimodal architecture trained jointly across text, vision, audio, and video streams. The technical report details Ring Attention, which segments the attention matrix calculation across multiple TPU nodes in a ring topology, solving the quadratic compute bottleneck of long context windows.'
    },
    takeaways: [
      { title: '5 Million Token Context', description: 'Ingests entire company structural codes, multiple high-definition films, or multi-decade audit archives in one query.' },
      { title: 'Ring Attention Topology', description: 'Distributes sequence token calculations across connected TPU arrays to bypass quadratic memory scaling limits.' },
      { title: 'Native Multimodal Frequencies', description: 'Bypasses speech-to-text; instead, processes audio frequencies directly, preserving emotion and pitch.' },
      { title: 'TPU-v6 Hardware Acceleration', description: 'First flagship model optimized for custom Google TPU-v6 architectures, reducing cost-per-token by 60%.' },
      { title: 'Needle-in-a-Haystack Factuality', description: 'Retrieves targeted information with near-flawless factual consistency across massive sequence limits.' }
    ],
    breakdown: [
      { title: '1. Multimodal Foundations', summary: 'Joint training from step one on raw text, audio, and pixels.', details: 'Explores how native multimodal weights outperform decoupled visual-text adapters.' },
      { title: '2. Ring Attention Mechanics', summary: 'Distributed matrix math for sequence scale.', details: 'Technically outlines how sequences are chunked and passed in a network circle across physical hardware pods.' },
      { title: '3. Context Scaling Evaluations', summary: 'Testing factuality from 100k up to 5,000,000 tokens.', details: 'Documents retrieval testing across codebases, video frame indices, and multilingual translation logs.' }
    ],
    equations: [
      {
        latex: '\\text{Complexity}_{S} = O\\left(\\left[ \\frac{N}{P} \\right]^2 \\cdot d\\right) + \\text{Comm}_{Ring}',
        rendered: 'Complexity = O( (N / P)^2 * d ) + Comm_Ring',
        intuition: 'Explains how Google bypasses the scary quadratic (N squared) cost of reading long sentences. By dividing the sentence length (N) across a ring of processors (P) and adding a small communication cost between them, they can handle massive 5-million token files without burning down the datacenter.',
        variables: [
          { name: 'N', desc: 'Total sequence length / number of tokens in the prompt' },
          { name: 'P', desc: 'Number of parallel GPU/TPU processors connected in the ring' },
          { name: 'd', desc: 'Attention head dimension' },
          { name: 'Comm_{Ring}', desc: 'The network communication overhead of passing key-value states in a circle' }
        ]
      }
    ],
    architecture: {
      layersCount: 'Proprietary stacked MoE architecture',
      parameters: 'Estimated 800 Billion (MoE)',
      trainingTokens: 'Estimated 18 Trillion tokens',
      hardware: 'Google TPU v6 Pods',
      pipelineDescription: 'TPU-v6 ring scaling optimized for dual visual-audio stream ingestion, trained with self-supervised cross-modal alignment.',
      components: [
        { name: 'Ring Attention Network', function: 'Manages parallel attention state routing across distinct TPU server pods.' },
        { name: 'TPU-v6 Matrix Cores', function: 'Specialized low-latency silicon modules designed for massive matrix multiplication.' },
        { name: 'Continuous Audio Tokenizer', function: 'Translates continuous sound waves directly into dense semantic frequencies.' }
      ]
    },
    timeline: [
      { date: 'May 2025', title: 'TPU-v6 Pods Activated', desc: 'Custom Google silicon networks go online to initiate next-generation foundation training.' },
      { date: 'January 2026', title: 'Gemini 2.5 Technical Launch', desc: 'Google DeepMind publishes technical reports and opens developer API access.' }
    ],
    relatedEntities: [
      { name: 'Google DeepMind', type: 'Company', description: 'Origin laboratory and primary developer.' },
      { name: 'Gemini 2.5 (Titan)', type: 'AI Model', description: 'The active commercial model built on this paper.' }
    ]
  },
  'llama-4-paper': {
    id: 'llama-4-paper',
    slug: 'llama-4-paper',
    title: 'Llama 4: Foundations of Open Weights Intelligence',
    authors: ['Meta AI Research Team', 'Yann LeCun'],
    organization: 'Meta AI',
    publishDate: 'March 15, 2026',
    citations: '1,100+',
    category: 'Open Weights scaling',
    pdfUrl: 'https://meta.ai/llama4',
    githubUrl: 'https://github.com/meta-llama/llama-4',
    status: 'Preview / Under Training',
    executiveSummary: {
      purpose: 'To document the foundational training, dataset sanitization, and hardware layout of the Llama 4 open-weights model series.',
      problem: 'Western AI systems are increasingly locked behind corporate APIs and high pricing tiers, limiting independent academic research and on-premise local enterprise deployments.',
      innovation: 'A massive 25-trillion token training run combining high-quality synthetic datasets and native code-interpreter compilers inside the loss function.',
      findings: 'Llama 4 sets new open-weights standard benchmarks, outperforming closed models on multilingual tasks, local function calling, and agentic desktop execution.',
      impact: 'Reinforced the viability of localized, self-hosted enterprise intelligence, powering millions of decentralized developer stacks globally.'
    },
    simplifiedExplanation: {
      eli5: 'Meta built a giant open-source AI called Llama 4. It learned by reading 25 trillion pieces of text. Because it is open-source, anyone in the world is allowed to download it, change it, and run it on their own computers for free without needing a subscription.',
      beginner: 'Llama 4 is Meta\'s next-generation open-weights model. It is trained on 25 trillion tokens (much larger than GPT-4) and includes advanced tool-calling natively. The paper outlines how Meta uses synthetic (AI-generated) data to teach Llama complex logic.',
      expert: 'The paper details Llama 4\'s 25T dataset curation, focusing on a 3-stage training pipeline (Pre-training, Annealing, and multi-stage RLHF). It highlights a hybrid architecture supporting dense parameters for consumer edge setups and sparse MoE pathways for hyperscale data servers.'
    },
    takeaways: [
      { title: '25 Trillion Token Corpus', description: 'The largest open weights pre-training dataset, featuring a high concentration of code and reasoning sequences.' },
      { title: 'Synthetic Data Annealing', description: 'Utilized highly filtered AI-generated datasets during final training stages to boost logical reasoning.' },
      { title: 'Local Edge Optimization', description: 'Optimized attention weights specifically for 4-bit and 8-bit quantization with minimal quality loss.' },
      { title: 'Sovereign Custom License', description: 'Permits complete enterprise custom modifications and hosting up to 700M monthly active users.' },
      { title: 'Unified PyTorch Core', description: 'Built natively on PyTorch 3.0, ensuring immediate compatibility with standard open compiler hubs.' }
    ],
    breakdown: [
      { title: '1. Data Engineering', summary: 'Filtering 25 trillion tokens and creating synthetic reasoning.', details: 'Focuses on web deduplication, synthetic logic verification, and translation expansions.' },
      { title: '2. Architecture Specs', summary: 'Dense and MoE variants tailored for quantization.', details: 'Explores positional bias parameters and Grouped-Query Attention (GQA) optimizations.' },
      { title: '3. Safety & Sovereignty', summary: 'Preventing dangerous instruction generation at the weights layer.', details: 'Details on-premise red-teaming, cyber-attack simulations, and local container sandboxing compliance.' }
    ],
    equations: [
      {
        latex: '\\mathcal{L}_{Total} = \\mathcal{L}_{NextToken} + \\lambda \\mathcal{L}_{Synthetic_Align}',
        rendered: 'Loss_Total = Loss_NextToken + lambda * Loss_Synthetic_Align',
        intuition: 'Teaches the model to balance reading internet text with practicing high-quality logical reasoning. The first part helps it learn general grammar and facts, while the second part (weighted by lambda) forces it to align its logic with highly curated, smart synthetic templates.',
        variables: [
          { name: '\\mathcal{L}_{Total}', desc: 'Total training loss optimized during backpropagation (lower means better model)' },
          { name: '\\mathcal{L}_{NextToken}', desc: 'Standard language model cross-entropy loss predicting the next word on web documents' },
          { name: '\\lambda (\\lambda)', desc: 'Weight balancing coefficient controlling the influence of synthetic alignment data' },
          { name: '\\mathcal{L}_{Synthetic_Align}', desc: 'Alignment loss forced against highly verified academic synthetic data' }
        ]
      }
    ],
    architecture: {
      layersCount: '80 Layers (Dense Variant) / 128 Layers (MoE)',
      parameters: '70 Billion (Dense) / 450 Billion (MoE)',
      trainingTokens: '25 Trillion tokens',
      hardware: '150,000 NVIDIA H100 GPUs',
      pipelineDescription: 'Trained on high-throughput PyTorch architectures with integrated grouped-query attention, followed by localized DPO (Direct Preference Optimization).',
      components: [
        { name: 'Grouped-Query Attention (GQA)', function: 'Reduces memory bandwidth constraints in key-value cache computations.' },
        { name: 'Rotary Position Embeddings (RoPE)', function: 'Supports long sequence limits up to 256k tokens with high stability.' },
        { name: 'PyTorch FSDP v2', function: 'Handles pipeline and tensor parallelization across hundreds of thousands of active GPU cards.' }
      ]
    },
    timeline: [
      { date: 'September 2025', title: '150k H100 Cluster Initiated', desc: 'Meta completes construction on its primary AI supercomputing cluster.' },
      { date: 'March 2026', title: 'Llama 4 Technical Report', desc: 'Yann LeCun presents foundational training metrics and openweights preview models.' }
    ],
    relatedEntities: [
      { name: 'Meta AI', type: 'Company', description: 'The open weights corporate backer.' },
      { name: 'Llama 4 (Sovereign)', type: 'AI Model', description: 'The foundational running weights profile representing this paper.' }
    ]
  }
};

export function getPaperProfile(slug: string): PaperProfile {
  return RESEARCH_PAPERS[slug] || RESEARCH_PAPERS['attention-is-all-you-need'];
}
