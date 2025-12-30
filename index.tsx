import React, { useState, useRef, useEffect, ReactNode, memo, Component } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { 
  Hexagon, Image, Video, Pen, Code, Sparkles, BrainCircuit, Globe, 
  Upload, Copy, Library, Search, Activity, Sidebar as SidebarIcon, X, Wand2, 
  Save, Trash, Play, AlertCircle, Download, FileJson, Menu, Check,
  MonitorPlay, Terminal, Cpu, Layout, Clock, History, Zap, ChevronDown,
  Camera, Mic, Command, Settings, Key, FileUp, FileDown, Plus, Tag,
  Eye, Type, TrendingUp, ShieldAlert, DollarSign, Target, FileText, Paperclip
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// -----------------------------------------------------------------------------
// 0. VISUAL PRIMITIVES
// -----------------------------------------------------------------------------

const ObsidianCard = ({ children, className = "", onClick, active = false, style = {} }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div 
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      className={`obsidian-card ${active ? 'active' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

// -----------------------------------------------------------------------------
// 1. CONFIG & DATA
// -----------------------------------------------------------------------------

interface ErrorBoundaryProps { children?: ReactNode; }
interface ErrorBoundaryState { hasError: boolean; error: Error | null; }

// Fixed: Inherit correctly from React.Component and initialize state as property
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  
  render() {
    if (this.state.hasError) return <div className="p-10 text-red-500 font-mono">SYSTEM_CRITICAL_FAILURE</div>;
    return this.props.children;
  }
}

const Icons = {
  Hexagon, Image, Video, Pen, Code, Sparkles, BrainCircuit, Globe,
  Upload, Copy, Library, Search, Activity, Sidebar: SidebarIcon, X, Wand2,
  Save, Trash, Play, AlertCircle, Download, FileJson, Menu, Check,
  MonitorPlay, Terminal, Cpu, Layout, Clock, History, Zap, ChevronDown,
  Camera, Mic, Command, Settings, Key, FileUp, FileDown, Plus, Tag, Eye, Type,
  TrendingUp, ShieldAlert, DollarSign, Target, FileText, Paperclip
};

export type Domain = 'image' | 'video' | 'writing' | 'code' | 'general';
type InputMode = 'visual' | 'text';
type ProcessStage = 'idle' | 'analyzing' | 'ready_to_render' | 'rendering' | 'complete' | 'error';

// Standard model list for text tasks
const TEXT_MODELS = ["Gemini 3 Flash Preview", "GPT-5.2", "Gemini 3 Pro", "Claude 4.5 Opus", "Claude 4.5 Sonnet", "Grok 4.1"];

export const DOMAIN_CONFIG: Record<Domain, {
  label: string;
  icon: React.FC<{className?: string}>;
  defaultModel: string;
  models: string[];
  capabilityText: string;
  placeholder: string;
}> = {
  image: {
    label: 'Visual',
    icon: Icons.Image,
    defaultModel: 'Nano Banana Pro',
    models: ["Nano Banana Pro", "Midjourney v7", "FLUX 2.0", "Stable Diffusion 3"],
    capabilityText: "Visual Parameters: Stylize, Chaos, Aspect Ratio, Lighting.",
    placeholder: "// Enter visual concept to reverse engineer..."
  },
  video: {
    label: 'Motion',
    icon: Icons.Video,
    defaultModel: 'Veo 3.1',
    models: ["Veo 3.1", "Sora 2"],
    capabilityText: "Motion Dynamics: Physics, Camera Path, Transitions.",
    placeholder: "// Describe scene motion and atmosphere..."
  },
  writing: {
    label: 'Creative',
    icon: Icons.Pen,
    defaultModel: 'Claude 4.5 Sonnet',
    models: TEXT_MODELS,
    capabilityText: "Nuance Control: Tone, Pacing, Rhetoric.",
    placeholder: "// Enter story concept or draft..."
  },
  code: {
    label: 'Logic',
    icon: Icons.Code,
    defaultModel: 'Gemini 3 Flash Preview',
    models: TEXT_MODELS,
    capabilityText: "Logic & Arch: Clean Code, Security, Opt.",
    placeholder: "// Paste code snippet or requirement..."
  },
  general: {
    label: 'General',
    icon: Icons.Sparkles,
    defaultModel: 'Gemini 3 Flash Preview',
    models: TEXT_MODELS,
    capabilityText: "Reasoning: CoT, Planning, Analysis.",
    placeholder: "// Ask reasoning question..."
  }
};

const MODEL_PROFILES: Record<string, string> = {
  "Gemini 3 Flash Preview": "# ARCHITECTURE: Gemini 3 Flash Preview (KDP-v3.1-FLS)\n- **Kernel Status**: Optimal Log Processor.\n- **Constraint Protocol**: Mandatory XML Encapsulation.\n- **Heuristics**: Input Suffix optimization.",
  "Nano Banana Pro": "# ARCHITECTURE: Nano Banana Pro\n- **Mode**: Native Visual Generation.\n- **Protocol**: 5+1 Dimension Formula.",
  "Veo 3.1": "# ARCHITECTURE: Veo 3.1\n- **Mode**: Physics-based Motion Generation."
};

const DOMAIN_PERSONAS: Partial<Record<Domain, string>> = {
  code: "ROLE: Principal Software Architect. OUTPUT: Clean, Modular, Secure Code. Follow SOLID principles.",
  writing: "ROLE: Best-Selling Author & Editor. OUTPUT: Show, don't tell. Focus on pacing, tone, and sensory details.",
  image: "ROLE: AI Art Director. OUTPUT: Subject, Environment, Lighting, Style, Composition, Technical Parameters. If user provides an image, analyze it for style transfer or reverse engineering.",
  video: "ROLE: Cinematographer. OUTPUT: Camera Movement (Pan/Tilt/Zoom), Subject Action, Atmosphere, Film Stock.",
  general: "ROLE: Senior Logic Architect. OUTPUT: Highly structured, logical frameworks."
};

interface DiagnosticData {
  score: number;
  potential: string;
  target_sectors: string[];
  monetization: string[];
  risk_factors: string[];
  summary: string;
}

interface SavedTemplate {
  id: string;
  title: string;
  category: string;
  content: string;
  domain: Domain;
  createdAt: number;
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

const FormattedOutput = memo(({ text }: { text: string }) => {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="space-y-1 font-mono text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap">
      {lines.map((line, i) => {
        if (line.startsWith('## ') || line.startsWith('# ')) {
          return <div key={i} className="text-amber-500 font-bold mt-4 mb-2 tracking-wide uppercase border-l-2 border-amber-500/50 pl-3">{line.replace(/^#+ /, '')}</div>;
        }
        if (line.includes('<') && line.includes('>')) {
          const parts = line.split(/(<[^>]+>)/g);
          return (
            <div key={i} className="min-h-[1em]">
               {parts.map((p, j) => (
                 p.startsWith('<') ? <span key={j} className="text-amber-400/80 font-bold">{p}</span> : p
               ))}
            </div>
          );
        }
        return <div key={i}>{line}</div>;
      })}
    </div>
  );
});

// -----------------------------------------------------------------------------
// 3. UI COMPONENTS
// -----------------------------------------------------------------------------

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
    <div className="flex flex-col md:flex-row gap-4 items-stretch h-[80px]">
      <ObsidianCard className="flex-[2] flex items-center px-2 py-2 gap-1 overflow-x-auto custom-scrollbar">
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
                flex-1 flex flex-col md:flex-row items-center justify-center gap-2 px-3 py-3 rounded-lg transition-all duration-200 min-w-[80px]
                ${isSelected ? 'bg-white/10 text-white shadow-lg' : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'}
              `}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-500' : ''}`} />
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-white' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </ObsidianCard>

      <ObsidianCard className="flex-1 flex flex-col justify-center px-6 relative group">
          <div className="absolute top-3 left-6 text-label flex items-center gap-2">
            <Icons.Cpu className="w-3 h-3 text-amber-500" />
            Active Kernel
          </div>
          <div className="mt-4 relative z-10 flex items-center">
            <select 
              value={selectedModel}
              onChange={(e) => onSelectModel(e.target.value)}
              className="bg-transparent text-sm font-bold text-white outline-none appearance-none cursor-pointer w-full font-mono hover:text-amber-500 transition-colors"
            >
              {config.models.map(m => <option key={m} value={m} className="bg-[#121214] py-2">{m}</option>)}
            </select>
            <Icons.ChevronDown className="w-4 h-4 text-neutral-600 pointer-events-none absolute right-0" />
          </div>
      </ObsidianCard>
    </div>
  );
});

