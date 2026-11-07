import { FormEvent, useEffect, useState } from "react";
import ProductApp from "../ProductApp";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Database,
  FileCheck2,
  Layers3,
  Menu,
  MessageSquareText,
  MousePointer2,
  Network,
  Play,
  Quote,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
  X,
  Zap,
} from "lucide-react";

const steps = [
  {
    id: "01",
    title: "录入客户需求",
    label: "BRIEF",
    description: "把目标、预算、品牌信息和交付要求结构化，告别散落在聊天记录里的需求。",
    result: "结构化客户 Brief",
    icon: MessageSquareText,
  },
  {
    id: "02",
    title: "AI 总经理拆解",
    label: "PLAN",
    description: "识别项目范围，生成执行计划、任务清单和质量标准，并自动分配给合适的 AI 员工。",
    result: "项目计划与任务 DAG",
    icon: BrainCircuit,
  },
  {
    id: "03",
    title: "AI 团队协同执行",
    label: "CREATE",
    description: "市场、策略、内容和设计员工共享客户上下文，按上游成果连续协作。",
    result: "策略、内容与视觉成果",
    icon: Network,
  },
  {
    id: "04",
    title: "审核并完成交付",
    label: "DELIVER",
    description: "在关键节点人工确认，集中查看版本、修改记录和交付状态，一键导出客户成果。",
    result: "可审核、可修改、可交付",
    icon: FileCheck2,
  },
];

const agents = [
  {
    role: "AI 总经理",
    en: "CHIEF OF STAFF",
    task: "理解需求 · 规划任务 · 调度团队",
    color: "#ff5e3a",
    icon: BriefcaseBusiness,
  },
  {
    role: "市场研究员",
    en: "RESEARCHER",
    task: "市场扫描 · 竞品分析 · 洞察提炼",
    color: "#00b9a7",
    icon: BarChart3,
  },
  {
    role: "品牌策略师",
    en: "STRATEGIST",
    task: "品牌定位 · 营销策略 · Campaign 规划",
    color: "#8e6cff",
    icon: Target,
  },
  {
    role: "内容创意",
    en: "CREATIVE",
    task: "内容主题 · 文案脚本 · 社媒排期",
    color: "#ec3a69",
    icon: Sparkles,
  },
];

const plans = [
  {
    name: "体验版",
    en: "STARTER",
    description: "适合准备尝试 AI 团队的独立创作者",
    price: "免费",
    suffix: "",
    features: ["3 位预设 AI 员工", "1 个活跃客户项目", "基础营销模板", "每月有限执行额度"],
  },
  {
    name: "工作室版",
    en: "STUDIO",
    description: "适合有稳定客户的一人营销工作室",
    price: "¥399",
    suffix: "/ 月",
    features: [
      "完整 AI 营销团队",
      "多客户项目管理",
      "客户品牌知识库",
      "DAG 多 Agent 协作",
      "成果版本与交付中心",
    ],
    featured: true,
  },
  {
    name: "专业定制版",
    en: "PRO CUSTOM",
    description: "适合拥有独特流程与方法论的专业工作室",
    price: "定制",
    suffix: "",
    features: [
      "工作室版全部功能",
      "专属 Skill 与员工",
      "历史知识库迁移",
      "定制工作流与部署",
      "团队培训与持续优化",
    ],
  },
];

const faqs = [
  {
    q: "ShadowFlow 和通用大模型有什么不同？",
    a: "通用大模型擅长单次对话与生成；ShadowFlow 把模型能力组织成有岗位、有上下游、有质量标准的业务流程，并将执行过程与客户、项目、成本和交付成果关联起来。",
  },
  {
    q: "我已经在用很多 AI 工具，还需要 ShadowFlow 吗？",
    a: "ShadowFlow 不替代你喜爱的工具，而是统一承接需求、拆解任务、传递上下文和管理交付，减少在不同工具间复制资料、检查版本的时间。",
  },
  {
    q: "AI 会直接把未经审核的内容发给客户吗？",
    a: "不会。关键交付节点默认需要人工确认。你可以查看依据、修改内容、退回任务，并在确认后再导出或分享给客户。",
  },
  {
    q: "能否沉淀我自己的营销方法论？",
    a: "可以。专业定制版支持将你的 SOP、模板、案例和交付标准转化为专属 Skill、知识库和工作流，让个人经验成为可复用的公司资产。",
  },
];

