
    const { useState, useRef, useEffect, useMemo } = React;

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
    const ChevronRight = (p) => <Icon {...p} path='<polyline points="9 18 15 12 9 6"/>' />;
    const ChevronDown = (p) => <Icon {...p} path='<polyline points="6 9 12 15 18 9"/>' />;
    const AlertTriangle = (p) => <Icon {...p} path='<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>' />;
    const ArrowUp = (p) => <Icon {...p} path='<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>' />;
    const Layers = (p) => <Icon {...p} path='<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>' />;
    const Plus = (p) => <Icon {...p} path='<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>' />;

    // ========================================================================
    // DATABASE — derived from "Bunting A" insecticide rotation chart (Tee, 2024)
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

    const ACTIVES = [
      // GRASSHOPPER & BEETLES
      {pest:"grasshopper",g:"1A",n:"Carbaryl",s:"neural",r:"high",m:"LS"},
      {pest:"grasshopper",g:"1B",n:"Dimethoate",s:"neural",r:"high",m:"S"},
      {pest:"grasshopper",g:"1B",n:"Acephate",s:"neural",r:"high",m:"S"},
      {pest:"grasshopper",g:"2A",n:"Endosulfan",s:"neural",r:"high",m:"N"},
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
      {pest:"spider_mite",g:"16",n:"Buprofezin",s:"growth",r:"low",m:"N"},
      {pest:"spider_mite",g:"23",n:"Spirotetramat",s:"growth",r:"low",m:"S",tl:true,ud:true},
      {pest:"spider_mite",g:"23",n:"Spirodiclofen",s:"growth",r:"low",m:"N"},
      {pest:"spider_mite",g:"UN",n:"Dicofol",s:"unknown",r:"low",m:"N",note:"cross_abamectin"},
      {pest:"spider_mite",g:"UNF",n:"Beauveria bassiana",zh:"白僵菌",s:"unknown",r:"low",m:"N"},
      {pest:"spider_mite",g:"UN",n:"Azadirachtin",zh:"印楝油",s:"unknown",r:"low",m:"S"},
      // MEALYBUG
      {pest:"mealybug",g:"1A",n:"Carbaryl",s:"neural",r:"high",m:"LS"},
      {pest:"mealybug",g:"1A",n:"Methomyl",s:"neural",r:"high",m:"S",tl:true,note:"challenge_methomyl"},
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
      {pest:"mealybug",g:"28",n:"Cyantraniliprole",s:"neural",r:"mid",m:"S",tl:true,note:"added_tl"},
      {pest:"mealybug",g:"29",n:"Flonicamid",s:"neural",r:"low",m:"SS",tl:true},
      {pest:"mealybug",g:"30",n:"Isocycloseram",s:"neural",r:"low",m:"N",note:"added_new_chem"},
      {pest:"mealybug",g:"7B",n:"Fenoxycarb",s:"growth",r:"low",m:"N"},
      {pest:"mealybug",g:"7C",n:"Pyriproxyfen",s:"growth",r:"low",m:"N",tl:true},
      {pest:"mealybug",g:"16",n:"Buprofezin",s:"growth",r:"low",m:"N"},
      {pest:"mealybug",g:"23",n:"Spirotetramat",s:"growth",r:"low",m:"S",tl:true,ud:true},
      {pest:"mealybug",g:"UN",n:"Azadirachtin",zh:"印楝油",s:"unknown",r:"low",m:"S"},
      {pest:"mealybug",g:"UNM",n:"White Oil",s:"unknown",r:"low",m:"N",note:"added_white_oil"},
      // CATERPILLAR
      {pest:"caterpillar",g:"1A",n:"Carbaryl",s:"neural",r:"high",m:"LS"},
      {pest:"caterpillar",g:"1B",n:"Dimethoate",s:"neural",r:"high",m:"S"},
      {pest:"caterpillar",g:"2A",n:"Endosulfan",s:"neural",r:"high",m:"N"},
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
      {pest:"caterpillar",g:"14",n:"Cartap hydrochloride",s:"neural",r:"mid",m:"S",tl:true,note:"added_cartap"},
      {pest:"caterpillar",g:"22A",n:"Indoxacarb",s:"neural",r:"mid",m:"N"},
      {pest:"caterpillar",g:"22B",n:"Metaflumizone",s:"neural",r:"low",m:"N",note:"added_meta"},
      {pest:"caterpillar",g:"28",n:"Chlorantraniliprole",s:"neural",r:"mid",m:"SS",tl:true},
      {pest:"caterpillar",g:"28",n:"Flubendiamide",s:"neural",r:"mid",m:"LS",tl:true},
      {pest:"caterpillar",g:"13",n:"Chlorfenapyr",s:"respiratory",r:"low",m:"LS",tl:true},
      {pest:"caterpillar",g:"21A",n:"Tolfenpyrad",s:"respiratory",r:"low",m:"N"},
      {pest:"caterpillar",g:"21B",n:"Rotenone",zh:"鱼藤",s:"respiratory",r:"low",m:"N"},
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
      {pest:"psyllid",g:"2A",n:"Endosulfan",s:"neural",r:"high",m:"N"},
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
      {pest:"psyllid",g:"14",n:"Cartap hydrochloride",s:"neural",r:"mid",m:"S",tl:true,note:"added_cartap"},
      {pest:"psyllid",g:"28",n:"Cyantraniliprole",s:"neural",r:"mid",m:"S",tl:true,note:"added_tl"},
      {pest:"psyllid",g:"12A",n:"Diafenthiuron",s:"respiratory",r:"low",m:"N"},
      {pest:"psyllid",g:"13",n:"Chlorfenapyr",s:"respiratory",r:"low",m:"LS",tl:true},
      {pest:"psyllid",g:"21A",n:"Pyridaben",s:"respiratory",r:"low",m:"N"},
      {pest:"psyllid",g:"21A",n:"Tolfenpyrad",s:"respiratory",r:"low",m:"N"},
      {pest:"psyllid",g:"21B",n:"Rotenone",zh:"鱼藤",s:"respiratory",r:"low",m:"N",note:"added_rotenone"},
      {pest:"psyllid",g:"7C",n:"Pyriproxyfen",s:"growth",r:"low",m:"N",tl:true,note:"added_pyriproxyfen"},
      {pest:"psyllid",g:"16",n:"Buprofezin",s:"growth",r:"low",m:"N"},
      {pest:"psyllid",g:"23",n:"Spirotetramat",s:"growth",r:"low",m:"S",tl:true,ud:true},
      {pest:"psyllid",g:"UN",n:"Dicofol",s:"unknown",r:"low",m:"N"},
      {pest:"psyllid",g:"UNF",n:"Beauveria bassiana",zh:"白僵菌",s:"unknown",r:"low",m:"N",note:"added_beauveria"},
      {pest:"psyllid",g:"UN",n:"Azadirachtin",zh:"印楝油",s:"unknown",r:"low",m:"S"},
      // THRIPS
      {pest:"thrips",g:"1A",n:"Carbaryl",s:"neural",r:"high",m:"LS"},
      {pest:"thrips",g:"1A",n:"Methomyl",s:"neural",r:"high",m:"S",tl:true,note:"challenge_methomyl"},
      {pest:"thrips",g:"1B",n:"Methamidophos",s:"neural",r:"high",m:"S"},
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
      {pest:"thrips",g:"14",n:"Cartap hydrochloride",s:"neural",r:"mid",m:"S",tl:true,note:"challenge_cartap"},
      {pest:"thrips",g:"22A",n:"Indoxacarb",s:"neural",r:"mid",m:"N"},
      {pest:"thrips",g:"28",n:"Cyantraniliprole",s:"neural",r:"mid",m:"S",tl:true,note:"added_tl"},
      {pest:"thrips",g:"29",n:"Flonicamid",s:"neural",r:"low",m:"SS",tl:true},
      {pest:"thrips",g:"30",n:"Isocycloseram",s:"neural",r:"low",m:"N"},
      {pest:"thrips",g:"36",n:"Dimpropyridaz",s:"neural",r:"low",m:"N"},
      {pest:"thrips",g:"12A",n:"Diafenthiuron",s:"respiratory",r:"low",m:"N"},
      {pest:"thrips",g:"13",n:"Chlorfenapyr",s:"respiratory",r:"low",m:"LS",tl:true},
      {pest:"thrips",g:"21A",n:"Tolfenpyrad",s:"respiratory",r:"low",m:"N"},
      {pest:"thrips",g:"21B",n:"Rotenone",zh:"鱼藤",s:"respiratory",r:"low",m:"N"},
      {pest:"thrips",g:"15",n:"Novaluron",s:"growth",r:"low",m:"N"},
      {pest:"thrips",g:"23",n:"Spirotetramat",s:"growth",r:"low",m:"S",tl:true,ud:true},
      {pest:"thrips",g:"UN",n:"Azadirachtin",zh:"印楝油",s:"unknown",r:"low",m:"S"},
      {pest:"thrips",g:"UN",n:"Pyridalyl",s:"unknown",r:"low",m:"S"},
      // LEAFHOPPER
      {pest:"leafhopper",g:"1A",n:"Carbaryl",s:"neural",r:"high",m:"LS"},
      {pest:"leafhopper",g:"1A",n:"Methomyl",s:"neural",r:"high",m:"S",tl:true,note:"challenge_methomyl"},
      {pest:"leafhopper",g:"1A",n:"Isoprocarb",s:"neural",r:"high",m:"N"},
      {pest:"leafhopper",g:"1A",n:"Fenobucarb",s:"neural",r:"high",m:"N"},
      {pest:"leafhopper",g:"1A",n:"Carbosulfan",s:"neural",r:"high",m:"S"},
      {pest:"leafhopper",g:"1B",n:"Dimethoate",s:"neural",r:"high",m:"S"},
      {pest:"leafhopper",g:"1B",n:"Chlorpyrifos",s:"neural",r:"high",m:"N"},
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
      {pest:"leafhopper",g:"14",n:"Cartap hydrochloride",s:"neural",r:"mid",m:"S",tl:true,note:"challenge_cartap"},
      {pest:"leafhopper",g:"22A",n:"Indoxacarb",s:"neural",r:"mid",m:"N"},
      {pest:"leafhopper",g:"28",n:"Cyantraniliprole",s:"neural",r:"mid",m:"S",tl:true,note:"challenge_tl"},
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
        appTitle: "虫药轮替助手", appSubtitle: "依据 Tee 先生《Bunting A》机制图整理",
        tabLibrary: "机制库", tabRotate: "轮替助手", tabMix: "调配顺序",
        assistant: "快速查询", assistantHint: "问问特定害虫、机制或活性成分…",
        searchPlaceholder: "搜寻活性成分、机制或害虫…",
        filterAll: "全部", filterRisk: "抗药性风险", filterSite: "作用部位",
        selectPest: "选择害虫", lastUsed: "上次用过的 IRAC 机制组",
        rotateTo: "建议轮替", rotateAvoid: "避免使用 (相同机制)",
        site_neural: "神经与肌肉", site_respiratory: "呼吸系统",
        site_growth: "生长与发育", site_unknown: "未知 / 无特定", site_midgut: "中肠 (Bt)",
        risk_low: "低", risk_mid: "中", risk_high: "高",
        mob_N: "接触", mob_S: "系统", mob_SS: "选择系统", mob_LS: "局部系统",
        tl: "穿层渗透", ud: "上下移行",
        noResults: "没有符合的结果。",
        about: "资料来源",
        aboutText: "本工具的所有资料整理自 Tee 先生 2024 年 7-8 月编制的《Bunting A》杀虫剂作用机制 (MoA) 轮替指南。包含 7 类常见害虫与 180+ 活性成分。每次用药请轮替不同的 IRAC 机制组,以延缓抗药性发生。",
        safetyTitle: "农户安全提醒",
        safetyText: "本指南仅为机制轮替参考。实际用药前请: ① 核对农药标签所列适用作物与虫害, ② 遵守安全采收间隔期 (PHI), ③ 不要与 Glyphosate (草甘膦) 混用其他杀虫剂, ④ 留意对授粉昆虫与天敌的影响。",
        groupsCount: "个机制组", activesCount: "个活性成分",
        warningHigh: "高抗药性风险",
        legend: "图例", langSwitch: "EN", backToTop: "回到顶部",
        note_cross_abamectin: "与 Abamectin (Group 6) 有交叉抗药性,不应轮替使用",
        note_piercing_sucking: "对刺吸式害虫更有效",
        note_added_afido: "Bunting A 未列抗药性资料;白粉虱已有田间抗药性报告 (36-104 倍),建议谨慎使用",
        note_added_tl: "Bunting A 未列穿层渗透;IRAC 文献确认此化学具穿层渗透特性",
        note_added_new_chem: "Bunting A 未列抗药性资料;新化学,目前无田间抗药性或交叉抗药性报告",
        note_added_white_oil: "Bunting A 未列资料;IRAC 报告此类油剂从未出现抗药性,作用为物理性窒息",
        note_added_cartap: "Bunting A 未列抗药性;番茄夜蛾 (巴西)、菜蛾 (中国) 已有田间抗药性报告;商品资料显示具系统性、接触性与穿层渗透",
        note_added_meta: "Bunting A 列为低风险;甜菜夜蛾 Spodoptera exigua (中国广东) 田间已出现高抗药性 (60-942 倍, 2014 年研究),建议监测使用",
        note_added_bt: "Bunting A 未列细节;Plutella xylostella (小菜蛾)、Helicoverpa zea、Spodoptera frugiperda 等鳞翅目害虫已有田间抗药性报告 (Tabashnik 综述等);由幼虫取食后中肠激活,接触+取食活性",
        note_added_pyriproxyfen: "Bunting A 未列穿层渗透;Ishaaya & Horowitz 1995 与 2020 综述均证实此 IGR 具穿层渗透特性",
        note_added_rotenone: "Bunting A 列为系统性,但 IRAC、AERU、PIM、ScienceDirect 等权威资料皆指鱼藤为非系统性,仅具接触与胃毒作用",
        note_added_beauveria: "Bunting A 未列作用方式;白僵菌孢子需附着虫体表皮,以芽管穿透角质层感染,属接触性",
        note_challenge_tl: "Bunting A 在此项标示非穿层渗透;但 IRAC 文献、PubMed 同行评审论文、商品标签 (Benevia、Minecto Xtra 等) 一致确认 Cyantraniliprole 具穿层渗透特性。本应用采纳网络共识",
        note_challenge_cartap: "Bunting A 此条目标示为低风险;但 Tuta absoluta (巴西)、Plutella xylostella (中国)、Cnaphalocrocis medinalis (印度 Kerala) 已有田间抗药性报告。本应用采纳网络共识为中风险,并补上穿层渗透特性",
        note_challenge_pymetrozine: "Bunting A 此条目未标穿层渗透;但 Wyss & Bolsinger 1997、LSU Ag Center、维基百科等多源确认 Pymetrozine 同时具系统性 (木质部+韧皮部) 与穿层渗透特性",
        note_added_diafen_mite: "本品对其他害虫风险较低,但红蜘蛛已有 10-40 倍田间抗药性 (Kerala 印度 Tetranychus gloveri 2025、T. truncatus 2019 研究记录),故仅红蜘蛛标为中风险",
        note_added_pyridaben_mite: "本品对其他害虫风险较低,但红蜘蛛已有极高田间抗药性 (最高达 5500 倍,Tetranychus urticae 多国报告),故仅红蜘蛛标为高风险",
        note_added_spinetoram_thrips: "本品对其他害虫风险较低,但西方花蓟马 (Frankliniella occidentalis) 已有全球性田间抗药性,故仅蓟马标为高风险",
        note_challenge_methomyl: "Bunting A 此条目未标穿层渗透;但 Lannate (DuPont) 与 Methomyl 90 SP 等多家厂商商品标签、UF Extension 及 ScienceDirect 均确认 Methomyl 具系统性、接触性与穿层渗透三重作用",
        note_challenge_hexythiazox: "Bunting A 此条目标示低风险;但澳洲 1993、PNAS 2012 (希腊 Marathonas 玫瑰株)、塞浦路斯 2013 等多项同行评审研究记录二点叶蝉 Tetranychus urticae 对 Hexythiazox 全球性田间抗药性,本应用采纳网络共识为中风险",
        ask1: "红蜘蛛该如何轮替?", ask2: "Imidacloprid 属于哪一组?",
        ask3: "毛毛虫的低风险选择?", ask4: "什么是穿层渗透?",
        replyIntro: "你好!请从下方挑选快速问题,或用搜寻查特定成分/机制。",
        replyMobility_TL: "穿层渗透 (Translaminar) 指农药可穿透叶片表皮,作用于叶背隐藏的害虫 (例如红蜘蛛)。",
        replyMobility_S: "系统性 (Systemic) 农药可由根或叶吸收进入植物维管束输送,适用于藏在叶鞘内或树皮下的害虫。"
      },
      en: {
        appTitle: "Pest MoA", appSubtitle: "Built from Tee's 'Bunting A' MoA chart",
        tabLibrary: "MoA Library", tabRotate: "Rotation Helper", tabMix: "Tank-Mix Order",
        assistant: "Quick Lookup", assistantHint: "Ask about a pest, group, or active ingredient…",
        searchPlaceholder: "Search active, group or pest…",
        filterAll: "All", filterRisk: "risks", filterSite: "Action site",
        selectPest: "Select pest", lastUsed: "Last-used IRAC group",
        rotateTo: "Rotate to", rotateAvoid: "Avoid (same group)",
        site_neural: "Nerve & Muscle", site_respiratory: "Respiration",
        site_growth: "Growth & Development", site_unknown: "Unknown / Non-specific", site_midgut: "Midgut (Bt)",
        risk_low: "Low", risk_mid: "Med", risk_high: "High",
        mob_N: "Contact", mob_S: "Systemic", mob_SS: "Selective syst.", mob_LS: "Local syst.",
        tl: "Translaminar", ud: "Xylem/Phloem mobile",
        noResults: "No matches.",
        about: "About this data",
        aboutText: "All data is curated from Tee's July-August 2024 'Bunting A' insecticide mode-of-action (MoA) rotation chart. 7 pest groups, 180+ active ingredients. Rotate IRAC groups every spray to slow resistance.",
        safetyTitle: "Farmer Safety Notes",
        safetyText: "This is a rotation guide, not a prescription. Before spraying: ① check the product label for crop & pest, ② respect the pre-harvest interval (PHI), ③ never tank-mix insecticides with Glyphosate, ④ consider pollinators and beneficials.",
        groupsCount: "MoA groups", activesCount: "active ingredients",
        warningHigh: "High resistance risk",
        legend: "Legend", langSwitch: "中文", backToTop: "Back to top",
        note_cross_abamectin: "Cross-resistance with Abamectin (Group 6); do not rotate between them",
        note_piercing_sucking: "More effective against piercing-sucking pests",
        note_added_afido: "Not in Bunting A; field resistance documented in whitefly (36-104×). Use with care.",
        note_added_tl: "Not in Bunting A; IRAC sources confirm this chemistry is translaminar",
        note_added_new_chem: "Not in Bunting A; new chemistry, no field resistance or cross-resistance reported yet",
        note_added_white_oil: "Not in Bunting A; IRAC reports no resistance ever observed (physical suffocation)",
        note_added_cartap: "Not in Bunting A; field resistance reported in Tuta absoluta (Brazil) and Plutella xylostella (China). Commercial sources describe systemic, contact and translaminar action.",
        note_added_meta: "Bunting A rates this low; field resistance in beet armyworm Spodoptera exigua (Guangdong, China) documented at 60.3-942× (2014 study). Use with monitoring.",
        note_added_bt: "Bunting A only gave IRAC code; field resistance documented in lepidopteran pests including Plutella xylostella, Helicoverpa zea, and Spodoptera frugiperda (per Tabashnik review and others). Activated in larval midgut after ingestion (contact + stomach action).",
        note_added_pyriproxyfen: "Not in Bunting A; translaminar action confirmed by Ishaaya & Horowitz (1995) on cotton leaves and by 2020 fate review.",
        note_added_rotenone: "Bunting A marks as systemic, but IRAC, AERU, PIM 474, ScienceDirect all describe rotenone as non-systemic with contact and stomach action only.",
        note_added_beauveria: "Not in Bunting A; spores must adhere to insect cuticle, then penetrate via germ tubes — fundamentally a contact-action biopesticide.",
        note_challenge_tl: "Bunting A marks this entry as not translaminar; however, IRAC sources, peer-reviewed PubMed papers, and commercial labels (Benevia, Minecto Xtra, etc.) all confirm cyantraniliprole has translaminar action. App uses the web consensus.",
        note_challenge_cartap: "Bunting A rates this entry as low risk; however, field resistance is documented in Tuta absoluta (Brazil), Plutella xylostella (China), and Cnaphalocrocis medinalis (Kerala, India). App uses web consensus: mid risk with translaminar action.",
        note_challenge_pymetrozine: "Bunting A does not mark this entry as translaminar; however, Wyss & Bolsinger 1997, LSU Ag Center, Wikipedia, and other sources confirm pymetrozine has both systemic (xylem + phloem) and translaminar action.",
        note_added_diafen_mite: "Low risk on other pests, but red spider mite has documented 10-40× field resistance (Kerala India: Tetranychus gloveri 2025 study, T. truncatus 2019 Anushree et al.), hence mid risk only for mites.",
        note_added_pyridaben_mite: "Low risk on other pests, but red spider mite has extreme field resistance (up to 5500× in Tetranychus urticae across multiple countries), hence high risk only for mites.",
        note_added_spinetoram_thrips: "Lower risk on other pests, but western flower thrips (Frankliniella occidentalis) has global field resistance, hence high risk only for thrips.",
        note_challenge_methomyl: "Bunting A does not mark this entry as translaminar; however, multiple manufacturer labels (Lannate by DuPont, Methomyl 90 SP), UF Extension, and ScienceDirect all confirm methomyl has systemic, contact, and translaminar action.",
        note_challenge_hexythiazox: "Bunting A rates this entry as low risk; however, peer-reviewed studies (Australia 1993, PNAS 2012 Marathonas rose strain in Greece, Cyprus 2013, and a global review) document worldwide field resistance in Tetranychus urticae. App uses web consensus: mid risk.",
        ask1: "How do I rotate for red spider mite?", ask2: "Which group is Imidacloprid?",
        ask3: "Low-risk options for caterpillars?", ask4: "What is translaminar?",
        replyIntro: "Hi! Pick a quick question below, or use search to find a specific active/group.",
        replyMobility_TL: "Translaminar means the chemical penetrates the leaf surface and reaches pests on the underside (e.g. spider mites).",
        replyMobility_S: "Systemic chemicals are absorbed by roots or foliage and moved through the plant's vascular system — useful for pests hiding inside sheaths or under bark."
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
      const [tab, setTab] = useState('library');
      const mainRef = useRef(null);
      const [showBackToTop, setShowBackToTop] = useState(false);
      useEffect(() => {
        const el = mainRef.current;
        if (!el) return;
        const onScroll = () => setShowBackToTop(el.scrollTop > 400);
        el.addEventListener('scroll', onScroll, { passive: true });
        return () => el.removeEventListener('scroll', onScroll);
      }, []);
      // Reset scroll position when switching tabs
      useEffect(() => {
        if (mainRef.current) mainRef.current.scrollTop = 0;
        setShowBackToTop(false);
      }, [tab]);
      const scrollToTop = () => {
        const el = mainRef.current;
        if (!el) return;
        try {
          el.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (e) {
          el.scrollTop = 0; // fallback for older browsers
        }
      };
      const [showAssistant, setShowAssistant] = useState(false);
      const [showAbout, setShowAbout] = useState(false);
      const t = L[lang];

      // ---- Library tab state ----
      const [query, setQuery] = useState('');
      const [pestFilter, setPestFilter] = useState('all');
      const [riskFilter, setRiskFilter] = useState('all');

      const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return ACTIVES.filter(a => {
          if (pestFilter !== 'all' && a.pest !== pestFilter) return false;
          if (riskFilter !== 'all' && a.r !== riskFilter) return false;
          if (!q) return true;
          const pestObj = PESTS.find(p => p.id === a.pest);
          const hay = (a.n + ' ' + a.g + ' ' + (a.zh||'') + ' ' + pestObj.zh + ' ' + pestObj.en).toLowerCase();
          return hay.includes(q);
        });
      }, [query, pestFilter, riskFilter]);

      // ---- Rotation tab state ----
      const [rotPest, setRotPest] = useState('spider_mite');
      const [rotGroup, setRotGroup] = useState('');

      const rotation = useMemo(() => {
        if (!rotGroup) return null;
        const pool = ACTIVES.filter(a => a.pest === rotPest);
        const groupsAvail = [...new Set(pool.map(a => a.g))];
        const suggested = groupsAvail
          .filter(g => g !== rotGroup)
          .map(g => {
            const items = pool.filter(a => a.g === g);
            const lowRiskCount = items.filter(x => x.r === 'low').length;
            return { g, items, lowRiskCount };
          })
          .sort((a, b) => b.lowRiskCount - a.lowRiskCount); // prefer low-risk groups
        const avoid = pool.filter(a => a.g === rotGroup);
        return { suggested, avoid };
      }, [rotPest, rotGroup]);

      const groupsForRotPest = useMemo(() => {
        const gs = [...new Set(ACTIVES.filter(a => a.pest === rotPest).map(a => a.g))];
        return gs.sort((a, b) => {
          // numeric IRAC ordering, all "UN*" codes last (UN, UNB, UNE, UNF, UNM, UNP, UNV)
          const A = a.startsWith('UN') ? 999 : parseInt(a, 10);
          const B = b.startsWith('UN') ? 999 : parseInt(b, 10);
          return A - B || a.localeCompare(b);
        });
      }, [rotPest]);

      // ---- Reset rotGroup when pest changes ----
      useEffect(() => { setRotGroup(''); }, [rotPest]);

      // ========================================================================
      // SUB-VIEWS
      // ========================================================================

      const renderActiveCard = (a, i) => {
        const pestObj = PESTS.find(p => p.id === a.pest);
        const displayName = lang === 'zh' && a.zh ? `${a.zh} (${a.n})` : a.n;
        return (
          <div key={i} className={`bg-white rounded-2xl border border-slate-200 border-l-4 ${siteAccent[a.s]} p-3 shadow-sm`}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-base text-slate-900 break-words">{displayName}</span>
                  <span className="text-xs font-bold bg-[#114b2d] text-white px-2 py-0.5 rounded-full whitespace-nowrap">{a.g}</span>
                </div>
                <div className="text-sm text-slate-700 font-bold mt-1 truncate">{pestObj.emoji} {lang === 'zh' ? pestObj.zh : pestObj.en}</div>
              </div>
              <span className={`text-sm font-extrabold px-3 py-1 rounded-full border whitespace-nowrap ${riskBadge[a.r]}`}>{t[`risk_${a.r}`]}</span>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5 text-xs">
              <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full font-bold">{t[`site_${a.s}`]}</span>
              <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full font-bold">{t[`mob_${a.m}`]}</span>
              {a.tl && <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">{t.tl}</span>}
              {a.ud && <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">{t.ud}</span>}
            </div>
            {a.note && t[`note_${a.note}`] && (() => {
              const isWarning = a.note === 'cross_abamectin';
              const isAdded = a.note.startsWith('added_') || a.note.startsWith('challenge_');
              const cls = isWarning
                ? 'bg-amber-50 text-amber-900 border border-amber-200'
                : isAdded
                  ? 'bg-indigo-50 text-indigo-900 border border-indigo-200'
                  : 'bg-slate-50 text-slate-700 border border-slate-200';
              return (
                <div className={`mt-2 flex items-start gap-1.5 text-xs font-semibold rounded-lg px-2.5 py-1.5 ${cls}`}>
                  {isWarning && <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />}
                  {isAdded && <Plus className="w-3.5 h-3.5 mt-0.5 shrink-0" />}
                  <span>{t[`note_${a.note}`]}</span>
                </div>
              );
            })()}
          </div>
        );
      };

      const renderLibraryView = () => (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3 py-3 text-base focus:ring-2 focus:ring-[#114b2d]/30 focus:outline-none shadow-sm" />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select value={pestFilter} onChange={e => setPestFilter(e.target.value)}
              className="flex-1 min-w-0 bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#114b2d]/30 truncate">
              <option value="all">{lang==='zh'?'全部害虫':'All pests'}</option>
              {PESTS.map(p => <option key={p.id} value={p.id}>{p.emoji} {lang==='zh'?p.zh:p.en}</option>)}
            </select>
            <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)}
              className="flex-1 min-w-0 bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#114b2d]/30 truncate">
              <option value="all">{t.filterAll} {t.filterRisk}</option>
              <option value="low">{t.risk_low}</option>
              <option value="mid">{t.risk_mid}</option>
              <option value="high">{t.risk_high}</option>
            </select>
          </div>

          {/* Result count */}
          <div className="text-sm text-slate-500 font-semibold">
            {filtered.length} / {ACTIVES.length} {t.activesCount}
          </div>

          {/* Results grid */}
          {filtered.length === 0 ? (
            <div className="text-center text-sm text-slate-400 py-12">{t.noResults}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map((a, i) => renderActiveCard(a, i))}
            </div>
          )}
        </div>
      );

      const renderRotateView = () => (
        <div className="space-y-5 max-w-3xl">
          {/* Pest picker */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t.selectPest}</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PESTS.map(p => (
                <button key={p.id} onClick={() => setRotPest(p.id)}
                  className={`p-3 rounded-xl border text-sm font-bold transition-all ${rotPest === p.id ? 'bg-[#114b2d] text-white border-[#114b2d] shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:border-[#114b2d]/40'}`}>
                  <div className="text-3xl mb-1.5">{p.emoji}</div>
                  {lang === 'zh' ? p.zh : p.en}
                </button>
              ))}
            </div>
          </div>

          {/* Group picker */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t.lastUsed}</label>
            <div className="flex flex-wrap gap-2">
              {groupsForRotPest.map(g => (
                <button key={g} onClick={() => setRotGroup(g)}
                  className={`px-4 py-2.5 rounded-xl text-base font-extrabold border transition-all ${rotGroup === g ? 'bg-rose-600 text-white border-rose-600 shadow-md' : 'bg-white text-slate-700 border-slate-300 hover:border-rose-400'}`}>
                  {g}
                </button>
              ))}
            </div>
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
                <div className="text-sm text-rose-700 font-semibold">
                  {rotation.avoid.map(a => lang==='zh' && a.zh ? `${a.zh} (${a.n})` : a.n).join(' · ')}
                </div>
              </div>

              {/* Suggested */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <RefreshCw className="w-4 h-4 text-[#114b2d]" />
                  <h3 className="text-base font-extrabold text-[#114b2d]">{t.rotateTo}</h3>
                </div>
                <div className="space-y-2">
                  {rotation.suggested.slice(0, 8).map(({ g, items, lowRiskCount }) => (
                    <div key={g} className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-extrabold bg-[#114b2d] text-white px-3 py-1 rounded-full">{g}</span>
                        {lowRiskCount > 0 && (
                          <span className="text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                            {lowRiskCount} {t.risk_low}-{lang==='zh'?'风险':'risk'}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {items.map((a, i) => (
                          <span key={i} className={`text-sm px-2.5 py-1 rounded-lg border font-semibold ${riskBadge[a.r]}`}>
                            <span className={`inline-block w-1.5 h-1.5 rounded-full ${riskDot[a.r]} mr-1.5 align-middle`}></span>
                            {lang==='zh' && a.zh ? `${a.zh}` : a.n}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
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
      // QUICK-LOOKUP ASSISTANT (canned, honest)
      // ========================================================================
      const handleQuickAsk = (question) => {
        let answer;
        // Each canned reply is keyed to a specific button, kept short and factual.
        if (question === 'rotate_mite') {
          const groups = [...new Set(ACTIVES.filter(a => a.pest === 'spider_mite').map(a => a.g))];
          answer = lang === 'zh'
            ? `红蜘蛛在资料库中有 ${groups.length} 个机制组可用 (${groups.join(', ')})。建议避免连续使用 1A/1B/3A/4A (高抗药性风险),改用 13、23、25A 等低风险组。`
            : `Red spider mite has ${groups.length} groups available (${groups.join(', ')}). Avoid repeating 1A/1B/3A/4A (high resistance risk); rotate into low-risk groups like 13, 23, 25A.`;
        } else if (question === 'imidacloprid_group') {
          answer = lang === 'zh'
            ? `Imidacloprid 属于 IRAC 第 4A 组 (Neonicotinoid)。系统性、具穿层渗透,但抗药性风险高,常用于粉蚧、蓟马、木虱、青蚊。`
            : `Imidacloprid is IRAC group 4A (Neonicotinoid). Systemic with translaminar movement, but high resistance risk. Common against mealybugs, thrips, psyllids, leafhoppers.`;
        } else if (question === 'low_risk_caterpillar') {
          const low = ACTIVES.filter(a => a.pest === 'caterpillar' && a.r === 'low');
          answer = lang === 'zh'
            ? `毛毛虫的低风险选择有 ${low.length} 个: ${low.map(a => a.n).slice(0, 8).join(', ')}${low.length > 8 ? '…' : ''}。生长抑制剂 (Group 15、18) 和 Bt (11A) 是温和的好选择。`
            : `${low.length} low-risk options for caterpillars: ${low.map(a => a.n).slice(0, 8).join(', ')}${low.length > 8 ? '…' : ''}. Growth regulators (Group 15, 18) and Bt (11A) are gentle picks.`;
        } else if (question === 'what_is_tl') {
          answer = t.replyMobility_TL;
        }
        setChatLog(prev => [...prev, { role: 'user', text: question }, { role: 'bot', text: answer }]);
      };

      const [chatLog, setChatLog] = useState([{ role: 'bot', text: L[lang].replyIntro }]);
      const chatRef = useRef(null);
      useEffect(() => {
        if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }, [chatLog]);
      // Reset intro line when language changes
      useEffect(() => {
        setChatLog([{ role: 'bot', text: L[lang].replyIntro }]);
      }, [lang]);

      const askButtons = [
        { id: 'rotate_mite',          label: t.ask1 },
        { id: 'imidacloprid_group',   label: t.ask2 },
        { id: 'low_risk_caterpillar', label: t.ask3 },
        { id: 'what_is_tl',           label: t.ask4 }
      ];

      // ========================================================================
      // MAIN LAYOUT
      // ========================================================================
      return (
        <div className="min-h-screen bg-[#fcfbf7] text-slate-800 flex flex-col font-sans">
          {/* Header */}
          <header className="bg-[#f4f2ea] border-b border-slate-300 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 z-10 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 bg-[#114b2d] rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
                <Bug className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="font-extrabold text-base sm:text-lg text-slate-900 truncate">{t.appTitle}</h1>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide truncate">{t.appSubtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {/* Font-size toggle: A / A / A */}
              <div className="flex items-center bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden">
                {[
                  { id: 's', label: 'A', size: 'text-xs', aria: lang==='zh'?'小字':'Small text' },
                  { id: 'm', label: 'A', size: 'text-sm', aria: lang==='zh'?'中字':'Medium text' },
                  { id: 'l', label: 'A', size: 'text-base', aria: lang==='zh'?'大字':'Large text' }
                ].map(b => (
                  <button key={b.id} onClick={() => setFontScale(b.id)}
                    aria-label={b.aria}
                    className={`px-2 py-2 ${b.size} font-extrabold transition-all min-w-[1.75rem] ${fontScale === b.id ? 'bg-[#114b2d] text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                    {b.label}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowAbout(true)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 shadow-sm transition-all"
                aria-label={t.about}>
                <Info className="w-5 h-5" />
              </button>
              <button onClick={() => setLang(l => l === 'zh' ? 'en' : 'zh')}
                className="text-sm font-bold px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 transition-all border border-slate-300 shadow-sm flex items-center gap-1.5">
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

          {/* Main content */}
          <main ref={mainRef} className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24">
            {tab === 'library' && renderLibraryView()}
            {tab === 'rotate' && renderRotateView()}
            {tab === 'mix' && renderMixView()}
          </main>

          {/* Back-to-top button (appears after scrolling) */}
          {showBackToTop && (
            <button onClick={scrollToTop}
              className="fixed bottom-24 right-5 z-30 w-12 h-12 bg-white hover:bg-slate-50 text-[#114b2d] rounded-full shadow-lg flex items-center justify-center border-2 border-[#114b2d] transition-all hover:scale-105 animate-in"
              aria-label={t.backToTop}>
              <ArrowUp className="w-5 h-5" />
            </button>
          )}

          {/* Floating assistant button */}
          <button onClick={() => setShowAssistant(true)}
            className="fixed bottom-5 right-5 z-30 w-14 h-14 bg-[#114b2d] hover:bg-emerald-800 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105"
            aria-label={t.assistant}>
            <Sparkles className="w-6 h-6" />
          </button>

          {/* Assistant drawer (slide-up sheet on mobile, side panel on desktop) */}
          {showAssistant && (
            <>
              <div className="fixed inset-0 bg-black/30 z-40 animate-in" onClick={() => setShowAssistant(false)}></div>
              <div className="fixed inset-x-0 bottom-0 sm:inset-y-0 sm:right-0 sm:left-auto sm:w-96 bg-[#fcfbf7] z-50 rounded-t-3xl sm:rounded-none shadow-2xl flex flex-col max-h-[85vh] sm:max-h-none animate-in">
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#114b2d]" />
                    <h2 className="text-base font-extrabold text-slate-800">{t.assistant}</h2>
                  </div>
                  <button onClick={() => setShowAssistant(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatLog.map((m, i) => (
                    <div key={i} className={`text-base font-semibold leading-relaxed rounded-2xl p-3 border ${m.role === 'user' ? 'bg-slate-100 border-slate-200 ml-8' : 'bg-emerald-50/60 border-emerald-100 mr-8'}`}>
                      {m.text}
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.assistantHint}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {askButtons.map(b => (
                      <button key={b.id} onClick={() => handleQuickAsk(b.id)}
                        className="text-sm font-semibold text-slate-700 hover:text-[#114b2d] bg-white border border-slate-300 hover:border-[#114b2d]/40 rounded-full px-3 py-1.5 transition-colors shadow-sm">
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
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
                      <div className="text-2xl font-extrabold text-[#114b2d]">{ACTIVES.length}</div>
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
  