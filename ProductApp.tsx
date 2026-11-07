import { FormEvent, useMemo, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Bot,
  CalendarClock,
  Check,
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  GitBranch,
  LayoutGrid,
  Link2,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Send,
  Server,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
  X,
  Zap,
} from "lucide-react";
import "./product-app.css";

type View = "chat" | "agents" | "knowledge" | "dashboard" | "projects" | "schedules" | "settings";

const viewCopy: Record<Exclude<View, "chat">, { title: string; subtitle: string }> = {
  agents: { title: "Agent 团队", subtitle: "管理角色、能力与协作关系" },
  knowledge: { title: "知识库", subtitle: "管理团队共享的知识与上下文" },
  dashboard: { title: "数据看板", subtitle: "用量、成本、Run 成功率与每日简报" },
  projects: { title: "项目", subtitle: "管理工作空间、会话与交付成果" },
  schedules: { title: "定时任务", subtitle: "管理所有 Agent 的周期与一次性计划" },
  settings: { title: "设置", subtitle: "模型、Skills、集成、记忆与工作空间" },
};

type ThreadKind = "ceo" | "atlas" | "fresh" | "growth" | "research" | "proposal";

type Conversation = {
  id: string;
  title: string;
  preview: string;
  time: string;
  unread?: boolean;
  pinned?: boolean;
  thread: ThreadKind;
};

const ceoConversation: Conversation = {
  id: "ceo",
  title: "CEO 主控",
  preview: "全局调度 · 任务拆解与决策",
  time: "刚刚",
  unread: true,
  pinned: true,
  thread: "ceo",
};

const conversations: Conversation[] = [
  {
    id: "atlas",
    title: "Atlas 新品发布计划",
    preview: "品牌策略已进入人工审核",
    time: "刚刚",
    unread: true,
    thread: "atlas",
  },
  {
    id: "growth",
    title: "Q2 内容增长策略",
    preview: "内容团队已完成渠道排期",
    time: "昨天",
    thread: "growth",
  },
  {
    id: "research",
    title: "竞品市场研究",
    preview: "已分析 24 个竞品样本",
    time: "周一",
    thread: "research",
  },
  {
    id: "proposal",
    title: "客户提案自动化",
    preview: "等待补充预算范围",
    time: "05/18",
    thread: "proposal",
  },
];

type ScriptReply = {
  label: string;
  name: string;
  color: string;
  time: string;
  text: string;
};

const threadScripts: Record<Exclude<ThreadKind, "atlas" | "fresh">, { user: string; replies: ScriptReply[] }> = {
  ceo: {
    user: "团队现在的整体执行情况怎么样？接下来应该怎么排优先级？",
    replies: [
      {
        label: "CEO",
        name: "CEO 主控",
        color: "#ff5e3a",
        time: "10:26",
        text: "三个项目并行推进：Atlas 发布已进入人工审核环节，Q2 内容增长完成渠道排期，客户提案自动化在等待预算输入。建议今天优先敲定 Atlas 的品牌主张，其余两条线按计划自动推进。",
      },
      {
        label: "CEO",
        name: "CEO 主控",
        color: "#ff5e3a",
        time: "10:27",
        text: "需要调整优先级或临时加塞任务，直接在这里说一声，我会重新拆解并调度团队。",
      },
    ],
  },
  growth: {
    user: "帮我制定 Q2 内容增长策略，重点是多渠道分发和内容复用。",
    replies: [
      {
        label: "GM",
        name: "总经理",
        color: "#ff5e3a",
        time: "昨天 14:02",
        text: "已拆解为渠道矩阵、内容排期与数据复盘三条线。内容创意会先给出一周样例排期，市场研究员同步补充各渠道的竞品声量基线。",
      },
    ],
  },
  research: {
    user: "输出一份竞品市场研究简报，覆盖最近上新的同类产品。",
    replies: [
      {
        label: "MR",
        name: "市场研究员",
        color: "#2777e8",
        time: "周一 09:40",
        text: "完成 24 个竞品样本分析：可控的多 Agent 协作仍是最明显的差异化机会。简报已归档到知识库，可随时让品牌策略师引用。",
      },
    ],
  },
  proposal: {
    user: "把客户提案流程自动化，先给一版落地方案。",
    replies: [
      {
        label: "GM",
        name: "总经理",
        color: "#ff5e3a",
        time: "05/18 16:20",
        text: "方案已生成：提案模板 + 自动填充 + 人工终审三步走。当前在等待你补充预算范围，确认后我会生成完整执行计划。",
      },
    ],
  },
};

const quickPrompts = [
  "制定 Atlas 新品发布计划",
  "分析竞品并输出简报",
  "查看团队执行状态",
  "创建一个定时任务",
];