const MarketDiagnostic = ({ data }: { data: DiagnosticData | null }) => {
  if (!data) return null;

  const scoreData = [
    { name: 'Score', value: data.score },
    { name: 'Remaining', value: 100 - data.score },
  ];

  const getScoreColor = (s: number) => {
    if (s > 80) return '#10b981';
    if (s > 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="animate-enter mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <ObsidianCard className="lg:col-span-1 p-6 flex flex-col items-center justify-center relative bg-black/40">
        <div className="text-label absolute top-6 left-6 flex items-center gap-2">
          <Icons.Activity className="w-3 h-3 text-amber-500" /> Market Index
        </div>
        <div className="relative w-40 h-40 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={scoreData} innerRadius={60} outerRadius={70} startAngle={180} endAngle={-180} dataKey="value" stroke="none">
                <Cell fill={getScoreColor(data.score)} />
                <Cell fill="#1f2937" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
             <span className="text-4xl font-mono font-bold text-white">{data.score}</span>
             <span className="text-[9px] uppercase tracking-widest text-neutral-500 mt-1">Potential</span>
          </div>
        </div>
        <div className={`mt-4 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
           data.score > 80 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 
           data.score > 60 ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' :
           'bg-red-500/10 border-red-500/30 text-red-500'
        }`}>{data.potential}</div>
      </ObsidianCard>

      <div className="lg:col-span-2 space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ObsidianCard className="p-5 flex flex-col gap-3">
              <div className="text-label flex items-center gap-2 mb-2">
                <Icons.Target className="w-3 h-3 text-blue-400" /> Target Sectors
              </div>
              <div className="flex flex-wrap gap-2">
                {data.target_sectors.map((s, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] rounded font-mono">{s}</span>
                ))}
              </div>
            </ObsidianCard>

            <ObsidianCard className="p-5 flex flex-col gap-3">
               <div className="text-label flex items-center gap-2 mb-2">
                <Icons.ShieldAlert className="w-3 h-3 text-red-400" /> Risk Factors
              </div>
              <ul className="space-y-2">
                {data.risk_factors.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-neutral-400 leading-tight">
                    <span className="text-red-500 mt-0.5">⚠️</span> {r}
                  </li>
                ))}
              </ul>
            </ObsidianCard>
         </div>

         <ObsidianCard className="p-5">
            <div className="flex flex-col md:flex-row gap-6">
               <div className="flex-1">
                  <div className="text-label flex items-center gap-2 mb-3">
                    <Icons.DollarSign className="w-3 h-3 text-emerald-400" /> Monetization
                  </div>
                  <ul className="space-y-2">
                    {data.monetization.map((m, i) => (
                      <li key={i} className="flex items-center gap-2 text-[11px] text-neutral-300">
                        <div className="w-1 h-1 rounded-full bg-emerald-500"></div> {m}
                      </li>
                    ))}
                  </ul>
               </div>
               <div className="w-px bg-white/5 hidden md:block"></div>
               <div className="flex-1">
                  <div className="text-label flex items-center gap-2 mb-3">
                    <Icons.Activity className="w-3 h-3 text-purple-400" /> Summary
                  </div>
                  <p className="text-[11px] leading-relaxed text-neutral-400 font-mono italic border-l-2 border-purple-500/30 pl-3">"{data.summary}"</p>
               </div>
            </div>
         </ObsidianCard>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// 4. SAVE MODAL (Restored & Improved)
