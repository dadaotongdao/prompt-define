import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { GoogleGenAI, Type, Modality } from "@google/genai";

// --- Icons (Updated for Dark/Gold Theme context) ---
const SparklesIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z" />
  </svg>
);

const CopyIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ImageIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

const CodeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const VideoIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m22 8-6 4 6 4V8Z" />
    <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
  </svg>
);

const PenIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const ChipIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M15 9h.01" />
    <path d="M9 15h.01" />
    <path d="M9 9h.01" />
    <path d="M15 15h.01" />
  </svg>
);

const UploadIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
);

const BookmarkIcon = ({ className, filled }: { className?: string; filled?: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
);

const LayoutIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <line x1="3" x2="21" y1="9" y2="9" />
    <line x1="9" x2="9" y1="21" y2="9" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const TagIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
    <path d="M7 7h.01" />
  </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const AlertIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" x2="12" y1="9" y2="13" />
    <line x1="12" x2="12.01" y1="17" y2="17" />
  </svg>
);

const LightbulbIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
);

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 16h5v5" />
  </svg>
);

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);

const GlobeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);

const BrainIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
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
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const SpeakerIcon = ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );

const ArrowRightIcon = ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );

const HelpIcon = ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
);

// --- Constants ---
const DOMAINS = [
  {
    id: "image",
    label: "Image Generation",
    icon: <ImageIcon className="w-5 h-5" />,
    description: "For art, photos, and logos (Midjourney, Nano Banana).",
  },
  {
    id: "video",
    label: "Video Creation",
    icon: <VideoIcon className="w-5 h-5" />,
    description: "For cinematic shots, camera motion, and Veo prompts.",
  },
  {
    id: "writing",
    label: "Creative Writing",
    icon: <PenIcon className="w-5 h-5" />,
    description: "For essays, marketing copy, stories, and blogs.",
  },
  {
    id: "coding",
    label: "Software Engineering",
    icon: <CodeIcon className="w-5 h-5" />,
    description: "For React, Python, and technical problem solving.",
  },
  {
    id: "general",
    label: "General Assistant",
    icon: <SparklesIcon className="w-5 h-5" />,
    description: "For any other questions or general tasks.",
  },
];

const GENERAL_TARGET_MODELS = [
    { id: "gemini-3-pro", label: "Gemini 3 Pro", description: "Best for huge context & creativity (C.L.E.A.R.)" },
    { id: "gpt-5.1", label: "GPT-5.1", description: "Best for structured reasoning (KDP)" },
    { id: "claude-4.5-opus", label: "Claude 4.5 Opus", description: "Best for complex architecture & deep XML structure" },
    { id: "claude-4.5-sonnet", label: "Claude 4.5 Sonnet", description: "Best for coding, efficiency & input/output specs" },
    { id: "grok-4.1", label: "Grok-4.1", description: "Best for wit, directness & real-time edge" },
    { id: "kimi-k2-thinking", label: "Kimi k2 thinking", description: "Best for ultra-long context & analytical trace" },
];

const IMAGE_TARGET_MODELS = [
    { id: "nano-banana-pro", label: "Nano Banana Pro", description: "Gemini 3. Narrative, 4K, Chinese/English Text." },
    { id: "midjourney", label: "Midjourney v7", description: "Artistic. Use --v 7, --ar, stylized weights." },
    { id: "stable-diffusion", label: "Stable Diffusion", description: "Tag-based, precise weighting (keyword:1.2)." },
    { id: "seedream-4.0", label: "Seedream 4.0", description: "High aesthetic, golden ratio, lighting mastery." },
];

const WRITING_TARGET_MODELS = [
    { id: "gemini-3", label: "Gemini 3", description: "Expansive creativity, long-context flow." },
    { id: "claude-4.5-sonnet", label: "Claude 4.5 Sonnet", description: "Nuanced, high-level vocabulary, 'human' tone." },
    { id: "qwen3-max-thinking", label: "Qwen3-Max-Thinking", description: "Deep narrative reasoning & complex plots." },
    { id: "ernie-5.0", label: "文心 5.0 (Ernie)", description: "Top Chinese literary style & cultural depth." },
];

const DEFAULT_TEMPLATES: TemplateItem[] = [
  {
    id: "tpl_default_1",
    name: "Cyberpunk Portrait (Nano Banana)",
    content: "Portrait of a futuristic cyborg with neon accents, rain-slicked streets background, 85mm lens, f/1.8, bokeh, cinematic lighting, hyper-realistic, 8k --ar 9:16",
    domain: "image",
    category: "Art",
    timestamp: Date.now()
  },
  {
    id: "tpl_default_2",
    name: "React Senior Engineer",
    content: "Act as a Senior React Developer. Write clean, efficient, and accessible code. Use functional components, hooks, and TypeScript. Prioritize performance and error handling. Explain your reasoning briefly before coding.",
    domain: "coding",
    category: "Development",
    timestamp: Date.now()
  },
  {
    id: "tpl_default_3",
    name: "SEO Blog Post Writer",
    content: "Write a comprehensive, SEO-optimized blog post about [Topic]. Use H2 and H3 headers. Include a compelling introduction, detailed body paragraphs with examples, and a conclusion. Target keywords: [Keywords]. Tone: Informative and engaging.",
    domain: "writing",
    category: "Marketing",
    timestamp: Date.now()
  }
];