const dayLabels: Record<ThreadKind, string> = {
  ceo: "今天 10:26",
  atlas: "今天 10:24",
  growth: "昨天 14:02",
  research: "周一 09:40",
  proposal: "05/18 16:20",
  fresh: "新对话",
};

const agents = [
  {
    name: "总经理",
    role: "任务拆解与团队调度",
    initials: "GM",
    color: "#ff5e3a",
    status: "执行中",
  },
  {
    name: "市场研究员",
    role: "市场与竞品洞察",
    initials: "MR",
    color: "#2777e8",
    status: "已完成",
  },
  {
    name: "品牌策略师",
    role: "定位与传播策略",
    initials: "BS",
    color: "#d97b38",
    status: "执行中",
  },
  { name: "内容创意", role: "内容与渠道规划", initials: "CC", color: "#c64f7d", status: "等待中" },
];

export default function ProductApp() {
  const [view, setView] = useState<View>("chat");
  const [panelOpen, setPanelOpen] = useState(true);
  const [mobileRailOpen, setMobileRailOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeConversation, setActiveConversation] = useState<Conversation>(ceoConversation);
  const [message, setMessage] = useState("");
  const [sentMap, setSentMap] = useState<Record<string, string[]>>({});
  const [detailOpen, setDetailOpen] = useState(true);

  const chatStatusText =
    activeConversation.thread === "ceo"
      ? "CEO 主控在线 · 全局调度"
      : activeConversation.thread === "fresh"
        ? "新对话 · 等待你的第一条指令"
        : "3 位 Agent 正在协作";

  const filteredConversations = useMemo(
    () =>
      conversations.filter((conversation) =>
        `${conversation.title}${conversation.preview}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  function openConversation(conversation: Conversation) {
    setActiveConversation(conversation);
    setView("chat");
    setMobileRailOpen(false);
    if (window.innerWidth <= 820) setPanelOpen(false);
  }

  function createConversation() {
    setActiveConversation({
      id: `new-${Date.now()}`,
      title: "新对话",
      preview: "还没有消息",
      time: "刚刚",
      thread: "fresh",
    });
    setView("chat");
    setMobileRailOpen(false);
    if (window.innerWidth <= 820) setPanelOpen(false);
  }

  function sendText(text: string) {
    const id = activeConversation.id;
    setSentMap((map) => ({ ...map, [id]: [...(map[id] || []), text] }));
  }

  function submitMessage(event: FormEvent) {
    event.preventDefault();
    if (!message.trim()) return;
    sendText(message.trim());
    setMessage("");
  }

  function navigate(nextView: View) {
    setView(nextView);
    setMobileRailOpen(false);
  }

  return (
    <div className="sf-app">
      <aside className={`sf-rail ${mobileRailOpen ? "open" : ""}`}>
        <div className="sf-rail-head">
          <a className="sf-product-brand" href="#/" aria-label="返回 ShadowFlow 官网">
            <ProductLogo />
            <span>ShadowFlow</span>
          </a>
          <button
            className="sf-mobile-close"
            onClick={() => setMobileRailOpen(false)}
            aria-label="关闭导航"
          >
            <X size={18} />
          </button>
        </div>

        <div className="sf-dialogue-wrap">
          <button
            className={`sf-dialogue-button ${view === "chat" ? "active" : ""}`}
            onClick={() => {
              if (view !== "chat") {
                setView("chat");
                setPanelOpen(true);
              } else {
                setPanelOpen(!panelOpen);
              }
            }}
            aria-expanded={view === "chat" && panelOpen}
          >
            <MessageSquare size={17} />
            <span>对话</span>
            <ChevronDown size={15} />
          </button>
        </div>

        <nav className="sf-primary-nav">
          <button className={view === "agents" ? "active" : ""} onClick={() => navigate("agents")}>
            <Users size={17} />
            <span>Agent 团队</span>
            <span className="sf-count">4</span>
          </button>
          <button
            className={view === "knowledge" ? "active" : ""}
            onClick={() => navigate("knowledge")}
          >
            <BookOpen size={17} />
            <span>知识库</span>
          </button>
          <button
            className={view === "dashboard" ? "active" : ""}
            onClick={() => navigate("dashboard")}
          >
            <BarChart3 size={17} />
            <span>数据看板</span>
          </button>
        </nav>

        <div className="sf-rail-section">
          <p>工作空间</p>
          <button
            className={view === "projects" ? "active" : ""}
            onClick={() => navigate("projects")}
          >
            <LayoutGrid size={15} />
            <span>项目</span>
          </button>
          <button
            className={view === "schedules" ? "active" : ""}
            onClick={() => navigate("schedules")}
          >
            <CalendarClock size={15} />
            <span>定时任务</span>
          </button>
        </div>

        <div className="sf-rail-foot">
          <button
            className={view === "settings" ? "active" : ""}
            onClick={() => navigate("settings")}
          >
            <Settings size={16} />
            <span>设置</span>
          </button>
          <div className="sf-account">
            <span>YL</span>
            <div>
              <strong>Yuki Lin</strong>
              <small>Personal workspace</small>
            </div>
            <MoreHorizontal size={15} />
          </div>
        </div>
      </aside>

      {view === "chat" && panelOpen && (
        <button
          className="sf-panel-overlay"
          onClick={() => setPanelOpen(false)}
          aria-label="关闭对话面板"
        />
      )}

      {mobileRailOpen && (
        <button
          className="sf-mobile-overlay"
          onClick={() => setMobileRailOpen(false)}
          aria-label="关闭导航"
        />
      )}

      <main className="sf-main">
        <header className="sf-topbar">
          <div>
            <button
              className="sf-mobile-menu"
              onClick={() => setMobileRailOpen(true)}
              aria-label="打开导航"
            >
              <Menu size={19} />
            </button>
            {view === "chat" ? (
              <>
                <button className="sf-history" onClick={() => setPanelOpen(!panelOpen)}>
                  <ArrowLeft size={15} />
                </button>
                <div className="sf-title-block">
                  <strong>{activeConversation.title}</strong>
                  <span>
                    <i /> {chatStatusText}
                  </span>
                </div>
              </>
            ) : (
              <div className="sf-title-block">
                <strong>{viewCopy[view].title}</strong>
                <span>{viewCopy[view].subtitle}</span>
              </div>
            )}
          </div>
          <div className="sf-top-actions">
            {view === "chat" && (
              <button className="sf-members">
                {activeConversation.thread === "ceo" || activeConversation.thread === "fresh" ? (
                  <span>CEO</span>
                ) : (
                  <>
                    <span>GM</span>
                    <span>MR</span>
                    <span>BS</span>
                  </>
                )}
              </button>
            )}
            <button>
              <MoreHorizontal size={18} />
            </button>
            {view === "chat" && (
              <button className="sf-detail-toggle" onClick={() => setDetailOpen(!detailOpen)}>
                执行详情
              </button>
            )}
          </div>
        </header>

        {view === "chat" && (
          <div
            className={`sf-chat-layout ${panelOpen ? "" : "panel-closed"} ${detailOpen ? "" : "detail-closed"}`}
          >
            {panelOpen && (
              <aside className="sf-thread-panel">
                <div className="sf-drawer-head">
                  <div>
                    <span>
                      <MessageSquare size={14} />
                    </span>
                    <div>
                      <strong>对话</strong>
                      <small>搜索、新建或继续任何会话</small>
                    </div>
                  </div>
                  <button onClick={() => setPanelOpen(false)} aria-label="收起对话面板">
                    <X size={15} />
                  </button>
                </div>
                <button className="sf-new-chat" onClick={createConversation}>
                  <Plus size={14} />
                  <span>
                    <strong>新建对话</strong>
                    <small>与 CEO 主控开始</small>
                  </span>
                  <kbd>⌘N</kbd>
                </button>
                <label className="sf-search">
                  <Search size={13} />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="搜索对话、项目或 Agent"
                  />
                  <kbd>⌘K</kbd>
                </label>
                <button
                  className={`sf-ceo-pin ${activeConversation.id === "ceo" ? "active" : ""}`}
                  onClick={() => openConversation(ceoConversation)}
                >
                  <AgentAvatar label="CEO" color="#ff5e3a" size="lg" />
                  <div>
                    <strong>CEO 主控</strong>
                    <small>全局调度 · 任务拆解与决策</small>
                  </div>
                  <i />
                </button>
                <p>最近对话</p>
                <div className="sf-conversation-list">
                  {filteredConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      className={activeConversation.id === conversation.id ? "active" : ""}
                      onClick={() => openConversation(conversation)}
                    >
                      <span className="sf-conversation-icon">
                        <MessageSquare size={12} />
                        {conversation.unread && <i />}
                      </span>
                      <span>
                        <strong>{conversation.title}</strong>
                        <small>{conversation.preview}</small>
                      </span>
                      <time>{conversation.time}</time>
                    </button>
                  ))}
                </div>
                <p>项目与 Agent</p>
                <div className="sf-project-tree">
                  <button className="sf-folder-row">
                    <ChevronRight size={12} />
                    <Folder size={13} />
                    <span>Atlas 新品发布</span>
                  </button>
                  {agents.slice(0, 2).map((agent) => (
                    <button className="sf-agent-tree-row" key={agent.name}>
                      <AgentAvatar label={agent.initials} color={agent.color} small />
                      <span>
                        <strong>{agent.name}</strong>
                        <small>{agent.role}</small>
                      </span>
                      <i className={agent.status === "执行中" ? "working" : ""} />
                    </button>
                  ))}
                  <button className="sf-folder-row">
                    <ChevronRight size={12} />
                    <Folder size={13} />
                    <span>Q2 内容增长</span>
                  </button>
                </div>
              </aside>
            )}
            <section className="sf-chat">
              <div className="sf-chat-scroll sf-thread-enter" key={activeConversation.id}>
                <ChatThread
                  conversation={activeConversation}
                  sent={sentMap[activeConversation.id] || []}
                  onQuick={sendText}
                />
              </div>

              <form className="sf-composer" onSubmit={submitMessage}>
                <textarea
                  rows={1}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      event.currentTarget.form?.requestSubmit();
                    }
                  }}
                  placeholder={
                    activeConversation.thread === "ceo"
                      ? "直接和 CEO 对话，或让它调度团队…"
                      : activeConversation.thread === "fresh"
                        ? "告诉团队接下来要做什么…"
                        : "继续这个会话…"
                  }
                />
                <div>
                  <span>
                    <button type="button" aria-label="添加附件">
                      <Paperclip size={16} />
                    </button>
                    <button type="button">
                      <Sparkles size={15} /> Skills
                    </button>
                  </span>
                  <span>
                    <small>Enter 发送 · Shift + Enter 换行</small>
                    <button
                      className="sf-send"
                      type="submit"
                      disabled={!message.trim()}
                      aria-label="发送"
                    >
                      <Send size={15} />
                    </button>
                  </span>
                </div>
              </form>
            </section>

            {detailOpen && (
              <aside className="sf-run-panel">
                <div className="sf-run-head">
                  <strong>执行详情</strong>
                  <button onClick={() => setDetailOpen(false)}>
                    <X size={16} />
                  </button>
                </div>
                <div className="sf-run-card">
                  <div>
                    <span>
                      <Zap size={17} />
                    </span>
                    <div>
                      <small>ACTIVE RUN</small>
                      <strong>Atlas 新品发布</strong>
                    </div>
                    <em>68%</em>
                  </div>
                  <div className="sf-progress">
                    <i />
                  </div>
                  <p>3 / 4 个 Agent 已响应</p>
                </div>
                <div className="sf-panel-section">
                  <div className="sf-panel-title">
                    <span>当前团队</span>
                    <button>管理</button>
                  </div>
                  {agents.map((agent) => (
                    <div className="sf-agent-row" key={agent.name}>
                      <AgentAvatar label={agent.initials} color={agent.color} small />
                      <div>
                        <strong>{agent.name}</strong>
                        <small>{agent.role}</small>
                      </div>
                      <span className={agent.status === "执行中" ? "running" : ""}>
                        {agent.status}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="sf-panel-section">
                  <div className="sf-panel-title">
                    <span>流程</span>
                    <button>查看 DAG</button>
                  </div>
                  <div className="sf-mini-flow">
                    <div className="done">
                      <span>
                        <Check size={11} />
                      </span>
                      <p>
                        <strong>研究</strong>
                        <small>10:31 完成</small>
                      </p>
                    </div>
                    <i />
                    <div className="running">
                      <span>2</span>
                      <p>
                        <strong>策略</strong>
                        <small>正在执行</small>
                      </p>
                    </div>
                    <i />
                    <div>
                      <span>3</span>
                      <p>
                        <strong>内容</strong>
                        <small>等待输入</small>
                      </p>
                    </div>
                    <i />
                    <div>
                      <span>4</span>
                      <p>
                        <strong>审核</strong>
                        <small>由你确认</small>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="sf-policy-note">
                  <ShieldCheck size={16} />
                  <div>
                    <strong>人工审核已开启</strong>
                    <small>关键策略不会未经确认直接执行</small>
                  </div>
                </div>
              </aside>
            )}
          </div>
        )}

        {view === "agents" && <AgentsView />}
        {view === "knowledge" && <KnowledgeView />}
        {view === "dashboard" && <DashboardView />}
        {view === "projects" && <ProjectsView />}
        {view === "schedules" && <SchedulesView />}
        {view === "settings" && <SettingsView />}
      </main>
    </div>
  );
}

function AgentAvatar({
  label,
  color,
  small = false,
  size,
}: {
  label: string;
  color: string;
  small?: boolean;
  size?: "lg" | "xl";
}) {
  return (
    <span
      className={`sf-agent-avatar ${small ? "small" : ""} ${size ?? ""}`}
      style={{ "--avatar-color": color } as React.CSSProperties}
    >
      {label}
      <i />
    </span>
  );
}

function ProductLogo() {
  return (
    <span className="sf-logo">
      <i />
      <i />
      <i />
    </span>
  );
}

function CeoHero({ onQuick }: { onQuick: (text: string) => void }) {
  return (
    <div className="sf-ceo-hero">
      <AgentAvatar label="CEO" color="#ff5e3a" size="xl" />
      <h2>CEO 主控</h2>
      <p>
        <i /> 在线 · 全局调度、任务拆解与决策
      </p>
      <div className="sf-ceo-chips">
        {quickPrompts.map((prompt) => (
          <button type="button" key={prompt} onClick={() => onQuick(prompt)}>
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

function AtlasThreadBody() {
  return (
    <>
      <article className="sf-user-message">
        <p>为 Atlas 的新品发布制定一套完整的营销方案，目标是获得 1,000 个早期用户。</p>
      </article>
      <article className="sf-agent-message">
        <AgentAvatar label="GM" color="#ff5e3a" />
        <div className="sf-message-body">
          <div className="sf-message-author">
            <strong>总经理</strong>
            <span>10:24</span>
          </div>
          <p>
            收到。我会先明确目标与交付标准，然后让研究员和策略师并行推进。关键品牌主张会在执行前交给你审核。
          </p>
          <div className="sf-plan">
            <div className="sf-plan-head">
              <span>
                <GitBranch size={15} /> 执行计划
              </span>
              <small>4 个阶段 · 预计 18 分钟</small>
            </div>
            {[
              ["市场与竞品研究", "市场研究员", "完成", "done"],
              ["定位与传播策略", "品牌策略师", "执行中", "running"],
              ["内容与渠道规划", "内容创意", "等待中", "pending"],
              ["人工审核与交付", "你", "等待中", "pending"],
            ].map(([title, owner, status, state], index) => (
              <div className="sf-plan-row" key={title}>
                <span className={state}>{state === "done" ? <Check size={12} /> : index + 1}</span>
                <div>
                  <strong>{title}</strong>
                  <small>{owner}</small>
                </div>
                <em className={state}>{status}</em>
              </div>
            ))}
          </div>
        </div>
      </article>

      <article className="sf-agent-message">
        <AgentAvatar label="MR" color="#2777e8" />
        <div className="sf-message-body">
          <div className="sf-message-author">
            <strong>市场研究员</strong>
            <span>10:31</span>
          </div>
          <p>
            第一轮市场扫描完成。我分析了 24
            个同类产品，发现“可控的多 Agent 协作”仍是最明显的差异化机会。
          </p>
          <button className="sf-artifact">
            <span>
              <FileText size={17} />
            </span>
            <div>
              <strong>Atlas 市场与竞品研究</strong>
              <small>研究报告 · 24 个来源 · 8 页</small>
            </div>
            <ChevronRight size={16} />
          </button>
        </div>
      </article>
    </>
  );
}

function ChatThread({
  conversation,
  sent,
  onQuick,
}: {
  conversation: Conversation;
  sent: string[];
  onQuick: (text: string) => void;
}) {
  const kind = conversation.thread;
  const script = kind === "atlas" || kind === "fresh" ? null : threadScripts[kind];

  return (
    <>
      {(kind === "ceo" || kind === "fresh") && <CeoHero onQuick={onQuick} />}
      {kind !== "fresh" && (
        <div className="sf-date-line">
          <span>{dayLabels[kind]}</span>
        </div>
      )}
      {kind === "atlas" ? (
        <AtlasThreadBody />
      ) : kind === "fresh" ? (
        sent.length === 0 && (
          <p className="sf-thread-hint">还没有消息 —— 试试上面的快捷指令，或直接输入你的第一个任务。</p>
        )
      ) : (
        script && (
          <>
            <article className="sf-user-message">
              <p>{script.user}</p>
            </article>
            {script.replies.map((reply) => (
              <article className="sf-agent-message" key={reply.time}>
                <AgentAvatar label={reply.label} color={reply.color} />
                <div className="sf-message-body">
                  <div className="sf-message-author">
                    <strong>{reply.name}</strong>
                    <span>{reply.time}</span>
                  </div>
                  <p>{reply.text}</p>
                </div>
              </article>
            ))}
          </>
        )
      )}
      {sent.map((text, index) => (
        <article className="sf-user-message sf-new-message" key={`${index}-${text}`}>
          <p>{text}</p>
        </article>
      ))}
      {(kind === "atlas" || sent.length > 0) && (
        <div className="sf-working">
          <span />
          <span />
          <span />
          <p>
            {kind === "atlas" ? (
              <>
                <strong>品牌策略师</strong> 正在生成定位假设
              </>
            ) : (
              <>
                <strong>CEO 主控</strong> 正在拆解任务并调度团队
              </>
            )}
          </p>
        </div>
      )}
    </>
  );
}

function AgentsView() {
  return (
    <section className="sf-subview">
      <div className="sf-subview-intro">
        <div>
          <p>AI WORKFORCE</p>
          <h1>你的 Agent 团队</h1>
          <span>为不同角色配置能力、工具与责任边界。</span>
        </div>
        <button>
          <Plus size={15} /> 创建 Agent
        </button>
      </div>
      <div className="sf-agent-grid">
        {agents.map((agent) => (
          <article key={agent.name}>
            <div>
              <AgentAvatar label={agent.initials} color={agent.color} />
              <button>
                <MoreHorizontal size={17} />
              </button>
            </div>
            <h2>{agent.name}</h2>
            <p>{agent.role}</p>
            <div>
              <span>
                <Zap size={13} /> 6 Skills
              </span>
              <span>
                <BookOpen size={13} /> 3 知识源
              </span>
            </div>
            <footer>
              <span>
                <i /> {agent.status}
              </span>
              <button>
                配置 <ChevronRight size={14} />
              </button>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

function KnowledgeView() {
  return (
    <section className="sf-subview">
      <div className="sf-subview-intro">
        <div>
          <p>SHARED CONTEXT</p>
          <h1>团队知识库</h1>
          <span>让每位 Agent 都基于同一份可靠信息工作。</span>
        </div>
        <button>
          <Plus size={15} /> 添加知识
        </button>
      </div>
      <div className="sf-knowledge-layout">
        <div className="sf-knowledge-card featured">
          <BookOpen />
          <small>品牌空间</small>
          <h2>Atlas Brand Hub</h2>
          <p>品牌定位、语调、受众与核心产品信息。</p>
          <footer>
            <span>12 份文档</span>
            <span>刚刚更新</span>
          </footer>
        </div>
        <div className="sf-knowledge-card">
          <FileText />
          <small>项目资料</small>
          <h2>新品发布研究</h2>
          <p>市场、竞品与用户访谈的结构化资料。</p>
          <footer>
            <span>24 个来源</span>
            <span>2 小时前</span>
          </footer>
        </div>
        <div className="sf-knowledge-card">
          <GitBranch />
          <small>方法论</small>
          <h2>营销交付 SOP</h2>
          <p>团队使用的流程模板与质量标准。</p>
          <footer>
            <span>8 个流程</span>
            <span>昨天</span>
          </footer>
        </div>
      </div>
    </section>
  );
}

const dashboardSeries = {
  7: [18, 31, 27, 46, 39, 62, 71],
  30: [12, 18, 17, 28, 25, 39, 35, 51, 48, 58, 55, 73],
  90: [8, 14, 12, 21, 18, 32, 29, 40, 38, 55, 49, 67],
};

function DashboardView() {
  const [days, setDays] = useState<7 | 30 | 90>(30);
  const [metric, setMetric] = useState<"tokens" | "calls" | "cost">("tokens");
  const [refreshing, setRefreshing] = useState(false);
  const values = dashboardSeries[days];
  const points = values
    .map((value, index) => `${(index / (values.length - 1)) * 680},${142 - value * 1.6}`)
    .join(" ");
  const multiplier = days === 7 ? 0.34 : days === 30 ? 1 : 2.7;

  function refresh() {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 650);
  }

  return (
    <section className="sf-dashboard">
      <div className="sf-page-heading">
        <div>
          <p>DATA PLATFORM</p>
          <h1>数据看板</h1>
          <span>调用、Token 消耗、成本估算、Run 成功率与每日简报。</span>
        </div>
        <button onClick={refresh} disabled={refreshing}>
          <Zap size={14} /> {refreshing ? "刷新中…" : "刷新数据"}
        </button>
      </div>

      <div className="sf-range-tabs">
        {([7, 30, 90] as const).map((range) => (
          <button
            key={range}
            className={days === range ? "active" : ""}
            onClick={() => setDays(range)}
          >
            近 {range} 天
          </button>
        ))}
      </div>

      <div className="sf-metric-grid">
        {[
          ["LLM 调用", Math.round(286 * multiplier).toLocaleString(), "+18.6%", "up"],
          ["Token 消耗", `${(1.84 * multiplier).toFixed(2)}M`, "+12.4%", "up"],
          ["估算成本", `$${(38.72 * multiplier).toFixed(2)}`, "-6.8%", "down"],
          ["Run 成功率", "94.8%", "+2.1%", "up"],
          ["活跃项目", Math.max(3, Math.round(8 * multiplier)).toString(), "12 个会话", ""],
        ].map(([label, value, delta, state]) => (
          <article key={label}>
            <p>{label}</p>
            <strong>{value}</strong>
            <span className={state}>{delta}</span>
          </article>
        ))}
      </div>

      <div className="sf-dashboard-grid">
        <article className="sf-chart-card">
          <div className="sf-card-title">
            <div>
              <strong>使用趋势</strong>
              <span>按日统计</span>
            </div>
            <div className="sf-metric-tabs">
              {(["tokens", "calls", "cost"] as const).map((item) => (
                <button
                  key={item}
                  className={metric === item ? "active" : ""}
                  onClick={() => setMetric(item)}
                >
                  {item === "tokens" ? "Tokens" : item === "calls" ? "调用" : "成本"}
                </button>
              ))}
            </div>
          </div>
          <div className="sf-chart">
            <div className="sf-chart-y">
              <span>80k</span>
              <span>60k</span>
              <span>40k</span>
              <span>20k</span>
              <span>0</span>
            </div>
            <svg viewBox="0 0 680 150" preserveAspectRatio="none" aria-label={`${metric} 使用趋势`}>
              <defs>
                <linearGradient id="sfChartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff5e3a" stopOpacity=".22" />
                  <stop offset="100%" stopColor="#ff5e3a" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon points={`0,150 ${points} 680,150`} fill="url(#sfChartFill)" />
              <polyline
                points={points}
                fill="none"
                stroke="#ff5e3a"
                strokeWidth="3"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {values.map((value, index) => (
                <circle
                  key={index}
                  cx={(index / (values.length - 1)) * 680}
                  cy={142 - value * 1.6}
                  r="3.5"
                  fill="#fff"
                  stroke="#ff5e3a"
                  strokeWidth="2"
                />
              ))}
            </svg>
          </div>
          <div className="sf-chart-x">
            <span>05/01</span>
            <span>05/08</span>
            <span>05/15</span>
            <span>05/22</span>
            <span>今天</span>
          </div>
        </article>

        <article className="sf-brief-card">
          <div className="sf-card-title">
            <div>
              <strong>每日简报</strong>
              <span>今天 09:00 更新</span>
            </div>
          </div>
          <div className="sf-brief-highlight">
            <span>
              <Zap size={17} />
            </span>
            <div>
              <small>今日调用</small>
              <strong>38</strong>
            </div>
            <em>+$4.21</em>
          </div>
          <ul>
            <li>
              <span>完成 Runs</span>
              <strong>12</strong>
            </li>
            <li>
              <span>平均响应时间</span>
              <strong>18.4s</strong>
            </li>
            <li>
              <span>待人工审核</span>
              <strong className="warm">2</strong>
            </li>
            <li>
              <span>失败任务</span>
              <strong>1</strong>
            </li>
          </ul>
          <div className="sf-dashboard-alert">
            <ShieldCheck size={15} />
            <span>品牌策略 Agent 有 2 项输出等待审核</span>
            <ChevronRight size={14} />
          </div>
        </article>
      </div>

      <div className="sf-breakdown-card">
        <div className="sf-card-title">
          <div>
            <strong>模型用量分布</strong>
            <span>按 Token 统计</span>
          </div>
          <button>导出 CSV</button>
        </div>
        <div className="sf-breakdown-head">
          <span>模型</span>
          <span>调用</span>
          <span>Tokens</span>
          <span>成本</span>
          <span>占比</span>
        </div>
        {[
          ["Claude 3.7 Sonnet", "128", "842k", "$18.42", "46%"],
          ["GPT-4.1", "96", "615k", "$12.08", "33%"],
          ["Gemini 2.5 Pro", "62", "383k", "$8.22", "21%"],
        ].map((row, index) => (
          <div className="sf-breakdown-row" key={row[0]}>
            <span>
              <i className={`model-${index}`} />
              {row[0]}
            </span>
            {row.slice(1).map((cell) => (
              <span key={cell}>{cell}</span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectsView() {
  const [showCreate, setShowCreate] = useState(false);
  return (
    <section className="sf-subview">
      <div className="sf-subview-intro">
        <div>
          <p>WORKSPACES</p>
          <h1>项目</h1>
          <span>组织会话、Agent、知识与最终交付成果。</span>
        </div>
        <button onClick={() => setShowCreate(!showCreate)}>
          <Plus size={15} /> 新建项目
        </button>
      </div>
      {showCreate && (
        <form
          className="sf-inline-create"
          onSubmit={(event) => {
            event.preventDefault();
            setShowCreate(false);
          }}
        >
          <Folder size={17} />
          <input autoFocus required placeholder="输入项目名称" />
          <button type="submit">创建</button>
          <button type="button" onClick={() => setShowCreate(false)}>
            <X size={15} />
          </button>
        </form>
      )}
      <div className="sf-project-grid">
        {[
          ["Atlas 新品发布", "4 位 Agent · 8 个会话", "68%", "#ff5e3a"],
          ["Q2 内容增长", "3 位 Agent · 12 个会话", "42%", "#00a594"],
          ["客户提案自动化", "2 位 Agent · 5 个会话", "86%", "#8e6cff"],
        ].map(([name, meta, progress, color]) => (
          <article key={name}>
            <header>
              <span style={{ background: color }}>
                <Folder size={17} />
              </span>
              <button>
                <MoreHorizontal size={17} />
              </button>
            </header>
            <h2>{name}</h2>
            <p>{meta}</p>
            <div>
              <span>
                <i style={{ width: progress, background: color }} />
              </span>
              <strong>{progress}</strong>
            </div>
            <footer>
              <span>最近更新：今天</span>
              <button>
                打开项目 <ChevronRight size={14} />
              </button>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

function SchedulesView() {
  const [scheduleRows, setScheduleRows] = useState([
    {
      id: 1,
      name: "每天生成竞品动态简报",
      agent: "市场研究员",
      cron: "每天 09:00",
      next: "明天 09:00",
      enabled: true,
    },
    {
      id: 2,
      name: "汇总本周内容数据",
      agent: "内容创意",
      cron: "每周五 18:00",
      next: "周五 18:00",
      enabled: true,
    },
    {
      id: 3,
      name: "检查品牌舆情风险",
      agent: "品牌策略师",
      cron: "每 6 小时",
      next: "今天 16:00",
      enabled: false,
    },
  ]);
  return (
    <section className="sf-subview">
      <div className="sf-subview-intro">
        <div>
          <p>AUTOMATIONS</p>
          <h1>定时任务</h1>
          <span>全部 Agent 的周期与一次性执行计划。</span>
        </div>
        <button>
          <Plus size={15} /> 创建定时任务
        </button>
      </div>
      <div className="sf-schedule-list">
        {scheduleRows.map((schedule, index) => (
          <article key={schedule.id} className={schedule.enabled ? "" : "disabled"}>
            <span className="sf-schedule-icon">
              <CalendarClock size={18} />
            </span>
            <div>
              <strong>{schedule.name}</strong>
              <p>
                <span>{schedule.agent}</span> · {schedule.cron} · 下次 {schedule.next}
              </p>
            </div>
            <span className={schedule.enabled ? "enabled" : ""}>
              {schedule.enabled ? "运行中" : "已停用"}
            </span>
            <button
              className={`sf-switch ${schedule.enabled ? "on" : ""}`}
              onClick={() =>
                setScheduleRows((rows) =>
                  rows.map((row, rowIndex) =>
                    rowIndex === index ? { ...row, enabled: !row.enabled } : row,
                  ),
                )
              }
              aria-label={schedule.enabled ? "停用任务" : "启用任务"}
            >
              <i />
            </button>
            <button>
              <MoreHorizontal size={17} />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function SettingsView() {
  const [section, setSection] = useState("模型与密钥");
  const groups = [
    ["账户", ["个人资料"]],
    ["外观", ["主题与显示", "语言"]],
    ["集成", ["Skills", "模型与密钥", "工具提供商", "连接器", "MCP 集成"]],
    ["记忆", ["记忆条目", "Agent 画像", "交接与写回"]],
    ["数据", ["通知", "高级设置"]],
  ];
  return (
    <section className="sf-settings">
      <aside>
        {groups.map(([group, items]) => (
          <div key={group as string}>
            <p>{group as string}</p>
            {(items as string[]).map((item) => (
              <button
                key={item}
                className={section === item ? "active" : ""}
                onClick={() => setSection(item)}
              >
                {item === "模型与密钥" ? (
                  <Server size={15} />
                ) : item === "个人资料" ? (
                  <Users size={15} />
                ) : item.includes("记忆") ? (
                  <Bot size={15} />
                ) : (
                  <Settings size={15} />
                )}
                {item}
              </button>
            ))}
          </div>
        ))}
      </aside>
      <div className="sf-settings-content">
        <p>SETTINGS</p>
        <h1>{section}</h1>
        {section === "模型与密钥" ? (
          <>
            <div className="sf-setting-block">
              <div>
                <span>
                  <Server />
                </span>
                <div>
                  <strong>默认模型</strong>
                  <small>新对话与 Agent 的默认推理模型</small>
                </div>
              </div>
              <button>
                Claude 3.7 Sonnet <ChevronDown size={14} />
              </button>
            </div>
            <div className="sf-setting-block">
              <div>
                <span>
                  <WalletCards />
                </span>
                <div>
                  <strong>API 密钥</strong>
                  <small>密钥仅保存在你的工作空间中</small>
                </div>
              </div>
              <button>
                管理密钥 <ChevronRight size={14} />
              </button>
            </div>
            <div className="sf-setting-block">
              <div>
                <span>
                  <Link2 />
                </span>
                <div>
                  <strong>模型回退链</strong>
                  <small>主模型不可用时自动切换</small>
                </div>
              </div>
              <label className="sf-switch on">
                <i />
              </label>
            </div>
          </>
        ) : (
          <div className="sf-settings-placeholder">
            <Settings size={25} />
            <strong>{section}</strong>
            <p>在这里管理 {section} 相关配置。所有修改会应用到当前工作空间。</p>
            <button>保存设置</button>
          </div>
        )}
      </div>
    </section>
  );
}
