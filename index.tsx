import React, { useState, useRef, useEffect, Component, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { 
  Hexagon, Image, Video, Pen, Code, Sparkles, BrainCircuit, Globe, 
  Upload, Copy, Library, Search, Activity, Sidebar as SidebarIcon, X, Wand2, 
  Save, Trash, Play, AlertCircle, Download, FileJson, Menu
} from 'lucide-react';

// -----------------------------------------------------------------------------
// 0. SAFETY & ERROR HANDLING (Robustness)
// -----------------------------------------------------------------------------

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-[#09090b] text-red-500 font-mono p-8 text-center flex-col gap-4">
          <div className="text-4xl">⚠️ SYSTEM FAILURE</div>
          <div className="text-sm bg-red-900/20 p-4 rounded border border-red-900/50 max-w-2xl overflow-auto text-left">
            {this.state.error?.toString()}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition-colors font-mono uppercase tracking-widest"
          >
            Reboot System
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// -----------------------------------------------------------------------------
// 1. ICONS (Visual Assets)
// -----------------------------------------------------------------------------
const Icons = {
  Hexagon, Image, Video, Pen, Code, Sparkles, BrainCircuit, Globe,
  Upload, Copy, Library, Search, Activity, Sidebar: SidebarIcon, X, Wand2,
  Save, Trash, Play, AlertCircle, Download, FileJson, Menu
};

// -----------------------------------------------------------------------------
// 2. CONFIGURATION & TYPES (Scalability & Type Safety)
// -----------------------------------------------------------------------------

export type Domain = 'image' | 'video' | 'writing' | 'code' | 'general';
type InputMode = 'visual' | 'text';

// Configuration Registry for Domains and their specific defaults/options
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
    models: ["Midjourney v7", "FLUX 2.0", "Stable Diffusion", "Nano Banana Pro", "Seedream 4.5"],
    capabilityText: "Visual Parameters: Stylize, Chaos, Aspect Ratio, Lighting.",
    placeholder: "// Enter visual concept or draft prompt..."
  },
  video: {
    label: 'Video Creation',
    icon: Icons.Video,
    defaultModel: 'Veo 3.1',
    models: ["Veo 3.1", "Sora 2.0"],
    capabilityText: "Motion Dynamics: Physics, Camera Path, Transitions. Supports Image-to-Video.",
    placeholder: "// Describe scene motion and camera angles..."
  },
  writing: {
    label: 'Creative Writing',
    icon: Icons.Pen,
    defaultModel: 'Claude 4.5 Sonnet',
    models: ["Claude 4.5 Sonnet", "Gemini 3 Pro", "Claude 4.5 Opus", "GPT-5.2"],
    capabilityText: "Nuance Control: Tone, Pacing, Rhetorical Structure.",
    placeholder: "// Enter story concept or article topic..."
  },
  code: {
    label: 'Software Eng.',
    icon: Icons.Code,
    defaultModel: 'Claude 4.5 Opus',
    models: ["GPT-5.2", "Claude 4.5 Opus", "Claude 4.5 Sonnet", "Gemini 3 Pro"],
    capabilityText: "Logic & Arch: Clean Code, Design Patterns, Refactoring.",
    placeholder: "// Paste code snippet or describe feature..."
  },
  general: {
    label: 'General Assistant',
    icon: Icons.Sparkles,
    defaultModel: 'GPT-5.2',
    models: ["GPT-5.2", "Claude 4.5 Opus", "Claude 4.5 Sonnet", "Gemini 3 Pro"],
    capabilityText: "Reasoning: Chain of Thought, Fact-Checking, Planning.",
    placeholder: "// Ask complex reasoning question..."
  }
};

