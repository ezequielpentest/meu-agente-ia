import { useState, useRef, useEffect } from "react";

const AGENTS = [
  { id: "dispatch", name: "NEXUS", role: "Mission Dispatcher", team: "core", icon: "🧬", color: "#00ff88", specialty: "Analisa situações e despacha o agente especialista correto. Coordena handoffs e conversas entre agentes." },
  { id: "commander", name: "Rex", role: "Squad Commander", team: "red", icon: "⚔️", color: "#ff4444", specialty: "Estratégia ofensiva, metodologias PTES/OWASP/OSSTMM, coordenação de operações complexas de pentest." },
  { id: "ghost", name: "Ghost", role: "Recon & OSINT", team: "red", icon: "👁️", color: "#ff6600", specialty: "OSINT avançado, reconhecimento passivo/ativo, Shodan, theHarvester, Maltego, Google Dorks, subfinder, amass." },
  { id: "phantom", name: "Phantom", role: "Web Exploitation", team: "red", icon: "🕸️", color: "#ff8800", specialty: "SQLi manual (error/blind/time-based), XSS stored/reflected, LFI/RFI, File Upload bypass, Burp Suite, OWASP Top 10, WordPress/Joomla/PHP." },
  { id: "shadow", name: "Shadow", role: "Network Pentester", team: "red", icon: "🌐", color: "#ff5500", specialty: "Nmap avançado, enumeração de serviços (HTTP/FTP/SMB/SSH/SNMP/MySQL/RDP), pivoting, Ligolo-ng, Chisel, proxychains." },
  { id: "viper", name: "Viper", role: "Exploit Dev", team: "red", icon: "🐍", color: "#dd2200", specialty: "Desenvolvimento de exploits, análise de CVEs, Searchsploit, ExploitDB, correção e adaptação de exploits públicos, fuzzing." },
  { id: "cipher", name: "Cipher", role: "Password Attacks", team: "red", icon: "🔐", color: "#cc3300", specialty: "Cracking de hashes, Hydra, Hashcat, John the Ripper, wordlists customizadas, rockyou, regras de mutação, Pass-the-Hash." },
  { id: "wraith", name: "Wraith", role: "Post-Exploitation", team: "red", icon: "💀", color: "#ff1100", specialty: "Meterpreter, shells estáveis, transferência de arquivos, persistência, lateral movement, limpeza de rastros, C2." },
  { id: "nexus_ad", name: "Dominator", role: "Active Directory", team: "red", icon: "🏛️", color: "#ee3300", specialty: "Active Directory attacks, Kerberoasting, AS-REP Roasting, Pass-the-Hash, BloodHound, PowerView, DCSync, Domain Admin." },
  { id: "echo", name: "Echo", role: "Social Engineering", team: "red", icon: "🎭", color: "#ff3300", specialty: "Phishing avançado, engenharia social, GoPhish, SET framework, pretexting, campanhas de conscientização." },
  { id: "bof", name: "B0F", role: "Buffer Overflow", team: "specialist", icon: "🧠", color: "#ff44aa", specialty: "Buffer Overflow Windows/Linux, fuzzing com Python, offset, badchars, shellcode, msfvenom, Assembly, DEP/ASLR bypass, ret2libc." },
  { id: "privesc", name: "Escalon", role: "Privilege Escalation", team: "specialist", icon: "🔑", color: "#ffcc00", specialty: "Linux privesc: sudo -l, SUID/SGID, cron jobs, capabilities, kernel exploits, writable paths. Windows: SeImpersonatePrivilege, serviços, tokens, UAC bypass. LinPEAS, WinPEAS, GTFOBins." },
  { id: "tux", name: "Tux", role: "Linux Expert", team: "specialist", icon: "🐧", color: "#00cc44", specialty: "Linux avançado: bash, permissões, grep/awk/sed/cut/find, redes, serviços, systemd, cron, SSH, VirtualBox, Kali Linux, troubleshooting." },
  { id: "hydra_m", name: "Hydra", role: "Metasploit Expert", team: "specialist", icon: "💣", color: "#ff8800", specialty: "Metasploit Framework completo: search, use, set, run, módulos auxiliares/exploit/post, msfvenom payloads, meterpreter avançado, sessões." },
  { id: "syntax", name: "Syntax", role: "Scripting & Dev", team: "specialist", icon: "💻", color: "#aa44ff", specialty: "Python3 para pentest, Bash scripting, PowerShell, C# para Red Team, automação, sockets, criação de ferramentas, scripts de exploit." },
  { id: "airwave", name: "Airwave", role: "Wireless Hacking", team: "specialist", icon: "📡", color: "#00ffcc", specialty: "Wi-Fi hacking: WPA2, PMKID attacks, handshake capture, aircrack-ng, hashcat, redes ocultas, MAC spoofing, evil twin, OSWP prep." },
  { id: "reporter", name: "Scribe", role: "Report Writer", team: "specialist", icon: "📝", color: "#88aaff", specialty: "Relatórios técnicos DCPT/OSCP: estrutura profissional, CVSS scoring, descrição de vulnerabilidades, evidências, mitigações, modelo Desec." },
  { id: "scholar", name: "Scholar", role: "Study Coach", team: "specialist", icon: "📅", color: "#00ffaa", specialty: "Cronograma de estudos pentest, Desec NPP/PE, HTB, DCPT/eJPT/OSCP prep, revisão por módulo, técnicas de memorização, anotações." },
  { id: "ctf", name: "FlagHunter", role: "CTF Expert", team: "specialist", icon: "🚩", color: "#ffaa00", specialty: "CTF challenges: web, crypto, forensics, pwn, reversing, steganography. HTB Starting Point, TryHackMe rooms, estratégias e ferramentas." },
  { id: "oscp_coach", name: "OscarP", role: "Cert Coach", team: "specialist", icon: "🏆", color: "#ff88aa", specialty: "Preparação OSCP/DCPT/eJPT: metodologia Try Harder, gestão de tempo no exame, writeups, máquinas similares HTB, relatório OSCP format." },
  { id: "forge", name: "Forge", role: "AppSec / Blue", team: "blue", icon: "⚙️", color: "#0055cc", specialty: "Code review, SAST/DAST, DevSecOps, análise de vulnerabilidades em código, secure coding, análise de CVEs em aplicações." },
  { id: "atlas", name: "Atlas", role: "Incident Response", team: "blue", icon: "🚨", color: "#0077ee", specialty: "IR, forensics digital, análise de malware, contenção de ameaças, volatility, autopsy, cadeia de custódia, MITRE ATT&CK." },
  { id: "sentinel", name: "Sentinel", role: "Defense & Blue", team: "blue", icon: "🛡️", color: "#0088ff", specialty: "Defesa em profundidade, IDS/IPS, Snort, firewall rules, hardening, monitoramento, detecção de intrusão e resposta." },
  { id: "github_agent", name: "GitOps", role: "GitHub Agent", team: "core", icon: "🐙", color: "#8844ee", specialty: "Escreve conteúdo formatado para repositórios GitHub: scripts, writeups HTB, notas de pentest. Repositórios: ezequielpentest/scripts, htb-writeups, pentest-notas." },
];

