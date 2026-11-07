import { FormEvent, useEffect, useState } from "react";
import ProductApp from "./ProductApp";
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  Bot,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDot,
  Clock3,
  Code2,
  FileCheck2,
  FileText,
  GitBranch,
  LayoutDashboard,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Terminal,
  Users,
  X,
  Zap,
} from "lucide-react";

const workflowSteps = [
  {
    label: "理解任务",
    title: "把一句需求，变成可执行的项目",
    description:
      "AI 总经理先理解目标、约束与交付标准，再拆解任务依赖，不再让多个 AI 各自猜测上下文。",
    output: "结构化 Brief · 任务 DAG · 验收标准",
    icon: Sparkles,
    color: "#6c5ce7",
  },
  {
    label: "团队执行",
    title: "让专职 Agent 接力协作",
    description:
      "研究、策略、内容与设计 Agent 共享同一项目记忆，上游成果会自动成为下游任务的可靠输入。",
    output: "研究洞察 · 策略方案 · 内容资产",
    icon: Users,
    color: "#2474ff",
  },
  {
    label: "策略审核",
    title: "关键动作，始终由你决定",
    description:
      "预算、品牌主张与最终交付进入人工审批。驳回后自动回到正确节点修订，并保留完整依据。",
    output: "审批记录 · 修改建议 · 安全策略",
    icon: ShieldCheck,
    color: "#e9823d",
  },
  {
    label: "完成交付",
    title: "从执行过程直接生成交付物",
    description: "统一管理版本、依据与客户反馈，将每次成功交付沉淀为下一次可以复用的工作流和知识。",
    output: "交付包 · 版本历史 · 可复用模板",
    icon: FileCheck2,
    color: "#18a77d",
  },
];

const agents = [
  { name: "AI 总经理", task: "项目拆解与调度", short: "GM", color: "#6c5ce7", status: "正在规划" },
  { name: "市场研究员", task: "竞品与趋势研究", short: "MR", color: "#2474ff", status: "已完成" },
  { name: "品牌策略师", task: "定位与传播策略", short: "BS", color: "#e9823d", status: "等待输入" },
  { name: "内容创意", task: "主题、文案与脚本", short: "CC", color: "#d84f82", status: "准备就绪" },
];

const faqs = [
  {
    q: "ShadowFlow 与普通 AI 对话工具有什么不同？",
    a: "普通对话工具解决一次生成，ShadowFlow 管理完整业务过程：角色、任务依赖、审核策略、版本与交付都在同一个可追踪工作流里。",
  },
  {
    q: "可以接入现有模型和工具吗？",
    a: "可以。工作流可以按任务连接不同模型、内部知识与常用工具，保留你现有的最佳实践，而不是强迫团队迁移到单一模型。",
  },
  {
    q: "AI 的输出会未经确认直接发送吗？",
    a: "不会。你可以为高风险节点设置强制人工审核、驳回与回滚规则，只有通过策略检查的内容才会进入下一阶段。",
  },
];

