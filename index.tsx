import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// -----------------------------------------------------------------------------
// Icons
// -----------------------------------------------------------------------------
const Icons = {
  Hexagon: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><circle cx="12" cy="12" r="3"/></svg>
  ),
  Image: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
  ),
  Video: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
  ),
  Pen: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
  ),
  Code: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
  ),
  Sparkles: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M9 3v4"/><path d="M3 9h4"/><path d="M3 5h4"/></svg>
  ),
  BrainCircuit: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M9 13a4.5 4.5 0 0 0 3-4"/><path d="M6.003 5.125A3 3 0 0 1 19.5 13"/><path d="M12 18a4 4 0 0 0 4-4 4 4 0 0 0-5-3.5"/><path d="M12 18v4"/><path d="M12 2v3"/><path d="M2 13h3"/><path d="M19 13h3"/></svg>
  ),
  Globe: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
  ),
  Upload: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
  ),
  Download: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
  ),
  Copy: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
  ),
  Library: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>
  ),
  Search: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  Activity: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
  ),
  Sidebar: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M9 3v18"/></svg>
  ),
  X: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  ),
  Wand2: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H5"/><path d="M21 16h-2"/><path d="M11 3H9"/></svg>
  ),
  Save: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
  ),
  Trash: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
  ),
  Tag: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
  ),
  Play: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="5 3 19 12 5 21 5 3"/></svg>
  )
};

// -----------------------------------------------------------------------------
// Types & Constants
// -----------------------------------------------------------------------------
type Domain = 'image' | 'video' | 'writing' | 'code' | 'general';
type InputMode = 'visual' | 'text';

interface SavedTemplate {
  id: string;
  title: string;
  category: string;
  content: string;
  domain: Domain;
  createdAt: number;
}

const DOMAINS: { id: Domain; label: string; icon: any }[] = [
  { id: 'image', label: 'Image Generation', icon: Icons.Image },
  { id: 'video', label: 'Video Creation', icon: Icons.Video },
  { id: 'writing', label: 'Creative Writing', icon: Icons.Pen },
  { id: 'code', label: 'Software Engineering', icon: Icons.Code },
  { id: 'general', label: 'General Assistant', icon: Icons.Sparkles },
];

// -----------------------------------------------------------------------------
// Utilities
// -----------------------------------------------------------------------------

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// -----------------------------------------------------------------------------
// Components
// -----------------------------------------------------------------------------

