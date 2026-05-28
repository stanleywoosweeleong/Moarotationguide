
    const { useState, useRef, useEffect } = React;

    // --- ICON STUBS (Replacing lucide-react for standalone HTML) ---
    const Icon = ({ path, className }) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} dangerouslySetInnerHTML={{__html: path}} />
    );
    const Book = (p) => <Icon {...p} path='<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>' />;
    const FileText = (p) => <Icon {...p} path='<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/>' />;
    const Globe = (p) => <Icon {...p} path='<circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>' />;
    const Search = (p) => <Icon {...p} path='<circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/>' />;
    const RefreshCw = (p) => <Icon {...p} path='<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>' />;
    const Beaker = (p) => <Icon {...p} path='<path d="M4.5 3h15"/><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"/><path d="M6 14h12"/>' />;
    const Bug = (p) => <Icon {...p} path='<path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/>' />;
    const ShieldAlert = (p) => <Icon {...p} path='<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M12 8v4"/><path d="M12 16h.01"/>' />;
    const ShieldCheck = (p) => <Icon {...p} path='<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/>' />;
    const Sparkles = (p) => <Icon {...p} path='<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>' />;
    const Send = (p) => <Icon {...p} path='<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>' />;
    const LayoutGrid = (p) => <Icon {...p} path='<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>' />;
    const MessageSquare = (p) => <Icon {...p} path='<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' />;
    const Droplets = (p) => <Icon {...p} path='<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7 6.3 7 6.3s-2.14 2.76-3.29 3.69C2.57 10.92 2 12.02 2 13.18 2 15.4 3.8 17.2 6 17.2c.34 0 .68-.04 1-.1"/><path d="M12.56 6.6c.14-.17.29-.35.44-.52.92-1.07 2.1-2.4 3.73-4.08h.02c.35.34 1 1 2.25 2.5 1.45 1.74 3 3.75 3 6.02 0 2.94-2.3 5.48-5.32 5.48-1.54 0-2.92-.68-3.9-1.73"/>' />;

    // --- DATA & CONSTANTS ---
    const LEGEND = {
      site: { N: "神經和肌肉 (Nerve & Muscle)", R: "呼吸系統 (Respiration)", G: "生長和發育 (Growth & Dev)", U: "未知/無特定 (Unknown)" },
      risk: { low: "低風險 (Low)", mid: "中風險 (Med)", high: "高風險 (High)" },
      mob: { N: "接触性", S: "系統性", SS: "選擇系統性", LS: "局部系統性", TL: "穿層滲透", UD: "上下移行" }
    };

    const createChemical = (g, n, site, risk, mob, note = null) => ({ g, n, site, risk, mob, note });

    const PESTS = [
      {
        id: "grasshopper", zh: "草蜢 / 甲虫", en: "Grasshopper / Beetle",
        items: [
          createChemical("1A", "Carbaryl", "N", "high", ["LS"]), createChemical("1B", "Dimethoate", "N", "high", ["S"]),
          createChemical("1B", "Acephate", "N", "high", ["S"]), createChemical("2A", "Endosulfan", "N", "high", ["N"]),
          createChemical("2B", "Fipronil", "N", "mid", ["SS"]), createChemical("3A", "Deltamethrin", "N", "high", ["N"]),
          createChemical("3A", "Cypermethrin", "N", "high", ["N"]), createChemical("22A", "Indoxacarb", "N", "mid", ["N"]),
          createChemical("28", "Chlorantraniliprole", "N", "mid", ["SS", "TL"], "复配 (多重机制)"),
          createChemical("15", "Diflubenzuron", "G", "mid", ["N"]), createChemical("15", "Novaluron", "G", "mid", ["N"]),
          createChemical("UN", "Azadirachtin (印楝油)", "U", "low", ["S"]), createChemical("UN", "Pyridalyl", "U", "low", ["S"])
        ]
      },
      {
        id: "redspider", zh: "红蜘蛛", en: "Red Spider Mite",
        items: [
          createChemical("1A", "Carbaryl", "N", "high", ["S"]), createChemical("1B", "Dimethoate", "N", "high", ["S"]),
          createChemical("3A", "Bifenthrin", "N", "high", ["N"]), createChemical("6", "Abamectin", "N", "mid", ["LS", "TL"]),
          createChemical("19", "Amitraz", "N", "mid", ["N"]), createChemical("12A", "Diafenthiuron", "R", "mid", ["N"]),
          createChemical("12C", "Propargite", "R", "mid", ["N"]), createChemical("13", "Chlorfenapyr", "R", "mid", ["LS", "TL"]),
          createChemical("21A", "Pyridaben", "R", "mid", ["N"]), createChemical("21A", "Fenpyroximate", "R", "mid", ["N"]),
          createChemical("25A", "Cyflumetofen", "R", "mid", ["N"]), createChemical("10A", "Hexythiazox", "G", "mid", ["N"]),
          createChemical("16", "Buprofezin", "G", "mid", ["S"]), createChemical("23", "Spirotetramat", "G", "mid", ["S"]),
          createChemical("23", "Spirodiclofen", "G", "mid", ["N"]), createChemical("UN", "Dicofol", "U", "mid", ["N"]),
          createChemical("UN", "Beauveria bassiana", "U", "low", ["N"]), createChemical("UN", "Azadirachtin", "U", "low", ["S"])
        ]
      },
      {
        id: "mealybug", zh: "粉蚧 / 介殼蟲", en: "Mealybug / Scale",
        items: [
          createChemical("1A", "Carbaryl", "N", "high", ["LS"]), createChemical("1A", "Methomyl", "N", "high", ["S"]),
          createChemical("1B", "Dimethoate", "N", "high", ["S"]), createChemical("1B", "Acephate", "N", "high", ["S"]),
          createChemical("2B", "Fipronil", "N", "mid", ["SS"]), createChemical("3A", "Deltamethrin", "N", "high", ["N"]),
          createChemical("3A", "Bifenthrin", "N", "high", ["N"]), createChemical("4A", "Imidacloprid", "N", "high", ["S", "TL", "UD"]),
          createChemical("4A", "Acetamiprid", "N", "high", ["S", "TL", "UD"]), createChemical("4C", "Sulfoxaflor", "N", "mid", ["S"]),
          createChemical("6", "Abamectin", "N", "mid", ["LS"]), createChemical("9D", "Afidopyropen", "N", "low", ["S"]),
          createChemical("28", "Cyantraniliprole", "N", "mid", ["S"]), createChemical("29", "Flonicamid", "N", "low", ["S", "TL"]),
          createChemical("30", "Isocycloseram", "N", "low", ["N"]), createChemical("7B", "Fenoxycarb", "G", "low", ["N"]),
          createChemical("16", "Buprofezin", "G", "mid", ["S"]), createChemical("23", "Spirotetramat", "G", "mid", ["S", "TL", "UD"]),
          createChemical("UN", "Azadirachtin", "U", "low", ["S"]), createChemical("UN", "White Oil", "U", "low", ["N"])
        ]
      },
      {
        id: "caterpillar", zh: "毛毛虫", en: "Caterpillar",
        items: [
          createChemical("1A", "Carbaryl", "N", "high", ["LS"]), createChemical("1B", "Dimethoate", "N", "high", ["S"]),
          createChemical("2A", "Endosulfan", "N", "high", ["N"]), createChemical("2B", "Fipronil", "N", "mid", ["SS"]),
          createChemical("3A", "Deltamethrin", "N", "high", ["N"]), createChemical("3A", "Bifenthrin", "N", "high", ["N"]),
          createChemical("4A", "Imidacloprid", "N", "high", ["S", "TL", "UD"]), createChemical("5", "Spinosad", "N", "mid", ["N"]),
          createChemical("6", "Abamectin", "N", "mid", ["LS", "TL"]), createChemical("6", "Emamectin benzoate", "N", "mid", ["LS", "TL"]),
          createChemical("14", "Cartap", "N", "mid", ["S"]), createChemical("22A", "Indoxacarb", "N", "mid", ["N"]),
          createChemical("28", "Chlorantraniliprole", "N", "mid", ["SS", "TL"]), createChemical("11A", "Bacillus thuringiensis", "N", "low", ["N"]),
          createChemical("13", "Chlorfenapyr", "R", "mid", ["LS"]), createChemical("21A", "Tolfenpyrad", "R", "mid", ["N"]),
          createChemical("15", "Lufenuron", "G", "mid", ["S", "TL", "UD"]), createChemical("18", "Chromafenozide", "G", "mid", ["S"]),
          createChemical("UN", "Azadirachtin", "U", "low", ["S"]), createChemical("UN", "Pyridalyl", "U", "low", ["S"])
        ]
      },
      {
        id: "psyllid", zh: "木虱", en: "Psyllid",
        items: [
          createChemical("1A", "Carbaryl", "N", "high", ["LS"]), createChemical("2B", "Fipronil", "N", "mid", ["SS"]),
          createChemical("3A", "Bifenthrin", "N", "high", ["N"]), createChemical("4A", "Imidacloprid", "N", "high", ["S", "TL", "UD"]),
          createChemical("4A", "Thiamethoxam", "N", "high", ["S", "TL", "UD"]), createChemical("4C", "Sulfoxaflor", "N", "mid", ["S"]),
          createChemical("4D", "Flupyradifurone", "N", "mid", ["S"]), createChemical("6", "Abamectin", "N", "mid", ["LS"]),
          createChemical("9B", "Pymetrozine", "N", "low", ["S"]), createChemical("9D", "Afidopyropen", "N", "low", ["S"]),
          createChemical("28", "Cyantraniliprole", "N", "mid", ["S"]), createChemical("12A", "Diafenthiuron", "R", "mid", ["N"]),
          createChemical("13", "Chlorfenapyr", "R", "mid", ["LS"]), createChemical("21A", "Pyridaben", "R", "mid", ["N"]),
          createChemical("16", "Buprofezin", "G", "mid", ["S"]), createChemical("23", "Spirotetramat", "G", "mid", ["S", "TL", "UD"]),
          createChemical("UN", "Beauveria bassiana", "U", "low", ["N"])
        ]
      },
      {
        id: "thrips", zh: "薊馬", en: "Thrips",
        items: [
          createChemical("1A", "Carbaryl", "N", "high", ["LS"]), createChemical("1A", "Methomyl", "N", "high", ["S"]),
          createChemical("1B", "Dimethoate", "N", "high", ["S"]), createChemical("2B", "Fipronil", "N", "mid", ["SS"]),
          createChemical("3A", "Bifenthrin", "N", "high", ["N"]), createChemical("4A", "Imidacloprid", "N", "high", ["S", "TL", "UD"]),
          createChemical("5", "Spinosad", "N", "mid", ["N"]), createChemical("6", "Abamectin", "N", "mid", ["LS", "TL"]),
          createChemical("9B", "Pymetrozine", "N", "low", ["S"]), createChemical("14", "Cartap", "N", "mid", ["S"]),
          createChemical("22A", "Indoxacarb", "N", "mid", ["N"]), createChemical("28", "Cyantraniliprole", "N", "mid", ["S"]),
          createChemical("29", "Flonicamid", "N", "low", ["SS", "TL"]), createChemical("30", "Isocycloseram", "N", "low", ["N"]),
          createChemical("12A", "Diafenthiuron", "R", "mid", ["N"]), createChemical("13", "Chlorfenapyr", "R", "mid", ["LS"]),
          createChemical("21A", "Tolfenpyrad", "R", "mid", ["N"]), createChemical("15", "Novaluron", "G", "mid", ["N"]),
          createChemical("23", "Spirotetramat", "G", "mid", ["S", "TL", "UD"]), createChemical("UN", "Azadirachtin", "U", "low", ["S"])
        ]
      },
      {
        id: "leafhopper", zh: "青蚊 (葉蟬)", en: "Green Leafhopper",
        items: [
          createChemical("1A", "Carbaryl", "N", "high", ["LS"]), createChemical("1A", "Methomyl", "N", "high", ["S"]),
          createChemical("1B", "Dimethoate", "N", "high", ["S"]), createChemical("2B", "Fipronil", "N", "mid", ["SS"]),
          createChemical("3A", "Etofenprox", "N", "high", ["N"]), createChemical("4A", "Imidacloprid", "N", "high", ["S", "TL", "UD"]),
          createChemical("4A", "Thiamethoxam", "N", "high", ["S", "TL", "UD"]), createChemical("4C", "Sulfoxaflor", "N", "mid", ["S"]),
          createChemical("9B", "Pymetrozine", "N", "low", ["S"]), createChemical("14", "Cartap", "N", "mid", ["S"]),
          createChemical("28", "Cyantraniliprole", "N", "mid", ["S"]), createChemical("29", "Flonicamid", "N", "low", ["SS", "TL"]),
          createChemical("36", "Dimpropyridaz", "N", "low", ["S"]), createChemical("12A", "Diafenthiuron", "R", "mid", ["N"]),
          createChemical("16", "Buprofezin", "G", "mid", ["S"]), createChemical("23", "Spirotetramat", "G", "mid", ["S", "TL", "UD"])
        ]
      }
    ];

    const MIX_ORDER = [
      { step: 1, zh: "水箱配水 ½ ~ ¾", en: "Fill tank ½–¾ with water" },
      { step: 2, zh: "調整 pH 酸鹼值 (≤ 6.0)", en: "Adjust pH to ≤6.0", note: { zh: "確保殺蟲劑最有效", en: "Maximize Efficacy" } },
      { step: 3, zh: "水分散粒劑 WDG → 可濕性粉劑 WP", en: "WDG → WP" },
      { step: 4, zh: "攪拌 5 分鐘", en: "Agitate 5 min" },
      { step: 5, zh: "乳油 EC → 水乳劑 EW", en: "EC → EW" },
      { step: 6, zh: "石油分散 OD → 懸浮液 SC → 懸乳劑 SE", en: "OD → SC → SE" },
      { step: 7, zh: "可溶性粒/粉劑 SG ; SP", en: "SG ; SP" },
      { step: 8, zh: "可溶性液體 SL", en: "SL" },
      { step: 9, zh: "表面活性劑 → 加滿水", en: "Surfactant → top up tank" },
    ];

    const SIMULATED_SOURCES = {
      bunting: {
        title: "bunting A.pdf",
        text: (
          <div className="space-y-4">
            <p><b>Tee's Agronomy Notes (July-August 2024 Edition)</b></p>
            <p><b>[Page 1] Resistance Management</b><br/>
            "使用農藥時，輪替不同作用機制。最有效防止抗藥性產生的手段。"<br/>
            To safeguard chemical viability, always rotate between modes of action. Pests frequently targeted by groups like 1A, 1B, 3A, and 4A show rapid cross-resistance if applied continuously.</p>
            <p><b>[Page 2] Leaf Mobility Guide</b><br/>
            • <b>Systemic (S):</b> Transports via vascular plant tissues. Excellent for hidden pests (e.g. scales, mealybugs).<br/>
            • <b>Translaminar (TL):</b> Enters leaf membrane. Ideal for mites on the underside of foliage.<br/>
            • <b>Contact (N):</b> Stays on foliage outer surface.</p>
          </div>
        )
      },
      guide: {
        title: "insecticide-rotation-guide.html",
        text: (
          <div className="space-y-4">
            <p><b>Water Tank Preparation Sequencing Standard</b></p>
            <p><b>Standard Acidification Rules:</b><br/>
            In order to maximize insecticide half-life, adjust water pH down to 6.0 or below before introducing any soluble powders or emulsions. Highly alkaline waters degrade active chemical groups immediately.</p>
            <p><b>Formulation Hierarchical Sequence:</b><br/>
            Powder / Granular Suspensions (WDG, WP) must be introduced first and agitated for at least 5 minutes before adding liquid emulsions (EC, EW) or oil dispersions (OD, SC, SE).</p>
          </div>
        )
      }
    };

    const CHAT_PROMPTS = [
      { text: "當前蟲害如何安全輪替？", q: "current pest rotation" },
      { text: "水箱混合順序是什麼？", q: "mixing order" },
      { text: "什麼是穿層滲透 (TL)？", q: "translaminar" }
    ];

    function App() {
      const [lang, setLang] = useState('zh');
      const [activeTab, setActiveTab] = useState('lookup');
      const [activeSource, setActiveSource] = useState('bunting');
      
      // Tab 1 State
      const [lookupPest, setLookupPest] = useState(PESTS[1].id);
      const [lookupFilter, setLookupFilter] = useState('all');
      
      // Tab 2 State
      const [rotPest, setRotPest] = useState(PESTS[1].id);
      const [lastUsedGroup, setLastUsedGroup] = useState('');

      // Mobile bottom-nav: which single panel is shown on small screens
      const [mobileView, setMobileView] = useState('workspace'); // 'sources' | 'workspace' | 'assistant'

      // Chat State
      const [chatInput, setChatInput] = useState('');
      const [chatLog, setChatLog] = useState([
        { role: 'bot', text: '你好！我是你的農藝筆記助手。我已深度載入並索引了 bunting A.pdf 與 insecticide-rotation-guide.html。任何關於害蟲抗性、輪替規則或混合調配順序的問題都可以隨時提問。' }
      ]);
      const chatRef = useRef(null);

      useEffect(() => {
        if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }, [chatLog]);

      // Translation Helper
      const t = (zhText, enText) => lang === 'zh' ? zhText : enText;

      // Render Chemical Card
      const ChemicalCard = ({ item, isFaded = false }) => {
        const riskColors = {
          low: "bg-emerald-50 text-emerald-800 border-emerald-200",
          mid: "bg-amber-50 text-amber-800 border-amber-200",
          high: "bg-rose-50 text-rose-800 border-rose-200"
        };
        const moaGroupColors = { low: "bg-emerald-600", mid: "bg-amber-500", high: "bg-rose-600", unknown: "bg-slate-500" };
        const styleClass = item.g === 'UN' ? moaGroupColors.unknown : (moaGroupColors[item.risk] || moaGroupColors.unknown);
        const isMix = item.note && item.note.includes("复配");
        const mobLabel = item.mob.map(m => LEGEND.mob[m]).join(" · ");

        return (
          <div className={`p-4 rounded-2xl border bg-white border-slate-200 shadow-sm hover:shadow-md transition-all flex gap-3.5 items-start ${isFaded ? 'opacity-40 grayscale bg-slate-50' : ''}`}>
            <div className={`w-12 h-12 rounded-xl text-white font-black text-sm flex items-center justify-center shadow-inner ${styleClass}`}>
              {item.g}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-slate-800 truncate">{item.n}</h4>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${riskColors[item.risk]}`}>
                  {t(LEGEND.risk[item.risk], LEGEND.risk[item.risk].split(' ')[1].replace(/[()]/g, ''))}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-600 flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-blue-500" /> {mobLabel}
                </span>
                {isMix && <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-purple-200 bg-purple-50 text-purple-700">复配 (Mix)</span>}
              </div>
              {item.note && <p className="text-[10px] text-slate-500 mt-2 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100 italic">{item.note}</p>}
            </div>
          </div>
        );
      };

      // Chat Logic
      const handleChat = (query) => {
        if (!query.trim()) return;
        setChatLog(prev => [...prev, { role: 'user', text: query }]);
        setChatInput('');

        // Gain contextual awareness of the currently selected pest
        const activePestId = activeTab === 'rotate' ? rotPest : lookupPest;
        const currentPest = PESTS.find(p => p.id === activePestId);
        const pestName = t(currentPest.zh, currentPest.en);

        setTimeout(() => {
          let reply = "";
          const q = query.toLowerCase();

          if (q.includes('spider') || q.includes('mite') || q.includes('蜘蛛')) {
            reply = `根據【bunting A.pdf】第 2 頁，紅蜘蛛 (Red Spider Mite) 施用機制在 1A, 1B, 3A 中極容易引發抗藥性。建議輪施呼吸系統機制 (12A, 21A) 以及生長抑制劑 (16, 23)。`;
          } else if (q.includes('mix') || q.includes('order') || q.includes('混合')) {
            reply = `依據指南，標準桶混順序：先加水 ½ ~ ¾，調整 pH ≤ 6.0。然後依序加入 WDG/WP → 乳油 EC → 懸浮 SC → 粒粉 SG → 液體 SL，最後加表面活性劑。`;
          } else if (q.includes('translaminar') || q.includes('tl') || q.includes('穿層')) {
            reply = `穿層滲透 (Translaminar, TL) 是活性成分穿過葉片表皮並在葉背處停留的能力。這對隱藏在葉背為害的红蜘蛛與薊馬防治尤為關鍵 (如 6 組 Abamectin)。`;
          } else {
            // Dynamic contextual response based on the currently selected pest
            const highRisk = [...new Set(currentPest.items.filter(i => i.risk === 'high').map(i => i.g))].join(', ');
            
            if (q.includes('rotate') || q.includes('rotation') || q.includes('輪替') || q.includes('推薦') || q.includes('current')) {
              reply = `針對你目前查看的「${pestName}」，資料顯示第 ${highRisk || '部分'} 組屬於高抗藥性風險。進行安全輪替時，建議切換不同作用位置。你可以在左側「輪替助手」中輸入上次使用的組別來獲取具體替代方案！`;
            } else {
              reply = `我注意到你正在查詢「${pestName}」。你可以問我關於它的高風險抗藥性機制，或是如何為它安排輪替計劃！`;
            }
          }
          setChatLog(prev => [...prev, { role: 'bot', text: reply }]);
        }, 600);
      };

      // Renders for Tabs
      const renderLookupTab = () => {
        const pest = PESTS.find(p => p.id === lookupPest);
        let items = pest.items;
        if (lookupFilter !== 'all') items = items.filter(i => i.site === lookupFilter);

        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-[#f5f4ed] p-4 rounded-2xl border border-slate-300/40">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-3">
                {t("1. 選擇目標蟲害 Target Pest", "1. Select Target Pest")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {PESTS.map(p => (
                  <button key={p.id} onClick={() => { setLookupPest(p.id); setLookupFilter('all'); }}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm border ${
                      p.id === lookupPest ? 'bg-[#114b2d] text-white border-[#114b2d]' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}>
                    <Bug className="w-4 h-4" /> {t(p.zh, p.en)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {['all', 'N', 'R', 'G', 'U'].map(f => (
                <button key={f} onClick={() => setLookupFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    f === lookupFilter ? 'bg-slate-800 text-white border-slate-800 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  }`}>
                  {f === 'all' ? t('全部機制 All', 'All MoAs') : t(LEGEND.site[f].split(' ')[0], f)}
                </button>
              ))}
            </div>

            <div className="space-y-8">
              {items.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">{t('無對應機制的化學藥劑', 'No chemicals found.')}</div>
              ) : (
                ["N", "R", "G", "U"].map(site => {
                  const subItems = items.filter(i => i.site === site);
                  if (subItems.length === 0) return null;
                  return (
                    <div key={site} className="space-y-3">
                      <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#114b2d]"></div>
                        <h3 className="font-extrabold text-xs text-slate-600 uppercase tracking-wider">{t(LEGEND.site[site], LEGEND.site[site])}</h3>
                      </div>
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {subItems.map((item, idx) => <ChemicalCard key={idx} item={item} />)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      };

      const renderRotateTab = () => {
        const activePest = PESTS.find(p => p.id === rotPest);
        const uniqueMoAs = Array.from(new Set(activePest.items.map(i => i.g))).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
        
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">{t("作用機制輪替矩陣 MoA Planner", "MoA Rotation Planner")}</h2>
                <p className="text-xs text-slate-500 mt-1">{t("選擇上次所噴灑施用的藥劑機制，系統將自動推薦安全替代代碼。", "Input last applied MoA to get safe rotation alternatives.")}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t("目標蟲害 Pest Target", "Target Pest")}</label>
                  <select value={rotPest} onChange={(e) => { setRotPest(e.target.value); setLastUsedGroup(''); }}
                    className="w-full bg-slate-50 border border-slate-300/60 p-3 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#114b2d]/30 focus:outline-none">
                    {PESTS.map(p => <option key={p.id} value={p.id}>{t(p.zh, p.en)}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t("上次施用機制 Last MoA Group", "Last MoA Used")}</label>
                  <select value={lastUsedGroup} onChange={(e) => setLastUsedGroup(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300/60 p-3 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#114b2d]/30 focus:outline-none">
                    <option value="">{t("— 請選擇上期藥劑 —", "— Select Previous Group —")}</option>
                    {uniqueMoAs.map(g => <option key={g} value={g}>{t(`第 ${g} 組 (Group ${g})`, `Group ${g}`)}</option>)}
                  </select>
                </div>
              </div>

              {lastUsedGroup ? (
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex gap-3 text-rose-800">
                  <ShieldAlert className="w-6 h-6 shrink-0" />
                  <div className="text-xs leading-relaxed">
                    <span className="font-extrabold block text-rose-900 mb-0.5 text-sm">{t(`已限制第 ${lastUsedGroup} 組`, `Group ${lastUsedGroup} Restricted`)}</span>
                    <span>{t("抗藥性風險警告：此輪應當完全排除同代碼產品，請從下方其他作用位置挑選替代成分。", "Avoid applying ingredients sharing the exact same group back-to-back.")}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-[#f0faf4] border border-[#d1ebd9] p-4 rounded-xl flex gap-3 text-[#115024]">
                  <ShieldCheck className="w-6 h-6 shrink-0" />
                  <div className="text-xs font-bold leading-relaxed flex items-center">
                    {t("請指定上期噴灑作用代碼。系統將立即過濾安全的替代方案。", "Select previous MoA group to filter safe alternatives.")}
                  </div>
                </div>
              )}
            </div>

            {lastUsedGroup && (() => {
              const safeAlts = activePest.items.filter(i => i.g !== lastUsedGroup);
              const unsafeAlts = activePest.items.filter(i => i.g === lastUsedGroup);
              
              return (
                <div className="space-y-8">
                  <div className="space-y-5">
                    <h3 className="text-xs font-black text-emerald-800 uppercase tracking-widest flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> {t("安全推薦輪替成分 Safe Alternatives", "Safe Rotation Alternatives")}
                    </h3>
                    {safeAlts.length === 0 ? (
                       <div className="p-4 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-sm">{t("警告：沒有其他作用機制可供輪替！", "No alternatives left.")}</div>
                    ) : (
                      ["N", "R", "G", "U"].map(site => {
                        const matched = safeAlts.filter(i => i.site === site);
                        if (matched.length === 0) return null;
                        return (
                          <div key={site} className="space-y-3">
                            <h4 className="font-bold text-xs text-slate-500 uppercase pb-1.5 border-b border-slate-200">{t(LEGEND.site[site], LEGEND.site[site])}</h4>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                              {matched.map((item, idx) => <ChemicalCard key={idx} item={item} />)}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  
                  <div className="pt-6 border-t border-slate-300 space-y-4">
                    <h3 className="text-xs font-black text-rose-700 uppercase tracking-widest">
                      {t("本輪排除（禁止連續施用）Unsafe In This Cycle", "Excluded In This Cycle")}
                    </h3>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      {unsafeAlts.map((item, idx) => <ChemicalCard key={idx} item={item} isFaded={true} />)}
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        );
      };

      const renderMixTab = () => (
        <div className="max-w-2xl mx-auto animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="mb-6">
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Tank-Mixing Standards</span>
              <h2 className="text-xl font-bold text-slate-800 mt-2">{t("溶液混合順序 Sequence", "Tank-Mixing Order")}</h2>
              <p className="text-sm text-slate-500 mt-1">{t("嚴格執行各剂型先後加入順序，避免化學分解失效。", "Agitate and mix in this precise hierarchy to prevent clumping.")}</p>
            </div>
            <div className="relative pl-2">
              <div className="absolute left-8 top-5 bottom-5 w-0.5 bg-slate-200 rounded-full"></div>
              <div className="space-y-6 relative">
                {MIX_ORDER.map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start group">
                    <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:border-emerald-600 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-all shrink-0 shadow-sm z-10">
                      {step.step}
                    </div>
                    <div className="flex-1 pt-1 border-b border-slate-100 pb-4 group-last:border-none">
                      <h4 className="font-bold text-sm text-slate-800">{t(step.zh, step.en)}</h4>
                      {lang === 'zh' && <p className="text-xs text-slate-400 mt-1">{step.en}</p>}
                      {step.note && (
                        <span className="inline-block mt-2 text-[10px] bg-amber-50 text-amber-700 font-bold border border-amber-200/50 px-2.5 py-0.5 rounded">
                          {t(step.note.zh, step.note.en)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );

      return (
        <div className="min-h-screen bg-[#fcfbf7] text-slate-800 flex flex-col font-sans">
          {/* Header */}
          <header className="bg-[#f4f2ea] border-b border-slate-300 px-6 py-3.5 flex items-center justify-between z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#114b2d] rounded-xl flex items-center justify-center text-[#fbfbfa] shadow-sm">
                <Book className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-sm sm:text-base text-slate-900">NotebookLM</h1>
                  <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">Agronomy Workspace</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">Tee's Insecticide MoA Guide</p>
              </div>
            </div>
            <button onClick={() => setLang(l => l === 'zh' ? 'en' : 'zh')}
              className="text-xs font-bold px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 transition-all border border-slate-300 shadow-sm">
              {lang === 'zh' ? 'English' : '中文'}
            </button>
          </header>

          {/* Main Grid */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden pb-16 lg:pb-0">
            
            {/* Left Sidebar - Sources */}
            <aside className={`${mobileView === 'sources' ? 'flex' : 'hidden'} lg:flex w-full lg:w-[320px] bg-[#fcfbf9] border-r border-slate-300 p-5 flex-col gap-4 overflow-y-auto shrink-0`}>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h2 className="text-xs font-bold text-slate-500 tracking-wider uppercase flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Sources (2)
                </h2>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">Loaded</span>
              </div>

              <div className="space-y-2.5">
                <button onClick={() => setActiveSource('bunting')}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all shadow-sm ${activeSource === 'bunting' ? 'bg-white border-emerald-600 ring-1 ring-emerald-600/20' : 'bg-slate-50 border-slate-200 hover:bg-white'}`}>
                  <div className="flex items-start gap-2.5">
                    <FileText className={`w-5 h-5 mt-0.5 ${activeSource === 'bunting' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">bunting A.pdf</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Pest Rotation Chart (2024)</p>
                    </div>
                  </div>
                </button>
                <button onClick={() => setActiveSource('guide')}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all shadow-sm ${activeSource === 'guide' ? 'bg-white border-emerald-600 ring-1 ring-emerald-600/20' : 'bg-slate-50 border-slate-200 hover:bg-white'}`}>
                  <div className="flex items-start gap-2.5">
                    <Globe className={`w-5 h-5 mt-0.5 ${activeSource === 'guide' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">insecticide-rotation-guide.html</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Mixing sequences</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="flex-1 min-h-[200px] bg-[#f6f5ee] border border-slate-300/80 rounded-2xl p-4 flex flex-col shadow-inner overflow-hidden mt-2">
                <div className="flex items-center justify-between border-b border-slate-300 pb-2 mb-3">
                  <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">Source Viewer</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/50 px-2 py-0.5 rounded">{SIMULATED_SOURCES[activeSource].title}</span>
                </div>
                <div className="flex-1 overflow-y-auto text-xs leading-relaxed text-slate-700 pr-2">
                  {SIMULATED_SOURCES[activeSource].text}
                </div>
              </div>
            </aside>

            {/* Middle Panel - Workspace Tabs */}
            <main className={`${mobileView === 'workspace' ? 'flex' : 'hidden'} lg:flex flex-1 flex-col overflow-hidden bg-[#fbfbfa]`}>
              <div className="px-4 sm:px-6 pt-4 border-b border-slate-200 bg-white">
                <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'lookup', icon: Search, label: t('蟲害機制庫', 'MoA Library') },
                    { id: 'rotate', icon: RefreshCw, label: t('輪替助手', 'Rotation Planner') },
                    { id: 'mix', icon: Beaker, label: t('調配與混合', 'Mixing & Sequences') }
                  ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`pb-3 px-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${activeTab === tab.id ? 'text-[#114b2d] border-[#114b2d]' : 'text-slate-400 border-transparent hover:text-slate-700'}`}>
                      <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#fbfbfa]">
                {activeTab === 'lookup' && renderLookupTab()}
                {activeTab === 'rotate' && renderRotateTab()}
                {activeTab === 'mix' && renderMixTab()}
              </div>
            </main>

            {/* Right Panel - AI Assistant */}
            <section className={`${mobileView === 'assistant' ? 'flex' : 'hidden'} lg:flex w-full lg:w-[320px] xl:w-[350px] bg-[#f4f2ea] border-t lg:border-t-0 lg:border-l border-slate-300 p-4 flex-col shrink-0`}>
              <div className="flex items-center gap-2 border-b border-slate-300 pb-3 mb-3">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase">Notebook Assistant</h3>
              </div>

              <div ref={chatRef} className="flex-1 bg-white border border-slate-300 rounded-2xl p-4 overflow-y-auto space-y-4 text-xs leading-relaxed shadow-sm">
                {chatLog.map((msg, i) => (
                  <div key={i} className={`p-3 rounded-xl border ${msg.role === 'user' ? 'bg-slate-50 border-slate-200 self-end ml-10' : 'bg-emerald-50/50 border-emerald-100 mr-10'}`}>
                    <span className={`font-extrabold text-[9px] uppercase tracking-wide block mb-1.5 ${msg.role === 'user' ? 'text-slate-400' : 'text-emerald-700'}`}>
                      {msg.role === 'user' ? 'You' : 'Copilot'}
                    </span>
                    {msg.text}
                  </div>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {CHAT_PROMPTS.map((p, i) => (
                  <button key={i} onClick={() => handleChat(p.q)}
                    className="text-[10px] font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-full px-3 py-1.5 transition-colors shadow-sm">
                    {t(p.text, p.q)}
                  </button>
                ))}
              </div>

              <div className="mt-3 flex gap-2">
                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleChat(chatInput)}
                  placeholder={t("問問這個筆記指南...", "Ask about these notes...")}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#114b2d]/30 focus:outline-none shadow-sm" />
                <button onClick={() => handleChat(chatInput)}
                  className="bg-[#114b2d] hover:bg-emerald-800 text-white p-2.5 rounded-xl transition-colors shadow-sm">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </section>

          </div>

          {/* Mobile Bottom Navigation (hidden on desktop) */}
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#f4f2ea]/95 backdrop-blur border-t border-slate-300 flex items-stretch h-16 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
            {[
              { id: 'sources', icon: FileText, label: t('來源', 'Sources') },
              { id: 'workspace', icon: LayoutGrid, label: t('工作區', 'Workspace') },
              { id: 'assistant', icon: MessageSquare, label: t('助手', 'Assistant') }
            ].map(nav => (
              <button key={nav.id} onClick={() => setMobileView(nav.id)}
                className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${mobileView === nav.id ? 'text-[#114b2d]' : 'text-slate-400'}`}>
                <nav.icon className="w-5 h-5" />
                <span className="text-[10px] font-bold tracking-wide">{nav.label}</span>
                {mobileView === nav.id && <span className="absolute bottom-0 h-0.5 w-10 bg-[#114b2d] rounded-full"></span>}
              </button>
            ))}
          </nav>
        </div>
      );
    }

    // Mount the React Application
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  