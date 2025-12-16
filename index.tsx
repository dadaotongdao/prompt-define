import React, { useState, useRef, useEffect, ReactNode, memo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { 
  Hexagon, Image, Video, Pen, Code, Sparkles, BrainCircuit, Globe, 
  Upload, Copy, Library, Search, Activity, Sidebar as SidebarIcon, X, Wand2, 
  Save, Trash, Play, AlertCircle, Download, FileJson, Menu, Check,
  MonitorPlay, Terminal, Cpu, Layout, Clock, History, Zap, ChevronDown,
  Camera, Mic, Command, Settings, Key, FileUp, FileDown
} from 'lucide-react';

// -----------------------------------------------------------------------------
// 0. TYPE DEFINITIONS & ENVIRONMENT
// -----------------------------------------------------------------------------

interface ErrorBoundaryProps { children?: ReactNode; }
interface ErrorBoundaryState { hasError: boolean; error: Error | null; }

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState { return { hasError: true, error }; }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-[#030303] text-red-500 font-mono p-8 text-center flex-col gap-4">
          <div className="text-4xl">⚠️ SYSTEM FAILURE</div>
          <div className="text-sm bg-red-900/10 p-4 rounded border border-red-900/30 max-w-2xl overflow-auto text-left font-mono">
            {this.state.error?.toString()}
          </div>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-600/20 border border-red-600/50 text-red-500 rounded hover:bg-red-600/30 font-mono uppercase tracking-widest transition-all">Reboot System</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// -----------------------------------------------------------------------------
// 1. ASSETS & CONFIG
// -----------------------------------------------------------------------------
const Icons = {
  Hexagon, Image, Video, Pen, Code, Sparkles, BrainCircuit, Globe,
  Upload, Copy, Library, Search, Activity, Sidebar: SidebarIcon, X, Wand2,
  Save, Trash, Play, AlertCircle, Download, FileJson, Menu, Check,
  MonitorPlay, Terminal, Cpu, Layout, Clock, History, Zap, ChevronDown,
  Camera, Mic, Command, Settings, Key, FileUp, FileDown
};

export type Domain = 'image' | 'video' | 'writing' | 'code' | 'general';
type InputMode = 'visual' | 'text';
type ProcessStage = 'idle' | 'analyzing' | 'optimizing' | 'rendering' | 'complete' | 'error';

// Standard model list for text tasks
const TEXT_MODELS = ["GPT-5.2", "Gemini 3 Pro", "Claude 4.5 Opus", "Claude 4.5 Sonnet", "Grok 4.1"];

export const DOMAIN_CONFIG: Record<Domain, {
  label: string;
  icon: React.FC<{className?: string}>;
  defaultModel: string;
  models: string[];
  capabilityText: string;
  placeholder: string;
}> = {
  image: {
    label: 'Image Generation',
    icon: Icons.Image,
    defaultModel: 'Midjourney v7',
    models: ["Midjourney v7", "FLUX 2.0", "Stable Diffusion 3", "Nano Banana Pro"],
    capabilityText: "Visual Parameters: Stylize, Chaos, Aspect Ratio, Lighting, Lens choice.",
    placeholder: "// Enter visual concept, mood, lighting, and composition details..."
  },
  video: {
    label: 'Video Creation',
    icon: Icons.Video,
    defaultModel: 'Veo 3.1',
    models: ["Veo 3.1", "Sora 2"],
    capabilityText: "Motion Dynamics: Physics, Camera Path, Transitions, Temporal consistency.",
    placeholder: "// Describe scene motion, camera angles, and atmosphere..."
  },
  writing: {
    label: 'Creative Writing',
    icon: Icons.Pen,
    defaultModel: 'Claude 4.5 Sonnet',
    models: TEXT_MODELS,
    capabilityText: "Nuance Control: Tone, Pacing, Rhetorical Structure, Audience adaptation.",
    placeholder: "// Enter story concept, article topic, or draft to refine..."
  },
  code: {
    label: 'Software Eng.',
    icon: Icons.Code,
    defaultModel: 'Claude 4.5 Opus',
    models: TEXT_MODELS,
    capabilityText: "Logic & Arch: Clean Code, Design Patterns, Security, Optimization.",
    placeholder: "// Paste code snippet, error log, or feature requirement..."
  },
  general: {
    label: 'General Assistant',
    icon: Icons.Sparkles,
    defaultModel: 'GPT-5.2',
    models: TEXT_MODELS,
    capabilityText: "Reasoning: Chain of Thought, Fact-Checking, Planning, Analysis.",
    placeholder: "// Ask complex reasoning question or general inquiry..."
  }
};

const MODEL_PROFILES: Record<string, string> = {
  "GPT-5.2": "# ARCHITECTURE: GPT-5.2\n- **Strength**: High reasoning, instruction following.\n- **Strategy**: Chain-of-Thought, Validation Steps.",
  "Claude 4.5 Sonnet": "# ARCHITECTURE: Claude 4.5 Sonnet\n- **Strength**: Nuanced writing, rapid coding, visual analysis.\n- **Preference**: XML Tags <constraint>, Socratic Method.",
  "Claude 4.5 Opus": "# ARCHITECTURE: Claude 4.5 Opus\n- **Strength**: Deep architectural planning, complex system design.\n- **Preference**: Comprehensive context analysis, slow thinking.",
  "Grok 4.1": "# ARCHITECTURE: Grok 4.1\n- **Strength**: Real-time knowledge, wit, unfiltered reasoning.\n- **Strategy**: Direct, factual, slightly edgy tone if requested.",
  "Gemini 3 Pro": "# ARCHITECTURE: Gemini 3 Pro\n- **Strength**: Multimodal Native, Long Context (2M+ tokens).\n- **Preference**: Markdown Headers, Bullet points, Image grounding.",
  "Veo 3.1": "# ARCHITECTURE: Veo Video\n- **Preference**: Physics-based motion descriptors, Continuity, Cinematic terminology.",
  "Sora 2": "# ARCHITECTURE: Sora 2\n- **Preference**: Hyper-realistic texture descriptions, Physics simulation."
};

const DOMAIN_PERSONAS: Partial<Record<Domain, string>> = {
  code: "ROLE: Principal Software Architect. OUTPUT: Clean, Modular, Secure Code. Follow SOLID principles.",
  writing: "ROLE: Best-Selling Author & Editor. OUTPUT: Show, don't tell. Focus on pacing, tone, and sensory details.",
  image: "ROLE: AI Art Director. OUTPUT: Subject, Environment, Lighting, Style, Composition, Technical Parameters.",
  video: "ROLE: Cinematographer. OUTPUT: Camera Movement (Pan/Tilt/Zoom), Subject Action, Atmosphere, Film Stock."
};

interface SavedTemplate {
  id: string;
  title: string;
  category: string;
  content: string;
  domain: Domain;
  createdAt: number;
}

interface DiagnosticData {
  score: number;
  potential: string;
  target_sectors: string[];
  monetization: string[];
  risk_factors: string[];
  summary: string;
}

// -----------------------------------------------------------------------------
// 2. UTILITIES
// -----------------------------------------------------------------------------

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// SECURITY ARCHITECTURE: Dual-Source Credential Strategy
// Priority: 1. User LocalStorage Key (BYOK) -> 2. Process Env Key (Deployment)
const getApiKey = (): string | undefined => {
  const localKey = localStorage.getItem('prompt_refine_api_key');
  if (localKey && localKey.trim().length > 0) return localKey;
  return process.env.API_KEY;
};

const FormattedOutput = memo(({ text }: { text: string }) => {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="space-y-1 font-mono text-xs md:text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">
      {lines.map((line, i) => {
        if (line.startsWith('## ') || line.startsWith('# ')) {
          return <div key={i} className="text-amber-500 font-bold mt-4 mb-2 tracking-wide uppercase border-l-2 border-amber-500/50 pl-3">{line.replace(/^#+ /, '')}</div>;
        }
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <div key={i} className="min-h-[1em]">
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) return <span key={j} className="text-white font-bold bg-white/5 rounded px-1 shadow-[0_0_10px_rgba(255,255,255,0.1)]">{part.slice(2, -2)}</span>;
              return part;
            })}
          </div>
        );
      })}
    </div>
  );
});

