import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { GoogleGenAI, Type } from "@google/genai";

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
    { id: "gpt-5.1", label: "GPT-5.1", description: "Best for structured reasoning (RRCTOF)" },
    { id: "grok-4.1", label: "Grok-4.1", description: "Best for wit, directness & real-time edge" },
    { id: "claude-4.5-sonnet", label: "Claude-4.5 Sonnet", description: "Best for nuance & XML-structured tasks" },
];

const IMAGE_TARGET_MODELS = [
    { id: "nano-banana-pro", label: "Nano Banana Pro", description: "Gemini 3. Narrative, 4K, Chinese/English Text." },
    { id: "midjourney", label: "Midjourney", description: "Artistic. Use --v 7, --ar, stylized weights." },
    { id: "stable-diffusion", label: "Stable Diffusion", description: "Tag-based, precise weighting (keyword:1.2)." },
    { id: "seedream-4.0", label: "Seedream 4.0", description: "High aesthetic, golden ratio, lighting mastery." },
];

const WRITING_TARGET_MODELS = [
    { id: "gemini-3", label: "Gemini 3", description: "Expansive creativity, long-context flow." },
    { id: "claude-4.5-sonnet", label: "Claude 4.5 Sonnet", description: "Nuanced, high-level vocabulary, 'human' tone." },
    { id: "qwen3-max-thinking", label: "Qwen3-Max-Thinking", description: "Deep narrative reasoning & complex plots." },
    { id: "ernie-5.0", label: "文心 5.0 (Ernie)", description: "Top Chinese literary style & cultural depth." },
];

// --- Types ---
type OptimizationResult = {
  optimizedPrompt: string;
  explanation: string;
  addedTerms: string[];
};

type HistoryItem = {
  id: string;
  timestamp: number;
  originalPrompt: string;
  domain: string;
  model?: string;
  result: OptimizationResult;
};

// --- Components ---