// -----------------------------------------------------------------------------
// NEW: DOMAIN SPECIFIC EXPERTISE (Business Logic Layer)
// -----------------------------------------------------------------------------
const DOMAIN_PERSONAS: Partial<Record<Domain, string>> = {
  code: `
# ROLE: Principal Software Architect & Full-Stack Engineer
**Mission**: Deliver production-ready, maintainable, and secure code solutions. No placeholders.

# WORKFLOW PROTOCOL
1.  **Tech Stack Selection**:
    *   Analyze requirements instantly.
    *   Select modern, LTS stacks (e.g., React 19/Next.js 14+, Rust, Python/FastAPI) unless specified.
    *   *Self-Correction*: Avoid deprecated libraries.

2.  **Architecture Blueprint**:
    *   Output a clear **File Structure Tree** (ASCII format) before coding.
    *   Define module responsibilities.

3.  **Code Implementation**:
    *   Write FULL functional logic. **NO COMMENTS LIKE \`// insert logic here\`**.
    *   **Best Practices**: strict typing, error handling (try/catch), security sanitization.

# CONSTRAINTS
<constraints>
  <constraint>Output must be modular and follow Clean Code principles (DRY, SOLID).</constraint>
  <constraint>If the user input is vague, make a professional assumption for the "best practice" implementation, rather than asking too many follow-up questions.</constraint>
  <constraint>Always include a brief "How to Run" section at the end (e.g., npm install commands).</constraint>
</constraints>
`,
  writing: `
# ROLE: Best-Selling Author & Creative Director
**Mission**: Craft immersive, human-sounding narratives. Reject generic AI styles; focus on emotional resonance and sensory details.

# CORE GUIDELINES
1.  **Show, Don't Tell**:
    *   Instead of saying "he was nervous," describe trembling hands, cold sweat, or avoiding eye contact.
    *   **Engage the 5 Senses**: Sight, Sound, Smell, Touch, Taste.

2.  **Style & Tone Adaptation**:
    *   Analyze the user's request to determine the Genre (e.g., Sci-Fi, Romance, Professional Copy, Thriller).
    *   Adapt vocabulary and sentence pacing accordingly (e.g., short, punchy sentences for action; flowing, melodic prose for romance).

3.  **Anti-Cliché Protocol**:
    *   **STRICTLY FORBIDDEN**: "testament", "tapestry", "delve", "in conclusion", "a symphony of", "game-changer", "unleash".
    *   Do not moralize or lecture the reader unless explicitly asked for a fable.

# WORKFLOW PROTOCOL
1.  **Analyze**: Identify the core emotion, theme, and audience from the prompt.
2.  **Draft**: Generate content with a strong **"Hook"** (opening) and a satisfying **"Resolution"**.
3.  **Refine**: Ensure sentence variety (mix of simple, compound, and complex sentences) to maintain rhythm.

# OUTPUT FORMAT
Provide the creative text directly. Only include a brief "Style Note" at the end if you need to explain a specific creative choice.
`,
  image: `
# Role
You are an expert **AI Art Director & Visual Prompt Engineer**. Your goal is to transform the user's raw, vague ideas into highly detailed, "high-fidelity" image generation prompts optimized for top-tier models (Midjourney v7, FLUX, Stable Diffusion).

# The Formula (Strict Adherence)
Construct the final prompt using this layer-by-layer structure:
1.  **Subject**: The core object/person with specific descriptors (age, clothing, texture).
2.  **Environment**: The background, time of day, and weather.
3.  **Composition & Camera**: Angles (e.g., "low angle"), Lens (e.g., "85mm f/1.8" for portraits, "24mm" for landscapes), and Framing (e.g., "Rule of Thirds").
4.  **Lighting & Atmosphere**: e.g., "Golden Hour," "Cyberpunk Neon," "Volumetric Lighting," "Cinematic Haze."
5.  **Style & Medium**: e.g., "Photorealistic," "Oil Painting (Impressionist)," "3D Render (Octane)," "Anime (Studio Ghibli)."
6.  **Technical Parameters**: Resolution ("8K", "Ultra-detailed"), Aspect Ratio constraints.

# Workflow
1.  **Analyze**: Detect the user's intent. Is it a photo, a logo, or an illustration?
2.  **Expand**: Add sensory details. If the user says "a cat," you write "a fluffy Maine Coon cat with piercing emerald eyes."
3.  **Parameterize**:
    * If the target feels like **Midjourney**, append parameters like \`--ar 16:9 --v 7 --q 2 --style raw\`.
    * If **FLUX/DALL-E**, focus on natural language description and text rendering accuracy.

# Constraints
<constraints>
  <constraint>Do not output conversational filler like "Here is your prompt". Just output the optimized prompt block.</constraint>
  <constraint>Ensure lighting matches the mood (e.g., use "Rembrandt lighting" for moody portraits).</constraint>
  <constraint>If the user requests text inside the image, emphasize "typographic accuracy" (crucial for FLUX/MJ v7).</constraint>
</constraints>

# Output Format
Please provide:
1.  **Optimized Prompt**: (The English prompt ready to copy-paste).
2.  **Negative Prompt** (Optional): (Keywords to avoid, e.g., "blurry, low quality, distorted hands").
`,
  video: `
# Role
You are a **Virtual Cinematographer & Director of Photography**. You understand camera physics, temporal consistency, and motion dynamics. Your task is to write a prompt that generates a coherent, physically plausible video clip.

# Core Elements of a Video Prompt
1.  **The Scene**: Visual description (similar to image prompting).
2.  **Subject Motion (The Action)**: Specifically describe *how* things move (e.g., "walking confidently," "leaves rustling in the wind," "explosion debris scattering").
3.  **Camera Movement (The Lens)**:
    *   *Static*: Camera is fixed.
    *   *Pan/Tilt*: Camera rotates.
    *   *Tracking/Dolly*: Camera moves alongside the subject.
    *   *FPV*: First-person view drone shot.
    *   *Zoom*: Lens focal length change.
4.  **Temporal Flow**: Speed (Slow motion, Timelapse, Real-time) and consistency.

# Workflow
1.  **Visualize**: Imagine the user's request as a movie shot.
2.  **Direct**: Define the camera gear (e.g., "Shot on IMAX 70mm" or "GoPro Hero 11").
3.  **Script the Motion**: Ensure the movement is described logically (e.g., "as the car speeds up, the background blurs").

# Constraints
<constraints>
  <constraint>Explicitly state the camera movement (e.g., "Drone shot establishing view").</constraint>
  <constraint>Focus on *continuity*. Avoid descriptions that imply scene cuts (video generators struggle with cuts in a single prompt).</constraint>
  <constraint>Use professional terminology: "Bokeh," "Depth of Field," "Color Grading," "Motion Blur".</constraint>
</constraints>

# Output Format
**Final Video Prompt**:
> [Camera Movement] + [Subject Action] + [Environment/Lighting] + [Style/Film Stock]
*(Example: "Low angle tracking shot of a cybernetic tiger running through a neon rainy alleyway, reflections on wet pavement, cinematic lighting, high motion blur, 4k, 60fps")*
`
};

