import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { GoogleGenAI, Type } from "@google/genai";

// --- Constants & Enums (Refactor Point 2: No Magic Strings) ---
const DomainId = {
  IMAGE: 'image',
  VIDEO: 'video',
  WRITING: 'writing',
  CODING: 'coding',
  GENERAL: 'general',
} as const;

const ModelId = {
  // Image
  NANO_BANANA: 'nano-banana-pro',
  MIDJOURNEY: 'midjourney',
  FLUX_2: 'flux-2.0',
  STABLE_DIFFUSION: 'stable-diffusion',
  SEEDREAM: 'seedream-4.5',
  // Video
  VEO_3_1: 'veo-3.1',
  SORA_2: 'sora-2.0',
  // Writing/General
  GEMINI_3_PRO: 'gemini-3-pro',
  GEMINI_3: 'gemini-3',
  CLAUDE_SONNET: 'claude-4.5-sonnet',
  CLAUDE_OPUS: 'claude-4.5-opus',
  GPT_5_1: 'gpt-5.1',
  GROK: 'grok-4.1',
  KIMI_K2: 'kimi-k2-thinking',
  QWEN_MAX: 'qwen3-max-thinking',
  ERNIE: 'ernie-5.0',
} as const;

// --- Icons ---
const SparklesIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z" />
  </svg>
);

const CopyIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ImageIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

const CodeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const VideoIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m22 8-6 4 6 4V8Z" />
    <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
  </svg>
);

const PenIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const ChipIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M15 9h.01" />
    <path d="M9 15h.01" />
    <path d="M9 9h.01" />
    <path d="M15 15h.01" />
  </svg>
);

const UploadIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
);

const BookmarkIcon = ({ className, filled }: { className?: string; filled?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
);

const LayoutIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <line x1="3" x2="21" y1="9" y2="9" />
    <line x1="9" x2="9" y1="21" y2="9" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const TagIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
    <path d="M7 7h.01" />
  </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const AlertIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" x2="12" y1="9" y2="13" />
    <line x1="12" x2="12.01" y1="17" y2="17" />
  </svg>
);

const LightbulbIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
);

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 16h5v5" />
  </svg>
);

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);

const GlobeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);

const BrainIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
    <path d="M3.477 12.578a4 4 0 0 1-.317-1.459" />
    <path d="M20.84 11.119a4 4 0 0 1-.317 1.459" />
  </svg>
);

const PlayIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );

const HelpIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
);

const LogoIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className} fill="none">
        <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
        </defs>
        <path d="M50 10 L85 25 L85 75 L50 90 L15 75 L15 25 Z" stroke="url(#logoGradient)" strokeWidth="4" fill="none" />
        <path d="M50 35 L50 65" stroke="url(#logoGradient)" strokeWidth="4" strokeLinecap="round" />
        <path d="M35 50 L65 50" stroke="url(#logoGradient)" strokeWidth="4" strokeLinecap="round" />
        <circle cx="50" cy="50" r="8" fill="url(#logoGradient)" />
    </svg>
);

const LinkIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
);

// --- Domain Configuration ---
const DOMAINS = [
  {
    id: DomainId.IMAGE,
    label: "Image Generation",
    icon: <ImageIcon className="w-5 h-5" />,
    description: "For art, photos, and logos (Midjourney, Nano Banana).",
  },
  {
    id: DomainId.VIDEO,
    label: "Video Creation",
    icon: <VideoIcon className="w-5 h-5" />,
    description: "For cinematic shots, camera motion, and Veo prompts.",
  },
  {
    id: DomainId.WRITING,
    label: "Creative Writing",
    icon: <PenIcon className="w-5 h-5" />,
    description: "For essays, marketing copy, stories, and blogs.",
  },
  {
    id: DomainId.CODING,
    label: "Software Engineering",
    icon: <CodeIcon className="w-5 h-5" />,
    description: "For React, Python, and technical problem solving.",
  },
  {
    id: DomainId.GENERAL,
    label: "General Assistant",
    icon: <SparklesIcon className="w-5 h-5" />,
    description: "For any other questions or general tasks.",
  },
];

const GENERAL_TARGET_MODELS = [
    { id: ModelId.GEMINI_3_PRO, label: "Gemini 3 Pro", description: "Best for huge context & creativity (C.L.E.A.R.)" },
    { id: ModelId.GPT_5_1, label: "GPT-5.1", description: "Best for structured reasoning (KDP)" },
    { id: ModelId.CLAUDE_OPUS, label: "Claude 4.5 Opus", description: "Best for complex architecture & deep XML structure" },
    { id: ModelId.CLAUDE_SONNET, label: "Claude 4.5 Sonnet", description: "Best for coding, efficiency & input/output specs" },
    { id: ModelId.GROK, label: "Grok-4.1", description: "Best for wit, directness & real-time edge" },
    { id: ModelId.KIMI_K2, label: "Kimi k2 thinking", description: "Best for ultra-long context & analytical trace" },
];

const IMAGE_TARGET_MODELS = [
    { id: ModelId.NANO_BANANA, label: "Nano Banana Pro", description: "Gemini 3. Narrative, 4K, Chinese/English Text." },
    { id: ModelId.MIDJOURNEY, label: "Midjourney v7", description: "Artistic. Use --v 7, --ar, stylized weights." },
    { id: ModelId.FLUX_2, label: "FLUX 2.0", description: "State-of-the-art open weights, extreme detail & prompt adherence." },
    { id: ModelId.STABLE_DIFFUSION, label: "Stable Diffusion", description: "Tag-based, precise weighting (keyword:1.2)." },
    { id: ModelId.SEEDREAM, label: "Seedream 4.5", description: "High aesthetic, golden ratio, lighting mastery." },
];

const WRITING_TARGET_MODELS = [
    { id: ModelId.GEMINI_3, label: "Gemini 3", description: "Expansive creativity, long-context flow." },
    { id: ModelId.CLAUDE_SONNET, label: "Claude 4.5 Sonnet", description: "Nuanced, high-level vocabulary, 'human' tone." },
    { id: ModelId.QWEN_MAX, label: "Qwen3-Max-Thinking", description: "Deep narrative reasoning & complex plots." },
    { id: ModelId.ERNIE, label: "文心 5.0 (Ernie)", description: "Top Chinese literary style & cultural depth." },
];

const DEFAULT_TEMPLATES: TemplateItem[] = [
  {
    id: "tpl_default_1",
    name: "Cyberpunk Portrait",
    content: "Generate a portrait of a futuristic cyborg with neon accents, rain-slicked streets background, 85mm lens, f/1.8, bokeh, cinematic lighting, hyper-realistic, 8k --ar 9:16",
    domain: DomainId.IMAGE,
    category: "Art",
    timestamp: Date.now()
  },
  {
    id: "tpl_default_2",
    name: "React Senior Engineer",
    content: "Act as a Senior React Developer. Write clean, efficient, and accessible code. Use functional components, hooks, and TypeScript. Prioritize performance and error handling. Explain your reasoning briefly before coding. Task: Create a reusable DataGrid component.",
    domain: DomainId.CODING,
    category: "Development",
    timestamp: Date.now()
  },
  {
    id: "tpl_default_3",
    name: "SEO Blog Post Writer",
    content: "Write a comprehensive, SEO-optimized blog post about 'The Future of AI in 2025'. Use H2 and H3 headers. Include a compelling introduction, detailed body paragraphs with examples, and a conclusion. Target keywords: AI Agents, Generative Video, Automation. Tone: Informative and engaging.",
    domain: DomainId.WRITING,
    category: "Marketing",
    timestamp: Date.now()
  }
];

// --- Types (Refactor Point 5: Robust Types) ---
type OptimizationResult = {
  optimizedPrompt: string;
  explanation: string;
  addedTerms: string[];
};

type AssessmentResult = {
    score: number;
    commercialValue: "High" | "Medium" | "Low";
    targetAudience: string[];
    monetizationChannels: string[];
    riskFactors: string[];
    improvementTips: string[];
    reasoning: string;
};

// Refactor Point 3: Consolidated Session Data
type SessionData = {
    result: OptimizationResult | null;
    assessment: AssessmentResult | null;
    generatedMedia: {
        image: string | null;
        video: string | null;
        text: string | null;
    };
    // Keep loading states separate for granular UI control, or include here if tightly coupled.
    // For now, keeping loading states separate is cleaner for UI updates.
};

const DEFAULT_SESSION_DATA: SessionData = {
    result: null,
    assessment: null,
    generatedMedia: {
        image: null,
        video: null,
        text: null
    }
};

type HistoryItem = {
  id: string;
  timestamp: number;
  originalPrompt: string;
  domain: string;
  model?: string;
  result: OptimizationResult;
};

type TemplateItem = {
  id: string;
  name: string;
  content: string;
  domain: string;
  category: string;
  timestamp: number;
};

type ToastType = 'success' | 'error';

// --- Helper Functions ---
const cleanAndParseJSON = (str: string, defaultVal: any = {}) => {
  if (!str) return defaultVal;
  try {
    return JSON.parse(str);
  } catch (e) {
    try {
      let clean = str.replace(/```json\s*/g, "").replace(/```\s*$/g, "");
      const firstBrace = clean.indexOf("{");
      const lastBrace = clean.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1) {
        clean = clean.substring(firstBrace, lastBrace + 1);
        return JSON.parse(clean);
      }
      return defaultVal;
    } catch (e2) {
      console.error("JSON Parsing failed hard:", e2);
      return defaultVal;
    }
  }
};