// --- Helper Functions ---
const cleanAndParseJSON = (str: string, defaultVal: any = {}) => {
  if (!str) return defaultVal;
  try {
    // 1. Try direct parse
    return JSON.parse(str);
  } catch (e) {
    try {
      // 2. Try removing markdown code blocks (```json ... ```)
      let clean = str.replace(/```json\s*/g, "").replace(/```\s*$/g, "");
      // 3. Try finding the first '{' and last '}'
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

// --- Audio Decoding (for TTS) ---
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


// --- Types ---
type OptimizationResult = {
  optimizedPrompt: string;
  explanation: string;
  addedTerms: string[];
};

type AssessmentResult = {
    score: number; // 0-100
    commercialValue: "High" | "Medium" | "Low";
    targetAudience: string[];
    monetizationChannels: string[]; // e.g. "Notion Template", "SaaS"
    riskFactors: string[];
    improvementTips: string[];
    reasoning: string;
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
  category: string; // New field for categorization
  timestamp: number;
};

// --- Components ---

const WelcomeGuide = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-purple-500 to-amber-500"></div>
                
                <div className="p-8 md:p-12 text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 text-amber-500 mb-2">
                        <SparklesIcon className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Welcome to PromptRefine AI</h2>
                    <p className="text-neutral-400 text-lg max-w-lg mx-auto leading-relaxed">
                        Transform vague ideas into production-ready prompts for Gemini 3, Midjourney, and more using professional engineering protocols.
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-6 text-left mt-8">
                        <div className="p-4 rounded-xl bg-neutral-800/50 border border-neutral-800">
                             <div className="text-amber-500 mb-3 font-bold text-sm">STEP 1</div>
                             <h3 className="text-white font-medium mb-1">Select Domain</h3>
                             <p className="text-xs text-neutral-500">Choose your target (Image, Coding, Writing) to load specialized optimization logic.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-neutral-800/50 border border-neutral-800">
                             <div className="text-amber-500 mb-3 font-bold text-sm">STEP 2</div>
                             <h3 className="text-white font-medium mb-1">Input Draft</h3>
                             <p className="text-xs text-neutral-500">Type a basic idea or upload an image to reverse-engineer its prompt.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-neutral-800/50 border border-neutral-800">
                             <div className="text-amber-500 mb-3 font-bold text-sm">STEP 3</div>
                             <h3 className="text-white font-medium mb-1">Refine & Scan</h3>
                             <p className="text-xs text-neutral-500">Get the optimized prompt and run a "Commercial Value Scan" to see its worth.</p>
                        </div>
                    </div>

                    <button 
                        onClick={onClose}
                        className="mt-8 px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform shadow-lg flex items-center gap-2 mx-auto"
                    >
                        Get Started <ArrowRightIcon className="w-4 h-4" />
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
  const [selectedDomain, setSelectedDomain] = useState("image");
  const [selectedModel, setSelectedModel] = useState("nano-banana-pro");
  
  // Advanced Toggles
  const [useThinking, setUseThinking] = useState(false);
  const [useGrounding, setUseGrounding] = useState(false);

  // Logic States
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  
  // Assessment States
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);
  const [isAssessing, setIsAssessing] = useState(false);

  // Reverse Engineering States
  const [isReverseMode, setIsReverseMode] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Preview States
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [isGeneratingText, setIsGeneratingText] = useState(false);

  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState("");

  // TTS State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const [copyStatus, setCopyStatus] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);
  const [toastMessage, setToastMessage] = useState(""); // Toast State
  
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

  // Saved Prompts State
  const [savedPrompts, setSavedPrompts] = useState<HistoryItem[]>(() => {
    try {
        const saved = localStorage.getItem("promptRefineSaved");
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
  });

  // Templates State
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

  // Reset model selection when domain changes to ensure valid model
  useEffect(() => {
    if (selectedDomain === 'general') {
        setSelectedModel('gemini-3-pro');
    } else if (selectedDomain === 'image') {
        setSelectedModel('nano-banana-pro');
    } else if (selectedDomain === 'writing') {
        setSelectedModel('gemini-3');
    } else if (selectedDomain === 'video') {
        setSelectedModel('veo');
    } else {
        setSelectedModel('gemini-3-pro'); // Default fallback
    }
    // Reset Reverse Mode if not in Image domain
    if (selectedDomain !== 'image') {
        setIsReverseMode(false);
        setUploadedImage(null);
    }
  }, [selectedDomain]);

  // Clear search when switching tabs
  useEffect(() => {
    setSearchQuery("");
  }, [sidebarTab]);

  // Clear assessment when result changes
  useEffect(() => {
      setAssessment(null);
      setGeneratedImage(null);
      setGeneratedText(null);
      setGeneratedVideo(null);
  }, [result]);

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
    // Limit to 50 items
    const newHistory = [newItem, ...history].slice(50);
    setHistory(newHistory);
    localStorage.setItem("promptRefineHistory", JSON.stringify(newHistory));
  };

  const handleSavePrompt = () => {
      if (!result) return;
      
      // Check if already saved (by optimized prompt content to avoid dupes)
      const existing = savedPrompts.find(p => p.result.optimizedPrompt === result.optimizedPrompt);
      if (existing) {
          setSaveStatus(true);
          setTimeout(() => setSaveStatus(false), 2000);
          return;
      }

      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        originalPrompt: isReverseMode ? "[Image Upload]" : userInput,
        domain: selectedDomain,
        model: (selectedDomain === 'general' || selectedDomain === 'image' || selectedDomain === 'writing' || selectedDomain === 'video') ? selectedModel : undefined,
        result
      };

      const newSaved = [newItem, ...savedPrompts];
      setSavedPrompts(newSaved);
      localStorage.setItem("promptRefineSaved", JSON.stringify(newSaved));
      
      setSaveStatus(true);
      setTimeout(() => setSaveStatus(false), 2000);
  };

  const openSaveTemplateModal = (content: string) => {
    setTemplateContentToSave(content || ""); // Allow empty string for manual entry
    setNewTemplateName("");
    setNewTemplateCategory(""); // Reset category
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
    
    // UX Improvements:
    // 1. Show global toast feedback
    setToastMessage("Template Saved Successfully!");
    setTimeout(() => setToastMessage(""), 3000);

    // 2. Automatically navigate to Templates tab and open sidebar
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
      setResult(null);
      setGeneratedImage(null);
      setGeneratedText(null);
      setGeneratedVideo(null);
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
    if(confirm("Are you sure you want to clear your history?")) {
        setHistory([]);
        localStorage.removeItem("promptRefineHistory");
    }
  };

  const deleteHistoryItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newHistory = history.filter(h => h.id !== id);
    setHistory(newHistory);
    localStorage.setItem("promptRefineHistory", JSON.stringify(newHistory));
  };

  const loadHistoryItem = (item: HistoryItem) => {
    if (item.originalPrompt !== "[Image Upload]") {
        setUserInput(item.originalPrompt);
    }
    setSelectedDomain(item.domain);
    if (item.model) setSelectedModel(item.model);
    setResult(item.result);
    // Reset generation states as they are not stored
    setGeneratedImage(null);
    setGeneratedText(null);
    setGeneratedVideo(null);
    
    setIsReverseMode(item.originalPrompt === "[Image Upload]"); 
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
    if (!result?.optimizedPrompt) return;
    setIsGeneratingImage(true);
    setGeneratedImage(null);

    try {
        await ensureApiKey();
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Use gemini-3-pro-image-preview for high quality preview
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

        // Loop parts to find image
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                const base64EncodeString = part.inlineData.data;
                const imageUrl = `data:image/png;base64,${base64EncodeString}`;
                setGeneratedImage(imageUrl);
                break;
            }
        }
    } catch (error) {
        console.error("Image generation failed:", error);
        alert("Failed to generate image preview. Please try again.");
    } finally {
        setIsGeneratingImage(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!result?.optimizedPrompt) return;
    setIsGeneratingVideo(true);
    setGeneratedVideo(null);
    setVideoProgress("Initializing Veo...");

    try {
        await ensureApiKey();
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        setVideoProgress("Submitting generation request...");
        // Use Veo model
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
        // Polling loop with Timeout safety
        let attempts = 0;
        const maxAttempts = 20; // 20 * 5s = 100 seconds max wait
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
             setGeneratedVideo(videoUrl);
        } else {
             throw new Error("No video URI returned.");
        }

    } catch (error: any) {
        console.error("Video generation failed:", error);
        alert(`Video generation failed: ${error.message}`);
    } finally {
        setIsGeneratingVideo(false);
        setVideoProgress("");
    }
  };

  const handleGenerateText = async () => {
      if (!result?.optimizedPrompt) return;
      setIsGeneratingText(true);
      setGeneratedText(null);

      try {
          await ensureApiKey();
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          
          // Use gemini-3-pro for high quality simulation
          const response = await ai.models.generateContent({
              model: 'gemini-3-pro-preview',
              contents: result.optimizedPrompt,
              config: {
                 systemInstruction: "You are acting as the model defined in the prompt. Execute the prompt exactly as requested."
              }
          });
          
          setGeneratedText(response.text || "No output generated.");

      } catch (error) {
          console.error("Text simulation failed:", error);
          alert("Simulation failed.");
      } finally {
          setIsGeneratingText(false);
      }
  };

  const handleTTS = async () => {
      if (!result?.optimizedPrompt) return;
      setIsPlayingAudio(true);
      
      try {
          await ensureApiKey();
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          
          const response = await ai.models.generateContent({
              model: "gemini-2.5-flash-preview-tts",
              contents: [{ parts: [{ text: result.optimizedPrompt }] }],
              config: {
                  responseModalities: [Modality.AUDIO],
                  speechConfig: {
                      voiceConfig: {
                          prebuiltVoiceConfig: { voiceName: 'Kore' }, // Kore has a nice deep professional tone
                      },
                  },
              },
          });

          const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
          if (!base64Audio) throw new Error("No audio data returned");

          const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
          const outputNode = outputAudioContext.createGain();
          outputNode.connect(outputAudioContext.destination);

          const audioBuffer = await decodeAudioData(
              decode(base64Audio),
              outputAudioContext,
              24000,
              1,
          );
          
          const source = outputAudioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(outputNode);
          source.onended = () => setIsPlayingAudio(false);
          source.start();

      } catch (error) {
          console.error("TTS failed:", error);
          alert("Failed to generate audio.");
          setIsPlayingAudio(false);
      }
  };

  const handleReverseEngineer = async () => {
    if (!uploadedImage) return;
    setIsAnalyzing(true);
    setResult(null);

    try {
        await ensureApiKey();
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Split base64 to get data
        const base64Data = uploadedImage.split(',')[1];
        
        let systemInstruction = `
          You are an expert Reverse Engineering Prompt Engineer for AI Image Models.
          
          TASK:
          1. Analyze the uploaded image and first convert it mentally into a detailed JSON structure containing:
             - "image_analysis": { subject, key_elements, background, lighting, color_palette }
             - "nano_banana_pro_parameters": { resolution, style, lighting_tech, iso, composition }
             - "aspect_ratio"
             
          2. BASED on this JSON content, SYNTHESIZE the final reverse engineered prompt.
             - Combine subject, style, lighting, and parameters into a single, cohesive, high-quality prompt string.
             - Ensure it follows the structure best suited for the target model (e.g., Nano Banana Pro/Gemini 3).
          
          OUTPUT REQUIREMENT:
          You must return a JSON object (as defined in the responseSchema) where:
          - 'optimizedPrompt': Contains the FINAL SYNTHESIZED TEXT PROMPT (e.g. "Minimalist workspace still life...").
          - 'explanation': Contains the structured JSON ANALYSIS details you derived in step 1 (formatted as a readable string or JSON string), so the user can see the breakdown.
          - 'addedTerms': Extract key tags.
          
          TARGET MODEL: ${selectedModel}
        `;

        // ... (system instruction refinement logic similar to previous code)
         if (selectedModel === 'midjourney') {
           systemInstruction += `
             - Format: Subject description + Art Style + Parameters
             - Parameters: Append --v 7 and approximate --ar (aspect ratio).
             - Style: Use evocative, artistic keywords.
           `;
        } else if (selectedModel === 'nano-banana-pro') {
           systemInstruction += `
             - Format: Narrative Description.
             - Keywords: Include camera parameters (e.g., "85mm lens", "f/1.8 aperture") if photorealistic.
             - Structure: Subject + Style + Context + Lighting.
           `;
        } else if (selectedModel === 'stable-diffusion') {
           systemInstruction += `
             - Format: Tag-based with weights. Example: (subject:1.2), style, lighting.
             - Keywords: "masterpiece", "best quality".
           `;
        }


        const modelConfig = {
             model: 'gemini-3-pro-preview', // Use Vision model
             contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: base64Data } }, // Assuming JPEG/PNG, API handles it
                    { text: "将图像转换为 JSON 提示符，包括大小和详细信息" }
                ]
             },
             config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    optimizedPrompt: { type: Type.STRING, description: "The final synthesized text prompt based on the analysis." },
                    explanation: { type: Type.STRING, description: "The detailed JSON analysis of the image (subject, lighting, params)." },
                    addedTerms: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                },
             }
        };

        let response;
        try {
            response = await ai.models.generateContent(modelConfig);
        } catch (error: any) {
            // Fallback logic for 503/500
            const isServerError = 
                (error.message && (error.message.includes('500') || error.message.includes('503'))) ||
                error.status === 500 || error.code === 500 ||
                error.status === 503 || error.code === 503;

            if (isServerError) {
                console.warn("Gemini 3 Pro overloaded, falling back to Gemini 2.5 Flash...", error);
                const fallbackConfig = { ...modelConfig, model: 'gemini-2.5-flash' };
                response = await ai.models.generateContent(fallbackConfig);
            } else {
                throw error;
            }
        }

        const json = cleanAndParseJSON(response.text || "{}");
        const safeResult = {
            optimizedPrompt: json.optimizedPrompt || "Failed to generate prompt.",
            explanation: (json.explanation || "Analysis complete.") + (response.model === 'gemini-2.5-flash' ? " (Generated with fallback model due to high traffic)" : ""),
            addedTerms: Array.isArray(json.addedTerms) ? json.addedTerms : []
        };

        setResult(safeResult);
        addToHistory("[Image Upload]", selectedDomain, safeResult, selectedModel);

    } catch (error) {
        console.error("Reverse engineering failed:", error);
        alert("Failed to analyze image. Please try again.");
    } finally {
        setIsAnalyzing(false);
    }
  };


  const handleOptimize = async () => {
    if (!userInput.trim()) return;
    setIsOptimizing(true);
    setResult(null);
    setGeneratedImage(null);
    setGeneratedText(null);
    setGeneratedVideo(null);

    try {
      await ensureApiKey();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let baseInstruction = `You are a world-class Prompt Engineer. 
      Your goal is to rewrite the user's raw input into a professional, high-fidelity prompt optimized for the selected domain.
      RETURN JSON ONLY.`;

      let domainInstruction = "";
      
      if (selectedDomain === "image") {
          domainInstruction = `
          DOMAIN: Image Generation.
          TARGET MODEL: ${selectedModel}.
          
          STRATEGIES:
          `;
          
          if (selectedModel === 'nano-banana-pro') {
             domainInstruction += `
             - MODEL: Gemini 3 Pro Image (Nano Banana Pro).
             - CORE: Use the "Universal Formula": [Subject] + [Style] + [Aspect Ratio].
             - PHOTOREALISM: If realistic, MUST specify camera params: "85mm lens" (portrait), "24mm lens" (landscape), "f/1.8" (bokeh).
             - TEXT: If user wants text, put it in quotes: "text 'HELLO'".
             - LIGHTING: Use terms like "Golden Hour", "Soft Diffused", "Cinematic Lighting".
             - REF: "The Definitive Guide to Mastering Nano Banana Pro".
             `;
          } else if (selectedModel === 'midjourney') {
             domainInstruction += `
             - MODEL: Midjourney v7.
             - SYNTAX: Use --v 7, --ar 16:9 (or 9:16/1:1 based on intent), --stylize.
             - STYLE: Focus on artistic keywords, medium (oil painting, 3d render), and mood.
             `;
          } else if (selectedModel === 'stable-diffusion') {
             domainInstruction += `
             - MODEL: Stable Diffusion.
             - SYNTAX: Tag based. Use weights like (best quality:1.2), (masterpiece:1.2).
             - NEGATIVE: Suggest negative embeddings if needed in explanation.
             `;
          } else if (selectedModel === 'seedream-4.0') {
              domainInstruction += `
              - MODEL: Seedream 4.0.
              - AESTHETIC: Balance between art and realism.
              - COMPOSITION: Enforce "Rule of Thirds" or "Golden Ratio" terms.
              `;
          }
      } else if (selectedDomain === "video") {
          domainInstruction = `
          DOMAIN: Video Generation (e.g., Veo, Sora).
          Focus on:
          1. Camera Movement: "Drone shot", "Pan left", "Zoom in", "Tracking shot".
          2. Lighting & Atmosphere: "Cyberpunk neon", "Golden hour", "Foggy morning".
          3. Action: Clear description of movement. "A cat running", "Cars speeding".
          4. Tech Specs: "4k resolution", "60fps", "Cinematic".
          `;
      } else if (selectedDomain === "writing") {
          domainInstruction = `
          DOMAIN: Creative Writing.
          TARGET MODEL: ${selectedModel}.
          
          STRATEGIES:
          `;
          if (selectedModel === 'gemini-3') {
              domainInstruction += `
              - Focus: Expansive creativity, utilize long-context window for consistency.
              - Avoid: Clichés.
              - Technique: "Show, Don't Tell".
              `;
          } else if (selectedModel === 'claude-4.5-sonnet') {
              domainInstruction += `
              - Focus: Sophisticated vocabulary, human-like nuance, emotional depth.
              - Tone: Adaptive and subtle.
              `;
          } else if (selectedModel === 'qwen3-max-thinking') {
              domainInstruction += `
              - Focus: Deep narrative reasoning.
              - Method: Chain of Thought applied to plot structure. Logic first, then prose.
              `;
          } else if (selectedModel === 'ernie-5.0') {
              domainInstruction += `
              - Focus: Chinese literary excellence.
              - Style: Use classical idioms (Chengyu) where appropriate, culturally resonant metaphors.
              `;
          }

      } else if (selectedDomain === "coding") {
          domainInstruction = `
          DOMAIN: Coding / Software Engineering.
          Focus on:
          1. Specificity: Language (React, Python), Frameworks, Libraries.
          2. Constraints: "No external libraries", "Use functional components", "TypeScript".
          3. Edge Cases: "Handle null values", "Error boundaries".
          `;
      } else if (selectedDomain === "general") {
         // --- UPDATED LOGIC BASED ON KERNEL DIAGNOSTIC REPORT ---
         domainInstruction = `
         DOMAIN: General Assistant / LLM.
         TARGET MODEL: ${selectedModel}.
         
         CRITICAL PROTOCOLS:
         `;
         
         if (selectedModel === 'gpt-5.1') {
             domainInstruction += `
             *** TARGET: GPT-5.1 ***
             PROTOCOL: KDP (Kernel Debug Protocol).
             STRATEGY: The prompt MUST be a structured JSON object to ensure deterministic execution.
             
             OUTPUT FORMAT (for 'optimizedPrompt'):
             The 'optimizedPrompt' string inside your JSON response MUST be a valid JSON string itself, following this schema:
             {
               "KDP_CORE": { "deterministic": true, "no_fabrication": true, "priority_order": ["constraints", "task", "input"] },
               "KDP_TASK": { "goal": "[User's Goal]", "steps_required": true },
               "KDP_INPUT": { "context": "[User's Input]", "constraints": ["Hard constraint 1", "Soft constraint 2"] },
               "KDP_CHECK": { "no_fabrication": true }
             }
             
             EXPLANATION: Explain that KDP ensures the model acts as a reliable kernel rather than a chatty bot.
             `;
         } else if (selectedModel === 'claude-4.5-opus') {
             domainInstruction += `
             *** TARGET: Claude 4.5 Opus ***
             PROTOCOL: Deep XML-Tag Protocol.
             STRATEGY: Use XML tags with high architectural depth.
             
             OUTPUT FORMAT (for 'optimizedPrompt'):
             <task>
               <objective>[User's Goal]</objective>
             </task>
             
             <input_spec>
               [Specifics of input data/code]
             </input_spec>
             
             <output_spec>
               [Specific Schema/Format of output]
             </output_spec>
             
             <constraints>
               [Hard limitations]
             </constraints>
             
             EXPLANATION: Sonnet 4.5 excels with explicit input/output specifications, especially for code and data tasks.
             `;
         } else if (selectedModel === 'gemini-3-pro') {
             domainInstruction += `
             *** TARGET: Gemini 3 Pro ***
             PROTOCOL: Primacy & Recency Attention Strategy.
             STRATEGY: Markdown Headers + Bullet Points.
             CRITICAL: Place constraints at the BEGINNING and REPEAT them at the END.
             
             OUTPUT FORMAT (for 'optimizedPrompt'):
             ## Role & Constraints (Primacy)
             - [Role Definition]
             - [Critical Constraint A]
             
             ## Context & Input
             [User's Input]
             
             ## Task
             [Specific Instructions]
             
             ## Reminder (Recency)
             - REMEMBER: [Critical Constraint A]
             
             EXPLANATION: "Sandwiching" constraints mitigates context loss in long-window reasoning.
             `;
         } else if (selectedModel === 'grok-4.1') {
             domainInstruction += `
             *** TARGET: Grok 4.1 ***
             PROTOCOL: Direct/Table Protocol.
             STRATEGY: Markdown Tables for data. "Step-by-step" trigger.
             TONE: Direct, witty, no corporate fluff.
             
             OUTPUT FORMAT (for 'optimizedPrompt'):
             # Task: [Goal]
             
             [User Input]
             
             Trigger: "Let's think step by step."
             
             (If comparing items, use a Markdown Table)
             
             EXPLANATION: Grok prefers raw directness and structured data tables over verbose prose.
             `;
         } else if (selectedModel === 'kimi-k2-thinking') {
             domainInstruction += `
             *** TARGET: Kimi k2 thinking ***
             PROTOCOL: Sandwich Attention & Atomic XML.
             STRATEGY: XML Atomic Task + Sandwich Structure (Critical info at start & end) + CoT Trigger.
             
             OUTPUT FORMAT (for 'optimizedPrompt'):
             <task type="analytical" domain="[Domain]" reasoning="required">
               <context>
                 [Context info]
                 <critical_marker>CRITICAL: [Key Instruction]</critical_marker>
               </context>
               
               <objective>[User Goal]</objective>
               
               <constraints>
                 <constraint>[Constraint 1]</constraint>
               </constraints>
               
               <execution_trace>
                 Trigger: "Execute analytical reasoning trace: decompose, validate each premise, then synthesize."
                 <!-- REPEAT CRITICAL: [Key Instruction] -->
               </execution_trace>
             </task>
             
             EXPLANATION: Optimizes for Kimi's specific attention decay patterns and MoE routing.
             `;
         }
      }

      // Concatenate for system instruction
      let fullSystemInstruction = `${baseInstruction}\n${domainInstruction}`;

      // --- CONFIGURATION LOGIC FOR ADVANCED FEATURES ---
      
      // DEFAULT TO GEMINI 3 PRO PREVIEW (As requested)
      let targetModel = 'gemini-3-pro-preview';
      let tools: any[] = [];
      let thinkingConfig = undefined;

      // Feature: Thinking Config (Deep Reasoning)
      // Per system instruction: thinkingConfig is ONLY available on Gemini 2.5 series.
      // IF the user enables "Deep Reasoning", we MUST switch to gemini-2.5-flash to use the REAL thinking capability.
      // AND we must enforce the "Decompose -> Reassemble -> Check" logic in the prompt.
      if (useThinking) {
         targetModel = 'gemini-2.5-flash';
         thinkingConfig = { thinkingBudget: 4096 }; // Increased budget for deep reasoning
         
         // INJECT SPECIFIC DEEP THINKING LOGIC INTO SYSTEM PROMPT
         fullSystemInstruction += `
         
         *** DEEP REASONING MODE ACTIVE ***
         You must strictly follow this internal thought process before generating the final JSON:
         
         PHASE 1: DECOMPOSE
         - Break down the user's raw input into atomic constraints, intent, and missing information.
         - Identify potential ambiguities.
         
         PHASE 2: REASSEMBLE
         - Construct the optimal prompt structure based on the selected Domain and Target Model.
         - Apply specific prompting techniques (Chain of Thought, Few-Shot, etc.).
         
         PHASE 3: SELF-CHECK (CRITICAL)
         - Review your draft against the Target Model's best practices.
         - Does it violate any constraints? Is it too vague?
         - Refine the draft.
         
         PHASE 4: OUTPUT
         - Generate the final JSON.
         `;
      }

      // Feature: Google Search Grounding
      if (useGrounding) {
         // Grounding is supported on 3-Pro.
         tools.push({ googleSearch: {} });
         
         // ARCHITECTURAL FIX: Deterministic Anchor Delimiters
         // Do not rely on JSON when grounding is active. Use delimiters.
         fullSystemInstruction += `
         
         *** WEB GROUNDING ACTIVE ***
         CRITICAL: Since you are using Google Search, do NOT output JSON. 
         Instead, use this STRICT anchor-delimited format:
         
         <<<ANALYSIS_START>>>
         [Your explanation of how the search results informed the prompt]
         <<<ANALYSIS_END>>>
         
         <<<PROMPT_START>>>
         [The final optimized prompt]
         <<<PROMPT_END>>>
         
         <<<TAGS_START>>>
         [Comma, Separated, Tags]
         <<<TAGS_END>>>
         `;
      }

      const modelConfig = {
        model: targetModel,
        contents: {
             parts: [{ text: `User Raw Input: "${userInput}"` }]
        },
        config: {
            systemInstruction: fullSystemInstruction,
            responseMimeType: useGrounding ? undefined : "application/json", // Google Search doesn't support responseMimeType
            // Add thinking config if enabled
            ...(thinkingConfig && { thinkingConfig }),
            // Add tools if enabled
            ...(tools.length > 0 && { tools }),
            // Only use responseSchema if NOT using grounding (Grounding + Schema is invalid)
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
          // Robust fallback for 500/503 errors
          const isServerError = 
            (error.message && (error.message.includes('500') || error.message.includes('503'))) ||
            error.status === 500 || 
            error.code === 500 ||
            error.status === 503 || 
            error.code === 503;

          if (isServerError) {
              console.warn("Gemini Error, falling back to Gemini 2.5 Flash...", error);
              // Fallback to basic Flash without fancy tools to ensure reliability
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
      
      // Parse Logic: Handle Grounding Text vs Standard JSON
      let safeResult;
      
      if (useGrounding) {
          // ARCHITECTURAL FIX: Parse Delimiters
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

          // Fallback if delimiters fail (rare but possible)
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

      setResult(safeResult);
      addToHistory(userInput, selectedDomain, safeResult, selectedModel);

    } catch (error) {
      console.error("Error optimizing prompt:", error);
      alert("Something went wrong. Please check your API key or try again.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleAssessValue = async () => {
    if (!result) return;
    setIsAssessing(true);
    setAssessment(null);
    
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
            // Check for overload error (503) and fallback to a lighter model
            const isServerError = 
                (err.message && (err.message.includes('500') || err.message.includes('503') || err.message.includes('overloaded'))) ||
                err.status === 500 || err.code === 500 ||
                err.status === 503 || err.code === 503;

            if (isServerError) {
                console.warn("Gemini 3 Pro overloaded, retrying with Gemini 2.5 Flash...");
                // Fallback to Flash
                const fallbackConfig = { ...modelConfig, model: 'gemini-2.5-flash' };
                response = await ai.models.generateContent(fallbackConfig);
            } else {
                throw err;
            }
        }
        
        const json = cleanAndParseJSON(response.text || "{}");
        // FIX: Ensure all properties have defaults to prevent render crashes
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
        setAssessment(safeJson);

    } catch (e: any) {
        console.error("Assessment failed", e);
        alert(`Assessment failed: ${e.message || "Unknown error"}. Please try again later.`);
    } finally {
        setIsAssessing(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.optimizedPrompt);
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 2000);
    }
  };

  const getModelOptions = () => {
    switch (selectedDomain) {
      case "image": return IMAGE_TARGET_MODELS;
      case "writing": return WRITING_TARGET_MODELS;
      case "general": return GENERAL_TARGET_MODELS;
      case "coding": return GENERAL_TARGET_MODELS; // Reuse general for coding as it has Claude/Gemini
      case "video": return [
          { id: "veo", label: "Veo", description: "Google DeepMind Veo" }, 
          { id: "sora", label: "Sora", description: "OpenAI Sora" }
      ];
      default: return GENERAL_TARGET_MODELS;
    }
  };

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-amber-500/30 overflow-hidden">
      
      {showWelcome && <WelcomeGuide onClose={closeWelcome} />}
      
      {/* Toast Notification */}
      {toastMessage && (
         <div className="fixed bottom-6 right-6 bg-green-500 text-black px-4 py-3 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.4)] z-50 animate-bounce flex items-center gap-3 font-bold text-sm border border-green-400">
            <div className="bg-black/20 p-1 rounded-full">
              <CheckIcon className="w-4 h-4" /> 
            </div>
            {toastMessage}
         </div>
      )}

      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} bg-neutral-900 border-r border-neutral-800 transition-all duration-300 flex flex-col overflow-hidden relative z-40`}>
        <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
          <h2 className="font-bold text-amber-500 flex items-center gap-2">
            <BookmarkIcon className="w-5 h-5" filled /> Library
          </h2>
          <button onClick={() => setShowSidebar(false)} className="text-neutral-500 hover:text-neutral-300">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Tabs */}
        <div className="flex border-b border-neutral-800">
          {(['history', 'saved', 'templates'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setSidebarTab(tab)}
              className={`flex-1 py-3 text-xs font-medium uppercase tracking-wider ${
                sidebarTab === tab 
                  ? 'text-amber-500 border-b-2 border-amber-500 bg-neutral-800/50' 
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="p-4 border-b border-neutral-800">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2 pl-9 pr-3 text-sm text-neutral-300 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {sidebarTab === 'history' && history.filter(i => i.originalPrompt?.toLowerCase().includes(searchQuery.toLowerCase() || "")).map(item => (
             <div key={item.id} onClick={() => loadHistoryItem(item)} className="p-3 rounded-lg hover:bg-neutral-800 cursor-pointer group transition-colors">
                <div className="flex justify-between items-start mb-1">
                   <span className="text-xs text-amber-500 font-mono uppercase">{item.domain}</span>
                   <button onClick={(e) => deleteHistoryItem(e, item.id)} className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-red-500 transition-opacity">
                     <TrashIcon className="w-3 h-3" />
                   </button>
                </div>
                <p className="text-sm text-neutral-300 line-clamp-2">{item.originalPrompt}</p>
                <span className="text-xs text-neutral-600 mt-2 block">{new Date(item.timestamp).toLocaleDateString()}</span>
             </div>
          ))}
          {sidebarTab === 'saved' && savedPrompts.filter(i => i.originalPrompt?.toLowerCase().includes(searchQuery.toLowerCase() || "")).map(item => (
             <div key={item.id} onClick={() => loadHistoryItem(item)} className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 cursor-pointer group transition-all">
                <div className="flex justify-between items-start mb-1">
                   <span className="text-xs text-amber-500 font-mono uppercase">{item.domain}</span>
                   <button onClick={(e) => removeFromSaved(e, item.id)} className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-red-500 transition-opacity">
                     <TrashIcon className="w-3 h-3" />
                   </button>
                </div>
                <p className="text-sm text-neutral-300 line-clamp-2">{item.result.optimizedPrompt}</p>
             </div>
          ))}
           {sidebarTab === 'templates' && templates.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase() || "")).map(item => (
             <div key={item.id} onClick={() => loadTemplate(item)} className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 cursor-pointer group transition-all relative">
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={(e) => deleteTemplate(e, item.id)} className="text-neutral-600 hover:text-red-500 p-1">
                     <TrashIcon className="w-3.5 h-3.5" />
                   </button>
                </div>
                <div className="flex justify-between items-start mb-1 pr-6">
                   <span className="text-sm font-bold text-amber-500 group-hover:text-amber-400 transition-colors">{item.name}</span>
                </div>
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2 bg-neutral-950 inline-block px-1.5 py-0.5 rounded border border-neutral-800">{item.category}</p>
                <p className="text-xs text-neutral-400 line-clamp-2 font-mono bg-neutral-950/50 p-2 rounded border border-neutral-800/50 group-hover:border-neutral-700 transition-colors">{item.content}</p>
             </div>
          ))}
          {sidebarTab === 'history' && history.length === 0 && <div className="text-center text-neutral-600 py-8 text-sm">No history yet</div>}
        </div>
        {sidebarTab === 'history' && history.length > 0 && (
          <div className="p-4 border-t border-neutral-800">
            <button onClick={clearHistory} className="w-full py-2 text-xs text-red-500 hover:text-red-400 hover:bg-red-950/30 rounded flex items-center justify-center gap-2">
              <TrashIcon className="w-3 h-3" /> Clear History
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative w-full">
        <header className="h-16 border-b border-neutral-800 flex items-center justify-between px-6 bg-neutral-950/80 backdrop-blur z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setShowSidebar(!showSidebar)} className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors">
               <LayoutIcon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-600">PromptRefine AI</h1>
              <p className="text-xs text-neutral-500 hidden sm:block">Professional Prompt Engineering Station</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => setShowWelcome(true)} className="p-2 text-neutral-500 hover:text-white transition-colors">
                <HelpIcon className="w-5 h-5" />
             </button>
             <div className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                API Ready
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
           <div className="max-w-4xl mx-auto space-y-8 pb-20">
              
              {/* Step 1: Domain & Model */}
              <div className="space-y-4">
                 <div className="flex items-center gap-2 text-sm font-medium text-neutral-400">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-800 text-xs">1</span>
                    SELECT DOMAIN & MODEL
                 </div>
                 
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {DOMAINS.map(domain => (
                       <button
                         key={domain.id}
                         onClick={() => setSelectedDomain(domain.id)}
                         className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-200 ${
                            selectedDomain === domain.id 
                            ? 'bg-amber-500/10 border-amber-500/50 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]' 
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:border-neutral-700'
                         }`}
                       >
                         {domain.icon}
                         <span className="text-xs font-medium">{domain.label}</span>
                       </button>
                    ))}
                 </div>

                 <div className="bg-neutral-900/50 p-4 rounded-xl border border-neutral-800 flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 w-full">
                       <label className="block text-xs text-neutral-500 mb-1.5 uppercase tracking-wide">Target Model</label>
                       <div className="relative">
                          <select 
                            value={selectedModel} 
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="w-full appearance-none bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                          >
                             {getModelOptions().map(m => (
                                <option key={m.id} value={m.id}>{m.label}</option>
                             ))}
                          </select>
                          <div className="absolute right-3 top-3 pointer-events-none text-neutral-500">
                             <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor"><path d="M1 1L5 5L9 1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                       </div>
                    </div>
                    <div className="w-full md:w-auto text-xs text-neutral-500 border-l border-neutral-800 pl-4 py-1">
                       <div className="font-medium text-neutral-300 mb-1">Model Info</div>
                       {getModelOptions().find(m => m.id === selectedModel)?.description || "Select a model"}
                    </div>
                 </div>
              </div>

              {/* Step 2: Input */}
              <div className="space-y-4">
                 <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2 text-sm font-medium text-neutral-400">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-800 text-xs">2</span>
                        INPUT {isReverseMode ? "IMAGE" : "DRAFT"}
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                             onClick={() => setUserInput("")}
                             className="text-xs text-neutral-600 hover:text-red-500 transition-colors mr-2"
                             hidden={!userInput}
                        >
                            Clear Input
                        </button>
                         {selectedDomain === 'image' && (
                            <button 
                              onClick={() => setIsReverseMode(!isReverseMode)}
                              className="text-xs flex items-center gap-1.5 text-amber-500 hover:text-amber-400 transition-colors"
                            >
                               <UploadIcon className="w-3 h-3" />
                               {isReverseMode ? "Switch to Text Mode" : "Switch to Reverse Engineer"}
                            </button>
                        )}
                    </div>
                 </div>

                 <div className="relative group">
                    <div className={`absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500 ${isOptimizing ? 'opacity-50 animate-pulse' : ''}`}></div>
                    <div className="relative bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
                       {isReverseMode ? (
                          <div 
                             onClick={() => fileInputRef.current?.click()}
                             className="h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-800/50 transition-colors"
                          >
                             {uploadedImage ? (
                                <img src={uploadedImage} alt="Upload" className="h-full w-full object-contain p-2" />
                             ) : (
                                <>
                                   <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 mb-3 group-hover:scale-110 transition-transform">
                                      <UploadIcon className="w-6 h-6" />
                                   </div>
                                   <p className="text-sm text-neutral-300 font-medium">Click to upload reference image</p>
                                   <p className="text-xs text-neutral-500 mt-1">JPEG, PNG supported</p>
                                </>
                             )}
                             <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                          </div>
                       ) : (
                          <textarea
                             value={userInput}
                             onChange={(e) => setUserInput(e.target.value)}
                             placeholder={
                                selectedDomain === 'coding' ? "Paste your broken code or describe the feature logic..." :
                                selectedDomain === 'image' ? "A cat sitting on a neon roof..." :
                                "Describe your idea broadly..."
                             }
                             className="w-full h-40 bg-transparent p-4 text-base placeholder-neutral-600 focus:outline-none resize-none"
                          />
                       )}
                       
                       <div className="p-3 bg-neutral-950/30 border-t border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-3">
                          {/* Advanced Toggles - Improved UI */}
                          <div className="flex items-center gap-3">
                             <button 
                                onClick={() => setUseThinking(!useThinking)}
                                className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-all border ${
                                    useThinking 
                                    ? 'bg-purple-900/50 text-purple-200 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]' 
                                    : 'bg-neutral-800/50 text-neutral-500 border-neutral-700 hover:border-neutral-600'
                                }`}
                             >
                                <BrainIcon className="w-3 h-3" /> Deep Reasoning
                             </button>
                             <button 
                                onClick={() => setUseGrounding(!useGrounding)}
                                className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-all border ${
                                    useGrounding 
                                    ? 'bg-blue-900/50 text-blue-200 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]' 
                                    : 'bg-neutral-800/50 text-neutral-500 border-neutral-700 hover:border-neutral-600'
                                }`}
                             >
                                <GlobeIcon className="w-3 h-3" /> Search Grounding
                             </button>
                          </div>

                          <button
                             onClick={isReverseMode ? handleReverseEngineer : handleOptimize}
                             disabled={isOptimizing || isAnalyzing || (!userInput.trim() && !uploadedImage)}
                             className={`
                                flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-sm transition-all shadow-lg w-full sm:w-auto justify-center
                                ${isOptimizing || isAnalyzing 
                                   ? 'bg-neutral-800 text-neutral-400 cursor-wait' 
                                   : 'bg-amber-500 hover:bg-amber-400 text-black hover:shadow-amber-500/20'
                                }
                             `}
                          >
                             {isOptimizing || isAnalyzing ? (
                                <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> Processing...</>
                             ) : (
                                <><SparklesIcon className="w-4 h-4" /> {isReverseMode ? "Analyze & Reverse" : "Refine Prompt"}</>
                             )}
                          </button>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Step 3: Result */}
              {result && (
                  <div className="space-y-6 animate-fade-in">
                      <div className="flex items-center gap-2 text-sm font-medium text-neutral-400">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 text-xs">3</span>
                          <span className="text-amber-500">OPTIMIZATION RESULT</span>
                      </div>

                      <div className="bg-neutral-900 border border-amber-500/30 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.05)]">
                          <div className="flex border-b border-neutral-800 bg-neutral-800/30">
                              <div className="flex-1 p-3 text-xs font-mono text-neutral-500 uppercase tracking-widest pl-6">
                                  {selectedModel} OUTPUT
                              </div>
                              <div className="flex divide-x divide-neutral-800">
                                  <button 
                                     onClick={handleTTS}
                                     disabled={isPlayingAudio}
                                     className={`p-3 hover:bg-neutral-800 transition-colors flex items-center gap-2 text-xs font-medium ${isPlayingAudio ? 'text-amber-500 animate-pulse' : 'text-neutral-400 hover:text-white'}`}
                                  >
                                      <SpeakerIcon className="w-4 h-4" />
                                      {isPlayingAudio ? "PLAYING..." : "LISTEN"}
                                  </button>
                                  <button onClick={handleCopy} className="p-3 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-medium">
                                      {copyStatus ? <CheckIcon className="w-4 h-4 text-green-500" /> : <CopyIcon className="w-4 h-4" />}
                                      {copyStatus ? "COPIED" : "COPY"}
                                  </button>
                                  <button onClick={handleSavePrompt} className={`p-3 hover:bg-neutral-800 transition-colors flex items-center gap-2 text-xs font-medium ${saveStatus ? 'text-green-500' : 'text-neutral-400 hover:text-white'}`}>
                                      <BookmarkIcon className="w-4 h-4" filled={saveStatus} />
                                      {saveStatus ? "SAVED" : "SAVE"}
                                  </button>
                                  <button onClick={() => openSaveTemplateModal(result.optimizedPrompt)} className="p-3 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-medium">
                                      <TagIcon className="w-4 h-4" />
                                      TEMPLATE
                                  </button>
                              </div>
                          </div>
                          
                          <div className="p-6">
                             <div className="font-mono text-sm leading-relaxed text-neutral-200 whitespace-pre-wrap">
                                 {result.optimizedPrompt}
                             </div>
                             
                             {/* --- Image Generation Preview Section --- */}
                             {selectedDomain === 'image' && (
                                <div className="mt-8 pt-6 border-t border-neutral-800">
                                   <div className="flex items-center justify-between mb-4">
                                       <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Visual Verification</h4>
                                       {!generatedImage && !isGeneratingImage && (
                                          <button 
                                            onClick={handleGenerateImage}
                                            className="text-xs flex items-center gap-2 text-amber-500 hover:text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-lg hover:bg-amber-500/10 transition-colors"
                                          >
                                             <SparklesIcon className="w-3 h-3" /> Generate Preview (Gemini)
                                          </button>
                                       )}
                                   </div>
                                   
                                   {isGeneratingImage && (
                                      <div className="h-64 bg-neutral-950 rounded-lg border border-neutral-800 flex flex-col items-center justify-center gap-3 animate-pulse">
                                         <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                                         <p className="text-xs text-neutral-500 font-mono">RENDERING PREVIEW...</p>
                                      </div>
                                   )}
                                   
                                   {generatedImage && (
                                      <div className="relative group bg-neutral-950 rounded-lg overflow-hidden border border-neutral-800">
                                          <img src={generatedImage} alt="Generated Preview" className="w-full h-auto max-h-[500px] object-contain" />
                                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                             <a href={generatedImage} download="prompt-preview.png" className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform">
                                                <DownloadIcon className="w-5 h-5" />
                                             </a>
                                             <button onClick={handleGenerateImage} className="p-3 bg-neutral-800 text-white rounded-full hover:scale-110 transition-transform">
                                                <RefreshIcon className="w-5 h-5" />
                                             </button>
                                          </div>
                                      </div>
                                   )}
                                </div>
                             )}

                             {/* --- Video Generation Preview Section (VEO) --- */}
                             {selectedDomain === 'video' && (
                                <div className="mt-8 pt-6 border-t border-neutral-800">
                                   <div className="flex items-center justify-between mb-4">
                                       <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Veo Simulation</h4>
                                       {!generatedVideo && !isGeneratingVideo && (
                                          <button 
                                            onClick={handleGenerateVideo}
                                            className="text-xs flex items-center gap-2 text-green-500 hover:text-green-400 border border-green-500/30 px-3 py-1.5 rounded-lg hover:bg-green-500/10 transition-colors"
                                          >
                                             <VideoIcon className="w-3 h-3" /> Generate Video (Veo)
                                          </button>
                                       )}
                                   </div>
                                   
                                   {isGeneratingVideo && (
                                      <div className="h-64 bg-neutral-950 rounded-lg border border-neutral-800 flex flex-col items-center justify-center gap-3 animate-pulse">
                                         <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                         <p className="text-xs text-neutral-500 font-mono uppercase">{videoProgress || "Initializing..."}</p>
                                      </div>
                                   )}
                                   
                                   {generatedVideo && (
                                      <div className="relative group bg-neutral-950 rounded-lg overflow-hidden border border-neutral-800">
                                          <video controls src={generatedVideo} className="w-full h-auto max-h-[500px] rounded-lg" />
                                          <div className="p-3 flex justify-end">
                                             <a href={generatedVideo} download="veo-preview.mp4" className="text-xs flex items-center gap-2 text-green-500 hover:text-white">
                                                <DownloadIcon className="w-4 h-4" /> Download MP4
                                             </a>
                                          </div>
                                      </div>
                                   )}
                                </div>
                             )}

                             {/* --- Text Simulation Section (New) --- */}
                             {(selectedDomain !== 'image' && selectedDomain !== 'video') && (
                                <div className="mt-8 pt-6 border-t border-neutral-800">
                                   <div className="flex items-center justify-between mb-4">
                                      <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Simulation Loop</h4>
                                      <button 
                                        onClick={handleGenerateText}
                                        disabled={isGeneratingText}
                                        className="text-xs flex items-center gap-2 text-blue-400 hover:text-blue-300 border border-blue-500/30 px-3 py-1.5 rounded-lg hover:bg-blue-500/10 transition-colors"
                                      >
                                         {isGeneratingText ? <span className="animate-spin">⟳</span> : <PlayIcon className="w-3 h-3" />}
                                         {isGeneratingText ? "Running..." : "Run Simulation (Gemini)"}
                                      </button>
                                   </div>

                                   {generatedText && (
                                       <div className="bg-neutral-950 rounded-lg border border-neutral-800 p-4 relative animate-fade-in">
                                           <div className="absolute top-0 left-0 px-2 py-1 bg-neutral-800 rounded-br text-[10px] text-neutral-400 font-mono">OUTPUT</div>
                                           <div className="mt-4 text-sm text-neutral-300 whitespace-pre-wrap font-mono max-h-60 overflow-y-auto custom-scrollbar">
                                               {generatedText}
                                           </div>
                                       </div>
                                   )}
                                </div>
                             )}
                          </div>

                          <div className="bg-neutral-950/50 p-6 border-t border-neutral-800">
                              <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Analysis & Strategy</h4>
                              <div className="prose prose-invert prose-sm max-w-none text-neutral-400">
                                  <p className="whitespace-pre-wrap">{result.explanation}</p>
                              </div>
                              
                              <div className="mt-6 flex flex-wrap gap-2">
                                  {result.addedTerms.map((term, i) => (
                                      <span key={i} className="px-2 py-1 rounded bg-neutral-800 border border-neutral-700 text-xs text-neutral-400 font-mono">
                                          {term}
                                      </span>
                                  ))}
                              </div>
                          </div>
                      </div>

                      {/* Assessment Section (Redesigned) */}
                      {!assessment ? (
                         <div className="border border-neutral-800 rounded-xl p-6 bg-neutral-900/50 flex flex-col items-center justify-center text-center space-y-4">
                             <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-500">
                                <TrendingUpIcon className="w-6 h-6" />
                             </div>
                             <div>
                                <h4 className="text-sm font-bold text-neutral-300">Commercial Viability Scan</h4>
                                <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">Analyze market potential, replicability, and monetization channels for this prompt.</p>
                             </div>
                             <button 
                               onClick={handleAssessValue} 
                               disabled={isAssessing}
                               className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 hover:text-white text-neutral-400 text-xs font-bold tracking-wider rounded-lg transition-all border border-neutral-700 flex items-center gap-2"
                             >
                                {isAssessing ? <span className="animate-pulse">SCANNING...</span> : "RUN DIAGNOSTIC"}
                             </button>
                         </div>
                      ) : (
                         <div className="relative overflow-hidden rounded-xl border border-emerald-500/30 bg-black shadow-[0_0_40px_rgba(16,185,129,0.1)] animate-fade-in group">
                            {/* Decorative Cyberpunk Elements */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
                            <div className="absolute top-0 right-0 p-2 opacity-50">
                               <div className="flex gap-1">
                                  <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                                  <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse delay-75"></div>
                                  <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse delay-150"></div>
                               </div>
                            </div>
                            
                            {/* Header */}
                            <div className="bg-emerald-950/20 border-b border-emerald-500/20 p-4 flex justify-between items-center">
                               <h4 className="text-xs font-bold text-emerald-400 tracking-[0.2em] flex items-center gap-2">
                                  <div className="w-2 h-2 bg-emerald-500 rotate-45"></div>
                                  MARKET_VALUE_DIAGNOSTIC
                               </h4>
                               <span className="text-[10px] font-mono text-emerald-600/70">SYS.READY</span>
                            </div>

                            <div className="p-6 grid md:grid-cols-3 gap-8">
                               {/* Score Column */}
                               <div className="flex flex-col items-center justify-center text-center relative">
                                  <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                                     <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="45" fill="none" stroke="#064e3b" strokeWidth="8" />
                                        <circle 
                                          cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="8" 
                                          strokeDasharray={`${assessment.score * 2.83} 283`}
                                          className="transition-all duration-1000 ease-out"
                                        />
                                     </svg>
                                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-bold text-white font-mono">{assessment.score}</span>
                                        <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Index</span>
                                     </div>
                                  </div>
                                  <div className={`px-3 py-1 rounded-sm text-xs font-bold border ${assessment.score > 80 ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-yellow-500 text-yellow-500 bg-yellow-500/10'}`}>
                                     {assessment.commercialValue?.toUpperCase() || "UNKNOWN"} POTENTIAL
                                  </div>
                               </div>

                               {/* Details Column */}
                               <div className="md:col-span-2 space-y-5">
                                  <div>
                                     <p className="text-[10px] text-emerald-600 font-bold uppercase mb-1">Target Sector</p>
                                     <div className="flex flex-wrap gap-2">
                                        {assessment.targetAudience.map(a => (
                                           <span key={a} className="px-2 py-1 bg-emerald-900/30 border border-emerald-500/30 text-emerald-300 text-xs font-mono rounded-sm">
                                              [{a}]
                                           </span>
                                        ))}
                                     </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                     <div>
                                        <p className="text-[10px] text-emerald-600 font-bold uppercase mb-1">Monetization Channels</p>
                                        <ul className="space-y-1">
                                           {assessment.monetizationChannels.slice(0, 3).map(c => (
                                              <li key={c} className="text-xs text-neutral-300 flex items-center gap-2">
                                                 <span className="w-1 h-1 bg-emerald-500"></span> {c}
                                              </li>
                                           ))}
                                        </ul>
                                     </div>
                                     <div>
                                        <p className="text-[10px] text-emerald-600 font-bold uppercase mb-1">Risk Assessment</p>
                                        <ul className="space-y-1">
                                           {assessment.riskFactors.slice(0, 2).map(r => (
                                              <li key={r} className="text-xs text-neutral-400 flex items-center gap-2">
                                                 <span className="text-red-500">⚠</span> {r}
                                              </li>
                                           ))}
                                        </ul>
                                     </div>
                                  </div>
                                  
                                  <div className="pt-3 border-t border-neutral-800">
                                     <p className="text-sm text-neutral-300 italic">"{assessment.reasoning}"</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in">
              <h3 className="text-lg font-bold text-white mb-4">Save as Template</h3>
              <div className="space-y-4">
                 <div>
                    <label className="block text-xs text-neutral-500 mb-1">Template Name <span className="text-red-500">*</span></label>
                    <input 
                      autoFocus
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                      value={newTemplateName}
                      onChange={e => setNewTemplateName(e.target.value)}
                      placeholder="My Super Prompt"
                    />
                 </div>
                 <div>
                    <label className="block text-xs text-neutral-500 mb-1">Category</label>
                    <input 
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                      value={newTemplateCategory}
                      onChange={e => setNewTemplateCategory(e.target.value)}
                      placeholder="e.g. Marketing, Coding, Art"
                    />
                 </div>
                 <div>
                    <label className="block text-xs text-neutral-500 mb-1">Content <span className="text-red-500">*</span></label>
                    <textarea 
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-300 font-mono h-24 focus:border-amber-500 focus:outline-none resize-none"
                      value={templateContentToSave}
                      onChange={e => setTemplateContentToSave(e.target.value)}
                    />
                 </div>
                 
                 {templateError && (
                    <div className="text-xs text-red-500 bg-red-950/20 p-2 rounded border border-red-500/20 flex items-center gap-2">
                       <AlertIcon className="w-3 h-3" /> {templateError}
                    </div>
                 )}

                 <div className="flex gap-3 mt-6">
                    <button onClick={() => setIsTemplateModalOpen(false)} className="flex-1 py-2.5 rounded-lg border border-neutral-800 text-neutral-400 hover:bg-neutral-800 transition-colors text-sm">Cancel</button>
                    <button onClick={confirmSaveTemplate} className="flex-1 py-2.5 rounded-lg bg-amber-500 text-black font-medium hover:bg-amber-400 transition-colors text-sm">Save Template</button>
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