// -----------------------------------------------------------------------------
// 3. PURE COMPONENTS (Visual System V3.0)
// -----------------------------------------------------------------------------

// ConfigPanel: The "Cinematic Card" Deck
const ConfigPanel = memo(({
  selectedDomain,
  onSelectDomain,
  selectedModel,
  onSelectModel
}: {
  selectedDomain: Domain;
  onSelectDomain: (d: Domain) => void;
  selectedModel: string;
  onSelectModel: (m: string) => void;
}) => {
  const config = DOMAIN_CONFIG[selectedDomain];

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
      
      {/* Cinematic Domain Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 h-[120px] md:h-[140px]">
        {Object.keys(DOMAIN_CONFIG).map((key) => {
          const domainKey = key as Domain;
          const item = DOMAIN_CONFIG[domainKey];
          const Icon = item.icon;
          const isSelected = selectedDomain === domainKey;
          
          return (
            <button
              key={domainKey}
              onClick={() => onSelectDomain(domainKey)}
              className={`
                obsidian-card group flex flex-col items-center justify-center p-4 cursor-pointer
                ${isSelected ? 'active' : 'opacity-60 hover:opacity-100'}
              `}
            >
              {/* Diffusion Spot for Ambient Light behind icon */}
              <div className="diffusion-spot top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
              
              <Icon 
                className={`
                  w-8 h-8 mb-3 z-10 transition-all duration-300
                  ${isSelected ? 'text-white scale-110 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'text-neutral-500 group-hover:text-neutral-300'}
                `} 
              />
              <span 
                className={`
                  text-[10px] font-bold uppercase tracking-[0.2em] z-10 transition-colors duration-300
                  ${isSelected ? 'text-white text-glow' : 'text-neutral-500 group-hover:text-neutral-400'}
                `}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Model & Capability - "Floating Island" Bar */}
      <div className="obsidian-card p-0 flex flex-col md:flex-row items-stretch min-h-[80px] overflow-hidden">
         
         {/* Model Selector Section */}
         <div className="flex-1 p-5 md:p-6 flex flex-col justify-center relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <label className="text-[9px] uppercase font-bold text-neutral-500 tracking-[0.15em] mb-2 flex items-center gap-2">
              <Icons.Cpu className="w-3 h-3" /> Target Architecture
            </label>
            <div className="relative z-10 flex items-center gap-3">
              <select 
                value={selectedModel}
                onChange={(e) => onSelectModel(e.target.value)}
                className="bg-transparent text-lg md:text-xl font-bold text-white outline-none appearance-none cursor-pointer w-full font-mono tracking-tight hover:text-amber-500 transition-colors"
              >
                {config.models.map(m => <option key={m} value={m} className="bg-[#121214] py-2">{m}</option>)}
              </select>
              <Icons.ChevronDown className="w-4 h-4 text-neutral-600 pointer-events-none" />
            </div>
         </div>

         {/* Divider */}
         <div className="w-px bg-white/5 md:my-4 mx-4 md:mx-0"></div>

         {/* Capabilities Text Section */}
         <div className="flex-[2] p-5 md:p-6 flex flex-col justify-center bg-white/[0.01]">
            <label className="text-[9px] uppercase font-bold text-neutral-500 tracking-[0.15em] mb-1.5 flex items-center gap-2">
              <Icons.Activity className="w-3 h-3" /> System Capability
            </label>
            <p className="text-xs text-neutral-400 font-sans leading-relaxed opacity-80">{config.capabilityText}</p>
         </div>
      </div>
    </div>
  );
});

