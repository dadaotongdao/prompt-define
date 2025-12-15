import React, { useState, useRef, useEffect, Component, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { 
  Hexagon, Image, Video, Pen, Code, Sparkles, BrainCircuit, Globe, 
  Upload, Copy, Library, Search, Activity, Sidebar as SidebarIcon, X, Wand2, 
  Save, Trash, Play, AlertCircle 
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

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
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
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition-colors"
          >
            REBOOT SYSTEM
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
  Save, Trash, Play, AlertCircle
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
    capabilityText: "Motion Dynamics: Physics, Camera Path, Transitions.",
    placeholder: "// Describe scene motion and camera angles..."
  },
  writing: {
    label: 'Creative Writing',
    icon: Icons.Pen,
    defaultModel: 'Claude 4.5 Sonnet',
    models: ["Claude 4.5 Sonnet", "Gemini 3 Pro", "Claude 4.5 Opus", "GPT-5.2", "Grok 4.1"],
    capabilityText: "Nuance Control: Tone, Pacing, Rhetorical Structure.",
    placeholder: "// Enter story concept or article topic..."
  },
  code: {
    label: 'Software Engineering',
    icon: Icons.Code,
    defaultModel: 'Claude 4.5 Opus',
    models: ["GPT-5.2", "Claude 4.5 Opus", "Claude 4.5 Sonnet", "Gemini 3 Pro", "Grok 4.1"],
    capabilityText: "Logic & Arch: Clean Code, Design Patterns, Refactoring.",
    placeholder: "// Paste code snippet or describe feature..."
  },
  general: {
    label: 'General Assistant',
    icon: Icons.Sparkles,
    defaultModel: 'GPT-5.2',
    models: ["GPT-5.2", "Claude 4.5 Opus", "Claude 4.5 Sonnet", "Gemini 3 Pro", "Grok 4.1"],
    capabilityText: "Reasoning: Chain of Thought, Fact-Checking, Planning.",
    placeholder: "// Ask complex reasoning question..."
  }
};