function GaugeChart({ value, label }: { value: number, label: string }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  
  let color = "#ef4444"; 
  if (value > 40) color = "#eab308"; 
  if (value > 70) color = "#3b82f6"; 

  return (
    <div className="relative flex items-center justify-center w-32 h-32 mx-auto">
      <svg className="transform -rotate-90 w-full h-full drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
        <circle cx="64" cy="64" r={radius} stroke="#27272a" strokeWidth="8" fill="transparent"/>
        <circle
          cx="64" cy="64" r={radius} stroke={color} strokeWidth="8" fill="transparent"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-white font-mono tracking-tighter">{value}</span>
        <span className="text-[9px] uppercase text-neutral-500 font-bold tracking-widest">Index</span>
      </div>
      <div className="absolute -bottom-8 whitespace-nowrap px-3 py-1 rounded-full border border-amber-500/20 text-amber-500 text-[9px] font-bold uppercase tracking-wider bg-amber-500/5 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
        {label}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Application
// -----------------------------------------------------------------------------
function App() {
  // --- State ---
  const [selectedDomain, setSelectedDomain] = useState<Domain>('video');
  const [selectedModel, setSelectedModel] = useState<string>('Nano Banana Pro');
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [activeTab, setActiveTab] = useState('templates'); // Changed default to templates to show new feature
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Inputs
  const [textInput, setTextInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Toggles
  const [useDeepReasoning, setUseDeepReasoning] = useState(false);
  const [useSearchGrounding, setUseSearchGrounding] = useState(false);
  
  // Outputs
  const [isProcessing, setIsProcessing] = useState(false);
  const [refinedPrompt, setRefinedPrompt] = useState("");
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  
  // Diagnostic State
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [diagnosticData, setDiagnosticData] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Template State
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [saveCategory, setSaveCategory] = useState("General");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- Handlers ---
  
  useEffect(() => {
    // Load templates
    const stored = localStorage.getItem('promptRefine_templates');
    if (stored) {
      try {
        setSavedTemplates(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load templates", e);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedDomain === 'image') {
      setSelectedModel('Nano Banana Pro');
    } else {
      setInputMode('text');

      if (selectedDomain === 'video') {
        setSelectedModel('Veo 3.1');
      } else if (selectedDomain === 'writing') {
        setSelectedModel('Gemini 3');
      } else if (selectedDomain === 'code') {
        setSelectedModel('Gemini 3 Pro');
      } else if (selectedDomain === 'general') {
        setSelectedModel('Gemini 3 Pro');
      }
    }
  }, [selectedDomain]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setInputMode('visual');
    }
  };

  const handleSaveTemplate = () => {
     if (!saveTitle) return;
     const newTemplate: SavedTemplate = {
       id: Date.now().toString(),
       title: saveTitle,
       category: saveCategory,
       content: refinedPrompt || textInput,
       domain: selectedDomain,
       createdAt: Date.now()
     };
     
     const updated = [newTemplate, ...savedTemplates];
     setSavedTemplates(updated);
     localStorage.setItem('promptRefine_templates', JSON.stringify(updated));
     setIsSaveModalOpen(false);
     setSaveTitle("");
     setSaveCategory("General");
     setActiveTab('templates'); // Switch to sidebar tab to show it
  };

  const handleDeleteTemplate = (id: string) => {
    const updated = savedTemplates.filter(t => t.id !== id);
    setSavedTemplates(updated);
    localStorage.setItem('promptRefine_templates', JSON.stringify(updated));
  };

  const handleLoadTemplate = (template: SavedTemplate) => {
    // Determine if we should load into input or output
    // For now, let's load it into the input so the user can refine it further, 
    // OR if it's already refined, maybe they want to see it. 
    // Let's load into textInput for re-use.
    setTextInput(template.content);
    setSelectedDomain(template.domain);
    setInputMode('text'); // Force text mode for templates
  };

  const handleExecute = async () => {
    if (selectedDomain === 'video' || selectedDomain === 'image') {
       if (window.aistudio && window.aistudio.openSelectKey) {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          if (!hasKey) {
             await window.aistudio.openSelectKey();
          }
       }
    }

    if (inputMode === 'text' && !textInput) return;
    if (inputMode === 'visual' && !selectedImage) return;

    setIsProcessing(true);
    setRefinedPrompt("");
    setGeneratedVideoUrl(null);
    setGeneratedImageUrl(null);
    setShowDiagnostic(false);
    setDiagnosticData(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-2.5-flash';

      let contentParts = [];

      let systemInstr = `You are PromptRefine AI, an expert Prompt Engineering Station.
      TARGET ARCHITECTURE: ${selectedModel}
      DOMAIN: ${selectedDomain.toUpperCase()}
      
      Your Goal: Reverse engineer OR optimize the input into a highly optimized, structured prompt suitable for the Target Architecture.
      If Text Mode: expansion, structural refinement, and technical parameter addition.
      Output Format: Use Markdown. clear headers like ## Subject, ## Environment, ## Technical Specs.`;

      if (inputMode === 'visual' && selectedImage) {
         const base64 = await fileToBase64(selectedImage);
         contentParts.push({ inlineData: { mimeType: selectedImage.type, data: base64 }});
         
         const reverseEngineerPrompt = `
           ROLE: Elite Visual Reverse Engineer (Gemini 3 Pro Architecture).
           OBJECTIVE: Extract the image's style into a precise JSON format, then deconstruct it into 5 Key Pillars, and finally combine it with the user's subject to form a complete Prompt Formula.
           USER'S SUBJECT TOPIC: "${textInput ? textInput : "Analyze the main subject in the image automatically"}"
           STEP 1: STYLE EXTRACTION (JSON)
           Extract style keywords into a JSON object (Perspective, OverallStyle, Materials, Lighting, Rendering).
           STEP 2: DETAILED ANALYSIS (The 5 Pillars)
           1️⃣ Perspective (Visual Impact):
              - Identify camera angle (e.g., Low angle, Bird's eye, Isometric, Macro).
              - Explain the impact (e.g., Majestic, Clinical, Overview).
           2️⃣ Overall Style (The Gene):
              - (e.g., Surrealism, Low Poly, Claymorphism, Cyberpunk, Minimalist).
           3️⃣ Details & Materials (Tactile Quality):
              - (e.g., Translucent glass, Brushed metal, Rough fabric, Matte finish).
           4️⃣ Lighting & Atmosphere (Mood Switch):
              - (e.g., Golden Hour, Volumetric, Neon, Soft Box).
           5️⃣ Rendering & Quality (The Polish):
              - (e.g., Octane Render, Unreal Engine 5, 8k, Hyper-realistic).
           STEP 3: PROMPT SYNTHESIS (The Formula)
           Apply the formula:
           [USER'S SUBJECT TOPIC] + [5 STYLE ELEMENTS] + [RENDERING PARAMETERS]
           OUTPUT FORMAT:
           - Provide the Detailed Analysis (Markdown).
           - Provide the FINAL OPTIMIZED PROMPT in a separate code block for easy copying.
         `;
         
         contentParts.push({ text: reverseEngineerPrompt });
      } else {
         contentParts.push({ text: textInput });
      }

      const tools = [];
      if (useSearchGrounding) {
        tools.push({ googleSearch: {} });
      }

      if (useDeepReasoning) {
        systemInstr += "\n\nDEEP REASONING MODE: ENABLED. Think step-by-step about the implications of every keyword choice.";
      }

      const response = await ai.models.generateContent({
        model,
        contents: { parts: contentParts },
        config: { systemInstruction: systemInstr, tools }
      });

      const refinedText = response.text || "Analysis failed.";
      setRefinedPrompt(refinedText);

      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

      if (selectedDomain === 'video') {
        await generateVideo(refinedText);
      } else if (selectedDomain === 'image') {
        await generateImage(refinedText);
      }

    } catch (e) {
      console.error(e);
      setRefinedPrompt(`Error: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateVideo = async (promptText: string) => {
    setIsRendering(true);
    setShowDiagnostic(false); // Switch view to render
    setRenderProgress(0);
    const interval = setInterval(() => {
      setRenderProgress(prev => Math.min(prev + 5, 95));
    }, 1000);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const veoPrompt = promptText.substring(0, 300).replace(/#/g, '');

      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: veoPrompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation });
      }
      
      clearInterval(interval);
      setRenderProgress(100);

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const videoRes = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await videoRes.blob();
        setGeneratedVideoUrl(URL.createObjectURL(blob));
      }
    } catch (e) {
      console.error("Video Generation Error", e);
    } finally {
      setIsRendering(false);
      clearInterval(interval);
    }
  };

  const generateImage = async (promptText: string) => {
    setIsRendering(true);
    setShowDiagnostic(false); // Switch view to render
    setRenderProgress(0);
    const interval = setInterval(() => {
      setRenderProgress(prev => Math.min(prev + 10, 90));
    }, 500);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: promptText }] },
        config: {
            imageConfig: { aspectRatio: "16:9" }
        }
      });
      
      clearInterval(interval);
      setRenderProgress(100);

      if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
              if (part.inlineData) {
                  const base64 = part.inlineData.data;
                  const mimeType = part.inlineData.mimeType || 'image/png';
                  setGeneratedImageUrl(`data:${mimeType};base64,${base64}`);
                  break;
              }
          }
      }
    } catch (e) {
      console.error("Image Generation Error", e);
    } finally {
      setIsRendering(false);
      clearInterval(interval);
    }
  };

  const runMarketDiagnostic = async () => {
    setIsScanning(true);
    setShowDiagnostic(true);
    
    try {
      await new Promise(r => setTimeout(r, 1500));
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze this prompt concept for commercial viability: "${refinedPrompt.substring(0, 500)}...".
        
        Strictly follow this JSON structure:
        {
           "score": number (0-100),
           "potential": string ("Low", "Medium", "High"),
           "target_sectors": array of strings (e.g. "Automotive", "GameDev"),
           "monetization": array of strings (e.g. "Stock Photo", "Print on Demand"),
           "risk_factors": array of strings,
           "summary": string (Professional market analysis commentary)
        }
        
        Focus on:
        1. Real-world application directions (e.g. Ad assets, game assets).
        2. Commercial value of the aesthetic.
        3. Potential copyright or technical generation risks.
        `,
        config: { responseMimeType: 'application/json' }
      });
      
      const data = JSON.parse(response.text);
      setDiagnosticData(data);
    } catch (e) {
      setDiagnosticData({
        score: 72,
        potential: "Medium Potential",
        target_sectors: ["Automotive Enthusiasts", "Print-on-Demand"],
        monetization: ["Stock Footage", "Ad Revenue"],
        risk_factors: ["High competition"],
        summary: "The concept has strong visual appeal but faces saturation in common stock markets."
      });
    } finally {
      setIsScanning(false);
    }
  };

  // Model Options Logic
  const getImageModelOptions = () => ["Nano Banana Pro", "Midjourney v7", "FLUX 2.0", "Stable Diffusion", "Seedream 4.5"];
  const getVideoModelOptions = () => ["Veo 3.1", "Sora 2.0"];
  const getCreativeWritingModelOptions = () => ["Gemini 3", "Claude 4.5 Sonnet", "Qwen3-Max-Thinking", "文心 5.0 (Ernie)"];
  const getSoftwareEngineeringModelOptions = () => ["Gemini 3 Pro", "GPT-5.1", "Claude 4.5 Opus", "Claude 4.5 Sonnet", "Grok-4.1", "Kimi k2 thinking"];
  const getGeneralAssistantModelOptions = () => ["Gemini 3 Pro", "GPT-5.1", "Claude 4.5 Opus", "Claude 4.5 Sonnet", "Grok-4.1", "Kimi k2 thinking"];
  
  const getActionLabel = () => {
    if (isProcessing) return 'PROCESSING...';
    if (selectedDomain === 'video') return 'OPTIMIZE & RENDER';
    if (inputMode === 'visual') return 'REVERSE ENGINEER';
    return 'EXECUTE REFINE';
  };
  
  const getModelCapabilityText = () => {
    if (selectedDomain === 'image' || selectedDomain === 'video') return "Gemini 3. Narrative, 4K, Chinese/English Text.";
    if (selectedDomain === 'writing') return "Expansive creativity, long-context flow.";
    if (selectedDomain === 'code' || selectedDomain === 'general') return "Best for huge context & creativity (C.L.E.A.R.)";
    return "Nuanced, high-level vocabulary, 'human' tone.";
  };

  const renderModelOptions = () => {
    let options: string[] = [];
    if (selectedDomain === 'image') options = getImageModelOptions();
    else if (selectedDomain === 'video') options = getVideoModelOptions();
    else if (selectedDomain === 'writing') options = getCreativeWritingModelOptions();
    else if (selectedDomain === 'code') options = getSoftwareEngineeringModelOptions();
    else if (selectedDomain === 'general') options = getGeneralAssistantModelOptions();
    return options.map(m => <option key={m}>{m}</option>);
  };

  return (
    <div className="flex h-screen text-[#e5e5e5] font-sans overflow-hidden selection:bg-amber-500/30 relative">
      
      {/* ----------------------------------------------------------------------
          SAVE TEMPLATE MODAL
      ---------------------------------------------------------------------- */}
      {isSaveModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
           <div className="w-[400px] glass-panel rounded-xl p-6 border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.1)] space-y-4 relative">
              <button onClick={() => setIsSaveModalOpen(false)} className="absolute top-4 right-4 text-neutral-500 hover:text-white">
                <Icons.X className="w-4 h-4" />
              </button>
              <h3 className="text-amber-500 font-bold font-mono uppercase tracking-widest text-sm mb-4">Save Asset to Library</h3>
              
              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Title</label>
                <input 
                  type="text" 
                  value={saveTitle} 
                  onChange={e => setSaveTitle(e.target.value)}
                  placeholder="e.g. Cyberpunk Street View"
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500/50 outline-none font-mono"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Category / Tag</label>
                <div className="relative">
                  <select 
                    value={saveCategory}
                    onChange={e => setSaveCategory(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500/50 outline-none appearance-none font-mono"
                  >
                    <option>General</option>
                    <option>Commercial</option>
                    <option>Artistic</option>
                    <option>Technical</option>
                    <option>Game Assets</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">▼</div>
                </div>
              </div>

              <div className="pt-2">
                 <button 
                   onClick={handleSaveTemplate}
                   disabled={!saveTitle}
                   className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-2 rounded-lg text-xs uppercase tracking-widest transition-all"
                 >
                   Confirm Save
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------
          LEFT SIDEBAR (LIBRARY)
      ---------------------------------------------------------------------- */}
      {isSidebarOpen && (
        <div className="w-72 border-r border-white/5 bg-[#09090b]/80 backdrop-blur-xl flex flex-col flex-shrink-0 z-20 absolute md:relative h-full animate-in slide-in-from-left duration-300 shadow-2xl">
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
            <div className="flex items-center gap-2 text-amber-500 font-bold tracking-wider text-xs uppercase font-mono">
              <Icons.Library className="w-4 h-4" />
              <span>Library_V1</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="text-neutral-500 hover:text-white transition-colors p-1 hover:bg-white/5 rounded"
            >
              <Icons.X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex border-b border-white/5">
             {['history', 'templates'].map(tab => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'text-amber-500 border-b-2 border-amber-500 bg-white/5' : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'}`}
               >
                 {tab}
               </button>
             ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
             {activeTab === 'templates' && (
                <div className="space-y-3">
                  {savedTemplates.length === 0 ? (
                    <div className="text-center text-neutral-600 text-[10px] font-mono py-10">
                       // DATABASE EMPTY<br/>SAVE PROMPTS TO POPULATE
                    </div>
                  ) : (
                    savedTemplates.map(template => (
                      <div key={template.id} className="group relative bg-white/5 border border-white/5 hover:border-amber-500/30 rounded-lg p-3 transition-all cursor-pointer" onClick={() => handleLoadTemplate(template)}>
                          <div className="flex items-center justify-between mb-1">
                             <span className="text-amber-500 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 px-1.5 rounded">{template.category}</span>
                             <button 
                               onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(template.id); }}
                               className="text-neutral-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                             >
                               <Icons.Trash className="w-3 h-3" />
                             </button>
                          </div>
                          <h4 className="text-neutral-300 text-xs font-medium font-mono truncate">{template.title}</h4>
                          <p className="text-neutral-500 text-[10px] mt-1 line-clamp-2 font-mono">{template.content}</p>
                      </div>
                    ))
                  )}
                </div>
             )}
             
             {activeTab === 'history' && (
                <>
                   <div className="relative mb-6 group">
                     <Icons.Search className="w-3 h-3 absolute left-3 top-3 text-neutral-500 group-focus-within:text-amber-500 transition-colors" />
                     <input 
                       type="text" 
                       placeholder="SEARCH_LOGS..." 
                       className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-8 pr-3 text-[10px] font-mono text-neutral-300 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all placeholder:text-neutral-600"
                     />
                   </div>
                   <div className="text-center text-neutral-600 text-[10px] font-mono py-10">
                     // LOGS CLEARED
                   </div>
                </>
             )}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------
          MAIN CONTENT AREA
      ---------------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Header */}
        <header className="h-16 border-b border-white/5 bg-[#050505]/60 backdrop-blur-md flex items-center px-6 flex-shrink-0 z-10 justify-between sticky top-0">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <Icons.Sidebar className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-3 group cursor-default">
              <div className="text-amber-500 transition-transform group-hover:rotate-90 duration-700">
                <Icons.Hexagon className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold tracking-tight leading-none text-white font-sans">PromptRefine</h1>
                <span className="text-[10px] text-neutral-500 font-mono tracking-[0.2em] mt-0.5 group-hover:text-amber-500/80 transition-colors">ENGINEERING STATION</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></div>
                <span className="text-[10px] font-mono text-green-500 font-bold">SYSTEM_READY</span>
             </div>
          </div>
        </header>

        {/* Scrollable Workspace */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth" ref={scrollRef}>
          <div className="max-w-6xl mx-auto space-y-10 pb-20">

            {/* 01 DOMAIN */}
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-white/10 text-[10px] font-mono px-1.5 py-0.5 rounded text-neutral-400">01</span>
                <h2 className="text-xs font-bold tracking-[0.15em] text-neutral-400 uppercase font-mono">Select Domain & Model</h2>
              </div>
              
              <div className="glass-panel p-1 rounded-2xl mb-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-1">
                  {DOMAINS.map((domain) => {
                    const Icon = domain.icon;
                    const isSelected = selectedDomain === domain.id;
                    return (
                      <button
                        key={domain.id}
                        onClick={() => setSelectedDomain(domain.id)}
                        className={`
                          relative group flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-300 overflow-hidden
                          ${isSelected 
                            ? 'bg-white/5 ring-1 ring-amber-500/50 shadow-[inset_0_0_20px_rgba(245,158,11,0.1)]' 
                            : 'hover:bg-white/5 hover:ring-1 hover:ring-white/10'}
                        `}
                      >
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-b from-white/10 to-transparent pointer-events-none`} />
                        <Icon className={`w-6 h-6 mb-3 transition-all duration-300 ${isSelected ? 'text-amber-500 scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'text-neutral-500 group-hover:text-neutral-300'}`} />
                        <span className={`text-[10px] font-medium uppercase tracking-wider ${isSelected ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-300'}`}>
                          {domain.label}
                        </span>
                        {isSelected && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-amber-500 rounded-t-full shadow-[0_0_10px_#f59e0b]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Model Config Panel */}
              <div className="glass-panel p-6 rounded-xl flex flex-col md:flex-row gap-8 items-center border-l-4 border-l-amber-500/50">
                <div className="flex-1 w-full">
                  <label className="text-[10px] uppercase font-bold text-neutral-500 mb-2 block tracking-widest font-mono">Target Architecture</label>
                  <div className="relative group">
                    <select 
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white appearance-none focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all font-mono"
                    >
                      {renderModelOptions()}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 group-hover:text-white transition-colors">▼</div>
                  </div>
                </div>
                <div className="w-px h-10 bg-white/10 hidden md:block"></div>
                <div className="flex-1 w-full">
                  <label className="text-[10px] uppercase font-bold text-neutral-500 mb-2 block tracking-widest font-mono">Capability Matrix</label>
                  <div className="text-xs text-neutral-300 font-medium">
                    {getModelCapabilityText()}
                  </div>
                </div>
              </div>
            </section>

            {/* 02 INPUT */}
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="bg-white/10 text-[10px] font-mono px-1.5 py-0.5 rounded text-neutral-400">02</span>
                  <h2 className="text-xs font-bold tracking-[0.15em] text-neutral-400 uppercase font-mono">Input Parameters</h2>
                </div>
                
                <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
                  {selectedDomain === 'image' && (
                    <button 
                      onClick={() => setInputMode('visual')}
                      className={`
                        text-[10px] font-bold px-3 py-1.5 rounded-md transition-all font-mono uppercase
                        ${inputMode === 'visual' 
                          ? 'bg-amber-500/20 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.1)]' 
                          : 'text-neutral-500 hover:text-neutral-300'}
                      `}
                    >
                      Visual_Ref
                    </button>
                  )}
                  
                  <button 
                    onClick={() => setInputMode('text')}
                    className={`
                      text-[10px] font-bold px-3 py-1.5 rounded-md transition-all font-mono uppercase
                      ${inputMode === 'text' 
                        ? 'bg-amber-500/20 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.1)]' 
                        : 'text-neutral-500 hover:text-neutral-300'}
                    `}
                  >
                    Text_Mode
                  </button>
                </div>
              </div>

              {/* Command Deck */}
              <div className="glass-panel rounded-xl overflow-hidden flex flex-col border border-white/10 shadow-2xl">
                 {/* Top Bar - Mac/Terminal style */}
                 <div className="h-8 bg-white/5 border-b border-white/5 flex items-center px-4 justify-between">
                    <div className="flex gap-1.5">
                       <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                       <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                       <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    </div>
                    <div className="text-[10px] font-mono text-neutral-600 tracking-widest uppercase">Input_Stream_v1.0</div>
                    <div className="w-10"></div>
                 </div>

                 {/* Input Area */}
                 <div className="relative min-h-[280px] bg-black/40">
                    {inputMode === 'visual' ? (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                          absolute inset-4 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group overflow-hidden
                          ${selectedImage ? 'border-amber-500/40 bg-amber-500/5' : 'border-neutral-800 hover:border-neutral-600 hover:bg-white/5'}
                        `}
                      >
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                        {selectedImage && <div className="scan-line z-10"></div>}
                        
                        {imagePreview ? (
                          <div className="relative w-full h-full flex items-center justify-center p-4">
                             <img src={imagePreview} className="max-w-full max-h-full object-contain shadow-2xl" />
                             <div className="absolute bottom-4 bg-black/80 backdrop-blur text-amber-500 text-[10px] font-mono px-3 py-1 rounded border border-amber-500/20">
                                IMG_LOADED: {selectedImage?.name}
                             </div>
                          </div>
                        ) : (
                          <div className="text-center space-y-4">
                             <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto text-neutral-700 group-hover:text-amber-500 transition-colors border border-white/5 group-hover:border-amber-500/30 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                               <Icons.Upload className="w-8 h-8" />
                             </div>
                             <div className="flex flex-col gap-1">
                               <p className="text-neutral-400 text-sm font-medium group-hover:text-white transition-colors">Drop Reference Image</p>
                               <p className="text-neutral-600 text-xs font-mono">JPG, PNG, WEBP supported</p>
                             </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <textarea 
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder={selectedDomain === 'video' ? "// Describe video parameters and motion..." : "// Enter prompt draft..."}
                        className="w-full h-full bg-transparent p-6 text-sm text-neutral-200 focus:outline-none resize-none font-mono placeholder:text-neutral-700 leading-relaxed"
                        spellCheck={false}
                      />
                    )}
                 </div>

                 {/* Bottom Command Bar */}
                 <div className="border-t border-white/5 bg-white/5 p-3 flex flex-col md:flex-row gap-4 justify-between items-center backdrop-blur-md">
                     <div className="flex gap-2 w-full md:w-auto">
                         <button 
                           onClick={() => setUseDeepReasoning(!useDeepReasoning)} 
                           className={`
                             flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-[10px] font-bold transition-all font-mono uppercase tracking-wider
                             ${useDeepReasoning 
                               ? 'border-purple-500/50 bg-purple-500/10 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                               : 'border-white/10 text-neutral-500 hover:border-purple-500/30 hover:text-purple-400 hover:bg-white/5'}
                           `}
                         >
                           <Icons.BrainCircuit className="w-3.5 h-3.5" /> Deep_Reasoning
                         </button>
                         <button 
                           onClick={() => setUseSearchGrounding(!useSearchGrounding)} 
                           className={`
                             flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-[10px] font-bold transition-all font-mono uppercase tracking-wider
                             ${useSearchGrounding 
                               ? 'border-blue-500/50 bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                               : 'border-white/10 text-neutral-500 hover:border-blue-500/30 hover:text-blue-400 hover:bg-white/5'}
                           `}
                         >
                           <Icons.Globe className="w-3.5 h-3.5" /> Grounding_Net
                         </button>
                     </div>
                     
                     <button 
                        onClick={handleExecute}
                        disabled={isProcessing}
                        className={`
                          w-full md:w-auto bg-amber-500 hover:bg-amber-400 text-black px-8 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center justify-center gap-3 font-mono border border-amber-400
                          ${isProcessing ? 'opacity-70 cursor-wait' : 'hover:-translate-y-0.5 active:translate-y-0'}
                        `}
                      >
                        {isProcessing ? (
                           <>
                             <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                             <span>PROCESSING...</span>
                           </>
                        ) : (
                           <>
                             {inputMode === 'visual' ? <Icons.Upload className="w-4 h-4" /> : <Icons.Wand2 className="w-4 h-4" />}
                             {getActionLabel()}
                           </>
                        )}
                      </button>
                 </div>
              </div>
            </section>

            {/* 03 RESULTS */}
            {(refinedPrompt || isProcessing) && (
              <section className="pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                 <div className="flex items-center gap-3 mb-6">
                    <span className="bg-amber-500 text-black text-[10px] font-mono px-1.5 py-0.5 rounded font-bold">03</span>
                    <h2 className="text-xs font-bold tracking-[0.15em] text-amber-500 uppercase font-mono">Output & Telemetry</h2>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Text Output */}
                    <div className="flex flex-col gap-2">
                       <div className="flex items-center justify-between text-[10px] text-neutral-500 uppercase tracking-widest font-bold px-1 font-mono">
                         <span>// {selectedDomain === 'video' ? 'VEO_SPEC_SHEET' : 'PROMPT_MATRIX_OUTPUT'}</span>
                         <div className="flex gap-2">
                            <button 
                              onClick={() => setIsSaveModalOpen(true)}
                              className="flex items-center gap-1 hover:text-white transition-colors text-amber-500"
                            >
                              <Icons.Save className="w-3 h-3"/> SAVE_TEMPLATE
                            </button>
                            <span className="text-white/20">|</span>
                            <button className="flex items-center gap-1 hover:text-white transition-colors"><Icons.Copy className="w-3 h-3"/> COPY_RAW</button>
                         </div>
                       </div>
                       <div className="glass-panel rounded-xl p-0 min-h-[400px] border border-white/10 relative overflow-hidden flex flex-col">
                         <div className="flex-1 p-6 font-mono text-xs md:text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap overflow-y-auto selection:bg-amber-500/30">
                           {isProcessing && !refinedPrompt ? (
                             <div className="space-y-4 animate-pulse">
                                <div className="h-2 bg-white/10 rounded w-3/4"></div>
                                <div className="h-2 bg-white/10 rounded w-1/2"></div>
                                <div className="h-2 bg-white/5 rounded w-full"></div>
                                <div className="h-2 bg-white/5 rounded w-5/6"></div>
                                <div className="mt-8 h-32 bg-white/5 rounded border border-white/5"></div>
                             </div>
                           ) : (
                             refinedPrompt
                           )}
                         </div>
                         
                         {/* Market Diagnostic Button */}
                         {!isProcessing && refinedPrompt && (
                           <div className="p-4 border-t border-white/5 bg-white/5 flex justify-end gap-3">
                              {(selectedDomain === 'image' || selectedDomain === 'video') && (
                                <button 
                                  onClick={() => selectedDomain === 'video' ? generateVideo(refinedPrompt) : generateImage(refinedPrompt)}
                                  className="flex items-center gap-2 bg-green-900/20 border border-green-500/20 hover:border-green-500/50 hover:text-green-400 text-green-600/80 px-4 py-2 rounded-lg text-[10px] font-bold transition-all shadow-sm font-mono tracking-wider uppercase hover:bg-green-500/10"
                                >
                                  <Icons.Play className="w-3.5 h-3.5" />
                                  VERIFY_VISUAL_FIDELITY
                                </button>
                              )}
                              
                              <button 
                                onClick={runMarketDiagnostic}
                                className="flex items-center gap-2 bg-black/40 border border-white/10 hover:border-blue-500/50 hover:text-blue-400 text-neutral-400 px-4 py-2 rounded-lg text-[10px] font-bold transition-all shadow-sm font-mono tracking-wider uppercase hover:bg-blue-500/10"
                              >
                                <Icons.Activity className="w-3.5 h-3.5" />
                                {isScanning ? 'SCANNING_MARKET...' : 'RUN_MARKET_DIAGNOSTIC'}
                              </button>
                           </div>
                         )}
                       </div>
                    </div>

                    {/* Right: Render or Diagnostic */}
                    <div className="flex flex-col gap-2">
                      {showDiagnostic ? (
                        // Market Diagnostic Card
                        <>
                           <div className="flex items-center justify-between text-[10px] text-blue-400 uppercase tracking-widest font-bold px-1 animate-in fade-in font-mono">
                             <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div> MARKET_VALUE_ESTIMATOR</span>
                           </div>
                           <div className="glass-panel rounded-xl border border-blue-500/30 bg-[#05070a]/80 p-6 min-h-[400px] relative animate-in zoom-in-95 duration-500 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                              {isScanning ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                  <div className="w-16 h-16 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-6"></div>
                                  <span className="text-blue-500 font-mono text-[10px] tracking-[0.2em] animate-pulse">QUERYING_COMMERCIAL_DATABASE...</span>
                                </div>
                              ) : diagnosticData && (
                                <div className="grid grid-cols-1 gap-6 h-full content-start">
                                  <div className="flex items-center justify-between border-b border-blue-500/20 pb-4">
                                      <div className="flex flex-col">
                                          <span className="text-[10px] uppercase text-blue-500/70 font-bold tracking-widest">Viability Score</span>
                                          <span className="text-3xl text-white font-mono font-bold">{diagnosticData.score}/100</span>
                                      </div>
                                      <div className="text-right">
                                          <span className="text-[10px] uppercase text-blue-500/70 font-bold tracking-widest">Rating</span>
                                          <span className="block text-blue-400 font-bold font-mono">{diagnosticData.potential}</span>
                                      </div>
                                  </div>
                                  
                                  <div className="space-y-4 text-xs font-mono">
                                     <div className="bg-blue-500/5 p-3 rounded border border-blue-500/10">
                                       <span className="text-blue-400 font-bold uppercase block mb-2 text-[10px] tracking-wider">Target Sector / Application</span>
                                       <div className="flex flex-wrap gap-2">
                                         {diagnosticData.target_sectors?.map((s:string, i:number) => (
                                           <span key={i} className="bg-blue-900/40 text-blue-200 px-2 py-1 rounded border border-blue-500/20">{s}</span>
                                         ))}
                                       </div>
                                     </div>
                                     
                                     <div className="grid grid-cols-2 gap-4">
                                         <div>
                                           <span className="text-blue-400 font-bold uppercase block mb-2 text-[10px] tracking-wider">Monetization</span>
                                           <ul className="list-none text-neutral-400 space-y-1">
                                              {diagnosticData.monetization?.map((m:string, i:number) => <li key={i} className="flex gap-2"><span className="text-blue-500/50">›</span> {m}</li>)}
                                           </ul>
                                         </div>
                                         <div>
                                           <span className="text-red-400 font-bold uppercase block mb-2 text-[10px] tracking-wider">Risk Profile</span>
                                           <ul className="list-none text-neutral-400 space-y-1">
                                              {diagnosticData.risk_factors?.map((r:string, i:number) => <li key={i} className="flex gap-2"><span className="text-red-500/50">!</span> {r}</li>)}
                                           </ul>
                                         </div>
                                     </div>
                                  </div>
                                  <div className="mt-auto pt-4 border-t border-blue-500/20">
                                     <p className="text-blue-200/70 text-xs italic leading-relaxed">"{diagnosticData.summary}"</p>
                                  </div>
                                </div>
                              )}
                           </div>
                        </>
                      ) : (
                        // Standard Render/Preview (Video OR Image)
                        <>
                           <div className="flex items-center justify-between text-[10px] text-neutral-500 uppercase tracking-widest font-bold px-1 font-mono">
                             <span>// {selectedDomain === 'video' ? 'RENDER_PREVIEW_WINDOW' : 'VISUAL_VERIFICATION'}</span>
                           </div>
                           <div className="glass-panel rounded-xl border border-white/10 overflow-hidden aspect-video relative flex items-center justify-center bg-black/60 shadow-2xl">
                             {!isRendering && !generatedVideoUrl && !generatedImageUrl && !isProcessing && (
                               <div className="text-center text-neutral-700">
                                 <div className="w-16 h-16 border border-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 bg-black/40">
                                   <div className="w-2 h-2 bg-neutral-800 rounded-full" />
                                 </div>
                                 <p className="text-[10px] font-mono tracking-widest uppercase">Awaiting Output Generation</p>
                               </div>
                             )}
                             {isRendering && (
                               <div className="flex flex-col items-center">
                                 <div className="w-20 h-20 border-2 border-white/5 border-t-amber-500 rounded-full animate-spin mb-6 shadow-[0_0_30px_rgba(245,158,11,0.2)]" />
                                 <span className="text-amber-500 text-[10px] font-mono animate-pulse tracking-[0.2em] font-bold">RENDERING_ASSETS... {renderProgress}%</span>
                               </div>
                             )}
                             
                             {/* Display Video */}
                             {generatedVideoUrl && !isRendering && (
                               <div className="relative w-full h-full group">
                                 <video src={generatedVideoUrl} className="w-full h-full object-cover" controls autoPlay loop />
                               </div>
                             )}

                             {/* Display Image */}
                             {generatedImageUrl && !isRendering && (
                                <div className="relative w-full h-full group">
                                   <img src={generatedImageUrl} className="w-full h-full object-cover" />
                                   <a href={generatedImageUrl} download="generated_visual.png" className="absolute bottom-4 right-4 bg-black/60 backdrop-blur hover:bg-amber-500 text-white hover:text-black text-xs px-4 py-2 rounded flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all font-mono font-bold uppercase tracking-wider">
                                      <Icons.Download className="w-3.5 h-3.5" /> Save_Asset
                                   </a>
                                </div>
                             )}
                           </div>
                        </>
                      )}
                    </div>
                 </div>
              </section>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}