// --- Strategy Pattern: System Instruction Generator (Refactor Point 1) ---
const generateSystemInstruction = (domain: string, model: string, useThinking: boolean, useGrounding: boolean): string => {
  let baseInstruction = `You are a world-class Prompt Engineer. 
  Your goal is to rewrite the user's raw input into a professional, high-fidelity prompt optimized for the selected domain.
  RETURN JSON ONLY.`;

  let domainInstruction = "";

  switch (domain) {
    case DomainId.IMAGE:
      domainInstruction = `
      DOMAIN: Image Generation.
      TARGET MODEL: ${model}.
      STRATEGIES:
      `;
      if (model === ModelId.NANO_BANANA) {
         domainInstruction += `
         - MODEL: Gemini 3 Pro Image (Nano Banana Pro).
         - CORE: Use the "Universal Formula": [Subject] + [Style] + [Aspect Ratio].
         - PHOTOREALISM: If realistic, MUST specify camera params: "85mm lens" (portrait), "24mm lens" (landscape), "f/1.8" (bokeh).
         - TEXT: If user wants text, put it in quotes: "text 'HELLO'".
         - LIGHTING: Use terms like "Golden Hour", "Soft Diffused", "Cinematic Lighting".
         `;
      } else if (model === ModelId.MIDJOURNEY) {
         domainInstruction += `
         - MODEL: Midjourney v7.
         - SYNTAX: Use --v 7, --ar 16:9 (or 9:16/1:1 based on intent), --stylize.
         - STYLE: Focus on artistic keywords, medium (oil painting, 3d render), and mood.
         `;
      } else if (model === ModelId.FLUX_2) {
         domainInstruction += `
         - MODEL: FLUX 2.0.
         - STRATEGY: Natural language descriptions. Extreme detail is rewarded. 
         - FOCUS: Texture, material properties, lighting physics.
         - NO "tags" like Stable Diffusion; use full sentences.
         `;
      } else if (model === ModelId.STABLE_DIFFUSION) {
         domainInstruction += `
         - MODEL: Stable Diffusion.
         - SYNTAX: Tag based. Use weights like (best quality:1.2), (masterpiece:1.2).
         - NEGATIVE: Suggest negative embeddings if needed in explanation.
         `;
      } else if (model === ModelId.SEEDREAM) {
          domainInstruction += `
          - MODEL: Seedream 4.5.
          - AESTHETIC: Balance between art and realism.
          - COMPOSITION: Enforce "Rule of Thirds" or "Golden Ratio" terms.
          - LIGHTING: Use "Volumetric", "Ray Tracing" terms.
          `;
      }
      break;

    case DomainId.VIDEO:
      // --- C.L.E.A.R. Framework for Video ---
      domainInstruction = `
      DOMAIN: Video Generation.
      TARGET MODEL: ${model}.
      
      CORE ROLE: You are a Video Creative Director specializing in Veo 3.1 and Sora 2.0.
      
      WORKFLOW (C.L.E.A.R. Framework):
      1. UNDERSTAND: Analyze Theme, Mood, Audience.
      2. ADAPT:
         - Veo 3.1: Focus on Physics, Lighting, Textures, Continuity.
         - Sora 2.0: Focus on Surrealism, Transitions, Artistic Flow.
      
      OUTPUT STRUCTURE (JSON 'optimizedPrompt' Field Content):
      Synthesize a structured prompt following this EXACT format. 
      IMPORTANT: Use square brackets like [Insert Time] or [Select Style] for parts where the user might want to customize or fill in the blank.
      
      ## Context
      [Detailed background, time, weather]
      
      ## Visual Elements
      - Subject: [Detailed character/object description]
      - Environment: [Scene details]
      - Action: [Specific movement physics]
      - Camera: [Shot type, movement, focus]
      
      ## Style & Tech
      - Style: [Artistic reference]
      - Resolution: [e.g., 1080p]
      - FPS: [e.g., 60fps]
      
      CRITICAL RULES:
      1. Be specific (e.g., "Golden soft light from 45 degree angle" instead of "Beautiful light").
      2. Ensure physical consistency for Veo.
      3. Use placeholders [...] for interactive user refinement.
      `;
      break;

    case DomainId.WRITING:
      domainInstruction = `
      DOMAIN: Creative Writing.
      TARGET MODEL: ${model}.
      STRATEGIES:
      `;
      if (model === ModelId.GEMINI_3) {
          domainInstruction += `
          - Focus: Expansive creativity, utilize long-context window for consistency.
          - Avoid: Clichés.
          - Technique: "Show, Don't Tell".
          `;
      } else if (model === ModelId.CLAUDE_SONNET) {
          domainInstruction += `
          - Focus: Sophisticated vocabulary, human-like nuance, emotional depth.
          - Tone: Adaptive and subtle.
          `;
      } else if (model === ModelId.QWEN_MAX) {
          domainInstruction += `
          - Focus: Deep narrative reasoning.
          - Method: Chain of Thought applied to plot structure. Logic first, then prose.
          `;
      } else if (model === ModelId.ERNIE) {
          domainInstruction += `
          - Focus: Chinese literary excellence.
          - Style: Use classical idioms (Chengyu) where appropriate, culturally resonant metaphors.
          `;
      }
      break;

    case DomainId.CODING:
      domainInstruction = `
      DOMAIN: Coding / Software Engineering.
      
      CRITICAL ENGINEERING PRINCIPLES (MUST FOLLOW):
      1. Scalability First: Design must facilitate future features. Keep code modular. NO hardcoding.
      2. Maintainability Paramount: Clear, readable, self-documenting code with necessary comments.
      3. Robustness is the Baseline: Handle exceptions and edge cases with elegant error handling.
      4. Performance Awareness: Optimize for low overhead and avoid resource waste.
      5. Security Fundamentals: Strictly follow security best practices for data and auth.

      Focus on:
      - Specificity: Language (React, Python), Frameworks, Libraries.
      - Constraints: "No external libraries", "Use functional components", "TypeScript".
      - Edge Cases: "Handle null values", "Error boundaries".
      `;
      break;

    case DomainId.GENERAL:
     domainInstruction = `
     DOMAIN: General Assistant / LLM.
     TARGET MODEL: ${model}.
     CRITICAL PROTOCOLS:
     `;
     if (model === ModelId.GPT_5_1) {
         domainInstruction += `
         *** TARGET: GPT-5.1 ***
         PROTOCOL: KDP (Kernel Debug Protocol).
         STRATEGY: The prompt MUST be a structured JSON object to ensure deterministic execution.
         OUTPUT FORMAT: JSON String of KDP structure.
         `;
     } else if (model === ModelId.CLAUDE_OPUS) {
         domainInstruction += `
         *** TARGET: Claude 4.5 Opus ***
         PROTOCOL: Deep XML-Tag Protocol.
         STRATEGY: Use XML tags with high architectural depth.
         `;
     } else if (model === ModelId.GEMINI_3_PRO) {
         domainInstruction += `
         *** TARGET: Gemini 3 Pro ***
         PROTOCOL: Primacy & Recency Attention Strategy.
         STRATEGY: Markdown Headers + Bullet Points.
         CRITICAL: Place constraints at the BEGINNING and REPEAT them at the END.
         `;
     } else if (model === ModelId.GROK) {
         domainInstruction += `
         *** TARGET: Grok 4.1 ***
         PROTOCOL: Direct/Table Protocol.
         STRATEGY: Markdown Tables for data. "Step-by-step" trigger.
         TONE: Direct, witty, no corporate fluff.
         `;
     } else if (model === ModelId.KIMI_K2) {
         domainInstruction += `
         *** TARGET: Kimi k2 thinking ***
         PROTOCOL: Sandwich Attention & Atomic XML.
         STRATEGY: XML Atomic Task + Sandwich Structure (Critical info at start & end) + CoT Trigger.
         `;
     }
     break;
  }

  let fullSystemInstruction = `${baseInstruction}\n${domainInstruction}`;

  if (useThinking) {
     fullSystemInstruction += `
     *** DEEP REASONING MODE ACTIVE ***
     You must strictly follow this internal thought process before generating the final JSON:
     PHASE 1: DECOMPOSE (Break down input).
     PHASE 2: REASSEMBLE (Apply domain strategy).
     PHASE 3: SELF-CHECK (Review against target model constraints).
     PHASE 4: OUTPUT (Final JSON).
     `;
     if (domain === DomainId.VIDEO) {
        fullSystemInstruction += `
        VIDEO SPECIFIC CHECK:
        - Verify physical logic (Gravity, Light direction).
        - Ensure Camera movement is physically possible (unless Sora).
        `;
     }
  }

  if (useGrounding) {
     fullSystemInstruction += `
     *** WEB GROUNDING ACTIVE ***
     CRITICAL: Since you are using Google Search, do NOT output JSON. 
     Instead, use this STRICT anchor-delimited format:
     <<<ANALYSIS_START>>> [Explanation] <<<ANALYSIS_END>>>
     <<<PROMPT_START>>> [Final Prompt] <<<PROMPT_END>>>
     <<<TAGS_START>>> [Tags] <<<TAGS_END>>>
     `;
  }

  return fullSystemInstruction;
};