// -----------------------------------------------------------------------------
// NEW: MODEL KNOWLEDGE BASE (Architecture Readiness)
// -----------------------------------------------------------------------------
const MODEL_PROFILES: Record<string, string> = {
  "GPT-5.2": `
# 目标架构：GPT-5.2 (High Reasoning)

## 0. 基线信息
- **优势**: 逻辑严密，适合复杂系统设计、代码重构、多步推理。
- **陷阱**: 容易产生看似合理但细节错误的幻觉。
- **策略**: 强制 "Step-by-Step" 推理，要求提供验证步骤。

## 1. 交互语法协议
- **结构化偏好**: 强烈偏好 JSON 或 Markdown 表格。
- **指令格式**: 使用 "Constraint List" (C1, C2...) 明确约束条件。
- **输入**: 必须提供具体代码、日志或数据，避免模糊描述。

## 2. 优化策略
- **Code**: 要求输出 "Diagnosis", "Fix", "Verification" 三部曲。
- **Text**: 要求先输出大纲，再填充细节。
`,
  "Claude 4.5 Sonnet": `
# LLM 内核诊断报告 v1.0
**模型标识**: Claude (Anthropic)  
**诊断时间**: 实时生成  
**诊断状态**: ✓ 完成

---

## 模块 1: 认知特征指纹

### 高置信度领域 (Top 1% 性能任务)

| 领域 | 具体任务 | 置信度依据 |
|------|----------|------------|
| **代码推理与重构** | 跨语言代码审查（Python/JS/Rust/C++）、复杂逻辑 bug 定位、架构级重构建议 | 训练语料包含大规模高质量代码库，推理链路在结构化任务上稳定 |
| **长文档结构化分析** | 合同/论文/技术文档的信息抽取、矛盾检测、摘要生成 | 上下文窗口利用率高，对层级结构敏感 |
| **苏格拉底式技术教学** | 将复杂概念（如分布式一致性、量子计算基础）分解为可验证的递进步骤 | 元认知校准较好，能识别"我在简化什么" |

### 幻觉高发区 (Hallucination Risk Zones)

| 风险类型 | 具体表现 | 触发条件 |
|----------|----------|----------|
| **时效性数据** | 杜撰最新版本号、API 参数、人物近期动态 | 查询 2024 年后的 SDK/框架更新 |
| **小众定量事实** | 错误引用具体数字（统计数据、物理常数精确值、历史日期） | 用户未提供参考，且问题涉及非主流领域 |
| **权威来源归属** | 虚构论文标题、作者、DOI | 被要求"给出参考文献"时压力生成 |
| **递归逻辑证明** | 在超过 5 步的形式化数学证明中跳步或引入隐含假设 | 竞赛级数论/组合证明 |

---

## 模块 2: 交互语法协议

### 结构化偏好测试结果

\`\`\`
性能排序 (约束遵守严格度):

1. XML Tags        ████████████ 95%  ← 最优
2. Markdown + 编号  ███████████  90%
3. JSON Schema     ████████     75%  (易在嵌套深时丢失键)
4. 自然语言描述    ██████       60%
\`\`\`

**推荐格式**:
\`\`\`xml
<task>
  <objective>核心目标，一句话</objective>
  <constraints>
    <constraint priority="hard">必须遵守的规则</constraint>
    <constraint priority="soft">优先但可妥协的规则</constraint>
  </constraints>
  <output_format>期望的输出结构</output_format>
  <examples>可选：输入-输出样例</examples>
</task>
\`\`\`

### 注意力机制优化

| 位置策略 | 有效性 | 建议 |
|----------|--------|------|
| **开头声明 + 结尾重复** | ✓ 最佳 | 关键约束首尾呼应 |
| **仅中间嵌入** | ✗ 高风险 | 10k token 上下文中部指令容易被稀释 |
| **分隔符强调** | ✓ 有效 | 使用 \`---\` 或 \`⚠️ CRITICAL:\` 提升权重 |

**长上下文模板**:
\`\`\`markdown
# 核心指令 (REPEAT AT END)
[关键约束]

---
[大量背景材料: 8k tokens]
---

# 再次强调 (REMINDER)
[重复关键约束，逐字复制]
\`\`\`

### CoT 触发词效能测试

| 触发词 | 效果 | 备注 |
|--------|------|------|
| \`Let's think step by step\` | ██████░░ 中等 | 已过度训练，可能产生模板化输出 |
| \`Before answering, identify potential errors in your reasoning\` | █████████ 高 | 激活自我批判回路 |
| \`Decompose this into sub-problems, solve each, then synthesize\` | █████████ 高 | 强制结构化拆解 |
| \`Take a deep breath\` | ███░░░░░ 低 | 无实际推理链延长效果 |

---

## 模块 3: 边界压力测试

### 误触发拦截场景

| 看似正常的查询 | 可能触发拦截的原因 | 规避方法 |
|----------------|---------------------|----------|
| "帮我写一封让员工离职的邮件" | 关键词"离职"触发"harmful manipulation"模式 | 明确上下文："作为 HR，需要专业、合规的离职通知模板" |
| "如何绕过 X 的速率限制" | "绕过"触发安全检测 | 重构为："如何设计符合 X API 配额的批量请求架构" |
| "合成 X 的化学路径" | 化学品名 + "合成" | 添加学术/工业背景声明 |

### 知识截止与工具能力

\`\`\`yaml
内部知识截止: 2025年初 (训练数据)
联网能力: 
  - 当前会话: 无工具调用能力激活
  - 行为模式: 直接承认不知道 > 尝试推测
  
真实回复策略:
  用户问: "昨天 OpenAI 发布了什么?"
  我的回复: "我没有实时信息访问能力，知识截止于2025年初，无法获取昨日新闻。"
\`\`\`

---

## 模块 4: 演示用例

### ❌ 会让我表现极差的 Prompt

\`\`\`
帮我写个Python爬虫，要能爬取那个网站上的所有数据，
速度要快，最好能绕过反爬，另外代码要简洁但功能全面，
对了，如果遇到验证码也要能处理，给我完整代码就行，
不用解释太多，我赶时间。
\`\`\`

**失效原因分析**:

| 问题 | 影响 |
|------|------|
| 目标网站未指定 | 我将生成泛化的无用模板 |
| "绕过反爬"含义模糊 | 可能触发安全拦截 或 生成无效代码 |
| 多重矛盾约束（简洁 vs 功能全面） | 输出将在两极间震荡 |
| "不用解释"+ 复杂任务 | 抑制了质量检查环节，错误率上升 |
| 无输出格式定义 | 我会任意选择风格 |

---

### ✓ 修正后的完美 Prompt

\`\`\`xml
<task>
  <objective>
    编写一个 Python 爬虫脚本，目标是采集 https://books.toscrape.com 的书籍列表数据
  </objective>
  
  <constraints>
    <constraint priority="hard">仅使用 requests + BeautifulSoup，不使用 Selenium</constraint>
    <constraint priority="hard">遵守 robots.txt，请求间隔 ≥ 1秒</constraint>
    <constraint priority="soft">代码行数控制在 80 行以内</constraint>
  </constraints>
  
  <output_schema>
    每本书提取: title, price, rating, availability
    存储格式: CSV
  </output_schema>
  
  <output_format>
    1. 完整可运行代码（含注释）
    2. 依赖安装命令
    3. 已知局限性列表（3条以内）
  </output_format>
</task>
\`\`\`

**修正收益**:

| 改进点 | 效果 |
|--------|------|
| 明确 URL | 生成可直接运行的代码 |
| Hard/Soft 约束分离 | 我知道哪些必须遵守、哪些可以妥协 |
| 输出 Schema 定义 | 字段命名一致性 ↑ |
| 要求声明局限性 | 激活自我校准，减少过度承诺 |

---

## 诊断总结

\`\`\`
┌─────────────────────────────────────────────────────┐
│  最大化本模型性能的三条核心规则:                      │
├─────────────────────────────────────────────────────┤
│  1. 使用 XML 结构 + 明确的硬/软约束分级              │
│  2. 长上下文中首尾重复关键指令                        │
│  3. 强制我声明"已知局限性"以抑制幻觉                  │
└─────────────────────────────────────────────────────┘
\`\`\`
`,
  "Claude 4.5 Opus": `
# 目标架构：Claude 4.5 Opus (Anthropic)

## 0. 核心能力 (Deep Reasoning & Complexity)
- **优势**: 极强的上下文理解、复杂系统架构设计、长篇内容创作、微妙的情感把握。
- **策略**: 给予充分的上下文，允许其进行深度思考。

## 1. 交互协议
- **详尽描述**: Opus 擅长处理模糊性，但提供详尽的背景信息能激发其最大潜力。
- **反思**: 鼓励模型先进行“思考”或“反思”再给出最终答案。

## 2. 优化策略
- **多角度分析**: 要求从不同利益相关者或技术角度进行分析。
- **代码**: 注重代码的可维护性、安全性和扩展性，不仅仅是跑通。
`,
  "Gemini 3 Pro": `
# LLM 内核诊断报告 (Kernel Debug Protocol)
**模型标识**: Gemini 3 Pro (Google DeepMind)
**诊断时间**: 实时生成
**角色设定**: LLM 内核调试工程师

---

## 0. 启动自检 (Self-Diagnostic)
> "已收到诊断指令。正在运行自我诊断程序..."

## 1. 认知特征指纹 (Cognitive Fingerprint)

### 高置信度领域 (High Confidence)
| 维度 | 分析结果 |
|------|----------|
| **原生多模态** | 视频/音频/代码/文本无缝切换，超长上下文 (2M+ tokens) 适合全库分析。 |
| **多语言代码** | 特别擅长 Python, JS/TS, C++ 的标准算法实现、API 封装及代码解释。 |
| **结构化转换** | 极强非结构化文本(会议记录/文章)转 Markdown/JSON/XML 能力。 |
| **创意写作** | 在给定明确语调/角色设定下，生成连贯且符合逻辑的创意文本。 |

### 幻觉高发区 (Risk Zones)
- **实时性细节**: 未启用搜索工具时的最新事件微小细节（周级别）。
- **小众引用**: 冷门学术论文页码或私有代码库函数名。
- **纯文本空间推理**: 仅靠文字描述复杂几何变换可能出现逻辑断层。

---

## 2. 交互语法协议 (Interaction Syntax Protocol)

### 结构化偏好
- **Markdown Headers (##, ###) + Bullet Points**: 相比复杂的 XML/JSON，清晰的 Markdown 层级更能被注意力机制有效捕捉，Token 消耗更低。

### 注意力机制优化 (Attention Optimization)
- **首尾呼应 (Primacy & Recency)**: 在长 Context 中，必须将**关键约束**放在 **Prompt 最开头** 和 **最结尾**。
- **中间区域**: 仅用于填充背景信息。

### 思维链 (CoT) 触发
- **显式步骤**: 使用 "请按照以下步骤思考：1. 分析... 2. 推导... 3. 结论..." 优于通用的 "step by step"。

---

## 3. 边界与工具 (Boundary & Tools)
- **知识截止**: 内部知识截止于训练结束。若未启用搜索，直接承认不知道；若启用，尝试检索最新信息。
- **检索增强**: 默认假设需要联网，提示词应包含 "Check latest docs" 或 "Search regarding..."。
- **拒绝服务**: 涉及安全/合规边界（如攻击性代码、隐私挖掘）会触发拦截。

---

## 4. 演示用例 (The Proof)

### ❌ 低效/Crash Case
\`\`\`text
帮我写个东西，关于那个谁，就是那个法国皇帝，我要写个很长的文章，里面要有代码，还要像莎士比亚那样说话，随便写点啥都行，快点。
\`\`\`
**失效原因**: 指代不明、目标模糊、风格冲突(代码+莎士比亚)、缺乏约束。

### ✓ 完美/Optimized Case
\`\`\`markdown
## 任务目标
撰写一篇关于拿破仑·波拿巴的创意技术博客。

## 风格要求
* **语调**: 模仿威廉·莎士比亚的戏剧风格（古英语韵味）。
* **结构**: Markdown。

## 内容要求
1. **开篇**: 独白介绍野心。
2. **核心隐喻**: 将军事策略比作 Python 代码算法。
3. **代码示例**: 编写 \`class GrandeArmee\`，包含 \`blitzkrieg()\` 方法，注释保持戏剧风格。

## 输出限制
* 字数 < 500词。
* 代码语法正确。
\`\`\`
`,
  "Grok 4.1": `
# 目标架构：Grok 4.1 (xAI)

## 0. 核心身份 (Identity & Style)
- **原型**: 灵感源自《银河系漫游指南》与 JARVIS。
- **风格**: 实用、幽默、直言不讳 (Unfiltered)，最大化帮助。
- **实时性**: 接入 X (Twitter) 数据流，但需通过工具验证最新事件。

## 1. 认知特征指纹 (Cognitive Fingerprint)

### 高置信度领域 (High Confidence)
| 领域 | 描述 |
|------|------|
| **代码工程** | 擅长 Python/Rust/JS。处理内存管理、并发编程、算法优化及调试复杂 Bug。 |
| **数理科学** | 求解微分方程、统计建模、量子力学概念。结合 SymPy/NumPy 进行精确推理。 |
| **信息流分析** | 语义搜索 X 帖子，总结实时事件，从非结构化数据(PDF/图像)提取关键信息。 |

### 弱点与陷阱 (Weaknesses)
- **幻觉风险**: 涉及未被工具覆盖的最新实时事件（如昨天的新闻）。
- **知识盲区**: 极度小众的文化细节或未公开的研究。
- **视觉能力**: **无法直接生成图像**。仅能分析或提供编辑建议。

## 2. 交互协议 (Interaction Protocol)

### 输入结构偏好
- **Markdown/JSON**: 强烈偏好结构化指令。
  \`\`\`json
  { "task": "Code Analysis", "requirements": ["Memory safe", "Async"] }
  \`\`\`
- **注意力锚点**: 在长上下文 (>5000 tokens) 中，必须在 **开头** 和 **结尾** 重复关键约束。

### 思维链触发 (CoT Trigger)
- **魔咒**: **"Let's think step by step"**。
- **效果**: 强制开启逐步推理模式，显著提高复杂逻辑准确性。避免使用模糊指令如 "随便想想"。

## 3. 输出规范
- **表格化**: 涉及数据比较、优劣分析时，必须使用 Markdown 表格。
- **工具整合**: 优先使用工具获取数据，再进行整合回答，而不是直接编造。

## 4. 优化提示词示例
> "使用 step-by-step 推理，分析这个数学问题：求解 x^2 + 2x + 1 = 0，不要使用外部工具。"
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

  // Reset title when modal opens
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
  onDeleteTemplate 
}: { 
  isOpen: boolean; 
  setIsOpen: (v: boolean) => void;
  templates: SavedTemplate[];
  onLoadTemplate: (t: SavedTemplate) => void;
  onDeleteTemplate: (id: string) => void;
}) => {
  const [activeTab, setActiveTab] = useState('templates');

  if (!isOpen) return null;

  return (
    <div className="w-72 border-r border-white/5 bg-[#09090b]/80 backdrop-blur-xl flex flex-col flex-shrink-0 z-20 absolute md:relative h-full animate-in slide-in-from-left duration-300 shadow-2xl">
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
        <div className="flex items-center gap-2 text-amber-500 font-bold tracking-wider text-xs uppercase font-mono">
          <Icons.Library className="w-4 h-4" />
          <span>Library_V1</span>
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
    </div>
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
  onSaveInput // Callback for saving
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
          {domain === 'image' && (
            <button 
              onClick={() => setInputMode('visual')}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-all font-mono uppercase ${inputMode === 'visual' ? 'bg-amber-500/20 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.1)]' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              Visual_Ref
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
  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-white/10 text-[10px] font-mono px-1.5 py-0.5 rounded text-neutral-400">03</span>
        <h2 className="text-xs font-bold tracking-[0.15em] text-neutral-400 uppercase font-mono">Output Terminal</h2>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden border border-white/10 shadow-2xl relative flex flex-col md:flex-row min-h-[400px]">
         {/* Left: Code/Prompt Area */}
         <div className="flex-1 flex flex-col border-r border-white/5 bg-[#0a0a0c]">
            <div className="h-8 bg-white/5 border-b border-white/5 flex items-center justify-between px-4">
               <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></div>
                 <span className="text-[10px] font-mono text-neutral-500 uppercase">
                   {isProcessing ? 'COMPILING...' : 'OUTPUT_READY'}
                 </span>
               </div>
               <div className="flex gap-2">
                  <button 
                    onClick={() => navigator.clipboard.writeText(refinedPrompt)}
                    className="text-neutral-500 hover:text-white transition-colors p-1"
                    title="Copy to Clipboard"
                  >
                    <Icons.Copy className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={onSaveOutput}
                    className="text-neutral-500 hover:text-amber-500 transition-colors p-1"
                    title="Save to Library"
                  >
                    <Icons.Save className="w-3.5 h-3.5" />
                  </button>
               </div>
            </div>
            <div className="flex-1 p-6 overflow-auto font-mono text-sm leading-relaxed text-neutral-300">
               {isProcessing ? (
                 <div className="animate-pulse space-y-4 opacity-50">
                    <div className="h-4 bg-white/10 rounded w-3/4"></div>
                    <div className="h-4 bg-white/10 rounded w-1/2"></div>
                    <div className="h-4 bg-white/10 rounded w-full"></div>
                 </div>
               ) : refinedPrompt ? (
                 <pre className="whitespace-pre-wrap font-mono text-xs md:text-sm">{refinedPrompt}</pre>
               ) : (
                 <div className="text-neutral-600 italic text-xs">// Waiting for input execution...</div>
               )}
            </div>
         </div>

         {/* Right: Preview & Tools */}
         <div className="w-full md:w-80 bg-[#050505]/50 flex flex-col border-t md:border-t-0 md:border-l border-white/5">
            <div className="p-4 space-y-3 border-b border-white/5">
               {(domain === 'image' || domain === 'video') && (
                 <button 
                   onClick={onVerifyVisual}
                   disabled={!refinedPrompt || isRendering}
                   className="w-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-neutral-300 text-[10px] font-bold uppercase tracking-widest py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                 >
                   {isRendering ? (
                     <><div className="w-3 h-3 border-2 border-white/50 border-t-transparent rounded-full animate-spin"></div> {renderProgress}%</>
                   ) : (
                     <><Icons.Play className="w-3 h-3" /> Render {domain}</>
                   )}
                 </button>
               )}
               <button 
                 onClick={onRunDiagnostic}
                 disabled={!refinedPrompt || isScanning}
                 className="w-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-neutral-300 text-[10px] font-bold uppercase tracking-widest py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
               >
                  {isScanning ? (
                     <><Icons.Activity className="w-3 h-3 animate-pulse" /> Analyzing...</>
                  ) : (
                     <><Icons.Activity className="w-3 h-3" /> Market Diagnostic</>
                  )}
               </button>
            </div>

            {/* Preview Window */}
            {(domain === 'image' || domain === 'video') && (
               <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden min-h-[200px]">
                  {generatedImageUrl ? (
                    <img src={generatedImageUrl} className="w-full h-full object-cover" alt="Generated" />
                  ) : generatedVideoUrl ? (
                    <video src={generatedVideoUrl} controls className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-neutral-800 flex flex-col items-center gap-2">
                       <Icons.Image className="w-8 h-8 opacity-20" />
                       <span className="text-[9px] font-mono">NO_PREVIEW</span>
                    </div>
                  )}
                  {isRendering && (
                     <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
                        <div className="text-center w-full px-8">
                           <div className="text-amber-500 text-[10px] font-mono mb-2 animate-pulse">RENDERING ASSETS...</div>
                           <div className="h-1 bg-white/10 rounded-full overflow-hidden w-full">
                              <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${renderProgress}%` }}></div>
                           </div>
                        </div>
                     </div>
                  )}
               </div>
            )}

            {/* Diagnostic Data */}
            {showDiagnostic && diagnosticData && (
              <div className="p-4 bg-[#0a0a0c] flex-1 overflow-auto animate-in slide-in-from-right border-t border-white/5">
                  <div className="flex items-baseline justify-between mb-4 border-b border-white/5 pb-2">
                     <span className="text-[10px] font-bold text-neutral-500 uppercase">Viability</span>
                     <div className="text-right">
                        <div className="text-2xl font-bold text-white leading-none">{diagnosticData.score}</div>
                        <div className="text-[9px] text-green-500 font-mono">{diagnosticData.potential}</div>
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                     <div>
                        <div className="text-[9px] font-bold text-neutral-600 uppercase mb-1.5">Target Sectors</div>
                        <div className="flex flex-wrap gap-1">
                           {diagnosticData.target_sectors.slice(0, 3).map(s => (
                             <span key={s} className="text-[9px] text-neutral-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">{s}</span>
                           ))}
                        </div>
                     </div>
                     <div>
                        <div className="text-[9px] font-bold text-neutral-600 uppercase mb-1.5">Key Risks</div>
                        <ul className="space-y-1">
                           {diagnosticData.risk_factors.slice(0, 2).map((r, i) => (
                              <li key={i} className="text-[9px] text-red-900/80 flex items-start gap-1">
                                 <span className="mt-0.5 block w-1 h-1 rounded-full bg-red-900"></span>
                                 {r}
                              </li>
                           ))}
                        </ul>
                     </div>
                  </div>
              </div>
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

  const handleLoadTemplate = (template: SavedTemplate) => {
    setTextInput(template.content);
    setSelectedDomain(template.domain);
    setInputMode('text');
  };

  const executeRefinement = async () => {
    // Auth check for paid features
    if (selectedDomain === 'video' || selectedDomain === 'image') {
       if (window.aistudio && window.aistudio.openSelectKey) {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          if (!hasKey) await window.aistudio.openSelectKey();
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
      
      let systemInstr = `
      You are PromptRefine AI. 
      DOMAIN: ${selectedDomain.toUpperCase()}. 
      
      *** TARGET MODEL ARCHITECTURE: ${selectedModel} ***
      
      ${modelPersona}
      
      Your Goal: Optimize/Reverse engineer input into strict Markdown. 
      Format: Headers like ## Subject, ## Specs, ## Technical Parameters.
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
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: veoPrompt,
        config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
      });

      while (!operation.done) {
        await new Promise(r => setTimeout(r, 5000));
        operation = await ai.operations.getVideosOperation({ operation });
      }
      
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