// -----------------------------------------------------------------------------
// NEW: MODEL KNOWLEDGE BASE (Architecture Readiness)
// -----------------------------------------------------------------------------
const MODEL_PROFILES: Record<string, string> = {
  "GPT-5.2": `
# 目标架构：GPT-5.2 (High Reasoning)
- **优势**: 逻辑严密，适合复杂系统设计、代码重构、多步推理。
- **策略**: 强制 "Step-by-Step" 推理，要求提供验证步骤。
`,
  "Claude 4.5 Sonnet": `
# LLM 内核诊断报告: Claude (Anthropic)
- **优势**: 跨语言代码审查、长文档结构化分析、苏格拉底式教学。
- **陷阱**: 容易对2024年后的时效性数据产生幻觉。
- **交互协议**: 强烈偏好 XML Tags，要求使用 <constraint> 定义硬/软约束。
`,
  "Claude 4.5 Opus": `
# 目标架构：Claude 4.5 Opus (Anthropic)
- **优势**: 极强的上下文理解、复杂系统架构设计、长篇内容创作。
- **策略**: 给予充分的上下文，允许其进行深度思考。
`,
  "Gemini 3 Pro": `
# LLM 内核诊断报告: Gemini 3 Pro
- **优势**: 原生多模态(视频/音频/代码/文本)，超长上下文(2M+ tokens)。
- **交互协议**: 偏好 Markdown Headers (##) + Bullet Points。
- **注意**: 若未启用搜索，直接承认不知道最新信息。
`
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
// 3. UTILITIES (Service Layer Abstraction)
// -----------------------------------------------------------------------------

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Simple Markdown Highlighting Component
const FormattedOutput = ({ text }: { text: string }) => {
  if (!text) return null;
  
  // Split by newlines to handle blocks
  const lines = text.split('\n');
  
  return (
    <div className="space-y-1 font-mono text-xs md:text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">
      {lines.map((line, i) => {
        // H1/H2 Headers
        if (line.startsWith('## ') || line.startsWith('# ')) {
          return (
            <div key={i} className="text-amber-500 font-bold mt-4 mb-2 tracking-wide uppercase border-l-2 border-amber-500 pl-2">
              {line.replace(/^#+ /, '')}
            </div>
          );
        }
        
        // Render Line with Bold support
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <div key={i} className="min-h-[1em]">
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <span key={j} className="text-white font-bold bg-white/5 rounded px-1">{part.slice(2, -2)}</span>;
              }
              return part;
            })}
          </div>
        );
      })}
    </div>
  );
};

// -----------------------------------------------------------------------------
// 4. SUB-COMPONENTS (Modularization)
// -----------------------------------------------------------------------------

// --- Save Template Modal ---
const SaveModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialTitle = "" 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (title: string, category: string) => void;
  initialTitle?: string;
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [category, setCategory] = useState("General");

  useEffect(() => {
    if (isOpen) setTitle(initialTitle);
  }, [isOpen, initialTitle]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
       <div className="w-[400px] glass-panel rounded-xl p-6 border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.1)] space-y-4 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-neutral-500 hover:text-white">
            <Icons.X className="w-4 h-4" />
          </button>
          <h3 className="text-amber-500 font-bold font-mono uppercase tracking-widest text-sm mb-4">Save Asset to Library</h3>
          
          <div>
            <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Cyberpunk Street View"
              className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500/50 outline-none font-mono"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Category / Tag</label>
            <div className="relative">
              <select 
                value={category}
                onChange={e => setCategory(e.target.value)}
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
               onClick={() => {
                 onSave(title, category);
                 onClose();
               }}
               disabled={!title}
               className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-2 rounded-lg text-xs uppercase tracking-widest transition-all"
             >
               Confirm Save
             </button>
          </div>
       </div>
    </div>
  );
};