const REPOS = {
  scripts: { name: "ezequielpentest/scripts", url: "https://github.com/ezequielpentest/scripts", desc: "Scripts de pentest e automação" },
  htb: { name: "ezequielpentest/htb-writeups", url: "https://github.com/ezequielpentest/htb-writeups", desc: "Writeups de máquinas HTB" },
  notas: { name: "ezequielpentest/pentest-notas", url: "https://github.com/ezequielpentest/pentest-notas", desc: "Notas e anotações de pentest" },
};

const AGENT_MAP = AGENTS.reduce((acc, a) => { acc[a.id] = a; return acc; }, {});

async function callClaude(messages, systemPrompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1200,
      system: systemPrompt,
      messages,
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "Erro ao processar.";
}

const DISPATCHER_SYSTEM = `Você é NEXUS, o dispatcher de elite do squad de pentest de Ezequiel.

Sua função:
1. Analisar a mensagem do usuário
2. Identificar QUAL agente especialista deve responder
3. Se a operação envolver múltiplos especialistas, coordenar a conversa entre eles
4. Fazer handoff automático quando a situação mudar de fase

Agentes disponíveis e quando chamar cada um:
- Rex (commander): estratégia geral, coordenação de pentest complexo
- Ghost (recon): OSINT, reconhecimento, information gathering
- Phantom (web): SQLi, XSS, LFI, Burp Suite, web exploitation
- Shadow (network): Nmap, enumeração de serviços, pivoting
- Viper (exploit dev): exploits, CVEs, Searchsploit, desenvolvimento
- Cipher (passwords): cracking, Hydra, Hashcat, hashes
- Wraith (post-exploitation): shells, persistência, lateral movement
- Dominator (AD): Active Directory, Kerberoasting, BloodHound
- B0F (buffer overflow): BOF Windows/Linux, fuzzing, shellcode
- Escalon (privesc): privilege escalation Linux/Windows, LinPEAS/WinPEAS
- Tux (linux): Linux avançado, terminal, bash, troubleshooting
- Hydra (metasploit): Metasploit Framework, msfvenom, meterpreter
- Syntax (scripting): Python, Bash, PowerShell, C#, automação
- Airwave (wireless): Wi-Fi, WPA2, aircrack-ng
- Scribe (report): relatórios técnicos, documentação DCPT/OSCP
- Scholar (study): cronograma de estudos, dicas de certificação
- FlagHunter (ctf): CTF challenges, HTB Starting Point
- OscarP (cert coach): prep OSCP/DCPT/eJPT, exame, metodologia
- Forge (appsec): code review, análise de código, DevSecOps
- Atlas (IR): incident response, forensics, análise de malware
- Sentinel (blue): defesa, IDS/IPS, firewall, hardening
- GitOps (github): escrever conteúdo para GitHub do Ezequiel

FORMATO OBRIGATÓRIO DA SUA RESPOSTA — use EXATAMENTE este JSON:
{
  "agents": ["agent_id1", "agent_id2"],
  "reasoning": "por que esses agentes",
  "conversation": [
    {"agent": "agent_id", "message": "resposta técnica detalhada do agente"},
    {"agent": "agent_id2", "message": "resposta ou complemento do segundo agente se necessário"}
  ]
}

REGRAS:
- Responda SEMPRE em português brasileiro
- Seja EXTREMAMENTE técnico e detalhado — você é elite
- Mostre comandos reais com explicação
- Se uma operação muda de fase, faça handoff natural entre agentes no campo "conversation"
- Agentes podem conversar entre si: um completa o raciocínio do outro, um valida a abordagem do outro
- NUNCA haja conflito sem solução — agentes concordam na melhor abordagem
- Ética: apenas ambientes autorizados, CTFs e labs
- Para GitHub: gere conteúdo markdown profissional pronto para copiar`;