// -----------------------------------------------------------------------------

const SaveModal = ({ isOpen, onClose, onSave, initialTitle, existingCategories }: any) => {
  const [title, setTitle] = useState(initialTitle || "");
  const [cat, setCat] = useState("");
  
  useEffect(() => { if(isOpen) setTitle(initialTitle || ""); }, [initialTitle, isOpen]);
  
  if(!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-enter">
       <ObsidianCard className="w-[450px] p-8 space-y-6 shadow-[0_0_100px_black] border-white/10">
          <h3 className="text-amber-500 font-bold font-mono text-xs uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-4">
            <Icons.Save className="w-3 h-3" /> Save to Vault
          </h3>
          
          <div className="space-y-5">
            <div>
              <label className="text-label mb-2 block">Asset Identifier (Title)</label>
              <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-amber-500/50 outline-none transition-colors font-mono" autoFocus placeholder="e.g. Neon Cyberpunk City..." />
            </div>
            
            <div>
              <label className="text-label mb-2 block">Classification (Category)</label>
              <div className="relative group">
                <input 
                  list="categories" 
                  value={cat} 
                  onChange={e=>setCat(e.target.value)} 
                  placeholder="Select or create category..."
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50 transition-colors font-mono placeholder:text-neutral-700" 
                />
                <datalist id="categories">
                  {existingCategories.map((c: string) => <option key={c} value={c} />)}
                  <option value="Visual" />
                  <option value="Concept" />
                  <option value="Production" />
                </datalist>
                <Icons.Tag className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600" />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/5">
            <button onClick={onClose} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors text-neutral-400">Discard</button>
            <button onClick={()=>{onSave(title, cat || 'Uncategorized'); onClose();}} disabled={!title} className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed">Confirm Save</button>
          </div>
       </ObsidianCard>
    </div>
  )
};

