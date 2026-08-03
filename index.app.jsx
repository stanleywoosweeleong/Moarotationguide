
    const { useState, useRef, useEffect, useMemo, useCallback } = React;

    // ========================================================================
    // ICONS (stand-ins for lucide-react, inline so no extra runtime needed)
    // ========================================================================
    const Icon = ({ path, className }) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} dangerouslySetInnerHTML={{__html: path}} />
    );
    const Bug = (p) => <Icon {...p} path='<path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/>' />;
    const Search = (p) => <Icon {...p} path='<circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/>' />;
    const RefreshCw = (p) => <Icon {...p} path='<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>' />;
    const Beaker = (p) => <Icon {...p} path='<path d="M4.5 3h15"/><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"/><path d="M6 14h12"/>' />;
    const Sparkles = (p) => <Icon {...p} path='<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>' />;
    const X = (p) => <Icon {...p} path='<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' />;
    const Info = (p) => <Icon {...p} path='<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>' />;
    const ChevronDown = (p) => <Icon {...p} path='<polyline points="6 9 12 15 18 9"/>' />;
    const AlertTriangle = (p) => <Icon {...p} path='<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>' />;
    const ArrowUp = (p) => <Icon {...p} path='<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>' />;
    const Layers = (p) => <Icon {...p} path='<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>' />;
    const Plus = (p) => <Icon {...p} path='<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>' />;

    // ========================================================================
    // DATABASE — derived from "Bunting A" insecticide rotation chart (Mr. Tee, 2024)
    // ========================================================================

    const PESTS = [
      { id:"leafhopper",  zh:"青蚊 (叶蝉)",   en:"Leafhoppers",            emoji:"🦟" },
      { id:"psyllid",     zh:"木虱",          en:"Psyllids",               emoji:"🪲" },
      { id:"mealybug",    zh:"粉蚧 / 介壳虫", en:"Mealybugs & Scales",     emoji:"🐞" },
      { id:"thrips",      zh:"蓟马",          en:"Thrips",                 emoji:"🪰" },
      { id:"spider_mite", zh:"红蜘蛛",        en:"Red Spider Mite",        emoji:"🕷️" },
      { id:"caterpillar", zh:"毛毛虫",        en:"Caterpillars",           emoji:"🐛" },
      { id:"grasshopper", zh:"草蜢 / 甲虫",   en:"Grasshoppers & Beetles", emoji:"🦗" }
    ];

    // Pest display priority — the order these pests trouble Malaysian farmers most
    // (matches the PESTS order above). Used to sort the pest chips on each chemical card.
    const PEST_INDEX = PESTS.reduce((m, p, i) => { m[p.id] = i; return m; }, {});
    // Colors reflect the actual pest appearance in the field.
    const PestIcon = ({ pest, className = "w-9 h-9" }) => {
      const icons = {
        // Bright lime green, wedge body, large hind jumping leg
        leafhopper: (
          <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
            <path d="M16 5 L23 11 L21 24 L11 24 L9 11 Z" fill="#84cc16" stroke="#365314" strokeWidth="0.8"/>
            <ellipse cx="16" cy="8" rx="3" ry="2.5" fill="#65a30d" stroke="#365314" strokeWidth="0.5"/>
            <circle cx="14.5" cy="8" r="0.7" fill="#0a0a0a"/>
            <circle cx="17.5" cy="8" r="0.7" fill="#0a0a0a"/>
            <line x1="14.5" y1="6" x2="12" y2="2.5" stroke="#365314" strokeWidth="0.7"/>
            <line x1="17.5" y1="6" x2="20" y2="2.5" stroke="#365314" strokeWidth="0.7"/>
            <path d="M20 16 L27 13 L26 19 L22 24" fill="none" stroke="#365314" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"/>
            <line x1="11" y1="18" x2="6" y2="22" stroke="#365314" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        ),
        // Pale tent-winged jumping insect with prominent transparent wings
        psyllid: (
          <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
            <ellipse cx="11" cy="16" rx="5" ry="9" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.7" transform="rotate(-20 11 16)"/>
            <ellipse cx="21" cy="16" rx="5" ry="9" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.7" transform="rotate(20 21 16)"/>
            <ellipse cx="16" cy="16" rx="2.5" ry="8" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.6"/>
            <circle cx="16" cy="7" r="2.2" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.5"/>
            <line x1="14.8" y1="5" x2="12.5" y2="2.5" stroke="#475569" strokeWidth="0.6"/>
            <line x1="17.2" y1="5" x2="19.5" y2="2.5" stroke="#475569" strokeWidth="0.6"/>
            <circle cx="15" cy="7" r="0.5" fill="#0a0a0a"/>
            <circle cx="17" cy="7" r="0.5" fill="#0a0a0a"/>
          </svg>
        ),
        // White waxy oval with segmentation and lateral filaments
        mealybug: (
          <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
            <ellipse cx="16" cy="16" rx="8.5" ry="6.5" fill="#fafafa" stroke="#94a3b8" strokeWidth="0.8"/>
            <path d="M11 11 Q16 13 21 11" fill="none" stroke="#cbd5e1" strokeWidth="0.6"/>
            <path d="M10 16 H22" fill="none" stroke="#cbd5e1" strokeWidth="0.6"/>
            <path d="M11 21 Q16 19 21 21" fill="none" stroke="#cbd5e1" strokeWidth="0.6"/>
            <line x1="8" y1="12" x2="4" y2="10" stroke="#cbd5e1" strokeWidth="0.7"/>
            <line x1="7.5" y1="16" x2="3" y2="16" stroke="#cbd5e1" strokeWidth="0.7"/>
            <line x1="8" y1="20" x2="4" y2="22" stroke="#cbd5e1" strokeWidth="0.7"/>
            <line x1="24" y1="12" x2="28" y2="10" stroke="#cbd5e1" strokeWidth="0.7"/>
            <line x1="24.5" y1="16" x2="29" y2="16" stroke="#cbd5e1" strokeWidth="0.7"/>
            <line x1="24" y1="20" x2="28" y2="22" stroke="#cbd5e1" strokeWidth="0.7"/>
          </svg>
        ),
        // Tiny yellow-amber elongated sliver with fringed wings
        thrips: (
          <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
            <rect x="14" y="6" width="4" height="20" rx="1.8" fill="#eab308" stroke="#854d0e" strokeWidth="0.6"/>
            <circle cx="16" cy="7" r="2.2" fill="#a16207" stroke="#854d0e" strokeWidth="0.5"/>
            <line x1="14" y1="13" x2="18" y2="13" stroke="#854d0e" strokeWidth="0.4"/>
            <line x1="14" y1="17" x2="18" y2="17" stroke="#854d0e" strokeWidth="0.4"/>
            <line x1="14" y1="21" x2="18" y2="21" stroke="#854d0e" strokeWidth="0.4"/>
            <line x1="14" y1="10" x2="9" y2="11" stroke="#854d0e" strokeWidth="0.8" strokeLinecap="round"/>
            <line x1="14" y1="14" x2="9" y2="16" stroke="#854d0e" strokeWidth="0.8" strokeLinecap="round"/>
            <line x1="14" y1="19" x2="9" y2="22" stroke="#854d0e" strokeWidth="0.8" strokeLinecap="round"/>
            <line x1="18" y1="10" x2="23" y2="11" stroke="#854d0e" strokeWidth="0.8" strokeLinecap="round"/>
            <line x1="18" y1="14" x2="23" y2="16" stroke="#854d0e" strokeWidth="0.8" strokeLinecap="round"/>
            <line x1="18" y1="19" x2="23" y2="22" stroke="#854d0e" strokeWidth="0.8" strokeLinecap="round"/>
            <line x1="15" y1="5" x2="13" y2="2.5" stroke="#854d0e" strokeWidth="0.6"/>
            <line x1="17" y1="5" x2="19" y2="2.5" stroke="#854d0e" strokeWidth="0.6"/>
          </svg>
        ),
        // Red round body with 8 spider legs (arachnid, not insect)
        spider_mite: (
          <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
            <ellipse cx="16" cy="16" rx="6" ry="5" fill="#dc2626" stroke="#7f1d1d" strokeWidth="0.7"/>
            <circle cx="13.5" cy="14.5" r="1" fill="#450a0a"/>
            <circle cx="18.5" cy="14.5" r="1" fill="#450a0a"/>
            <line x1="10.5" y1="14" x2="4" y2="10" stroke="#7f1d1d" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="10" y1="16" x2="3" y2="16" stroke="#7f1d1d" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="11" y1="19" x2="5" y2="23" stroke="#7f1d1d" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="13" y1="20.5" x2="10" y2="27" stroke="#7f1d1d" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="21.5" y1="14" x2="28" y2="10" stroke="#7f1d1d" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="22" y1="16" x2="29" y2="16" stroke="#7f1d1d" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="21" y1="19" x2="27" y2="23" stroke="#7f1d1d" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="19" y1="20.5" x2="22" y2="27" stroke="#7f1d1d" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        ),
        // Green segmented worm body
        caterpillar: (
          <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
            <circle cx="6" cy="19" r="4" fill="#22c55e" stroke="#14532d" strokeWidth="0.7"/>
            <circle cx="11.5" cy="18" r="4.3" fill="#16a34a" stroke="#14532d" strokeWidth="0.7"/>
            <circle cx="17" cy="17" r="4.3" fill="#22c55e" stroke="#14532d" strokeWidth="0.7"/>
            <circle cx="22.5" cy="16" r="4.3" fill="#16a34a" stroke="#14532d" strokeWidth="0.7"/>
            <circle cx="27.5" cy="15" r="3.5" fill="#22c55e" stroke="#14532d" strokeWidth="0.7"/>
            <circle cx="28.5" cy="13.5" r="0.8" fill="#0a0a0a"/>
            <line x1="6" y1="23" x2="6" y2="26" stroke="#14532d" strokeWidth="1.1" strokeLinecap="round"/>
            <line x1="11.5" y1="22" x2="11.5" y2="25" stroke="#14532d" strokeWidth="1.1" strokeLinecap="round"/>
            <line x1="17" y1="21" x2="17" y2="24" stroke="#14532d" strokeWidth="1.1" strokeLinecap="round"/>
            <line x1="22.5" y1="20" x2="22.5" y2="23" stroke="#14532d" strokeWidth="1.1" strokeLinecap="round"/>
          </svg>
        ),
        // Green grasshopper with distinctive bent jumping leg
        grasshopper: (
          <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
            <ellipse cx="14" cy="16" rx="9" ry="3.8" fill="#65a30d" stroke="#365314" strokeWidth="0.7" transform="rotate(-12 14 16)"/>
            <ellipse cx="6" cy="14.5" rx="3.2" ry="2.8" fill="#4d7c0f" stroke="#365314" strokeWidth="0.6"/>
            <circle cx="4.5" cy="13.5" r="0.8" fill="#0a0a0a"/>
            <line x1="5" y1="12.5" x2="2" y2="9" stroke="#365314" strokeWidth="0.7" strokeLinecap="round"/>
            <line x1="6" y1="11.5" x2="4" y2="7" stroke="#365314" strokeWidth="0.7" strokeLinecap="round"/>
            <path d="M18 15 L24 9 L26 14 L21 22" fill="#4d7c0f" stroke="#365314" strokeWidth="0.7" strokeLinejoin="round"/>
            <line x1="21" y1="22" x2="27" y2="28" stroke="#365314" strokeWidth="1.4" strokeLinecap="round"/>
            <line x1="11" y1="18" x2="9" y2="25" stroke="#365314" strokeWidth="1.1" strokeLinecap="round"/>
            <line x1="15" y1="18.5" x2="14" y2="25" stroke="#365314" strokeWidth="1.1" strokeLinecap="round"/>
            <path d="M13 14 Q17 13 21 15" fill="none" stroke="#365314" strokeWidth="0.5"/>
          </svg>
        ),
        // "All" — 2x2 grid of pest-color dots indicating "all categories"
        all: (
          <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
            <circle cx="10" cy="10" r="4" fill="#84cc16"/>
            <circle cx="22" cy="10" r="4" fill="#eab308"/>
            <circle cx="10" cy="22" r="4" fill="#dc2626"/>
            <circle cx="22" cy="22" r="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.7"/>
          </svg>
        ),
      };
      return icons[pest] || icons.all;
    };

    // IRAC group → chemical class name lookup (bilingual)
    // Covers every group present in the ACTIVES database; unknown groups fall back to the IRAC code itself.
    const GROUP_NAMES = {
      zh: {
        "1A":"氨基甲酸酯", "1B":"有机磷",
        "2A":"环二烯有机氯", "2B":"苯吡唑",
        "3A":"拟除虫菊酯",
        "4A":"新烟碱", "4C":"亚砜亚胺", "4D":"丁烯酰胺", "4E":"介离子",
        "5":"刺糖菌素", "6":"阿维菌素",
        "7B":"保幼激素类", "7C":"保幼激素类",
        "9B":"吡啶杂氮", "9D":"吡咯杂环",
        "10A":"螨生长抑制", "10B":"螨生长抑制",
        "11A":"苏云金菌",
        "12A":"ATP酶抑制", "12C":"ATP酶抑制",
        "13":"解偶联剂",
        "14":"烟碱通道",
        "15":"苯甲酰脲", "16":"几丁质",
        "18":"蜕皮激素",
        "19":"章鱼胺",
        "20D":"复合体 III",
        "21A":"METI 杀螨", "21B":"METI 杀螨",
        "22A":"钠通道阻断", "22B":"钠通道阻断",
        "23":"脂质合成",
        "25A":"复合体 II",
        "28":"双酰胺",
        "29":"弦音器", "30":"GABA 通道", "36":"新化学",
        "UN":"未明确", "UNF":"真菌制剂", "UNM":"矿物油",
      },
      en: {
        "1A":"Carbamate", "1B":"Organophosphate",
        "2A":"Cyclodiene", "2B":"Phenylpyrazole",
        "3A":"Pyrethroid",
        "4A":"Neonicotinoid", "4C":"Sulfoximine", "4D":"Butenolide", "4E":"Mesoionic",
        "5":"Spinosyn", "6":"Avermectin",
        "7B":"JH Analog", "7C":"JH Analog",
        "9B":"Pyridine az.", "9D":"Pyropene",
        "10A":"Mite Grow Inh", "10B":"Mite Grow Inh",
        "11A":"Bt",
        "12A":"ATP Synth", "12C":"ATP Synth",
        "13":"Uncoupler",
        "14":"nAChR Blkr",
        "15":"Benzoylurea", "16":"Chitin Inh",
        "18":"Ecdysone Ag",
        "19":"Octopamine",
        "20D":"Complex III",
        "21A":"METI", "21B":"METI",
        "22A":"VG-Na Blkr", "22B":"VG-Na Blkr",
        "23":"Lipid Biosyn",
        "25A":"Complex II",
        "28":"Diamide",
        "29":"Chordotonal", "30":"GABA Alloster.", "36":"New Chem",
        "UN":"Unknown", "UNF":"Fungal Agent", "UNM":"Mineral Oil",
      },
    };
    // IRAC group → mode of action description (bilingual, group-level granularity)
    // Per-chemical specifics within a group are essentially shared — IRAC classifies by MoA, after all.
    const GROUP_MOA = {
      zh: {
        "1A":"氨基甲酸酯类。可逆性抑制乙酰胆碱酯酶 (AChE),使乙酰胆碱在神经突触持续累积,引起害虫过度兴奋、麻痹与死亡。速效,持效较短。",
        "1B":"有机磷类。磷酰化 AChE 的活性丝氨酸位点,作用与 1A 类似但结合更持久,神经抑制更难恢复。",
        "2A":"环二烯有机氯。阻断 GABA-门控氯离子通道,使神经过度兴奋。多数产品因环境与人体危害严重已被禁用。",
        "2B":"苯吡唑类 (Fiprole)。阻断 GABA-门控与谷氨酸-门控氯离子通道,对昆虫的选择性远高于哺乳动物。",
        "3A":"拟除虫菊酯类。延长电压门控钠通道的开放时间,导致神经持续放电与麻痹。脂溶性高,以接触作用为主。",
        "4A":"新烟碱类。选择性激动昆虫烟碱乙酰胆碱受体 (nAChR),引起神经持续刺激。强系统性,木质部移行,可经叶面、根部或种子处理吸收。",
        "4C":"亚砜亚胺 (Sulfoxaflor)。激动 nAChR,与 4A 结合方式略有不同。强系统性,主治刺吸式害虫。",
        "4D":"丁烯酰胺 (Flupyradifurone)。激动 nAChR,化学结构独特。系统性,主治刺吸式害虫。",
        "4E":"介离子 (Triflumezopyrim)。阻断 nAChR 特定亚基组合,主要用于飞虱、稻飞虱。",
        "5":"刺糖菌素类。作用于 nAChR 别构位点,与 4A 不同;源自土壤放线菌 Saccharopolyspora spinosa 的天然代谢物。",
        "6":"阿维菌素类。激活谷氨酸-门控氯离子通道,使昆虫与螨类神经超极化、麻痹。具穿层渗透性。",
        "7B":"保幼激素类似物 (Fenoxycarb)。模仿昆虫保幼激素,扰乱发育与变态,主要影响幼虫与卵。",
        "7C":"保幼激素类似物 (Pyriproxyfen)。与 7B 同位点但化学结构不同,效力更强,广泛用于粉虱、介壳虫与蚊虫。",
        "9B":"吡啶杂氮甲烷 (Pymetrozine)。作用于刺吸式害虫弦音器 TRPV 通道,使害虫停止取食、几日内饿死。",
        "9D":"吡咯杂环 (Afidopyropen)。与 9B 同靶点不同位点。",
        "10A":"螨生长抑制剂 (Hexythiazox/Clofentezine)。抑制螨类几丁质合成酶 CHS1,若螨蜕皮失败死亡。仅对未成熟期有效,需在初期施用。",
        "10B":"螨生长抑制剂 (Etoxazole 乙螨唑)。同样抑制几丁质合成酶 CHS1、阻断蜕皮;具杀卵及幼若螨活性,对成螨效果弱。与 10A (噻螨酮/四螨嗪) 交叉抗性明显。",
        "11A":"苏云金芽孢杆菌 (Bt)。产生 Cry 蛋白晶体,在昆虫中肠碱性环境激活后,与中肠膜受体结合并打孔,导致中毒死亡。极具选择性,几乎无抗药性。",
        "12A":"ATP 酶抑制剂 (Diafenthiuron)。前体药,经害虫氧化代谢转化为活性硫脲,抑制线粒体 ATP 合成酶。",
        "12C":"ATP 酶抑制剂 (Propargite/Tetradifon)。与 12A 同机制,化学结构不同。",
        "13":"解偶联剂 (Chlorfenapyr)。前体药,经害虫代谢激活,解偶联线粒体氧化磷酸化,使 ATP 合成崩溃、能量代谢失败。",
        "14":"nAChR 通道阻断剂 (Cartap 类)。物理性阻断 nAChR 通道,与 4A 激动剂作用方式相反;源自海生环节动物毒素。",
        "15":"苯甲酰脲类。抑制几丁质合成酶 CHS1,新表皮无法形成,昆虫蜕皮时死亡。对卵与幼虫最有效,成虫不杀。",
        "16":"几丁质合成抑制剂 (Buprofezin)。机制与 15 不同,并干扰激素与产卵,专攻同翅目 (粉虱、介壳虫、飞虱)。",
        "18":"蜕皮激素受体激动剂 (Methoxyfenozide/Tebufenozide)。激动昆虫蜕皮激素受体,引发过早、不完全蜕皮致死。主要对鳞翅目。",
        "19":"章鱼胺受体激动剂 (Amitraz)。激动昆虫与螨类章鱼胺受体,扰乱神经传导。多用于螨与蜱。",
        "20D":"线粒体复合体 III 抑制剂 (Bifenazate 联苯肼酯)。作用于复合体 III 的 Qo 位点 (细胞色素 b),中断能量代谢。以触杀为主,对多种叶螨有效;与神经类杀螨剂无交叉抗性,是良好的轮替机制。",
        "21A":"线粒体复合体 I 抑制剂 (Pyridaben/Tebufenpyrad/Fenpyroximate)。METI 杀螨剂,抑制电子传递链复合体 I,中断能量代谢。",
        "21B":"线粒体复合体 I 抑制剂 (Rotenone)。与 21A 同靶点,源自鱼藤、毛鱼藤等植物根部的天然提取物。",
        "22A":"电压钠通道阻断剂 (Indoxacarb)。前体药,经害虫酯酶代谢激活,阻断电压门控钠通道 (与 3A 修饰通道方向相反)。",
        "22B":"电压钠通道阻断剂 (Metaflumizone)。与 22A 同机制,化学结构不同。",
        "23":"乙酰辅酶 A 羧化酶抑制剂 (Spirotetramat/Spirodiclofen)。抑制脂质生合成的关键酶,使害虫脂肪储备崩溃、繁殖力下降。",
        "25A":"线粒体复合体 II 抑制剂 (Cyflumetofen/Cyenopyrafen)。抑制琥珀酸脱氢酶,中断三羧酸循环与电子传递。",
        "28":"双酰胺类 (Chlorantraniliprole/Cyantraniliprole/Flubendiamide)。激活鱼尼丁受体 (RyR),使肌细胞钙库持续释放钙离子,引起肌肉收缩瘫痪、停止取食。",
        "29":"弦音器调节剂 (Flonicamid)。抑制弦音器细胞中烟酰胺合成,扰乱机械感受,使害虫定向与取食异常。",
        "30":"GABA-门控氯通道别构调节剂 (Isocycloseram/Fluxametamide)。与 2A/2B 同靶点不同位点,选择性更高、对哺乳动物更安全。",
        "36":"新化学待分类 (Dimpropyridaz, 2023+)。研究显示作用涉及弦音器调节,IRAC 完整描述待定。",
        "UN":"作用机制未明确。多为植物源 (如印楝素)、合成化合物或矿物源,经验上具杀虫活性但机制尚未确定。",
        "UNF":"真菌制剂 (Beauveria bassiana 等)。真菌孢子附着虫体角质层后萌发,菌丝穿透并在体腔内繁殖,杀死宿主。需湿润环境。",
        "UNM":"矿物油 (Petroleum/White Oil)。物理性堵塞昆虫气孔,导致窒息死亡。无化学性作用,故无抗药性问题。",
      },
      en: {
        "1A":"Carbamate. Reversibly inhibits acetylcholinesterase (AChE), causing acetylcholine to accumulate at nerve synapses → continuous firing → paralysis and death. Fast-acting, short residual.",
        "1B":"Organophosphate. Phosphorylates the active serine site of AChE — similar to 1A but binds more persistently, harder to reverse.",
        "2A":"Cyclodiene OC. Blocks GABA-gated chloride channels, causing hyperexcitation. Most products banned due to environmental/health risks.",
        "2B":"Phenylpyrazole (Fiprole). Blocks GABA-gated and glutamate-gated chloride channels; highly insect-selective vs mammals.",
        "3A":"Pyrethroid. Prolongs voltage-gated sodium channel open state, causing repetitive nerve firing and paralysis. Lipophilic, primarily contact action.",
        "4A":"Neonicotinoid. Selective agonist of insect nicotinic acetylcholine receptor (nAChR), causing continuous nerve stimulation. Strongly systemic, xylem-mobile via foliar, soil drench, or seed treatment.",
        "4C":"Sulfoximine (Sulfoxaflor). Agonist at nAChR, binding somewhat differently from 4A. Strongly systemic; mainly for sap-feeding pests.",
        "4D":"Butenolide (Flupyradifurone). Distinct chemistry that agonizes nAChR. Systemic; mainly for sap-feeding pests.",
        "4E":"Mesoionic (Triflumezopyrim). Blocks specific nAChR subunit configurations; primarily for planthoppers.",
        "5":"Spinosyn. Allosteric agonist at nAChR, distinct site from 4A. Derived from soil actinomycete Saccharopolyspora spinosa.",
        "6":"Avermectin. Activates glutamate-gated chloride channels, hyperpolarizing nerves in insects and mites. Has translaminar action.",
        "7B":"Juvenile Hormone Analog (Fenoxycarb). Mimics insect juvenile hormone, disrupting development and metamorphosis; affects larvae and eggs.",
        "7C":"Juvenile Hormone Analog (Pyriproxyfen). Similar to 7B but different chemistry; higher potency. Widely used against whiteflies, scales, and mosquitoes.",
        "9B":"Pyridine azomethine (Pymetrozine). Acts on TRPV channels in sucking-insect chordotonal organs, causing them to stop feeding and starve within days.",
        "9D":"Pyropene (Afidopyropen). Same target as 9B at a different binding pocket.",
        "10A":"Mite Growth Inhibitor (Hexythiazox/Clofentezine). Inhibits mite chitin synthase CHS1; nymphs fail to molt. Effective only on immature stages — apply early.",
        "10B":"Mite Growth Inhibitor (Etoxazole). Also inhibits chitin synthase CHS1 and blocks moulting; ovicidal and active on immature mites, weak on adults. Strongly cross-resistant with 10A (hexythiazox/clofentezine).",
        "11A":"Bacillus thuringiensis (Bt). Cry protein crystals are activated in the alkaline insect midgut, bind to membrane receptors, and form pores → systemic intoxication. Highly selective, very low resistance pressure.",
        "12A":"ATP Synthase Inhibitor (Diafenthiuron). Pro-insecticide bioactivated to a thiourea form that inhibits mitochondrial ATP synthase.",
        "12C":"ATP Synthase Inhibitor (Propargite/Tetradifon). Same mechanism as 12A, different chemistry.",
        "13":"Uncoupler (Chlorfenapyr). Pro-insecticide bioactivated by insect metabolism; uncouples mitochondrial oxidative phosphorylation → ATP collapse → energy failure.",
        "14":"nAChR Channel Blocker (Cartap, nereistoxin analogs). Physically blocks the nAChR channel — opposite action to 4A agonists. Derived from marine annelid toxin.",
        "15":"Benzoylurea. Inhibits chitin synthase CHS1, preventing new cuticle formation; insects die during molt. Most effective on eggs and larvae; adults not killed.",
        "16":"Chitin Inhibitor (Buprofezin). Different mechanism from 15; also disrupts hormones and oviposition. Specific to Homoptera (whiteflies, scales, planthoppers).",
        "18":"Ecdysone Agonist (Methoxyfenozide/Tebufenozide). Activates insect ecdysone receptor, triggering premature incomplete molt → death. Mostly used against Lepidoptera.",
        "19":"Octopamine Agonist (Amitraz). Activates octopamine receptors in insects and mites, disrupting nerve transmission. Mostly used against mites and ticks.",
        "20D":"Mitochondrial Complex III Inhibitor (Bifenazate). Acts at the Qo site of Complex III (cytochrome b), halting energy metabolism. Mainly contact; effective on several spider mites and shares no cross-resistance with neurotoxic acaricides — a useful rotation mechanism.",
        "21A":"Mitochondrial Complex I Inhibitor (Pyridaben/Tebufenpyrad/Fenpyroximate). METI acaricide that blocks electron transport chain Complex I → energy metabolism halt.",
        "21B":"Mitochondrial Complex I Inhibitor (Rotenone). Same target as 21A, derived from Derris and related plant roots.",
        "22A":"Voltage-Na Blocker (Indoxacarb). Pro-insecticide bioactivated by insect esterases; blocks voltage-gated sodium channels (opposite direction to 3A which holds them open).",
        "22B":"Voltage-Na Blocker (Metaflumizone). Same mechanism as 22A, different chemistry.",
        "23":"Acetyl-CoA Carboxylase Inhibitor (Spirotetramat/Spirodiclofen). Inhibits the key enzyme in insect lipid biosynthesis → fat reserves and fertility collapse.",
        "25A":"Mitochondrial Complex II Inhibitor (Cyflumetofen/Cyenopyrafen). Inhibits succinate dehydrogenase → TCA cycle and electron transport disruption.",
        "28":"Diamide (Chlorantraniliprole/Cyantraniliprole/Flubendiamide). Activates ryanodine receptors (RyR), causing continuous Ca²⁺ release from internal stores → muscle contraction paralysis and feeding cessation.",
        "29":"Chordotonal Modulator (Flonicamid). Inhibits NAD+ synthesis in chordotonal cells, disrupting mechanoreception → abnormal orientation and feeding.",
        "30":"GABA Allosteric Modulator (Isocycloseram/Fluxametamide). Same target as 2A/2B at a different site — higher selectivity, lower mammalian toxicity.",
        "36":"New Chemistry, classification pending (Dimpropyridaz, 2023+). Studies suggest chordotonal modulation; full IRAC descriptor pending.",
        "UN":"Mode of action unclear. Mostly plant-derived (e.g., azadirachtin), synthetic, or mineral compounds with empirically demonstrated insecticidal activity but undetermined mechanism.",
        "UNF":"Fungal Agent (Beauveria bassiana, etc.). Fungal spores adhere to the insect cuticle, germinate, penetrate via germ tubes, and proliferate inside the host → systemic mycosis. Requires humid conditions.",
        "UNM":"Mineral Oil (Petroleum/White Oil). Physically blocks insect spiracles → suffocation. No chemical action, hence no resistance issues.",
      }
    };
    // GROUP_CROSS_RESISTANCE — known cross-resistance for each IRAC group, drawn from
    // peer-reviewed literature + IRAC's core principle (cross-resistance is expected within
    // a Mode-of-Action group). The high-value cases are the sub-groups that SHARE a target
    // site (1A↔1B AChE, 2A↔2B GABA/RDL, 4A↔4C↔4D↔4E nAChR) — because rotating between them
    // is not a true mechanism change. Only groups with a documented/established relationship
    // get an entry; others show no cross-resistance section (we don't claim what isn't known).
    const GROUP_CROSS_RESISTANCE = {
      zh: {
        "1A":"与有机磷 (1B) 共享乙酰胆碱酯酶 (AChE) 靶标。不敏感 AChE 突变 (如 G119S) 可同时抗 1A 与 1B,多种害虫已有田间报告。1A↔1B 互换并非真正更换机制。",
        "1B":"与氨基甲酸酯 (1A) 共享 AChE 靶标。不敏感 AChE 突变 (如 G119S) 可同时抗 1A 与 1B。1A↔1B 互换不能有效管理抗药性。",
        "2A":"与苯吡唑 (2B,氟虫腈/乙虫腈) 共享 GABA 氯离子通道 (RDL) 靶标。环二烯选育出的 Rdl 突变 (A302S) 对氟虫腈有交叉抗性。",
        "2B":"与环二烯 (2A,硫丹) 共享 GABA/RDL 靶标;Rdl 突变 (A302S) 对二者可交叉抗性。注:30 类 (Isocycloseram) 虽同靶点但结合位点不同,与 2A/2B 无交叉抗性。",
        "3A":"所有拟除虫菊酯共享钠通道靶标;击倒抗性 (kdr) 突变对整类交叉抗性。3A 内部轮换无效。部分代谢抗性还可波及有机磷、氨基甲酸酯与新烟碱。",
        "4A":"与亚砜亚胺 (4C)、丁烯酰胺 (4D)、介离子 (4E) 同作用于 nAChR。田间新烟碱抗性多为代谢型,故 4C/4D/4E 常仍有效;但若为靶标突变型抗性,可能交叉抗性。",
        "4C":"与新烟碱 (4A) 共享 nAChR 靶标。因田间新烟碱抗性多为代谢型,对新烟碱抗性害虫常仍有效;但同靶标,不宜视为真正更换机制。",
        "4D":"与新烟碱 (4A) 共享 nAChR 靶标。对代谢型新烟碱抗性害虫常仍有效;但同靶标,靶标突变时可能交叉抗性。",
        "4E":"作用于 nAChR,但文献报告与新烟碱基本无靶标交叉抗性,常可控制新烟碱抗性害虫。",
        "5":"多杀霉素 (Spinosad) 与乙基多杀菌素 (Spinetoram) 机制相同,相互交叉抗性明显 (小菜蛾、蓟马已有报告)。两者之间轮换无效。",
        "6":"阿维菌素与甲维盐共享谷氨酸氯通道靶标,相互交叉抗性明显。两者之间轮换无效。",
        "7B":"与 7C (Pyriproxyfen) 同为保幼激素类似物,共享靶标,可能相互交叉抗性。",
        "7C":"与 7B (Fenoxycarb) 同靶标 (保幼激素),可能相互交叉抗性。",
        "9B":"与吡咯杂环 (9D,Afidopyropen) 同靶标 (弦音器 TRPV) 但结合位点不同,交叉抗性通常较低。",
        "9D":"与 9B (Pymetrozine) 同靶标不同位点,设计上交叉抗性较低。",
        "10A":"与 10B (乙螨唑) 同抑制几丁质合成酶 CHS1;CHS1 突变 (I1017F) 对噻螨酮、四螨嗪与乙螨唑同时高度抗性。三者属同一交叉抗性组,轮换无效。",
        "10B":"与 10A (噻螨酮/四螨嗪) 同抑制几丁质合成酶 CHS1;CHS1 突变 (I1017F) 对乙螨唑、噻螨酮、四螨嗪同时高度抗性。三者属同一交叉抗性组,轮换无效。",
        "12A":"与 12C 同为线粒体 ATP 合成酶抑制剂,共享靶标,可能相互交叉抗性。",
        "12C":"与 12A (Diafenthiuron) 同靶标,可能相互交叉抗性。",
        "15":"所有苯甲酰脲 (除虫脲/氟铃脲/虱螨脲/六伏隆) 同抑制几丁质合成酶,相互交叉抗性明显。15 类内部轮换无效。",
        "18":"蜕皮激素受体激动剂 (灭幼脲/甲氧虫酰肼) 同靶标,相互交叉抗性明显 (小菜蛾、夜蛾已有报告)。内部轮换无效。",
        "20D":"作用于线粒体复合体 III 的 Qo 位点 (细胞色素 b)。部分联苯肼酯抗性突变可对灭螨醌 (Acequinocyl, 20B) 交叉抗性;与神经类杀螨剂无交叉抗性,是良好的轮替机制。",
        "21A":"所有 METI-I 类 (哒螨灵/唑螨酯/唑虫酰胺) 同抑制线粒体复合体 I,相互交叉抗性明显 (叶螨已有报告);与 21B (鱼藤酮) 同靶标。内部轮换无效。",
        "21B":"鱼藤酮与 21A 同抑制线粒体复合体 I,可能交叉抗性。",
        "22A":"茚虫威 (22A) 与氰氟虫腙 (22B) 同阻断电压钠通道 (与 3A 方向相反),共享靶标,部分害虫已有相互交叉抗性报告。",
        "22B":"氰氟虫腙 (22B) 与茚虫威 (22A) 同靶标,可能相互交叉抗性。",
        "23":"螺虫乙酯与螺螨酯同抑制乙酰辅酶 A 羧化酶,共享靶标,可能相互交叉抗性。",
        "28":"氯虫苯甲酰胺、溴氰虫酰胺、氟苯虫酰胺等双酰胺共享鱼尼丁受体 (RyR) 靶标。RyR 突变 (如 I4790K) 对所有双酰胺产生高度交叉抗性 (小菜蛾抗性可达数千至数十万倍)。双酰胺之间轮换几乎无效。",
        "30":"虽与 2A/2B 同作用于 RDL,但结合位点不同;文献显示对环二烯/氟虫腈的 Rdl 突变无交叉抗性,可作为 GABA 靶标害虫的轮替选择。",
      },
      en: {
        "1A":"Shares the acetylcholinesterase (AChE) target with organophosphates (1B). Insensitive-AChE mutations (e.g. G119S) confer resistance to both 1A and 1B — documented in many field pests. Rotating 1A↔1B is not a true mechanism change.",
        "1B":"Shares the AChE target with carbamates (1A). Insensitive-AChE mutations (e.g. G119S) confer resistance to both. Rotating 1A↔1B does not manage resistance.",
        "2A":"Shares the GABA-gated chloride channel (RDL) target with phenylpyrazoles (2B, fipronil/ethiprole). The cyclodiene-selected Rdl mutation (A302S) gives cross-resistance to fipronil.",
        "2B":"Shares the GABA/RDL target with cyclodienes (2A, endosulfan); the Rdl A302S mutation can cross-resist both. Note: Group 30 (isocycloseram) hits the same channel at a different site and is NOT cross-resistant with 2A/2B.",
        "3A":"All pyrethroids share the sodium-channel target; knockdown-resistance (kdr) mutations cross-resist the whole class — rotating within 3A is futile. Metabolic resistance can also extend to OPs, carbamates and neonicotinoids.",
        "4A":"Shares the nAChR target with sulfoximine (4C), butenolide (4D) and mesoionic (4E). Field neonicotinoid resistance is mostly metabolic, so 4C/4D/4E often still work — but where resistance is target-site, cross-resistance can occur.",
        "4C":"Shares the nAChR target with neonicotinoids (4A). Usually still effective against neonic-resistant pests (their resistance is mostly metabolic) — but same target, so not a true mechanism rotation.",
        "4D":"Shares the nAChR target with neonicotinoids (4A). Often still controls metabolically neonic-resistant pests, but target-site resistance can cross over.",
        "4E":"Acts on nAChR, but literature reports little to no target-site cross-resistance with neonicotinoids — often controls neonic-resistant pests.",
        "5":"Spinosad and spinetoram share a mechanism and show clear mutual cross-resistance (documented in diamondback moth, thrips). Rotating between the two does not help.",
        "6":"Abamectin and emamectin benzoate share the glutamate-gated chloride channel target with clear mutual cross-resistance. Rotating between the two does not help.",
        "7B":"Shares the juvenile-hormone target with 7C (pyriproxyfen); mutual cross-resistance possible.",
        "7C":"Shares the juvenile-hormone target with 7B (fenoxycarb); mutual cross-resistance possible.",
        "9B":"Shares the chordotonal TRPV target with pyropene (9D, afidopyropen) at a different binding site; cross-resistance is usually low.",
        "9D":"Same target as 9B (pymetrozine) at a different site; designed for low cross-resistance.",
        "10A":"Shares the CHS1 chitin-synthase target with 10B (etoxazole); the CHS1 mutation (I1017F) cross-resists hexythiazox, clofentezine and etoxazole. They are one cross-resistance group — rotating among them is futile.",
        "10B":"Shares the CHS1 chitin-synthase target with 10A (hexythiazox/clofentezine); the CHS1 mutation (I1017F) confers high cross-resistance to etoxazole, hexythiazox and clofentezine. Rotating among them is futile.",
        "12A":"Shares the mitochondrial ATP-synthase target with 12C; mutual cross-resistance possible.",
        "12C":"Shares the target with 12A (diafenthiuron); mutual cross-resistance possible.",
        "15":"All benzoylureas (diflubenzuron/novaluron/lufenuron/hexaflumuron) inhibit chitin synthase and show clear mutual cross-resistance. Rotating within Group 15 is futile.",
        "18":"Ecdysone-receptor agonists (chromafenozide/methoxyfenozide) share the target with clear mutual cross-resistance (documented in diamondback moth, armyworm). Rotating within the group is futile.",
        "20D":"Acts on the Qo site of mitochondrial Complex III (cytochrome b). Some bifenazate resistance mutations can cross-resist acequinocyl (20B); no cross-resistance with neurotoxic acaricides — a useful rotation mechanism.",
        "21A":"All METI-I compounds (pyridaben/fenpyroximate/tolfenpyrad) inhibit mitochondrial Complex I with clear mutual cross-resistance (documented in spider mites); same target as 21B (rotenone). Rotating within the group is futile.",
        "21B":"Rotenone inhibits Complex I like 21A; cross-resistance possible.",
        "22A":"Indoxacarb (22A) and metaflumizone (22B) both block the voltage-gated sodium channel (opposite direction to 3A); they share the target and mutual cross-resistance has been reported in some pests.",
        "22B":"Shares the sodium-channel target with indoxacarb (22A); mutual cross-resistance possible.",
        "23":"Spirotetramat and spirodiclofen both inhibit acetyl-CoA carboxylase; shared target, mutual cross-resistance possible.",
        "28":"Chlorantraniliprole, cyantraniliprole and flubendiamide share the ryanodine-receptor (RyR) target. The RyR mutation (e.g. I4790K) cross-resists ALL diamides (resistance up to thousands–hundreds of thousands-fold in diamondback moth). Rotating among diamides is essentially futile.",
        "30":"Hits the same RDL channel as 2A/2B but at a different site; literature shows no cross-resistance to the cyclodiene/fipronil Rdl mutation — a usable rotation choice against GABA-target pests.",
      }
    };
    // Map IRAC group → site of action by looking at any active in that group (always consistent per our audit).
    const groupSite = (g, actives) => actives.find(a => a.g === g)?.s || 'unknown';
    // Cross-resistant sub-group clusters: different IRAC codes that SHARE a target site, so
    // "rotating" between them is not a true mechanism change. Verified from peer-reviewed
    // literature. kind: 'shared' = cross-resistance likely; 'partial' = shares target but
    // field resistance is usually metabolic so it often still works (the Group 4 nAChR family).
    // (9B↔9D omitted on purpose: afidopyropen was designed to defeat pymetrozine resistance,
    //  so that rotation is genuinely useful and shouldn't be discouraged.)
    const CROSS_RESISTANCE_CLUSTERS = [
      { groups: ['1A','1B'],            kind: 'shared'  }, // acetylcholinesterase (AChE)
      { groups: ['2A','2B'],            kind: 'shared'  }, // GABA-gated chloride channel (RDL)
      { groups: ['4A','4C','4D','4E'],  kind: 'partial' }, // nicotinic ACh receptor (nAChR)
      { groups: ['7B','7C'],            kind: 'shared'  }, // juvenile hormone receptor
      { groups: ['10A','10B'],          kind: 'shared'  }, // mite growth inhibitors — CHS1 (I1017F)
      { groups: ['12A','12C'],          kind: 'shared'  }, // mitochondrial ATP synthase
      { groups: ['21A','21B'],          kind: 'shared'  }, // mitochondrial Complex I
      { groups: ['22A','22B'],          kind: 'shared'  }, // voltage-gated Na channel (blocker)
    ];
    // Robust external-link opener. In-app browsers (WhatsApp, file previews) silently
    // ignore target="_blank", so taps do nothing. This tries a new tab, then falls back
    // to same-window navigation when that's blocked.
    const openExternal = (e, url) => {
      if (e) { e.stopPropagation(); e.preventDefault(); }
      try {
        const w = window.open(url, '_blank', 'noopener,noreferrer');
        if (!w) window.location.href = url;
      } catch (_) {
        window.location.href = url;
      }
    };
    // Common Malaysian crops — used to refine GB 2763-2026 MRL search query.
    const COMMON_CROPS = [
      { value: 'durian',  zh: '榴莲', en: 'Durian' },
      { value: 'citrus',  zh: '柑橘', en: 'Citrus' },
      { value: 'mango',   zh: '芒果', en: 'Mango' },
      { value: 'banana',  zh: '香蕉', en: 'Banana' },
      { value: 'papaya',  zh: '木瓜', en: 'Papaya' },
      { value: 'tomato',  zh: '番茄', en: 'Tomato' },
      { value: 'chili',   zh: '辣椒', en: 'Chili' },
    ];
    // Chemical → GB 2763-2026 pesticide ID on the FoodMate portal (2763.foodmate.net).
    // Lets us link DIRECTLY to a chemical's full MRL-by-crop table (one tap to data),
    // instead of dumping the farmer on a search-results page. Verified against the
    // official FoodMate index (612 entries) on 2026-05-29.
    // Chemicals NOT listed here have no usable MRL page — biologicals/mineral oils that
    // are MRL-EXEMPT (Bt, Beauveria, White Oil) or actives too new for GB 2763-2026
    // (Dimpropyridaz, Isocycloseram, Formetanate) — these fall back to a search link.
    const CHEM_FOODMATE_ID = {
      "Abamectin": 12, "Acephate": 515, "Acetamiprid": 116, "Afidopyropen": 420,
      "Amitraz": 425, "Azadirachtin": 539, "Bifenthrin": 277, "Buprofezin": 380,
      "Carbaryl": 244, "Carbosulfan": 111, "Cartap hydrochloride": 411,
      "Chlorantraniliprole": 302, "Chlorfenapyr": 75, 
      "Chromafenozide": 213, "Clothianidin": 370, "Cyantraniliprole": 487,
      "Cyflumetofen": 110, "Cypermethrin": 312, "Deltamethrin": 488,
      "Diafenthiuron": 112, "Diflubenzuron": 79, "Dimethoate": 272,
      "Dinotefuran": 152, "Emamectin benzoate": 226, 
      "Esfenvalerate": 362, "Ethiprole": 504, "Etofenprox": 330, "Fenitrothion": 412,
      "Fenobucarb": 550, "Fenoxycarb": 43, "Fenpyroximate": 556, "Fenthion": 24,
      "Fipronil": 167, "Flonicamid": 173, "Flubendiamide": 158, "Flupyradifurone": 161,
      "Hexaflumuron": 181, "Hexythiazox": 378, "Imidacloprid": 48, "Indoxacarb": 541,
      "Isoprocarb": 526, "Lambda-cyhalothrin": 307, "Lufenuron": 418, "Malathion": 320,
      "Metaflumizone": 360, 
      "Methoxyfenozide": 250, "Novaluron": 194, "Propargite": 366, "Pymetrozine": 53,
      "Pyridaben": 81, "Pyridalyl": 388, "Pyriproxyfen": 46, "Rotenone": 545,
      "Spinetoram": 505, "Spinosad": 131, "Spirodiclofen": 293, "Spirotetramat": 290,
      "Sulfoxaflor": 172, "Thiamethoxam": 372, "Tolfenpyrad": 553,
      "Triflumezopyrim": 387,
    };
    // Chemical → official GB 2763-2026 Chinese name (from the FoodMate index).
    // Displayed as "English 中文" so Chinese-speaking farmers recognise the product.
    // Dimpropyridaz & Isocycloseram are omitted — too new for a standardised Chinese
    // name; they show English only rather than an invented translation.
    const CHEM_ZH = {
      "Abamectin": "阿维菌素", "Acephate": "乙酰甲胺磷", "Acetamiprid": "啶虫脒",
      "Afidopyropen": "双丙环虫酯", "Amitraz": "双甲脒", "Azadirachtin": "印楝素",
      "Bacillus thuringiensis": "苏云金杆菌", "Beauveria bassiana": "球孢白僵菌",
      "Bifenazate": "联苯肼酯", "Bifenthrin": "联苯菊酯", "Buprofezin": "噻嗪酮", "Carbaryl": "甲萘威",
      "Carbosulfan": "丁硫克百威", "Cartap hydrochloride": "杀螟丹",
      "Chlorantraniliprole": "氯虫苯甲酰胺", "Chlorfenapyr": "虫螨腈",
      "Chromafenozide": "环虫酰肼", "Clothianidin": "噻虫胺",
      "Cyantraniliprole": "溴氰虫酰胺", "Cyflumetofen": "丁氟螨酯",
      "Cypermethrin": "氯氰菊酯", "Deltamethrin": "溴氰菊酯", "Diafenthiuron": "丁醚脲",
      "Diflubenzuron": "除虫脲", "Dimethoate": "乐果",
      "Dinotefuran": "呋虫胺", "Emamectin benzoate": "甲氨基阿维菌素苯甲酸盐",
      "Esfenvalerate": "S-氰戊菊酯", "Ethiprole": "乙虫腈",
      "Etofenprox": "醚菊酯", "Etoxazole": "乙螨唑", "Fenitrothion": "杀螟硫磷", "Fenobucarb": "仲丁威",
      "Fenoxycarb": "苯氧威", "Fenpyroximate": "唑螨酯", "Fenthion": "倍硫磷",
      "Fipronil": "氟虫腈", "Flonicamid": "氟啶虫酰胺", "Flubendiamide": "氟苯虫酰胺",
      "Flupyradifurone": "氟吡呋喃酮", "Formetanate hydrochloride": "伐虫脒盐酸盐",
      "Hexaflumuron": "氟铃脲", "Hexythiazox": "噻螨酮", "Imidacloprid": "吡虫啉",
      "Indoxacarb": "茚虫威", "Isoprocarb": "异丙威",
      "Lambda-cyhalothrin": "高效氯氟氰菊酯", "Lufenuron": "虱螨脲",
      "Malathion": "马拉硫磷", "Metaflumizone": "氰氟虫腙", 
      "Methoxyfenozide": "甲氧虫酰肼", "Novaluron": "氟酰脲",
      "Propargite": "炔螨特", "Pymetrozine": "吡蚜酮", "Pyridaben": "哒螨灵",
      "Pyridalyl": "三氟甲吡醚", "Pyriproxyfen": "吡丙醚", "Rotenone": "鱼藤酮",
      "Spinetoram": "乙基多杀菌素", "Spinosad": "多杀霉素", "Spirodiclofen": "螺螨酯",
      "Spirotetramat": "螺虫乙酯", "Sulfoxaflor": "氟啶虫胺腈", "Thiamethoxam": "噻虫嗪",
      "Tolfenpyrad": "唑虫酰胺", "Triflumezopyrim": "三氟苯嘧啶", "White Oil": "矿物油",
    };
    // ── WHO hazard classification (acute toxicity to humans) ──────────────────
    // WHO Recommended Classification of Pesticides by Hazard: Ia extremely >
    // Ib highly > II moderately > III slightly > U unlikely. NL = not in the WHO
    // list (newer chemistries / biologicals / mineral oils).
    // Verified this session against WHO/INCHEM/JMPR/PPDB-aligned sources for the
    // high-hazard set and the classics; the rest follow established WHO classes.
    // This is the TECHNICAL active's hazard — always confirm the signal word on
    // the actual product label, since a diluted formulation can sit lower.
    const TOX_WHO = {
      "Abamectin":"Ib","Acephate":"III","Acetamiprid":"II","Afidopyropen":"NL",
      "Amitraz":"II","Azadirachtin":"NL","Bacillus thuringiensis":"NL","Beauveria bassiana":"NL",
      "Bifenazate":"U","Bifenthrin":"II","Buprofezin":"U","Carbaryl":"II","Carbosulfan":"II",
      "Cartap hydrochloride":"II","Chlorantraniliprole":"U","Chlorfenapyr":"II",
      "Chromafenozide":"U","Clothianidin":"U","Cyantraniliprole":"U","Cyflumetofen":"III",
      "Cypermethrin":"II","Deltamethrin":"II","Diafenthiuron":"III",
      "Diflubenzuron":"U","Dimethoate":"II","Dimpropyridaz":"NL","Dinotefuran":"III",
      "Emamectin benzoate":"II","Esfenvalerate":"II","Ethiprole":"U",
      "Etofenprox":"U","Etoxazole":"U","Fenitrothion":"II","Fenobucarb":"II","Fenoxycarb":"U",
      "Fenpyroximate":"II","Fenthion":"II","Fipronil":"II","Flonicamid":"III",
      "Flubendiamide":"U","Flupyradifurone":"III","Formetanate hydrochloride":"Ib",
      "Hexaflumuron":"U","Hexythiazox":"U","Imidacloprid":"II","Indoxacarb":"II",
      "Isocycloseram":"NL","Isoprocarb":"II","Lambda-cyhalothrin":"II","Lufenuron":"U",
      "Malathion":"III","Metaflumizone":"U",
      "Methoxyfenozide":"U","Novaluron":"U","Propargite":"III","Pymetrozine":"U",
      "Pyridaben":"II","Pyridalyl":"U","Pyriproxyfen":"U","Rotenone":"II",
      "Spinetoram":"U","Spinosad":"U","Spirodiclofen":"U","Spirotetramat":"U",
      "Sulfoxaflor":"II","Thiamethoxam":"III","Tolfenpyrad":"NL","Triflumezopyrim":"NL",
      "White Oil":"NL",
    };
    // Colour ramp: red (Ia/Ib) → orange (II) → yellow (III) → green (U) → grey (NL)
    const TOX_STYLE = {
      "Ia":"bg-rose-100 text-rose-800 border-rose-600",
      "Ib":"bg-rose-100 text-rose-800 border-rose-600",
      "II":"bg-orange-100 text-orange-800 border-orange-500",
      "III":"bg-yellow-100 text-yellow-800 border-yellow-500",
      "U":"bg-emerald-100 text-emerald-800 border-emerald-600",
      "NL":"bg-slate-100 text-slate-600 border-slate-400",
    };
    const TOX_LABEL = {
      zh:{Ia:"极高毒",Ib:"高毒",II:"中等毒",III:"低毒",U:"微毒",NL:"未分级"},
      en:{Ia:"Extremely haz.",Ib:"Highly haz.",II:"Moderately haz.",III:"Slightly haz.",U:"Unlikely haz.",NL:"Not WHO-listed"},
    };
    // Severity rank for sorting (higher = more toxic). NL treated as low-concern
    // (the unlisted set is biologicals / botanicals / mineral oil / low-tox newer
    // chemistries), so it is not pushed down unfairly.
    const TOX_SEVERITY = { Ia:4, Ib:3, II:2, III:1, U:0, NL:0 };
    const toxSev = (n) => TOX_SEVERITY[TOX_WHO[n] || 'NL'] ?? 0;

    // ── Weather & spray-timing effects ───────────────────────────────────────
    // QUALITATIVE ONLY — deliberately no half-life figures. Field half-lives
    // swing wildly with formulation, adjuvant, canopy and weather, and we have
    // no way of knowing when a grower actually sprays; a specific number would
    // be false precision. Each tag below is verified from published research:
    //   'sun'  — deposit destroyed quickly by sunlight/UV
    //            Abamectin: photolysis half-life ~21 h on surfaces (US EPA);
    //            >90% typically lost to photo-instability (ScienceDirect).
    //   'bio'  — living organism, inactivated by UV within minutes-hours
    //            B. bassiana: >95% of conidia dead after 15 min UV-B (J.Invert.
    //            Pathol.); "not adapted to tolerate direct sunlight" (Pest Manag
    //            Sci 2019). Bt requires UV protection to persist (Morris 1983).
    //   'cool' — negative temperature coefficient: LESS effective when hot
    //            Lambda-cyhalothrin & bifenthrin: toxicity fell 9.5x and 13.6x
    //            from 24->35C (Ostrinia nubilalis); cypermethrin & deltamethrin
    //            negative coefficients (Musca domestica); spinosad -3.8x,
    //            spinetoram -3.89x (Spodoptera frugiperda).
    //   'warm' — positive temperature coefficient: MORE effective when hot
    //            Chlorfenapyr, indoxacarb, imidacloprid, fipronil sensitivity
    //            rose markedly from 24->32C (Reticulitermes flaviceps);
    //            acetamiprid +2.0x, chlorpyrifos +1.79x, emamectin +1.83x.
    const ENV_TAGS = {
      "Abamectin": ["sun"], "Emamectin benzoate": ["sun", "warm"],
      "Bacillus thuringiensis": ["bio"], "Beauveria bassiana": ["bio"],
      "Bifenthrin": ["cool"], "Cypermethrin": ["cool"], "Deltamethrin": ["cool"],
      "Lambda-cyhalothrin": ["cool"], "Esfenvalerate": ["cool"],
      "Spinosad": ["sun", "cool"], "Spinetoram": ["sun", "cool"],
      "Chlorfenapyr": ["warm"], "Indoxacarb": ["warm"],
      "Imidacloprid": ["warm"], "Fipronil": ["warm"], "Acetamiprid": ["warm"],
    };
    const ENV_LABEL = {
      sun:  { zh: "强光下分解快 — 建议傍晚或清晨施药,让药液有整夜时间发挥",
              en: "Breaks down fast in strong sunlight — spray late afternoon or early morning so the deposit gets a full night" },
      bio:  { zh: "活体微生物,阳光紫外线会在短时间内杀死它 — 务必傍晚施药,湿度高时效果最好",
              en: "A living organism — UV kills it quickly. Spray late in the day; works best in humid conditions" },
      cool: { zh: "高温时药效反而下降(负温度系数) — 炎热午后施药效果较差",
              en: "Less effective in high heat (negative temperature coefficient) — a hot afternoon spray works poorly" },
      warm: { zh: "高温时药效较佳(正温度系数)",
              en: "Works better in warm conditions (positive temperature coefficient)" },
    };
    // ── Bee / pollinator toxicity ────────────────────────────────────────────
    // Categories follow the standard EPA/extension bands for adult honeybee
    // acute CONTACT LD50: high <2 ug/bee, moderate 2-10.99, low >11.
    // Verified values behind each entry:
    //   high: fipronil 0.007, bifenthrin 0.015, imidacloprid 0.018-0.029,
    //     clothianidin 0.022, thiamethoxam 0.024-0.03, dinotefuran 0.075,
    //     esfenvalerate 0.019, indoxacarb 0.0018 (all ug/bee); "all synthetic
    //     pyrethroids except tau-fluvalinate", plus carbaryl and pyridaben,
    //     have topical LD50 <=1 ug/bee (Sanchez-Bayo & Goka 2014).
    //     Emamectin is 133x more toxic topically than abamectin (Zhu 2018),
    //     and abamectin is flagged an ecotoxicological risk to bees (EFSA).
    //   wet: spinosad/spinetoram are acutely toxic to bees while the spray is
    //     WET, but residues dried ~3 h are not acutely harmful (Mayes 2003);
    //     US EPA treats spinosad as reduced-risk on that basis.
    //   mod: acetamiprid 7.1 ug/bee (Iwasa 2004), bifenazate 8.5 (PPDB).
    //   low: chlorantraniliprole 107 ug/bee, etoxazole >200 (PPDB),
    //     B. thuringiensis LD50 >100 ug/bee.
    const BEE_TAGS = {
      "Bifenthrin": "high", "Cypermethrin": "high", "Deltamethrin": "high",
      "Lambda-cyhalothrin": "high", "Esfenvalerate": "high",
      "Imidacloprid": "high", "Thiamethoxam": "high", "Clothianidin": "high",
      "Dinotefuran": "high", "Fipronil": "high", "Indoxacarb": "high",
      "Carbaryl": "high", "Pyridaben": "high",
      "Abamectin": "high", "Emamectin benzoate": "high",
      "Diafenthiuron": "high",
      "Spinosad": "wet", "Spinetoram": "wet",
      "Acetamiprid": "mod", "Bifenazate": "mod",
      "Chlorantraniliprole": "low", "Etoxazole": "low",
      "Bacillus thuringiensis": "low",
      // Added 2026-08-03 — these four were absent while PPDB rated them HIGH for
      // acute bee toxicity. Each is taken from the record's own ecotoxicity
      // alert, not inferred from the HHP flag alone:
      //   Malathion        contact LD50 0.16, oral 0.40 ug/bee  (both High)
      //   Triflumezopyrim  contact High, oral High; HHP R10 (<= 2 ug/bee)
      //   Isocycloseram    contact High, oral High; HHP R10
      //   Rotenone         contact High (BPDB record)
      // NOTE on Triflumezopyrim: some agronomic literature markets it as
      // pollinator-safe in rice. That refers to field exposure patterns, not
      // acute toxicity — PPDB's own numbers put it well under the R10 threshold.
      // Tagged on the hazard, consistent with every other entry here.
      "Malathion": "high", "Triflumezopyrim": "high",
      "Isocycloseram": "high", "Rotenone": "high",
    };
    const BEE_LABEL = {
      high: { zh: "对蜜蜂剧毒 — 开花期请勿施用",
              en: "Highly toxic to bees — do not spray during flowering" },
      wet:  { zh: "药液未干时对蜜蜂剧毒;干透后(约 3 小时)残留基本无急性危害",
              en: "Acutely toxic to bees while the spray is wet; dried residues (~3 h) are not acutely harmful" },
      mod:  { zh: "对蜜蜂中等毒 — 开花期避免施用",
              en: "Moderately toxic to bees — avoid spraying during flowering" },
      low:  { zh: "对蜜蜂低毒",
              en: "Low toxicity to bees" },
    };
    const BEE_STYLE = {
      high: "bg-rose-100 text-rose-900 border-rose-300",
      wet:  "bg-amber-100 text-amber-900 border-amber-300",
      mod:  "bg-yellow-100 text-yellow-900 border-yellow-300",
      low:  "bg-emerald-100 text-emerald-900 border-emerald-300",
    };
    // ── Effect on predatory mites / natural enemies ──────────────────────────
    // Matters for IPM: wiping out phytoseiid predators is a common cause of
    // spider-mite flare-ups AFTER spraying for something else.
    //   'harmful' — consistently harmful across studies. Cypermethrin,
    //     deltamethrin, dimethoate and chlorpyrifos were highly harmful to both
    //     eggs and adults of Phytoseiulus longipes, residues still harmful after
    //     31 days (Savi 2024). Imidacloprid, lambda-cyhalothrin and
    //     fenpyroximate were highly toxic to A. swirskii, A. andersoni and
    //     P. persimilis (Plant Protection Sci.). Pyridaben harmed T. pyri in
    //     orchard trials (Hardman 2003). Bifenthrin/esfenvalerate included on
    //     the well-established pyrethroid class effect.
    //   'soft' — bifenazate, chlorfenapyr and flufenoxuron did not
    //     substantially reduce P. persimilis survival, fecundity or prey
    //     consumption (BioControl); cyflumetofen innocuous, IOBC class 1
    //     (Frontiers 2023); azadirachtin harmless to N. barkeri (Exp Appl Acarol).
    //   'mixed' — evidence genuinely conflicts and we do not pick a side:
    //     abamectin, hexythiazox and spinosad were rated SAFE to three
    //     phytoseiid species in one trial, while other work reports abamectin
    //     moderately-to-highly harmful and hexythiazox among the most harmful.
    //     Outcome varies with predator species, dose and residue age.
    const BENEFICIAL_TAGS = {
      "Cypermethrin": "harmful", "Deltamethrin": "harmful",
      "Lambda-cyhalothrin": "harmful", "Bifenthrin": "harmful",
      "Esfenvalerate": "harmful", "Imidacloprid": "harmful",
      "Fenpyroximate": "harmful", "Pyridaben": "harmful",
      "Bifenazate": "soft", "Chlorfenapyr": "soft",
      "Cyflumetofen": "soft", "Azadirachtin": "soft",
      "Diafenthiuron": "soft",
      "Abamectin": "mixed", "Hexythiazox": "mixed", "Spinosad": "mixed",
    };
    const BENEFICIAL_LABEL = {
      harmful: { zh: "对捕食螨等天敌有害 — 施用后红蜘蛛容易反弹",
                 en: "Harmful to predatory mites and other natural enemies — spider mites often rebound after use" },
      soft:    { zh: "对捕食螨相对温和,适合与生物防治并用",
                 en: "Relatively soft on predatory mites — fits alongside biological control" },
      mixed:   { zh: "各研究结果不一致:部分试验判定安全,另有报告为中至高度有害。视捕食螨种类、剂量与残留时间而定",
                 en: "Studies disagree: some trials rate it safe, others moderately to highly harmful. Depends on predator species, dose and residue age" },
    };
    const BENEFICIAL_STYLE = {
      harmful: "bg-rose-100 text-rose-900 border-rose-300",
      soft:    "bg-emerald-100 text-emerald-900 border-emerald-300",
      mixed:   "bg-slate-100 text-slate-700 border-slate-300",
    };
    // ── Compatibility with entomopathogenic fungi (Beauveria/Metarhizium) ────
    // Matters when tank-mixing or alternating with a Beauveria product.
    // NOTE: these are IN VITRO results (conidial germination, vegetative growth,
    // sporulation on treated media) — a laboratory proxy, not a field guarantee.
    //   'ok'  — spinosad compatible at all three tested concentrations;
    //     abamectin, imidacloprid and deltamethrin compatible at half and mean
    //     field dose (Bugti/Depieri in-vitro studies). Fipronil,
    //     chlorantraniliprole and acetamiprid compatible at the recommended
    //     dose (Hirapara 2023).
    //   'bad' — indoxacarb rated highly toxic to B. bassiana growth (poisoned-
    //     food assay, cotton IPM screen).
    // Deliberately untagged where evidence conflicts (e.g. dimethoate: rated
    // compatible at label dose in one study, while organophosphates as a class
    // drastically inhibited germination in another).
    const FUNGUS_TAGS = {
      "Spinosad": "ok", "Abamectin": "ok", "Imidacloprid": "ok",
      "Deltamethrin": "ok", "Fipronil": "ok",
      "Chlorantraniliprole": "ok", "Acetamiprid": "ok",
      "Indoxacarb": "bad",
    };
    const FUNGUS_LABEL = {
      ok:  { zh: "室内试验显示与白僵菌等虫生真菌相容性较佳(依推荐剂量)",
             en: "In-vitro tests show good compatibility with Beauveria-type fungi at label rate" },
      bad: { zh: "室内试验显示会强烈抑制白僵菌生长 — 不宜与之混用",
             en: "In-vitro tests show strong inhibition of Beauveria growth — do not tank-mix" },
    };
    const FUNGUS_STYLE = {
      ok:  "bg-emerald-100 text-emerald-900 border-emerald-300",
      bad: "bg-rose-100 text-rose-900 border-rose-300",
    };
    const ENV_STYLE = {
      sun:  "bg-amber-100 text-amber-900 border-amber-300",
      bio:  "bg-amber-100 text-amber-900 border-amber-300",
      cool: "bg-sky-100 text-sky-900 border-sky-300",
      warm: "bg-emerald-100 text-emerald-900 border-emerald-300",
    };
    // ── Malaysia bans ────────────────────────────────────────────────────────
    // Sources: MY Pesticides Board banned/restricted list, the 2025–2030 HHP
    // phase-out, and the Stockholm Convention (POPs).
    // NOTE 2026-08-03: an earlier header here said these actives "stay visible in
    // the Library with a clear warning". That was the OLD policy and is no longer
    // true — it was removed to stop it contradicting the current policy below.
    // POLICY: actives banned (or banned for farm use) in Malaysia are REMOVED
    // from the database entirely — this app is a spraying aid, so listing them
    // at all risks a grower reaching for one. Removed 2026-08-03:
    //   Endosulfan, Dicofol, Methamidophos, Methomyl (banned),
    //   Chlorpyrifos (farm use banned in MY since 2023; non-agricultural use
    //   only, which is outside this app's scope).
    // This map is intentionally kept but empty: if a new ban lands, adding one
    // line here re-activates the red banner AND excludes it from rotation
    // suggestions, as defence-in-depth until the rows themselves are deleted.
    const BANNED_MY = {
    };
    const isBanned = (n) => !!BANNED_MY[n];

    // ── Removed-actives notice ───────────────────────────────────────────────
    // These are NOT in the database — they cannot be browsed, rotated, or added
    // to a spray plan. This map exists only so that a grower who SEARCHES for a
    // banned active gets an honest answer instead of a blank "no matches",
    // together with a pointer to the pests it used to be used against so they
    // can find legal alternatives. Keyed by lowercase search terms (EN + 中文).
    const REMOVED_MY = [
      { terms: ["chlorpyrifos", "毒死蜱"], en: "Chlorpyrifos", zh: "毒死蜱",
        basisZh: "马来西亚自 2023 年起禁止农业用途；仅准用于非农业害虫防治。",
        basisEn: "Farm use banned in Malaysia since 2023; permitted only for non-agricultural pest control.",
        pests: ["leafhopper", "caterpillar", "grasshopper"] },
      { terms: ["methomyl", "灭多威"], en: "Methomyl", zh: "灭多威",
        basisZh: "马来西亚禁用（WHO Ib 高毒）。",
        basisEn: "Banned in Malaysia (WHO class Ib, highly hazardous).",
        pests: ["mealybug", "thrips", "leafhopper"] },
      { terms: ["methamidophos", "甲胺磷"], en: "Methamidophos", zh: "甲胺磷",
        basisZh: "马来西亚禁用（WHO Ib 高毒），列入 2025–2030 淘汰名单。",
        basisEn: "Banned in Malaysia (WHO class Ib); on the 2025–2030 phase-out list.",
        pests: ["leafhopper", "thrips"] },
      { terms: ["endosulfan", "硫丹"], en: "Endosulfan", zh: "硫丹",
        basisZh: "马来西亚禁用；斯德哥尔摩公约列为持久性有机污染物 (POP)。",
        basisEn: "Banned in Malaysia; listed as a Persistent Organic Pollutant under the Stockholm Convention.",
        pests: ["spider_mite", "caterpillar"] },
      { terms: ["dicofol", "三氯杀螨醇"], en: "Dicofol", zh: "三氯杀螨醇",
        basisZh: "马来西亚禁用；斯德哥尔摩公约 POP，2025–2030 淘汰名单。",
        basisEn: "Banned in Malaysia; Stockholm Convention POP, on the 2025–2030 phase-out list.",
        pests: ["spider_mite"] },
    ];
    const findRemoved = (q) => {
      const s = (q || '').trim().toLowerCase();
      if (s.length < 3) return null;
      return REMOVED_MY.find(r => r.terms.some(term => term.includes(s) || s.includes(term))) || null;
    };
    // ── Not approved / banned in the EU (informational only) ─────────────────
    // Shown ONLY inside the card details — not on the card face, and with no
    // effect on rotation (this is EU status, for context, not Malaysian law).
    // Verified against EFSA residue reports, EUR-Lex, and EU Commission sources.
    // The modern chemistries (diamides, spinosyns, IGRs, acetamiprid,
    // flupyradifurone, etc.) remain EU-approved, so they are intentionally absent.
    // ── EU regulatory status ─────────────────────────────────────────────────
    // AUDIT LOG — last full review: 2026-08-03. Sources: PPDB/BPDB (Univ. of
    // Hertfordshire), EUR-Lex, EFSA, CropLife "EU Pesticide Renewal Monitor".
    //
    // Round 1 — PPDB records pulled individually for Amitraz, Tolfenpyrad,
    //   Fenobucarb, Cartap hydrochloride, Diafenthiuron, Bifenazate, Etoxazole.
    //   WHO cross-check: Cartap (II) and Diafenthiuron (III) confirmed;
    //   Tolfenpyrad corrected (was II, actually not listed).
    //
    // Round 2 — PPDB/BPDB records pulled individually for Rotenone, Isoprocarb,
    //   Ethiprole, Triflumezopyrim, Isocycloseram, Hexaflumuron, Malathion,
    //   Dimpropyridaz. Every line below that came out of round 2 was read
    //   directly off the record; nothing was inferred.
    //   WHO cross-check CONFIRMED: Isoprocarb (II), Malathion (III),
    //     Dimpropyridaz (not listed). No errors found this round.
    //   WHO cross-check NOT POSSIBLE: Rotenone, Ethiprole, Triflumezopyrim,
    //     Isocycloseram, Hexaflumuron — their WHO rows sit past the point where
    //     the fetched record truncates. Those five stored classes are still
    //     UNVERIFIED; carry the same suspicion that caught Tolfenpyrad.
    //     Retried 2026-08-03 (round 3) on Triflumezopyrim: the record truncates
    //     at the same place again, before the ecotox table and the WHO row. The
    //     cut is systematic on long records, not a transient fetch failure, so
    //     these five need a different route entirely — the downloadable PPDB
    //     dataset or the IUPAC-format mirror — rather than another page fetch.
    //   NOTE: Rotenone lives in the BPDB (biopesticides), not the PPDB. BPDB
    //     pages truncate much earlier than PPDB ones, so other plant-derived
    //     actives will hit the same wall.
    //
    // VERIFIED EU-APPROVED (deliberately absent from this map — do NOT re-flag):
    //   Acetamiprid, Bifenazate (to 2037), Deltamethrin, Esfenvalerate (CfS),
    //   Etofenprox, Etoxazole (to 2028, CfS), Flupyradifurone, Formetanate,
    //   Lambda-cyhalothrin, Pyriproxyfen, Spinosad, and the modern diamides /
    //   spinosyns / IGRs / ketoenols not listed below.
    //   NOTE: Spinosad is approved — trade articles claiming otherwise confuse
    //   it with Spinetoram, whose approval did lapse (30 Jun 2024).
    //
    // WATCH:
    //   Buprofezin — approved only to Dec 2026, draft EU non-approval pending
    //     (endocrine disruptor). Still legal now, so intentionally unflagged.
    //   Dimpropyridaz — EU status reads PENDING, not refused: dossier under
    //     assessment with Austria as rapporteur, listed in the EU database, and
    //     Croatia already showing a national authorisation. Deliberately NOT
    //     flagged; "pending" is not "banned". Re-check when the decision lands.
    //
    // NOT YET VERIFIED: none. The round-2 eight are all resolved and flagged
    //   below, except Dimpropyridaz (pending — see WATCH).
    //
    // NOT PLANT PROTECTION: Hexaflumuron's 1107/2009 inclusion has EXPIRED, so
    //   it is flagged below. Carried over from the earlier audit, and NOT
    //   re-checked this round: it is understood to hold an EU *biocide* (PT18)
    //   approval, which is a wood/termite authorisation and never was plant
    //   protection. No expiry date is recorded here because none was verified.
    //
    // ALSO NOTED THIS ROUND (read off the same records; not regulatory status):
    //   PPDB tags Hexaflumuron and Isocycloseram as PFAS ("forever chemicals").
    //   Isocycloseram is additionally very persistent (typical soil DT50 ~390 d);
    //   Hexaflumuron field DT50 ~170 d. Ethiprole is flagged an endocrine
    //   disruptor; Triflumezopyrim a possible carcinogen.
    //   BEE GAP — RESOLVED 2026-08-03. Malathion, Triflumezopyrim, Isocycloseram
    //   and Rotenone each carry HIGH acute bee toxicity in PPDB but were absent
    //   from BEE_TAGS; all four are now tagged "high" there, sourced from each
    //   record's own ecotoxicity alert. See the comment in BEE_TAGS for values.
    //
    // BUNTING A CROSS-CHECK — 2026-08-03, every note re-tested against the source
    //   PDF, per pest chart (not just per active). RESULT: all 12 rows that claimed
    //   "Not in Bunting A" were wrong. Every one of those actives is present on the
    //   exact chart its row is attached to. Not one absence claim survived.
    //
    //   ROOT CAUSE — translation drift, not bad research. The ZH notes make a
    //   precise claim about a MISSING FIELD ("Bunting A 未列抗药性资料" = gives no
    //   resistance-risk rating). The EN notes flattened that into "Not in Bunting
    //   A" = the entry is absent entirely. Different claim, and false. The ZH text
    //   was right in 4 of 5 cases; only the English needed correcting.
    //     note_added_afido      ZH correct (entry marked "no data")   -> EN fixed
    //     note_added_beauveria  ZH correct (no mobility marker)       -> EN fixed
    //     note_added_new_chem   ZH correct (marked "no data")         -> EN fixed
    //     note_added_white_oil  ZH correct (listed, no data at all)   -> EN fixed
    //
    //   WRONG IN BOTH LANGUAGES — note_added_pyriproxyfen claimed Bunting A does
    //     not mark 7C translaminar. It DOES, on both the mealybug and psyllid
    //     charts, and the app already agreed with it. Rewritten as corroboration
    //     rather than a correction.
    //
    //   MERGED — Cyantraniliprole carried two contradictory notes on the same
    //     claim (added_tl said "not in Bunting A", challenge_tl said "Bunting A
    //     marks it not translaminar"). Bunting A lists it on all four charts and
    //     marks none translaminar, so challenge_tl was right. Both replaced by a
    //     single note_cyan_tl across all four rows. Same failure mode as Cartap.
    //
    // CONSISTENCY SWEEP — 2026-08-03. Every active's rows were compared against
    //   each other. Six disagreed internally. Three are CORRECT BY DESIGN, because
    //   the risk genuinely differs by pest and a note says so: Diafenthiuron (mid
    //   on mite, low elsewhere), Pyridaben (high on mite, low on psyllid),
    //   Spinetoram (high on thrips, mid on caterpillar). Leave those alone.
    //   The other three were oversights — a note attached to one row but not to an
    //   otherwise identical sibling — now fixed: Dimpropyridaz (thrips),
    //   Isocycloseram (thrips), Pyriproxyfen (mealybug). Two more surfaced only
    //   after the audit parser was widened: Rotenone (caterpillar, thrips) and
    //   Beauveria bassiana (spider mite).
    //   note_piercing_sucking was defined but attached to nothing; its content
    //   (Bunting A's footnote that Cyantraniliprole beats Chlorantraniliprole on
    //   piercing-sucking pests) is folded into note_cyan_tl and the key removed.
    //
    // ═══ REJECTED BY DESIGN — DO NOT PROPOSE THESE AGAIN ════════════════════
    //  A fresh session reading this file will be tempted by each of these. They
    //  were considered and refused for reasons that have not changed. If you are
    //  about to suggest one, read the reason first.
    //
    //  1. AN MRL DATABASE (rejected ~2026-05; re-proposed and re-rejected
    //     2026-08-04). Maximum Residue Limits are revised on schedules this app
    //     cannot track — MY Schedule 16 was updated within the last few months,
    //     and destination markets (CN GB 2763, EU, JP) each move independently.
    //     An offline single-file PWA has no way to know its numbers went stale.
    //     An exporter reads a limit here, loads a container, and it is rejected —
    //     and this app is blamed for it. The same logic already governs the PHI
    //     section, which deliberately gives NO numbers and says 以产品标签为准.
    //     Shipping MRLs would break that principle exactly where being wrong is
    //     most expensive. This includes "just for reference" or "with a
    //     disclaimer" variants. The answer is no.
    //     WHAT THE APP DOES INSTEAD — and this is the right answer, already
    //     built: a per-chemical LINK to the live GB 2763-2026 table on the
    //     FoodMate portal, labelled 中国 MRL, carrying 以国家标准原文为准. The
    //     grower reaches the current numbers; the app never caches one. Extend
    //     that pattern for any other jurisdiction (link out, never store). Do not
    //     read item 1 as "no MRL feature" — it means "no MRL VALUES in this file".
    //
    //  2. NAMING THE ABSENCE OF A DURIAN MRL on a card (see Malathion below).
    //     Upwards of 95% of actives registered in Malaysia carry no durian-
    //     specific listing — Malaysia mostly imports and repacks concentrate,
    //     and durian is a minor crop in residue-trial terms. Saying it on one
    //     card implies a problem specific to that active; saying it on all of
    //     them implies nothing is legal to spray. Say it on neither.
    //
    //  3. POPULATING BANNED_MY to "activate" the ban UI — see the note at that
    //     map. It is empty on purpose.
    // ════════════════════════════════════════════════════════════════════════
    //
    // MALATHION WORDING — 2026-08-04. Reworded from an assertion ("approval
    //   ended 31 July 2026") to an attribution ("the PPDB record lists the period
    //   as running to 2026-07-31"). The distinction is deliberate and should be
    //   preserved: PPDB was last updated 01/04/2026, so a renewal could have
    //   landed in the gap without the record showing it. The app reports the
    //   source, names the date, and tells the reader to re-check — it does not
    //   declare the approval dead. The verified, undisputed part (2018 renewal =
    //   greenhouse use only, high risk to birds) is stated plainly, because that
    //   is what actually matters for an outdoor orchard.
    //   The closing sentence — "EU status only, not a statement about Malaysian
    //   registration" — is there because this map renders an EU badge on a card a
    //   Malaysian grower is reading. NOTE: this app has NOT verified Malathion's
    //   Malaysian registration either way; the line disclaims, it does not assert.
    //
    // BANNED_MY IS EMPTY ON PURPOSE — do not "fix" it. The policy above removes
    //   banned actives from the database outright; the map is a defence-in-depth
    //   hook for a fresh ban that has not yet had its rows deleted. An earlier
    //   pass in this session wrongly flagged the empty map as a broken feature.
    //   The live safety net is REMOVED_MY (5 entries), which answers a search for
    //   a banned active instead of returning "no matches". check_data.py now
    //   enforces the real invariant: nothing in REMOVED_MY may also appear in
    //   ACTIVES. That check is negative-tested — injecting Chlorpyrifos back into
    //   ACTIVES makes it fail, as it must.
    //
    // RUN check_data.py AFTER ADDING ANY ACTIVE. It catches exactly the failures
    //   found in this session: notes missing from one language, orphaned note
    //   definitions, "not in Bunting A" claims, sibling rows that disagree without
    //   explanation, and lookup-map keys (EU_BANNED / BEE_TAGS / TOX_WHO) naming
    //   an active that does not exist. It exits non-zero on error.
    //   CAUTION: some rows carry an optional zh:"..." label between n and s. The
    //   first version of that script's regex omitted it and silently skipped 12
    //   rows — every UN/UNF botanical plus Rotenone — reporting 66 actives instead
    //   of 69. If the row count printed is not 69, the parser is wrong, not the data.
    //
    //   LESSON FOR FUTURE EDITS: when checking a Bunting A claim, read the WHOLE
    //   panel. Actives live in five separate boxes — main neural column, secondary
    //   neural box (9D/14/22A/28/29/30/36), UN, respiratory, and growth. A blank
    //   risk star means unrated; "(沒有資料)" means explicitly no data. Those are
    //   not the same as absent, and neither is "not on this chart".
    //
    // CARTAP — the two old notes (added_cartap / challenge_cartap) were BOTH wrong
    //   and contradicted each other: one said "not in Bunting A", the other said
    //   "Bunting A rates it low risk". Neither holds. Bunting A lists it on all
    //   four charts, marked systemic, with NO risk rating at all. Merged into a
    //   single note_cartap_risk applied to all four rows, which also removes the
    //   near-duplicate that showed on the card when no pest filter was active.
    //
    // GUS: only two numeric values recovered — Malathion 0.00 (low leachability)
    //   and Dimpropyridaz 2.51 (transition state). Isoprocarb has no value at
    //   all (Koc missing, so it cannot be calculated). Two out of 69 is nowhere
    //   near enough to display; keep the field hidden.
    //
    // Regulatory status decays on its own — re-audit this map ~yearly.
    const EU_BANNED = {
      "Acephate":      { zh: "欧盟未批准使用", en: "Not approved in the EU" },
      "Bifenthrin":    { zh: "欧盟未批准使用", en: "Not approved in the EU" },
      "Carbaryl":      { zh: "欧盟未批准使用", en: "Not approved in the EU" },
      "Carbosulfan":   { zh: "欧盟未批准使用 (2007)", en: "Not approved in the EU (2007)" },
      "Cartap hydrochloride": { zh: "欧盟未批准使用（已过期）", en: "Not approved in the EU (approval expired)" },
      "Chlorfenapyr":  { zh: "欧盟未批准使用", en: "Not approved in the EU" },
      "Clothianidin":  { zh: "欧盟禁止露天使用 (2018)", en: "Outdoor use banned in the EU (2018)" },
      "Dimethoate":    { zh: "欧盟未批准使用 (2019 未续期)", en: "Not approved in the EU (non-renewed 2019)" },
      "Diafenthiuron":  { zh: "欧盟已于 2008 年撤销", en: "Withdrawn from the EU in 2008" },
      "Dinotefuran":   { zh: "欧盟未批准使用", en: "Not approved in the EU" },
      "Fenobucarb":     { zh: "欧盟未批准使用", en: "Not approved in the EU" },
      "Fenitrothion":  { zh: "欧盟未批准使用", en: "Not approved in the EU" },
      "Fenthion":      { zh: "欧盟未批准使用", en: "Not approved in the EU" },
      "Fipronil":      { zh: "欧盟未批准使用", en: "Not approved in the EU" },
      "Imidacloprid":  { zh: "欧盟禁止露天使用 (2018)", en: "Outdoor use banned in the EU (2018)" },
      "Methoxyfenozide": { zh: "欧盟批准已于 2026 年 3 月到期", en: "EU approval expired March 2026" },
      "Propargite":    { zh: "欧盟未批准使用", en: "Not approved in the EU" },
      "Pymetrozine":   { zh: "欧盟未批准使用 (2018 未续期)", en: "Not approved in the EU (non-renewed 2018)" },
      "Sulfoxaflor":   { zh: "欧盟禁止露天使用 (2022)", en: "Outdoor use banned in the EU (2022)" },
      "Thiamethoxam":  { zh: "欧盟禁止露天使用 (2018)", en: "Outdoor use banned in the EU (2018)" },
      "Tolfenpyrad":    { zh: "欧盟未批准使用", en: "Not approved in the EU" },
      "Amitraz":        { zh: "欧盟未批准使用（批准已到期）", en: "Not approved in the EU (approval expired)" },
      "Chromafenozide": { zh: "欧盟批准已于 2025 年 3 月到期", en: "EU approval expired March 2025" },
      "Flubendiamide":  { zh: "欧盟批准已于 2024 年 8 月到期", en: "EU approval expired August 2024" },
      "Metaflumizone":  { zh: "欧盟批准已于 2024 年 12 月到期", en: "EU approval expired December 2024" },
      "Pyridalyl":      { zh: "欧盟批准已于 2024 年 6 月到期", en: "EU approval expired June 2024" },
      "Spinetoram":     { zh: "欧盟批准已于 2024 年 6 月到期", en: "EU approval expired June 2024" },
      "Spirotetramat":  { zh: "欧盟批准已于 2024 年 4 月到期", en: "EU approval expired April 2024" },
      // ── Added 2026-08-03, round 2. Dimpropyridaz deliberately absent: its
      //    status is PENDING, not refused (see WATCH above). ────────────────
      "Rotenone":        { zh: "欧盟未批准使用（2008 年撤销）",
                           en: "Not approved in the EU (withdrawn 2008)" },
      "Isoprocarb":      { zh: "欧盟未批准使用（从未进入评估程序）",
                           en: "Not approved in the EU (never entered assessment)" },
      "Ethiprole":       { zh: "欧盟未批准使用（从未进入评估程序）",
                           en: "Not approved in the EU (never entered assessment)" },
      "Triflumezopyrim": { zh: "欧盟未批准使用（未列入欧盟登记册）",
                           en: "Not approved in the EU (not in the EU register)" },
      "Isocycloseram":   { zh: "欧盟未批准使用（未列入欧盟登记册）",
                           en: "Not approved in the EU (not in the EU register)" },
      "Hexaflumuron":    { zh: "欧盟植保批准已到期",
                           en: "EU plant-protection approval has expired" },
      // Malathion — worded to ATTRIBUTE, not assert. The tool reports what the
      // PPDB record says and who said it; it does not itself declare the approval
      // dead. That is deliberate: the record was last updated 01/04/2026 and the
      // listed period ran to 31/07/2026, so between those dates a renewal may
      // have landed that PPDB has not yet reflected. Stating "expired" as fact
      // would be a claim this app cannot stand behind. The 2018 renewal had
      // already cut it to GREENHOUSE use only (high risk to birds), which is the
      // part that actually matters for an outdoor orchard and is not in doubt.
      // The closing lines exist because this map renders an EU badge, and an EU
      // badge must not be read as a statement about Malaysian registration.
      // MY status VERIFIED 2026-08-04 against mymrl.doa.gov.my/AIs/84 (DOA
      // residue database, Schedule 16 / Food Regulations 1985): malathion is
      // registered here, with statutory MRLs and PHIs on 7 food crops.
      // DELIBERATELY NOT SAID: that durian is absent from that commodity list.
      // It is — but per Stanley, upwards of 95% of actives registered in Malaysia
      // carry no durian-specific listing, so naming the absence would read as a
      // warning about malathion in particular when it is simply the norm. Do not
      // re-add it for this or any other active without that context.
      "Malathion":       { zh: "欧盟：2018 年续期决定将其限于温室使用。PPDB 所列批准期至 2026-07-31,续期结果本工具无法确认,请不时自行查证。马来西亚：农业部残留数据库列有本品 (IRAC 1B) 的法定残留限量与安全采收间隔 (杨桃、木瓜、菠萝、番茄、黄瓜、芥菜、辣椒),即在马来西亚属登记使用。请以产品标签为准。",
                           en: "EU: the 2018 renewal restricted it to greenhouse use. PPDB lists the approval period as running to 2026-07-31; this tool cannot confirm the renewal outcome, so re-check periodically. Malaysia: registered — the DOA residue database lists statutory MRLs and pre-harvest intervals for this active (IRAC 1B) on starfruit, papaya, pineapple, tomato, cucumber, mustard greens and chilli. Follow the product label." },
    };
    // "English 中文" label (Chinese appended only when we have an official name).
    const chemLabel = (n) => (CHEM_ZH[n] ? `${n} ${CHEM_ZH[n]}` : n);
    // Site → tile color classes (background tint + border + label color when UNSELECTED)
    const SITE_TILE_STYLES = {
      neural:      { bg:"bg-sky-50",     border:"border-sky-200",    hover:"hover:bg-sky-100",    label:"text-sky-700",    borderL:"border-l-sky-400" },
      growth:      { bg:"bg-violet-50",  border:"border-violet-200", hover:"hover:bg-violet-100", label:"text-violet-700", borderL:"border-l-violet-400" },
      respiratory: { bg:"bg-orange-50",  border:"border-orange-200", hover:"hover:bg-orange-100", label:"text-orange-700", borderL:"border-l-orange-400" },
      midgut:      { bg:"bg-amber-50",   border:"border-amber-200",  hover:"hover:bg-amber-100",  label:"text-amber-800",  borderL:"border-l-amber-400" },
      unknown:     { bg:"bg-slate-50",   border:"border-slate-200",  hover:"hover:bg-slate-100",  label:"text-slate-600",  borderL:"border-l-slate-400" },
    };

    const ACTIVES = [
      // GRASSHOPPER & BEETLES
      {pest:"grasshopper",g:"1A",n:"Carbaryl",s:"neural",r:"high",m:"LS"},
      {pest:"grasshopper",g:"1B",n:"Dimethoate",s:"neural",r:"high",m:"S"},
      {pest:"grasshopper",g:"1B",n:"Acephate",s:"neural",r:"high",m:"S"},
      {pest:"grasshopper",g:"2B",n:"Fipronil",s:"neural",r:"mid",m:"SS"},
      {pest:"grasshopper",g:"3A",n:"Deltamethrin",s:"neural",r:"high",m:"N"},
      {pest:"grasshopper",g:"3A",n:"Cypermethrin",s:"neural",r:"high",m:"N"},
      {pest:"grasshopper",g:"22A",n:"Indoxacarb",s:"neural",r:"mid",m:"N"},
      {pest:"grasshopper",g:"28",n:"Chlorantraniliprole",s:"neural",r:"mid",m:"SS",tl:true},
      {pest:"grasshopper",g:"15",n:"Diflubenzuron",s:"growth",r:"low",m:"N"},
      {pest:"grasshopper",g:"15",n:"Novaluron",s:"growth",r:"low",m:"N"},
      {pest:"grasshopper",g:"UN",n:"Azadirachtin",zh:"印楝油",s:"unknown",r:"low",m:"S"},
      {pest:"grasshopper",g:"UN",n:"Pyridalyl",s:"unknown",r:"low",m:"S"},
      // SPIDER MITE
      {pest:"spider_mite",g:"1A",n:"Carbaryl",s:"neural",r:"high",m:"LS"},
      {pest:"spider_mite",g:"1B",n:"Dimethoate",s:"neural",r:"high",m:"S"},
      {pest:"spider_mite",g:"3A",n:"Bifenthrin",s:"neural",r:"high",m:"N"},
      {pest:"spider_mite",g:"6",n:"Abamectin",s:"neural",r:"mid",m:"LS",tl:true},
      {pest:"spider_mite",g:"19",n:"Amitraz",s:"neural",r:"mid",m:"N"},
      {pest:"spider_mite",g:"12A",n:"Diafenthiuron",s:"respiratory",r:"mid",m:"N",note:"added_diafen_mite"},
      {pest:"spider_mite",g:"12C",n:"Propargite",s:"respiratory",r:"mid",m:"N"},
      {pest:"spider_mite",g:"13",n:"Chlorfenapyr",s:"respiratory",r:"low",m:"LS",tl:true},
      {pest:"spider_mite",g:"21A",n:"Pyridaben",s:"respiratory",r:"high",m:"N",note:"added_pyridaben_mite"},
      {pest:"spider_mite",g:"21A",n:"Fenpyroximate",s:"respiratory",r:"low",m:"N"},
      {pest:"spider_mite",g:"25A",n:"Cyflumetofen",s:"respiratory",r:"low",m:"N"},
      {pest:"spider_mite",g:"10A",n:"Hexythiazox",s:"growth",r:"mid",m:"N",note:"challenge_hexythiazox"},
      {pest:"spider_mite",g:"10B",n:"Etoxazole",s:"growth",r:"mid",m:"N"},
      {pest:"spider_mite",g:"20D",n:"Bifenazate",s:"respiratory",r:"mid",m:"N"},
      {pest:"spider_mite",g:"16",n:"Buprofezin",s:"growth",r:"low",m:"N"},
      {pest:"spider_mite",g:"23",n:"Spirotetramat",s:"growth",r:"low",m:"S",tl:true,ud:true},
      {pest:"spider_mite",g:"23",n:"Spirodiclofen",s:"growth",r:"low",m:"N"},
      {pest:"spider_mite",g:"UNF",n:"Beauveria bassiana",zh:"白僵菌",s:"unknown",r:"low",m:"N",note:"added_beauveria"},
      {pest:"spider_mite",g:"UN",n:"Azadirachtin",zh:"印楝油",s:"unknown",r:"low",m:"S"},
      // MEALYBUG
      {pest:"mealybug",g:"1A",n:"Carbaryl",s:"neural",r:"high",m:"LS"},
      {pest:"mealybug",g:"1B",n:"Dimethoate",s:"neural",r:"high",m:"S"},
      {pest:"mealybug",g:"1B",n:"Acephate",s:"neural",r:"high",m:"S"},
      {pest:"mealybug",g:"1B",n:"Fenthion",s:"neural",r:"high",m:"N"},
      {pest:"mealybug",g:"2B",n:"Fipronil",s:"neural",r:"mid",m:"SS"},
      {pest:"mealybug",g:"3A",n:"Deltamethrin",s:"neural",r:"high",m:"N"},
      {pest:"mealybug",g:"3A",n:"Cypermethrin",s:"neural",r:"high",m:"N"},
      {pest:"mealybug",g:"3A",n:"Bifenthrin",s:"neural",r:"high",m:"N"},
      {pest:"mealybug",g:"3A",n:"Lambda-cyhalothrin",s:"neural",r:"high",m:"N"},
      {pest:"mealybug",g:"4A",n:"Imidacloprid",s:"neural",r:"high",m:"S",tl:true},
      {pest:"mealybug",g:"4A",n:"Acetamiprid",s:"neural",r:"high",m:"S",tl:true},
      {pest:"mealybug",g:"4A",n:"Thiamethoxam",s:"neural",r:"high",m:"S",tl:true},
      {pest:"mealybug",g:"4A",n:"Clothianidin",s:"neural",r:"high",m:"S",tl:true},
      {pest:"mealybug",g:"4A",n:"Dinotefuran",s:"neural",r:"high",m:"S",tl:true},
      {pest:"mealybug",g:"4C",n:"Sulfoxaflor",s:"neural",r:"low",m:"S"},
      {pest:"mealybug",g:"6",n:"Abamectin",s:"neural",r:"mid",m:"LS",tl:true},
      {pest:"mealybug",g:"9D",n:"Afidopyropen",s:"neural",r:"mid",m:"S",note:"added_afido"},
      {pest:"mealybug",g:"28",n:"Cyantraniliprole",s:"neural",r:"mid",m:"S",tl:true,note:"cyan_tl"},
      {pest:"mealybug",g:"29",n:"Flonicamid",s:"neural",r:"low",m:"SS",tl:true},
      {pest:"mealybug",g:"30",n:"Isocycloseram",s:"neural",r:"low",m:"N",note:"added_new_chem"},
      {pest:"mealybug",g:"7B",n:"Fenoxycarb",s:"growth",r:"low",m:"N"},
      {pest:"mealybug",g:"7C",n:"Pyriproxyfen",s:"growth",r:"low",m:"N",tl:true,note:"added_pyriproxyfen"},
      {pest:"mealybug",g:"16",n:"Buprofezin",s:"growth",r:"low",m:"N"},
      {pest:"mealybug",g:"23",n:"Spirotetramat",s:"growth",r:"low",m:"S",tl:true,ud:true},
      {pest:"mealybug",g:"UN",n:"Azadirachtin",zh:"印楝油",s:"unknown",r:"low",m:"S"},
      {pest:"mealybug",g:"UNM",n:"White Oil",s:"unknown",r:"low",m:"N",note:"added_white_oil"},
      // CATERPILLAR
      {pest:"caterpillar",g:"1A",n:"Carbaryl",s:"neural",r:"high",m:"LS"},
      {pest:"caterpillar",g:"1B",n:"Dimethoate",s:"neural",r:"high",m:"S"},
      {pest:"caterpillar",g:"2B",n:"Fipronil",s:"neural",r:"mid",m:"SS"},
      {pest:"caterpillar",g:"3A",n:"Deltamethrin",s:"neural",r:"high",m:"N"},
      {pest:"caterpillar",g:"3A",n:"Cypermethrin",s:"neural",r:"high",m:"N"},
      {pest:"caterpillar",g:"3A",n:"Bifenthrin",s:"neural",r:"high",m:"N"},
      {pest:"caterpillar",g:"3A",n:"Lambda-cyhalothrin",s:"neural",r:"high",m:"N"},
      {pest:"caterpillar",g:"4A",n:"Imidacloprid",s:"neural",r:"high",m:"S",tl:true},
      {pest:"caterpillar",g:"4A",n:"Acetamiprid",s:"neural",r:"high",m:"S",tl:true},
      {pest:"caterpillar",g:"5",n:"Spinosad",s:"neural",r:"mid",m:"N"},
      {pest:"caterpillar",g:"5",n:"Spinetoram",s:"neural",r:"mid",m:"N"},
      {pest:"caterpillar",g:"6",n:"Abamectin",s:"neural",r:"mid",m:"LS",tl:true},
      {pest:"caterpillar",g:"6",n:"Emamectin benzoate",s:"neural",r:"mid",m:"LS",tl:true},
      {pest:"caterpillar",g:"14",n:"Cartap hydrochloride",s:"neural",r:"mid",m:"S",tl:true,note:"cartap_risk"},
      {pest:"caterpillar",g:"22A",n:"Indoxacarb",s:"neural",r:"mid",m:"N"},
      {pest:"caterpillar",g:"22B",n:"Metaflumizone",s:"neural",r:"low",m:"N",note:"added_meta"},
      {pest:"caterpillar",g:"28",n:"Chlorantraniliprole",s:"neural",r:"mid",m:"SS",tl:true},
      {pest:"caterpillar",g:"28",n:"Flubendiamide",s:"neural",r:"mid",m:"LS",tl:true},
      {pest:"caterpillar",g:"13",n:"Chlorfenapyr",s:"respiratory",r:"low",m:"LS",tl:true},
      {pest:"caterpillar",g:"21A",n:"Tolfenpyrad",s:"respiratory",r:"low",m:"N"},
      {pest:"caterpillar",g:"21B",n:"Rotenone",zh:"鱼藤",s:"respiratory",r:"low",m:"N",note:"added_rotenone"},
      {pest:"caterpillar",g:"7B",n:"Fenoxycarb",s:"growth",r:"low",m:"N"},
      {pest:"caterpillar",g:"15",n:"Lufenuron",s:"growth",r:"low",m:"N"},
      {pest:"caterpillar",g:"15",n:"Hexaflumuron",s:"growth",r:"low",m:"N"},
      {pest:"caterpillar",g:"15",n:"Diflubenzuron",s:"growth",r:"low",m:"N"},
      {pest:"caterpillar",g:"18",n:"Chromafenozide",s:"growth",r:"low",m:"N"},
      {pest:"caterpillar",g:"11A",n:"Bacillus thuringiensis",s:"midgut",r:"mid",m:"N",note:"added_bt"},
      {pest:"caterpillar",g:"UN",n:"Azadirachtin",zh:"印楝油",s:"unknown",r:"low",m:"S"},
      {pest:"caterpillar",g:"UN",n:"Pyridalyl",s:"unknown",r:"low",m:"S"},
      // PSYLLID
      {pest:"psyllid",g:"1A",n:"Carbaryl",s:"neural",r:"high",m:"LS"},
      {pest:"psyllid",g:"2B",n:"Fipronil",s:"neural",r:"mid",m:"SS"},
      {pest:"psyllid",g:"3A",n:"Bifenthrin",s:"neural",r:"high",m:"N"},
      {pest:"psyllid",g:"3A",n:"Cypermethrin",s:"neural",r:"high",m:"N"},
      {pest:"psyllid",g:"4A",n:"Imidacloprid",s:"neural",r:"high",m:"S",tl:true},
      {pest:"psyllid",g:"4A",n:"Acetamiprid",s:"neural",r:"high",m:"S",tl:true},
      {pest:"psyllid",g:"4A",n:"Thiamethoxam",s:"neural",r:"high",m:"S",tl:true},
      {pest:"psyllid",g:"4A",n:"Clothianidin",s:"neural",r:"high",m:"S",tl:true},
      {pest:"psyllid",g:"4A",n:"Dinotefuran",s:"neural",r:"high",m:"S",tl:true},
      {pest:"psyllid",g:"4C",n:"Sulfoxaflor",s:"neural",r:"low",m:"S"},
      {pest:"psyllid",g:"4D",n:"Flupyradifurone",s:"neural",r:"low",m:"S"},
      {pest:"psyllid",g:"6",n:"Abamectin",s:"neural",r:"mid",m:"LS",tl:true},
      {pest:"psyllid",g:"9B",n:"Pymetrozine",s:"neural",r:"low",m:"S",tl:true,ud:true,note:"challenge_pymetrozine"},
      {pest:"psyllid",g:"9D",n:"Afidopyropen",s:"neural",r:"mid",m:"S",note:"added_afido"},
      {pest:"psyllid",g:"14",n:"Cartap hydrochloride",s:"neural",r:"mid",m:"S",tl:true,note:"cartap_risk"},
      {pest:"psyllid",g:"28",n:"Cyantraniliprole",s:"neural",r:"mid",m:"S",tl:true,note:"cyan_tl"},
      {pest:"psyllid",g:"12A",n:"Diafenthiuron",s:"respiratory",r:"low",m:"N"},
      {pest:"psyllid",g:"13",n:"Chlorfenapyr",s:"respiratory",r:"low",m:"LS",tl:true},
      {pest:"psyllid",g:"21A",n:"Pyridaben",s:"respiratory",r:"low",m:"N"},
      {pest:"psyllid",g:"21A",n:"Tolfenpyrad",s:"respiratory",r:"low",m:"N"},
      {pest:"psyllid",g:"21B",n:"Rotenone",zh:"鱼藤",s:"respiratory",r:"low",m:"N",note:"added_rotenone"},
      {pest:"psyllid",g:"7C",n:"Pyriproxyfen",s:"growth",r:"low",m:"N",tl:true,note:"added_pyriproxyfen"},
      {pest:"psyllid",g:"16",n:"Buprofezin",s:"growth",r:"low",m:"N"},
      {pest:"psyllid",g:"23",n:"Spirotetramat",s:"growth",r:"low",m:"S",tl:true,ud:true},
      {pest:"psyllid",g:"UNF",n:"Beauveria bassiana",zh:"白僵菌",s:"unknown",r:"low",m:"N",note:"added_beauveria"},
      {pest:"psyllid",g:"UN",n:"Azadirachtin",zh:"印楝油",s:"unknown",r:"low",m:"S"},
      // THRIPS
      {pest:"thrips",g:"1A",n:"Carbaryl",s:"neural",r:"high",m:"LS"},
      {pest:"thrips",g:"1A",n:"Formetanate hydrochloride",s:"neural",r:"high",m:"N"},
      {pest:"thrips",g:"1B",n:"Dimethoate",s:"neural",r:"high",m:"S"},
      {pest:"thrips",g:"2B",n:"Fipronil",s:"neural",r:"mid",m:"SS"},
      {pest:"thrips",g:"3A",n:"Bifenthrin",s:"neural",r:"high",m:"N"},
      {pest:"thrips",g:"3A",n:"Lambda-cyhalothrin",s:"neural",r:"high",m:"N"},
      {pest:"thrips",g:"4A",n:"Imidacloprid",s:"neural",r:"high",m:"S",tl:true},
      {pest:"thrips",g:"4A",n:"Acetamiprid",s:"neural",r:"high",m:"S",tl:true},
      {pest:"thrips",g:"4A",n:"Thiamethoxam",s:"neural",r:"high",m:"S",tl:true},
      {pest:"thrips",g:"4A",n:"Clothianidin",s:"neural",r:"high",m:"S",tl:true},
      {pest:"thrips",g:"4A",n:"Dinotefuran",s:"neural",r:"high",m:"S",tl:true},
      {pest:"thrips",g:"5",n:"Spinosad",s:"neural",r:"mid",m:"N"},
      {pest:"thrips",g:"5",n:"Spinetoram",s:"neural",r:"high",m:"N",note:"added_spinetoram_thrips"},
      {pest:"thrips",g:"6",n:"Abamectin",s:"neural",r:"mid",m:"LS",tl:true},
      {pest:"thrips",g:"9B",n:"Pymetrozine",s:"neural",r:"low",m:"S",tl:true,ud:true,note:"challenge_pymetrozine"},
      {pest:"thrips",g:"9D",n:"Afidopyropen",s:"neural",r:"mid",m:"S",note:"added_afido"},
      {pest:"thrips",g:"14",n:"Cartap hydrochloride",s:"neural",r:"mid",m:"S",tl:true,note:"cartap_risk"},
      {pest:"thrips",g:"22A",n:"Indoxacarb",s:"neural",r:"mid",m:"N"},
      {pest:"thrips",g:"28",n:"Cyantraniliprole",s:"neural",r:"mid",m:"S",tl:true,note:"cyan_tl"},
      {pest:"thrips",g:"29",n:"Flonicamid",s:"neural",r:"low",m:"SS",tl:true},
      {pest:"thrips",g:"30",n:"Isocycloseram",s:"neural",r:"low",m:"N",note:"added_new_chem"},
      {pest:"thrips",g:"36",n:"Dimpropyridaz",s:"neural",r:"low",m:"N",note:"added_new_chem"},
      {pest:"thrips",g:"12A",n:"Diafenthiuron",s:"respiratory",r:"low",m:"N"},
      {pest:"thrips",g:"13",n:"Chlorfenapyr",s:"respiratory",r:"low",m:"LS",tl:true},
      {pest:"thrips",g:"21A",n:"Tolfenpyrad",s:"respiratory",r:"low",m:"N"},
      {pest:"thrips",g:"21B",n:"Rotenone",zh:"鱼藤",s:"respiratory",r:"low",m:"N",note:"added_rotenone"},
      {pest:"thrips",g:"15",n:"Novaluron",s:"growth",r:"low",m:"N"},
      {pest:"thrips",g:"23",n:"Spirotetramat",s:"growth",r:"low",m:"S",tl:true,ud:true},
      {pest:"thrips",g:"UN",n:"Azadirachtin",zh:"印楝油",s:"unknown",r:"low",m:"S"},
      {pest:"thrips",g:"UN",n:"Pyridalyl",s:"unknown",r:"low",m:"S"},
      // LEAFHOPPER
      {pest:"leafhopper",g:"1A",n:"Carbaryl",s:"neural",r:"high",m:"LS"},
      {pest:"leafhopper",g:"1A",n:"Isoprocarb",s:"neural",r:"high",m:"N"},
      {pest:"leafhopper",g:"1A",n:"Fenobucarb",s:"neural",r:"high",m:"N"},
      {pest:"leafhopper",g:"1A",n:"Carbosulfan",s:"neural",r:"high",m:"S"},
      {pest:"leafhopper",g:"1B",n:"Dimethoate",s:"neural",r:"high",m:"S"},
      {pest:"leafhopper",g:"1B",n:"Malathion",s:"neural",r:"high",m:"N"},
      {pest:"leafhopper",g:"1B",n:"Fenitrothion",s:"neural",r:"high",m:"N"},
      {pest:"leafhopper",g:"2B",n:"Fipronil",s:"neural",r:"mid",m:"SS"},
      {pest:"leafhopper",g:"2B",n:"Ethiprole",s:"neural",r:"mid",m:"N"},
      {pest:"leafhopper",g:"3A",n:"Etofenprox",s:"neural",r:"high",m:"N"},
      {pest:"leafhopper",g:"3A",n:"Esfenvalerate",s:"neural",r:"high",m:"N"},
      {pest:"leafhopper",g:"3A",n:"Lambda-cyhalothrin",s:"neural",r:"high",m:"N"},
      {pest:"leafhopper",g:"4A",n:"Imidacloprid",s:"neural",r:"high",m:"S",tl:true},
      {pest:"leafhopper",g:"4A",n:"Acetamiprid",s:"neural",r:"high",m:"S",tl:true},
      {pest:"leafhopper",g:"4A",n:"Thiamethoxam",s:"neural",r:"high",m:"S",tl:true},
      {pest:"leafhopper",g:"4A",n:"Clothianidin",s:"neural",r:"high",m:"S",tl:true},
      {pest:"leafhopper",g:"4A",n:"Dinotefuran",s:"neural",r:"high",m:"S",tl:true},
      {pest:"leafhopper",g:"4C",n:"Sulfoxaflor",s:"neural",r:"low",m:"S"},
      {pest:"leafhopper",g:"4E",n:"Triflumezopyrim",s:"neural",r:"low",m:"S",tl:true},
      {pest:"leafhopper",g:"9B",n:"Pymetrozine",s:"neural",r:"low",m:"S",tl:true,ud:true,note:"challenge_pymetrozine"},
      {pest:"leafhopper",g:"9D",n:"Afidopyropen",s:"neural",r:"mid",m:"S",note:"added_afido"},
      {pest:"leafhopper",g:"14",n:"Cartap hydrochloride",s:"neural",r:"mid",m:"S",tl:true,note:"cartap_risk"},
      {pest:"leafhopper",g:"22A",n:"Indoxacarb",s:"neural",r:"mid",m:"N"},
      {pest:"leafhopper",g:"28",n:"Cyantraniliprole",s:"neural",r:"mid",m:"S",tl:true,note:"cyan_tl"},
      {pest:"leafhopper",g:"29",n:"Flonicamid",s:"neural",r:"low",m:"SS",tl:true},
      {pest:"leafhopper",g:"36",n:"Dimpropyridaz",s:"neural",r:"low",m:"N",note:"added_new_chem"},
      {pest:"leafhopper",g:"12A",n:"Diafenthiuron",s:"respiratory",r:"low",m:"N"},
      {pest:"leafhopper",g:"21A",n:"Tolfenpyrad",s:"respiratory",r:"low",m:"N"},
      {pest:"leafhopper",g:"16",n:"Buprofezin",s:"growth",r:"low",m:"N"},
      {pest:"leafhopper",g:"18",n:"Methoxyfenozide",s:"growth",r:"mid",m:"N"},
      {pest:"leafhopper",g:"23",n:"Spirotetramat",s:"growth",r:"low",m:"S",tl:true,ud:true},
      {pest:"leafhopper",g:"UN",n:"Azadirachtin",zh:"印楝油",s:"unknown",r:"low",m:"S"}
    ];

    const MIX_SEQUENCE = [
      {step:1, zh:"水箱配 ½ ~ ¾ 水",                 en:"Fill tank ½ ~ ¾ with water"},
      {step:2, zh:"调整 pH 至 6.0 或以下",             en:"Adjust pH to 6.0 or below"},
      {step:3, zh:"水分散粒剂 (WDG)、可湿性粉剂 (WP)",  en:"Water-dispersible granules (WDG), wettable powders (WP)"},
      {step:4, zh:"搅拌 5 分钟",                      en:"Stir / agitate for 5 minutes"},
      {step:5, zh:"石油分散 (OD)、悬浮液浓缩 (SC)、悬乳剂 (SE)", en:"Oil dispersion (OD), suspension concentrate (SC), suspoemulsion (SE)"},
      {step:6, zh:"乳油 (EC)、水乳剂 (EW)",             en:"Emulsifiable concentrate (EC), emulsion in water (EW)"},
      {step:7, zh:"可溶性液体 (SG, SP)",                en:"Soluble granules / powders (SG, SP)"},
      {step:8, zh:"可溶性液体 (SL)",                    en:"Soluble liquids (SL)"},
      {step:9, zh:"表面活性剂 → 加满水箱",              en:"Surfactants → top up the tank"}
    ];

    // ========================================================================
    // LABEL DICTIONARIES (only display strings; data above is universal)
    // ========================================================================
    const L = {
      zh: {
        appTitle: "虫药轮替", appSubtitle: "依据 Tee 先生《Bunting A》机制图整理",
        tabLibrary: "机制库", tabRotate: "轮替助手", tabMix: "调配顺序",
        searchPlaceholder: "搜寻活性成分、机制或害虫…",
        selectPest: "选择害虫", lastUsed: "上次用过的 IRAC 机制组", tapToChange: "点击更改", siteChanger: "换机制",
        rotateTo: "建议轮替", rotateAvoid: "避免使用 (相同机制)",
        rotateCaution: "谨慎 — 靶标相同",
        cautionNote_shared: "与所选机制共享靶标,可能交叉抗性,换用并非真正更换机制。",
        cautionNote_partial: "与所选机制共享靶标;田间抗性多为代谢型,常仍有效,但非真正更换机制。",
        site_neural: "神经与肌肉", site_respiratory: "呼吸系统",
        site_growth: "生长与发育", site_unknown: "未知 / 无特定", site_midgut: "中肠 (Bt)",
        risk_low: "低", risk_mid: "中", risk_high: "高",
        mob_N: "接触", mob_S: "系统", mob_SS: "选择系统", mob_LS: "局部系统",
        tl: "穿层渗透", ud: "上下移行",
        noResults: "没有符合的结果。",
        about: "资料来源",
        aboutText: "本工具最初依据 Tee 先生 2024 年 7-8 月编制的《Bunting A》杀虫剂作用机制 (MoA) 轮替图整理,其后经多次修订与查证:作用机制与交叉抗性已对照 IRAC 分类核实,毒性依 WHO 农药危害分级标示,并补充较新的活性成分;凡马来西亚禁用的成分已从本工具中移除。每次用药请轮替不同的 IRAC 机制组,以延缓抗药性发生。",
        safetyTitle: "农户安全提醒",
        safetyText: "本指南仅为机制轮替参考。实际用药前请: ① 核对农药标签所列适用作物与虫害, ② 遵守安全采收间隔期 (PHI), ③ 不要与 Glyphosate (草甘膦) 混用其他杀虫剂, ④ 留意对授粉昆虫与天敌的影响。",
        activesCount: "个活性成分",
        langSwitch: "EN", backToTop: "回到顶部",
        note_added_afido: "Bunting A 未列抗药性资料;白粉虱已有田间抗药性报告 (36-104 倍),建议谨慎使用",
        note_added_new_chem: "Bunting A 未列抗药性资料;新化学,目前无田间抗药性或交叉抗药性报告",
        note_added_white_oil: "Bunting A 未列资料;IRAC 报告此类油剂从未出现抗药性,作用为物理性窒息",
        note_cyan_tl: "Bunting A 在粉蚧、木虱、蓟马、青蚊四表均列有 Cyantraniliprole,但均未标示穿层渗透。IRAC 文献、PubMed 同行评审论文与商品标签 (Benevia、Minecto Xtra 等) 一致确认其具穿层渗透特性,本应用采纳网络共识。 Bunting A 另于木虱、蓟马、青蚊三表附脚注:与 Chlorantraniliprole 相比,据称 Cyantraniliprole 对刺吸式害虫更有效。",
        note_cartap_risk: "Bunting A 在毛毛虫、木虱、蓟马、青蚊四张表上均列有杀螟丹 (14),标示为系统性 (S),但未给出抗药性风险等级 (既无风险星号,也无「沒有資料」标注)。Tuta absoluta (巴西)、Plutella xylostella (中国)、Cnaphalocrocis medinalis (印度 Kerala) 已有田间抗药性报告,故本应用采纳网络共识列为中风险。穿层渗透特性取自商品资料,非 Bunting A。",
        note_added_meta: "Bunting A 列为低风险;甜菜夜蛾 Spodoptera exigua (中国广东) 田间已出现高抗药性 (60-942 倍, 2014 年研究),建议监测使用",
        note_added_bt: "Bunting A 未列细节;Plutella xylostella (小菜蛾)、Helicoverpa zea、Spodoptera frugiperda 等鳞翅目害虫已有田间抗药性报告 (Tabashnik 综述等);由幼虫取食后中肠激活,接触+取食活性",
        note_added_pyriproxyfen: "Bunting A 已在粉蚧与木虱两表标示此项具穿层渗透,本应用与之一致;Ishaaya & Horowitz 1995 与 2020 综述亦独立证实此 IGR 具穿层渗透特性",
        note_added_rotenone: "Bunting A 列为系统性,但 IRAC、AERU、PIM、ScienceDirect 等权威资料皆指鱼藤为非系统性,仅具接触与胃毒作用",
        note_added_beauveria: "Bunting A 未列作用方式;白僵菌孢子需附着虫体表皮,以芽管穿透角质层感染,属接触性",
        note_challenge_pymetrozine: "Bunting A 此条目未标穿层渗透;但 Wyss & Bolsinger 1997、LSU Ag Center、维基百科等多源确认 Pymetrozine 同时具系统性 (木质部+韧皮部) 与穿层渗透特性",
        note_added_diafen_mite: "本品对其他害虫风险较低,但红蜘蛛已有 10-40 倍田间抗药性 (Kerala 印度 Tetranychus gloveri 2025、T. truncatus 2019 研究记录),故仅红蜘蛛标为中风险",
        note_added_pyridaben_mite: "本品对其他害虫风险较低,但红蜘蛛已有极高田间抗药性 (最高达 5500 倍,Tetranychus urticae 多国报告),故仅红蜘蛛标为高风险",
        note_added_spinetoram_thrips: "本品对其他害虫风险较低,但西方花蓟马 (Frankliniella occidentalis) 已有全球性田间抗药性,故仅蓟马标为高风险",
        note_challenge_hexythiazox: "Bunting A 此条目标示低风险;但澳洲 1993、PNAS 2012 (希腊 Marathonas 玫瑰株)、塞浦路斯 2013 等多项同行评审研究记录二点叶蝉 Tetranychus urticae 对 Hexythiazox 全球性田间抗药性,本应用采纳网络共识为中风险",
      },
      en: {
        appTitle: "Pest MoA", appSubtitle: "Built from Mr. Tee's 'Bunting A' MoA chart",
        tabLibrary: "MoA Library", tabRotate: "Rotation Helper", tabMix: "Tank-Mix Order",
        searchPlaceholder: "Search active, group or pest…",
        selectPest: "Select pest", lastUsed: "Last-used IRAC group", tapToChange: "Tap to change", siteChanger: "Site changer",
        rotateTo: "Rotate to", rotateAvoid: "Avoid (same group)",
        rotateCaution: "Caution — shares a target",
        cautionNote_shared: "Shares the selected target — likely cross-resistant; switching is not a real mechanism change.",
        cautionNote_partial: "Shares the target; field resistance is usually metabolic so it often still works, but it isn't a true mechanism change.",
        site_neural: "Nerve & Muscle", site_respiratory: "Respiration",
        site_growth: "Growth & Development", site_unknown: "Unknown / Non-specific", site_midgut: "Midgut (Bt)",
        risk_low: "Low", risk_mid: "Med", risk_high: "High",
        mob_N: "Contact", mob_S: "Systemic", mob_SS: "Selective systemic", mob_LS: "Local systemic",
        tl: "Translaminar", ud: "Xylem/Phloem mobile",
        noResults: "No matches.",
        about: "About this data",
        aboutText: "Originally compiled from Mr. Tee's July-August 2024 'Bunting A' insecticide mode-of-action (MoA) rotation chart, and revised through several rounds since: modes of action and cross-resistance checked against the IRAC classification, toxicity labelled by WHO hazard class, newer actives added, and actives banned in Malaysia removed. Rotate to a different IRAC group every spray to slow resistance.",
        safetyTitle: "Farmer Safety Notes",
        safetyText: "This is a rotation guide, not a prescription. Before spraying: ① check the product label for crop & pest, ② respect the pre-harvest interval (PHI), ③ never tank-mix insecticides with Glyphosate, ④ consider pollinators and beneficials.",
        activesCount: "active ingredients",
        langSwitch: "中文", backToTop: "Back to top",
        note_added_afido: "Bunting A gives this entry no resistance-risk rating (marked 'no data'); field resistance documented in whitefly (36-104x). Use with care.",
        note_added_new_chem: "Bunting A lists this entry but marks it 'no data' for resistance risk; new chemistry, no field resistance or cross-resistance reported yet.",
        note_added_white_oil: "Bunting A lists this entry with no data at all; IRAC reports no resistance ever observed (physical suffocation).",
        note_cyan_tl: "Bunting A lists Cyantraniliprole on all four charts (mealybug, psyllid, thrips, leafhopper) but marks none of them translaminar. IRAC sources, peer-reviewed PubMed papers and commercial labels (Benevia, Minecto Xtra) all confirm translaminar action, so this app follows the web consensus. Bunting A also footnotes the psyllid, thrips and leafhopper charts: compared with Chlorantraniliprole, Cyantraniliprole is said to be more effective against piercing-sucking pests.",
        note_cartap_risk: "Bunting A lists Cartap (14) on all four charts — caterpillar, psyllid, thrips and leafhopper — marked systemic (S) but with no resistance-risk rating at all (no risk star, and no 'no data' marker either). Field resistance is documented in Tuta absoluta (Brazil), Plutella xylostella (China) and Cnaphalocrocis medinalis (Kerala, India), so this app follows web consensus and rates it mid risk. Translaminar action comes from commercial sources, not from Bunting A.",
        note_added_meta: "Bunting A rates this low; field resistance in beet armyworm Spodoptera exigua (Guangdong, China) documented at 60.3-942× (2014 study). Use with monitoring.",
        note_added_bt: "Bunting A only gave IRAC code; field resistance documented in lepidopteran pests including Plutella xylostella, Helicoverpa zea, and Spodoptera frugiperda (per Tabashnik review and others). Activated in larval midgut after ingestion (contact + stomach action).",
        note_added_pyriproxyfen: "Bunting A does mark this entry translaminar (mealybug and psyllid charts) and this app agrees; Ishaaya & Horowitz (1995) and a 2020 fate review independently confirm translaminar action for this IGR.",
        note_added_rotenone: "Bunting A marks as systemic, but IRAC, AERU, PIM 474, ScienceDirect all describe rotenone as non-systemic with contact and stomach action only.",
        note_added_beauveria: "Bunting A lists this entry but gives it no mode-of-action marker; spores must adhere to the insect cuticle, then penetrate via germ tubes - fundamentally a contact-action biopesticide.",
        note_challenge_pymetrozine: "Bunting A does not mark this entry as translaminar; however, Wyss & Bolsinger 1997, LSU Ag Center, Wikipedia, and other sources confirm pymetrozine has both systemic (xylem + phloem) and translaminar action.",
        note_added_diafen_mite: "Low risk on other pests, but red spider mite has documented 10-40× field resistance (Kerala India: Tetranychus gloveri 2025 study, T. truncatus 2019 Anushree et al.), hence mid risk only for mites.",
        note_added_pyridaben_mite: "Low risk on other pests, but red spider mite has extreme field resistance (up to 5500× in Tetranychus urticae across multiple countries), hence high risk only for mites.",
        note_added_spinetoram_thrips: "Lower risk on other pests, but western flower thrips (Frankliniella occidentalis) has global field resistance, hence high risk only for thrips.",
        note_challenge_hexythiazox: "Bunting A rates this entry as low risk; however, peer-reviewed studies (Australia 1993, PNAS 2012 Marathonas rose strain in Greece, Cyprus 2013, and a global review) document worldwide field resistance in Tetranychus urticae. App uses web consensus: mid risk.",
      }
    };

    // ========================================================================
    // PRESENTATION HELPERS
    // ========================================================================
    const riskBadge = {
      low:  "bg-emerald-100 text-emerald-800 border-emerald-200",
      mid:  "bg-amber-100  text-amber-800  border-amber-200",
      high: "bg-rose-100   text-rose-800   border-rose-200"
    };
    const riskDot = { low: "bg-emerald-500", mid: "bg-amber-500", high: "bg-rose-500" };
    const siteAccent = {
      neural:      "border-l-violet-400",
      respiratory: "border-l-sky-400",
      growth:      "border-l-emerald-400",
      unknown:     "border-l-slate-300",
      midgut:      "border-l-orange-400"
    };

    // ========================================================================
    // ROOT COMPONENT
    // ========================================================================
    // Effective resistance risk: pest-specific when a pest filter is active,
    // otherwise the worst-case shown on the badge. Module scope so the memoized
    // card below can call it without taking it as a prop.
    const effRisk = (c, pf) =>
      pf !== 'all' ? ((c.rows.find(x => x.pest === pf) || {}).r || c.r) : c.r;

    // Only one card is expanded at a time, so tapping card B re-rendered all 69.
    // The summary is split out and memoized: every prop here is a primitive or
    // stable across renders, so the other 68 bail out instead of re-rendering.
    // The expanded detail deliberately stays in App — it is only ever built for
    // the single open card, so it does not belong behind this boundary.
    const ActiveCardSummary = React.memo(function ActiveCardSummary({ a, lang, t, pestFilter, isExpanded, onToggle }) {
      const displayName = chemLabel(a.n);
      const effR = effRisk(a, pestFilter);
      // Notes are pest-specific: show the active pest's note when filtered, else all.
      const noteRows = pestFilter !== 'all' ? a.rows.filter(x => x.pest === pestFilter) : a.rows;
      const noteKeys = [...new Set(noteRows.map(x => x.note).filter(k => k && t[`note_${k}`]))];
      const toggle = () => onToggle(`chem-${a.n}`);
      return (
        <div role="button" tabIndex={0}
             onClick={toggle}
             onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }}
             className="cursor-pointer p-3 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-base text-slate-900 break-words">{displayName}</span>
                    <span className="text-xs font-bold bg-[#114b2d] text-white px-2 py-0.5 rounded-full whitespace-nowrap">{a.g}</span>
                    {isBanned(a.n) && (
                      <span className={`text-xs font-extrabold text-white px-2 py-0.5 rounded-full whitespace-nowrap inline-flex items-center gap-1 ${BANNED_MY[a.n].restricted ? 'bg-amber-500' : 'bg-rose-600'}`}>
                        <AlertTriangle className="w-3 h-3" />{BANNED_MY[a.n].restricted ? (lang === 'zh' ? '限用' : 'RESTRICTED') : (lang === 'zh' ? '禁用' : 'BANNED')}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-slate-700 font-bold mt-1 flex items-center gap-x-3 gap-y-1 flex-wrap">
                    {a.pests.map((pid) => {
                      const p = PESTS.find(pp => pp.id === pid);
                      return (
                        <span key={pid} className="inline-flex items-center gap-1.5">
                          <PestIcon pest={pid} className="w-5 h-5 shrink-0" />
                          <span>{lang === 'zh' ? p.zh : p.en}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
                <span className={`text-sm font-extrabold px-3 py-1 rounded-full border whitespace-nowrap ${riskBadge[effR]}`}>{t[`risk_${effR}`]}</span>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5 text-xs">
                {(() => {
                  const tox = TOX_WHO[a.n] || 'NL';
                  return (
                    <span className={`px-2.5 py-1 rounded-full font-bold border ${TOX_STYLE[tox]}`}>
                      {tox === 'NL' ? TOX_LABEL[lang].NL : `${tox} · ${TOX_LABEL[lang][tox]}`}
                    </span>
                  );
                })()}
                <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full font-bold">{t[`site_${a.s}`]}</span>
                <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full font-bold">{t[`mob_${a.m}`]}</span>
                {a.tl && <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">{t.tl}</span>}
                {a.ud && <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">{t.ud}</span>}
              </div>
              {noteKeys.map((nk) => {
                const isWarning = nk === 'cross_abamectin';
                const isAdded = nk.startsWith('added_') || nk.startsWith('challenge_');
                const cls = isWarning
                  ? 'bg-amber-50 text-amber-900 border border-amber-200'
                  : isAdded
                    ? 'bg-indigo-50 text-indigo-900 border border-indigo-200'
                    : 'bg-slate-50 text-slate-700 border border-slate-200';
                return (
                  <div key={nk} className={`mt-2 flex items-start gap-1.5 text-xs font-semibold rounded-lg px-2.5 py-1.5 ${cls}`}>
                    {isWarning && <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />}
                    {isAdded && <Plus className="w-3.5 h-3.5 mt-0.5 shrink-0" />}
                    <span>{t[`note_${nk}`]}</span>
                  </div>
                );
              })}
              {/* Expand affordance — down-chevron, shown only when collapsed */}
              {!isExpanded && (
                <div className="mt-1.5 flex items-center justify-center text-slate-300">
                  <ChevronDown className="w-4 h-4" />
                </div>
              )}
        </div>
      );
    });

    function App() {
      const [lang, setLang] = useState(() => {
        try {
          const saved = localStorage.getItem('moa.lang');
          return (saved === 'zh' || saved === 'en') ? saved : 'zh';
        } catch(e) { return 'zh'; }
      });
      useEffect(() => {
        try { localStorage.setItem('moa.lang', lang); } catch(e) {}
      }, [lang]);
      const [fontScale, setFontScale] = useState(() => {
        try { return localStorage.getItem('moa.fontScale') || 'm'; } catch(e) { return 'm'; }
      });
      useEffect(() => {
        const html = document.documentElement;
        html.classList.remove('text-scale-m', 'text-scale-l');
        if (fontScale === 'm') html.classList.add('text-scale-m');
        else if (fontScale === 'l') html.classList.add('text-scale-l');
        try { localStorage.setItem('moa.fontScale', fontScale); } catch(e) {}
      }, [fontScale]);
      // Register the service worker (offline support). 'sw.js' is resolved relative to the
      // page, so it works under any GitHub Pages sub-path. Fails silently if unsupported.
      useEffect(() => {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('sw.js').catch(() => {});
        }
      }, []);
      // PWA install prompt (Chrome/Edge on desktop & Android). Capture the browser's
      // beforeinstallprompt so we can offer an in-app Install button. iOS Safari doesn't
      // fire this — there installation is manual via Share → Add to Home Screen.
      const [installPrompt, setInstallPrompt] = useState(null);
      const [showInstall, setShowInstall] = useState(false);
      useEffect(() => {
        const onPrompt = (e) => { e.preventDefault(); setInstallPrompt(e); setShowInstall(true); };
        const onInstalled = () => { setShowInstall(false); setInstallPrompt(null); };
        window.addEventListener('beforeinstallprompt', onPrompt);
        window.addEventListener('appinstalled', onInstalled);
        return () => {
          window.removeEventListener('beforeinstallprompt', onPrompt);
          window.removeEventListener('appinstalled', onInstalled);
        };
      }, []);
      const doInstall = async () => {
        if (!installPrompt) return;
        installPrompt.prompt();
        try { await installPrompt.userChoice; } catch (e) {}
        setInstallPrompt(null);
        setShowInstall(false);
      };
      const [tab, setTab] = useState('library');
      const mainRef = useRef(null);
      const [showBackToTop, setShowBackToTop] = useState(false);
      useEffect(() => {
        // Root uses min-h-screen so the WINDOW scrolls (not the <main> element).
        // Listen on window so the button actually appears.
        const onScroll = () => {
          const y = window.scrollY || document.documentElement.scrollTop || 0;
          setShowBackToTop(y > 400);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
      }, []);
      // Reset scroll position when switching tabs
      useEffect(() => {
        window.scrollTo(0, 0);
        setShowBackToTop(false);
      }, [tab]);
      const scrollToTop = () => {
        try {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (e) {
          window.scrollTo(0, 0); // fallback for older browsers
        }
      };
      const [showAssistant, setShowAssistant] = useState(false);
      const [showAbout, setShowAbout] = useState(false);
      const t = L[lang];

      // ---- Library tab state ----
      const [query, setQuery] = useState('');
      const [pestFilter, setPestFilter] = useState('all');
      const [riskFilter, setRiskFilter] = useState('all');

      // The MoA chart lists each chemical once PER pest it controls (182 rows), but
      // there are only ~72 distinct active ingredients. The Library browses chemicals,
      // so collapse to one card per unique active. Per-chemical fields (group, site,
      // mobility) are constant across pests; only resistance risk and notes are
      // pest-specific, so the original rows are kept on each entry for those.
      const RISK_ORDER = { low: 0, mid: 1, high: 2 };
      const chemicals = useMemo(() => {
        const byName = {};
        for (const a of ACTIVES) {
          if (!byName[a.n]) byName[a.n] = { ...a, pests: [], rows: [] };
          if (!byName[a.n].pests.includes(a.pest)) byName[a.n].pests.push(a.pest);
          byName[a.n].rows.push(a);
        }
        return Object.values(byName).map(c => {
          // Badge shows the worst-case (highest) resistance risk across covered pests.
          const worst = c.rows.reduce((m, x) => (RISK_ORDER[x.r] > RISK_ORDER[m] ? x.r : m), 'low');
          return { ...c, r: worst, pests: [...c.pests].sort((p, q) => PEST_INDEX[p] - PEST_INDEX[q]) };
        });
      }, []);

      const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return chemicals.filter(c => {
          if (pestFilter !== 'all' && !c.pests.includes(pestFilter)) return false;
          if (riskFilter !== 'all' && effRisk(c, pestFilter) !== riskFilter) return false;
          if (!q) return true;
          const pestNames = c.pests.map(pid => {
            const p = PESTS.find(pp => pp.id === pid);
            return p ? p.zh + ' ' + p.en : '';
          }).join(' ');
          const hay = (c.n + ' ' + c.g + ' ' + (CHEM_ZH[c.n] || c.zh || '') + ' ' + pestNames).toLowerCase();
          return hay.includes(q);
        });
      }, [query, pestFilter, riskFilter, chemicals]);

      // ---- Card expansion (one expanded at a time) ----
      const [expandedCard, setExpandedCard] = useState(null);
      // Stable across renders (functional update, empty deps) so passing it to
      // the memoized card summary does not defeat the memo.
      const handleToggle = useCallback(
        (key) => setExpandedCard(prev => (prev === key ? null : key)), []);
      // Card DOM nodes, keyed by cardKey, so we can bring a newly-opened card
      // back into view (see the effect below).
      const cardRefs = useRef({});
      // Opening a card can move it: only one card is open at a time, so if the
      // previously-open card sat ABOVE this one, it collapses in the same render
      // and everything below jumps up — often taking the tapped card's header
      // off the top of the screen. Re-anchor the header after the layout settles.
      useEffect(() => {
        if (!expandedCard) return;            // collapsing: leave the scroll alone
        const el = cardRefs.current[expandedCard];
        if (!el) return;
        // rAF so we measure after React has painted the collapse of the old card.
        const id = requestAnimationFrame(() => {
          const reduce = window.matchMedia
            && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          const GAP = 12;                     // breathing room above the header
          const top = Math.max(
            0,
            el.getBoundingClientRect().top + (window.scrollY || 0) - GAP
          );
          try {
            window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
          } catch (e) {
            window.scrollTo(0, top);          // older browsers
          }
        });
        return () => cancelAnimationFrame(id);
      }, [expandedCard]);
      // ---- Selected crop for MRL search refinement (persists globally) ----
      const [crop, setCrop] = useState(() => {
        try { return localStorage.getItem('moa.crop') || ''; } catch(e) { return ''; }
      });
      useEffect(() => {
        try { localStorage.setItem('moa.crop', crop); } catch(e) {}
      }, [crop]);

      // ---- Rotation tab state ----
      const [rotPest, setRotPest] = useState('spider_mite');
      const [rotGroup, setRotGroup] = useState('');
      const [groupPickerExpanded, setGroupPickerExpanded] = useState(false);
      const [showCrossInfo, setShowCrossInfo] = useState(false);
      // Which suggested rotation chemical is expanded inline (by name), or null.
      const [expandedRotChem, setExpandedRotChem] = useState(null);

      const rotation = useMemo(() => {
        if (!rotGroup) return null;
        // Banned actives are excluded from rotation suggestions entirely.
        const pool = ACTIVES.filter(a => a.pest === rotPest && !isBanned(a.n));
        const groupsAvail = [...new Set(pool.map(a => a.g))];
        const selectedSite = groupSite(rotGroup, ACTIVES);
        // Cross-resistant sibling groups (different code, shared target). These must NOT be
        // offered as good rotations — they go into a separate "caution" tier instead.
        const cluster = CROSS_RESISTANCE_CLUSTERS.find(c => c.groups.includes(rotGroup));
        const crossGroups = cluster ? cluster.groups.filter(g => g !== rotGroup) : [];
        const crossKind = cluster ? cluster.kind : null;
        const buildGroup = (g) => {
          // Within a group, list the gentler (less toxic) actives first.
          const items = pool.filter(a => a.g === g)
            .slice()
            .sort((x, y) => toxSev(x.n) - toxSev(y.n));
          const lowRiskCount = items.filter(x => x.r === 'low').length;
          // Best (lowest) risk tier actually present, with its count — so every card
          // shows a risk indicator, not only groups that happen to have low-risk actives.
          const bestTier = ['low', 'mid', 'high'].find(tier => items.some(x => x.r === tier)) || null;
          const bestTierCount = bestTier ? items.filter(x => x.r === bestTier).length : 0;
          const site = groupSite(g, ACTIVES);
          // Toxicity scores for sorting: toxBest = safest option in the group,
          // toxWorst = most toxic option. Lower is safer.
          const sevs = items.map(x => toxSev(x.n));
          const toxBest = sevs.length ? Math.min(...sevs) : 0;
          const toxWorst = sevs.length ? Math.max(...sevs) : 0;
          return { g, items, lowRiskCount, bestTier, bestTierCount, site, differentSite: site !== selectedSite ? 1 : 0, toxBest, toxWorst };
        };
        const suggested = groupsAvail
          .filter(g => g !== rotGroup && !crossGroups.includes(g))
          .map(buildGroup)
          .sort((a, b) => {
            // Primary: site changers rank higher — they break the cross-resistance cycle.
            if (a.differentSite !== b.differentSite) return b.differentSite - a.differentSite;
            // Then: gentler groups first — push higher-toxicity options lower down.
            if (a.toxBest !== b.toxBest) return a.toxBest - b.toxBest;
            if (a.toxWorst !== b.toxWorst) return a.toxWorst - b.toxWorst;
            // Finally: more low-(resistance-)risk actives in the group is better.
            return b.lowRiskCount - a.lowRiskCount;
          });
        // Caution: cross-resistant sibling groups that are actually available for this pest.
        const caution = groupsAvail
          .filter(g => crossGroups.includes(g))
          .map(buildGroup);
        const avoid = pool.filter(a => a.g === rotGroup);
        return { suggested, caution, crossKind, avoid };
      }, [rotPest, rotGroup]);

      const groupsForRotPest = useMemo(() => {
        const gs = [...new Set(ACTIVES.filter(a => a.pest === rotPest && !isBanned(a.n)).map(a => a.g))];
        return gs.sort((a, b) => {
          // numeric IRAC ordering, all "UN*" codes last (UN, UNB, UNE, UNF, UNM, UNP, UNV)
          const A = a.startsWith('UN') ? 999 : parseInt(a, 10);
          const B = b.startsWith('UN') ? 999 : parseInt(b, 10);
          return A - B || a.localeCompare(b);
        });
      }, [rotPest]);

      // ---- Reset rotGroup when pest changes ----
      useEffect(() => { setRotGroup(''); setGroupPickerExpanded(false); }, [rotPest]);

      // ========================================================================
      // SUB-VIEWS
      // ========================================================================

      // Shared chemical-detail body — used by the Library card AND inline under a
      // tapped Rotation-helper pill, so the two never drift. Caller supplies the
      // outer container chrome and the collapse handler.
      const renderChemDetail = (a, onCollapse) => {
        const moaText = (GROUP_MOA[lang] || {})[a.g] || '';
        const crText = (GROUP_CROSS_RESISTANCE[lang] || {})[a.g] || '';
        const cropObj = COMMON_CROPS.find(c => c.value === crop);
        const cropTerm = cropObj ? (lang === 'zh' ? cropObj.zh : cropObj.en) : '';
        // DIRECT link to this chemical's MRL-by-crop table on GB 2763-2026. NOTE:
        // 2763.foodmate.net has no working TLS — http:// loads fine (top-level http
        // nav from https is allowed); https:// loops in iOS in-app browsers. Falls
        // back to a site-restricted search for actives with no MRL page.
        const fid = CHEM_FOODMATE_ID[a.n];
        const mrlSearchURL = `https://www.google.com/search?q=${encodeURIComponent(
          `site:2763.foodmate.net ${a.n}${cropTerm ? ' ' + cropTerm : ''}`
        )}`;
        const mrlURL = fid ? `http://2763.foodmate.net/pesticides/limit/${fid}.html` : mrlSearchURL;
        const dt50URL = `https://www.google.com/search?q=${encodeURIComponent(`${a.n} DT50 PPDB`)}`;
        return (
          <div className="space-y-3">
                {isBanned(a.n) && (() => {
                  const restricted = BANNED_MY[a.n].restricted;
                  return (
                    <div className={`flex items-start gap-2 text-sm rounded-lg px-3 py-2.5 border-2 ${restricted ? 'bg-amber-50 text-amber-900 border-amber-300' : 'bg-rose-50 text-rose-800 border-rose-300'}`}>
                      <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-extrabold">
                          {restricted
                            ? (lang === 'zh' ? '限制使用 — 不可用于作物' : 'Restricted — not for crop use')
                            : (lang === 'zh' ? '马来西亚已禁用 — 请勿使用' : 'Banned in Malaysia — do not use')}
                        </div>
                        <div className={`font-semibold mt-0.5 ${restricted ? 'text-amber-800' : 'text-rose-700'}`}>{BANNED_MY[a.n][lang]}</div>
                      </div>
                    </div>
                  );
                })()}
                {EU_BANNED[a.n] && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-extrabold text-slate-500 border border-slate-300 rounded px-1.5 py-0.5">EU</span>
                    <span className="font-semibold">{lang === 'zh' ? EU_BANNED[a.n].zh : EU_BANNED[a.n].en}</span>
                  </div>
                )}
                {/* Mode of Action */}
                <div>
                  <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                    {lang === 'zh' ? '作用机制' : 'Mode of Action'} · {a.g}
                  </div>
                  <div className="text-sm text-slate-700 leading-relaxed">
                    {moaText || (lang === 'zh' ? '机制信息待补。' : 'Mechanism details to be added.')}
                  </div>
                </div>
                {/* Cross-resistance — only shown when documented for this IRAC group */}
                {crText && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-2">
                    <div className="text-[11px] font-extrabold text-amber-700 uppercase tracking-wider mb-1">
                      {lang === 'zh' ? '⚠ 交叉抗性' : '⚠ Cross-resistance'}
                    </div>
                    <div className="text-sm text-amber-900 leading-relaxed">
                      {crText}
                    </div>
                  </div>
                )}
                {BEE_TAGS[a.n] && (
                  <div>
                    <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                      {lang === 'zh' ? '蜜蜂与授粉者' : 'Bees and pollinators'}
                    </div>
                    <div className={`text-sm font-semibold rounded-lg border px-2.5 py-2 leading-snug ${BEE_STYLE[BEE_TAGS[a.n]]}`}>
                      {BEE_LABEL[BEE_TAGS[a.n]][lang === 'zh' ? 'zh' : 'en']}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                      {lang === 'zh'
                        ? '依成年蜜蜂接触急性 LD50 分级。榴莲主要由夜行的果蝠与蛾类授粉,黄昏与夜间施药同样有风险 — 开花期请尽量停喷。'
                        : 'Based on adult honeybee acute contact LD50. Durian is pollinated mainly by night-flying bats and moths, so dusk and night spraying carries risk too — avoid spraying while trees are in flower.'}
                    </div>
                  </div>
                )}
                {BENEFICIAL_TAGS[a.n] && (
                  <div>
                    <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                      {lang === 'zh' ? '对天敌 (捕食螨) 的影响' : 'Effect on natural enemies'}
                    </div>
                    <div className={`text-sm font-semibold rounded-lg border px-2.5 py-2 leading-snug ${BENEFICIAL_STYLE[BENEFICIAL_TAGS[a.n]]}`}>
                      {BENEFICIAL_LABEL[BENEFICIAL_TAGS[a.n]][lang === 'zh' ? 'zh' : 'en']}
                    </div>
                  </div>
                )}
                {(FUNGUS_TAGS[a.n] || a.n === 'Beauveria bassiana') && (
                  <div>
                    <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                      {lang === 'zh' ? '与虫生真菌 (白僵菌) 的相容性' : 'Compatibility with entomopathogenic fungi'}
                    </div>
                    {a.n === 'Beauveria bassiana' ? (
                      <div className="text-sm font-semibold rounded-lg border px-2.5 py-2 leading-snug bg-amber-100 text-amber-900 border-amber-300">
                        {lang === 'zh'
                          ? '切勿与杀菌剂混用 — 试验中所有受测杀菌剂都会抑制白僵菌的发芽与生长。部分杀虫剂亦有抑制作用,混用前请先查看对方成分卡。'
                          : 'Never tank-mix with fungicides — every fungicide tested inhibited Beauveria germination and growth. Some insecticides inhibit it too; check the other product\u2019s card before mixing.'}
                      </div>
                    ) : (
                      <div className={`text-sm font-semibold rounded-lg border px-2.5 py-2 leading-snug ${FUNGUS_STYLE[FUNGUS_TAGS[a.n]]}`}>
                        {FUNGUS_LABEL[FUNGUS_TAGS[a.n]][lang === 'zh' ? 'zh' : 'en']}
                      </div>
                    )}
                    <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                      {lang === 'zh'
                        ? '依室内 (in vitro) 试验整理,为参考方向;田间表现可能不同,建议先小面积试混。'
                        : 'From in-vitro laboratory studies — directional only. Field behaviour may differ; trial a small mix first.'}
                    </div>
                  </div>
                )}
                {ENV_TAGS[a.n] && ENV_TAGS[a.n].length > 0 && (
                  <div>
                    <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                      {lang === 'zh' ? '天气与施药时机' : 'Weather and spray timing'}
                    </div>
                    <div className="space-y-1.5">
                      {ENV_TAGS[a.n].map(tag => (
                        <div key={tag} className={`text-sm font-semibold rounded-lg border px-2.5 py-2 leading-snug ${ENV_STYLE[tag]}`}>
                          {ENV_LABEL[tag][lang === 'zh' ? 'zh' : 'en']}
                        </div>
                      ))}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                      {lang === 'zh'
                        ? '为方向性提示,依已发表研究整理;本工具不提供具体半衰期数值。实际快慢受剂型、助剂与天气影响。'
                        : 'Directional guidance from published research. No half-life figures are given here — actual persistence depends on formulation, adjuvant and weather.'}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                    {lang === 'zh' ? '安全采收间隔 (PHI)' : 'Pre-harvest interval (PHI)'}
                  </div>
                  <div className="text-sm font-semibold text-slate-700 bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-2 leading-snug">
                    {lang === 'zh'
                      ? '以产品标签为准。安全采收间隔依作物与登记产品而异,本工具不提供数值。'
                      : 'Follow the product label. The interval varies by crop and by registered product — no figure is given here.'}
                  </div>
                </div>
                {/* DT50 */}
                <div>
                  <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                    {lang === 'zh' ? '半衰期 (DT50)' : 'Half-life (DT50)'}
                  </div>
                  <a href={dt50URL} onClick={(e) => openExternal(e, dt50URL)}
                     className="text-sm text-[#114b2d] underline font-bold hover:text-emerald-700 break-all">
                    {lang === 'zh' ? `查询 ${a.n} 的 DT50 (PPDB) →` : `Look up ${a.n} DT50 (PPDB) →`}
                  </a>
                </div>
                {/* Toxicity — WHO hazard class (acute toxicity to humans) */}
                <div>
                  <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                    {lang === 'zh' ? '毒性 · WHO 危害分级' : 'Toxicity · WHO hazard class'}
                  </div>
                  <div className="text-[11px] text-slate-400 leading-snug">
                    {lang === 'zh'
                      ? '依 WHO 农药危害分级（急性毒性）。请以产品标签信号词为准。'
                      : 'Per WHO Hazard Classification (acute toxicity). Always confirm the label signal word.'}
                  </div>
                </div>
                {/* China MRL — GB 2763-2026 */}
                <div>
                  <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                    {lang === 'zh' ? '中国 MRL · GB 2763-2026' : 'China MRL · GB 2763-2026'}
                  </div>
                  {/* Crop chip row — tells the farmer which row to find in the table.
                      Selection persists globally via localStorage. */}
                  <div className="mb-4">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      {lang === 'zh' ? '你的作物' : 'Your crop'}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {COMMON_CROPS.map(c => (
                        <button key={c.value}
                          onClick={(e) => { e.stopPropagation(); setCrop(crop === c.value ? '' : c.value); }}
                          className={`text-xs px-2 py-0.5 rounded-full border-2 font-bold transition-all ${
                            crop === c.value
                              ? 'bg-emerald-600 text-white border-emerald-700'
                              : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-400'
                          }`}>
                          {lang === 'zh' ? c.zh : c.en}
                        </button>
                      ))}
                    </div>
                  </div>
                  <a href={mrlURL} onClick={(e) => openExternal(e, mrlURL)}
                     className="text-sm text-[#114b2d] underline font-bold hover:text-emerald-700 break-all block">
                    {fid
                      ? (lang === 'zh'
                          ? `📋 查看 ${a.n} 的 MRL 数据表 →`
                          : `📋 View ${a.n} MRL table →`)
                      : (lang === 'zh'
                          ? `🔍 查询 ${a.n}${cropTerm ? ' · ' + cropTerm : ''} 的 MRL →`
                          : `🔍 Search ${a.n}${cropTerm ? ' · ' + cropTerm : ''} MRL →`)}
                  </a>
                  {fid && cropTerm && (
                    <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                      {lang === 'zh'
                        ? `↳ 打开后在表中查找你的作物:「${cropTerm}」`
                        : `↳ On the page, find your crop in the table: "${cropTerm}"`}
                    </div>
                  )}
                  <div className="text-[11px] text-slate-500 mt-1.5 italic">
                    {lang === 'zh'
                      ? '数据来源:食品伙伴网 (2763.foodmate.net),仅供参考,以国家标准原文为准。'
                      : 'Data source: FoodMate (2763.foodmate.net). Reference only — verify against the official GB 2763-2026 text.'}
                  </div>
                </div>
            {/* Collapse */}
            <button onClick={onCollapse}
              aria-label={lang === 'zh' ? '收起' : 'Collapse'}
              className="w-full flex items-center justify-center text-slate-300 hover:text-slate-500 transition-colors">
              <ChevronDown className="w-4 h-4 rotate-180" />
            </button>
          </div>
        );
      };

      const renderActiveCard = (a) => {
        const cardKey = `chem-${a.n}`;
        const isExpanded = expandedCard === cardKey;
        return (
          <div key={cardKey}
               ref={(el) => { if (el) cardRefs.current[cardKey] = el; else delete cardRefs.current[cardKey]; }}
               className={`bg-white rounded-2xl border border-slate-200 border-l-4 ${siteAccent[a.s]} shadow-sm overflow-hidden`}>
            <ActiveCardSummary a={a} lang={lang} t={t} pestFilter={pestFilter}
                               isExpanded={isExpanded} onToggle={handleToggle} />
            {/* Expanded panel (sibling, not inside tappable area — so link clicks don't collapse) */}
            {isExpanded && (
              <div className="border-t border-slate-200 bg-slate-50/70 px-3 py-3 animate-in">
                {renderChemDetail(a, () => handleToggle(cardKey))}
              </div>
            )}
          </div>
        );
      };

      const renderLibraryView = () => (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={e => setQuery(e.target.value)}
              id="moa-search" name="moa-search" autoComplete="off"
              aria-label={t.searchPlaceholder}
              placeholder={t.searchPlaceholder}
              className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3 py-3 text-base focus:ring-2 focus:ring-[#114b2d]/30 focus:outline-none shadow-sm" />
          </div>

          {/* Pest tile selector — visual color-coded tiles in Malaysian farmer priority order */}
          <div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              <button onClick={() => setPestFilter('all')}
                className={`p-1.5 min-h-[80px] rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${pestFilter === 'all' ? 'bg-[#114b2d] text-white border-[#114b2d] shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:border-[#114b2d]/40'}`}>
                <PestIcon pest="all" className="w-7 h-7" />
                <span className="leading-tight">{lang==='zh'?'全部':'All'}</span>
              </button>
              {PESTS.map(p => (
                <button key={p.id} onClick={() => setPestFilter(p.id)}
                  className={`p-1.5 min-h-[80px] rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${pestFilter === p.id ? 'bg-[#114b2d] text-white border-[#114b2d] shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:border-[#114b2d]/40'}`}>
                  <PestIcon pest={p.id} className="w-7 h-7" />
                  <span className="leading-tight text-center break-words">{lang === 'zh' ? p.zh : p.en}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Risk tile selector — color-coded to match card risk badges (green/amber/rose) */}
          <div className="grid grid-cols-4 gap-1.5">
            <button onClick={() => setRiskFilter('all')}
              className={`p-2.5 rounded-xl border text-sm font-bold transition-all flex flex-col items-center justify-center gap-1 ${riskFilter === 'all' ? 'bg-[#114b2d] text-white border-[#114b2d] shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:border-[#114b2d]/40'}`}>
              <span className="flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              </span>
              <span className="leading-tight">{lang==='zh'?'全部':'All'}</span>
            </button>
            <button onClick={() => setRiskFilter('low')}
              className={`p-2.5 rounded-xl border text-sm font-bold transition-all flex flex-col items-center justify-center gap-1 ${riskFilter === 'low' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'}`}>
              <span className={`w-3 h-3 rounded-full ${riskFilter === 'low' ? 'bg-white' : 'bg-emerald-500'}`}></span>
              <span className="leading-tight">{t.risk_low}</span>
            </button>
            <button onClick={() => setRiskFilter('mid')}
              className={`p-2.5 rounded-xl border text-sm font-bold transition-all flex flex-col items-center justify-center gap-1 ${riskFilter === 'mid' ? 'bg-amber-500 text-white border-amber-500 shadow-md' : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'}`}>
              <span className={`w-3 h-3 rounded-full ${riskFilter === 'mid' ? 'bg-white' : 'bg-amber-500'}`}></span>
              <span className="leading-tight">{t.risk_mid}</span>
            </button>
            <button onClick={() => setRiskFilter('high')}
              className={`p-2.5 rounded-xl border text-sm font-bold transition-all flex flex-col items-center justify-center gap-1 ${riskFilter === 'high' ? 'bg-rose-600 text-white border-rose-600 shadow-md' : 'bg-rose-50 text-rose-900 border-rose-200 hover:bg-rose-100'}`}>
              <span className={`w-3 h-3 rounded-full ${riskFilter === 'high' ? 'bg-white' : 'bg-rose-500'}`}></span>
              <span className="leading-tight">{t.risk_high}</span>
            </button>
          </div>

          {/* Result count */}
          <div className="text-sm text-slate-500 font-semibold">
            {filtered.length} / {chemicals.length} {t.activesCount}
          </div>

          {/* Results grid */}
          {filtered.length === 0 ? (
            (() => {
              const rm = findRemoved(query);
              if (!rm) return <div className="text-center text-sm text-slate-400 py-12">{t.noResults}</div>;
              return (
                <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-base font-extrabold text-rose-800">
                        {rm.en} {rm.zh}
                      </div>
                      <div className="text-sm font-extrabold text-rose-700 mt-0.5">
                        {lang === 'zh' ? '马来西亚已禁用 — 本工具不提供' : 'Banned in Malaysia — not available in this tool'}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-rose-900 leading-relaxed">
                    {lang === 'zh' ? rm.basisZh : rm.basisEn}
                  </div>
                  <div className="text-sm text-rose-900 leading-relaxed font-semibold">
                    {lang === 'zh'
                      ? '请改用合法的替代药剂。以下是它过去常用于防治的害虫，点选可查看可用成分：'
                      : 'Please use a legal alternative. It was commonly used against these pests — tap to see what is available:'}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {rm.pests.map(pid => {
                      const p = PESTS.find(pp => pp.id === pid);
                      if (!p) return null;
                      return (
                        <button key={pid} type="button"
                          onClick={() => { setQuery(''); setPestFilter(pid); setRiskFilter('all'); }}
                          className="inline-flex items-center gap-1.5 bg-white border-2 border-rose-300 text-rose-900 rounded-xl px-3 py-2 text-sm font-bold hover:bg-rose-100 transition">
                          <PestIcon pest={pid} className="w-5 h-5" />
                          {lang === 'zh' ? p.zh : p.en}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 items-start">
              {/* items-start is load-bearing: CSS Grid defaults to align-items:stretch,
                  so every cell in a row inherits the height of the tallest. When one
                  card expands, its neighbours stretch into tall empty boxes. Aligning
                  to the start lets each cell size to its own content. */}
              {filtered.map((a) => renderActiveCard(a))}
            </div>
          )}
        </div>
      );

      // Small building blocks for the cross-resistance explainer (HTML, so text uses the
      // app font + weight and scales with the font-size control — matching the rest of the UI).
      const crDots = (tone) => (
        <span className="flex gap-1 justify-center">
          <span className={`inline-block w-3.5 h-3.5 rounded-full border-2 ${tone}`}></span>
          <span className={`inline-block w-3.5 h-3.5 rounded-full border-2 ${tone}`}></span>
        </span>
      );
      const crArrow = () => (
        <svg width="30" height="12" viewBox="0 0 30 12" className="text-slate-400 mx-auto">
          <line x1="0" y1="6" x2="23" y2="6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M21 2 L28 6 L21 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

      const renderRotateView = () => (
        <div className="space-y-5 max-w-3xl">
          {/* Pest picker */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t.selectPest}</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PESTS.map(p => (
                <button key={p.id} onClick={() => setRotPest(p.id)}
                  className={`p-3 rounded-xl border text-sm font-bold transition-all flex flex-col items-center justify-center gap-1.5 ${rotPest === p.id ? 'bg-[#114b2d] text-white border-[#114b2d] shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:border-[#114b2d]/40'}`}>
                  <PestIcon pest={p.id} className="w-10 h-10" />
                  <span className="leading-tight text-center">{lang === 'zh' ? p.zh : p.en}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Group picker — tiles tinted by site of action; collapses to a compact bar after selection */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t.lastUsed}</label>
            {(!rotGroup || groupPickerExpanded) ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 animate-in">
                {groupsForRotPest.map(g => {
                  const site = groupSite(g, ACTIVES);
                  const styles = SITE_TILE_STYLES[site] || SITE_TILE_STYLES.unknown;
                  const className_ = (lang === 'zh' ? GROUP_NAMES.zh : GROUP_NAMES.en)[g] || '';
                  const selected = rotGroup === g;
                  return (
                    <button key={g} onClick={() => { setRotGroup(g); setGroupPickerExpanded(false); }}
                      className={`p-2.5 min-h-[80px] rounded-xl border-2 font-extrabold transition-all flex flex-col items-center justify-center gap-1 ${
                        selected
                          ? 'bg-rose-600 text-white border-rose-700 shadow-md'
                          : `${styles.bg} ${styles.border} ${styles.hover}`
                      }`}>
                      <span className={`text-lg leading-none ${selected ? 'text-white' : 'text-slate-900'}`}>{g}</span>
                      {className_ && (
                        <span className={`text-[11px] leading-tight text-center font-bold ${selected ? 'text-rose-50' : styles.label}`}>
                          {className_}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              // Collapsed bar — selected group prominent, tap anywhere to re-expand
              <button onClick={() => setGroupPickerExpanded(true)}
                className="w-full p-3 rounded-xl border-2 border-rose-300 bg-rose-50 hover:bg-rose-100 flex items-center justify-between gap-3 transition-all animate-in">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="bg-rose-600 text-white px-3 py-2 rounded-lg font-extrabold text-lg leading-none shrink-0">
                    {rotGroup}
                  </div>
                  <div className="text-left min-w-0">
                    <div className="font-extrabold text-rose-900 text-sm leading-tight truncate">
                      {(lang === 'zh' ? GROUP_NAMES.zh : GROUP_NAMES.en)[rotGroup] || rotGroup}
                    </div>
                    <div className="text-xs text-rose-700 font-bold mt-0.5">
                      {t[`site_${groupSite(rotGroup, ACTIVES)}`]}
                    </div>
                  </div>
                </div>
                <div className="text-rose-600 flex items-center gap-1 shrink-0">
                  <span className="text-xs font-bold">{t.tapToChange}</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>
            )}
          </div>

          {/* Results */}
          {rotation && (
            <div className="space-y-4 animate-in">
              {/* Avoid */}
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <h3 className="text-base font-extrabold text-rose-800">{t.rotateAvoid} — {rotGroup}</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {rotation.avoid.map((a, i) => {
                    const tox = TOX_WHO[a.n] || 'NL';
                    const open = expandedRotChem === a.n;
                    return (
                    <button key={i} type="button"
                      onClick={() => setExpandedRotChem(open ? null : a.n)}
                      aria-expanded={open}
                      className={`text-sm px-2.5 py-1 rounded-lg border font-semibold inline-flex items-center transition bg-white text-rose-900 border-rose-300 ${open ? 'ring-2 ring-rose-600 ring-offset-1' : 'hover:bg-rose-100'}`}>
                      {chemLabel(a.n)}
                      <span className={`ml-1.5 text-[10px] font-extrabold px-1 py-0.5 rounded border ${TOX_STYLE[tox]}`}>{tox === 'NL' ? '—' : tox}</span>
                      <ChevronDown className={`w-3.5 h-3.5 ml-1 -mr-0.5 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </button>
                    );
                  })}
                </div>
                {(() => {
                  const openChem = rotation.avoid.find(x => x.n === expandedRotChem);
                  return openChem ? (
                    <div className="mt-2 rounded-xl border border-rose-200 bg-white px-3 py-3 animate-in">
                      {renderChemDetail(openChem, () => setExpandedRotChem(null))}
                    </div>
                  ) : null;
                })()}
              </div>

              {/* Caution — cross-resistant sibling groups (shared target site) */}
              {rotation.caution && rotation.caution.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <h3 className="text-base font-extrabold text-amber-800">
                      {t.rotateCaution} — {rotation.caution.map(c => c.g).join(' / ')}
                    </h3>
                  </div>
                  <div className="text-[13px] text-amber-800 leading-relaxed mb-2.5">
                    {rotation.crossKind === 'partial' ? t.cautionNote_partial : t.cautionNote_shared}
                  </div>
                  <div className="space-y-1.5">
                    {rotation.caution.map(({ g, items }) => (
                      <div key={g} className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-extrabold bg-amber-600 text-white px-2.5 py-0.5 rounded-full shrink-0">{g}</span>
                        {items.map((a, i) => {
                          const tox = TOX_WHO[a.n] || 'NL';
                          const open = expandedRotChem === a.n;
                          return (
                          <button key={i} type="button"
                            onClick={() => setExpandedRotChem(open ? null : a.n)}
                            aria-expanded={open}
                            className={`text-sm px-2.5 py-1 rounded-lg border font-semibold inline-flex items-center transition bg-white text-amber-900 border-amber-300 ${open ? 'ring-2 ring-amber-600 ring-offset-1' : 'hover:bg-amber-100'}`}>
                            {chemLabel(a.n)}
                            <span className={`ml-1.5 text-[10px] font-extrabold px-1 py-0.5 rounded border ${TOX_STYLE[tox]}`}>{tox === 'NL' ? '—' : tox}</span>
                            <ChevronDown className={`w-3.5 h-3.5 ml-1 -mr-0.5 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                          </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  {(() => {
                    const openChem = rotation.caution.flatMap(c => c.items).find(x => x.n === expandedRotChem);
                    return openChem ? (
                      <div className="mt-2 rounded-xl border border-amber-200 bg-white px-3 py-3 animate-in">
                        {renderChemDetail(openChem, () => setExpandedRotChem(null))}
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {/* Suggested */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <RefreshCw className="w-4 h-4 text-[#114b2d]" />
                  <h3 className="text-base font-extrabold text-[#114b2d]">{t.rotateTo}</h3>
                </div>
                <div className="space-y-2">
                  {rotation.suggested.map(({ g, items, bestTier, bestTierCount, site, differentSite }) => {
                    const styles = SITE_TILE_STYLES[site] || SITE_TILE_STYLES.unknown;
                    const className_ = (lang === 'zh' ? GROUP_NAMES.zh : GROUP_NAMES.en)[g] || '';
                    return (
                      <div key={g} className={`bg-white border border-slate-200 rounded-2xl p-3 shadow-sm border-l-4 ${styles.borderL}`}>
                        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                          <span className="text-sm font-extrabold bg-[#114b2d] text-white px-3 py-1 rounded-full">{g}</span>
                          {className_ && (
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${styles.bg} ${styles.label} border ${styles.border}`}>
                              {className_}
                            </span>
                          )}
                          {differentSite === 1 && (
                            <span className="text-xs font-extrabold bg-emerald-600 text-white px-2 py-1 rounded-full flex items-center gap-1">
                              ✓ {t.siteChanger}
                            </span>
                          )}
                          {bestTier && (
                            <span className={`text-xs font-bold border px-2 py-0.5 rounded-full ${riskBadge[bestTier]}`}>
                              {bestTierCount} {t['risk_' + bestTier]}-{lang==='zh'?'风险':'risk'}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {items.map((a, i) => {
                            const tox = TOX_WHO[a.n] || 'NL';
                            const open = expandedRotChem === a.n;
                            return (
                            <button key={i} type="button"
                              onClick={() => setExpandedRotChem(open ? null : a.n)}
                              aria-expanded={open}
                              className={`text-sm px-2.5 py-1 rounded-lg border font-semibold inline-flex items-center transition ${riskBadge[a.r]} ${open ? 'ring-2 ring-[#114b2d] ring-offset-1' : 'hover:brightness-95'}`}>
                              <span className={`inline-block w-1.5 h-1.5 rounded-full ${riskDot[a.r]} mr-1.5 align-middle`}></span>
                              {chemLabel(a.n)}
                              <span className={`ml-1.5 text-[10px] font-extrabold px-1 py-0.5 rounded border ${TOX_STYLE[tox]}`}>{tox === 'NL' ? '—' : tox}</span>
                              <ChevronDown className={`w-3.5 h-3.5 ml-1 -mr-0.5 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                          </button>
                          );
                        })}
                      </div>
                      {(() => {
                        const openChem = items.find(x => x.n === expandedRotChem);
                        return openChem ? (
                          <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-3 animate-in">
                            {renderChemDetail(openChem, () => setExpandedRotChem(null))}
                          </div>
                        ) : null;
                      })()}
                    </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Cross-resistance explainer — collapsible card, styled to match the others. */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden border-l-4 border-l-[#114b2d]">
            <button onClick={() => setShowCrossInfo(v => !v)}
              className="w-full flex items-center justify-between gap-2 p-4 text-left hover:bg-slate-50 transition-colors">
              <span className="flex items-center gap-2 text-sm font-extrabold text-[#114b2d]">
                <Info className="w-4 h-4 shrink-0" />
                {lang === 'zh' ? '什么是交叉抗性?' : 'What is cross-resistance?'}
              </span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${showCrossInfo ? 'rotate-180' : ''}`} />
            </button>
            {showCrossInfo && (
              <div className="px-4 pb-4 animate-in">
                <div className="max-w-md mx-auto space-y-3">
                  {/* Panel 1 — different target → works */}
                  <div className="rounded-xl border border-slate-200 p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <svg width="18" height="18" viewBox="0 0 18 18" className="text-emerald-600 shrink-0"><path d="M3 9 l4 4 l8 -9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-emerald-700">{lang === 'zh' ? '换到不同靶标 → 有效' : 'New target → works'}</div>
                        <div className="text-xs text-slate-500">{lang === 'zh' ? '喷 1A → 喷 28' : 'spray 1A → 28'}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-[1fr_auto_auto_auto_1fr] items-center gap-x-1.5 gap-y-1.5">
                      <div className="flex justify-center">{crDots('bg-blue-100 border-blue-600')}</div>
                      <div>{crArrow()}</div>
                      <div className="flex justify-center"><span className="px-3 py-1 rounded-full text-sm font-extrabold border-2 bg-violet-100 text-violet-800 border-violet-600 whitespace-nowrap">{lang === 'zh' ? '组 28' : 'Grp 28'}</span></div>
                      <div>{crArrow()}</div>
                      <div className="flex justify-center">{crDots('bg-slate-200 border-slate-400 opacity-70')}</div>
                      <div className="text-center text-xs font-semibold text-slate-500">{lang === 'zh' ? '存活·抗①' : 'survive ·①'}</div>
                      <div></div>
                      <div className="text-center text-xs font-semibold text-violet-700 whitespace-nowrap">{lang === 'zh' ? '新靶标 ②' : 'new ②'}</div>
                      <div></div>
                      <div className="text-center text-xs font-semibold text-emerald-700">{lang === 'zh' ? '被杀死' : 'killed'}</div>
                    </div>
                  </div>
                  {/* Panel 2 — same target → fails */}
                  <div className="rounded-xl border border-slate-200 p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <svg width="18" height="18" viewBox="0 0 18 18" className="text-rose-600 shrink-0"><path d="M4 4 l10 10 M14 4 l-10 10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-rose-700">{lang === 'zh' ? '换到相同靶标 → 失效' : 'Same target → fails'}</div>
                        <div className="text-xs text-slate-500">{lang === 'zh' ? '喷 1A → 喷 1B' : 'spray 1A → 1B'}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-[1fr_auto_auto_auto_1fr] items-center gap-x-1.5 gap-y-1.5">
                      <div className="flex justify-center">{crDots('bg-blue-100 border-blue-600')}</div>
                      <div>{crArrow()}</div>
                      <div className="flex justify-center"><span className="px-3 py-1 rounded-full text-sm font-extrabold border-2 bg-blue-100 text-blue-800 border-blue-600 whitespace-nowrap">{lang === 'zh' ? '组 1B' : 'Grp 1B'}</span></div>
                      <div>{crArrow()}</div>
                      <div className="flex justify-center">{crDots('bg-blue-100 border-blue-600')}</div>
                      <div className="text-center text-xs font-semibold text-slate-500">{lang === 'zh' ? '存活·抗①' : 'survive ·①'}</div>
                      <div></div>
                      <div className="text-center text-xs font-semibold text-blue-700 whitespace-nowrap">{lang === 'zh' ? '相同靶标 ①' : 'same ①'}</div>
                      <div></div>
                      <div className="text-center text-xs font-semibold text-rose-700">{lang === 'zh' ? '仍存活' : 'alive'}</div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mt-3">
                  {lang === 'zh'
                    ? '颜色代表农药攻击的「靶标」。喷雾 B 若颜色相同,就是打同一个靶标 — 害虫已经抗它,轮替等于没换 (这就是交叉抗性)。'
                    : 'Colour = the target a pesticide attacks. If spray B is the same colour, it hits the same target — the pests already resist it, so the rotation changes nothing. That is cross-resistance.'}
                </p>
              </div>
            )}
          </div>
        </div>
      );

      const renderMixView = () => (
        <div className="max-w-2xl">
          <div className="mb-4 text-sm text-slate-600 font-medium leading-relaxed">
            {lang === 'zh'
              ? '按下方顺序加入水箱,可达到最佳杀虫效果并避免药剂互相干扰。'
              : 'Follow this order when filling the spray tank to maximise efficacy and avoid chemical interference.'}
          </div>
          <ol className="space-y-2">
            {MIX_SEQUENCE.map(s => (
              <li key={s.step} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#114b2d] text-white text-base font-extrabold flex items-center justify-center shrink-0">{s.step}</div>
                <div className="text-base text-slate-800 font-semibold pt-1.5 leading-relaxed">{lang === 'zh' ? s.zh : s.en}</div>
              </li>
            ))}
          </ol>
          <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-900 leading-relaxed">
            <div className="font-extrabold mb-1 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> {lang === 'zh' ? '重要' : 'Important'}</div>
            {lang === 'zh'
              ? '切勿与 Glyphosate (草甘膦) 同箱混用其他杀虫剂或杀菌剂。'
              : 'Never tank-mix insecticides or fungicides with Glyphosate.'}
          </div>
        </div>
      );

      // ========================================================================
      // MAIN LAYOUT
      // ========================================================================
      return (
        <div className="min-h-screen bg-[#fcfbf7] text-slate-800 flex flex-col font-sans">
          {/* Header — pad the top/sides by the safe-area insets so the Dynamic
              Island / notch never covers the controls in installed (standalone) mode. */}
          <header
            style={{
              paddingTop: 'calc(0.75rem + env(safe-area-inset-top))',
              paddingLeft: 'max(1rem, env(safe-area-inset-left))',
              paddingRight: 'max(1rem, env(safe-area-inset-right))',
            }}
            className="bg-[#f4f2ea] border-b border-slate-300 py-3 flex items-center justify-between gap-3 z-10 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 bg-[#114b2d] rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
                <Bug className="w-5 h-5" />
              </div>
              {/* Title + credit: shown from the sm breakpoint up. Hidden on phones so the
                  controls get the full width (the credit still lives in the About dialog). */}
              <div className="min-w-0 hidden sm:block">
                <h1 className="font-extrabold text-base sm:text-lg text-slate-900 truncate">{t.appTitle}</h1>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide truncate">{t.appSubtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {/* Font-size toggle: A / A / A — uniform 40px height, evenly sized segments */}
              <div className="flex items-center h-11 bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden">
                {[
                  { id: 's', label: 'A', size: 'text-xs', aria: lang==='zh'?'小字':'Small text' },
                  { id: 'm', label: 'A', size: 'text-sm', aria: lang==='zh'?'中字':'Medium text' },
                  { id: 'l', label: 'A', size: 'text-base', aria: lang==='zh'?'大字':'Large text' }
                ].map(b => (
                  <button key={b.id} onClick={() => setFontScale(b.id)}
                    aria-label={b.aria}
                    className={`h-full w-8 flex items-center justify-center ${b.size} font-extrabold transition-all ${fontScale === b.id ? 'bg-[#114b2d] text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                    {b.label}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowAbout(true)}
                className="w-11 h-11 flex items-center justify-center rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 shadow-sm transition-all shrink-0"
                aria-label={t.about}>
                <Info className="w-5 h-5" />
              </button>
              <button onClick={() => setLang(l => l === 'zh' ? 'en' : 'zh')}
                className="h-11 min-w-[5rem] justify-center text-sm font-bold px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 transition-all border border-slate-300 shadow-sm flex items-center gap-1.5 shrink-0">
                <Layers className="w-4 h-4" />
                {t.langSwitch}
              </button>
            </div>
          </header>

          {/* Tabs */}
          <div className="bg-white border-b border-slate-200 px-2 sm:px-6 shrink-0">
            <div className="flex gap-1 sm:gap-3 overflow-x-auto no-scrollbar">
              {[
                { id: 'library', icon: Search,    label: t.tabLibrary },
                { id: 'rotate',  icon: RefreshCw, label: t.tabRotate },
                { id: 'mix',     icon: Beaker,    label: t.tabMix }
              ].map(it => (
                <button key={it.id} onClick={() => setTab(it.id)}
                  className={`pb-3 pt-3 px-3 text-base font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${tab === it.id ? 'text-[#114b2d] border-[#114b2d]' : 'text-slate-400 border-transparent hover:text-slate-700'}`}>
                  <it.icon className="w-4 h-4" /> {it.label}
                </button>
              ))}
            </div>
          </div>

          {/* Install banner — only shows when the browser reports the app is installable
              (Chrome/Edge desktop & Android). Hidden on iOS, where install is via Share. */}
          {showInstall && (
            <div className="bg-[#114b2d] text-white px-4 py-2.5 flex items-center justify-between gap-3 shrink-0 animate-in">
              <span className="text-sm font-semibold flex items-center gap-2 min-w-0">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span className="truncate">{lang === 'zh' ? '安装为应用,离线也能用' : 'Install as an app — works offline'}</span>
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={doInstall}
                  className="text-sm font-extrabold bg-white text-[#114b2d] px-4 py-1 rounded-full hover:bg-slate-100 transition-colors">
                  {lang === 'zh' ? '安装' : 'Install'}
                </button>
                <button onClick={() => setShowInstall(false)} aria-label={lang === 'zh' ? '关闭' : 'Dismiss'}
                  className="text-white/70 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Main content */}
          {/* Bottom padding is set inline, not via pb-*, for two reasons:
              (1) sm:p-6 lives in a media query the compiler emits AFTER .pb-20,
                  so a utility class silently loses at >=640px;
              (2) the back-to-top FAB is offset by env(safe-area-inset-bottom),
                  so the content must clear the same inset or it sits under it.
              Clearance = 1.25rem offset + 3rem button + margin, plus the inset. */}
          <main ref={mainRef} className="flex-1 overflow-y-auto p-4 sm:p-6"
                style={{ paddingBottom: 'calc(5.5rem + env(safe-area-inset-bottom))' }}>
            {tab === 'library' && renderLibraryView()}
            {tab === 'rotate' && renderRotateView()}
            {tab === 'mix' && renderMixView()}
          </main>

          {/* Back-to-top button (appears after scrolling) */}
          {showBackToTop && (
            <button onClick={scrollToTop}
              style={{
                bottom: 'calc(1.25rem + env(safe-area-inset-bottom))',
                right: 'calc(1.25rem + env(safe-area-inset-right))',
              }}
              className="fixed z-30 w-12 h-12 bg-white hover:bg-slate-50 text-[#114b2d] rounded-full shadow-lg flex items-center justify-center border-2 border-[#114b2d] transition-all hover:scale-105 animate-in"
              aria-label={t.backToTop}>
              <ArrowUp className="w-5 h-5" />
            </button>
          )}

          {/* About / source modal */}
          {showAbout && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in" onClick={() => setShowAbout(false)}>
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-5 border-b border-slate-200">
                  <h2 className="text-base font-extrabold text-slate-900">{t.about}</h2>
                  <button onClick={() => setShowAbout(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-5 space-y-4 text-base text-slate-800 font-semibold leading-relaxed">
                  <p>{t.aboutText}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                      <div className="text-2xl font-extrabold text-[#114b2d]">{PESTS.length}</div>
                      <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mt-0.5">{lang==='zh'?'种害虫':'pest categories'}</div>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                      <div className="text-2xl font-extrabold text-[#114b2d]">{chemicals.length}</div>
                      <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mt-0.5">{t.activesCount}</div>
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-700" />
                      <div className="font-extrabold text-base text-amber-900">{t.safetyTitle}</div>
                    </div>
                    <p className="text-sm text-amber-900 font-semibold leading-relaxed">{t.safetyText}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Mount
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  