export default function App() {
  const [productMode, setProductMode] = useState(
    window.location.pathname.startsWith("/app") || window.location.hash === "#/app",
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const sync = () =>
      setProductMode(
        window.location.pathname.startsWith("/app") || window.location.hash === "#/app",
      );
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  if (productMode) return <ProductApp />;

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }

  function openDemo() {
    setSubmitted(false);
    setModalOpen(true);
    setMenuOpen(false);
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="site-shell">
      <nav className="topbar">
        <div className="nav-wrap">
          <button className="brand" onClick={() => scrollTo("home")} aria-label="ShadowFlow 首页">
            <Logo />
            <span>ShadowFlow</span>
          </button>
          <div className="nav-links">
            <button onClick={() => scrollTo("product")}>产品</button>
            <button onClick={() => scrollTo("workflow")}>工作流</button>
            <button onClick={() => scrollTo("agents")}>AI 团队</button>
            <button onClick={() => scrollTo("security")}>安全与审核</button>
          </div>
          <div className="nav-actions">
            <a href="https://github.com/Ravenveil/ShadowFlow" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <button className="primary-btn compact" onClick={openDemo}>
              申请体验 <ArrowRight size={15} />
            </button>
          </div>
          <button
            className="mobile-trigger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="切换菜单"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <div className="mobile-menu">
            {[
              ["产品", "product"],
              ["工作流", "workflow"],
              ["AI 团队", "agents"],
              ["安全与审核", "security"],
            ].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)}>
                {label}
              </button>
            ))}
            <button className="primary-btn" onClick={openDemo}>
              申请体验 <ArrowRight size={16} />
            </button>
          </div>
        )}
      </nav>

      <header id="home" className="hero">
        <div className="hero-glow" />
        <div className="content-wrap hero-copy">
          <div className="eyebrow">
            <span>NEW</span>
            Contract-first 多 Agent 协作平台
            <ChevronRight size={13} />
          </div>
          <h1>
            让一群 AI，
            <br />
            像一个真正的<span>团队</span>。
          </h1>
          <p>
            从任务拆解、Agent 协作到人工审核与成果交付。
            <br />
            用一条可见、可控、可复用的工作流，经营你的 AI 公司。
          </p>
          <div className="hero-actions">
            <button className="primary-btn large" onClick={openDemo}>
              免费申请体验 <ArrowRight size={17} />
            </button>
            <button className="secondary-btn large" onClick={() => scrollTo("product")}>
              <Play size={15} fill="currentColor" /> 查看产品
            </button>
          </div>
          <div className="hero-notes">
            <span>
              <Check size={13} /> 15 分钟完成配置
            </span>
            <span>
              <Check size={13} /> 支持人工审核与回滚
            </span>
            <span>
              <Check size={13} /> 灵活接入主流模型
            </span>
          </div>
        </div>
        <div id="product" className="content-wrap product-stage">
          <Workbench />
          <div className="stage-shadow" />
        </div>
      </header>

      <section className="trust-bar">
        <div className="content-wrap">
          <p>为复杂业务而生的 AI 协作基础设施</p>
          <div>
            <span>
              <GitBranch /> 可视化工作流
            </span>
            <span>
              <ShieldCheck /> 策略与审批
            </span>
            <Terminal /> <span>任意模型接入</span>
            <span>
              <Activity /> 全链路追踪
            </span>
          </div>
        </div>
      </section>

      <section id="workflow" className="section workflow-section">
        <div className="content-wrap">
          <SectionHeading
            kicker="ONE FLOW, COMPLETE DELIVERY"
            title="不是更多 AI 工具，\n而是一套完整的交付系统。"
            copy="把模糊需求转化为可执行流程，让不同 Agent 在清晰的责任边界里协作，你只在真正重要的节点做决定。"
          />
          <div className="workflow-grid">
            <div className="workflow-tabs">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <button
                    key={step.label}
                    className={activeStep === index ? "active" : ""}
                    onClick={() => setActiveStep(index)}
                  >
                    <span className="step-index">0{index + 1}</span>
                    <span
                      className="step-icon"
                      style={{ "--step-color": step.color } as React.CSSProperties}
                    >
                      <Icon size={18} />
                    </span>
                    <span>
                      <small>{step.label}</small>
                      <strong>{step.title}</strong>
                    </span>
                    <ChevronRight size={17} />
                  </button>
                );
              })}
            </div>
            <WorkflowPreview step={workflowSteps[activeStep]} index={activeStep} />
          </div>
        </div>
      </section>

      <section id="agents" className="section agents-section">
        <div className="content-wrap">
          <SectionHeading
            kicker="YOUR AI TEAM"
            title="每个 Agent 都有角色，\n也有明确的责任边界。"
            copy="不是把同一个 Prompt 发给四个机器人，而是让每位 AI 员工拥有自己的技能、工具、上下文和交付标准。"
            light
          />
          <div className="agent-grid">
            {agents.map((agent, index) => (
              <article className="agent-card" key={agent.name}>
                <div className="agent-top">
                  <span>A0{index + 1}</span>
                  <MoreHorizontal size={18} />
                </div>
                <div
                  className="agent-avatar"
                  style={{ "--agent-color": agent.color } as React.CSSProperties}
                >
                  {agent.short}
                  <i />
                </div>
                <h3>{agent.name}</h3>
                <p>{agent.task}</p>
                <div className="agent-status">
                  <span className={index === 0 ? "working" : ""} />
                  {agent.status}
                </div>
              </article>
            ))}
          </div>
          <div className="team-console">
            <div>
              <span className="console-icon">
                <Bot size={22} />
              </span>
              <div>
                <small>TEAM ORCHESTRATION</small>
                <strong>AI 总经理正在调度 3 位团队成员</strong>
              </div>
            </div>
            <div className="console-flow">
              {agents.map((agent, index) => (
                <span
                  key={agent.short}
                  style={{ "--agent-color": agent.color } as React.CSSProperties}
                >
                  {agent.short}
                  {index < agents.length - 1 && <i />}
                </span>
              ))}
            </div>
            <button onClick={() => scrollTo("workflow")}>
              查看工作流 <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      <section id="security" className="section governance-section">
        <div className="content-wrap governance-grid">
          <div className="governance-copy">
            <p className="section-kicker">HUMAN IN THE LOOP</p>
            <h2>
              AI 负责执行，
              <br />
              最终决定权仍在你。
            </h2>
            <p>
              ShadowFlow 在关键业务节点加入可配置的人工审核。
              你可以批准、驳回或回到任意检查点，而所有依据和修改都会被完整记录。
            </p>
            <ul>
              <li>
                <Check /> 高风险动作强制人工确认
              </li>
              <li>
                <Check /> 驳回后自动返回正确节点修订
              </li>
              <li>
                <Check /> 全链路版本、成本与依据可追踪
              </li>
            </ul>
            <button className="secondary-btn" onClick={openDemo}>
              了解安全机制 <ArrowRight size={15} />
            </button>
          </div>
          <ApprovalCard />
        </div>
      </section>

      <section className="section faq-section">
        <div className="content-wrap faq-grid">
          <div>
            <p className="section-kicker">QUESTIONS, ANSWERED</p>
            <h2>
              开始之前，
              <br />
              你可能想知道。
            </h2>
            <p>还有其他问题？</p>
            <button onClick={openDemo}>
              和我们聊聊 <ArrowRight size={14} />
            </button>
          </div>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <article key={faq.q} className={openFaq === index ? "open" : ""}>
                <button onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
                  <span>0{index + 1}</span>
                  <strong>{faq.q}</strong>
                  <ChevronDown size={19} />
                </button>
                <div>
                  <p>{faq.a}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="content-wrap">
          <div className="cta-mark">
            <Logo />
          </div>
          <p>YOUR METHOD. YOUR TEAM. YOUR COMPANY.</p>
          <h2>
            准备好组建你的
            <br />
            <span>AI 团队</span>了吗？
          </h2>
          <button className="primary-btn large inverse" onClick={openDemo}>
            申请产品体验 <ArrowRight size={17} />
          </button>
        </div>
      </section>

      <footer>
        <div className="content-wrap footer-main">
          <div>
            <div className="brand">
              <Logo />
              <span>ShadowFlow</span>
            </div>
            <p>让 AI Agent 真正协作起来。</p>
          </div>
          <div>
            <strong>产品</strong>
            <button onClick={() => scrollTo("product")}>产品体验</button>
            <button onClick={() => scrollTo("workflow")}>工作流</button>
            <button onClick={() => scrollTo("agents")}>AI 团队</button>
          </div>
          <div>
            <strong>资源</strong>
            <a href="https://github.com/Ravenveil/ShadowFlow" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <button onClick={() => scrollTo("security")}>安全机制</button>
            <a href="mailto:hello@shadowflow.ai">联系我们</a>
          </div>
          <div className="footer-join">
            <strong>获取产品更新</strong>
            <p>加入内测名单，了解最新进展。</p>
            <button onClick={openDemo}>
              申请加入 <ArrowRight size={15} />
            </button>
          </div>
        </div>
        <div className="content-wrap footer-bottom">
          <span>© 2026 ShadowFlow</span>
          <span>Built for agent teams.</span>
        </div>
      </footer>

      {modalOpen && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onMouseDown={() => setModalOpen(false)}
        >
          <div className="contact-modal" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalOpen(false)} aria-label="关闭">
              <X size={19} />
            </button>
            {submitted ? (
              <div className="success-state">
                <span>
                  <Check />
                </span>
                <small>REQUEST RECEIVED</small>
                <h2>申请已收到</h2>
                <p>感谢关注 ShadowFlow，我们会尽快通过邮件与你联系。</p>
                <button className="primary-btn" onClick={() => setModalOpen(false)}>
                  完成
                </button>
              </div>
            ) : (
              <>
                <p className="section-kicker">EARLY ACCESS</p>
                <h2 id="modal-title">
                  组建你的第一支
                  <br />
                  AI Agent 团队
                </h2>
                <p>留下基本信息，我们会与你一起梳理最适合自动化的业务流程。</p>
                <form onSubmit={submitForm}>
                  <label>
                    你的称呼
                    <input required placeholder="怎么称呼你" />
                  </label>
                  <label>
                    工作邮箱
                    <input required type="email" placeholder="name@company.com" />
                  </label>
                  <label>
                    目前最想自动化的工作
                    <textarea rows={3} placeholder="例如：客户研究、内容生产、项目交付…" />
                  </label>
                  <button className="primary-btn large" type="submit">
                    提交申请 <ArrowRight size={16} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function Logo() {
  return (
    <span className="logo-mark">
      <i />
      <i />
      <i />
    </span>
  );
}

function SectionHeading({
  kicker,
  title,
  copy,
  light = false,
}: {
  kicker: string;
  title: string;
  copy: string;
  light?: boolean;
}) {
  return (
    <div className={`section-heading ${light ? "light" : ""}`}>
      <div>
        <p className="section-kicker">{kicker}</p>
        <h2>
          {title.split("\n").map((line, index) => (
            <span key={line}>
              {line}
              {index === 0 && <br />}
            </span>
          ))}
        </h2>
      </div>
      <p>{copy}</p>
    </div>
  );
}

function Workbench() {
  return (
    <div className="workbench">
      <aside className="wb-sidebar">
        <div className="wb-brand">
          <Logo />
          <span>ShadowFlow</span>
        </div>
        <button className="new-task">
          <Plus size={14} /> 新建任务
        </button>
        <div className="wb-nav">
          <button className="active">
            <MessageSquare size={15} /> 对话
          </button>
          <button>
            <LayoutDashboard size={15} /> 工作台
          </button>
          <button>
            <Users size={15} /> Agent 团队
          </button>
          <button>
            <BookOpen size={15} /> 知识库
          </button>
        </div>
        <p>最近项目</p>
        <button className="project active">
          <span /> Atlas 品牌发布
        </button>
        <button className="project">
          <span /> Q2 内容策略
        </button>
        <button className="project">
          <span /> 市场竞品研究
        </button>
        <div className="wb-user">
          <span>YL</span>
          <div>
            <strong>Yuki Lin</strong>
            <small>Studio workspace</small>
          </div>
          <Settings2 size={14} />
        </div>
      </aside>
      <div className="wb-main">
        <div className="wb-header">
          <div>
            <strong>Atlas 品牌发布</strong>
            <span>项目运行中</span>
          </div>
          <div>
            <button>
              <Search size={14} />
            </button>
            <button>
              <MoreHorizontal size={15} />
            </button>
          </div>
        </div>
        <div className="wb-content">
          <div className="conversation">
            <div className="conversation-date">今天 10:24</div>
            <div className="user-message">
              为 Atlas 的新品发布制定一套完整的营销方案，目标是获得 1,000 个早期用户。
            </div>
            <div className="agent-message">
              <div className="mini-avatar purple">GM</div>
              <div>
                <p>
                  <strong>AI 总经理</strong>
                  <small>刚刚</small>
                </p>
                <span>我会先拆解目标、受众和交付标准，再召集研究与内容团队并行执行。</span>
              </div>
            </div>
            <div className="plan-card">
              <div>
                <GitBranch size={15} />
                <strong>执行计划</strong>
                <span>4 个阶段</span>
              </div>
              {[
                ["市场与竞品研究", "市场研究员", "done"],
                ["品牌定位与传播策略", "品牌策略师", "run"],
                ["发布内容与渠道规划", "内容创意", ""],
              ].map(([title, owner, state], index) => (
                <div className="task-row" key={title}>
                  <span className={state}>
                    {state === "done" ? <Check size={11} /> : index + 1}
                  </span>
                  <div>
                    <strong>{title}</strong>
                    <small>{owner}</small>
                  </div>
                  <em>{state === "done" ? "已完成" : state === "run" ? "执行中" : "等待中"}</em>
                </div>
              ))}
            </div>
            <div className="typing">
              <span />
              <span />
              <span /> Agent 团队正在协作
            </div>
          </div>
          <aside className="run-panel">
            <div className="run-head">
              <strong>实时进程</strong>
              <button>
                <X size={14} />
              </button>
            </div>
            <div className="run-summary">
              <span>
                <Zap size={15} />
              </span>
              <div>
                <small>ACTIVE RUN</small>
                <strong>新品发布策略</strong>
              </div>
              <i>68%</i>
            </div>
            <div className="progress-bar">
              <span />
            </div>
            <p>执行轨迹</p>
            {[
              ["Research", "市场扫描已完成", "10:26", "done"],
              ["Strategy", "正在生成定位假设", "10:28", "run"],
              ["Creative", "等待策略输入", "—", ""],
            ].map(([name, task, time, state]) => (
              <div className={`timeline-row ${state}`} key={name}>
                <span>{state === "done" ? <Check size={10} /> : <CircleDot size={10} />}</span>
                <div>
                  <strong>{name}</strong>
                  <small>{task}</small>
                </div>
                <time>{time}</time>
              </div>
            ))}
            <div className="approval-mini">
              <ShieldCheck size={14} />
              <div>
                <strong>人工审批</strong>
                <small>发布策略完成后需要确认</small>
              </div>
            </div>
          </aside>
        </div>
        <div className="composer">
          <span>告诉团队接下来要做什么…</span>
          <button>
            <Plus size={14} />
          </button>
          <button className="send">
            <Send size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

function WorkflowPreview({ step, index }: { step: (typeof workflowSteps)[number]; index: number }) {
  const Icon = step.icon;
  return (
    <div className="workflow-preview" style={{ "--step-color": step.color } as React.CSSProperties}>
      <div className="preview-top">
        <span>WORKFLOW / 0{index + 1}</span>
        <span>
          <i /> LIVE
        </span>
      </div>
      <div className="preview-canvas">
        <div className="preview-icon">
          <Icon size={27} />
        </div>
        <small>{step.label}</small>
        <h3>{step.title}</h3>
        <p>{step.description}</p>
        <div className="preview-output">
          <FileText size={17} />
          <div>
            <small>本阶段产出</small>
            <strong>{step.output}</strong>
          </div>
        </div>
      </div>
      <div className="preview-progress">
        {workflowSteps.map((_, i) => (
          <span key={i} className={i <= index ? "done" : ""} />
        ))}
      </div>
    </div>
  );
}

function ApprovalCard() {
  return (
    <div className="approval-card">
      <div className="approval-head">
        <div>
          <ShieldCheck size={18} />
          <span>
            <strong>需要你的审核</strong>
            <small>品牌发布策略 · v2.3</small>
          </span>
        </div>
        <button>
          <MoreHorizontal size={17} />
        </button>
      </div>
      <div className="approval-preview">
        <small>核心传播主张</small>
        <h3>“把复杂留给 AI，把判断留给你。”</h3>
        <p>基于 24 份竞品材料与 8 个用户访谈提炼，目标受众匹配度 91%。</p>
        <div>
          <span>
            <FileText size={13} /> 策略报告.pdf
          </span>
          <span>
            <BarChart3 size={13} /> 研究依据
          </span>
        </div>
      </div>
      <div className="policy-row">
        <Code2 size={15} />
        <div>
          <strong>Policy checks passed</strong>
          <small>品牌规范 · 合规用语 · 预算范围</small>
        </div>
        <Check size={15} />
      </div>
      <div className="approval-actions">
        <button>驳回并修改</button>
        <button>
          <Check size={14} /> 批准并继续
        </button>
      </div>
      <p>
        <Clock3 size={12} /> Agent 团队正在等待你的决定
      </p>
    </div>
  );
}