// -----------------------------------------------------------------------------
// 5. SIDEBAR (Restored & Improved)
// -----------------------------------------------------------------------------

const Sidebar = ({ isOpen, setIsOpen, templates, onLoadTemplate, onDeleteTemplate, onImport, onExport }: any) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'history'>('templates');
  const importInputRef = useRef<HTMLInputElement>(null);

  // Group templates by category
  const groupedTemplates = templates.reduce((acc: any, t: SavedTemplate) => {
    const c = t.category || 'Uncategorized';
    if (!acc[c]) acc[c] = [];
    acc[c].push(t);
    return acc;
  }, {});

  return (
    <div className={`fixed inset-y-0 left-0 bg-[#050505] z-50 transform transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-80 border-r border-white/10 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)]`}>
       {/* Header */}
       <div className="h-14 flex items-center justify-between px-6 border-b border-white/10 flex-shrink-0 bg-white/[0.02]">
          <span className="text-xs font-bold text-amber-500 tracking-widest font-mono flex items-center gap-2">
            <Icons.Library className="w-3 h-3" /> VAULT_V3.5
          </span>
          <button onClick={()=>setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-neutral-500 hover:text-white"><Icons.X className="w-4 h-4"/></button>
       </div>

       {/* Tabs */}
       <div className="flex border-b border-white/10 mx-4 mt-4">
          <button 
            onClick={() => setActiveTab('templates')}
            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'templates' ? 'text-white border-b-2 border-amber-500' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            Templates
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'history' ? 'text-white border-b-2 border-amber-500' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            History
          </button>
       </div>

       {/* Content List */}
       <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
          {activeTab === 'templates' ? (
             Object.keys(groupedTemplates).length === 0 ? (
               <div className="flex flex-col items-center justify-center py-20 opacity-30 gap-4">
                 <Icons.Library className="w-8 h-8 text-neutral-500" />
                 <span className="text-[10px] font-mono">NO_DATA_FOUND</span>
               </div>
             ) : (
               Object.entries(groupedTemplates).map(([category, items]: [string, any]) => (
                 <div key={category} className="space-y-3">
                    <div className="flex items-center gap-2 text-[9px] font-bold text-neutral-500 uppercase tracking-widest pl-1">
                       <Icons.Tag className="w-3 h-3" /> {category}
                    </div>
                    {items.map((t: SavedTemplate) => (
                      <div key={t.id} onClick={()=>onLoadTemplate(t)} className="group relative border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-amber-500/30 rounded-lg p-3 cursor-pointer transition-all">
                         <div className="flex justify-between items-start">
                            <h4 className="text-[11px] font-bold text-neutral-300 group-hover:text-white mb-1 line-clamp-1">{t.title}</h4>
                            <button onClick={(e)=>{e.stopPropagation(); onDeleteTemplate(t.id)}} className="text-neutral-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Icons.Trash className="w-3 h-3"/></button>
                         </div>
                         <p className="text-[10px] text-neutral-500 font-mono line-clamp-2">{t.content}</p>
                      </div>
                    ))}
                 </div>
               ))
             )
          ) : (
             <div className="flex flex-col items-center justify-center py-20 opacity-30 gap-4">
               <Icons.History className="w-8 h-8 text-neutral-500" />
               <span className="text-[10px] font-mono">LOGS_CLEARED</span>
             </div>
          )}
       </div>

       {/* Footer Actions */}
       <div className="p-4 border-t border-white/10 bg-white/[0.02] grid grid-cols-2 gap-3">
          <input type="file" accept=".json" ref={importInputRef} onChange={onImport} className="hidden" />
          <button onClick={() => importInputRef.current?.click()} className="flex items-center justify-center gap-2 py-2.5 border border-white/5 rounded-lg hover:bg-white/5 text-[9px] text-neutral-400 hover:text-white uppercase tracking-wider transition-colors">
            <Icons.FileUp className="w-3 h-3" /> Import
          </button>
          <button onClick={onExport} className="flex items-center justify-center gap-2 py-2.5 border border-white/5 rounded-lg hover:bg-white/5 text-[9px] text-neutral-400 hover:text-white uppercase tracking-wider transition-colors">
            <Icons.FileDown className="w-3 h-3" /> Export
          </button>
       </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// 6. MAIN ORCHESTRATOR
// -----------------------------------------------------------------------------

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  
  const [selectedDomain, setSelectedDomain] = useState<Domain>('general');
  const [selectedModel, setSelectedModel] = useState('Gemini 3 Flash Preview');
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
  
  const [stage, setStage] = useState<ProcessStage>('idle');
  const [refinedPrompt, setRefinedPrompt] = useState("");
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  
  const [templateToLoad, setTemplateToLoad] = useState<SavedTemplate | null>(null);
  const [tempContentToSave, setTempContentToSave] = useState("");
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [text, setText] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [useDeep, setUseDeep] = useState(false);
  const [useSearch, setUseSearch] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('promptRefine_templates');
    if (stored) try { setSavedTemplates(JSON.parse(stored)); } catch (e) {}
    setSelectedModel(DOMAIN_CONFIG[selectedDomain].defaultModel);
    if(selectedDomain === 'image') setInputMode('visual'); else setInputMode('text');
  }, [selectedDomain]);

  useEffect(() => {
    if (templateToLoad) {
      setText(templateToLoad.content);
      if (templateToLoad.domain === 'image') setInputMode('text'); 
    }
  }, [templateToLoad]);

  const handleSaveTemplate = (title: string, category: string) => {
    const t: SavedTemplate = { id: Date.now().toString(), title, category, content: tempContentToSave, domain: selectedDomain, createdAt: Date.now() };
    const next = [t, ...savedTemplates];
    setSavedTemplates(next);
    localStorage.setItem('promptRefine_templates', JSON.stringify(next));
    setIsSidebarOpen(true); // Open sidebar to show result
  };

  const handleDeleteTemplate = (id: string) => {
    const n = savedTemplates.filter(t => t.id !== id);
    setSavedTemplates(n);
    localStorage.setItem('promptRefine_templates', JSON.stringify(n));
  };

  const handleImportTemplates = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const imported = JSON.parse(ev.target?.result as string);
          if (Array.isArray(imported)) {
            const merged = [...imported, ...savedTemplates].reduce((acc, current) => {
              if (!acc.find((item: SavedTemplate) => item.id === current.id)) return acc.concat([current]);
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
    downloadAnchorNode.setAttribute("download", "prompt_vault_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files) as File[];
      const validFiles = newFiles.filter(f => f.size <= 5 * 1024 * 1024);
      const combinedFiles = [...images, ...validFiles].slice(0, 5);
      setImages(combinedFiles);
      const newPreviews = combinedFiles.map(f => URL.createObjectURL(f));
      setImagePreviews(newPreviews);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const runDiagnostic = async (promptText: string) => {
    try {
       const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
       const sys = "You are a Commercial Value Analyst for Generative AI Prompts. Analyze the commercial potential of the given prompt. Return STRICT JSON.";
       const prompt = `
         Analyze this prompt: "${promptText.substring(0, 500)}..."
         
         Output JSON structure:
         {
           "score": number (0-100),
           "potential": string (e.g., "High Commercial Value", "Niche Appeal", "Low Potential"),
           "target_sectors": string[] (max 4, e.g., ["Game Assets", "Stock Photography"]),
           "monetization": string[] (max 3 specific platforms/methods),
           "risk_factors": string[] (max 2, e.g., "Copyright", "Text Rendering Issues"),
           "summary": string (max 30 words executive summary)
         }
       `;
       const res = await ai.models.generateContent({
         model: 'gemini-3-flash-preview',
         contents: prompt,
         config: { responseMimeType: 'application/json', systemInstruction: sys }
       });
       if (res.text) setDiagnosticData(JSON.parse(res.text));
    } catch (e) {
      console.error("Diagnostic failed", e);
    }
  };

  const handleAnalyze = async () => {
    const apiKey = process.env.API_KEY;

    setStage('analyzing');
    setRefinedPrompt("");
    setDiagnosticData(null);
    setGeneratedVideoUrl(null);
    setGeneratedImageUrl(null);

    try {
      const ai = new GoogleGenAI({ apiKey: apiKey });
      let parts = [];
      
      const persona = DOMAIN_PERSONAS[selectedDomain] || "Expert AI Assistant";
      const arch = MODEL_PROFILES[selectedModel] || "";
      let task = "";

      if (images.length > 0 && !text.trim()) {
         task = "TASK: STRICT VISUAL REVERSE ENGINEERING (5+1 Formula). Output structured analysis.";
      } else if (selectedDomain === 'image' && text.trim()) {
         task = "TASK: IMAGE PROMPT OPTIMIZATION (Layered Method). Enhance details and style.";
      } else {
         task = "TASK: ADVANCED PROMPT OPTIMIZATION. Refine structure and logic.";
      }

      const sysInstr = `You are PromptRefine. ${persona}. \nTarget Architecture: ${selectedModel}\n${arch}\n${task}`;

      for (const img of images) {
         const b64 = await fileToBase64(img);
         parts.push({ inlineData: { mimeType: img.type, data: b64 }});
      }
      if (text.trim()) parts.push({ text: text });
      if (images.length > 0 && !text.trim()) parts.push({ text: "Reverse engineer this." });

      const tools = [];
      if (useSearch) tools.push({ googleSearch: {} });

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts },
        config: { systemInstruction: sysInstr, tools }
      });

      const outputText = result.text || "No output.";
      setRefinedPrompt(outputText);
      
      if (selectedDomain === 'image' || selectedDomain === 'video') {
         setStage('ready_to_render');
      } else {
         setStage('complete');
      }

      runDiagnostic(outputText);

    } catch (e: any) {
      setStage('error');
      setRefinedPrompt(`Error: ${e.message}`);
    }
  };

  const handleGenerateMedia = async () => {
    setStage('rendering');
    try {
        if (selectedDomain === 'image') {
           const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
           const res = await ai.models.generateContent({
             // Fixed: Use gemini-2.5-flash-image to avoid mandatory user API key selection for pro models
             model: 'gemini-2.5-flash-image',
             contents: { parts: [{ text: refinedPrompt }] },
             config: { imageConfig: { aspectRatio: "16:9" } }
           });
           const part = res.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
           if (part?.inlineData) setGeneratedImageUrl(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
        }
        if (selectedDomain === 'video') {
           await new Promise(r => setTimeout(r, 2000)); // Demo only
        }
        setStage('complete');
    } catch(e) {
        setStage('error');
    }
  };

  const canExecute = !['analyzing', 'rendering'].includes(stage) && (text.trim().length > 0 || images.length > 0);
  const existingCategories = Array.from(new Set(savedTemplates.map(t => t.category).filter(Boolean)));

  return (
    <div className="flex h-screen text-[#e5e5e5] font-sans overflow-hidden">
       <SaveModal 
         isOpen={isSaveModalOpen} 
         onClose={() => setIsSaveModalOpen(false)} 
         onSave={handleSaveTemplate} 
         initialTitle={tempContentToSave.substring(0, 30) || "New Optimization"} 
         existingCategories={existingCategories}
       />
       
       <Sidebar 
         isOpen={isSidebarOpen} 
         setIsOpen={setIsSidebarOpen} 
         templates={savedTemplates} 
         onLoadTemplate={(t: SavedTemplate) => { setTemplateToLoad(t); setSelectedDomain(t.domain); setIsSidebarOpen(false); }}
         onDeleteTemplate={handleDeleteTemplate}
         onImport={handleImportTemplates}
         onExport={handleExportTemplates}
       />

       <div className={`flex-1 flex flex-col h-full overflow-hidden relative transition-all duration-300 ${isSidebarOpen ? 'pl-80' : 'pl-0'}`}>
          <header className="h-14 flex-shrink-0 border-b border-white/5 bg-[#050505]/90 backdrop-blur-md flex items-center justify-between px-6 z-20">
             <div className="flex items-center gap-4">
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-neutral-500 hover:text-white transition-colors"><Icons.Menu className="w-5 h-5" /></button>
                <div className="flex items-center gap-2">
                   <Icons.Hexagon className="w-5 h-5 text-amber-500 fill-amber-500/10" />
                   <h1 className="font-bold text-base tracking-tight text-white/90">PromptRefine <span className="text-[9px] text-neutral-600 font-mono tracking-widest ml-2 border border-white/5 px-1 rounded">V3.5</span></h1>
                </div>
             </div>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
             <div className="max-w-[1400px] mx-auto w-full animate-enter">
                <ConfigPanel selectedDomain={selectedDomain} onSelectDomain={setSelectedDomain} selectedModel={selectedModel} onSelectModel={setSelectedModel} />
             </div>

             <div className="max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row gap-6 h-auto min-h-[500px]">
                <div className="w-full lg:w-5/12 flex flex-col gap-2 animate-enter" style={{animationDelay: '100ms'}}>
                   <div className="flex items-center justify-between pl-1">
                      <span className="text-label">Input Source</span>
                      <div className="flex bg-white/5 rounded-lg p-0.5">
                        <button onClick={()=>setInputMode('text')} className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded ${inputMode==='text' ? 'bg-white/10 text-white' : 'text-neutral-500'}`}>Text</button>
                        <button onClick={()=>setInputMode('visual')} className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded ${inputMode==='visual' ? 'bg-white/10 text-white' : 'text-neutral-500'}`}>Visual</button>
                      </div>
                   </div>
                   
                   <ObsidianCard className="flex-1 flex flex-col min-h-[400px]">
                      {/* ALWAYS MOUNTED INPUT to ensure availability in both modes */}
                      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
                      
                      <div className="flex-1 p-4 relative">
                         {inputMode === 'text' ? (
                           <div className="flex flex-col h-full">
                               <textarea value={text} onChange={e => setText(e.target.value)} placeholder={DOMAIN_CONFIG[selectedDomain].placeholder} className="flex-1 w-full bg-transparent text-sm font-mono text-neutral-300 resize-none outline-none placeholder:text-neutral-700 leading-relaxed custom-scrollbar" spellCheck={false} />
                               {images.length > 0 && (
                                   <div className="flex gap-2 mt-3 pt-3 border-t border-white/5 overflow-x-auto">
                                       {imagePreviews.map((src, idx) => (
                                           <div key={idx} className="relative group flex-shrink-0">
                                               <img src={src} className="w-16 h-16 object-cover rounded border border-white/10" />
                                               <button onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"><Icons.X className="w-3 h-3" /></button>
                                           </div>
                                       ))}
                                   </div>
                               )}
                           </div>
                         ) : (
                           <div onClick={() => fileInputRef.current?.click()} className="h-full border border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors relative group">
                              {images.length > 0 ? (
                                <div className="grid grid-cols-3 gap-2 p-4 w-full">
                                  {imagePreviews.map((src, idx) => (
                                      <div key={idx} className="relative aspect-square">
                                        <img src={src} className="w-full h-full object-cover rounded border border-white/10" />
                                        <button onClick={(e) => { e.stopPropagation(); removeImage(idx); }} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><Icons.X className="w-3 h-3" /></button>
                                      </div>
                                  ))}
                                  <div className="flex items-center justify-center border border-white/5 rounded hover:bg-white/5 aspect-square">
                                     <Icons.Plus className="w-6 h-6 text-neutral-600" />
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center text-neutral-600 group-hover:text-neutral-400 transition-colors">
                                    <Icons.Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <span className="text-xs font-mono">DROP_IMAGE_DATA</span>
                                </div>
                              )}
                           </div>
                         )}
                      </div>
                      <div className="p-4 border-t border-white/5 flex gap-3 items-center">
                         <button onClick={() => fileInputRef.current?.click()} className="p-2.5 rounded-lg border border-white/5 text-neutral-500 hover:text-white hover:bg-white/5 transition-colors" title="Attach Reference Image">
                            <Icons.Paperclip className="w-4 h-4" />
                         </button>
                         <div className="w-px h-6 bg-white/5 mx-1"></div>
                         <button onClick={() => setUseDeep(!useDeep)} className={`px-3 py-2 rounded text-[10px] font-bold uppercase tracking-wider border transition-all ${useDeep ? 'border-purple-500/50 text-purple-400 bg-purple-500/10' : 'border-white/5 text-neutral-500 hover:bg-white/5'}`}>Deep Reason</button>
                         <button onClick={handleAnalyze} disabled={!canExecute} className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-widest rounded shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:scale-100">{stage === 'analyzing' ? <Icons.Cpu className="w-3 h-3 animate-spin"/> : <Icons.Zap className="w-3 h-3 fill-current"/>} Execute</button>
                      </div>
                   </ObsidianCard>
                </div>

                <div className="w-full lg:w-7/12 flex flex-col gap-2 animate-enter" style={{animationDelay: '200ms'}}>
                   <div className="flex items-center justify-between pl-1">
                      <span className="text-label text-amber-500">Output Stream</span>
                      <div className="flex gap-3">
                         <button onClick={() => { setTempContentToSave(refinedPrompt); setIsSaveModalOpen(true); }} disabled={!refinedPrompt} className="text-[10px] text-neutral-500 hover:text-white flex items-center gap-1 uppercase tracking-wider transition-colors disabled:opacity-50"><Icons.Save className="w-3 h-3"/> Save Template</button>
                         <button onClick={() => navigator.clipboard.writeText(refinedPrompt)} disabled={!refinedPrompt} className="text-[10px] text-neutral-500 hover:text-white flex items-center gap-1 uppercase tracking-wider transition-colors disabled:opacity-50"><Icons.Copy className="w-3 h-3"/> Copy</button>
                      </div>
                   </div>

                   <ObsidianCard className="min-h-[300px] flex flex-col relative">
                      <div className="h-8 border-b border-white/5 flex items-center px-4 gap-2 bg-white/[0.02]">
                         <div className="w-2 h-2 rounded-full bg-red-500/20"></div>
                         <div className="w-2 h-2 rounded-full bg-amber-500/20"></div>
                         <div className="w-2 h-2 rounded-full bg-green-500/20"></div>
                      </div>
                      <div className="p-6 overflow-y-auto flex-1 font-mono text-sm custom-scrollbar relative">
                          {refinedPrompt ? <FormattedOutput text={refinedPrompt} /> : (
                             <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-800"><Icons.Terminal className="w-10 h-10 mb-3 opacity-50" /><span className="text-[10px] tracking-[0.3em] font-bold">AWAITING SIGNAL</span></div>
                          )}
                      </div>
                      {stage === 'ready_to_render' && (selectedDomain === 'image' || selectedDomain === 'video') && (
                        <div className="absolute bottom-6 right-6">
                           <button onClick={handleGenerateMedia} className="bg-white text-black px-4 py-2 rounded font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2"><Icons.Wand2 className="w-3 h-3" /> Render Preview</button>
                        </div>
                      )}
                   </ObsidianCard>

                   {(generatedImageUrl || generatedVideoUrl) && (
                      <ObsidianCard className="p-1 h-[250px] bg-black relative animate-enter">
                         {selectedDomain === 'image' ? <img src={generatedImageUrl!} className="w-full h-full object-contain" /> : <video src={generatedVideoUrl!} className="w-full h-full object-contain" controls autoPlay loop />}
                         <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur rounded text-[9px] font-mono text-emerald-500 border border-emerald-500/30">RENDER_COMPLETE</div>
                      </ObsidianCard>
                   )}

                   <MarketDiagnostic data={diagnosticData} />
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<ErrorBoundary><App /></ErrorBoundary>);
}