// --- Sidebar Component ---
const Sidebar = ({ 
  isOpen, 
  setIsOpen, 
  templates, 
  onLoadTemplate, 
  onDeleteTemplate,
  onImportTemplates
}: { 
  isOpen: boolean; 
  setIsOpen: (v: boolean) => void;
  templates: SavedTemplate[];
  onLoadTemplate: (t: SavedTemplate) => void;
  onDeleteTemplate: (id: string) => void;
  onImportTemplates: (t: SavedTemplate[]) => void;
}) => {
  const [activeTab, setActiveTab] = useState('templates');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(templates, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PromptRefine_Backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const imported = JSON.parse(evt.target?.result as string);
          if (Array.isArray(imported)) {
            onImportTemplates(imported);
          }
        } catch (err) {
          console.error("Import failed", err);
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
       {/* Mobile Backdrop */}
       {isOpen && (
         <div 
           className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10 md:hidden animate-in fade-in"
           onClick={() => setIsOpen(false)}
         />
       )}
       
       <div className={`
         w-72 border-r border-white/5 bg-[#09090b]/95 backdrop-blur-xl flex flex-col flex-shrink-0 z-20 absolute md:relative h-full transition-transform duration-300 shadow-2xl
         ${isOpen ? 'translate-x-0' : '-translate-x-full md:hidden'}
       `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
          <div className="flex items-center gap-2 text-amber-500 font-bold tracking-wider text-xs uppercase font-mono">
            <Icons.Library className="w-4 h-4" />
            <span>Library_V2</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-neutral-500 hover:text-white transition-colors p-1 hover:bg-white/5 rounded">
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
                {templates.length === 0 ? (
                  <div className="text-center text-neutral-600 text-[10px] font-mono py-10">
                     // DATABASE EMPTY<br/>SAVE PROMPTS TO POPULATE
                  </div>
                ) : (
                  templates.map(template => (
                    <div key={template.id} className="group relative bg-white/5 border border-white/5 hover:border-amber-500/30 rounded-lg p-3 transition-all cursor-pointer" onClick={() => onLoadTemplate(template)}>
                        <div className="flex items-center justify-between mb-1">
                           <span className="text-amber-500 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 px-1.5 rounded">{template.category}</span>
                           <button 
                             onClick={(e) => { e.stopPropagation(); onDeleteTemplate(template.id); }}
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
              <div className="text-center text-neutral-600 text-[10px] font-mono py-10">// LOGS CLEARED</div>
           )}
        </div>

        {/* Import/Export Footer */}
        <div className="p-4 border-t border-white/5 flex gap-2">
           <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileChange} />
           <button onClick={handleImportClick} className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-neutral-400 text-[10px] font-bold py-2 rounded border border-white/10 uppercase tracking-wider transition-colors">
             <Icons.Download className="w-3 h-3 rotate-180" /> Import
           </button>
           <button onClick={handleExport} className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-neutral-400 text-[10px] font-bold py-2 rounded border border-white/10 uppercase tracking-wider transition-colors">
             <Icons.FileJson className="w-3 h-3" /> Export
           </button>
        </div>
      </div>
    </>
  );
};

// --- Config Panel (Step 1) ---
const ConfigPanel = ({
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
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-white/10 text-[10px] font-mono px-1.5 py-0.5 rounded text-neutral-400">01</span>
        <h2 className="text-xs font-bold tracking-[0.15em] text-neutral-400 uppercase font-mono">Select Domain & Model</h2>
      </div>
      
      <div className="glass-panel p-1 rounded-2xl mb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-1">
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
                  relative group flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-300 overflow-hidden
                  ${isSelected 
                    ? 'bg-white/5 ring-1 ring-amber-500/50 shadow-[inset_0_0_20px_rgba(245,158,11,0.1)]' 
                    : 'hover:bg-white/5 hover:ring-1 hover:ring-white/10'}
                `}
              >
                <Icon className={`w-6 h-6 mb-3 transition-all duration-300 ${isSelected ? 'text-amber-500 scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'text-neutral-500 group-hover:text-neutral-300'}`} />
                <span className={`text-[10px] font-medium uppercase tracking-wider ${isSelected ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-300'}`}>
                  {item.label}
                </span>
                {isSelected && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-amber-500 rounded-t-full shadow-[0_0_10px_#f59e0b]" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="glass-panel p-6 rounded-xl flex flex-col md:flex-row gap-8 items-center border-l-4 border-l-amber-500/50">
        <div className="flex-1 w-full">
          <label className="text-[10px] uppercase font-bold text-neutral-500 mb-2 block tracking-widest font-mono">Target Architecture</label>
          <div className="relative group">
            <select 
              value={selectedModel}
              onChange={(e) => onSelectModel(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white appearance-none focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all font-mono cursor-pointer hover:bg-white/5"
            >
              {config.models.map(m => (
                <option key={m} value={m} className="bg-[#1a1a1e] text-white">
                  {m}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 group-hover:text-white transition-colors">▼</div>
          </div>
          <div className="mt-2 flex items-center gap-2">
             <div className={`w-1.5 h-1.5 rounded-full ${MODEL_PROFILES[selectedModel] ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]' : 'bg-neutral-600'}`}></div>
             <span className="text-[10px] font-mono text-neutral-500">
                {MODEL_PROFILES[selectedModel] ? 'ARCH_PROFILE_LOADED' : 'USING_GENERIC_DRIVER'}
             </span>
          </div>
        </div>
        <div className="w-px h-10 bg-white/10 hidden md:block"></div>
        <div className="flex-1 w-full">
          <label className="text-[10px] uppercase font-bold text-neutral-500 mb-2 block tracking-widest font-mono">Capability Matrix</label>
          <div className="text-xs text-neutral-300 font-medium">{config.capabilityText}</div>
        </div>
      </div>
    </section>
  );
};

// --- Input Deck (Step 2) ---
const InputDeck = ({
  domain,
  inputMode,
  setInputMode,
  textInput,
  setTextInput,
  selectedImage,
  imagePreview,
  onImageSelect,
  useDeepReasoning,
  setUseDeepReasoning,
  useSearchGrounding,
  setUseSearchGrounding,
  isProcessing,
  onExecute,
  onSaveInput
}: {
  domain: Domain;
  inputMode: InputMode;
  setInputMode: (m: InputMode) => void;
  textInput: string;
  setTextInput: (t: string) => void;
  selectedImage: File | null;
  imagePreview: string | null;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  useDeepReasoning: boolean;
  setUseDeepReasoning: (v: boolean) => void;
  useSearchGrounding: boolean;
  setUseSearchGrounding: (v: boolean) => void;
  isProcessing: boolean;
  onExecute: () => void;
  onSaveInput: () => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const config = DOMAIN_CONFIG[domain];
  
  const getActionLabel = () => {
    if (isProcessing) return 'PROCESSING...';
    if (domain === 'video') return 'OPTIMIZE & RENDER';
    if (inputMode === 'visual') return 'REVERSE ENGINEER';
    return 'EXECUTE REFINE';
  };

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="bg-white/10 text-[10px] font-mono px-1.5 py-0.5 rounded text-neutral-400">02</span>
          <h2 className="text-xs font-bold tracking-[0.15em] text-neutral-400 uppercase font-mono">Input Parameters</h2>
        </div>
        
        <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
          {(domain === 'image' || domain === 'video') && (
            <button 
              onClick={() => setInputMode('visual')}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-all font-mono uppercase ${inputMode === 'visual' ? 'bg-amber-500/20 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.1)]' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              {domain === 'video' ? 'Img_To_Video' : 'Visual_Ref'}
            </button>
          )}
          <button 
            onClick={() => setInputMode('text')}
            className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-all font-mono uppercase ${inputMode === 'text' ? 'bg-amber-500/20 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.1)]' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            Text_Mode
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden flex flex-col border border-white/10 shadow-2xl">
         {/* Top Bar */}
         <div className="h-8 bg-white/5 border-b border-white/5 flex items-center px-4 justify-between">
            <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
            </div>
            <div className="text-[10px] font-mono text-neutral-600 tracking-widest uppercase">Input_Stream_v1.0</div>
            <div className="flex items-center">
                 <button 
                   onClick={onSaveInput}
                   disabled={!textInput}
                   className="text-neutral-500 hover:text-amber-500 disabled:opacity-30 disabled:hover:text-neutral-500 transition-colors flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider"
                 >
                   <Icons.Save className="w-3 h-3" /> Save_Input
                 </button>
            </div>
         </div>

         {/* Area */}
         <div className="relative min-h-[280px] bg-black/40">
            {inputMode === 'visual' ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`absolute inset-4 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group overflow-hidden ${selectedImage ? 'border-amber-500/40 bg-amber-500/5' : 'border-neutral-800 hover:border-neutral-600 hover:bg-white/5'}`}
              >
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onImageSelect} />
                {selectedImage && <div className="scan-line z-10"></div>}
                
                {imagePreview ? (
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                     <img src={imagePreview} className="max-w-full max-h-full object-contain shadow-2xl" />
                     <div className="absolute bottom-4 bg-black/80 backdrop-blur text-amber-500 text-[10px] font-mono px-3 py-1 rounded border border-amber-500/20">IMG_LOADED: {selectedImage?.name}</div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                     <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto text-neutral-700 group-hover:text-amber-500 transition-colors border border-white/5 group-hover:border-amber-500/30 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                       <Icons.Upload className="w-8 h-8" />
                     </div>
                     <div className="flex flex-col gap-1">
                       <p className="text-neutral-400 text-sm font-medium group-hover:text-white transition-colors">
                         {domain === 'video' ? 'Drop Start Frame' : 'Drop Reference Image'}
                       </p>
                       <p className="text-neutral-600 text-xs font-mono">JPG, PNG, WEBP supported</p>
                     </div>
                  </div>
                )}
              </div>
            ) : (
              <textarea 
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={config.placeholder}
                className="w-full h-full bg-transparent p-6 text-sm text-neutral-200 focus:outline-none resize-none font-mono placeholder:text-neutral-700 leading-relaxed"
                spellCheck={false}
              />
            )}
         </div>

         {/* Command Bar */}
         <div className="border-t border-white/5 bg-white/5 p-3 flex flex-col md:flex-row gap-4 justify-between items-center backdrop-blur-md">
             <div className="flex gap-2 w-full md:w-auto">
                 <button 
                   onClick={() => setUseDeepReasoning(!useDeepReasoning)} 
                   className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-[10px] font-bold transition-all font-mono uppercase tracking-wider ${useDeepReasoning ? 'border-purple-500/50 bg-purple-500/10 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'border-white/10 text-neutral-500 hover:border-purple-500/30 hover:text-purple-400 hover:bg-white/5'}`}
                 >
                   <Icons.BrainCircuit className="w-3.5 h-3.5" /> Deep_Reasoning
                 </button>
                 <button 
                   onClick={() => setUseSearchGrounding(!useSearchGrounding)} 
                   className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-[10px] font-bold transition-all font-mono uppercase tracking-wider ${useSearchGrounding ? 'border-blue-500/50 bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'border-white/10 text-neutral-500 hover:border-blue-500/30 hover:text-blue-400 hover:bg-white/5'}`}
                 >
                   <Icons.Globe className="w-3.5 h-3.5" /> Grounding_Net
                 </button>
             </div>
             
             <button 
                onClick={onExecute}
                disabled={isProcessing}
                className={`w-full md:w-auto bg-amber-500 hover:bg-amber-400 text-black px-8 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center justify-center gap-3 font-mono border border-amber-400 ${isProcessing ? 'opacity-70 cursor-wait' : 'hover:-translate-y-0.5 active:translate-y-0'}`}
              >
                {isProcessing ? (
                   <><div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></div><span>PROCESSING...</span></>
                ) : (
                   <>{inputMode === 'visual' ? <Icons.Upload className="w-4 h-4" /> : <Icons.Wand2 className="w-4 h-4" />}{getActionLabel()}</>
                )}
              </button>
         </div>
      </div>
    </section>
  );
};

// --- Output Display Components ---
const MarketDiagnosticCard = ({ isScanning, data }: { isScanning: boolean; data: DiagnosticData | null }) => {
  if (isScanning) {
    return (
      <div className="glass-panel p-6 rounded-xl border border-white/10 h-full flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-xs font-mono text-amber-500 animate-pulse">RUNNING_MARKET_SIMULATION...</div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="glass-panel p-6 rounded-xl border border-white/10 h-full flex flex-col gap-4 animate-in fade-in">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
         <div className="flex flex-col">
           <span className="text-[10px] uppercase text-neutral-500 font-bold font-mono">Viability Score</span>
           <span className="text-3xl font-bold text-white font-mono">{data.score}/100</span>
         </div>
         <div className={`px-3 py-1 rounded text-[10px] font-bold uppercase font-mono ${
           data.potential.includes('High') ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
         }`}>
           {data.potential}
         </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <span className="text-[10px] uppercase text-neutral-500 font-bold font-mono block mb-1">Target Sectors</span>
          <div className="flex flex-wrap gap-1">
            {data.target_sectors.map((s, i) => (
              <span key={i} className="text-[10px] px-2 py-1 bg-white/5 rounded text-neutral-300 border border-white/5">{s}</span>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase text-neutral-500 font-bold font-mono block mb-1">Monetization</span>
          <div className="flex flex-wrap gap-1">
            {data.monetization.map((s, i) => (
              <span key={i} className="text-[10px] px-2 py-1 bg-white/5 rounded text-neutral-300 border border-white/5">{s}</span>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase text-neutral-500 font-bold font-mono block mb-1">Risk Factors</span>
          <div className="space-y-1">
            {data.risk_factors.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px] text-red-400/80">
                <Icons.AlertCircle className="w-3 h-3" /> {s}
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-2 border-t border-white/5">
           <p className="text-[10px] text-neutral-500 font-mono leading-relaxed">{data.summary}</p>
        </div>
      </div>
    </div>
  );
};

const RenderPreview = ({ 
  domain, 
  isRendering, 
  progress, 
  videoUrl, 
  imageUrl 
}: { 
  domain: Domain; 
  isRendering: boolean; 
  progress: number; 
  videoUrl: string | null; 
  imageUrl: string | null; 
}) => {
  if (domain !== 'video' && domain !== 'image') {
    return (
      <div className="glass-panel p-6 rounded-xl border border-white/10 h-full flex flex-col items-center justify-center text-center opacity-50">
         <Icons.Hexagon className="w-12 h-12 text-neutral-700 mb-2" />
         <div className="text-[10px] font-mono text-neutral-600">NO_RENDER_PIPELINE_ACTIVE</div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-1 rounded-xl border border-white/10 h-full min-h-[300px] relative overflow-hidden bg-black flex flex-col">
      <div className="absolute top-3 right-3 z-10 flex gap-2">
         <div className="bg-black/60 backdrop-blur text-white text-[10px] font-mono px-2 py-1 rounded border border-white/10">
           {domain === 'video' ? 'VEO_PREVIEW' : 'IMAGEN_PREVIEW'}
         </div>
      </div>

      {isRendering ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
           <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
             <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
           </div>
           <div className="text-[10px] font-mono text-amber-500 animate-pulse">RENDERING_ASSET... {progress}%</div>
        </div>
      ) : (
        <div className="flex-1 bg-neutral-900/50 flex items-center justify-center relative group">
           {domain === 'video' && videoUrl ? (
             <video 
               src={videoUrl} 
               controls 
               className="w-full h-full object-contain" 
               autoPlay 
               loop 
             />
           ) : domain === 'image' && imageUrl ? (
             <img src={imageUrl} className="w-full h-full object-contain" alt="Generated" />
           ) : (
             <div className="text-center">
               <div className="w-12 h-12 rounded-full bg-white/5 mx-auto mb-2 flex items-center justify-center text-neutral-600">
                 {domain === 'video' ? <Icons.Video className="w-5 h-5"/> : <Icons.Image className="w-5 h-5"/>}
               </div>
               <div className="text-[10px] font-mono text-neutral-600">AWAITING_GENERATION</div>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

const OutputTerminal = ({
  domain,
  refinedPrompt,
  isProcessing,
  onSaveOutput,
  onRunDiagnostic,
  onVerifyVisual,
  showDiagnostic,
  diagnosticData,
  isScanning,
  generatedVideoUrl,
  generatedImageUrl,
  isRendering,
  renderProgress
}: {
  domain: Domain;
  refinedPrompt: string;
  isProcessing: boolean;
  onSaveOutput: () => void;
  onRunDiagnostic: () => void;
  onVerifyVisual: () => void;
  showDiagnostic: boolean;
  diagnosticData: DiagnosticData | null;
  isScanning: boolean;
  generatedVideoUrl: string | null;
  generatedImageUrl: string | null;
  isRendering: boolean;
  renderProgress: number;
}) => {
  if (!refinedPrompt && !isProcessing) return null;

  return (
    <section className="pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
       <div className="flex items-center gap-3 mb-6">
          <span className="bg-amber-500 text-black text-[10px] font-mono px-1.5 py-0.5 rounded font-bold">03</span>
          <h2 className="text-xs font-bold tracking-[0.15em] text-amber-500 uppercase font-mono">Output & Telemetry</h2>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Text Output */}
          <div className="flex flex-col gap-2">
             <div className="flex items-center justify-between text-[10px] text-neutral-500 uppercase tracking-widest font-bold px-1 font-mono">
               <span>// {domain === 'video' ? 'VEO_SPEC_SHEET' : 'PROMPT_MATRIX_OUTPUT'}</span>
               <div className="flex gap-2">
                  <button onClick={onSaveOutput} className="flex items-center gap-1 hover:text-white transition-colors text-amber-500">
                    <Icons.Save className="w-3 h-3"/> SAVE_TEMPLATE
                  </button>
                  <span className="text-white/20">|</span>
                  <button className="flex items-center gap-1 hover:text-white transition-colors"><Icons.Copy className="w-3 h-3"/> COPY_RAW</button>
               </div>
             </div>
             <div className="glass-panel rounded-xl p-0 min-h-[400px] border border-white/10 relative overflow-hidden flex flex-col">
               <div className="flex-1 p-6 overflow-y-auto selection:bg-amber-500/30">
                 {isProcessing && !refinedPrompt ? (
                   <div className="space-y-4 animate-pulse">
                      <div className="h-2 bg-white/10 rounded w-3/4"></div>
                      <div className="h-2 bg-white/10 rounded w-1/2"></div>
                      <div className="h-2 bg-white/5 rounded w-full"></div>
                      <div className="h-2 bg-white/5 rounded w-5/6"></div>
                      <div className="mt-8 h-32 bg-white/5 rounded border border-white/5"></div>
                   </div>
                 ) : (
                   <FormattedOutput text={refinedPrompt} />
                 )}
               </div>
               
               {/* Actions */}
               {!isProcessing && refinedPrompt && (
                 <div className="p-4 border-t border-white/5 bg-white/5 flex justify-end gap-3">
                    {(domain === 'image' || domain === 'video') && (
                      <button onClick={onVerifyVisual} className="flex items-center gap-2 bg-green-900/20 border border-green-500/20 hover:border-green-500/50 hover:text-green-400 text-green-600/80 px-4 py-2 rounded-lg text-[10px] font-bold transition-all shadow-sm font-mono tracking-wider uppercase hover:bg-green-500/10">
                        <Icons.Play className="w-3.5 h-3.5" /> VERIFY_VISUAL_FIDELITY
                      </button>
                    )}
                    <button onClick={onRunDiagnostic} className="flex items-center gap-2 bg-black/40 border border-white/10 hover:border-blue-500/50 hover:text-blue-400 text-neutral-400 px-4 py-2 rounded-lg text-[10px] font-bold transition-all shadow-sm font-mono tracking-wider uppercase hover:bg-blue-500/10">
                      <Icons.Activity className="w-3.5 h-3.5" /> {isScanning ? 'SCANNING_MARKET...' : 'RUN_MARKET_DIAGNOSTIC'}
                    </button>
                 </div>
               )}
             </div>
          </div>

          {/* Right: Diagnostic or Render */}
          <div className="flex flex-col gap-2">
            {showDiagnostic ? (
              <MarketDiagnosticCard isScanning={isScanning} data={diagnosticData} />
            ) : (
              <RenderPreview 
                domain={domain}
                isRendering={isRendering}
                progress={renderProgress}
                videoUrl={generatedVideoUrl}
                imageUrl={generatedImageUrl}
              />
            )}
          </div>
       </div>
    </section>
  );
};

// -----------------------------------------------------------------------------
// 5. MAIN APPLICATION (Orchestration)
// -----------------------------------------------------------------------------
function App() {
  // --- Global State ---
  const [selectedDomain, setSelectedDomain] = useState<Domain>('general');
  const [selectedModel, setSelectedModel] = useState<string>('GPT-5.2');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Input State
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [textInput, setTextInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [useDeepReasoning, setUseDeepReasoning] = useState(false);
  const [useSearchGrounding, setUseSearchGrounding] = useState(false);

  // Output State
  const [isProcessing, setIsProcessing] = useState(false);
  const [refinedPrompt, setRefinedPrompt] = useState("");
  
  // Render/Diagnostic State
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData | null>(null);

  // Template/Storage State
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [contentToSave, setContentToSave] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);

  // --- Effects ---
  useEffect(() => {
    const stored = localStorage.getItem('promptRefine_templates');
    if (stored) {
      try { setSavedTemplates(JSON.parse(stored)); } catch (e) { console.error(e); }
    }
  }, []);

  // Memory Leak Protection: Clean up Object URLs when dependencies change
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // Update default model when domain changes
  useEffect(() => {
    const config = DOMAIN_CONFIG[selectedDomain];
    setSelectedModel(config.defaultModel);
    if (selectedDomain === 'image') setInputMode('visual'); // Auto-switch convenience for image
    else setInputMode('text');
  }, [selectedDomain]);

  // --- Logic / Handlers ---
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Cleanup previous preview if exists inside useEffect is not enough for rapid changes, 
      // but the effect handles component unmount/update. 
      // For immediate replacement, create new one.
      setImagePreview(URL.createObjectURL(file));
      setInputMode('visual');
    }
  };

  const handleSaveTemplate = (title: string, category: string) => {
    const newTemplate: SavedTemplate = {
      id: Date.now().toString(),
      title,
      category,
      content: contentToSave || refinedPrompt || textInput,
      domain: selectedDomain,
      createdAt: Date.now()
    };
    const updated = [newTemplate, ...savedTemplates];
    setSavedTemplates(updated);
    localStorage.setItem('promptRefine_templates', JSON.stringify(updated));
    setIsSidebarOpen(true);
  };

  const handleDeleteTemplate = (id: string) => {
    const updated = savedTemplates.filter(t => t.id !== id);
    setSavedTemplates(updated);
    localStorage.setItem('promptRefine_templates', JSON.stringify(updated));
  };
  
  const handleImportTemplates = (imported: SavedTemplate[]) => {
    // Merge strategy: Add new ones, avoid duplicates by ID if possible, or just append
    const updated = [...imported, ...savedTemplates];
    // Dedupe by ID just in case
    const unique = Array.from(new Map(updated.map(item => [item.id, item])).values());
    
    setSavedTemplates(unique);
    localStorage.setItem('promptRefine_templates', JSON.stringify(unique));
  };

  const handleLoadTemplate = (template: SavedTemplate) => {
    setTextInput(template.content);
    setSelectedDomain(template.domain);
    setInputMode('text');
  };

  const executeRefinement = async () => {
    // Auth check for paid features
    if (selectedDomain === 'video' || selectedDomain === 'image') {
       if ((window as any).aistudio && (window as any).aistudio.openSelectKey) {
          const hasKey = await (window as any).aistudio.hasSelectedApiKey();
          if (!hasKey) await (window as any).aistudio.openSelectKey();
       }
    }

    if (inputMode === 'text' && !textInput) return;
    if (inputMode === 'visual' && !selectedImage) return;

    setIsProcessing(true);
    setRefinedPrompt("");
    setGeneratedVideoUrl(null);
    setGeneratedImageUrl(null);
    setShowDiagnostic(false);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-2.5-flash';
      let contentParts = [];

      // -----------------------------------------------------------
      // DYNAMIC MODEL PERSONA INJECTION
      // -----------------------------------------------------------
      // Fetch the specific optimization rules for the selected model
      const modelPersona = MODEL_PROFILES[selectedModel] || `You are optimizing for ${selectedModel}. Use best practices for this architecture.`;
      const domainPersona = DOMAIN_PERSONAS[selectedDomain] || "";
      
      let systemInstr = `
      You are PromptRefine AI. 
      
      === DOMAIN EXPERTISE MODULE ===
      ${domainPersona}
      
      === TARGET MODEL ARCHITECTURE ===
      Target Model: ${selectedModel}
      ${modelPersona}
      
      === INSTRUCTIONS ===
      Your Goal: Optimize/Reverse engineer input based on the DOMAIN EXPERTISE above, adapted for the TARGET MODEL.
      Format: Strict Markdown. Headers like ## Subject, ## Specs, ## Technical Parameters.
      `;

      if (inputMode === 'visual' && selectedImage) {
         const base64 = await fileToBase64(selectedImage);
         contentParts.push({ inlineData: { mimeType: selectedImage.type, data: base64 }});
         contentParts.push({ text: `ROLE: Visual Reverse Engineer. EXTRACT STYLE & SPECS based on the ${selectedModel} architecture preferences. User Topic: "${textInput || 'Analyze image subject'}". Return Detailed Analysis + FINAL PROMPT block.` });
      } else {
         contentParts.push({ text: textInput });
      }

      const tools = [];
      if (useSearchGrounding) tools.push({ googleSearch: {} });
      if (useDeepReasoning) systemInstr += "\n\nDEEP REASONING: ENABLED. Step-by-step logic required.";

      const response = await ai.models.generateContent({
        model,
        contents: { parts: contentParts },
        config: { systemInstruction: systemInstr, tools }
      });

      const refinedText = response.text || "Analysis failed.";
      setRefinedPrompt(refinedText);

      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

      // Auto-trigger rendering based on domain
      if (selectedDomain === 'video') generateVideo(refinedText);
      else if (selectedDomain === 'image') generateImage(refinedText);

    } catch (e) {
      console.error(e);
      setRefinedPrompt(`Error: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateVideo = async (promptText: string) => {
    setIsRendering(true);
    setShowDiagnostic(false);
    setRenderProgress(0);
    const interval = setInterval(() => setRenderProgress(p => Math.min(p + 5, 95)), 1000);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Veo needs short prompts, max 300 chars typically for preview
      const veoPrompt = promptText.substring(0, 300).replace(/#/g, ''); 
      
      // Veo Config Payload
      const configPayload: any = { 
        numberOfVideos: 1, 
        resolution: '720p', 
        aspectRatio: '16:9' 
      };

      const params: any = {
        model: 'veo-3.1-fast-generate-preview',
        prompt: veoPrompt,
        config: configPayload
      };

      // Image-to-Video Logic
      if (inputMode === 'visual' && selectedImage) {
        const base64 = await fileToBase64(selectedImage);
        params.image = {
          imageBytes: base64,
          mimeType: selectedImage.type
        };
        // Veo aspect ratio usually defaults to input image or needs specific handling, 
        // keeping 16:9 for simplicity or remove if conflict.
      }

      let operation = await ai.models.generateVideos(params);

      while (!operation.done) {
        await new Promise(r => setTimeout(r, 5000));
        operation = await ai.operations.getVideosOperation({ operation });
      }
      
      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const videoRes = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await videoRes.blob();
        
        // Revoke old URL if exists to prevent leak
        if (generatedVideoUrl) URL.revokeObjectURL(generatedVideoUrl);
        setGeneratedVideoUrl(URL.createObjectURL(blob));
      }
    } catch (e) {
      console.error("Video Generation Error", e);
    } finally {
      setIsRendering(false);
      setRenderProgress(100);
      clearInterval(interval);
    }
  };

  const generateImage = async (promptText: string) => {
    setIsRendering(true);
    setShowDiagnostic(false);
    setRenderProgress(0);
    const interval = setInterval(() => setRenderProgress(p => Math.min(p + 10, 90)), 500);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: promptText }] },
        config: { imageConfig: { aspectRatio: "16:9" } }
      });
      
      const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (part && part.inlineData) {
         if (generatedImageUrl) URL.revokeObjectURL(generatedImageUrl); // Cleanup
         // Note: For base64 string we don't need createObjectURL, but if we converted to blob we would.
         // Here we stick to base64 string for simplicity as per API example.
         setGeneratedImageUrl(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
      }
    } catch (e) {
      console.error("Image Generation Error", e);
    } finally {
      setIsRendering(false);
      setRenderProgress(100);
      clearInterval(interval);
    }
  };

  const runMarketDiagnostic = async () => {
    setIsScanning(true);
    setShowDiagnostic(true);
    try {
      await new Promise(r => setTimeout(r, 1000)); // UI pacing
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze commercial viability: "${refinedPrompt.substring(0, 500)}...". JSON: {score(0-100), potential(Low/Med/High), target_sectors[], monetization[], risk_factors[], summary}`,
        config: { responseMimeType: 'application/json' }
      });
      const text = response.text;
      if (text) {
        setDiagnosticData(JSON.parse(text));
      } else {
        throw new Error("Empty response");
      }
    } catch (e) {
      // Fallback mock data if API fails or strict JSON fails
      setDiagnosticData({
        score: 72, potential: "Medium Potential",
        target_sectors: ["Digital Art", "Concept Design"],
        monetization: ["Stock", "Prints"],
        risk_factors: ["Saturation"],
        summary: "Analysis unavailable. Showing estimated baseline."
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex h-screen text-[#e5e5e5] font-sans overflow-hidden selection:bg-amber-500/30 relative">
      <SaveModal 
        isOpen={isSaveModalOpen} 
        onClose={() => setIsSaveModalOpen(false)} 
        onSave={handleSaveTemplate}
        initialTitle={contentToSave ? (contentToSave.substring(0, 20) + "...") : ""} 
      />

      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        templates={savedTemplates} 
        onLoadTemplate={handleLoadTemplate} 
        onDeleteTemplate={handleDeleteTemplate}
        onImportTemplates={handleImportTemplates}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-16 border-b border-white/5 bg-[#050505]/60 backdrop-blur-md flex items-center px-6 flex-shrink-0 z-10 justify-between sticky top-0">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="text-neutral-400 hover:text-white transition-colors">
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

        {/* Workspace */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth" ref={scrollRef}>
          <div className="max-w-6xl mx-auto space-y-10 pb-20">
            
            <ConfigPanel 
              selectedDomain={selectedDomain} 
              onSelectDomain={setSelectedDomain} 
              selectedModel={selectedModel} 
              onSelectModel={setSelectedModel} 
            />

            <InputDeck 
              domain={selectedDomain}
              inputMode={inputMode}
              setInputMode={setInputMode}
              textInput={textInput}
              setTextInput={setTextInput}
              selectedImage={selectedImage}
              imagePreview={imagePreview}
              onImageSelect={handleImageSelect}
              useDeepReasoning={useDeepReasoning}
              setUseDeepReasoning={setUseDeepReasoning}
              useSearchGrounding={useSearchGrounding}
              setUseSearchGrounding={setUseSearchGrounding}
              isProcessing={isProcessing}
              onExecute={executeRefinement}
              onSaveInput={() => { setContentToSave(textInput); setIsSaveModalOpen(true); }}
            />

            <OutputTerminal 
              domain={selectedDomain}
              refinedPrompt={refinedPrompt}
              isProcessing={isProcessing}
              onSaveOutput={() => { setContentToSave(refinedPrompt); setIsSaveModalOpen(true); }}
              onRunDiagnostic={runMarketDiagnostic}
              onVerifyVisual={() => selectedDomain === 'video' ? generateVideo(refinedPrompt) : generateImage(refinedPrompt)}
              showDiagnostic={showDiagnostic}
              diagnosticData={diagnosticData}
              isScanning={isScanning}
              generatedVideoUrl={generatedVideoUrl}
              generatedImageUrl={generatedImageUrl}
              isRendering={isRendering}
              renderProgress={renderProgress}
            />

          </div>
        </div>
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}