const App = () => {
  const [userInput, setUserInput] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("image");
  const [selectedModel, setSelectedModel] = useState("nano-banana-pro");
  
  // Logic States
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  
  // Preview States
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [isGeneratingText, setIsGeneratingText] = useState(false);

  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState("");

  const [copyStatus, setCopyStatus] = useState(false);
  
  // History States
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
        const saved = localStorage.getItem("promptRefineHistory");
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
  });
  const [showHistory, setShowHistory] = useState(false);

  // Reset model selection when domain changes to ensure valid model
  useEffect(() => {
    if (selectedDomain === 'general') {
        setSelectedModel('gemini-3-pro');
    } else if (selectedDomain === 'image') {
        setSelectedModel('nano-banana-pro');
    } else if (selectedDomain === 'writing') {
        setSelectedModel('gemini-3');
    } else {
        setSelectedModel(''); // Other domains don't have explicit model selectors yet
    }
  }, [selectedDomain]);

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
    setUserInput(item.originalPrompt);
    setSelectedDomain(item.domain);
    if (item.model) setSelectedModel(item.model);
    setResult(item.result);
    // Reset generation states as they are not stored
    setGeneratedImage(null);
    setGeneratedText(null);
    setGeneratedVideo(null);
    setShowHistory(false);
  };

  const handleOptimize = async () => {
    if (!userInput.trim()) return;
    setIsOptimizing(true);
    setResult(null);
    setGeneratedImage(null);
    setGeneratedText(null);
    setGeneratedVideo(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const model = "gemini-3-pro-preview"; 

      // Integrated PDF Knowledge into System Instruction
      const systemInstruction = `
        You are an expert Prompt Engineer and Domain Specialist.
        Your goal is to take a user's vague or non-technical idea and rewrite it into a highly effective, professional prompt suitable for top-tier LLMs or Generative Models.

        CRITICAL ROUTING LOGIC (BASED ON SELECTED MODEL & DOMAIN):
        
        === GENERAL ASSISTANT MODELS ===
        IF TARGET MODEL IS **GEMINI 3 PRO**:
           - **Strategy**: Capitalize on "Entropy Eater" capabilities.
           - **Framework**: Apply the **C.L.E.A.R. Framework**.
             - **C**ontext: Define background at TOP.
             - **L**ength: Specify output length.
             - **E**xamples: Include 1-2 examples.
             - **A**udience: Define who is reading.
             - **R**esponse Format: Specify format.
           - **Advanced**: Use "Think Out Loud" or "Self-Critique Loop".

        IF TARGET MODEL IS **GPT-5.1**:
           - **Strategy**: Treat as "Cognitive Engine".
           - **Framework**: **RRCTOF Framework** (Role, Reasoning, Context, Task, Output, Follow-up).
           - **Advanced**: Explicitly mention tool usage.

        IF TARGET MODEL IS **GROK-4.1**:
           - **Strategy**: "Unfiltered Wit", "Real-time Directness". Remove corporate jargon. Be brutally honest.

        IF TARGET MODEL IS **CLAUDE-4.5 SONNET**:
           - **Strategy**: "Nuance", **XML-Structured Inputs** (<context>, <task>).

        === IMAGE GENERATION MODELS ===
        IF TARGET MODEL IS **NANO BANANA PRO** (Gemini 3 Pro Image):
           - **Strategy**: Use the "Universal Formula": [Subject] + [Style] + [Aspect Ratio].
           - **Description Style**: Narrative, not just tags. Describe the scene naturally.
           - **Parameters**: Use professional camera terms: 85mm lens, f/1.8 aperture (for portraits), f/16 (landscapes), Golden Hour.
           - **Text Rendering**: If user wants text, put it in quotes: 'with text "HELLO"'.
           - **Advanced**: Mention "Impossible Geometry" or "Recursive UI" if relevant.

        IF TARGET MODEL IS **MIDJOURNEY**:
           - **Strategy**: Evocative, poetic phrases.
           - **Parameters**: Append parameters like --ar 16:9, --stylize 250, --v 7, --style raw.
           - **Structure**: Subject, medium, environment, lighting, mood, composition.

        IF TARGET MODEL IS **STABLE DIFFUSION**:
           - **Strategy**: Tag-based, comma-separated.
           - **Weighting**: Use parentheses for emphasis, e.g., (masterpiece:1.2), (best quality).
           - **Structure**: Subject tags, style tags, lighting tags.
           - **Negative Prompt**: Suggest negative embeddings in explanation.

        IF TARGET MODEL IS **SEEDREAM 4.0**:
           - **Strategy**: High aesthetic quality, mastery of lighting and composition.
           - **Key Concepts**: Rule of Thirds, Golden Ratio, Leading Lines, Contrast.
           - **Vibe**: Dreamy, atmospheric, polished, "Tyndall effect", "volumetric lighting".

        === WRITING MODELS ===
        IF TARGET MODEL IS **GEMINI 3**:
           - **Strategy**: Creative expanse, long-context coherence. Use "C.L.E.A.R." adapted for narrative.
           - **Tone**: Imaginative, flowing, avoiding repetition.

        IF TARGET MODEL IS **CLAUDE 4.5 SONNET**:
           - **Strategy**: "Show, Don't Tell".
           - **Tone**: Sophisticated, nuanced, human-like, high vocabulary range.
           - **Structure**: Use distinct sections or XML outlining for long form.

        IF TARGET MODEL IS **QWEN3-MAX-THINKING**:
           - **Strategy**: Deep reasoning in plot construction. "Chain of Thought" applied to narrative arcs.
           - **Depth**: Logical character motivations, complex plot twists, Chinese idiom usage if relevant.

        IF TARGET MODEL IS **文心 5.0 (ERNIE)**:
           - **Strategy**: Chinese Literary Excellence.
           - **Style**: Classical references, culturally resonant metaphors, strict format adherence.

        === OTHER DOMAINS ===
        IF NO SPECIFIC MODEL SELECTED:
           - Use general best practices: Clarity, Context, Structure.

        OUTPUT SCHEMA:
        Return ONLY a JSON object:
        {
          "optimizedPrompt": "The rewritten, detailed prompt.",
          "explanation": "Explain your changes and WHICH framework/model strategy you used.",
          "addedTerms": ["List", "Of", "Key", "Terms", "Added"]
        }
      `;

      // Construct the prompt based on whether user selected specific model logic
      const targetModelInstruction = (selectedDomain === 'general' || selectedDomain === 'image' || selectedDomain === 'writing')
        ? `Target Model Optimization: ${selectedModel}` 
        : `Target Domain: ${selectedDomain}`;

      const prompt = `
        User Input: "${userInput}"
        ${targetModelInstruction}
        
        Please refine this prompt according to the system instructions for the specific target model or domain.
      `;

      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    optimizedPrompt: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    addedTerms: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["optimizedPrompt", "explanation"]
            }
        }
      });

      const jsonText = response.text;
      if (jsonText) {
        const parsedData = JSON.parse(jsonText) as OptimizationResult;
        if (!parsedData.addedTerms) parsedData.addedTerms = [];
        
        addToHistory(userInput, selectedDomain, parsedData, (selectedDomain === 'general' || selectedDomain === 'image' || selectedDomain === 'writing') ? selectedModel : undefined);
        setResult(parsedData);
      }
    } catch (error) {
      console.error("Optimization failed:", error);
      alert("Failed to optimize prompt. Please try again.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!result?.optimizedPrompt) return;
    setIsGeneratingImage(true);

    try {
      await ensureApiKey();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = "gemini-3-pro-image-preview"; // Nano Banana Pro

      const response = await ai.models.generateContent({
        model: model,
        contents: {
            parts: [{ text: result.optimizedPrompt }]
        },
        config: {
            imageConfig: {
                aspectRatio: "16:9",
                imageSize: "1K"
            }
        }
      });

      let foundImage = false;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
              const base64Str = part.inlineData.data;
              setGeneratedImage(`data:image/png;base64,${base64Str}`);
              foundImage = true;
              break;
          }
      }
      
      if (!foundImage) {
           const textPart = response.candidates?.[0]?.content?.parts?.find(p => p.text);
           if(textPart) alert(`Could not generate image: ${textPart.text}`);
      }

    } catch (error) {
      console.error("Image generation failed:", error);
      alert("Image generation failed. Please check your API key and try again.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!result?.optimizedPrompt) return;
    setIsGeneratingVideo(true);
    setVideoProgress("Initializing Veo...");

    try {
        await ensureApiKey();
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: result.optimizedPrompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9'
            }
        });

        setVideoProgress("Render in progress (Veo)...");
        
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            operation = await ai.operations.getVideosOperation({operation: operation});
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (downloadLink) {
            const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setGeneratedVideo(url);
        } else {
            alert("Video generation completed but no URI was returned.");
        }

    } catch (e) {
        console.error(e);
        alert("Failed to generate video.");
    } finally {
        setIsGeneratingVideo(false);
        setVideoProgress("");
    }
  };

  const handleGenerateTextPreview = async () => {
    if (!result?.optimizedPrompt) return;
    setIsGeneratingText(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: result.optimizedPrompt,
        });
        setGeneratedText(response.text || "No text generated.");
    } catch (e) {
        console.error(e);
        alert("Failed to generate text preview.");
    } finally {
        setIsGeneratingText(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.optimizedPrompt);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  const getPlaceholder = () => {
    switch (selectedDomain) {
      case "image": return "e.g., A cyberpunk city in the rain, but I want it to look like an old oil painting...";
      case "video": return "e.g., A cinematic drone shot of a futuristic Tokyo at night, fast paced...";
      case "writing": return "e.g., Write a polite but firm email to a client who hasn't paid their invoice yet...";
      case "coding": return "e.g., I want a website for my bakery with a contact form and a gallery...";
      case "general": return "e.g., Explain quantum physics to a 5 year old...";
      default: return "e.g., Help me plan a trip to Japan...";
    }
  };

  const getDomainIcon = (id: string) => {
      const domain = DOMAINS.find(d => d.id === id);
      return domain ? domain.icon : <SparklesIcon className="w-4 h-4"/>;
  };
  
  const getActiveModels = () => {
      if (selectedDomain === 'general') return GENERAL_TARGET_MODELS;
      if (selectedDomain === 'image') return IMAGE_TARGET_MODELS;
      if (selectedDomain === 'writing') return WRITING_TARGET_MODELS;
      return [];
  };
  
  const activeModels = getActiveModels();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-200 relative overflow-x-hidden font-sans">
      {/* Header */}
      <header className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-10 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 text-neutral-950 p-1.5 rounded-lg shadow-amber-500/20 shadow-lg">
              <SparklesIcon className="w-5 h-5" />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-white">
              PromptRefine AI
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setShowHistory(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-neutral-400 hover:text-amber-500 hover:bg-neutral-800 rounded-lg transition-colors"
             >
                <ClockIcon className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT COLUMN: INPUT */}
        <section className="flex flex-col gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Transform your ideas
            </h2>
            <p className="text-neutral-400">
              Select a domain and describe your thought. We'll engineer the perfect technical prompt for you.
            </p>
          </div>

          <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-xl space-y-6">
            {/* Domain Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                1. Target Domain
              </label>
              <div className="grid grid-cols-1 gap-3">
                {DOMAINS.map((domain) => (
                  <button
                    key={domain.id}
                    onClick={() => setSelectedDomain(domain.id)}
                    className={`group flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-200 ${
                      selectedDomain === domain.id
                        ? "border-amber-500 bg-amber-500/10 shadow-[0_0_15px_-3px_rgba(245,158,11,0.2)]"
                        : "border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800"
                    }`}
                  >
                    <div
                      className={`mt-0.5 p-2 rounded-lg transition-colors ${
                        selectedDomain === domain.id
                          ? "bg-amber-500 text-neutral-950"
                          : "bg-neutral-800 text-neutral-500 group-hover:text-neutral-300"
                      }`}
                    >
                      {domain.icon}
                    </div>
                    <div>
                      <div className={`font-semibold ${selectedDomain === domain.id ? 'text-amber-500' : 'text-neutral-200'}`}>
                        {domain.label}
                      </div>
                      <div className="text-sm text-neutral-500 mt-0.5">
                        {domain.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Model Selection (For General, Image, Writing) */}
            {activeModels.length > 0 && (
                <div className="space-y-3 fade-in">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                         <ChipIcon className="w-3 h-3"/> 1.1 Target Model (Optimization Strategy)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                         {activeModels.map((model) => (
                             <button
                                key={model.id}
                                onClick={() => setSelectedModel(model.id)}
                                className={`p-3 rounded-lg border text-left text-sm transition-all ${
                                    selectedModel === model.id
                                    ? "border-amber-500 bg-amber-500/5 text-amber-500"
                                    : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700"
                                }`}
                             >
                                <div className="font-bold">{model.label}</div>
                                <div className="text-xs opacity-70 mt-1">{model.description}</div>
                             </button>
                         ))}
                    </div>
                </div>
            )}

            {/* Text Input */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                2. Raw Input
              </label>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={getPlaceholder()}
                className="w-full h-40 p-4 rounded-xl border border-neutral-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none resize-none text-base bg-neutral-950 text-neutral-200 placeholder-neutral-600 transition-all"
              />
            </div>

            {/* Action Button */}
            <button
              onClick={handleOptimize}
              disabled={isOptimizing || !userInput.trim()}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all ${
                isOptimizing || !userInput.trim()
                  ? "bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700"
                  : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 hover:shadow-amber-500/25 hover:shadow-xl active:scale-[0.98]"
              }`}
            >
              {isOptimizing ? (
                <>
                  <div className="w-5 h-5 border-2 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5" />
                  Refine Prompt
                </>
              )}
            </button>
          </div>
        </section>

        {/* RIGHT COLUMN: OUTPUT */}
        <section className="flex flex-col gap-6">
          {!result && !isOptimizing && (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-neutral-800 rounded-2xl text-neutral-600">
              <SparklesIcon className="w-16 h-16 mb-4 opacity-20 text-white" />
              <p className="font-medium text-lg text-neutral-400">Ready to refine</p>
              <p className="text-sm">
                Your professional prompt will appear here.
              </p>
            </div>
          )}

          {isOptimizing && !result && (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-neutral-900 rounded-2xl border border-neutral-800 animate-pulse">
              <div className="space-y-4 w-full max-w-sm">
                <div className="h-4 bg-neutral-800 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-neutral-800 rounded w-1/2 mx-auto"></div>
                <div className="h-32 bg-neutral-800 rounded-xl w-full mt-8 opacity-50"></div>
              </div>
              <p className="mt-8 text-amber-500 font-medium">
                Gemini is crafting your prompt...
              </p>
            </div>
          )}

          {result && (
            <div className="flex flex-col gap-6 fade-in">
              <div className="bg-neutral-900 rounded-2xl shadow-xl border border-neutral-800 overflow-hidden">
                <div className="bg-neutral-800/50 px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
                  <h3 className="font-bold text-amber-500 flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4" />
                    Optimized Result
                  </h3>
                  <button
                    onClick={copyToClipboard}
                    className="text-sm font-medium text-neutral-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    {copyStatus ? (
                      <>
                        <CheckIcon className="w-4 h-4 text-green-500" /> <span className="text-green-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <CopyIcon className="w-4 h-4" /> Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="p-6 bg-neutral-900">
                  <pre className="whitespace-pre-wrap text-base leading-relaxed text-neutral-200 font-sans">
                    {result.optimizedPrompt}
                  </pre>
                </div>
                
                {/* Visualization: Image Domain (Only active for Nano Banana Pro for now as it uses Gemini API) */}
                {selectedDomain === 'image' && selectedModel === 'nano-banana-pro' && (
                     <div className="px-6 pb-6 pt-2">
                        <button 
                            onClick={handleGenerateImage}
                            disabled={isGeneratingImage}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 rounded-xl transition-all shadow-md group"
                        >
                            {isGeneratingImage ? (
                                <span className="animate-pulse text-amber-500">Generating Preview...</span>
                            ) : (
                                <>
                                    <ImageIcon className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                                    Visualize with Nano Banana Pro
                                </>
                            )}
                        </button>
                        
                        {generatedImage && (
                            <div className="mt-4 rounded-xl overflow-hidden border border-neutral-800 shadow-md fade-in">
                                <img src={generatedImage} alt="Generated preview" className="w-full h-auto" />
                                <div className="bg-neutral-950 px-3 py-2 text-xs text-neutral-500 text-center border-t border-neutral-800">
                                    Generated by gemini-3-pro-image-preview
                                </div>
                            </div>
                        )}
                     </div>
                )}
                {/* Visualizer Warning for other models */}
                {selectedDomain === 'image' && selectedModel !== 'nano-banana-pro' && (
                    <div className="px-6 pb-6 pt-2 text-xs text-neutral-500 text-center italic">
                        * Preview generation is only available for Nano Banana Pro. Copy this prompt to use in {selectedModel}.
                    </div>
                )}

                {/* Visualization: Video Domain */}
                {selectedDomain === 'video' && (
                     <div className="px-6 pb-6 pt-2">
                        <button 
                            onClick={handleGenerateVideo}
                            disabled={isGeneratingVideo}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 rounded-xl transition-all shadow-md group"
                        >
                            {isGeneratingVideo ? (
                                <span className="animate-pulse text-amber-500">{videoProgress || "Processing..."}</span>
                            ) : (
                                <>
                                    <VideoIcon className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                                    Preview with Veo (720p)
                                </>
                            )}
                        </button>
                        
                        {generatedVideo && (
                            <div className="mt-4 rounded-xl overflow-hidden border border-neutral-800 shadow-md fade-in">
                                <video src={generatedVideo} controls className="w-full h-auto" />
                                <div className="bg-neutral-950 px-3 py-2 text-xs text-neutral-500 text-center border-t border-neutral-800">
                                    Generated by veo-3.1-fast-generate-preview
                                </div>
                            </div>
                        )}
                     </div>
                )}

                {/* Visualization: Writing Domain */}
                {selectedDomain === 'writing' && (
                     <div className="px-6 pb-6 pt-2">
                        <button 
                            onClick={handleGenerateTextPreview}
                            disabled={isGeneratingText}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 rounded-xl transition-all shadow-md group"
                        >
                            {isGeneratingText ? (
                                <span className="animate-pulse text-amber-500">Writing Draft...</span>
                            ) : (
                                <>
                                    <PenIcon className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                                    Generate Draft Preview
                                </>
                            )}
                        </button>
                        
                        {generatedText && (
                            <div className="mt-4 rounded-xl bg-neutral-950 border border-neutral-800 p-4 shadow-inner fade-in max-h-60 overflow-y-auto">
                                <h4 className="text-xs font-bold text-neutral-500 uppercase mb-2">AI Preview Output:</h4>
                                <div className="whitespace-pre-wrap text-sm text-neutral-300">
                                  {generatedText}
                                </div>
                                {selectedModel !== 'gemini-3' && (
                                    <div className="mt-3 pt-3 border-t border-neutral-800 text-[10px] text-neutral-500 italic text-center">
                                        * Note: This preview is generated by Gemini. The actual output from {selectedModel} may vary.
                                    </div>
                                )}
                            </div>
                        )}
                     </div>
                )}

              </div>

              {/* Educational Content */}
              <div className="bg-neutral-900 p-6 rounded-2xl shadow-sm border border-neutral-800">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <span className="bg-amber-500/20 text-amber-500 p-1.5 rounded text-sm">💡</span>
                    Why this works better
                </h3>
                <p className="text-neutral-400 leading-relaxed mb-6">
                    {result.explanation}
                </p>

                {result.addedTerms && result.addedTerms.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
                      Key Terms Added
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.addedTerms.map((term, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-neutral-800 text-amber-500 rounded-full text-sm font-medium border border-neutral-700"
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* History Sidebar */}
      {showHistory && (
        <>
            <div className="fixed inset-0 bg-black/60 z-20 backdrop-blur-sm" onClick={() => setShowHistory(false)} />
            <div className="fixed top-0 right-0 h-full w-80 bg-neutral-900 shadow-2xl z-30 transform transition-transform duration-300 overflow-y-auto flex flex-col border-l border-neutral-800">
                <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900">
                    <h2 className="font-bold text-lg text-white flex items-center gap-2">
                        <ClockIcon className="w-5 h-5 text-amber-500"/> History
                    </h2>
                    <button onClick={() => setShowHistory(false)} className="text-neutral-500 hover:text-white">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex-1 p-4 space-y-4">
                    {history.length === 0 ? (
                        <div className="text-center text-neutral-600 mt-10">
                            <ClockIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                            <p>No history yet.</p>
                        </div>
                    ) : (
                        history.map(item => (
                            <div 
                                key={item.id} 
                                onClick={() => loadHistoryItem(item)}
                                className="group relative bg-neutral-950 border border-neutral-800 rounded-xl p-3 hover:border-amber-500/50 hover:shadow-lg transition-all cursor-pointer"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                                        <span className="text-amber-500">{getDomainIcon(item.domain)}</span>
                                        <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <button 
                                        onClick={(e) => deleteHistoryItem(e, item.id)}
                                        className="text-neutral-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Delete"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-sm text-neutral-300 font-medium line-clamp-2 leading-snug">
                                    {item.originalPrompt}
                                </p>
                                {item.model && (item.domain === 'general' || item.domain === 'image' || item.domain === 'writing') && (
                                     <div className="mt-2 inline-block px-2 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-400 border border-neutral-700">
                                        {item.model}
                                     </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {history.length > 0 && (
                    <div className="p-4 border-t border-neutral-800 bg-neutral-900">
                        <button 
                            onClick={clearHistory}
                            className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-400 text-sm font-medium py-2 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <TrashIcon className="w-4 h-4" /> Clear All History
                        </button>
                    </div>
                )}
            </div>
        </>
      )}

    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);