function LandingApp() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [modal, setModal] = useState<"demo" | "plan" | null>(null);
  const [selectedPlan, setSelectedPlan] = useState("工作室版");
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    document.body.style.overflow = modal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modal]);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }

  function openPlan(plan: string) {
    setSelectedPlan(plan);
    setSubmitted(false);
    setModal("plan");
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="landing-root min-h-screen overflow-hidden bg-[#f7f4ed] text-[#17162d]">
      <nav className="top-nav">
        <div className="nav-inner">
          <button className="brand" onClick={() => scrollTo("home")} aria-label="ShadowFlow 首页">
            <Logo />
            <span>ShadowFlow</span>
          </button>
          <div className="nav-links">
            <button onClick={() => scrollTo("workflow")}>如何工作</button>
            <button onClick={() => scrollTo("agents")}>AI 团队</button>
            <button onClick={() => scrollTo("solutions")}>产品价值</button>
            <button onClick={() => scrollTo("pricing")}>价格</button>
          </div>
          <div className="nav-actions">
            <button className="nav-login" onClick={() => { window.location.hash = "#/app"; }}>
              进入产品
            </button>
            <button className="nav-login" onClick={() => setModal("demo")}>
              申请内测
            </button>
            <button className="nav-cta" onClick={() => setModal("demo")}>
              预约演示 <ArrowRight size={15} />
            </button>
          </div>
          <button
            className="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="打开菜单"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <div className="mobile-panel">
            {[
              ["如何工作", "workflow"],
              ["AI 团队", "agents"],
              ["产品价值", "solutions"],
              ["价格", "pricing"],
            ].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)}>
                {label}
              </button>
            ))}
            <button className="nav-cta" onClick={() => setModal("demo")}>
              预约产品演示 <ArrowRight size={15} />
            </button>
          </div>
        )}
      </nav>

      <header id="home" className="hero">
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="page-shell hero-grid">
          <div className="hero-copy">
            <div className="launch-tag">
              <span /> 为一人营销工作室打造
            </div>
            <h1>
              一个人，
              <br />
              也能经营一家
              <br />
              <em>AI 营销公司。</em>
            </h1>
            <p>
              从客户需求到专业成果交付，让 AI 员工按你的方法协同工作。 你负责判断与决策，ShadowFlow
              负责让业务持续向前。
            </p>
            <div className="hero-actions">
              <button className="button-primary" onClick={() => setModal("demo")}>
                预约产品演示 <ArrowRight size={18} />
              </button>
              <button className="button-ghost" onClick={() => scrollTo("workflow")}>
                <span>
                  <Play size={15} fill="currentColor" />
                </span>{" "}
                看看如何工作
              </button>
            </div>
            <div className="trust-row">
              <span>
                <Check size={14} /> 无需信用卡
              </span>
              <span>
                <Check size={14} /> 15 分钟完成配置
              </span>
              <span>
                <Check size={14} /> 关键节点人工可控
              </span>
            </div>
          </div>
          <ProductVisual />
        </div>
        <div className="page-shell proof-strip">
          <p>把散落的 AI 能力，组织成可交付的业务系统</p>
          <div>
            <span>
              <Clock3 /> 交付周期更短
            </span>
            <span>
              <UsersRound /> 接单能力提升
            </span>
            <span>
              <Database /> 客户知识沉淀
            </span>
            <span>
              <CircleDollarSign /> 成本清晰可见
            </span>
          </div>
        </div>
      </header>

      <section id="solutions" className="section problem-section">
        <div className="page-shell">
          <div className="section-intro">
            <div>
              <p className="kicker">ONE PERSON, TOO MANY ROLES</p>
              <h2>
                你缺的不是另一个工具，
                <br />
                而是一支真正协作的团队。
              </h2>
            </div>
            <p>
              当你同时是销售、策略、文案、设计和项目经理，真正消耗精力的不是某一项工作，而是不断切换角色与拼接信息。
            </p>
          </div>
          <div className="problem-grid">
            <article className="problem-feature">
              <span className="feature-index">01 / 04</span>
              <div className="fragment-visual">
                <div>CHAT</div>
                <div>DOCS</div>
                <div>DESIGN</div>
                <div>FILES</div>
                <Network />
              </div>
              <h3>工具很多，流程依然断裂</h3>
              <p>客户资料、AI 对话、设计文件和项目进度散落各处，每次协作都在重新复制上下文。</p>
            </article>
            <div className="problem-list">
              {[
                [
                  "02",
                  "一个人承担多个岗位",
                  "市场研究、策划、内容、视觉和客户沟通，都压在创始人一个人身上。",
                  Layers3,
                ],
                [
                  "03",
                  "AI 输出难以稳定交付",
                  "缺少负责人、验收标准、审核节点与修改记录，结果不可控。",
                  ShieldCheck,
                ],
                [
                  "04",
                  "项目经验无法变成资产",
                  "客户偏好和有效方法散落在历史文件里，下次项目又要从头开始。",
                  Database,
                ],
              ].map(([num, title, copy, Icon]) => {
                const ItemIcon = Icon as typeof Layers3;
                return (
                  <article key={num as string}>
                    <span>{num as string}</span>
                    <ItemIcon />
                    <div>
                      <h3>{title as string}</h3>
                      <p>{copy as string}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="section workflow-section">
        <div className="page-shell">
          <div className="section-intro light">
            <div>
              <p className="kicker">FROM BRIEF TO DELIVERY</p>
              <h2>
                一条完整的营销
                <br />
                业务交付链路
              </h2>
            </div>
            <p>
              ShadowFlow
              不是让四个聊天机器人各说各话，而是让每个角色基于同一份客户知识，接力完成同一个业务目标。
            </p>
          </div>
          <div className="workflow-layout">
            <div className="step-list">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={activeStep === index ? "active" : ""}
                >
                  <span>{step.id}</span>
                  <div>
                    <small>{step.label}</small>
                    <strong>{step.title}</strong>
                  </div>
                  <ArrowRight />
                </button>
              ))}
            </div>
            <div className="step-detail">
              <div className="step-topline">
                <span>WORKFLOW / {steps[activeStep].id}</span>
                <span className="live-dot">LIVE</span>
              </div>
              <div className="step-icon">
                {(() => {
                  const Icon = steps[activeStep].icon;
                  return <Icon size={40} />;
                })()}
              </div>
              <p className="step-label">{steps[activeStep].label}</p>
              <h3>{steps[activeStep].title}</h3>
              <p className="step-description">{steps[activeStep].description}</p>
              <div className="step-result">
                <Check size={17} />
                <div>
                  <small>本阶段产出</small>
                  <strong>{steps[activeStep].result}</strong>
                </div>
              </div>
              <div className="flow-line">
                {steps.map((_, index) => (
                  <span key={index} className={index <= activeStep ? "done" : ""} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="agents" className="section agents-section">
        <div className="page-shell">
          <div className="section-intro">
            <div>
              <p className="kicker">YOUR AI MARKETING TEAM</p>
              <h2>
                不是助手，是有责任边界的
                <br />
                AI 员工团队。
              </h2>
            </div>
            <p>
              每位员工都有明确的职责、输入、工具和交付标准。AI
              总经理负责规划和调度，你始终保留最终决策权。
            </p>
          </div>
          <div className="agent-grid">
            {agents.map((agent, index) => {
              const Icon = agent.icon;
              return (
                <article
                  className="agent-card"
                  key={agent.role}
                  style={{ "--agent-color": agent.color } as React.CSSProperties}
                >
                  <div className="agent-number">A{index + 1}</div>
                  <div className="agent-avatar">
                    <Icon size={31} />
                  </div>
                  <p>{agent.en}</p>
                  <h3>{agent.role}</h3>
                  <div className="agent-task">{agent.task}</div>
                  <div className="agent-status">
                    <span /> READY TO WORK
                  </div>
                </article>
              );
            })}
          </div>
          <div className="human-loop">
            <div className="human-badge">
              <MousePointer2 />
            </div>
            <div>
              <p>HUMAN IN THE LOOP</p>
              <h3>AI 负责执行，你负责判断。</h3>
            </div>
            <p>
              所有关键策略、预算与最终交付都由你审核确认。你不是被替代，而是从重复劳动中被释放。
            </p>
          </div>
        </div>
      </section>

      <section className="section outcomes-section">
        <div className="page-shell outcomes-grid">
          <div className="outcome-copy">
            <p className="kicker">EVERY PROJECT MAKES YOU STRONGER</p>
            <h2>
              交付的不只是成果，
              <br />
              更是你公司的长期资产。
            </h2>
            <p>
              每次项目的客户反馈、有效策略、内容偏好和交付标准都会回到公司的知识系统。下一次，不再从零开始。
            </p>
            <div className="outcome-metrics">
              <div>
                <strong>1</strong>
                <span>个统一客户上下文</span>
              </div>
              <div>
                <strong>∞</strong>
                <span>次复用方法与经验</span>
              </div>
            </div>
          </div>
          <div className="knowledge-visual">
            <div className="knowledge-core">
              <Database />
              <span>品牌知识库</span>
              <small>持续学习中</small>
            </div>
            <div className="knowledge-node n1">
              <MessageSquareText />
              <span>客户反馈</span>
            </div>
            <div className="knowledge-node n2">
              <FileCheck2 />
              <span>项目成果</span>
            </div>
            <div className="knowledge-node n3">
              <Layers3 />
              <span>SOP 模板</span>
            </div>
            <div className="knowledge-node n4">
              <Target />
              <span>品牌偏好</span>
            </div>
            <svg viewBox="0 0 600 480" aria-hidden="true">
              <path d="M300 240 L130 110 M300 240 L480 100 M300 240 L115 375 M300 240 L485 375" />
            </svg>
          </div>
        </div>
      </section>

      <section className="testimonial-section">
        <div className="page-shell testimonial">
          <Quote />
          <blockquote>
            “过去我是在不同 AI 工具之间搬运信息。现在更像是在经营一家公司：
            每个人知道自己该做什么，项目走到哪一步，我随时都看得见。”
          </blockquote>
          <div className="testimonial-person">
            <span>YL</span>
            <p>
              <strong>一人品牌营销工作室主理人</strong>
              <small>ShadowFlow 早期体验用户</small>
            </p>
          </div>
        </div>
      </section>

      <section id="pricing" className="section pricing-section">
        <div className="page-shell">
          <div className="pricing-heading">
            <p className="kicker">START SMALL, BUILD YOUR COMPANY</p>
            <h2>
              从一个项目开始，
              <br />
              搭建你的 AI 公司。
            </h2>
            <p>无需扩张固定团队，也能获得专业营销服务所需的完整执行能力。</p>
          </div>
          <div className="pricing-grid">
            {plans.map((plan) => (
              <article key={plan.name} className={`price-card ${plan.featured ? "featured" : ""}`}>
                {plan.featured && <span className="plan-tag">最适合一人工作室</span>}
                <p className="plan-en">{plan.en}</p>
                <h3>{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>
                <div className="plan-price">
                  {plan.price}
                  <span>{plan.suffix}</span>
                </div>
                <button onClick={() => openPlan(plan.name)}>
                  {plan.name === "体验版"
                    ? "免费开始"
                    : plan.name === "工作室版"
                      ? "开始 14 天试用"
                      : "联系方案顾问"}
                  <ArrowRight size={17} />
                </button>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <Check size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="price-note">所有价格均为产品规划参考，正式方案将在试点验证后公布。</p>
        </div>
      </section>

      <section id="faq" className="section faq-section">
        <div className="page-shell faq-layout">
          <div>
            <p className="kicker">QUESTIONS, ANSWERED</p>
            <h2>你可能想知道</h2>
            <p>
              还有其他问题？
              <button onClick={() => setModal("demo")}>
                和我们聊聊 <ArrowRight size={14} />
              </button>
            </p>
          </div>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <article key={faq.q} className={openFaq === index ? "open" : ""}>
                <button onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{faq.q}</strong>
                  <ChevronDown />
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
        <div className="cta-grid" />
        <div className="page-shell">
          <p>YOUR COMPANY. YOUR METHOD. YOUR AI TEAM.</p>
          <h2>
            准备好经营一家
            <br />
            <em>一个人的 AI 公司</em>了吗？
          </h2>
          <button className="button-primary" onClick={() => setModal("demo")}>
            预约产品演示 <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <footer>
        <div className="page-shell footer-main">
          <div className="footer-brand">
            <div className="brand">
              <Logo />
              <span>ShadowFlow</span>
            </div>
            <p>让一个人，也能经营一家专业的 AI 营销公司。</p>
          </div>
          <div>
            <strong>产品</strong>
            <button onClick={() => scrollTo("workflow")}>如何工作</button>
            <button onClick={() => scrollTo("agents")}>AI 员工</button>
            <button onClick={() => scrollTo("pricing")}>价格方案</button>
          </div>
          <div>
            <strong>资源</strong>
            <a href="#faq">帮助中心</a>
            <a href="#about">关于我们</a>
            <a href="mailto:hello@shadowflow.ai">联系我们</a>
          </div>
          <div className="footer-news">
            <strong>获取产品进展</strong>
            <p>订阅内测与产品更新</p>
            <form onSubmit={submitForm}>
              <input type="email" required aria-label="邮箱地址" placeholder="你的邮箱" />
              <button aria-label="订阅">
                <ArrowRight />
              </button>
            </form>
          </div>
        </div>
        <div className="page-shell footer-bottom">
          <span>© 2026 ShadowFlow. All rights reserved.</span>
          <div>
            <a href="#privacy">隐私政策</a>
            <a href="#terms">服务条款</a>
          </div>
        </div>
      </footer>

      {modal && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onMouseDown={() => setModal(null)}
        >
          <div className="contact-modal" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(null)} aria-label="关闭">
              <X />
            </button>
            {submitted ? (
              <div className="success-state">
                <span>
                  <Check />
                </span>
                <p>SUBMITTED</p>
                <h2>已收到你的申请</h2>
                <p>感谢关注 ShadowFlow。我们会尽快通过邮件与你联系。</p>
                <button className="button-primary" onClick={() => setModal(null)}>
                  完成
                </button>
              </div>
            ) : (
              <>
                <p className="kicker">{modal === "demo" ? "BOOK A DEMO" : "GET STARTED"}</p>
                <h2 id="modal-title">
                  {modal === "demo"
                    ? "看看 ShadowFlow 如何帮你交付下一个项目"
                    : `申请 ${selectedPlan}`}
                </h2>
                <p>留下你的信息，我们将在 1 个工作日内与你联系。</p>
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
                    你目前的业务阶段
                    <select defaultValue="">
                      <option value="" disabled>
                        请选择
                      </option>
                      <option>准备开始一人工作室</option>
                      <option>已有 1–5 个稳定客户</option>
                      <option>已有成熟业务和方法论</option>
                    </select>
                  </label>
                  <label>
                    最想解决的问题
                    <textarea
                      rows={3}
                      placeholder="例如：多客户项目管理、内容交付效率、知识沉淀…"
                    />
                  </label>
                  <button className="button-primary" type="submit">
                    提交申请 <ArrowRight size={17} />
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

function ProductVisual() {
  return (
    <div className="product-visual" style={{ cursor: "pointer" }} title="点击进入产品" onClick={() => { window.location.hash = "#/app"; }}>
      <div className="visual-window">
        <div className="window-bar">
          <div>
            <span />
            <span />
            <span />
          </div>
          <p>项目执行中心</p>
          <small>shadowflow.ai</small>
        </div>
        <div className="window-body">
          <aside>
            <Logo />
            {[BriefcaseBusiness, UsersRound, Layers3, Database].map((Icon, index) => (
              <span key={index} className={index === 0 ? "active" : ""}>
                <Icon size={17} />
              </span>
            ))}
          </aside>
          <div className="project-content">
            <div className="project-head">
              <div>
                <small>ACTIVE PROJECT</small>
                <h3>Oat Studio 品牌焕新</h3>
              </div>
              <span>执行中 · 68%</span>
            </div>
            <div className="progress">
              <i />
            </div>
            <div className="project-stats">
              <div>
                <span>12</span>
                <small>任务总数</small>
              </div>
              <div>
                <span>08</span>
                <small>已完成</small>
              </div>
              <div>
                <span>03</span>
                <small>AI 执行中</small>
              </div>
            </div>
            <div className="project-flow">
              <p>
                工作流 <span>实时同步</span>
              </p>
              {[
                ["市场研究", "已完成", "#00b9a7"],
                ["品牌策略", "审核中", "#ff5e3a"],
                ["内容规划", "执行中", "#8e6cff"],
              ].map(([name, state, color], index) => (
                <div key={name}>
                  <i style={{ background: color }}>{index + 1}</i>
                  <strong>{name}</strong>
                  <span>{state}</span>
                  {index < 2 && <b />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="floating-card floating-agent">
        <span>
          <BrainCircuit />
        </span>
        <div>
          <small>AI 总经理</small>
          <strong>已拆解 12 个项目任务</strong>
        </div>
        <Check />
      </div>
      <div className="floating-card floating-deliver">
        <FileCheck2 />
        <div>
          <small>交付物已更新</small>
          <strong>品牌策略 V2.1</strong>
        </div>
        <span>刚刚</span>
      </div>
      <div className="visual-badge">
        <Zap size={15} fill="currentColor" /> 3 个 Agent 正在协作
      </div>
    </div>
  );
}


export default function App() {
  const [productMode, setProductMode] = useState(window.location.pathname.startsWith("/app") || window.location.hash === "#/app");
  useEffect(() => {
    const sync = () => setProductMode(window.location.pathname.startsWith("/app") || window.location.hash === "#/app");
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);
  if (productMode) return <ProductApp />;
  return <LandingApp />;
}