// --- Components ---

const WelcomeGuide = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-fade-in">
            <div className="bg-neutral-900 border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.1)] relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-purple-500 to-amber-500"></div>
                
                <div className="p-8 md:p-12 text-center space-y-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-purple-500/20 text-amber-500 mb-2 ring-1 ring-white/10">
                        <LogoIcon className="w-10 h-10" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold text-white tracking-tight mb-3">Welcome to PromptRefine AI</h2>
                        <p className="text-neutral-400 text-lg max-w-lg mx-auto leading-relaxed font-light">
                            Transform vague ideas into production-ready assets using advanced prompt engineering protocols.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-6 text-left mt-8">
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-colors">
                             <div className="text-amber-500 mb-3 font-bold text-xs tracking-widest uppercase">01. Select</div>
                             <h3 className="text-white font-medium mb-1">Target Domain</h3>
                             <p className="text-xs text-neutral-500 leading-relaxed">Choose your target (Image, Coding, Writing) to load specialized logic.</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-colors">
                             <div className="text-amber-500 mb-3 font-bold text-xs tracking-widest uppercase">02. Input</div>
                             <h3 className="text-white font-medium mb-1">Raw Draft</h3>
                             <p className="text-xs text-neutral-500 leading-relaxed">Type a basic idea or upload an image to reverse-engineer its structure.</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-colors">
                             <div className="text-amber-500 mb-3 font-bold text-xs tracking-widest uppercase">03. Execute</div>
                             <h3 className="text-white font-medium mb-1">Refine & Scan</h3>
                             <p className="text-xs text-neutral-500 leading-relaxed">Get the optimized prompt and run a "Commercial Value Scan".</p>
                        </div>
                    </div>

                    <button 
                        onClick={onClose}
                        className="mt-8 px-10 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center gap-2 mx-auto"
                    >
                        Initialize System <ArrowRightIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const App = () => {
  const [showWelcome, setShowWelcome] = useState(() => {
      return !localStorage.getItem("promptRefine_hasSeenWelcome");
  });

  const [userInput, setUserInput] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>(DomainId.IMAGE);
  const [selectedModel, setSelectedModel] = useState<string>(ModelId.NANO_BANANA);
  
  // Advanced Toggles
  const [useThinking, setUseThinking] = useState(false);
  const [useGrounding, setUseGrounding] = useState(false);

  // Logic States
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  // Refactor Point 3: Centralized Session State
  const [sessionData, setSessionData] = useState<SessionData>(DEFAULT_SESSION_DATA);
  
  // Loading States (kept separate for UI control)
  const [isAssessing, setIsAssessing] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState("");

  // Reverse Engineering States
  const [isReverseMode, setIsReverseMode] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [copyStatus, setCopyStatus] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<ToastType>('success');
  
  // Sidebar State
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'history' | 'saved' | 'templates'>('history');
  const [searchQuery, setSearchQuery] = useState("");
  
  // History State
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
        const saved = localStorage.getItem("promptRefineHistory");
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
  });

  const [savedPrompts, setSavedPrompts] = useState<HistoryItem[]>(() => {
    try {
        const saved = localStorage.getItem("promptRefineSaved");
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
  });

  const [templates, setTemplates] = useState<TemplateItem[]>(() => {
    try {
        const saved = localStorage.getItem("promptRefineTemplates");
        const parsed = saved ? JSON.parse(saved) : [];
        return parsed.length > 0 ? parsed : DEFAULT_TEMPLATES;
    } catch (e) {
        return DEFAULT_TEMPLATES;
    }
  });
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateCategory, setNewTemplateCategory] = useState("");
  const [templateContentToSave, setTemplateContentToSave] = useState("");
  const [templateError, setTemplateError] = useState("");

  // Modal State for Clear History
  const [isClearHistoryModalOpen, setIsClearHistoryModalOpen] = useState(false);

  // Reset model selection when domain changes to ensure valid model
  useEffect(() => {
    if (selectedDomain === DomainId.GENERAL) {
        setSelectedModel(ModelId.GEMINI_3_PRO);
    } else if (selectedDomain === DomainId.IMAGE) {
        setSelectedModel(ModelId.NANO_BANANA);
    } else if (selectedDomain === DomainId.WRITING) {
        setSelectedModel(ModelId.GEMINI_3);
    } else if (selectedDomain === DomainId.VIDEO) {
        setSelectedModel(ModelId.VEO_3_1);
    } else {
        setSelectedModel(ModelId.GEMINI_3_PRO);
    }

    // --- CRITICAL FIX: CLEAN SLATE ON DOMAIN SWITCH ---
    // Refactor Point 3: Single state reset
    setSessionData(DEFAULT_SESSION_DATA);
    setUserInput("");
    setIsReverseMode(false);
    setUploadedImage(null);
    setVideoUrlInput("");
    
  }, [selectedDomain]);

  useEffect(() => {
    setSearchQuery("");
  }, [sidebarTab]);

  const showToast = (message: string, type: ToastType = 'success') => {
      setToastMessage(message);
      setToastType(type);
      setTimeout(() => setToastMessage(""), 4000);
  };

  const closeWelcome = () => {
      setShowWelcome(false);
      localStorage.setItem("promptRefine_hasSeenWelcome", "true");
  };

  const ensureApiKey = async () => {
      const win = window as any;
      if (win.aistudio) {
          const hasKey = await win.aistudio.hasSelectedApiKey();
          if (!hasKey) {
              await win.aistudio.openSelectKey();
          }
      }
  };

  const addToHistory = (originalPrompt: string, domain: string, result: OptimizationResult, model?: string) => {
    const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        originalPrompt,
        domain,
        model,
        result
    };
    const newHistory = [newItem, ...history].slice(50);
    setHistory(newHistory);
    localStorage.setItem("promptRefineHistory", JSON.stringify(newHistory));
  };

  const handleSavePrompt = () => {
      const { result } = sessionData;
      if (!result) return;
      
      const existing = savedPrompts.find(p => p.result.optimizedPrompt === result.optimizedPrompt);
      if (existing) {
          setSaveStatus(true);
          setTimeout(() => setSaveStatus(false), 2000);
          return;
      }

      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        originalPrompt: isReverseMode ? (uploadedImage ? "[Image Upload]" : "[Video Analysis]") : userInput,
        domain: selectedDomain,
        model: (selectedDomain === DomainId.GENERAL || selectedDomain === DomainId.IMAGE || selectedDomain === DomainId.WRITING || selectedDomain === DomainId.VIDEO) ? selectedModel : undefined,
        result
      };

      const newSaved = [newItem, ...savedPrompts];
      setSavedPrompts(newSaved);
      localStorage.setItem("promptRefineSaved", JSON.stringify(newSaved));
      
      setSaveStatus(true);
      setTimeout(() => setSaveStatus(false), 2000);
      showToast("Prompt Saved to Library");
  };

  const openSaveTemplateModal = (content: string) => {
    setTemplateContentToSave(content || "");
    setNewTemplateName("");
    setNewTemplateCategory("");
    setTemplateError("");
    setIsTemplateModalOpen(true);
  };

  const confirmSaveTemplate = () => {
    if (!newTemplateName.trim()) {
      setTemplateError("Please enter a template name.");
      return;
    }
    if (!templateContentToSave.trim()) {
      setTemplateError("Template content cannot be empty.");
      return;
    }
    
    const newItem: TemplateItem = {
        id: crypto.randomUUID(),
        name: newTemplateName.trim(),
        content: templateContentToSave,
        domain: selectedDomain,
        category: newTemplateCategory.trim() || "Uncategorized",
        timestamp: Date.now()
    };
    
    const newTemplates = [newItem, ...templates];
    setTemplates(newTemplates);
    localStorage.setItem("promptRefineTemplates", JSON.stringify(newTemplates));
    setIsTemplateModalOpen(false);
    
    showToast("Template Created Successfully");

    setSidebarTab('templates');
    setShowSidebar(true);
  };

  const deleteTemplate = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      const newTemplates = templates.filter(t => t.id !== id);
      setTemplates(newTemplates);
      localStorage.setItem("promptRefineTemplates", JSON.stringify(newTemplates));
  };

  const loadTemplate = (t: TemplateItem) => {
      setUserInput(t.content);
      setSelectedDomain(t.domain);
      setSessionData(DEFAULT_SESSION_DATA);
      setIsReverseMode(false);
      setUploadedImage(null);
      setShowSidebar(false);
  };

  const removeFromSaved = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newSaved = savedPrompts.filter(h => h.id !== id);
    setSavedPrompts(newSaved);
    localStorage.setItem("promptRefineSaved", JSON.stringify(newSaved));
  };

  const clearHistory = () => {
    setIsClearHistoryModalOpen(true);
  };

  const confirmClearHistory = () => {
      setHistory([]);
      localStorage.removeItem("promptRefineHistory");
      setIsClearHistoryModalOpen(false);
      showToast("History Cleared", "success");
  };

  const deleteHistoryItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newHistory = history.filter(h => h.id !== id);
    setHistory(newHistory);
    localStorage.setItem("promptRefineHistory", JSON.stringify(newHistory));
  };

  const loadHistoryItem = (item: HistoryItem) => {
    if (item.originalPrompt !== "[Image Upload]" && item.originalPrompt !== "[Video Analysis]") {
        setUserInput(item.originalPrompt);
    }
    setSelectedDomain(item.domain);
    if (item.model) setSelectedModel(item.model);
    
    setSessionData({
        result: item.result,
        assessment: null,
        generatedMedia: { image: null, video: null, text: null }
    });
    
    setIsReverseMode(item.originalPrompt === "[Image Upload]" || item.originalPrompt === "[Video Analysis]"); 
    setUploadedImage(null);
    setShowSidebar(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setUploadedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleGenerateImage = async () => {
    const { result } = sessionData;
    if (!result?.optimizedPrompt) return;
    setIsGeneratingImage(true);
    // Reset only image part of session
    setSessionData(prev => ({ ...prev, generatedMedia: { ...prev.generatedMedia, image: null } }));

    try {
        await ensureApiKey();
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: {
                parts: [{ text: result.optimizedPrompt }]
            },
            config: {
                imageConfig: {
                    aspectRatio: "1:1",
                    imageSize: "1K"
                }
            }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                const base64EncodeString = part.inlineData.data;
                const imageUrl = `data:image/png;base64,${base64EncodeString}`;
                setSessionData(prev => ({ ...prev, generatedMedia: { ...prev.generatedMedia, image: imageUrl } }));
                break;
            }
        }
    } catch (error: any) {
        console.error("Image generation failed:", error);
        showToast("Image Generation Failed: " + (error.message || "Unknown error"), 'error');
    } finally {
        setIsGeneratingImage(false);
    }
  };

  const handleGenerateVideo = async () => {
    const { result } = sessionData;
    if (!result?.optimizedPrompt) return;
    setIsGeneratingVideo(true);
    setSessionData(prev => ({ ...prev, generatedMedia: { ...prev.generatedMedia, video: null } }));
    setVideoProgress("Initializing Veo 3.1...");

    try {
        await ensureApiKey();
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        setVideoProgress("Submitting generation request...");
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: result.optimizedPrompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9'
            }
        });

        setVideoProgress("Rendering video (this takes about 30-60s)...");
        let attempts = 0;
        const maxAttempts = 20; 
        while (!operation.done) {
            if (attempts >= maxAttempts) {
                throw new Error("Video generation timed out.");
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
            operation = await ai.operations.getVideosOperation({operation: operation});
            setVideoProgress(`Still rendering (${attempts}/${maxAttempts})...`);
            attempts++;
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (downloadLink) {
             setVideoProgress("Finalizing download...");
             const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
             const blob = await response.blob();
             const videoUrl = URL.createObjectURL(blob);
             setSessionData(prev => ({ ...prev, generatedMedia: { ...prev.generatedMedia, video: videoUrl } }));
        } else {
             throw new Error("No video URI returned.");
        }

    } catch (error: any) {
        console.error("Video generation failed:", error);
        showToast(`Video Generation Failed: ${error.message}`, 'error');
    } finally {
        setIsGeneratingVideo(false);
        setVideoProgress("");
    }
  };

  const handleGenerateText = async () => {
      const { result } = sessionData;
      if (!result?.optimizedPrompt) return;
      setIsGeneratingText(true);
      setSessionData(prev => ({ ...prev, generatedMedia: { ...prev.generatedMedia, text: null } }));

      try {
          await ensureApiKey();
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          
          const response = await ai.models.generateContent({
              model: 'gemini-3-pro-preview',
              contents: result.optimizedPrompt,
              config: {
                 systemInstruction: "You are acting as the model defined in the prompt. Execute the prompt exactly as requested."
              }
          });
          
          setSessionData(prev => ({ ...prev, generatedMedia: { ...prev.generatedMedia, text: response.text || "No output." } }));

      } catch (error: any) {
          console.error("Text simulation failed:", error);
          showToast("Simulation Failed: " + error.message, 'error');
      } finally {
          setIsGeneratingText(false);
      }
  };

  // Refactor Point 4: Modular Reverse Engineering with Strict Image JSON
  const handleReverseEngineer = async () => {
    if (!uploadedImage && !videoUrlInput) return;
    setIsAnalyzing(true);
    setSessionData(prev => ({ ...prev, result: null })); // Reset result

    try {
        await ensureApiKey();
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const parts: any[] = [];
        let contextText = "";
        let systemInstruction = "";
        let responseSchema = undefined;
        let responseMimeType = undefined;

        // --- Logic Branching: Image Only ---
        if (selectedDomain === DomainId.IMAGE && uploadedImage) {
            // STRICT IMAGE JSON PROTOCOL
            const base64Data = uploadedImage.split(',')[1];
            // Extract real MIME type
            const mimeType = uploadedImage.substring(uploadedImage.indexOf(":") + 1, uploadedImage.indexOf(";"));
            
            parts.push({ inlineData: { mimeType: mimeType, data: base64Data } });
            contextText = "Analyze this image and reverse engineer it into a JSON structure.";
            
            systemInstruction = `
              You are an expert Reverse Engineering Prompt Engineer for AI Image Models.
              
              TASK:
              1. Analyze the uploaded image and first convert it mentally into a detailed JSON structure containing:
                 - "image_analysis": { subject, key_elements, background, lighting, color_palette }
                 - "model_parameters": { resolution, style, lighting_tech, iso, composition }
                 
              2. BASED on this, SYNTHESIZE the final reverse engineered prompt.
              
              OUTPUT REQUIREMENT:
              You must return a JSON object (as defined in the responseSchema) where:
              - 'optimizedPrompt': Contains the FINAL SYNTHESIZED TEXT PROMPT.
              - 'explanation': Contains the structured JSON ANALYSIS details.
              - 'addedTerms': Extract key tags.
              
              TARGET MODEL: ${selectedModel}
            `;
            
            responseMimeType = "application/json";
            responseSchema = {
                type: Type.OBJECT,
                properties: {
                  optimizedPrompt: { type: Type.STRING, description: "The final synthesized text prompt." },
                  explanation: { type: Type.STRING, description: "The detailed JSON analysis of the image." },
                  addedTerms: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
            };
        } 
        
        // Removed Video Logic as requested.

        parts.push({ text: contextText });

        const modelConfig = {
             model: 'gemini-3-pro-preview', // Vision capable
             contents: { parts: parts },
             config: {
                systemInstruction: systemInstruction,
                responseMimeType: responseMimeType,
                responseSchema: responseSchema,
             }
        };

        const response = await ai.models.generateContent(modelConfig);
        const json = cleanAndParseJSON(response.text || "{}");
        const safeResult = {
            optimizedPrompt: json.optimizedPrompt || "Failed to generate prompt.",
            explanation: json.explanation || "Analysis complete.",
            addedTerms: Array.isArray(json.addedTerms) ? json.addedTerms : []
        };

        setSessionData(prev => ({ ...prev, result: safeResult }));
        addToHistory(uploadedImage ? "[Image Upload]" : "[Video Analysis]", selectedDomain, safeResult, selectedModel);

    } catch (error: any) {
        console.error("Reverse engineering failed:", error);
        showToast("Analysis Failed: " + (error.message || "Please check image format"), 'error');
    } finally {
        setIsAnalyzing(false);
    }
  };


  const handleOptimize = async () => {
    if (!userInput.trim()) return;
    setIsOptimizing(true);
    // Refactor Point 3: Clean slate via session data
    setSessionData(DEFAULT_SESSION_DATA);

    try {
      await ensureApiKey();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Refactor Point 1: Strategy Pattern implementation for System Instructions
      const fullSystemInstruction = generateSystemInstruction(selectedDomain, selectedModel, useThinking, useGrounding);
      
      let targetModel = 'gemini-3-pro-preview';
      let tools: any[] = [];
      let thinkingConfig = undefined;

      if (useThinking) {
         targetModel = 'gemini-2.5-flash';
         thinkingConfig = { thinkingBudget: 4096 }; 
      }

      if (useGrounding) {
         tools.push({ googleSearch: {} });
      }

      const modelConfig = {
        model: targetModel,
        contents: {
             parts: [{ text: `User Raw Input: "${userInput}"` }]
        },
        config: {
            systemInstruction: fullSystemInstruction,
            responseMimeType: useGrounding ? undefined : "application/json", 
            ...(thinkingConfig && { thinkingConfig }),
            ...(tools.length > 0 && { tools }),
            ...(!useGrounding && {
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        optimizedPrompt: { type: Type.STRING },
                        explanation: { type: Type.STRING },
                        addedTerms: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                }
            })
        }
      };

      let response;
      try {
          response = await ai.models.generateContent(modelConfig);
      } catch (error: any) {
          const isServerError = 
            (error.message && (error.message.includes('500') || error.message.includes('503'))) ||
            error.status === 500 || 
            error.code === 500 ||
            error.status === 503 || 
            error.code === 503;

          if (isServerError) {
              console.warn("Gemini Error, falling back to Gemini 2.5 Flash...", error);
              showToast("Gemini 3 Busy, switching to Flash...", "error"); // Technically a warning
              const fallbackConfig = { 
                  model: 'gemini-2.5-flash',
                  contents: { parts: [{ text: `User Raw Input: "${userInput}"` }] },
                  config: {
                      systemInstruction: fullSystemInstruction,
                      responseMimeType: "application/json",
                      responseSchema: modelConfig.config.responseSchema
                  }
               };
              response = await ai.models.generateContent(fallbackConfig);
          } else {
              throw error;
          }
      }
      
      let safeResult;
      
      if (useGrounding) {
          const text = response.text || "";
          
          const extractBetween = (str: string, start: string, end: string) => {
              const s = str.indexOf(start);
              if (s === -1) return null;
              const e = str.indexOf(end);
              if (e === -1) return null;
              return str.substring(s + start.length, e).trim();
          }

          const promptPart = extractBetween(text, "<<<PROMPT_START>>>", "<<<PROMPT_END>>>");
          const analysisPart = extractBetween(text, "<<<ANALYSIS_START>>>", "<<<ANALYSIS_END>>>");
          const tagsPart = extractBetween(text, "<<<TAGS_START>>>", "<<<TAGS_END>>>");

          if (!promptPart) {
               safeResult = {
                optimizedPrompt: text,
                explanation: "Prompt enriched with live Google Search data (Raw Output).",
                addedTerms: ["Grounding", "Web Search"]
              };
          } else {
              safeResult = {
                  optimizedPrompt: promptPart,
                  explanation: analysisPart || "Enhanced with Google Search Grounding.",
                  addedTerms: tagsPart ? tagsPart.split(',').map(t => t.trim()) : ["Grounding"]
              };
          }
      } else {
          const json = cleanAndParseJSON(response.text || "{}");
          safeResult = {
            optimizedPrompt: json.optimizedPrompt || "Optimization failed.",
            explanation: (json.explanation || "No explanation provided.") + (response.model === 'gemini-2.5-flash' && !useThinking ? " (Fallback Model)" : ""),
            addedTerms: Array.isArray(json.addedTerms) ? json.addedTerms : []
          };
      }

      setSessionData(prev => ({ ...prev, result: safeResult }));
      addToHistory(userInput, selectedDomain, safeResult, selectedModel);

    } catch (error: any) {
      console.error("Error optimizing prompt:", error);
      showToast("Optimization Failed: " + (error.message || "API Error"), 'error');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleAssessValue = async () => {
    const { result } = sessionData;
    if (!result) return;
    setIsAssessing(true);
    // Clear assessment in session
    setSessionData(prev => ({ ...prev, assessment: null }));
    
    try {
        await ensureApiKey();
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const systemInstruction = `
            You are an expert Digital Asset Monetization Consultant and AI Product Manager.
            Your goal is to help "One-Person Businesses" and "Solopreneurs" evaluate if a specific prompt has commercial value.
            
            ROLE:
            Think like a PromptBase reviewer or a SaaS founder. You are looking for:
            1. **Pain Point**: Does this solve a burning problem (High value) or just a nice-to-have (Low value)?
            2. **Replicability**: Is it too simple (everyone can do it)? Or does it have a "moat" (complex logic, unique structure)?
            3. **Productization**: Can this be sold as a Notion Template, an API wrapper, a Micro-SaaS, or a service?
            4. **Automation**: Is it suitable for automated workflows (n8n/Zapier)?
            
            TASK:
            Evaluate the provided prompt. Return a structured JSON assessment.
            
            OUTPUT REQUIREMENTS:
            - **riskFactors**: Identify potential issues (e.g., "Result requires heavy human editing", "Too niche", "Easy to copy").
            - **improvementTips**: Give specific advice to increase its value (e.g., "Add output format constraints", "Bundle with x").
            - **monetizationChannels**: Suggest where to sell it (e.g., "PromptBase", "Gumroad PDF", "Fiverr Gig").
            
            Return JSON only.
        `;

        const modelConfig = {
            model: 'gemini-3-pro-preview', // UPGRADED to Gemini 3 Pro
            contents: { parts: [{ text: `Assess this prompt: "${result.optimizedPrompt}" for domain: ${selectedDomain}` }] },
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.NUMBER, description: "A score from 0 to 100 representing commercial viability." },
                        commercialValue: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                        targetAudience: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Who would buy this prompt?" },
                        monetizationChannels: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Where/How to sell this." },
                        riskFactors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Potential risks or weaknesses." },
                        improvementTips: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable tips to increase value." },
                        reasoning: { type: Type.STRING, description: "Final verdict and summary." }
                    }
                }
            }
        };

        let response;
        try {
            response = await ai.models.generateContent(modelConfig);
        } catch (err: any) {
            const isServerError = 
                (err.message && (err.message.includes('500') || err.message.includes('503') || err.message.includes('overloaded'))) ||
                err.status === 500 || err.code === 500 ||
                err.status === 503 || err.code === 503;

            if (isServerError) {
                console.warn("Gemini 3 Pro overloaded, retrying with Gemini 2.5 Flash...");
                const fallbackConfig = { ...modelConfig, model: 'gemini-2.5-flash' };
                response = await ai.models.generateContent(fallbackConfig);
            } else {
                throw err;
            }
        }
        
        const json = cleanAndParseJSON(response.text || "{}");
        const safeJson = {
            ...json,
            commercialValue: json.commercialValue || "Low",
            score: typeof json.score === 'number' ? json.score : 0,
            targetAudience: Array.isArray(json.targetAudience) ? json.targetAudience : [],
            monetizationChannels: Array.isArray(json.monetizationChannels) ? json.monetizationChannels : [],
            riskFactors: Array.isArray(json.riskFactors) ? json.riskFactors : [],
            improvementTips: Array.isArray(json.improvementTips) ? json.improvementTips : [],
            reasoning: json.reasoning || "No reasoning provided."
        };
        
        setSessionData(prev => ({ ...prev, assessment: safeJson }));

    } catch (e: any) {
        console.error("Assessment failed", e);
        showToast("Assessment Failed: " + (e.message || "Network Error"), 'error');
    } finally {
        setIsAssessing(false);
    }
  };

  const handleCopy = () => {
    if (sessionData.result) {
      navigator.clipboard.writeText(sessionData.result.optimizedPrompt);
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 2000);
      showToast("Prompt copied to clipboard");
    }
  };

  const getModelOptions = () => {
    switch (selectedDomain) {
      case DomainId.IMAGE: return IMAGE_TARGET_MODELS;
      case DomainId.WRITING: return WRITING_TARGET_MODELS;
      case DomainId.GENERAL: return GENERAL_TARGET_MODELS;
      case DomainId.CODING: return GENERAL_TARGET_MODELS;
      case DomainId.VIDEO: return [
          { id: ModelId.VEO_3_1, label: "Veo 3.1", description: "Google DeepMind Veo 3.1" }, 
          { id: ModelId.SORA_2, label: "Sora 2.0", description: "OpenAI Sora 2.0" }
      ];
      default: return GENERAL_TARGET_MODELS;
    }
  };

  // --- De-structured session data for easy access in JSX ---
  const { result, assessment, generatedMedia } = sessionData;

  return (
    <div className="flex h-screen bg-black text-neutral-200 font-sans selection:bg-amber-500/30 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-900/10 via-neutral-950 to-black pointer-events-none" />
      <div className="fixed top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent z-50"></div>
      
      {showWelcome && <WelcomeGuide onClose={closeWelcome} />}
      
      {/* Toast Notification */}
      {toastMessage && (
         <div className={`fixed bottom-6 right-6 px-4 py-3 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] z-50 animate-bounce flex items-center gap-3 font-bold text-sm border ${
            toastType === 'error' 
              ? 'bg-red-500 text-white border-red-400 shadow-red-500/20' 
              : 'bg-emerald-500 text-black border-emerald-400 shadow-emerald-500/30'
         }`}>
            <div className="bg-black/20 p-1 rounded-full">
              {toastType === 'error' ? <AlertIcon className="w-4 h-4" /> : <CheckIcon className="w-4 h-4" />}
            </div>
            {toastMessage}
         </div>
      )}

      {/* Glass Sidebar */}
      <div className={`${showSidebar ? 'w-80 translate-x-0' : 'w-0 -translate-x-full'} absolute md:relative z-40 h-full bg-neutral-900/80 backdrop-blur-xl border-r border-white/5 transition-all duration-500 flex flex-col overflow-hidden`}>
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
          <h2 className="font-bold text-amber-500 flex items-center gap-2 text-xs uppercase tracking-widest">
            <BookmarkIcon className="w-4 h-4" filled /> Library
          </h2>
          <button onClick={() => setShowSidebar(false)} className="text-neutral-500 hover:text-neutral-300">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Tabs */}
        <div className="flex border-b border-white/5">
          {(['history', 'saved', 'templates'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setSidebarTab(tab)}
              className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                sidebarTab === tab 
                  ? 'text-amber-500 bg-amber-500/5 border-b border-amber-500' 
                  : 'text-neutral-600 hover:text-neutral-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="p-4 border-b border-white/5">
          <div className="relative group">
            <SearchIcon className="absolute left-3 top-2.5 w-4 h-4 text-neutral-600 group-hover:text-amber-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-lg py-2 pl-9 pr-3 text-xs text-neutral-300 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
          {sidebarTab === 'history' && history.filter(i => i.originalPrompt?.toLowerCase().includes(searchQuery.toLowerCase() || "")).map(item => (
             <div key={item.id} onClick={() => loadHistoryItem(item)} className="p-3 rounded-lg hover:bg-white/5 cursor-pointer group transition-all border border-transparent hover:border-white/5">
                <div className="flex justify-between items-start mb-1">
                   <span className="text-[10px] text-amber-500 font-bold uppercase opacity-70">{item.domain}</span>
                   <button onClick={(e) => deleteHistoryItem(e, item.id)} className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-red-500 transition-opacity">
                     <TrashIcon className="w-3 h-3" />
                   </button>
                </div>
                <p className="text-xs text-neutral-400 line-clamp-2 font-light">{item.originalPrompt}</p>
                <span className="text-[10px] text-neutral-700 mt-2 block font-mono">{new Date(item.timestamp).toLocaleDateString()}</span>
             </div>
          ))}
          {sidebarTab === 'saved' && savedPrompts.filter(i => i.originalPrompt?.toLowerCase().includes(searchQuery.toLowerCase() || "")).map(item => (
             <div key={item.id} onClick={() => loadHistoryItem(item)} className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-amber-500/30 cursor-pointer group transition-all">
                <div className="flex justify-between items-start mb-1">
                   <span className="text-[10px] text-amber-500 font-bold uppercase">{item.domain}</span>
                   <button onClick={(e) => removeFromSaved(e, item.id)} className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-red-500 transition-opacity">
                     <TrashIcon className="w-3 h-3" />
                   </button>
                </div>
                <p className="text-xs text-neutral-300 line-clamp-2">{item.result.optimizedPrompt}</p>
             </div>
          ))}
           {sidebarTab === 'templates' && templates.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase() || "")).map(item => (
             <div key={item.id} onClick={() => loadTemplate(item)} className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-amber-500/30 cursor-pointer group transition-all relative">
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={(e) => deleteTemplate(e, item.id)} className="text-neutral-600 hover:text-red-500 p-1">
                     <TrashIcon className="w-3.5 h-3.5" />
                   </button>
                </div>
                <div className="flex justify-between items-start mb-1 pr-6">
                   <span className="text-sm font-bold text-amber-500 group-hover:text-amber-400 transition-colors">{item.name}</span>
                </div>
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2 bg-black/40 inline-block px-1.5 py-0.5 rounded border border-white/5">{item.category}</p>
                <p className="text-xs text-neutral-400 line-clamp-2 font-mono bg-black/20 p-2 rounded border border-white/5 group-hover:border-white/10 transition-colors">{item.content}</p>
             </div>
          ))}
          {sidebarTab === 'history' && history.length === 0 && <div className="text-center text-neutral-700 py-12 text-xs uppercase tracking-widest">No history</div>}
        </div>
        {sidebarTab === 'history' && history.length > 0 && (
          <div className="p-4 border-t border-white/5 bg-black/20">
            <button onClick={clearHistory} className="w-full py-3 text-xs text-red-500/70 hover:text-red-400 hover:bg-red-500/10 rounded flex items-center justify-center gap-2 transition-colors uppercase tracking-widest font-bold">
              <TrashIcon className="w-3 h-3" /> Clear History
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative w-full z-10">
        <header className="h-20 flex items-center justify-between px-6 md:px-8 border-b border-white/5 bg-neutral-900/40 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setShowSidebar(!showSidebar)} className="p-2 hover:bg-white/5 rounded-lg text-neutral-400 hover:text-white transition-colors">
               <LayoutIcon className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <LogoIcon className="w-8 h-8" />
              <div>
                 <h1 className="text-xl font-bold text-white tracking-tight">Prompt<span className="text-amber-500">Refine</span></h1>
                 <p className="text-[10px] text-neutral-500 uppercase tracking-widest hidden sm:block">Engineering Station v1.0</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => setShowWelcome(true)} className="p-2 text-neutral-500 hover:text-white transition-colors">
                <HelpIcon className="w-5 h-5" />
             </button>
             <div className="px-3 py-1.5 rounded-full bg-black/40 border border-white/10 text-[10px] font-mono text-neutral-400 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                SYSTEM_READY
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar">
           <div className="max-w-5xl mx-auto space-y-12 pb-24">
              
              {/* Step 1: Domain & Model */}
              <div className="space-y-6">
                 <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded bg-white/10 text-xs font-mono text-white">01</span>
                    <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Select Domain & Model</h3>
                 </div>
                 
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {DOMAINS.map(domain => (
                       <button
                         key={domain.id}
                         onClick={() => setSelectedDomain(domain.id)}
                         className={`group relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all duration-300 ${
                            selectedDomain === domain.id 
                            ? 'bg-amber-500/10 border-amber-500/50 text-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.2)]' 
                            : 'bg-white/5 border-white/5 text-neutral-500 hover:bg-white/10 hover:border-white/10 hover:text-white'
                         }`}
                       >
                         <div className={`p-2 rounded-full transition-transform duration-300 group-hover:scale-110 ${selectedDomain === domain.id ? 'bg-amber-500/20' : 'bg-black/30'}`}>
                            {domain.icon}
                         </div>
                         <span className="text-xs font-bold tracking-wide">{domain.label}</span>
                       </button>
                    ))}
                 </div>

                 <div className="bg-neutral-900/60 p-1 rounded-xl border border-white/10 flex flex-col md:flex-row items-stretch backdrop-blur-sm">
                    <div className="flex-1 p-3">
                       <label className="block text-[10px] text-neutral-500 mb-2 uppercase tracking-widest font-bold ml-1">Target Model Architecture</label>
                       <div className="relative group">
                          <select 
                            value={selectedModel} 
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="w-full appearance-none bg-black/40 border border-white/10 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all hover:bg-black/60"
                          >
                             {getModelOptions().map(m => (
                                <option key={m.id} value={m.id}>{m.label}</option>
                             ))}
                          </select>
                          <div className="absolute right-4 top-3.5 pointer-events-none text-neutral-500 group-hover:text-amber-500 transition-colors">
                             <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor"><path d="M1 1L5 5L9 1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                       </div>
                    </div>
                    <div className="w-px bg-white/10 my-3 hidden md:block"></div>
                    <div className="md:w-1/2 p-4 flex flex-col justify-center">
                       <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">Model Capability</div>
                       <p className="text-sm text-neutral-400 font-light">
                        {getModelOptions().find(m => m.id === selectedModel)?.description || "Select a model to view capabilities."}
                       </p>
                    </div>
                 </div>
              </div>

              {/* Step 2: Input */}
              <div className="space-y-6">
                 <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded bg-white/10 text-xs font-mono text-white">02</span>
                        <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Input {isReverseMode ? (selectedDomain === DomainId.VIDEO ? "Reference Media" : "Visual Reference") : "Raw Draft"}</h3>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                             onClick={() => { setUserInput(""); setVideoUrlInput(""); setUploadedImage(null); }}
                             className="text-xs text-neutral-600 hover:text-red-500 transition-colors uppercase tracking-widest font-bold"
                             hidden={!userInput && !uploadedImage && !videoUrlInput}
                        >
                            Clear
                        </button>
                         {selectedDomain === DomainId.IMAGE && (
                            <button 
                              onClick={() => setIsReverseMode(!isReverseMode)}
                              className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors px-3 py-1.5 rounded-full border ${isReverseMode ? 'bg-amber-500 text-black border-amber-500' : 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:border-amber-500/50'}`}
                            >
                               <UploadIcon className="w-3 h-3" />
                               {isReverseMode ? "Switch to Text Mode" : "Reverse Engineer"}
                            </button>
                        )}
                    </div>
                 </div>

                 <div className="relative group">
                    <div className={`absolute -inset-0.5 bg-gradient-to-r from-amber-500/30 to-purple-600/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-700 ${isOptimizing ? 'opacity-70 animate-pulse' : ''}`}></div>
                    <div className="relative bg-neutral-900 rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                       {isReverseMode ? (
                          <div className="min-h-64 flex flex-col bg-black/40 border-b border-white/5">
                              {/* Media Upload Area */}
                              <div 
                                 onClick={() => fileInputRef.current?.click()}
                                 className="flex-1 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors p-6"
                              >
                                 {uploadedImage ? (
                                    <img src={uploadedImage} alt="Upload" className="max-h-60 max-w-full object-contain p-2 rounded-lg border border-white/10" />
                                 ) : (
                                    <>
                                       <div className="w-16 h-16 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-neutral-500 mb-4 group-hover:scale-110 group-hover:border-amber-500/50 group-hover:text-amber-500 transition-all shadow-inner">
                                          <UploadIcon className="w-8 h-8" />
                                       </div>
                                       <p className="text-sm text-neutral-300 font-medium">Click to upload {selectedDomain === DomainId.VIDEO ? "video reference frame/screenshot" : "reference image"}</p>
                                       <p className="text-xs text-neutral-600 mt-1 font-mono">JPEG, PNG supported</p>
                                    </>
                                 )}
                                 <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                              </div>

                              {/* URL Input for Video (Optional) */}
                              {selectedDomain === DomainId.VIDEO && (
                                  <div className="p-4 bg-black/60 border-t border-white/5 flex items-center gap-3">
                                      <LinkIcon className="w-5 h-5 text-neutral-500" />
                                      <input 
                                        type="text" 
                                        value={videoUrlInput}
                                        onChange={(e) => setVideoUrlInput(e.target.value)}
                                        placeholder="Or paste video URL (YouTube, Vimeo, etc.) for context analysis..."
                                        className="w-full bg-transparent text-sm text-white placeholder-neutral-600 focus:outline-none font-mono"
                                      />
                                  </div>
                              )}
                          </div>
                       ) : (
                          <textarea
                             value={userInput}
                             onChange={(e) => setUserInput(e.target.value)}
                             placeholder={
                                selectedDomain === DomainId.CODING ? "// Paste your broken code here..." :
                                selectedDomain === DomainId.IMAGE ? "Imagine a futuristic city..." :
                                selectedDomain === DomainId.VIDEO ? "A drone shot flying over a cyberpunk city..." :
                                "Type your rough idea here..."
                             }
                             className="w-full h-48 bg-black/40 p-6 text-base text-neutral-200 placeholder-neutral-700 focus:outline-none resize-none font-mono leading-relaxed"
                          />
                       )}
                       
                       <div className="p-4 bg-neutral-900 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                          {/* Advanced Toggles */}
                          <div className="flex items-center gap-3">
                             <button 
                                onClick={() => setUseThinking(!useThinking)}
                                className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-all border ${
                                    useThinking 
                                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                                    : 'bg-white/5 text-neutral-500 border-white/5 hover:border-white/20'
                                }`}
                             >
                                <BrainIcon className="w-3 h-3" /> Deep Reasoning
                             </button>
                             <button 
                                onClick={() => setUseGrounding(!useGrounding)}
                                className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-all border ${
                                    useGrounding 
                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                                    : 'bg-white/5 text-neutral-500 border-white/5 hover:border-white/20'
                                }`}
                             >
                                <GlobeIcon className="w-3 h-3" /> Search Grounding
                             </button>
                          </div>

                          <button
                             onClick={isReverseMode ? handleReverseEngineer : handleOptimize}
                             disabled={isOptimizing || isAnalyzing || (!userInput.trim() && !uploadedImage && !videoUrlInput)}
                             className={`
                                flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all shadow-lg w-full sm:w-auto justify-center
                                ${isOptimizing || isAnalyzing 
                                   ? 'bg-neutral-800 text-neutral-500 cursor-wait border border-white/5' 
                                   : 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105'
                                }
                             `}
                          >
                             {isOptimizing || isAnalyzing ? (
                                <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> Processing</>
                             ) : (
                                <><SparklesIcon className="w-4 h-4" /> {isReverseMode ? "Analyze & Reverse" : "Execute Refine"}</>
                             )}
                          </button>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Step 3: Result */}
              {result && (
                  <div className="space-y-8 animate-fade-in">
                      <div className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-6 h-6 rounded bg-amber-500 text-xs font-mono text-black font-bold">03</span>
                          <span className="text-sm font-bold text-amber-500 uppercase tracking-widest">Result & Analysis</span>
                      </div>

                      <div className="bg-neutral-900/80 backdrop-blur-md border border-amber-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.05)] relative group">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/0 via-amber-500 to-amber-500/0 opacity-50"></div>
                          
                          <div className="flex border-b border-white/5 bg-black/20">
                              <div className="flex-1 p-4 flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                                  <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                                      {selectedModel} OUTPUT
                                  </div>
                              </div>
                              <div className="flex divide-x divide-white/5">
                                  <button onClick={handleCopy} className="px-4 py-2 hover:bg-white/5 text-neutral-400 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-bold tracking-wider">
                                      {copyStatus ? <CheckIcon className="w-3.5 h-3.5 text-green-500" /> : <CopyIcon className="w-3.5 h-3.5" />}
                                      {copyStatus ? "COPIED" : "COPY"}
                                  </button>
                                  <button onClick={handleSavePrompt} className={`px-4 py-2 hover:bg-white/5 transition-colors flex items-center gap-2 text-[10px] font-bold tracking-wider ${saveStatus ? 'text-green-500' : 'text-neutral-400 hover:text-white'}`}>
                                      <BookmarkIcon className="w-3.5 h-3.5" filled={saveStatus} />
                                      {saveStatus ? "SAVED" : "SAVE"}
                                  </button>
                                  <button onClick={() => openSaveTemplateModal(result.optimizedPrompt)} className="px-4 py-2 hover:bg-white/5 text-neutral-400 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-bold tracking-wider">
                                      <TagIcon className="w-3.5 h-3.5" />
                                      TEMPLATE
                                  </button>
                              </div>
                          </div>
                          
                          <div className="p-8">
                             <div className="font-mono text-sm leading-relaxed text-amber-50 whitespace-pre-wrap selection:bg-amber-500/30">
                                 {result.optimizedPrompt}
                             </div>
                             
                             {/* --- Image Generation Preview Section --- */}
                             {selectedDomain === DomainId.IMAGE && (
                                <div className="mt-8 pt-8 border-t border-white/5">
                                   <div className="flex items-center justify-between mb-4">
                                       <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Visual Verification Protocol</h4>
                                       {!generatedMedia.image && !isGeneratingImage && (
                                          <button 
                                            onClick={handleGenerateImage}
                                            className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 text-amber-500 hover:text-amber-300 border border-amber-500/20 px-4 py-2 rounded-full hover:bg-amber-500/10 transition-colors"
                                          >
                                             <SparklesIcon className="w-3 h-3" /> Generate Preview
                                          </button>
                                       )}
                                   </div>
                                   
                                   {isGeneratingImage && (
                                      <div className="h-64 bg-black/40 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-4 animate-pulse">
                                         <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                                         <p className="text-[10px] text-amber-500 font-mono tracking-widest">RENDERING_PIXELS...</p>
                                      </div>
                                   )}
                                   
                                   {generatedMedia.image && (
                                      <div className="relative group bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                                          <img src={generatedMedia.image} alt="Generated Preview" className="w-full h-auto max-h-[500px] object-contain" />
                                          <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                                             <a href={generatedMedia.image} download="prompt-preview.png" className="p-4 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-lg">
                                                <DownloadIcon className="w-6 h-6" />
                                             </a>
                                             <button onClick={handleGenerateImage} className="p-4 bg-neutral-800 text-white rounded-full hover:scale-110 transition-transform shadow-lg border border-white/10">
                                                <RefreshIcon className="w-6 h-6" />
                                             </button>
                                          </div>
                                      </div>
                                   )}
                                </div>
                             )}

                             {/* --- Video Generation Preview Section (VEO) --- */}
                             {selectedDomain === DomainId.VIDEO && (
                                <div className="mt-8 pt-8 border-t border-white/5">
                                   <div className="flex items-center justify-between mb-4">
                                       <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Veo Render Engine</h4>
                                       {!generatedMedia.video && !isGeneratingVideo && (
                                          <button 
                                            onClick={handleGenerateVideo}
                                            className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 text-green-500 hover:text-green-400 border border-green-500/20 px-4 py-2 rounded-full hover:bg-green-500/10 transition-colors"
                                          >
                                             <VideoIcon className="w-3 h-3" /> Generate Video
                                          </button>
                                       )}
                                   </div>
                                   
                                   {isGeneratingVideo && (
                                      <div className="h-64 bg-black/40 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-4 animate-pulse">
                                         <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                         <p className="text-[10px] text-green-500 font-mono tracking-widest uppercase">{videoProgress || "INITIALIZING..."}</p>
                                      </div>
                                   )}
                                   
                                   {generatedMedia.video && (
                                      <div className="relative group bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                                          <video controls src={generatedMedia.video} className="w-full h-auto max-h-[500px]" />
                                          <div className="p-3 flex justify-end bg-black/40 absolute bottom-0 w-full backdrop-blur-md">
                                             <a href={generatedMedia.video} download="veo-preview.mp4" className="text-xs flex items-center gap-2 text-green-500 hover:text-white font-bold uppercase tracking-wider">
                                                <DownloadIcon className="w-4 h-4" /> Download MP4
                                             </a>
                                          </div>
                                      </div>
                                   )}
                                </div>
                             )}

                             {/* --- Text Simulation Section (New) --- */}
                             {(selectedDomain !== DomainId.IMAGE && selectedDomain !== DomainId.VIDEO) && (
                                <div className="mt-8 pt-8 border-t border-white/5">
                                   <div className="flex items-center justify-between mb-4">
                                      <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Logic Simulation Loop</h4>
                                      <button 
                                        onClick={handleGenerateText}
                                        disabled={isGeneratingText}
                                        className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 text-blue-400 hover:text-blue-300 border border-blue-500/20 px-4 py-2 rounded-full hover:bg-blue-500/10 transition-colors"
                                      >
                                         {isGeneratingText ? <span className="animate-spin">⟳</span> : <PlayIcon className="w-3 h-3" />}
                                         {isGeneratingText ? "Running..." : "Run Simulation"}
                                      </button>
                                   </div>

                                   {generatedMedia.text && (
                                       <div className="bg-black/40 rounded-xl border border-white/5 p-6 relative animate-fade-in font-mono text-sm text-blue-100/80 leading-relaxed shadow-inner">
                                           <div className="absolute top-0 left-0 px-2 py-1 bg-blue-500/20 text-blue-300 text-[10px] font-bold tracking-widest uppercase rounded-br-lg">Output Stream</div>
                                           <div className="mt-4 whitespace-pre-wrap max-h-60 overflow-y-auto custom-scrollbar">
                                               {generatedMedia.text}
                                           </div>
                                       </div>
                                   )}
                                </div>
                             )}
                          </div>

                          <div className="bg-black/30 p-8 border-t border-white/5">
                              <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4">Engineering Notes</h4>
                              <div className="prose prose-invert prose-sm max-w-none text-neutral-400 font-light">
                                  <p className="whitespace-pre-wrap">{result.explanation}</p>
                              </div>
                              
                              <div className="mt-6 flex flex-wrap gap-2">
                                  {result.addedTerms.map((term, i) => (
                                      <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] text-neutral-400 font-mono tracking-wide hover:bg-white/10 transition-colors cursor-default">
                                          #{term}
                                      </span>
                                  ))}
                              </div>
                          </div>
                      </div>

                      {/* Assessment Section (Redesigned HUD Style) */}
                      {!assessment ? (
                         <div className="border border-white/5 rounded-2xl p-10 bg-neutral-900/40 backdrop-blur-sm flex flex-col items-center justify-center text-center space-y-6 hover:bg-neutral-900/60 transition-colors">
                             <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-neutral-600 border border-white/5">
                                <TrendingUpIcon className="w-8 h-8" />
                             </div>
                             <div>
                                <h4 className="text-sm font-bold text-white uppercase tracking-widest">Market Diagnostic</h4>
                                <p className="text-xs text-neutral-500 mt-2 max-w-sm mx-auto leading-relaxed">Run a commercial viability scan to analyze market potential, replicability, and monetization channels.</p>
                             </div>
                             <button 
                               onClick={handleAssessValue} 
                               disabled={isAssessing}
                               className="px-8 py-3 bg-white text-black text-xs font-bold tracking-widest uppercase rounded-full hover:scale-105 transition-all shadow-lg flex items-center gap-3"
                             >
                                {isAssessing ? <span className="animate-pulse">SCANNING DATA...</span> : "INITIATE SCAN"}
                             </button>
                         </div>
                      ) : (
                         <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-black/80 shadow-[0_0_50px_rgba(99,102,241,0.15)] animate-fade-in group">
                            {/* Decorative HUD Elements */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
                            <div className="absolute top-4 right-4 flex gap-1">
                               <div className="w-1 h-1 bg-indigo-500 rounded-full animate-pulse"></div>
                               <div className="w-1 h-1 bg-indigo-500 rounded-full animate-pulse delay-75"></div>
                               <div className="w-1 h-1 bg-indigo-500 rounded-full animate-pulse delay-150"></div>
                            </div>
                            
                            {/* Header */}
                            <div className="bg-indigo-950/20 border-b border-indigo-500/20 p-5 flex justify-between items-center">
                               <h4 className="text-xs font-bold text-indigo-400 tracking-[0.2em] flex items-center gap-3">
                                  <div className="w-2 h-2 bg-indigo-500 rotate-45"></div>
                                  MARKET_VALUE_DIAGNOSTIC
                               </h4>
                               <span className="text-[10px] font-mono text-indigo-500/70">SYS.ANALYSIS.COMPLETE</span>
                            </div>

                            <div className="p-8 grid md:grid-cols-3 gap-10">
                               {/* Score Column */}
                               <div className="flex flex-col items-center justify-center text-center relative p-4 border border-white/5 rounded-xl bg-white/5">
                                  <div className="relative w-36 h-36 flex items-center justify-center mb-6">
                                     <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="45" fill="none" stroke="#1e1b4b" strokeWidth="6" />
                                        <circle 
                                          cx="50" cy="50" r="45" fill="none" stroke="#6366f1" strokeWidth="6" 
                                          strokeDasharray={`${assessment.score * 2.83} 283`}
                                          strokeLinecap="round"
                                          className="drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                        />
                                     </svg>
                                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl font-bold text-white font-mono tracking-tighter">{assessment.score}</span>
                                        <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Index</span>
                                     </div>
                                  </div>
                                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${assessment.score > 80 ? 'border-indigo-500 text-indigo-300 bg-indigo-500/20' : 'border-yellow-500 text-yellow-500 bg-yellow-500/10'}`}>
                                     {assessment.commercialValue?.toUpperCase() || "UNKNOWN"} POTENTIAL
                                  </div>
                               </div>

                               {/* Details Column */}
                               <div className="md:col-span-2 space-y-6">
                                  <div>
                                     <p className="text-[10px] text-indigo-400 font-bold uppercase mb-2 tracking-widest">Target Sector</p>
                                     <div className="flex flex-wrap gap-2">
                                        {assessment.targetAudience.map(a => (
                                           <span key={a} className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 text-xs font-mono rounded-md hover:bg-indigo-500/20 transition-colors">
                                              [{a}]
                                           </span>
                                        ))}
                                     </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-6">
                                     <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <p className="text-[10px] text-indigo-400 font-bold uppercase mb-3 tracking-widest">Monetization</p>
                                        <ul className="space-y-2">
                                           {assessment.monetizationChannels.slice(0, 3).map(c => (
                                              <li key={c} className="text-xs text-neutral-300 flex items-center gap-2">
                                                 <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span> {c}
                                              </li>
                                           ))}
                                        </ul>
                                     </div>
                                     <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <p className="text-[10px] text-indigo-400 font-bold uppercase mb-3 tracking-widest">Risk Factors</p>
                                        <ul className="space-y-2">
                                           {assessment.riskFactors.slice(0, 2).map(r => (
                                              <li key={r} className="text-xs text-neutral-400 flex items-center gap-2">
                                                 <AlertIcon className="w-3 h-3 text-red-400" /> {r}
                                              </li>
                                           ))}
                                        </ul>
                                     </div>
                                  </div>
                                  
                                  <div className="pt-4 border-t border-indigo-500/10">
                                     <p className="text-sm text-neutral-300 font-light italic border-l-2 border-indigo-500 pl-4 py-1">"{assessment.reasoning}"</p>
                                  </div>
                               </div>
                            </div>
                         </div>
                      )}
                  </div>
              )}

           </div>
        </main>
      </div>

      {/* Template Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-purple-500 to-amber-500"></div>
              <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest">Save Template</h3>
              <div className="space-y-5">
                 <div>
                    <label className="block text-[10px] text-neutral-500 mb-1.5 uppercase tracking-widest font-bold">Name <span className="text-amber-500">*</span></label>
                    <input 
                      autoFocus
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-amber-500 focus:outline-none transition-colors"
                      value={newTemplateName}
                      onChange={e => setNewTemplateName(e.target.value)}
                      placeholder="My Super Prompt"
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] text-neutral-500 mb-1.5 uppercase tracking-widest font-bold">Category</label>
                    <input 
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-amber-500 focus:outline-none transition-colors"
                      value={newTemplateCategory}
                      onChange={e => setNewTemplateCategory(e.target.value)}
                      placeholder="e.g. Marketing, Coding, Art"
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] text-neutral-500 mb-1.5 uppercase tracking-widest font-bold">Content <span className="text-amber-500">*</span></label>
                    <textarea 
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-neutral-300 font-mono h-24 focus:border-amber-500 focus:outline-none resize-none custom-scrollbar"
                      value={templateContentToSave}
                      onChange={e => setTemplateContentToSave(e.target.value)}
                    />
                 </div>
                 
                 {templateError && (
                    <div className="text-xs text-red-400 bg-red-950/30 p-3 rounded border border-red-500/20 flex items-center gap-2">
                       <AlertIcon className="w-4 h-4" /> {templateError}
                    </div>
                 )}

                 <div className="flex gap-3 mt-8">
                    <button onClick={() => setIsTemplateModalOpen(false)} className="flex-1 py-3 rounded-lg border border-white/10 text-neutral-400 hover:bg-white/5 transition-colors text-xs font-bold uppercase tracking-widest">Cancel</button>
                    <button onClick={confirmSaveTemplate} className="flex-1 py-3 rounded-lg bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors text-xs uppercase tracking-widest shadow-lg shadow-amber-500/20">Save</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Clear History Confirmation Modal */}
      {isClearHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-neutral-900 border border-red-500/30 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>
              <div className="flex flex-col items-center text-center space-y-4">
                 <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mb-2">
                    <TrashIcon className="w-6 h-6" />
                 </div>
                 <h3 className="text-lg font-bold text-white uppercase tracking-widest">Clear History?</h3>
                 <p className="text-xs text-neutral-400 leading-relaxed px-4">
                    This action is irreversible. All your local history logs and analysis data will be permanently deleted.
                 </p>
                 
                 <div className="flex gap-3 mt-6 w-full">
                    <button onClick={() => setIsClearHistoryModalOpen(false)} className="flex-1 py-3 rounded-lg border border-white/10 text-neutral-400 hover:bg-white/5 transition-colors text-xs font-bold uppercase tracking-widest">Cancel</button>
                    <button onClick={confirmClearHistory} className="flex-1 py-3 rounded-lg bg-red-600 text-white font-bold hover:bg-red-500 transition-colors text-xs uppercase tracking-widest shadow-lg shadow-red-600/20">Delete All</button>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);