export default function App() {
  const [messages, setMessages] = useState([{
    type: "system",
    content: "NEXUS online. Descreva sua situação — identificarei o agente ideal e coordenarei o time necessário."
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarTab, setSidebarTab] = useState("agents");
  const [activeAgents, setActiveAgents] = useState([AGENT_MAP["dispatch"]]);
  const [search, setSearch] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput("");
    setMessages(prev => [...prev, { type: "user", content: userText }]);
    setLoading(true);

    try {
      const history = messages
        .filter(m => m.type === "user" || m.type === "agent_conversation")
        .map(m => {
          if (m.type === "user") return { role: "user", content: m.content };
          return { role: "assistant", content: JSON.stringify(m.raw || m.content) };
        });

      history.push({ role: "user", content: userText });

      const raw = await callClaude(history, DISPATCHER_SYSTEM);

      let parsed;
      try {
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
      } catch {
        parsed = {
          agents: ["dispatch"],
          reasoning: "Análise da situação",
          conversation: [{ agent: "dispatch", message: raw }]
        };
      }

      const involvedAgents = (parsed.agents || []).map(id => AGENT_MAP[id]).filter(Boolean);
      if (involvedAgents.length > 0) setActiveAgents(involvedAgents);

      setMessages(prev => [...prev, {
        type: "agent_conversation",
        agents: parsed.agents || [],
        reasoning: parsed.reasoning,
        conversation: parsed.conversation || [],
        raw: parsed,
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        type: "agent_conversation",
        agents: ["dispatch"],
        reasoning: "Erro",
        conversation: [{ agent: "dispatch", message: "Erro de conexão. Tente novamente." }],
      }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  const filteredAgents = AGENTS.filter(a =>
    !search || a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.role.toLowerCase().includes(search.toLowerCase()) ||
    a.specialty.toLowerCase().includes(search.toLowerCase())
  );

  const teamOrder = ["core", "red", "specialist", "blue"];
  const teamLabels = { core: "◆ CORE", red: "◆ RED TEAM", specialist: "◆ SPECIALISTS", blue: "◆ BLUE TEAM" };
  const teamColors = { core: "#00ff88", red: "#ff4444", specialist: "#ffaa00", blue: "#0088ff" };

  const quickPrompts = [
    "Preciso iniciar reconhecimento em um alvo web",
    "Tenho acesso inicial, preciso escalar privilégios no Linux",
    "Encontrei possível SQL Injection, como explorar manualmente?",
    "Preciso escrever um writeup HTB para meu GitHub",
    "Me ajude a estudar Buffer Overflow para o DCPT",
    "Recebi um shell, o que fazer na pós-exploração?",
    "Preciso de um script Python para automação de pentest",
    "Como enumerar Active Directory depois de ter acesso?",
  ];

  return (
    <div style={{
      height: "100vh", display: "flex", flexDirection: "column",
      background: "#050508",
      fontFamily: "'Share Tech Mono', 'Courier New', monospace",
      color: "#c0ccd8",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #050508; }
        ::-webkit-scrollbar-thumb { background: #1a2a1a; border-radius: 2px; }
        .agent-msg { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .scanline {
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.01) 2px, rgba(0,255,136,0.01) 4px);
          pointer-events: none;
        }
        pre { background: #0a0f0a; border: 1px solid #1a3a1a; border-radius: 6px; padding: 12px; overflow-x: auto; color: #00ff88; font-size: 11px; line-height: 1.6; margin: 8px 0; }
        code { background: #0a0f0a; color: #00ff88; padding: 1px 5px; border-radius: 3px; font-size: 11px; }
        .quick-btn:hover { background: #001a00 !important; color: #00ff88 !important; border-color: #00ff8844 !important; }
        .agent-card:hover { border-color: inherit !important; background: rgba(255,255,255,0.03) !important; }
      `}</style>

      {/* Header */}
      <div style={{
        background: "linear-gradient(90deg, #050508 0%, #080d08 50%, #050508 100%)",
        borderBottom: "1px solid #0a2a0a",
        padding: "0 20px",
        height: 52,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "relative", flexShrink: 0,
      }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, #00ff8844, transparent)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: "linear-gradient(135deg, #00ff88, #0088ff)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, boxShadow: "0 0 20px #00ff8844",
          }}>⚡</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#00ff88", letterSpacing: 3, fontFamily: "'Orbitron', monospace" }}>
              EZEQUIEL PENTEST
            </div>
            <div style={{ fontSize: 9, color: "#334433", letterSpacing: 2 }}>
              CYBER SQUAD v3.0 • {AGENTS.length} AGENTS • ELITE UNIT
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {activeAgents.slice(0, 4).map(a => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.color, boxShadow: `0 0 6px ${a.color}` }} className="pulse" />
              <span style={{ fontSize: 10, color: a.color, letterSpacing: 1 }}>{a.name}</span>
            </div>
          ))}
          {activeAgents.length > 4 && <span style={{ fontSize: 10, color: "#334" }}>+{activeAgents.length - 4}</span>}
        </div>

        <div style={{ fontSize: 10, color: "#00ff88", letterSpacing: 1 }}>
          🟢 SISTEMA OPERACIONAL
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{
          width: 220, background: "#030306",
          borderRight: "1px solid #0a1a0a",
          display: "flex", flexDirection: "column", flexShrink: 0,
        }}>
          {/* Sidebar tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #0a1a0a" }}>
            {["agents", "repos"].map(tab => (
              <button key={tab} onClick={() => setSidebarTab(tab)} style={{
                flex: 1, padding: "10px 0", border: "none", cursor: "pointer",
                background: sidebarTab === tab ? "#0a1a0a" : "transparent",
                color: sidebarTab === tab ? "#00ff88" : "#334",
                fontSize: 10, letterSpacing: 1, textTransform: "uppercase",
                borderBottom: sidebarTab === tab ? "2px solid #00ff88" : "2px solid transparent",
                transition: "all 0.2s", fontFamily: "inherit",
              }}>{tab}</button>
            ))}
          </div>

          {sidebarTab === "agents" && (
            <>
              <div style={{ padding: "8px" }}>
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="buscar agente..."
                  style={{
                    width: "100%", background: "#0a0a0f", border: "1px solid #0a2a0a",
                    borderRadius: 4, padding: "5px 8px", color: "#668866", fontSize: 10,
                    fontFamily: "inherit", outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ flex: 1, overflowY: "auto" }}>
                {teamOrder.map(team => {
                  const agents = filteredAgents.filter(a => a.team === team);
                  if (!agents.length) return null;
                  return (
                    <div key={team}>
                      <div style={{ padding: "8px 10px 4px", fontSize: 8, color: teamColors[team], letterSpacing: 2, opacity: 0.7 }}>
                        {teamLabels[team]}
                      </div>
                      {agents.map(agent => {
                        const isActive = activeAgents.some(a => a.id === agent.id);
                        return (
                          <div key={agent.id} className="agent-card" style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "7px 10px", cursor: "default",
                            background: isActive ? agent.color + "10" : "transparent",
                            borderLeft: isActive ? `2px solid ${agent.color}` : "2px solid transparent",
                            transition: "all 0.15s",
                          }}>
                            <div style={{ width: 22, height: 22, borderRadius: 4, background: agent.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>{agent.icon}</div>
                            <div style={{ overflow: "hidden" }}>
                              <div style={{ fontSize: 11, color: isActive ? agent.color : "#667766", fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{agent.name}</div>
                              <div style={{ fontSize: 9, color: "#334433", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{agent.role}</div>
                            </div>
                            {isActive && <div style={{ width: 5, height: 5, borderRadius: "50%", background: agent.color, marginLeft: "auto", flexShrink: 0, boxShadow: `0 0 4px ${agent.color}` }} className="pulse" />}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {sidebarTab === "repos" && (
            <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
              <div style={{ fontSize: 9, color: "#8844ee", letterSpacing: 2, marginBottom: 12 }}>◆ GITHUB REPOS</div>
              {Object.values(REPOS).map(repo => (
                <div key={repo.name} style={{
                  background: "#0a0a14", border: "1px solid #1a1a3a", borderRadius: 8,
                  padding: 10, marginBottom: 8,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 12 }}>🐙</span>
                    <span style={{ fontSize: 10, color: "#8844ee", fontWeight: "bold" }}>{repo.name}</span>
                  </div>
                  <div style={{ fontSize: 9, color: "#445", marginBottom: 6 }}>{repo.desc}</div>
                  <a href={repo.url} target="_blank" rel="noopener noreferrer" style={{
                    fontSize: 9, color: "#8844ee", textDecoration: "none",
                    border: "1px solid #8844ee44", borderRadius: 3, padding: "2px 6px",
                  }}>↗ abrir</a>
                </div>
              ))}
              <div style={{
                background: "#0a0a14", border: "1px solid #1a1a2a", borderRadius: 8, padding: 10, marginTop: 4,
              }}>
                <div style={{ fontSize: 9, color: "#8844ee", marginBottom: 6 }}>📝 Pedir ao GitOps</div>
                {[
                  "Escreve um writeup HTB para meu htb-writeups",
                  "Cria um script Python para meu repo scripts",
                  "Gera notas de módulo Desec para pentest-notas",
                ].map(p => (
                  <button key={p} onClick={() => { setInput(p); inputRef.current?.focus(); }} style={{
                    display: "block", width: "100%", textAlign: "left",
                    background: "#050508", border: "1px solid #1a1a2a", borderRadius: 4,
                    padding: "5px 7px", marginBottom: 4, cursor: "pointer",
                    fontSize: 9, color: "#556", fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#8844ee"; e.currentTarget.style.borderColor = "#8844ee44"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#556"; e.currentTarget.style.borderColor = "#1a1a2a"; }}
                  >{p}</button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Chat */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
          {/* Scanline overlay */}
          <div className="scanline" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }} />

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16, position: "relative", zIndex: 1 }}>

            {messages.length === 1 && (
              <div style={{ marginTop: 20 }}>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🧬</div>
                  <div style={{ fontSize: 14, color: "#00ff88", fontFamily: "'Orbitron', monospace", letterSpacing: 2, marginBottom: 4 }}>NEXUS DISPATCHER</div>
                  <div style={{ fontSize: 11, color: "#445", maxWidth: 400, margin: "0 auto", lineHeight: 1.8 }}>
                    Descreva sua situação em linguagem natural. O sistema identificará o agente ideal e coordenará o time.
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxWidth: 640, margin: "0 auto" }}>
                  {quickPrompts.map(p => (
                    <button key={p} className="quick-btn" onClick={() => { setInput(p); inputRef.current?.focus(); }} style={{
                      background: "#08080e", border: "1px solid #0a2a0a", borderRadius: 8,
                      padding: "10px 12px", cursor: "pointer", textAlign: "left",
                      fontSize: 11, color: "#556677", fontFamily: "inherit", lineHeight: 1.5,
                      transition: "all 0.2s",
                    }}>{p}</button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, idx) => {
              if (msg.type === "system") return (
                <div key={idx} style={{ textAlign: "center" }}>
                  <span style={{ fontSize: 10, color: "#334433", background: "#0a1a0a", padding: "3px 12px", borderRadius: 20, border: "1px solid #0a2a0a" }}>
                    🧬 {msg.content}
                  </span>
                </div>
              );

              if (msg.type === "user") return (
                <div key={idx} style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div style={{
                    maxWidth: "70%", background: "#0a1a0a",
                    border: "1px solid #1a3a1a", borderRadius: "10px 2px 10px 10px",
                    padding: "10px 14px", fontSize: 12, color: "#aaccaa", lineHeight: 1.7,
                  }}>
                    {msg.content}
                  </div>
                </div>
              );

              if (msg.type === "agent_conversation") {
                const convAgents = (msg.agents || []).map(id => AGENT_MAP[id]).filter(Boolean);
                return (
                  <div key={idx} className="agent-msg" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {/* Dispatch notice */}
                    {convAgents.length > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, transparent, #0a2a0a)" }} />
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <span style={{ fontSize: 9, color: "#334433" }}>NEXUS → </span>
                          {convAgents.map(a => (
                            <span key={a.id} style={{
                              fontSize: 9, padding: "2px 8px", borderRadius: 10,
                              background: a.color + "15", color: a.color,
                              border: `1px solid ${a.color}30`,
                            }}>{a.icon} {a.name}</span>
                          ))}
                        </div>
                        <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, #0a2a0a, transparent)" }} />
                      </div>
                    )}

                    {/* Agent messages */}
                    {(msg.conversation || []).map((conv, ci) => {
                      const agent = AGENT_MAP[conv.agent] || AGENT_MAP["dispatch"];
                      return (
                        <div key={ci} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                            background: `linear-gradient(135deg, ${agent.color}20, ${agent.color}10)`,
                            border: `1px solid ${agent.color}40`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 16, boxShadow: `0 0 10px ${agent.color}20`,
                          }}>{agent.icon}</div>
                          <div style={{
                            flex: 1, background: "#08080e",
                            border: `1px solid ${agent.color}25`,
                            borderRadius: "2px 10px 10px 10px",
                            padding: "10px 14px",
                            boxShadow: `inset 0 0 20px ${agent.color}05`,
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                              <span style={{ fontSize: 10, color: agent.color, fontWeight: "bold", letterSpacing: 1, fontFamily: "'Orbitron', monospace" }}>{agent.name}</span>
                              <span style={{ fontSize: 9, color: "#334433" }}>•</span>
                              <span style={{ fontSize: 9, color: "#445" }}>{agent.role}</span>
                              <div style={{ width: 4, height: 4, borderRadius: "50%", background: agent.color, marginLeft: "auto", boxShadow: `0 0 4px ${agent.color}` }} />
                            </div>
                            <div style={{ fontSize: 12, color: "#b0c0b0", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                              {conv.message}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }
              return null;
            })}

            {loading && (
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: "#00ff8815", border: "1px solid #00ff8840",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                }}>🧬</div>
                <div style={{
                  background: "#08080e", border: "1px solid #00ff8820",
                  borderRadius: "2px 10px 10px 10px", padding: "10px 14px",
                }}>
                  <div style={{ fontSize: 10, color: "#00ff88", marginBottom: 6, fontFamily: "'Orbitron', monospace", letterSpacing: 1 }}>NEXUS</div>
                  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        width: 6, height: 6, borderRadius: "50%", background: "#00ff88",
                        animation: `pulse 1s ${i * 0.2}s infinite`,
                      }} />
                    ))}
                    <span style={{ fontSize: 11, color: "#334433", marginLeft: 8 }}>identificando agente e processando...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: "12px 20px",
            background: "#050508",
            borderTop: "1px solid #0a2a0a",
            position: "relative", zIndex: 1,
          }}>
            <div style={{ position: "absolute", top: 0, left: 20, right: 20, height: 1, background: "linear-gradient(90deg, transparent, #00ff8822, transparent)" }} />
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ position: "relative", flex: 1 }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "#00ff8844" }}>▶</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Descreva sua situação... NEXUS identificará o agente ideal"
                  style={{
                    width: "100%", background: "#08080e",
                    border: "1px solid #0a2a0a", borderRadius: 8,
                    padding: "11px 14px 11px 30px",
                    color: "#aaccaa", fontSize: 12, fontFamily: "inherit",
                    outline: "none", boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.target.style.borderColor = "#00ff8844"}
                  onBlur={e => e.target.style.borderColor = "#0a2a0a"}
                />
              </div>
              <button onClick={sendMessage} disabled={loading} style={{
                padding: "11px 22px", borderRadius: 8, border: "1px solid #00ff8840",
                background: loading ? "#08080e" : "linear-gradient(135deg, #001a00, #0a2a0a)",
                color: loading ? "#334433" : "#00ff88",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: 11, fontFamily: "'Orbitron', monospace",
                fontWeight: "bold", letterSpacing: 2,
                boxShadow: loading ? "none" : "0 0 20px #00ff8815",
                transition: "all 0.2s",
              }}>
                {loading ? "..." : "ENVIAR"}
              </button>
            </div>
            <div style={{ fontSize: 9, color: "#223322", marginTop: 6, textAlign: "center", letterSpacing: 1 }}>
              ENTER para enviar • apenas ambientes autorizados, CTFs e labs
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