// -----------------------------------------------------------------------------
// 4. SMART COMPONENTS
// -----------------------------------------------------------------------------

// InputDeck: The "Control Console"
const InputDeck = ({
  domain,
  templateToLoad,
  isProcessing,
  onExecute,
  onSaveInput
}: {
  domain: Domain;
  templateToLoad: SavedTemplate | null;
  isProcessing: boolean;
  onExecute: (text: string, mode: InputMode, image: File | null, useDeep: boolean, useSearch: boolean) => void;
  onSaveInput: (text: string) => void;
}) => {
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [useDeep, setUseDeep] = useState(false);
  const [useSearch, setUseSearch] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const config = DOMAIN_CONFIG[domain];

  useEffect(() => {
    if (templateToLoad) {
      setText(templateToLoad.content);
      setInputMode('text');
    }
  }, [templateToLoad]);

  useEffect(() => {
    if (domain === 'image') setInputMode('visual');
    else setInputMode('text');
  }, [domain]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0];
      setImage(f);
      setImagePreview(URL.createObjectURL(f));
      setInputMode('visual');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="obsidian-card flex-1 flex flex-col overflow-hidden min-h-[400px]">
        {/* Header Control Bar */}
        <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-white/[0.01]">
           <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 tracking-widest">
              <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]"></span>
              INPUT_MATRIX
           </div>
           
           {/* Mode Switcher */}
           <div className="flex bg-black/40 rounded-lg p-0.5 border border-white/5 shadow-inner">
              <button 
                onClick={() => setInputMode('visual')} 
                className={`px-3 py-1 text-[9px] font-bold uppercase rounded transition-all ${inputMode === 'visual' ? 'bg-white/10 text-white shadow-sm' : 'text-neutral-600 hover:text-neutral-400'}`}
              >
                <Icons.Camera className="w-3 h-3 inline mr-1" /> Visual
              </button>
              <button 
                onClick={() => setInputMode('text')} 
                className={`px-3 py-1 text-[9px] font-bold uppercase rounded transition-all ${inputMode === 'text' ? 'bg-white/10 text-white shadow-sm' : 'text-neutral-600 hover:text-neutral-400'}`}
              >
                <Icons.Command className="w-3 h-3 inline mr-1" /> Text
              </button>
           </div>
        </div>
        
        {/* Input Area */}
        <div className="flex-1 relative group/input">
          {inputMode === 'visual' ? (
             <div onClick={() => fileInputRef.current?.click()} className="absolute inset-4 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-500/40 hover:bg-amber-500/[0.02] transition-all duration-300">
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
                {imagePreview ? (
                  <div className="relative w-full h-full p-4 flex items-center justify-center">
                    <img src={imagePreview} className="max-h-full max-w-full object-contain rounded shadow-2xl border border-white/10" />
                    <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur px-3 py-1.5 rounded border border-white/10 text-[9px] text-white font-mono">
                      {image?.name}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-neutral-600 transition-transform duration-300 group-hover/input:scale-105">
                    <Icons.Upload className="w-8 h-8 mx-auto mb-3 opacity-40" />
                    <span className="text-xs font-mono block mb-1 tracking-wider text-neutral-500">UPLOAD_SOURCE_MATERIAL</span>
                  </div>
                )}
             </div>
          ) : (
            <textarea 
              value={text} 
              onChange={e => setText(e.target.value)} 
              placeholder={config.placeholder}
              className="w-full h-full bg-transparent p-6 text-sm font-mono text-neutral-300 resize-none focus:outline-none custom-scrollbar placeholder:text-neutral-700 leading-relaxed selection:bg-amber-500/30"
              spellCheck={false}
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white/[0.01] border-t border-white/5 space-y-4">
           {/* Toggles */}
           <div className="flex gap-3">
             <button onClick={() => setUseDeep(!useDeep)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded border text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${useDeep ? 'border-purple-500/50 bg-purple-500/10 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'border-white/5 bg-black/20 text-neutral-600 hover:border-white/10 hover:text-neutral-400'}`}>
                <Icons.BrainCircuit className="w-3.5 h-3.5" /> Deep Reason
             </button>
             <button onClick={() => setUseSearch(!useSearch)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded border text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${useSearch ? 'border-blue-500/50 bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'border-white/5 bg-black/20 text-neutral-600 hover:border-white/10 hover:text-neutral-400'}`}>
                <Icons.Globe className="w-3.5 h-3.5" /> Grounding
             </button>
           </div>

           {/* Primary Actions */}
           <div className="flex gap-3">
             <button onClick={() => onSaveInput(text)} disabled={!text} className="px-5 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white transition-colors border border-white/5">
                <Icons.Save className="w-4 h-4" />
             </button>
             <button 
               onClick={() => onExecute(text, inputMode, image, useDeep, useSearch)} 
               disabled={isProcessing || (!text && !image)}
               className={`
                 flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-[0.15em] rounded-lg 
                 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_35px_rgba(245,158,11,0.4)] 
                 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none 
                 transition-all flex items-center justify-center gap-2 active:scale-[0.98] active:translate-y-0.5
               `}
             >
               {isProcessing ? <Icons.Cpu className="w-4 h-4 animate-spin" /> : <Icons.Zap className="w-4 h-4 fill-current" />}
               {isProcessing ? 'PROCESSING...' : 'INITIATE'}
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

// RenderPreview
const RenderPreview = ({ 
  domain, 
  stage,
  videoUrl, 
  imageUrl 
}: { 
  domain: Domain; 
  stage: ProcessStage;
  videoUrl: string | null; 
  imageUrl: string | null; 
}) => {
  if (domain !== 'video' && domain !== 'image') return null;

  return (
    <div className="obsidian-card p-1 h-[300px] flex flex-col relative overflow-hidden bg-black/80 shadow-2xl">
      {/* Status Pill */}
      <div className="absolute top-4 left-4 z-20 text-[9px] font-mono text-neutral-400 bg-black/80 backdrop-blur px-2 py-1 rounded border border-white/10 flex items-center gap-2 shadow-lg">
         <span className={`w-1.5 h-1.5 rounded-full ${stage === 'rendering' || stage === 'analyzing' ? 'bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]' : 'bg-neutral-600'}`}></span>
         {stage === 'idle' ? 'STANDBY' : stage.toUpperCase()}
      </div>
      
      {(stage === 'rendering' || stage === 'analyzing') ? (
         <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent animate-pulse"></div>
            <div className="relative z-10">
               <div className="w-16 h-16 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
            </div>
            <div className="mt-6 text-[10px] font-mono text-amber-500 tracking-[0.2em] animate-pulse">PROCESSING DATA...</div>
         </div>
      ) : (stage === 'complete' && (videoUrl || imageUrl)) ? (
        <div className="flex-1 bg-[#050505] flex items-center justify-center relative group">
           {domain === 'video' ? (
             <video src={videoUrl!} controls className="w-full h-full object-contain" autoPlay loop />
           ) : (
             <img src={imageUrl!} className="w-full h-full object-contain" alt="Generated" />
           )}
           <div className="absolute inset-0 border border-white/5 pointer-events-none"></div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center opacity-20">
           <Icons.MonitorPlay className="w-20 h-20 text-neutral-500 mb-6" />
           <div className="text-[10px] font-mono tracking-[0.3em]">NO SIGNAL</div>
        </div>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// 5. MAIN ORCHESTRATOR
// -----------------------------------------------------------------------------

function App() {
  // Global View State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Data State
  const [selectedDomain, setSelectedDomain] = useState<Domain>('general');
  const [selectedModel, setSelectedModel] = useState('Grok 4.1');
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
  
  // Execution State
  const [stage, setStage] = useState<ProcessStage>('idle');
  const [refinedPrompt, setRefinedPrompt] = useState("");
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  
  // Communication State
  const [templateToLoad, setTemplateToLoad] = useState<SavedTemplate | null>(null);
  const [tempContentToSave, setTempContentToSave] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem('promptRefine_templates');
    if (stored) try { setSavedTemplates(JSON.parse(stored)); } catch (e) {}
    setSelectedModel(DOMAIN_CONFIG[selectedDomain].defaultModel);
  }, [selectedDomain]);

  const handleExecute = async (text: string, mode: InputMode, image: File | null, useDeep: boolean, useSearch: boolean) => {
    const apiKey = getApiKey();
    const win = window as any;
    if (!apiKey && !win.aistudio) {
      setIsSettingsOpen(true);
      setRefinedPrompt("# SYSTEM ALERT: MISSING CREDENTIALS\nPlease configure your Gemini API Key in Settings to proceed.");
      return;
    }

    setStage('analyzing');
    setRefinedPrompt("");
    setDiagnosticData(null);
    setGeneratedVideoUrl(null);
    setGeneratedImageUrl(null);

    try {
      // Use dynamic key
      const ai = new GoogleGenAI({ apiKey: apiKey });
      const modelName = 'gemini-2.5-flash';
      let parts = [];
      
      const persona = DOMAIN_PERSONAS[selectedDomain] || "Expert AI Assistant";
      const arch = MODEL_PROFILES[selectedModel] || "";
      const sysInstr = `You are PromptRefine. ${persona}. \nTarget Architecture: ${selectedModel}\n${arch}\nTask: Optimize input. Output specific prompt block.`;

      if (mode === 'visual' && image) {
        const b64 = await fileToBase64(image);
        parts.push({ inlineData: { mimeType: image.type, data: b64 }});
        parts.push({ text: `Analyze visual. User Intent: ${text}` });
      } else {
        parts.push({ text: text });
      }

      const tools = [];
      if (useSearch) tools.push({ googleSearch: {} });

      const result = await ai.models.generateContent({
        model: modelName,
        contents: { parts },
        config: { systemInstruction: sysInstr, tools }
      });

      const outputText = result.text || "No output generated.";
      setRefinedPrompt(outputText);
      
      if (selectedDomain === 'video' || selectedDomain === 'image') {
        // Check for specific API key requirement for Video/Image if not using the main key
        if (!apiKey && win.aistudio?.hasSelectedApiKey) {
           const hasKey = await win.aistudio.hasSelectedApiKey();
           if (!hasKey) await win.aistudio.openSelectKey();
        }
        setStage('rendering');
        if (selectedDomain === 'video') await runVideoGen(outputText, image, apiKey);
        else await runImageGen(outputText, apiKey);
      } else {
        setStage('complete');
      }

      runDiagnostic(outputText, apiKey);

    } catch (e: any) {
      setStage('error');
      setRefinedPrompt(`Error: ${e.message}`);
    }
  };

  const runVideoGen = async (prompt: string, initImage: File | null, apiKey?: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: apiKey });
      const configPayload: any = { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' };
      const params: any = { model: 'veo-3.1-fast-generate-preview', prompt: prompt.substring(0, 300), config: configPayload };
      if (initImage) {
         const b64 = await fileToBase64(initImage);
         params.image = { imageBytes: b64, mimeType: initImage.type };
      }
      let op = await ai.models.generateVideos(params);
      while (!op.done) {
        await new Promise(r => setTimeout(r, 4000));
        op = await ai.operations.getVideosOperation({ operation: op });
      }
      if (op.response?.generatedVideos?.[0]?.video?.uri) {
         const keyToUse = apiKey || process.env.API_KEY; // Fallback for fetch
         const res = await fetch(`${op.response.generatedVideos[0].video.uri}&key=${keyToUse}`);
         const blob = await res.blob();
         setGeneratedVideoUrl(URL.createObjectURL(blob));
      }
      setStage('complete');
    } catch (e) { console.error(e); setStage('error'); }
  };

  const runImageGen = async (prompt: string, apiKey?: string) => {
     try {
       const ai = new GoogleGenAI({ apiKey: apiKey });
       const res = await ai.models.generateContent({
         model: 'gemini-3-pro-image-preview',
         contents: { parts: [{ text: prompt }] },
         config: { imageConfig: { aspectRatio: "16:9" } }
       });
       const part = res.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
       if (part?.inlineData) {
         setGeneratedImageUrl(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
       }
       setStage('complete');
     } catch (e) { console.error(e); setStage('error'); }
  };

  const runDiagnostic = async (text: string, apiKey?: string) => {
    try {
       const ai = new GoogleGenAI({ apiKey: apiKey });
       const res = await ai.models.generateContent({
         model: 'gemini-2.5-flash',
         contents: `Analyze viability: "${text.substring(0, 300)}...". JSON: {score(0-100), potential, target_sectors[], monetization[], risk_factors[], summary}`,
         config: { responseMimeType: 'application/json' }
       });
       if (res.text) setDiagnosticData(JSON.parse(res.text));
    } catch (e) {}
  };

  const handleSaveTemplate = (title: string, category: string) => {
    const t: SavedTemplate = { id: Date.now().toString(), title, category, content: tempContentToSave, domain: selectedDomain, createdAt: Date.now() };
    const next = [t, ...savedTemplates];
    setSavedTemplates(next);
    localStorage.setItem('promptRefine_templates', JSON.stringify(next));
    setIsSidebarOpen(true);
  };

  const handleImportTemplates = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const imported = JSON.parse(ev.target?.result as string);
          if (Array.isArray(imported)) {
            const merged = [...imported, ...savedTemplates].reduce((acc, current) => {
              const x = acc.find((item: SavedTemplate) => item.id === current.id);
              if (!x) return acc.concat([current]);
              return acc;
            }, []);
            setSavedTemplates(merged);
            localStorage.setItem('promptRefine_templates', JSON.stringify(merged));
          }
        } catch(err) { console.error("Import failed", err); }
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  const handleExportTemplates = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedTemplates, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "prompt_library_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="flex h-screen text-[#e5e5e5] font-sans overflow-hidden">
       <SaveModal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} onSave={handleSaveTemplate} initialTitle={tempContentToSave.substring(0, 15)} />
       <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

       {/* Sidebar */}
       <Sidebar 
         isOpen={isSidebarOpen} 
         setIsOpen={setIsSidebarOpen} 
         templates={savedTemplates} 
         onLoadTemplate={(t) => { setTemplateToLoad(t); setSelectedDomain(t.domain); setIsSidebarOpen(false); }}
         onDeleteTemplate={(id) => { 
            const n = savedTemplates.filter(t => t.id !== id); 
            setSavedTemplates(n); 
            localStorage.setItem('promptRefine_templates', JSON.stringify(n));
         }}
         onImport={handleImportTemplates}
         onExport={handleExportTemplates}
         onOpenSettings={() => setIsSettingsOpen(true)}
       />

       {/* Main Area */}
       <div className="flex-1 flex flex-col h-full overflow-hidden relative transition-all duration-500 ease-in-out">
          
          {/* Header */}
          <header className="h-16 flex-shrink-0 border-b border-white/5 bg-[#030303]/80 backdrop-blur-md flex items-center justify-between px-8 z-20">
             <div className="flex items-center gap-6">
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-neutral-500 hover:text-white transition-colors"><Icons.Menu className="w-5 h-5" /></button>
                <div className="flex items-center gap-3">
                   <div className="relative">
                     <Icons.Hexagon className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                     <div className="absolute inset-0 bg-amber-500 blur-lg opacity-40"></div>
                   </div>
                   <h1 className="font-bold text-lg tracking-tight text-white/90">PromptRefine <span className="text-[10px] text-neutral-600 font-mono tracking-widest ml-3 border border-white/5 px-1.5 py-0.5 rounded bg-white/[0.02]">OBSIDIAN_V3</span></h1>
                </div>
             </div>
             <div className="flex items-center gap-3">
               <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-neutral-500 bg-white/[0.03] px-3 py-1.5 rounded border border-white/5">
                  <span className={`w-1.5 h-1.5 rounded-full ${stage !== 'idle' ? 'bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]' : 'bg-emerald-500'}`}></span>
                  {stage === 'idle' ? 'SYSTEM READY' : 'PROCESSING'}
               </div>
             </div>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
             {/* 1. CONFIG PANEL */}
             <div className="max-w-[1400px] mx-auto w-full">
                <ConfigPanel 
                   selectedDomain={selectedDomain} 
                   onSelectDomain={setSelectedDomain} 
                   selectedModel={selectedModel} 
                   onSelectModel={setSelectedModel} 
                />
             </div>

             {/* 2. MAIN WORKSPACE */}
             <div className="max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row gap-6 h-[calc(100vh-360px)] min-h-[550px]">
                
                {/* LEFT: INPUT */}
                <div className="w-full lg:w-5/12 flex flex-col gap-3 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
                   <div className="flex items-center gap-3 pl-1">
                      <span className="text-[10px] font-mono text-neutral-600 tracking-[0.2em]">02 // SOURCE</span>
                   </div>
                   <InputDeck 
                      domain={selectedDomain}
                      templateToLoad={templateToLoad}
                      isProcessing={stage !== 'idle' && stage !== 'complete' && stage !== 'error'}
                      onExecute={handleExecute}
                      onSaveInput={(t) => { setTempContentToSave(t); setIsSaveModalOpen(true); }}
                   />
                </div>

                {/* RIGHT: OUTPUT */}
                <div className="w-full lg:w-7/12 flex flex-col gap-3 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
                   <div className="flex items-center justify-between pl-1">
                      <span className="text-[10px] font-mono text-amber-500 tracking-[0.2em] shadow-amber-500/20 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]">03 // OUTPUT_STREAM</span>
                      <div className="flex gap-4">
                        <button onClick={() => { setTempContentToSave(refinedPrompt); setIsSaveModalOpen(true); }} className="text-[10px] font-bold text-neutral-600 hover:text-white flex items-center gap-1.5 uppercase tracking-wider transition-colors"><Icons.Save className="w-3 h-3" /> Save</button>
                        <button onClick={() => navigator.clipboard.writeText(refinedPrompt)} className="text-[10px] font-bold text-neutral-600 hover:text-white flex items-center gap-1.5 uppercase tracking-wider transition-colors"><Icons.Copy className="w-3 h-3" /> Copy</button>
                      </div>
                   </div>

                   <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                      {/* Render Preview */}
                      {(selectedDomain === 'video' || selectedDomain === 'image') && (
                         <div className="flex-shrink-0">
                           <RenderPreview domain={selectedDomain} stage={stage} videoUrl={generatedVideoUrl} imageUrl={generatedImageUrl} />
                         </div>
                      )}
                      
                      {/* Diagnostic */}
                      {diagnosticData && (
                        <div className="obsidian-card p-4 flex flex-col gap-2 shrink-0">
                           <div className="flex justify-between items-center border-b border-white/5 pb-2">
                              <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider flex items-center gap-2">
                                <Icons.Activity className="w-3 h-3" /> Viability Score
                              </span>
                              <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${diagnosticData.potential.includes('High') ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'}`}>{diagnosticData.score}/100</span>
                           </div>
                           <p className="text-[10px] text-neutral-400 leading-relaxed font-mono line-clamp-2">{diagnosticData.summary}</p>
                        </div>
                      )}

                      {/* Terminal Output */}
                      <div className="flex-1 obsidian-card flex flex-col min-h-0 relative shadow-2xl">
                         {/* Header */}
                         <div className="h-10 border-b border-white/5 flex items-center px-4 gap-3 bg-white/[0.01]">
                            <div className="flex gap-1.5">
                               <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                               <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                               <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
                            </div>
                            <span className="text-[9px] font-mono text-neutral-600 tracking-widest ml-2">TERMINAL_OUT</span>
                         </div>
                         {/* Content */}
                         <div className="p-6 overflow-y-auto flex-1 font-mono text-sm selection:bg-amber-500/30 custom-scrollbar">
                            {refinedPrompt ? <FormattedOutput text={refinedPrompt} /> : (
                               <div className="text-neutral-800 flex flex-col items-center justify-center h-full gap-4 opacity-50">
                                  <Icons.Terminal className="w-12 h-12" />
                                  <span className="text-[10px] tracking-[0.3em] font-bold">AWAITING OUTPUT</span>
                               </div>
                            )}
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// 6. HELPER COMPONENTS
// -----------------------------------------------------------------------------

const SettingsModal = ({ isOpen, onClose }: any) => {
  const [key, setKey] = useState(localStorage.getItem('prompt_refine_api_key') || "");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) setKey(localStorage.getItem('prompt_refine_api_key') || "");
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('prompt_refine_api_key', key);
    onClose();
  };

  if(!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
       <div className="w-[450px] obsidian-card p-8 space-y-6 shadow-[0_0_100px_rgba(0,0,0,1)] border-white/10">
          <h3 className="text-amber-500 font-bold font-mono text-sm uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-4">
            <Icons.Settings className="w-4 h-4" /> System Configuration
          </h3>
          
          <div className="space-y-4">
            <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-lg">
              <p className="text-[10px] text-amber-500 leading-relaxed font-mono">
                <Icons.AlertCircle className="w-3 h-3 inline mr-1" />
                BYOK (Bring Your Own Key) enabled. Your API key is stored locally in your browser and never transmitted to any third-party server.
              </p>
            </div>
            
            <div>
              <label className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2 block">Gemini API Key</label>
              <div className="relative">
                <input 
                  type={isVisible ? "text" : "password"} 
                  value={key} 
                  onChange={e=>setKey(e.target.value)} 
                  placeholder="AIzaSy..."
                  className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-10 py-3 text-sm text-white focus:border-amber-500/50 outline-none transition-colors font-mono tracking-wider" 
                />
                <Icons.Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
                <button onClick={() => setIsVisible(!isVisible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white">
                  {isVisible ? <div className="text-[10px]">HIDE</div> : <div className="text-[10px]">SHOW</div>}
                </button>
              </div>
              <div className="mt-2 text-[9px] text-neutral-600 font-mono">
                Required for Gemini 3 Pro, Image Generation, and Deep Reasoning.
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={onClose} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors text-neutral-400">Cancel</button>
            <button onClick={handleSave} className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs uppercase tracking-wider transition-colors shadow-[0_0_20px_rgba(245,158,11,0.2)]">Save Configuration</button>
          </div>
       </div>
    </div>
  )
};

const SaveModal = ({ isOpen, onClose, onSave, initialTitle }: any) => {
  const [title, setTitle] = useState(initialTitle || "");
  const [cat, setCat] = useState("General");
  useEffect(() => setTitle(initialTitle || ""), [initialTitle, isOpen]);
  if(!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
       <div className="w-[400px] obsidian-card p-8 space-y-6 shadow-[0_0_100px_rgba(0,0,0,1)] border-white/10">
          <h3 className="text-amber-500 font-bold font-mono text-sm uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-4">
            <Icons.Save className="w-4 h-4" /> Save Asset to Library
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2 block">Asset Title</label>
              <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-amber-500/50 outline-none transition-colors font-mono" autoFocus />
            </div>
            
            <div>
              <label className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2 block">Category</label>
              <div className="relative">
                <select value={cat} onChange={e=>setCat(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none appearance-none cursor-pointer hover:bg-white/5 transition-colors font-mono">
                  <option>General</option>
                  <option>Production</option>
                  <option>Draft</option>
                  <option>Experimental</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">▼</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={onClose} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors text-neutral-400">Cancel</button>
            <button onClick={()=>{onSave(title, cat); onClose();}} className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs uppercase tracking-wider transition-colors shadow-[0_0_20px_rgba(245,158,11,0.2)]">Confirm</button>
          </div>
       </div>
    </div>
  )
};

const Sidebar = ({ isOpen, setIsOpen, templates, onLoadTemplate, onDeleteTemplate, onImport, onExport, onOpenSettings }: any) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'history'>('templates');
  const importInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={`h-full bg-[#030303] border-r border-white/5 flex-shrink-0 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] overflow-hidden flex flex-col ${isOpen ? 'w-80' : 'w-0'}`}>
      <div className="w-80 flex flex-col h-full bg-[#030303]">
        
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 flex-shrink-0 bg-white/[0.01]">
           <span className="text-xs font-bold text-amber-500 tracking-widest font-mono flex items-center gap-2 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
             <Icons.Library className="w-4 h-4" /> LIBRARY_V2
           </span>
           <button onClick={()=>setIsOpen(false)} className="p-1 hover:bg-white/5 rounded transition-colors text-neutral-500 hover:text-white"><Icons.X className="w-4 h-4"/></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5 mx-4 mt-4">
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'history' ? 'text-white border-b-2 border-amber-500' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            History
          </button>
          <button 
            onClick={() => setActiveTab('templates')}
            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'templates' ? 'text-white border-b-2 border-amber-500' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            Templates
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
           {activeTab === 'templates' ? (
             <>
               {templates.length === 0 && (
                 <div className="flex flex-col items-center justify-center py-20 opacity-30 space-y-4">
                   <Icons.Library className="w-10 h-10 text-neutral-500" />
                   <div className="text-[10px] text-neutral-500 font-mono">// DATABASE EMPTY</div>
                 </div>
               )}
               {templates.map((t: any) => (
                 <div key={t.id} onClick={()=>onLoadTemplate(t)} className="obsidian-card p-4 hover:border-amber-500/30 cursor-pointer group transition-all relative overflow-hidden">
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    
                    <div className="flex justify-between items-start mb-2 relative z-10">
                       <span className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                         {t.category || 'GENERAL'}
                       </span>
                       <button onClick={(e)=>{e.stopPropagation(); onDeleteTemplate(t.id)}} className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-red-500 transition-opacity"><Icons.Trash className="w-3 h-3"/></button>
                    </div>
                    
                    <h4 className="text-xs font-bold text-neutral-200 mb-1 line-clamp-1 relative z-10">{t.title}</h4>
                    <p className="text-[9px] text-neutral-500 line-clamp-2 leading-relaxed font-mono relative z-10 opacity-70">
                      {t.content}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/5 relative z-10">
                      <Icons.Hexagon className="w-3 h-3 text-neutral-600" />
                      <span className="text-[9px] text-neutral-500 uppercase tracking-wider">{t.domain}</span>
                      <span className="ml-auto text-[9px] text-neutral-700 font-mono">{new Date(t.createdAt).toLocaleDateString()}</span>
                    </div>
                 </div>
               ))}
             </>
           ) : (
             <div className="flex flex-col items-center justify-center py-20 opacity-30 space-y-4">
               <Icons.History className="w-10 h-10 text-neutral-500" />
               <div className="text-[10px] text-neutral-500 font-mono">// LOGS CLEARED</div>
             </div>
           )}
        </div>
        
        {/* Footer Actions: Data & Settings */}
        <div className="p-4 border-t border-white/5 bg-[#030303] space-y-3">
          
          {/* Import / Export */}
          <div className="grid grid-cols-2 gap-3">
             <input type="file" accept=".json" ref={importInputRef} onChange={onImport} className="hidden" />
             <button onClick={() => importInputRef.current?.click()} className="flex items-center justify-center gap-2 py-2 border border-white/5 rounded hover:bg-white/5 text-[9px] text-neutral-400 hover:text-white uppercase tracking-wider transition-colors">
               <Icons.FileUp className="w-3 h-3" /> Import
             </button>
             <button onClick={onExport} className="flex items-center justify-center gap-2 py-2 border border-white/5 rounded hover:bg-white/5 text-[9px] text-neutral-400 hover:text-white uppercase tracking-wider transition-colors">
               <Icons.FileDown className="w-3 h-3" /> Export
             </button>
          </div>

          <div className="h-px bg-white/5 my-2"></div>

          {/* Settings Trigger */}
          <button onClick={onOpenSettings} className="w-full flex items-center justify-between text-[9px] text-neutral-500 hover:text-amber-500 font-mono transition-colors group p-1">
             <span>SYSTEM_CONFIG</span>
             <span className="flex items-center gap-1.5 text-neutral-700 group-hover:text-amber-500/80">
               <Icons.Settings className="w-3 h-3" />
             </span>
          </button>
        </div>
      </div>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<ErrorBoundary><App /></ErrorBoundary>);
}