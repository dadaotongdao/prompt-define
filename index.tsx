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

type TemplateItem = {
  id: string;
  name: string;
  content: string;
  domain: string;
  timestamp: number;
};

// --- Components ---

const App = () => {
  const [userInput, setUserInput] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("image");
  const [selectedModel, setSelectedModel] = useState("nano-banana-pro");
  
  // Logic States
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  
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

  const [copyStatus, setCopyStatus] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);
  
  // Sidebar State
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'history' | 'saved' | 'templates'>('history');
  
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
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
  });
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [templateContentToSave, setTemplateContentToSave] = useState("");

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
    // Reset Reverse Mode if not in Image domain
    if (selectedDomain !== 'image') {
        setIsReverseMode(false);
        setUploadedImage(null);
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
        model: (selectedDomain === 'general' || selectedDomain === 'image' || selectedDomain === 'writing') ? selectedModel : undefined,
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
    setIsTemplateModalOpen(true);
  };

  const confirmSaveTemplate = () => {
    if (!newTemplateName.trim() || !templateContentToSave.trim()) return;
    
    const newItem: TemplateItem = {
        id: crypto.randomUUID(),
        name: newTemplateName.trim(),
        content: templateContentToSave,
        domain: selectedDomain,
        timestamp: Date.now()
    };
    
    const newTemplates = [newItem, ...templates];
    setTemplates(newTemplates);
    localStorage.setItem("promptRefineTemplates", JSON.stringify(newTemplates));
    setIsTemplateModalOpen(false);
    
    // Show feedback
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 2000);
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
      // We don't necessarily change the model, but could if needed.
      // We clear the result to encourage "using" the template.
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
    
    // If it was an image upload, switching to Reverse Mode won't restore the image file
    // So we just stick to displaying the result in whatever mode makes sense, or default to Text mode
    // but keep result visible.
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
            // Fallback logic for 503
            if (error.message && (error.message.includes('503') || error.message.includes('500'))) {
                console.warn("Gemini 3 Pro overloaded, falling back to Gemini 2.5 Flash...");
                const fallbackConfig = { ...modelConfig, model: 'gemini-2.5-flash' };
                response = await ai.models.generateContent(fallbackConfig);
            } else {
                throw error;
            }
        }

        const json = JSON.parse(response.text || "{}");
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
               <constraints>
                 <constraint priority="hard">[Critical Rule]</constraint>
                 <constraint priority="soft">[Preferred Rule]</constraint>
               </constraints>
               <input_data>
                 [User's Input]
               </input_data>
               <output_format>
                 [Specific Format]
               </output_format>
             </task>
             
             EXPLANATION: XML tags provide the strongest boundary conditions for Opus's complex architecture.
             `;
         } else if (selectedModel === 'claude-4.5-sonnet') {
             domainInstruction += `
             *** TARGET: Claude 4.5 Sonnet ***
             PROTOCOL: Efficient XML-Tag Protocol (Input/Output Spec).
             STRATEGY: Use XML tags specifically optimized for code analysis and data processing.
             
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
      const fullSystemInstruction = `${baseInstruction}\n${domainInstruction}`;

      const modelConfig = {
        model: 'gemini-3-pro-preview',
        contents: {
             parts: [{ text: `User Raw Input: "${userInput}"` }]
        },
        config: {
            systemInstruction: fullSystemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    optimizedPrompt: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    addedTerms: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
            },
        }
      };

      let response;
      try {
          response = await ai.models.generateContent(modelConfig);
      } catch (error: any) {
          // 500/503 fallback
          if (error.message && (error.message.includes('500') || error.message.includes('503'))) {
              console.warn("Gemini 3 Pro error (" + error.message + "), falling back to Gemini 2.5 Flash...");
              const fallbackConfig = { ...modelConfig, model: 'gemini-2.5-flash' };
              response = await ai.models.generateContent(fallbackConfig);
          } else {
              throw error;
          }
      }
      
      const json = JSON.parse(response.text || "{}");
      const safeResult = {
        optimizedPrompt: json.optimizedPrompt || "Optimization failed.",
        explanation: (json.explanation || "No explanation provided.") + (response.model === 'gemini-2.5-flash' ? " (Generated with fallback model)" : ""),
        addedTerms: Array.isArray(json.addedTerms) ? json.addedTerms : []
      };

      setResult(safeResult);
      addToHistory(userInput, selectedDomain, safeResult, selectedModel);

    } catch (error) {
      console.error("Error optimizing prompt:", error);
      alert("Something went wrong. Please check your API key or try again.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.optimizedPrompt);
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 2000);
    }
  };

  const handleGenerateImage = async () => {
      if (!result) return;
      setIsGeneratingImage(true);
      setGeneratedImage(null);
      
      try {
          await ensureApiKey();
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          
          // Use Nano Banana Pro (Gemini 3 Pro Image)
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
          
          // Extract Image
          for (const part of response.candidates?.[0]?.content?.parts || []) {
              if (part.inlineData) {
                  setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
                  break;
              }
          }

      } catch (e) {
          console.error("Image generation failed", e);
          alert("Image generation failed. Ensure your API key has access to Gemini 3 Pro Image.");
      } finally {
          setIsGeneratingImage(false);
      }
  };
  
  const handleGenerateTextPreview = async () => {
    if (!result) return;
    setIsGeneratingText(true);
    setGeneratedText(null);
    
    try {
        await ensureApiKey();
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: result.optimizedPrompt, 
            config: {
                maxOutputTokens: 500 // Short preview
            }
        });
        
        setGeneratedText(response.text || "No output generated.");

    } catch (e) {
        console.error("Text generation failed", e);
        alert("Text generation failed.");
    } finally {
        setIsGeneratingText(false);
    }
  };

  const handleGenerateVideo = async () => {
      if (!result) return;
      setIsGeneratingVideo(true);
      setGeneratedVideo(null);
      setVideoProgress("Initializing Video Generation...");

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
          
          setVideoProgress("Rendering... This may take a moment.");
          
          // Poll for completion
          while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            operation = await ai.operations.getVideosOperation({operation: operation});
            setVideoProgress("Rendering... " + (new Date()).toLocaleTimeString());
          }

          const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
          if (videoUri) {
             // Fetch with API key appended
             const videoUrlWithKey = `${videoUri}&key=${process.env.API_KEY}`;
             setGeneratedVideo(videoUrlWithKey);
          } else {
              setVideoProgress("Failed: No video URI returned.");
          }

      } catch (e) {
          console.error("Video generation failed", e);
          setVideoProgress("Error: " + (e as Error).message);
      } finally {
          setIsGeneratingVideo(false);
      }
  };

  const getActiveModels = () => {
      if (selectedDomain === 'general') return GENERAL_TARGET_MODELS;
      if (selectedDomain === 'image') return IMAGE_TARGET_MODELS;
      if (selectedDomain === 'writing') return WRITING_TARGET_MODELS;
      return [];
  };

  const activeModels = getActiveModels();

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-200 overflow-hidden font-sans selection:bg-amber-500/30">
      
      {/* Template Save Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 fade-in">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                <h3 className="text-xl font-bold text-neutral-200 mb-4 flex items-center gap-2">
                    <LayoutIcon className="w-5 h-5 text-amber-500" />
                    {templateContentToSave ? 'Save as Template' : 'Add Custom Template'}
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-neutral-500 uppercase font-medium">Template Name</label>
                        <input 
                            autoFocus
                            type="text" 
                            value={newTemplateName}
                            onChange={(e) => setNewTemplateName(e.target.value)}
                            placeholder="e.g. Cyberpunk Character Base"
                            className="w-full mt-1 p-3 rounded-xl bg-black/50 border border-neutral-800 text-neutral-200 focus:ring-2 focus:ring-amber-500/50 outline-none placeholder-neutral-700"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-neutral-500 uppercase font-medium">Prompt Content</label>
                        <textarea
                            value={templateContentToSave}
                            onChange={(e) => setTemplateContentToSave(e.target.value)}
                            placeholder="Paste your prompt here..."
                            className="w-full mt-1 p-3 rounded-xl bg-black/20 border border-neutral-800 text-neutral-300 focus:ring-2 focus:ring-amber-500/50 outline-none placeholder-neutral-700 font-mono text-sm h-32 resize-none"
                        />
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button 
                            onClick={() => setIsTemplateModalOpen(false)}
                            className="flex-1 py-3 rounded-xl font-medium text-neutral-400 hover:bg-neutral-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={confirmSaveTemplate}
                            disabled={!newTemplateName.trim() || !templateContentToSave.trim()}
                            className="flex-1 py-3 rounded-xl font-bold bg-amber-600 hover:bg-amber-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Save Template
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 right-0 w-80 bg-neutral-900/95 backdrop-blur border-l border-neutral-800 shadow-2xl transform transition-transform duration-300 z-50 ${showSidebar ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b border-neutral-800 pb-4">
                <h2 className="text-lg font-bold text-amber-500 flex items-center gap-2">
                    {sidebarTab === 'history' && <ClockIcon className="w-5 h-5"/>}
                    {sidebarTab === 'saved' && <BookmarkIcon className="w-5 h-5" filled/>}
                    {sidebarTab === 'templates' && <LayoutIcon className="w-5 h-5" />}
                    
                    {sidebarTab === 'history' && 'History'}
                    {sidebarTab === 'saved' && 'Saved Prompts'}
                    {sidebarTab === 'templates' && 'Templates'}
                </h2>
                <div className="flex gap-2">
                    <button onClick={() => setShowSidebar(false)} className="p-1 hover:text-white transition-colors">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            
            {/* Sidebar Tabs */}
            <div className="flex mb-4 bg-neutral-800 rounded-lg p-1">
                <button 
                    onClick={() => setSidebarTab('history')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${sidebarTab === 'history' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'}`}
                >
                    Recent
                </button>
                <button 
                    onClick={() => setSidebarTab('saved')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${sidebarTab === 'saved' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'}`}
                >
                    Saved
                </button>
                <button 
                    onClick={() => setSidebarTab('templates')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${sidebarTab === 'templates' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'}`}
                >
                    Templates
                </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {sidebarTab === 'templates' && (
                    <div className="space-y-2 mb-3">
                        <button
                            onClick={() => openSaveTemplateModal(userInput)}
                            className="w-full py-2 px-3 bg-neutral-800 hover:bg-neutral-700 border border-dashed border-neutral-600 rounded-lg text-xs text-neutral-400 hover:text-amber-500 transition-colors flex items-center justify-center gap-2"
                            title="Save current input as a new template"
                        >
                            <span className="text-lg leading-none font-light">+</span>
                            Create Template from Input
                        </button>
                        <button
                            onClick={() => openSaveTemplateModal("")}
                            className="w-full py-2 px-3 bg-neutral-900 hover:bg-neutral-800 border border-dashed border-neutral-700 rounded-lg text-xs text-neutral-500 hover:text-neutral-300 transition-colors flex items-center justify-center gap-2"
                            title="Manually paste or type a prompt template"
                        >
                            <span className="text-lg leading-none font-light">+</span>
                            Add Custom Template
                        </button>
                    </div>
                )}

                {sidebarTab === 'templates' && templates.length === 0 && (
                     <div className="text-neutral-500 text-center text-sm py-8 italic">No templates saved.<br/>Save a prompt result to use it later.</div>
                )}
                {(sidebarTab !== 'templates' && (sidebarTab === 'history' ? history : savedPrompts).length === 0) && (
                    <div className="text-neutral-500 text-center text-sm py-8 italic">No items found.</div>
                )}
                
                {/* Templates List */}
                {sidebarTab === 'templates' && templates.map((item) => (
                    <div key={item.id} className="group relative bg-neutral-800/50 border border-neutral-800 hover:border-amber-500/50 rounded-lg p-3 cursor-pointer transition-all" onClick={() => loadTemplate(item)}>
                         <div className="flex justify-between items-start mb-2">
                             <div className="flex items-center gap-2">
                                <span className="text-amber-500/80">
                                    <LayoutIcon className="w-4 h-4"/>
                                </span>
                                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{item.domain}</span>
                             </div>
                             <button 
                                onClick={(e) => deleteTemplate(e, item.id)}
                                className="text-neutral-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                             >
                                 <TrashIcon className="w-4 h-4" />
                             </button>
                         </div>
                         <p className="text-sm text-neutral-200 font-bold mb-1">
                             {item.name}
                         </p>
                         <p className="text-xs text-neutral-400 line-clamp-2 font-mono bg-black/20 p-1.5 rounded">
                             {item.content}
                         </p>
                         <div className="flex justify-end items-center text-[10px] text-neutral-500 mt-2">
                            <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                         </div>
                    </div>
                ))}

                {/* History/Saved List */}
                {sidebarTab !== 'templates' && (sidebarTab === 'history' ? history : savedPrompts).map((item) => (
                    <div key={item.id} className="group relative bg-neutral-800/50 border border-neutral-800 hover:border-amber-500/50 rounded-lg p-3 cursor-pointer transition-all" onClick={() => loadHistoryItem(item)}>
                         <div className="flex justify-between items-start mb-2">
                             <div className="flex items-center gap-2">
                                <span className="text-amber-500/80">
                                    {DOMAINS.find(d => d.id === item.domain)?.icon || <SparklesIcon className="w-4 h-4"/>}
                                </span>
                                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{item.domain}</span>
                             </div>
                             <button 
                                onClick={(e) => sidebarTab === 'history' ? deleteHistoryItem(e, item.id) : removeFromSaved(e, item.id)}
                                className="text-neutral-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                             >
                                 <TrashIcon className="w-4 h-4" />
                             </button>
                         </div>
                         <p className="text-sm text-neutral-300 line-clamp-2 mb-2 font-medium">
                             {item.originalPrompt}
                         </p>
                         <div className="flex justify-between items-center text-[10px] text-neutral-500">
                            <span>{item.model || 'Auto'}</span>
                            <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                         </div>
                    </div>
                ))}
            </div>
            
            {sidebarTab === 'history' && history.length > 0 && (
                <button 
                    onClick={clearHistory}
                    className="mt-4 w-full py-2 text-xs text-red-400 hover:bg-red-950/30 border border-red-900/30 rounded-md transition-colors"
                >
                    Clear History
                </button>
            )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative z-0">
        {/* Navigation */}
        <nav className="h-16 border-b border-neutral-800 flex items-center justify-between px-6 bg-neutral-900/50 backdrop-blur">
          <div className="flex items-center gap-2">
             <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-2 rounded-lg">
                <SparklesIcon className="text-neutral-950 w-5 h-5" />
             </div>
             <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">PromptRefine AI</h1>
          </div>
          <button 
            onClick={() => {
                setShowSidebar(true);
                setSidebarTab('history');
            }}
            className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400 hover:text-amber-500"
            title="View History"
          >
              <ClockIcon className="w-5 h-5" />
          </button>
        </nav>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Input & Controls */}
          <div className="w-1/2 p-8 overflow-y-auto border-r border-neutral-800">
            <div className="max-w-2xl mx-auto space-y-8">
              
              {/* Domain Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Target Domain</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {DOMAINS.map((domain) => (
                    <button
                      key={domain.id}
                      onClick={() => setSelectedDomain(domain.id)}
                      className={`flex items-start gap-3 p-4 rounded-xl border transition-all text-left group
                        ${selectedDomain === domain.id 
                          ? "bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]" 
                          : "bg-neutral-900 border-neutral-800 hover:border-neutral-700"
                        }`}
                    >
                      <div className={`mt-0.5 ${selectedDomain === domain.id ? "text-amber-500" : "text-neutral-500 group-hover:text-neutral-400"}`}>
                        {domain.icon}
                      </div>
                      <div>
                        <div className={`font-medium ${selectedDomain === domain.id ? "text-amber-100" : "text-neutral-300"}`}>
                            {domain.label}
                        </div>
                        <div className="text-xs text-neutral-500 mt-1 leading-relaxed">{domain.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Switcher for Image Domain */}
              {selectedDomain === 'image' && (
                  <div className="flex bg-neutral-900 p-1 rounded-lg border border-neutral-800 w-fit">
                      <button
                        onClick={() => setIsReverseMode(false)}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${!isReverseMode ? 'bg-amber-500 text-neutral-950 shadow-md' : 'text-neutral-400 hover:text-neutral-200'}`}
                      >
                          Text to Prompt
                      </button>
                      <button
                        onClick={() => setIsReverseMode(true)}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${isReverseMode ? 'bg-amber-500 text-neutral-950 shadow-md' : 'text-neutral-400 hover:text-neutral-200'}`}
                      >
                          Reverse Engineer
                      </button>
                  </div>
              )}

              {/* Input Area */}
              <div className="space-y-3 fade-in">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-neutral-400 uppercase tracking-wider">
                        {isReverseMode ? "Upload Reference Image" : "Your Raw Idea"}
                    </label>
                    {!isReverseMode && (
                        <button 
                            onClick={() => openSaveTemplateModal(userInput)}
                            disabled={!userInput.trim()}
                            className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all border
                                ${userInput.trim() 
                                    ? 'bg-neutral-800 text-amber-500 border-neutral-700 hover:border-amber-500/50 hover:bg-neutral-700 cursor-pointer' 
                                    : 'bg-transparent text-neutral-600 border-transparent cursor-not-allowed'
                                }`}
                            title="Save current text as a reusable template"
                        >
                            <LayoutIcon className="w-3.5 h-3.5" />
                            <span className="font-medium">Save as Template</span>
                        </button>
                    )}
                </div>
                
                {isReverseMode ? (
                    // Image Upload UI
                    <div 
                        className={`relative border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center transition-all overflow-hidden group
                        ${uploadedImage ? 'border-amber-500/50 bg-neutral-900' : 'border-neutral-700 bg-neutral-900/50 hover:bg-neutral-900 hover:border-neutral-600'}`}
                    >
                         <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleFileUpload} 
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                         />
                         
                         {uploadedImage ? (
                             <img src={uploadedImage} alt="Upload preview" className="h-full w-full object-contain p-2" />
                         ) : (
                             <div className="text-center p-6 space-y-2 pointer-events-none">
                                 <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mx-auto text-neutral-500 group-hover:text-amber-500 transition-colors">
                                     <UploadIcon className="w-6 h-6" />
                                 </div>
                                 <p className="text-neutral-300 font-medium">Click or Drag image here</p>
                                 <p className="text-xs text-neutral-500">Supports JPG, PNG</p>
                             </div>
                         )}
                         
                         {uploadedImage && (
                             <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setUploadedImage(null);
                                    if(fileInputRef.current) fileInputRef.current.value = "";
                                }}
                                className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-red-500/80 rounded-full text-white z-20 transition-colors"
                             >
                                 <XIcon className="w-4 h-4" />
                             </button>
                         )}
                    </div>
                ) : (
                    // Text Input UI
                    <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={
                        selectedDomain === 'coding' ? "e.g. Create a Python script to scrape stock data..." :
                        selectedDomain === 'image' ? "e.g. A cat flying in space..." :
                        selectedDomain === 'video' ? "e.g. Drone shot of a futuristic city..." :
                        selectedDomain === 'writing' ? "e.g. Write a blog post about coffee..." :
                        "Describe what you want to achieve..."
                    }
                    className="w-full h-40 p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-600 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none resize-none transition-all shadow-inner text-base"
                    />
                )}
              </div>

              {/* Model Selection (Conditional) */}
              {activeModels.length > 0 && (
                 <div className="space-y-3 fade-in">
                    <label className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Target AI Model</label>
                    <div className="relative">
                        <select 
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="w-full p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 appearance-none focus:ring-2 focus:ring-amber-500/50 outline-none cursor-pointer hover:border-neutral-700 transition-colors"
                        >
                            {activeModels.map(m => (
                                <option key={m.id} value={m.id}>{m.label}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                             <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                    </div>
                    <p className="text-xs text-neutral-500 px-1">
                        {activeModels.find(m => m.id === selectedModel)?.description}
                    </p>
                 </div>
              )}

              <button
                onClick={isReverseMode ? handleReverseEngineer : handleOptimize}
                disabled={isOptimizing || isAnalyzing || (!userInput.trim() && !uploadedImage)}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg
                  ${(isOptimizing || isAnalyzing || (!userInput.trim() && !uploadedImage))
                    ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-amber-900/20"
                  }`}
              >
                {isOptimizing || isAnalyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {isReverseMode ? "Analyzing Image..." : "Optimizing..."}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <SparklesIcon className="w-5 h-5" />
                    {isReverseMode ? "Reverse Engineer Prompt" : "Refine Prompt"}
                  </span>
                )}
              </button>

            </div>
          </div>

          {/* Right Panel: Output */}
          <div className="w-1/2 bg-neutral-900/30 p-8 overflow-y-auto">
            {result ? (
              <div className="max-w-2xl mx-auto space-y-6 fade-in">
                
                {/* Result Card */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-900/80 flex justify-between items-center">
                    <h2 className="font-semibold text-amber-500 flex items-center gap-2">
                      <SparklesIcon className="w-4 h-4" />
                      Optimized Result
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openSaveTemplateModal(result.optimizedPrompt)}
                        className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-amber-500 transition-colors"
                        title="Save as Template"
                      >
                         <LayoutIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleSavePrompt}
                        className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-amber-500 transition-colors"
                        title="Save to Collection"
                      >
                         {saveStatus ? <CheckIcon className="w-4 h-4 text-green-500" /> : <BookmarkIcon className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={handleCopy}
                        className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors"
                        title="Copy to Clipboard"
                      >
                        {copyStatus ? <CheckIcon className="w-4 h-4 text-green-500" /> : <CopyIcon className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="prose prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap text-neutral-200 font-mono text-sm leading-relaxed bg-black/20 p-4 rounded-xl border border-neutral-800/50">
                            {result.optimizedPrompt}
                        </pre>
                    </div>

                    {/* Tags */}
                    {result.addedTerms && result.addedTerms.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-2">
                        {result.addedTerms.map((term, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-900/20 border border-amber-900/40 text-amber-500 text-xs font-medium">
                            <ChipIcon className="w-3 h-3" />
                            {term}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Explanation Footer */}
                  <div className="px-6 py-4 bg-neutral-800/30 border-t border-neutral-800 text-sm text-neutral-400">
                    <strong className="text-neutral-300 block mb-1">Why this works:</strong>
                    {result.explanation}
                  </div>
                </div>

                {/* VISUALIZATION PREVIEW (Domain Specific) */}
                {selectedDomain === 'image' && (
                    <div className="pt-4 border-t border-neutral-800">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Preview Generation</h3>
                        </div>
                        
                        {!generatedImage && !isGeneratingImage && (
                            <button 
                                onClick={handleGenerateImage}
                                className="w-full py-3 border border-neutral-700 hover:border-amber-500/50 hover:bg-neutral-800 rounded-xl text-neutral-300 text-sm font-medium transition-all border-dashed"
                            >
                                Test with Nano Banana Pro (Generate Image)
                            </button>
                        )}
                        
                        {isGeneratingImage && (
                            <div className="w-full aspect-square bg-neutral-800 rounded-xl flex flex-col items-center justify-center text-neutral-400 animate-pulse">
                                <SparklesIcon className="w-8 h-8 mb-2 animate-spin text-amber-500" />
                                <span className="text-sm">Rendering Preview...</span>
                            </div>
                        )}
                        
                        {generatedImage && (
                            <div className="relative group">
                                <img src={generatedImage} alt="Generated Preview" className="w-full rounded-xl shadow-lg border border-neutral-800" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                    <a href={generatedImage} download="preview.png" className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform">
                                        Download
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                {selectedDomain === 'writing' && (
                    <div className="pt-4 border-t border-neutral-800">
                        <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">Content Draft Preview</h3>
                        
                        {!generatedText && !isGeneratingText && (
                            <button 
                                onClick={handleGenerateTextPreview}
                                className="w-full py-3 border border-neutral-700 hover:border-amber-500/50 hover:bg-neutral-800 rounded-xl text-neutral-300 text-sm font-medium transition-all border-dashed"
                            >
                                Generate Draft (Gemini Flash)
                            </button>
                        )}
                        
                         {isGeneratingText && (
                             <div className="p-6 bg-neutral-800 rounded-xl text-neutral-400 animate-pulse flex items-center gap-3">
                                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce delay-75" />
                                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce delay-150" />
                                <span className="text-sm ml-2">Writing...</span>
                             </div>
                         )}
                         
                         {generatedText && (
                             <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap font-serif">
                                 {generatedText}
                             </div>
                         )}
                    </div>
                )}

                {selectedDomain === 'video' && (
                    <div className="pt-4 border-t border-neutral-800">
                        <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">Video Preview (Veo)</h3>
                        
                        {!generatedVideo && !isGeneratingVideo && (
                            <button 
                                onClick={handleGenerateVideo}
                                className="w-full py-3 border border-neutral-700 hover:border-amber-500/50 hover:bg-neutral-800 rounded-xl text-neutral-300 text-sm font-medium transition-all border-dashed"
                            >
                                Generate 5s Preview (Veo)
                            </button>
                        )}
                        
                        {isGeneratingVideo && (
                            <div className="w-full aspect-video bg-neutral-800 rounded-xl flex flex-col items-center justify-center text-neutral-400">
                                <div className="w-64 h-2 bg-neutral-700 rounded-full overflow-hidden mb-4">
                                    <div className="h-full bg-amber-500 animate-[loading_2s_ease-in-out_infinite]" style={{width: '50%'}}></div>
                                </div>
                                <span className="text-sm font-mono text-amber-500">{videoProgress}</span>
                            </div>
                        )}
                        
                        {generatedVideo && (
                            <div className="rounded-xl overflow-hidden border border-neutral-800 shadow-lg">
                                <video controls className="w-full" autoPlay loop>
                                    <source src={generatedVideo} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        )}
                    </div>
                )}

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-neutral-600 space-y-4 fade-in">
                <div className="p-6 bg-neutral-900 rounded-full border border-neutral-800 shadow-xl">
                   <SparklesIcon className="w-12 h-12 text-neutral-700" />
                </div>
                <div className="text-center">
                    <p className="text-lg font-medium text-neutral-500">Ready to Refine</p>
                    <p className="text-sm max-w-xs mx-auto mt-2">Select a domain, enter your idea (or upload an image), and let AI handle the engineering.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);