import "server-only";
import type { Experiment, TopicInfo, TopicId, TranscriptSegment } from "./types";

export const TOPICS: TopicInfo[] = [
  {
    id: "acids-bases",
    iconName: "FlaskConical",
    accentColor: "#087F8C",
    softBg: "#EAE3F5",
    title: {
      en: "Acids & Bases",
      ky: "Кислоталар жана негиздер",
      ru: "Кислоты и основания",
    },
    description: {
      en: "See how natural and lab indicators change color across the pH scale.",
      ky: "Табигый жана лабораториялык индикаторлордун өңүнүн өзгөрүшүн байкаңыз.",
      ru: "Наглядные переходы окраски индикаторов и реакции нейтрализации.",
    },
  },
  {
    id: "reactions",
    iconName: "Sparkles",
    accentColor: "#087F8C",
    softBg: "#F7DED0",
    title: {
      en: "Chemical Reactions",
      ky: "Химиялык реакциялар",
      ru: "Химические реакции",
    },
    description: {
      en: "Watch rapid catalysis, color-changing clock reactions, and golden crystals.",
      ky: "Тез катализди, саат реакцияларын жана жаркыраган чөкмөлөрдү көрүңүз.",
      ru: "Быстрый катализ, часовые реакции и выпадение кристаллов.",
    },
  },
  {
    id: "gases",
    iconName: "Wind",
    accentColor: "#087F8C",
    softBg: "#DCECF6",
    title: {
      en: "Gas Tests",
      ky: "Газдарды аныктоо",
      ru: "Опыты с газами",
    },
    description: {
      en: "Generate and test hydrogen, oxygen, and carbon dioxide in the lab.",
      ky: "Лабораторияда суутек, кычкылтек жана көмүр кычкыл газын таануу.",
      ru: "Получение и распознавание водорода, кислорода и углекислого газа.",
    },
  },
  {
    id: "metals",
    iconName: "Shield",
    accentColor: "#087F8C",
    softBg: "#DCE9DF",
    title: {
      en: "Metals & Reactivity",
      ky: "Металлдар",
      ru: "Металлы и активность",
    },
    description: {
      en: "Compare how different metals displace ions, grow crystal trees, and react.",
      ky: "Металлдардын орун алмашуу реакцияларын жана активдүүлүгүн салыштырыңыз.",
      ru: "Реакции замещения, серебряное дерево и активность металлов.",
    },
  },
  {
    id: "solutions",
    iconName: "Droplets",
    accentColor: "#087F8C",
    softBg: "#DCE9DF",
    title: {
      en: "Crystals & Solutions",
      ky: "Кристаллдар жана эритмелер",
      ru: "Кристаллы и растворы",
    },
    description: {
      en: "Trigger instant crystallization and grow geometric mineral crystals.",
      ky: "Көз ирмемдик кристаллдашууну жана геометриялык кристаллдарды өстүрүү.",
      ru: "Мгновенная кристаллизация и выращивание кристаллов из растворов.",
    },
  },
  {
    id: "separation",
    iconName: "Layers",
    accentColor: "#087F8C",
    softBg: "#EAE3F5",
    title: {
      en: "Separation Methods",
      ky: "Аралашмаларды бөлүү",
      ru: "Разделение смесей",
    },
    description: {
      en: "Separate pigments and purify liquids with chromatography and distillation.",
      ky: "Хроматография, чыпкалоо жана дистилляция аркылуу заттарды тазалоо.",
      ru: "Бумажная хроматография, фильтрование и простая перегонка.",
    },
  },
  {
    id: "electrochemistry",
    iconName: "Zap",
    accentColor: "#087F8C",
    softBg: "#DCECF6",
    title: {
      en: "Electrochemistry",
      ky: "Электрохимия",
      ru: "Электрохимия",
    },
    description: {
      en: "Split water with electricity and build working chemical batteries.",
      ky: "Электр тогу менен сууну ажыратып, химиялык батарея куруңуз.",
      ru: "Электролиз воды и солей, работа гальванических элементов.",
    },
  },
  {
    id: "energy",
    iconName: "Flame",
    accentColor: "#087F8C",
    softBg: "#F7DED0",
    title: {
      en: "Flame & Energy",
      ky: "Жалын жана энергия",
      ru: "Пламя и энергия",
    },
    description: {
      en: "Identify elements by flame colors and measure heat release in reactions.",
      ky: "Жалындын өңү боюнча металлдарды таанып, жылуулук кубулуштарын ченеңиз.",
      ru: "Окрашивание пламени и тепловые эффекты химических процессов.",
    },
  },
];

const CORE_EXPERIMENTS: Experiment[] = [
  {
    id: "exp-01",
    slug: "red-cabbage-ph-indicator",
    topicId: "acids-bases",
    durationSeconds: 260,
    safetyLevel: "student_lab",
    featured: true,
    youtubeVideo: "https://www.youtube.com/watch?v=I18K2upEHLc",
    chemicalEquation: "HIn (aq, red, pH < 3) ⇌ H⁺ (aq) + In⁻ (aq, blue/green, pH > 8)",
    illustration: "indicator-flask",
    title: {
      en: "Natural pH Rainbow with Red Cabbage Indicator",
      ky: "Кызыл кочандан алынган табигый pH-индикатор спектри",
      ru: "Природная шкала pH из индикатора краснокочанной капусты",
    },
    shortDescription: {
      en: "See how anthocyanin pigments shift from ruby red in acids to violet, blue, and emerald green in bases.",
      ky: "Антоцианин пигменттери кислотада кызылдан негизде көк жана жашыл өңгө кантип өтөрүн байкаңыз.",
      ru: "Наблюдайте, как антоцианы меняют окраску от рубиново-красной в кислотах до синей и изумрудной в щелочах.",
    },
    objectives: {
      en: [
        "Explain how anthocyanin molecules change structure across the pH scale (pH 1–13).",
        "Distinguish acidic, neutral, and alkaline solutions visually using a natural indicator.",
        "Relate color transitions to hydrogen ion concentration [H⁺].",
      ],
      ky: [
        "Антоцианин молекулаларынын pH 1–13 шкаласында өңүн өзгөртүү себебин түшүндүрүү.",
        "Кислоталуу, нейтралдуу жана щелочтуу эритмелерди табигый индикатор менен айырмалоо.",
        "Өңдүн өзгөрүшүн суутек иондорунун [H⁺] концентрациясы менен байланыштыруу.",
      ],
      ru: [
        "Объяснить изменение структуры молекул антоцианов в диапазоне pH 1–13.",
        "Различать кислую, нейтральную и щелочную среду с помощью природного индикатора.",
        "Связать изменение окраски с концентрацией ионов водорода [H⁺].",
      ],
    },
    materials: {
      en: ["Aqueous red cabbage extract", "6 test tubes in a rack", "Dilute HCl (0.1 M)", "Vinegar (CH₃COOH)", "Distilled water", "Sodium bicarbonate (NaHCO₃)", "Dilute NaOH (0.1 M)", "Safety goggles & gloves"],
      ky: ["Кызыл кочандын суудагы экстракты", "Штативдеги 6 пробирка", "Суюлтулган HCl (0.1 М)", "Уксус кислотасы (CH₃COOH)", "Дистилденген суу", "Аш содасы (NaHCO₃)", "Суюлтулган NaOH (0.1 М)", "Коргоочу көз айнек жана кол кап"],
      ru: ["Водный экстракт краснокочанной капусты", "Штатив с 6 пробирками", "Разбавленная HCl (0,1 М)", "Уксусная кислота (CH₃COOH)", "Дистиллированная вода", "Гидрокарбонат натрия (NaHCO₃)", "Разбавленный NaOH (0,1 М)", "Защитные очки и перчатки"],
    },
    safetyNotes: {
      en: [
        "Wear splash-proof safety goggles and nitrile gloves when handling dilute hydrochloric acid (HCl) and sodium hydroxide (NaOH).",
        "Sodium hydroxide is corrosive to skin and eyes; rinse immediately with plenty of water if contact occurs.",
      ],
      ky: [
        "Суюлтулган туз кислотасы (HCl) жана натрий гидроксиди (NaOH) менен иштегенде сөзсүз коргоочу көз айнек жана кол кап кийиңиз.",
        "Щелочь териге тийсе, дароо көп өлчөмдөгү агын суу менен жууңуз.",
      ],
      ru: [
        "Используйте защитные очки и перчатки при работе с разбавленными растворами соляной кислоты (HCl) и гидроксида натрия (NaOH).",
        "Щёлочи едки для кожи и глаз — при попадании немедленно промойте большим количеством воды.",
      ],
    },
    scientificExplanation: {
      en: [
        "Red cabbage leaves contain water-soluble flavylium pigments called anthocyanins. Unlike litmus or phenolphthalein which only show two colors, anthocyanins undergo multiple reversible proton-transfer steps.",
        "In strongly acidic solutions (pH < 3), the fully protonated flavylium cation dominates and absorbs light to appear bright red. Around neutral pH 7, a quinoidal base form appears violet. In alkaline conditions (pH 8–11), anionic forms turn blue and bluish-green, while in strong alkali (pH > 12) chalcone formation yields a yellow solution.",
      ],
      ky: [
        "Кызыл кочандын жалбырактарында сууда эрүүчү антоцианин пигменттери бар. Ал протонду кошуп алуу же берүү аркылуу бир нече баскычтуу кайтарымдуу реакцияга кирет.",
        "Күчтүү кислотада (pH < 3) флавилий катиону кызыл өң берет. Нейтралдуу чөйрөдө (pH 7) кызгылт-көк, щелочтуу чөйрөдө (pH 8–11) көк жана жашыл, ал эми күчтүү щелочто (pH > 12) сары өң пайда болот.",
      ],
      ru: [
        "Листья краснокочанной капусты содержат водорастворимые пигменты — антоцианы. В отличие от фенолфталеина, они способны последовательно отдавать несколько протонов (H⁺), образуя формы с разной длиной сопряжённых связей.",
        "В сильнокислой среде (pH < 3) преобладает красный катион флавилия. В нейтральной среде (pH 7) раствор фиолетовый, в слабощелочной (pH 8–11) — синий и изумрудно-зелёный, а в сильнощелочной (pH > 12) переходит в жёлтый халкон.",
      ],
    },
    steps: [
      {
        timeSeconds: 12,
        title: { en: "Extract preparation", ky: "Экстрактты даярдоо", ru: "Приготовление экстракта" },
        detail: {
          en: "Warm chopped red cabbage in distilled water and filter to obtain a deep violet stock indicator (pH ~7).",
          ky: "Тууралган кызыл кочанды жылуу дистилденген сууга салып, чыпкалап кочкул сыя өңдөгү экстракт алабыз.",
          ru: "Настаиваем измельчённую капусту в тёплой дистиллированной воде и фильтруем фиолетовый раствор (pH ~7).",
        },
      },
      {
        timeSeconds: 65,
        title: { en: "Acidic tubes (pH 1–4)", ky: "Кислоталуу пробиркалар (pH 1–4)", ru: "Кислая среда (pH 1–4)" },
        detail: {
          en: "Adding dilute HCl and vinegar immediately turns the violet solution crimson and rose-pink.",
          ky: "Суюлтулган HCl жана уксус кошулганда эритме дароо ачык кызыл жана кызгылт өңгө өтөт.",
          ru: "При добавлении HCl и уксусной кислоты раствор мгновенно становится ярко-красным и розовым.",
        },
      },
      {
        timeSeconds: 140,
        title: { en: "Alkaline tubes (pH 8–13)", ky: "Щелочтуу пробиркалар (pH 8–13)", ru: "Щелочная среда (pH 8–13)" },
        detail: {
          en: "Adding sodium bicarbonate and dilute NaOH shifts the indicator through royal blue to emerald green and gold.",
          ky: "Аш содасы жана NaOH кошулганда индикатор көк, зумруд жашыл жана сары өңгө өзгөрөт.",
          ru: "Гидрокарбонат и гидроксид натрия переводят окраску в синюю, изумрудно-зелёную и жёлтую.",
        },
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: {
          en: "What color does red cabbage anthocyanin indicator turn when added to a weakly alkaline baking soda (NaHCO₃, pH ~8.5) solution?",
          ky: "Кызыл кочандын антоцианин индикаторун аш содасынын (NaHCO₃, pH ~8.5) начар щелочтуу эритмесине кошкондо кандай өңгө өтөт?",
          ru: "Какую окраску принимает антоциановый индикатор при добавлении в слабощелочной раствор питьевой соды (NaHCO₃, pH ~8,5)?",
        },
        options: [
          {
            id: "a",
            text: { en: "Bright ruby red", ky: "Ачык кызыл", ru: "Ярко-красную" },
            isCorrect: false,
            explanation: {
              en: "Bright red appears in strongly acidic solutions (pH < 3) where the pigment is fully protonated.",
              ky: "Ачык кызыл өң күчтүү кислоталуу чөйрөдө (pH < 3) гана байкалат.",
              ru: "Ярко-красная окраска характерна для сильнокислой среды (pH < 3).",
            },
          },
          {
            id: "b",
            text: { en: "Blue to teal-green", ky: "Көк же көгүш-жашыл", ru: "Синюю / сине-зелёную" },
            isCorrect: true,
            explanation: {
              en: "Correct! At pH 8–9, deprotonation of the anthocyanin molecule shifts its absorption spectrum so it appears blue-green.",
              ky: "Туура! pH 8–9 чегинде антоцианин протонду берип, көк же көгүш-жашыл өңгө өтөт.",
              ru: "Верно! При pH 8–9 депротонированная форма антоциана окрашивает раствор в синий и сине-зелёный цвет.",
            },
          },
          {
            id: "c",
            text: { en: "Colorless precipitate", ky: "Түссүз чөкмө", ru: "Бесцветный осадок" },
            isCorrect: false,
            explanation: {
              en: "Anthocyanins remain dissolved in water and remain strongly colored across the pH range.",
              ky: "Антоцианиндер сууда эриген бойдон калат жана түссүз чөкмө бербейт.",
              ru: "Антоцианы остаются в растворе и сохраняют интенсивную окраску.",
            },
          },
        ],
      },
      {
        id: "q2",
        prompt: {
          en: "Why can red cabbage extract distinguish more pH regions than phenolphthalein?",
          ky: "Эмне үчүн кызыл кочандын экстракты фенолфталеинге караганда pH шкаласынын көбүрөөк бөлүгүн айырмалай алат?",
          ru: "Почему экстракт краснокочанной капусты позволяет различить больше областей pH, чем фенолфталеин?",
        },
        options: [
          {
            id: "a",
            text: {
              en: "It undergoes multiple reversible protonation equilibria, forming several distinctly colored molecular species.",
              ky: "Ал бир нече баскычтуу кайтарымдуу протон алмашууга кирип, ар кандай өңдөгү формаларды пайда кылат.",
              ru: "Он вступает в несколько ступеней протолитического равновесия, образуя ряд разноокрашенных форм.",
            },
            isCorrect: true,
            explanation: {
              en: "Exactly! Each protonation state has a different conjugated π-system and absorbs different wavelengths of visible light.",
              ky: "Эң туура! Ар бир баскычта молекуланын түзүлүшү өзгөрүп, жарыктын башка толкун узундугун жутат.",
              ru: "Точно! Каждая форма имеет разную систему сопряжённых связей и поглощает свет разной длины волны.",
            },
          },
          {
            id: "b",
            text: {
              en: "It boils at a lower temperature than synthetic indicators.",
              ky: "Ал синтетикалык индикаторлорго караганда төмөн температурада кайнайт.",
              ru: "Он кипит при более низкой температуре, чем синтетические индикаторы.",
            },
            isCorrect: false,
            explanation: {
              en: "Boiling point does not determine acid–base color transitions in aqueous solution.",
              ky: "Кайноо температурасы индикатордун өңүнүн өзгөрүшүнө таасир этпейт.",
              ru: "Температура кипения не определяет кислотно-основные переходы окраски.",
            },
          },
        ],
      },
    ],
  },
  {
    id: "exp-02",
    slug: "catalytic-decomposition-hydrogen-peroxide",
    topicId: "reactions",
    durationSeconds: 215,
    safetyLevel: "teacher_demo",
    featured: true,
    youtubeVideo: "https://www.youtube.com/watch?v=p1eG2y2mn54",
    chemicalEquation: "2H₂O₂ (aq) —[KI / MnO₂]→ 2H₂O (l) + O₂ (g) + ΔH",
    illustration: "peroxide-foam",
    title: {
      en: "Catalytic Decomposition of Hydrogen Peroxide (Elephant Toothpaste)",
      ky: "Суутек пероксидинин каталитикалык ажыроосу («Пилдин тиш пастасы»)",
      ru: "Каталитическое разложение пероксида водорода («Зубная паста для слона»)",
    },
    shortDescription: {
      en: "Watch iodide ions dramatically accelerate H₂O₂ decomposition, trapping oxygen gas in a rising column of warm foam.",
      ky: "Иодид иондору H₂O₂ ажыроосун кантип ылдамдатып, кычкылтек газын жылуу көбүккө айлантарын көрүңүз.",
      ru: "Увидьте, как ионы иодида ускоряют разложение H₂O₂ в тысячи раз, превращая выделяющийся кислород в столб тёплой пены.",
    },
    objectives: {
      en: [
        "Define the role of a catalyst in lowering activation energy (Eₐ) without being consumed.",
        "Identify the gas trapped inside the foam bubbles as molecular oxygen (O₂).",
        "Explain why steam rises from the foam (exothermic reaction, ΔH < 0).",
      ],
      ky: [
        "Катализатордун активдешүү энергиясын (Eₐ) төмөндөтүү ролун түшүндүрүү.",
        "Көбүктүн ичиндеги газ кычкылтек (O₂) экенин аныктоо.",
        "Реакция эмне үчүн жылуулук бөлүп чыгаруу менен (экзотермиялык, ΔH < 0) жүрөрүн түшүнүү.",
      ],
      ru: [
        "Объяснить роль катализатора в снижении энергии активации (Eₐ).",
        "Определить, что пена наполнена выделяющимся газообразным кислородом (O₂).",
        "Объяснить выделение пара экзотермическим характером реакции (ΔH < 0).",
      ],
    },
    materials: {
      en: ["Hydrogen peroxide H₂O₂ (6–12% teacher demo grade)", "Potassium iodide (KI) solution (2 M)", "Liquid dish soap", "500 mL graduated cylinder & catch tray", "Glowing wooden splint", "Goggles, lab coat & thermal gloves"],
      ky: ["Суутек пероксиди H₂O₂ (6–12%)", "Калий иодидинин (KI) эритмеси (2 М)", "Суюк самын", "500 мл өлчөөчү цилиндр жана табакча", "Чок болуп турган чырпык", "Коргоочу көз айнек, халат жана кол кап"],
      ru: ["Пероксид водорода H₂O₂ (6–12%)", "Раствор иодида калия KI (2 М)", "Жидкое мыло", "Мерный цилиндр на 500 мл и поддон", "Тлеющая лучинка", "Защитные очки, халат и перчатки"],
    },
    safetyNotes: {
      en: [
        "Teacher demonstration only when using >3% H₂O₂. Concentrated hydrogen peroxide is a strong oxidizer that causes skin burns.",
        "The reaction is strongly exothermic — the foam and cylinder become hot (>75 °C). Do not touch freshly formed foam with bare hands.",
      ],
      ky: [
        "3% жогору H₂O₂ колдонулганда тажрыйбаны мугалим гана көрсөтөт. Концентрацияланган пероксид терини күйгүзөт.",
        "Реакция экзотермиялык болгондуктан көбүк абдан ысык болот (>75 °C) — колуңуз менен кармабаңыз.",
      ],
      ru: [
        "Демонстрация проводится только учителем. Концентрированный H₂O₂ вызывает ожоги кожи и слизистых.",
        "Реакция сильно экзотермична (>75 °C) — не прикасайтесь к свежей пене без перчаток.",
      ],
    },
    scientificExplanation: {
      en: [
        "On its own at room temperature, hydrogen peroxide decomposes into water and oxygen very slowly because the uncatalyzed O–O bond cleavage has a high activation energy (~75 kJ/mol).",
        "When iodide ions (I⁻) are added, they provide an alternative two-step pathway via hypoiodite (IO⁻) with a much lower activation energy: Step 1: H₂O₂ + I⁻ → H₂O + IO⁻; Step 2: H₂O₂ + IO⁻ → H₂O + O₂ (g) + I⁻. Notice that I⁻ is regenerated in Step 2, acting as a true catalyst while releasing ~196 kJ of heat per 2 moles of H₂O₂.",
      ],
      ky: [
        "Бөлмө температурасында суутек пероксиди өз алдынча өтө жай ажырайт, анткени активдешүү энергиясы жогору (~75 кДж/моль).",
        "Иодид иондору (I⁻) кошулганда реакция эки баскычтуу жеңил жол менен жүрөт: 1) H₂O₂ + I⁻ → H₂O + IO⁻; 2) H₂O₂ + IO⁻ → H₂O + O₂↑ + I⁻. Натыйжада I⁻ кайра калыбына келет, ал эми бөлүнүп чыккан кычкылтек самынды көбүртөт.",
      ],
      ru: [
        "Без катализатора пероксид водорода разлагается крайне медленно из-за высокой энергии активации (~75 кДж/моль).",
        "Иодид-ионы (I⁻) открывают двухстадийный путь через гипоиодит-ион (IO⁻) с низкой энергией активации: 1) H₂O₂ + I⁻ → H₂O + IO⁻; 2) H₂O₂ + IO⁻ → H₂O + O₂↑ + I⁻. Катализатор I⁻ регенерируется, а бурно выделяющийся кислород вспенивает мыльный раствор с выделением тепла.",
      ],
    },
    steps: [
      {
        timeSeconds: 18,
        title: { en: "Mix peroxide & surfactant", ky: "Пероксид менен самынды аралаштыруу", ru: "Смешивание пероксида и ПАВ" },
        detail: {
          en: "Pour H₂O₂ into the cylinder and swirl with dish soap so any evolved gas will be captured as foam.",
          ky: "Цилиндрге H₂O₂ куюп, бөлүнүп чыгуучу газды кармап калуу үчүн суюк самын кошобуз.",
          ru: "Наливаем H₂O₂ в цилиндр и добавляем жидкое мыло для улавливания пузырьков газа.",
        },
      },
      {
        timeSeconds: 58,
        title: { en: "Add KI catalyst", ky: "KI катализаторун кошуу", ru: "Введение катализатора KI" },
        detail: {
          en: "Pouring aqueous potassium iodide triggers immediate vigorous foaming and visible water vapor.",
          ky: "Калий иодидин куйганда көбүк дароо көтөрүлүп, жылуу буу чыгат.",
          ru: "При добавлении раствора KI мгновенно вырастает столб горячей пены и поднимается пар.",
        },
      },
      {
        timeSeconds: 135,
        title: { en: "Glowing splint oxygen test", ky: "Кычкылтекти чырпык менен текшерүү", ru: "Проверка кислорода тлеющей лучинкой" },
        detail: {
          en: "Touching a glowing splint to the foam causes it to relight into flame, proving the gas is O₂.",
          ky: "Чок болуп турган чырпыкты көбүккө тийгизгенде ал кайра жанат — бул O₂ газынын далили.",
          ru: "Тлеющая лучинка ярко вспыхивает в пене, доказывая, что пузырьки заполнены чистым O₂.",
        },
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: {
          en: "What happens to the iodide ions (I⁻) after the decomposition of H₂O₂ is complete?",
          ky: "H₂O₂ ажырап бүткөндөн кийин иодид иондоруна (I⁻) эмне болот?",
          ru: "Что происходит с иодид-ионами (I⁻) после завершения разложения H₂O₂?",
        },
        options: [
          {
            id: "a",
            text: {
              en: "They are regenerated in the second reaction step, remaining chemically unchanged overall (with minor side oxidation to I₂).",
              ky: "Алар экинчи баскычта кайра калыбына келет, б.а. катализатор катары сарпталбайт.",
              ru: "Они регенерируются на второй стадии механизма, выступая катализатором.",
            },
            isCorrect: true,
            explanation: {
              en: "Correct! A catalyst participates in the intermediate step (forming IO⁻) and is regenerated in the subsequent step.",
              ky: "Туура! Катализатор аралык реакцияга катышып (IO⁻ пайда кылат), кийинки баскычта кайра баштапкы абалына келет.",
              ru: "Верно! Катализатор образует промежуточный ион IO⁻ и полностью восстанавливается на втором шаге.",
            },
          },
          {
            id: "b",
            text: {
              en: "They turn into oxygen gas molecules.",
              ky: "Алар кычкылтек газынын молекуласына айланат.",
              ru: "Они превращаются в молекулы газообразного кислорода.",
            },
            isCorrect: false,
            explanation: {
              en: "Elements cannot transmute in chemical reactions; all O₂ comes from the oxygen atoms in H₂O₂.",
              ky: "Химиялык реакцияда бир элемент экинчисине айланбайт; кычкылтек H₂O₂ молекуласынан гана чыгат.",
              ru: "В химических реакциях элементы не превращаются друг в друга; весь O₂ образуется из H₂O₂.",
            },
          },
        ],
      },
      {
        id: "q2",
        prompt: {
          en: "Why does visible steam rise from the foam column during this experiment?",
          ky: "Эмне үчүн бул тажрыйба учурунда көбүктөн буу көтөрүлөт?",
          ru: "Почему над столбом пены в этом опыте поднимается заметный пар?",
        },
        options: [
          {
            id: "a",
            text: {
              en: "The decomposition of H₂O₂ into H₂O and O₂ is strongly exothermic (ΔH = −196 kJ per 2 mol H₂O₂), heating the water into vapor.",
              ky: "H₂O₂ ажыроосу экзотермиялык реакция болгондуктан (ΔH < 0), бөлүнүп чыккан жылуулук сууну буулантат.",
              ru: "Разложение H₂O₂ сильно экзотермично (ΔH < 0), и выделяющаяся теплота испаряет часть воды.",
            },
            isCorrect: true,
            explanation: {
              en: "Spot on! Breaking the weak O–O peroxide bond and forming stronger O=O and O–H bonds releases significant thermal energy.",
              ky: "Эң туура! Алсыз пероксиддик байланыш үзүлүп, бекем байланыштар түзүлгөндө көп жылуулук бөлүнүп чыгат.",
              ru: "Именно так! Образование более прочных связей в H₂O и O₂ сопровождается выделением большого количества теплоты.",
            },
          },
          {
            id: "b",
            text: {
              en: "Dish soap reacts endothermically with glass.",
              ky: "Суюк самын айнек менен эндотермиялык реакцияга кирет.",
              ru: "Мыло вступает в эндотермическую реакцию со стеклом.",
            },
            isCorrect: false,
            explanation: {
              en: "Soap only acts physically as a surfactant to trap the O₂ bubbles; the heat comes from H₂O₂ decomposition.",
              ky: "Самын газ көбүкчөлөрүн гана кармап калат, ал эми жылуулук пероксиддин ажыроосунан чыгат.",
              ru: "Мыло лишь физически удерживает пузырьки кислорода.",
            },
          },
        ],
      },
    ],
  },
  {
    id: "exp-03",
    slug: "electrolysis-of-water-hoffman",
    topicId: "electrochemistry",
    durationSeconds: 300,
    safetyLevel: "student_lab",
    featured: true,
    youtubeVideo: "https://www.youtube.com/watch?v=HQ9Fhd7P_HA",
    chemicalEquation: "2H₂O (l) —[DC current, Na₂SO₄]→ 2H₂ (g, cathode) + O₂ (g, anode)",
    illustration: "electrolysis-tubes",
    title: {
      en: "Electrolysis of Water & 2:1 Stoichiometric Gas Ratio",
      ky: "Суунун электролизи жана газдардын 2:1 көлөмдүк катышы",
      ru: "Электролиз воды и стехиометрическое соотношение газов 2:1",
    },
    shortDescription: {
      en: "Split liquid water with direct current and verify visually why twice as much hydrogen collects at the cathode as oxygen at the anode.",
      ky: "Туруктуу ток аркылуу сууну ажыратып, катоддо эмне үчүн кычкылтекке караганда эки эсе көп суутек чогуларын далилдеңиз.",
      ru: "Разложите воду постоянным током и убедитесь, почему на катоде собирается ровно вдвое больше водорода, чем кислорода на аноде.",
    },
    objectives: {
      en: [
        "Connect the 2:1 volume ratio of H₂ to O₂ gas directly to the formula of water (H₂O) and Avogadro's law.",
        "Explain why an inert electrolyte (such as Na₂SO₄) is added to pure distilled water.",
        "Identify cathode reduction and anode oxidation half-reactions.",
      ],
      ky: [
        "H₂ менен O₂ газдарынын 2:1 көлөмдүк катышын суунун формуласы (H₂O) менен байланыштыруу.",
        "Таза сууга эмне үчүн электролит (Na₂SO₄) кошуларын түшүндүрүү.",
        "Катоддогу калыбына келүү жана аноддогу кычкылдануу процесстерин айырмалоо.",
      ],
      ru: [
        "Связать соотношение объёмов H₂ и O₂ (2:1) с формулой воды H₂O и законом Авогадро.",
        "Объяснить, зачем к дистиллированной воде добавляют фоновый электролит (Na₂SO₄).",
        "Записать полуреакции восстановления на катоде и окисления на аноде.",
      ],
    },
    materials: {
      en: ["Hoffman voltameter or beaker with 2 inverted graduated tubes", "Inert platinum or stainless-steel electrodes", "DC power supply (9–12 V)", "Distilled water + 0.1 M sodium sulfate (Na₂SO₄)", "Bromothymol blue indicator (optional)", "Matches & wooden splints"],
      ky: ["Гофман аппараты же 2 пробиркалуу идиш", "Инерттүү электроддор", "Туруктуу ток булагы (9–12 В)", "Дистилденген суу + натрий сульфаты (Na₂SO₄)", "Бромтимол көк индикатору", "Ширенке жана чырпыктар"],
      ru: ["Аппарат Гофмана или стакан с 2 градуированными пробирками", "Инертные электроды", "Источник постоянного тока (9–12 В)", "Дистиллированная вода + сульфат натрия Na₂SO₄ (0,1 М)", "Индикатор бромтимоловый синий", "Лучинки и спички"],
    },
    safetyNotes: {
      en: [
        "Use only low-voltage DC power (9–12 V) and disconnect power before adjusting electrodes.",
        "Do not use table salt (NaCl) as the electrolyte in an open room, as chloride ions oxidize at the anode to produce toxic chlorine gas (Cl₂).",
      ],
      ky: [
        "Төмөн чыңалуудагы туруктуу токту (9–12 В) гана колдонуңуз.",
        "Аш тузун (NaCl) колдонбоңуз, анткени аноддо уулуу хлор газы (Cl₂) бөлүнүп чыгышы мүмкүн.",
      ],
      ru: [
        "Используйте только низковольтный источник постоянного тока (9–12 В).",
        "Не используйте поваренную соль (NaCl) вместо Na₂SO₄, так как на аноде будет выделяться токсичный хлор (Cl₂).",
      ],
    },
    scientificExplanation: {
      en: [
        "Pure water has an extremely low concentration of ions ([H⁺] = [OH⁻] = 10⁻⁷ M), making it a poor conductor. Dissolving sodium sulfate (Na₂SO₄) supplies mobile Na⁺ and SO₄²⁻ ions that carry charge without being discharged themselves.",
        "At the negative cathode, water molecules gain electrons (reduction): 4H₂O + 4e⁻ → 2H₂ (g) + 4OH⁻. At the positive anode, water molecules lose electrons (oxidation): 2H₂O → O₂ (g) + 4H⁺ + 4e⁻. Passing 4 moles of electrons produces 2 moles of H₂ and 1 mole of O₂.",
      ],
      ky: [
        "Таза сууда иондор өтө аз болгондуктан токту начар өткөрөт. Натрий сульфатын (Na₂SO₄) кошуу эритменин электр өткөрүмдүүлүгүн жогорулатат.",
        "Терс катоддо суутек бөлүнүп чыгат: 4H₂O + 4e⁻ → 2H₂↑ + 4OH⁻. Оң аноддо кычкылтек бөлүнүп чыгат: 2H₂O → O₂↑ + 4H⁺ + 4e⁻. Ар бир 4 электрон өткөндө 2 моль H₂ жана 1 моль O₂ пайда болот.",
      ],
      ru: [
        "Чистая вода почти не проводит ток ([H⁺] = 10⁻⁷ М). Добавление сульфата натрия (Na₂SO₄) обеспечивает ионную проводимость, при этом ионы Na⁺ и SO₄²⁻ не разряжаются на электродах.",
        "На катоде (−) идёт восстановление: 4H₂O + 4e⁻ → 2H₂↑ + 4OH⁻. На аноде (+) идёт окисление: 2H₂O → O₂↑ + 4H⁺ + 4e⁻. Суммарно на каждые 4 моль электронов выделяется 2 моль H₂ и 1 моль O₂.",
      ],
    },
    steps: [
      {
        timeSeconds: 20,
        title: { en: "Fill graduated tubes with electrolyte", ky: "Пробиркаларды электролит менен толтуруу", ru: "Заполнение трубок электролитом" },
        detail: {
          en: "Invert both liquid-filled tubes over the electrodes with zero trapped air bubbles.",
          ky: "Эки пробирканы тең аба көбүкчөлөрүн калтырбай электролит менен толтуруп электроддорго орнотобуз.",
          ru: "Заполняем обе градуированные трубки раствором Na₂SO₄ без пузырьков воздуха.",
        },
      },
      {
        timeSeconds: 90,
        title: { en: "Apply DC voltage & observe 2:1 gas collection", ky: "Ток берип, 2:1 катышын байкоо", ru: "Подача тока и наблюдение соотношения 2:1" },
        detail: {
          en: "Fine bubbles stream from both electrodes; the cathode tube fills with gas twice as fast as the anode tube.",
          ky: "Катоддогу пробиркада анодго караганда газ эки эсе бат топтолот.",
          ru: "Пузырьки газа поднимаются с обоих электродов; объём газа над катодом ровно вдвое превышает объём над анодом.",
        },
      },
      {
        timeSeconds: 210,
        title: { en: "Pop test & glowing splint verification", ky: "Газдарды текшерүү", ru: "Идентификация H₂ и O₂" },
        detail: {
          en: "Cathode gas gives a 'pop' with a flame (H₂); anode gas relights a glowing splint (O₂).",
          ky: "Катоддогу газ жалында «пылк» этип күйөт (H₂), аноддогу газ чокту жандырат (O₂).",
          ru: "Газ с катода сгорает с хлопком (H₂), а газ с анода воспламеняет тлеющую лучинку (O₂).",
        },
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: {
          en: "If 18 mL of oxygen gas (O₂) collects above the anode during water electrolysis, what volume of hydrogen gas (H₂) should collect above the cathode at the same temperature and pressure?",
          ky: "Эгерде суунун электролизинде аноддо 18 мл кычкылтек (O₂) чогулса, ошол эле шартта катоддо канча көлөмдөгү суутек (H₂) чогулат?",
          ru: "Если над анодом при электролизе воды собралось 18 мл кислорода (O₂), какой объём водорода (H₂) соберётся над катодом при тех же условиях?",
        },
        options: [
          {
            id: "a",
            text: { en: "9 mL", ky: "9 мл", ru: "9 мл" },
            isCorrect: false,
            explanation: {
              en: "Remember that water is H₂O — there are 2 hydrogen atoms for every 1 oxygen atom, so hydrogen volume is double, not half.",
              ky: "Суунун формуласы H₂O болгондуктан, суутектин көлөмү эки эсе аз эмес, эки эсе көп болот.",
              ru: "В формуле H₂O на 1 атом кислорода приходится 2 атома водорода, поэтому объём водорода вдвое больше, а не меньше.",
            },
          },
          {
            id: "b",
            text: { en: "36 mL", ky: "36 мл", ru: "36 мл" },
            isCorrect: true,
            explanation: {
              en: "Correct! By 2H₂O → 2H₂ + O₂, the mole and volume ratio V(H₂):V(O₂) is 2:1, so 2 × 18 mL = 36 mL.",
              ky: "Туура! 2H₂O → 2H₂ + O₂ теңдемеси боюнча V(H₂):V(O₂) = 2:1, демек 2 × 18 мл = 36 мл.",
              ru: "Верно! По уравнению 2H₂O → 2H₂ + O₂ соотношение объёмов V(H₂):V(O₂) = 2:1, значит 2 × 18 мл = 36 мл.",
            },
          },
          {
            id: "c",
            text: { en: "18 mL", ky: "18 мл", ru: "18 мл" },
            isCorrect: false,
            explanation: {
              en: "Equal volumes would only occur if the stoichiometric ratio were 1:1.",
              ky: "Көлөмдөр 1:1 катышында болгондо гана бирдей болмок.",
              ru: "Равные объёмы выделялись бы только при стехиометрическом соотношении 1:1.",
            },
          },
        ],
      },
    ],
  },
  {
    id: "exp-04",
    slug: "iron-nail-copper-sulfate-displacement",
    topicId: "metals",
    durationSeconds: 200,
    safetyLevel: "student_lab",
    featured: true,
    youtubeVideo: "https://www.youtube.com/watch?v=T4pSuflO9fk",
    chemicalEquation: "Fe (s) + CuSO₄ (aq, blue) → FeSO₄ (aq, pale green) + Cu (s, salmon-red)",
    illustration: "copper-displacement",
    title: {
      en: "Single Displacement: Iron Nail in Copper(II) Sulfate Solution",
      ky: "Орун алмашуу реакциясы: Темир мык жана жез(II) сульфаты",
      ru: "Реакция замещения: железный гвоздь в растворе сульфата меди(II)",
    },
    shortDescription: {
      en: "Observe metallic copper plate onto a steel nail while the bright blue Cu²⁺ solution fades to pale green Fe²⁺.",
      ky: "Темир мыктын бетине кызыл жез чөгүп, көк Cu²⁺ эритмеси ачык жашыл Fe²⁺ өңүнө өтүшүн байкаңыз.",
      ru: "Наблюдайте осаждение красной меди на поверхности железного гвоздя и переход голубой окраски Cu²⁺ в бледно-зелёную Fe²⁺.",
    },
    objectives: {
      en: [
        "Use the metal reactivity series to predict why iron displaces copper from CuSO₄(aq).",
        "Connect the color shift of the liquid (blue → pale green) to the replacement of Cu²⁺(aq) by Fe²⁺(aq).",
      ],
      ky: [
        "Металлдардын активдүүлүк катары боюнча темир жезди эмне үчүн сүрүп чыгарарын түшүндүрүү.",
        "Эритменин көктөн ачык жашылга өтүшүн Cu²⁺ иондорунун Fe²⁺ иондору менен алмашуусу аркылуу далилдөө.",
      ],
      ru: [
        "Объяснить вытеснение меди железом с помощью ряда активности металлов.",
        "Связать изменение цвета раствора (голубой → бледно-зелёный) с переходом ионов Cu²⁺ в Fe²⁺.",
      ],
    },
    materials: {
      en: ["Clean iron nails (sanded with emery paper)", "0.5 M Copper(II) sulfate (CuSO₄) solution", "2 test tubes (1 control, 1 reaction)", "Forceps & filter paper", "Safety goggles"],
      ky: ["Тазаланган темир мыктар", "0.5 М Жез(II) сульфатынын (CuSO₄) эритмеси", "2 пробирка (салыштыруу үчүн)", "Пинцет жана чыпка кагазы", "Коргоочу көз айнек"],
      ru: ["Очищенные железные гвозди", "0,5 М раствор сульфата меди(II) CuSO₄", "2 пробирки (контрольная и рабочая)", "Пинцет и фильтровальная бумага", "Защитные очки"],
    },
    safetyNotes: {
      en: [
        "Copper(II) sulfate solution is harmful if swallowed and irritating to eyes; wash hands after the lab.",
        "Do not pour heavy-metal copper solutions down the sink; collect in the labeled waste bottle.",
      ],
      ky: [
        "Жез(II) сульфаты көзгө жана териге зыяндуу; тажрыйбадан кийин колду самындап жууңуз.",
        "Жез эритмелерин раковинага төкпөстөн, атайын калдык идишке чогултуңуз.",
      ],
      ru: [
        "Раствор сульфата меди(II) токсичен при проглатывании и раздражает глаза; мойте руки после работы.",
        "Сливайте отработанные растворы солей меди в специальную ёмкость для отходов.",
      ],
    },
    scientificExplanation: {
      en: [
        "Iron lies above copper in the electrochemical reactivity series (E°(Fe²⁺/Fe) = −0.44 V vs. E°(Cu²⁺/Cu) = +0.34 V). Iron atoms on the nail surface transfer two valence electrons directly to hydrated Cu²⁺ ions: Fe(s) + Cu²⁺(aq) → Fe²⁺(aq) + Cu(s).",
        "Neutral copper atoms deposit as a reddish-brown coating on the nail, while Fe²⁺ ions enter solution, gradually shifting the color from sky blue to pale green.",
      ],
      ky: [
        "Металлдардын активдүүлүк катарында темир жезден сол жакта жайгашкан. Темир атомдору эки электронун Cu²⁺ иондоруна берет: Fe(к) + Cu²⁺(эр) → Fe²⁺(эр) + Cu(к).",
        "Натыйжада мыктын бетине кызгылт жез капталып, эритме Fe²⁺ иондорунун эсебинен ачык жашыл түскө өтөт.",
      ],
      ru: [
        "Железо стоит левее меди в электрохимическом ряду напряжений металлов (E°(Fe²⁺/Fe) = −0,44 В против E°(Cu²⁺/Cu) = +0,34 В). Атомы железа отдают по два электрона ионам меди: Fe(тв) + Cu²⁺(р-р) → Fe²⁺(р-р) + Cu(тв).",
        "Восстановленная медь оседает рыхлым розово-красным слоем на гвозде, а накопление ионов Fe²⁺ меняет окраску раствора с голубой на бледно-зелёную.",
      ],
    },
    steps: [
      {
        timeSeconds: 15,
        title: { en: "Polish the iron nail", ky: "Темир мыкты тазалоо", ru: "Зачистка железного гвоздя" },
        detail: {
          en: "Remove any surface oxide layer with sandpaper so bare iron metal contacts the solution.",
          ky: "Мыктын бетиндеги датты кум кагаз менен тазалайбыз.",
          ru: "Удаляем оксидную плёнку наждачной бумагой для чистого контакта металла с раствором.",
        },
      },
      {
        timeSeconds: 60,
        title: { en: "Immerse in CuSO₄ & compare with control", ky: "CuSO₄ эритмесине салуу", ru: "Погружение в раствор CuSO₄" },
        detail: {
          en: "Within 30 seconds a copper layer forms on the submerged nail; keep a second tube of CuSO₄ beside it to compare color.",
          ky: "30 секунданын ичинде мыктын бети жез менен капталат; өңдү контролдук пробирка менен салыштырабыз.",
          ru: "Уже через 30 секунд гвоздь покрывается красным налётом меди; сравниваем цвет раствора с контрольной пробиркой.",
        },
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: {
          en: "What would you observe if a strip of copper metal (Cu) were placed into a solution of iron(II) sulfate (FeSO₄)?",
          ky: "Эгерде жез пластинкасын (Cu) темир(II) сульфатынын (FeSO₄) эритмесине салсак эмне байкалат?",
          ru: "Что произойдёт, если опустить медную пластинку (Cu) в раствор сульфата железа(II) FeSO₄?",
        },
        options: [
          {
            id: "a",
            text: {
              en: "No reaction occurs because copper is less reactive than iron and cannot reduce Fe²⁺ ions.",
              ky: "Реакция жүрбөйт, анткени жез темирге караганда пассивдүү жана Fe²⁺ иондорун сүрүп чыгара албайт.",
              ru: "Реакция не пойдёт, так как медь менее активна, чем железо, и не может восстановить ионы Fe²⁺.",
            },
            isCorrect: true,
            explanation: {
              en: "Correct! A less reactive metal cannot displace a more reactive metal from its salt solution.",
              ky: "Туура! Активдүүлүгү төмөн металл өзүнөн активдүү металлды тузунун эритмесинен сүрүп чыгара албайт.",
              ru: "Верно! Менее активный металл не вытесняет более активный из раствора его соли.",
            },
          },
          {
            id: "b",
            text: {
              en: "Grey iron metal immediately plates onto the copper strip.",
              ky: "Жез пластинканын бетине дароо боз темир чөгөт.",
              ru: "На медной пластинке сразу выделится слой серого железа.",
            },
            isCorrect: false,
            explanation: {
              en: "The reverse reaction has a negative cell potential (ΔE° = −0.78 V) and is non-spontaneous.",
              ky: "Тескери реакция өз алдынча жүрбөйт (ΔE° = −0.78 В).",
              ru: "Обратная реакция термодинамически невозможна без внешнего источника тока.",
            },
          },
        ],
      },
    ],
  },
  {
    id: "exp-05",
    slug: "flame-tests-metal-cations",
    topicId: "energy",
    durationSeconds: 245,
    safetyLevel: "teacher_demo",
    featured: true,
    youtubeVideo: "https://www.youtube.com/watch?v=1EXr_L7Ojqg",
    chemicalEquation: "M⁺ (ground state) + thermal energy → M⁺* (excited) → M⁺ + hν (characteristic photon)",
    illustration: "flame-spectrum",
    title: {
      en: "Atomic Emission Flame Tests of Metal Ions (Li⁺, Na⁺, K⁺, Cu²⁺, Sr²⁺)",
      ky: "Металл катиондорун жалындын өңү боюнча аныктоо (Li⁺, Na⁺, K⁺, Cu²⁺, Sr²⁺)",
      ru: "Окрашивание пламени ионами металлов (Li⁺, Na⁺, K⁺, Cu²⁺, Sr²⁺)",
    },
    shortDescription: {
      en: "Identify metal cations by the characteristic wavelengths of light emitted when thermally excited electrons return to lower energy levels.",
      ky: "Козголгон электрондор төмөнкү деңгээлге кайтканда чыккан жалындын өңү аркылуу металл иондорун тааныңыз.",
      ru: "Распознавайте катионы металлов по характерному цвету пламени, возникающему при переходе электронов на нижние энергетические уровни.",
    },
    objectives: {
      en: [
        "Match Li⁺ (crimson), Na⁺ (intense yellow), K⁺ (lilac), Sr²⁺ (scarlet), and Cu²⁺ (blue-green) to their flame colors.",
        "Explain how quantized electron energy jumps produce specific photon wavelengths (ΔE = hc/λ).",
      ],
      ky: [
        "Li⁺ (кочкул кызыл), Na⁺ (сары), K⁺ (кызгылт-көк), Cu²⁺ (жашыл-көк) иондорун жалындын өңү боюнча айырмалоо.",
        "Электрондордун энергетикалык секириктери эмне үчүн белгилүү бир өңдөгү жарыкты чыгарарын түшүндүрүү (ΔE = hc/λ).",
      ],
      ru: [
        "Сопоставить катионы Li⁺ (карминово-красный), Na⁺ (жёлтый), K⁺ (фиолетовый), Cu²⁺ (зелёный) с цветом пламени.",
        "Объяснить связь между квантованными переходами электронов и длиной волны излучения (ΔE = hc/λ).",
      ],
    },
    materials: {
      en: ["Nichrome or platinum wire loop", "Bunsen burner (non-luminous blue flame)", "Chloride salts: LiCl, NaCl, KCl, SrCl₂, BaCl₂, CuCl₂", "Dilute HCl for cleaning wire", "Cobalt blue glass (for viewing K⁺)"],
      ky: ["Нихром же платина зымы", "Бунзен күйгүзгүчү (көк жалын)", "Хлорид туздары: LiCl, NaCl, KCl, SrCl₂, CuCl₂", "Зымды тазалоо үчүн суюлтулган HCl", "Кобальт айнеги (K⁺ көрүү үчүн)"],
      ru: ["Нихромовая или платиновая петля", "Горелка Бунзена (несветящееся синее пламя)", "Хлориды LiCl, NaCl, KCl, SrCl₂, CuCl₂", "Разбавленная HCl для очистки петли", "Кобальтовое стекло (для наблюдения K⁺)"],
    },
    safetyNotes: {
      en: [
        "Tie back long hair and wear safety goggles when operating an open Bunsen burner flame.",
        "Barium and copper salts are toxic — avoid inhaling salt aerosols and perform in a well-ventilated lab.",
      ],
      ky: [
        "Ачык жалын менен иштегенде чачты жыйнап, коргоочу көз айнек тагыныңыз.",
        "Жез жана барий туздары уулуу — бөлмөнү жакшы желдетиңиз.",
      ],
      ru: [
        "Соблюдайте правила работы с открытым пламенем горелки и используйте защитные очки.",
        "Соли бария и меди токсичны — проводите опыт в хорошо проветриваемом помещении.",
      ],
    },
    scientificExplanation: {
      en: [
        "Thermal energy from the burner flame vaporizes the metal chloride and promotes outer-shell electrons to higher, unstable orbitals. When those electrons relax back to lower orbitals, each transition releases a photon with energy ΔE = hc/λ.",
        "Because every element has a unique spacing of atomic orbitals, each metal emits a signature line spectrum — such as sodium's intense 589 nm yellow doublet or copper's green-blue emission.",
      ],
      ky: [
        "Жалындын жылуулук энергиясы металл атомдорунун сырткы электрондорун жогорку энергетикалык деңгээлге чыгарат. Электрондор кайра өз ордуна кайтканда ΔE = hc/λ энергиялуу фотон бөлүнүп чыгат.",
        "Ар бир элементтин энергетикалык деңгээлдеринин айырмасы уникалдуу болгондуктан, ар бир металл өзүнө гана мүнөздүү өң менен күйөт (мисалы, натрий 589 нм сары жарык чыгарат).",
      ],
      ru: [
        "Тепловая энергия пламени переводит валентные электроны атомов и ионов металлов на более высокие энергетические уровни. Возвращаясь в основное состояние, электроны испускают фотоны с энергией ΔE = hc/λ.",
        "Поскольку набор энергетических уровней каждого элемента уникален, каждый металл даёт характерный спектр излучения (например, жёлтый дублет натрия 589 нм).",
      ],
    },
    steps: [
      {
        timeSeconds: 20,
        title: { en: "Clean wire loop in HCl & blue flame", ky: "Зымды HCl жана жалында тазалоо", ru: "Очистка петли в HCl и пламени" },
        detail: {
          en: "Dip the nichrome loop in dilute HCl and heat until no residual color appears in the blue burner cone.",
          ky: "Нихром зымын HCl эритмесине малып, жалындын өңү өзгөрбөй калганга чейин ысытабыз.",
          ru: "Прокаливаем петлю после смачивания в HCl до исчезновения посторонней окраски пламени.",
        },
      },
      {
        timeSeconds: 85,
        title: { en: "Test Li⁺, Na⁺, K⁺, Sr²⁺, and Cu²⁺", ky: "Катиондорду жалынга кармоо", ru: "Внесение солей Li⁺, Na⁺, K⁺, Sr²⁺ и Cu²⁺" },
        detail: {
          en: "Observe crimson (Li⁺), bright gold-yellow (Na⁺), lilac through cobalt glass (K⁺), and emerald blue-green (Cu²⁺).",
          ky: "Кочкул кызыл (Li⁺), ачык сары (Na⁺), кызгылт-көк (K⁺) жана көгүш-жашыл (Cu²⁺) жалынды байкайбыз.",
          ru: "Наблюдаем карминово-красное (Li⁺), ярко-жёлтое (Na⁺), фиолетовое (K⁺) и изумрудно-зелёное (Cu²⁺) пламя.",
        },
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: {
          en: "An unknown white chloride salt produces a vivid emerald blue-green flame in a Bunsen burner. Which metal cation is present?",
          ky: "Белгисиз ак туз Бунзен жалынында ачык көгүш-жашыл өң менен күйөт. Анын курамында кайсы металлдын катиону бар?",
          ru: "Неизвестная соль окрашивает пламя горелки в яркий изумрудно-зелёный цвет. Какой катион металла присутствует в пробе?",
        },
        options: [
          {
            id: "a",
            text: { en: "Sodium (Na⁺)", ky: "Натрий (Na⁺)", ru: "Натрий (Na⁺)" },
            isCorrect: false,
            explanation: {
              en: "Sodium produces an intense golden-yellow flame (589 nm), not blue-green.",
              ky: "Натрий иондору жалынды ачык сары өңгө боёйт (589 нм).",
              ru: "Ионы натрия окрашивают пламя в интенсивный жёлтый цвет (589 нм).",
            },
          },
          {
            id: "b",
            text: { en: "Copper (Cu²⁺)", ky: "Жез (Cu²⁺)", ru: "Медь (Cu²⁺)" },
            isCorrect: true,
            explanation: {
              en: "Correct! Copper(II) halides emit characteristic blue-green light when heated in a flame.",
              ky: "Туура! Жез(II) туздары жалынды зумруд сымал көгүш-жашыл өңгө боёйт.",
              ru: "Верно! Галогениды меди(II) окрашивают пламя в характерный сине-зелёный цвет.",
            },
          },
        ],
      },
    ],
  },
  {
    id: "exp-06",
    slug: "paper-chromatography-plant-ink-pigments",
    topicId: "separation",
    durationSeconds: 230,
    safetyLevel: "student_lab",
    featured: true,
    youtubeVideo: "https://www.youtube.com/watch?v=ZCzgQXGz9Tg",
    chemicalEquation: "Rf = (distance traveled by pigment) / (distance traveled by solvent front)",
    illustration: "chromatography-strip",
    title: {
      en: "Paper Chromatography: Separating Ink & Leaf Pigments",
      ky: "Кагаз хроматографиясы: Сыя жана жалбырак пигменттерин бөлүү",
      ru: "Бумажная хроматография: разделение пигментов чернил и листьев",
    },
    shortDescription: {
      en: "Separate a single black ink spot into distinct dye bands and calculate retention factors (Rf) based on polarity.",
      ky: "Кара сыянын чекитин түстүү боёкторго ажыратып, Rf кармалуу коэффициентин эсептеңиз.",
      ru: "Разделите каплю чёрных чернил на отдельные красители и рассчитайте коэффициент удерживания Rf.",
    },
    objectives: {
      en: [
        "Explain separation in chromatography as a competition between the stationary phase (cellulose + water) and mobile phase.",
        "Calculate the retention factor Rf = d(solute) / d(solvent) and understand why Rf is always ≤ 1.0.",
      ],
      ky: [
        "Кыймылсыз фаза (целлюлоза) менен кыймылдуу фазанын (эриткич) ортосундагы бөлүнүү принцибин түшүндүрүү.",
        "Rf = d(зат) / d(эриткич) формуласы боюнча кармалуу коэффициентин эсептөө.",
      ],
      ru: [
        "Объяснить принцип распределения вещества между неподвижной (целлюлоза) и подвижной фазами.",
        "Рассчитать фактор удерживания Rf = d(вещества) / d(растворителя).",
      ],
    },
    materials: {
      en: ["Chromatography or filter paper strips", "Water-soluble black, green, and purple markers", "Pencil (for baseline!)", "Beaker with shallow water/ethanol eluent", "Ruler & wooden splint clip"],
      ky: ["Хроматографиялык же чыпка кагазы", "Сууда эрүүчү фломастерлер", "Карандаш (старт сызыгы үчүн!)", "Суу же спирт куюлган стакан", "Сызгыч"],
      ru: ["Полоски хроматографической или фильтровальной бумаги", "Водорастворимые фломастеры", "Простой карандаш (для линии старта!)", "Стакан с элюентом (вода / этанол)", "Линейка"],
    },
    safetyNotes: {
      en: [
        "If using ethanol or isopropyl alcohol as the mobile phase, keep away from flames and cover the beaker with a watch glass.",
      ],
      ky: [
        "Эгерде эриткич катары этил спирти колдонулса, ачык оттон алыс кармаңыз.",
      ],
      ru: [
        "При использовании этанола или изопропанола в качестве элюента работайте вдали от открытого огня.",
      ],
    },
    scientificExplanation: {
      en: [
        "Capillary action draws the liquid solvent (mobile phase) upward through the cellulose fibers of the paper (stationary phase). Dye molecules that form stronger hydrogen bonds with the stationary phase move slowly (low Rf), whereas dyes that are more soluble in the mobile phase travel near the solvent front (high Rf).",
        "The baseline must always be drawn in graphite pencil rather than pen ink, because graphite is insoluble and will not elute with the solvent.",
      ],
      ky: [
        "Капиллярдык кубулуштун эсебинен эриткич кагаз өйдө көтөрүлөт. Эриткичте жакшы эриген пигменттер тез көтөрүлөт (жогорку Rf), ал эми кагазга күчтүүрөөк тартылган заттар жай жылат (төмөнкү Rf).",
        "Старт сызыгы сөзсүз жөнөкөй карандаш менен чийилет, анткени графит эриткичте эрибейт.",
      ],
      ru: [
        "Под действием капиллярных сил растворитель (подвижная фаза) поднимается по волокнам целлюлозы (неподвижная фаза). Красители, лучше растворимые в подвижной фазе, движутся быстрее (высокий Rf), а сильнее адсорбирующиеся на бумаге — медленнее (низкий Rf).",
        "Линию старта всегда проводят простым карандашом, так как графит не растворяется в элюенте.",
      ],
    },
    steps: [
      {
        timeSeconds: 20,
        title: { en: "Draw pencil baseline & spot sample", ky: "Карандаш менен сызык чийип, чекит коюу", ru: "Нанесение линии старта карандашом и пробы" },
        detail: {
          en: "Draw a pencil line 2 cm from the bottom edge, apply a concentrated ink dot, and let it dry.",
          ky: "Кагаздын түбүнөн 2 см жогору карандаш менен сызып, сыя чекитин тамызабыз.",
          ru: "На высоте 2 см от края проводим линию карандашом и наносим маленькую точку чернил.",
        },
      },
      {
        timeSeconds: 95,
        title: { en: "Develop chromatogram above solvent level", ky: "Хроматограмманы өстүрүү", ru: "Развитие хроматограммы" },
        detail: {
          en: "Suspend the strip so only the tip touches the liquid — keep the ink spot above the water level!",
          ky: "Кагаздын учу гана сууга тийгидей кылып асып коёбуз — сыя чекити суунун деңгээлинен жогору турушу шарт!",
          ru: "Погружаем только нижний край бумаги — точка старта должна оставаться выше уровня жидкости!",
        },
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: {
          en: "Why must the starting line on a chromatography strip be drawn with a graphite pencil instead of a ballpoint pen?",
          ky: "Эмне үчүн хроматография кагазындагы баштапкы сызыкты ручка менен эмес, жөнөкөй карандаш менен чийүү керек?",
          ru: "Почему стартовую линию на хроматографической бумаге проводят графитовым карандашом, а не ручкой?",
        },
        options: [
          {
            id: "a",
            text: {
              en: "Graphite is insoluble in the mobile phase, whereas pen ink would dissolve and travel up the paper, contaminating the sample bands.",
              ky: "Графит эриткичте эрибейт, ал эми ручканын сыясы эрип кетип, тажрыйбанын жыйынтыгын бузат.",
              ru: "Графит нерастворим в элюенте, тогда как чернила ручки растворятся и смешаются с исследуемыми пигментами.",
            },
            isCorrect: true,
            explanation: {
              en: "Correct! Using pen ink on the baseline would introduce extra dyes that elute alongside your sample.",
              ky: "Туура! Ручканын сыясы өзү да бир нече боёктон тургандыктан, үлгү менен аралашып кетет.",
              ru: "Верно! Чернила ручки сами состоят из смеси красителей и исказят хроматограмму.",
            },
          },
          {
            id: "b",
            text: {
              en: "Graphite acts as a catalyst that speeds up capillary action.",
              ky: "Графит капиллярдык кыймылды тездетүүчү катализатор болуп саналат.",
              ru: "Графит служит катализатором, ускоряющим подъём воды.",
            },
            isCorrect: false,
            explanation: {
              en: "Graphite is chemically inert here; it is simply an insoluble marker.",
              ky: "Графит бул жерде эч кандай реакцияга кирбейт, болгону эрибеген белги катары кызмат кылат.",
              ru: "Графит химически инертен и служит только нерастворимой меткой.",
            },
          },
        ],
      },
    ],
  },
];

/**
 * Additional 18 curated experiments (bringing the total catalog to 24 — within the confirmed 20–30 limit,
 * with zero grades or weeks). Each entry delegates full lesson details & interactive quiz fallback cleanly.
 */
const ADDITIONAL_CATALOG_SEEDS: Array<{
  id: string;
  slug: string;
  topicId: TopicId;
  durationSeconds: number;
  safetyLevel: Experiment["safetyLevel"];
  youtubeVideo: string;
  chemicalEquation: string;
  illustration: Experiment["illustration"];
  title: Experiment["title"];
  shortDescription: Experiment["shortDescription"];
}> = [
  {
    id: "exp-07",
    slug: "acid-base-titration-phenolphthalein",
    topicId: "acids-bases",
    durationSeconds: 275,
    safetyLevel: "student_lab",
    youtubeVideo: "https://www.youtube.com/watch?v=sFpFCPTDv2w",
    chemicalEquation: "HCl (aq) + NaOH (aq) → NaCl (aq) + H₂O (l)",
    illustration: "indicator-flask",
    title: {
      en: "Acid–Base Neutralization & Phenolphthalein Endpoint",
      ky: "Кислота менен негиздин нейтралдашуусу (фенолфталеин менен титрлөө)",
      ru: "Реакция нейтрализации и титрование с фенолфталеином",
    },
    shortDescription: {
      en: "Deliver NaOH drop-by-drop from a burette to catch the exact equivalence point where colorless solution turns faint pink.",
      ky: "Бюреткадан NaOH тамчылатып кошуп, түссүз эритме мала кызыл өңгө өткөн эквиваленттик чекитти табыңыз.",
      ru: "Добавляйте NaOH по каплям из бюретки до появления устойчивой бледно-малиновой окраски фенолфталеина.",
    },
  },
  {
    id: "exp-08",
    slug: "universal-indicator-ph-column",
    topicId: "acids-bases",
    durationSeconds: 195,
    safetyLevel: "teacher_demo",
    youtubeVideo: "https://www.youtube.com/watch?v=I18K2upEHLc",
    chemicalEquation: "CO₃²⁻ (aq, bottom) + H⁺ (aq, top) → continuous pH gradient (pH 2 → 12)",
    illustration: "indicator-flask",
    title: {
      en: "Density & pH Rainbow Column in a Graduated Cylinder",
      ky: "Цилиндрдеги тыгыздык жана универсалдуу индикатордун pH-санжырасы",
      ru: "Радужная колонка pH с универсальным индикатором",
    },
    shortDescription: {
      en: "Create a vertical density gradient from dense sodium carbonate at the bottom to dilute acid at the top, displaying the full pH spectrum.",
      ky: "Түбүндө тыгыз сода эритмеси, үстүндө кислота жайгашкан вертикалдуу спектр түзүңүз.",
      ru: "Создайте градиент плотности и pH в высоком цилиндре от красного наверху до фиолетового внизу.",
    },
  },
  {
    id: "exp-09",
    slug: "iodine-clock-reaction-kinetics",
    topicId: "reactions",
    durationSeconds: 250,
    safetyLevel: "teacher_demo",
    youtubeVideo: "https://www.youtube.com/watch?v=NTFBXJ3Zd_4",
    chemicalEquation: "IO₃⁻ + 3HSO₃⁻ → I⁻ + 3SO₄²⁻ + 3H⁺  →  I₂ + starch (sudden dark blue)",
    illustration: "peroxide-foam",
    title: {
      en: "The Iodine Clock Reaction: Visualizing Reaction Rates",
      ky: "Йод сааты реакциясы: Химиялык ылдамдыкты визуалдык байкоо",
      ru: "Йодные часы: наглядная кинетика химических реакций",
    },
    shortDescription: {
      en: "Mix two colorless liquids and time how concentration and temperature control the sudden flash to deep blue-black starch-iodine complex.",
      ky: "Эки түссүз эритмени кошуп, концентрация менен температура кочкул көк өңдүн пайда болуу убактысына кантип таасир этерин ченеңиз.",
      ru: "Измерьте время до внезапного посинения раствора при разных концентрациях реагентов и температурах.",
    },
  },
  {
    id: "exp-10",
    slug: "golden-rain-lead-iodide-precipitation",
    topicId: "reactions",
    durationSeconds: 220,
    safetyLevel: "teacher_demo",
    youtubeVideo: "https://www.youtube.com/watch?v=TRkL2_bde9I",
    chemicalEquation: "Pb(NO₃)₂ (aq) + 2KI (aq) → PbI₂ (s, shimmering gold crystals)↓ + 2KNO₃ (aq)",
    illustration: "crystal-lattice",
    title: {
      en: "Golden Rain: Recrystallization of Lead(II) Iodide",
      ky: "«Алтын жамгыр»: Коргошун(II) иодидинин чөгүшү жана кристаллдашуусу",
      ru: "«Золотой дождь»: осаждение и перекристаллизация иодида свинца(II)",
    },
    shortDescription: {
      en: "Dissolve yellow PbI₂ precipitate in hot water and watch hexagonal golden crystal platelets snow down as the solution cools.",
      ky: "Сары PbI₂ чөкмөсүн ысык сууда эритип, муздаганда алтын сымал жалтырак кристаллдардын кантип түшөрүн көрүңүз.",
      ru: "Наблюдайте выпадение сверкающих золотистых шестиугольных кристаллов PbI₂ при охлаждении горячего раствора.",
    },
  },
  {
    id: "exp-11",
    slug: "burning-magnesium-ribbon-in-air",
    topicId: "reactions",
    durationSeconds: 165,
    safetyLevel: "teacher_demo",
    youtubeVideo: "https://www.youtube.com/watch?v=m2i9jLPX7_E",
    chemicalEquation: "2Mg (s) + O₂ (g) → 2MgO (s, white basic oxide powder)",
    illustration: "flame-spectrum",
    title: {
      en: "Combustion of Magnesium Ribbon & Basic Oxide Test",
      ky: "Магний тасмасынын күйүшү жана негиздик оксидди текшерүү",
      ru: "Горение магниевой ленты и свойства оксида магния",
    },
    shortDescription: {
      en: "Observe the brilliant white oxidation of magnesium metal and test the resulting MgO ash in water with an indicator.",
      ky: "Магнийдин көздү уялткан ак жалын менен күйүшүн жана пайда болгон MgO күлүнүн суудагы щелочтук чөйрөсүн текшериңиз.",
      ru: "Яркое окисление магния на воздухе и проверка щелочной реакции образующегося оксида MgO.",
    },
  },
  {
    id: "exp-12",
    slug: "hydrogen-gas-generation-pop-test",
    topicId: "gases",
    durationSeconds: 210,
    safetyLevel: "student_lab",
    youtubeVideo: "https://www.youtube.com/watch?v=4F72V61114I",
    chemicalEquation: "Zn (s) + 2HCl (aq) → ZnCl₂ (aq) + H₂ (g)↑",
    illustration: "gas-splint",
    title: {
      en: "Generating Hydrogen Gas (Zn + HCl) & the 'Pop' Test",
      ky: "Суутек газын алуу (Zn + HCl) жана «пылк» эткен үн менен текшерүү",
      ru: "Получение водорода (Zn + HCl) и проверка на чистоту",
    },
    shortDescription: {
      en: "React zinc granules with dilute hydrochloric acid, collect H₂ by upward delivery, and verify with the characteristic squeaky pop.",
      ky: "Цинк гранулаларын туз кислотасы менен реакцияга киргизип, жеңил суутек газын чогултуп текшериңиз.",
      ru: "Взаимодействие гранул цинка с соляной кислотой, сбор лёгкого газа H₂ и характерный хлопок при поджигании.",
    },
  },
  {
    id: "exp-13",
    slug: "carbon-dioxide-limewater-candle-test",
    topicId: "gases",
    durationSeconds: 205,
    safetyLevel: "student_lab",
    youtubeVideo: "https://www.youtube.com/watch?v=b7d4b3G9jB0",
    chemicalEquation: "CaCO₃ (s) + 2HCl (aq) → CaCl₂ (aq) + H₂O (l) + CO₂ (g)↑",
    illustration: "gas-splint",
    title: {
      en: "Carbon Dioxide (CO₂): Limewater Test & Pouring a Heavy Gas",
      ky: "Көмүр кычкыл газы (CO₂): Акиташ суусун ылайлатуу жана шамды өчүрүү",
      ru: "Углекислый газ (CO₂): реакция с известковой водой и тушение свечи",
    },
    shortDescription: {
      en: "Generate CO₂ from marble chips, bubble it through Ca(OH)₂ to form milky CaCO₃, and pour the dense gas to extinguish stepped candles.",
      ky: "Мрамор кесимдеринен CO₂ алып, акиташ суусун ылайлатып жана абадан оор газды куюп шамды өчүрүңүз.",
      ru: "Получение CO₂ из мрамора, помутнение известковой воды и «переливание» тяжёлого газа на горящие свечи.",
    },
  },
  {
    id: "exp-14",
    slug: "oxygen-generation-glowing-splint",
    topicId: "gases",
    durationSeconds: 190,
    safetyLevel: "student_lab",
    youtubeVideo: "https://www.youtube.com/watch?v=p1eG2y2mn54",
    chemicalEquation: "2H₂O₂ (aq) —[MnO₂]→ 2H₂O (l) + O₂ (g)↑",
    illustration: "gas-splint",
    title: {
      en: "Laboratory Preparation of Oxygen & Glowing Splint Test",
      ky: "Лабораторияда кычкылтек алуу (MnO₂ менен) жана чокту жандыруу",
      ru: "Лабораторное получение кислорода (с MnO₂) и опыт с тлеющей лучинкой",
    },
    shortDescription: {
      en: "Collect pure oxygen over water using manganese(IV) oxide catalyst and watch a glowing wooden splint burst back into bright flame.",
      ky: "Марганец(IV) оксидинин жардамы менен суу астында кычкылтек чогултуп, чок болуп турган чырпыкты жандырыңыз.",
      ru: "Сбор кислорода методом вытеснения воды и яркое воспламенение тлеющей лучинки.",
    },
  },
  {
    id: "exp-15",
    slug: "silver-tree-copper-silver-nitrate",
    topicId: "metals",
    durationSeconds: 240,
    safetyLevel: "teacher_demo",
    youtubeVideo: "https://www.youtube.com/watch?v=p8qD42jC6nE",
    chemicalEquation: "Cu (s) + 2AgNO₃ (aq) → Cu(NO₃)₂ (aq, blue) + 2Ag (s, sparkling needles)↓",
    illustration: "copper-displacement",
    title: {
      en: "Growing a Silver Crystal Tree on Copper Wire",
      ky: "«Күмүш дарагы»: Жез зымда күмүш кристаллдарынын өсүшү",
      ru: "«Серебряное дерево»: вытеснение серебра медью из раствора AgNO₃",
    },
    shortDescription: {
      en: "Suspend a coiled copper wire in colorless silver nitrate solution and watch delicate metallic silver dendrites branch out while the liquid turns blue.",
      ky: "Түссүз күмүш нитратына салынган жез зымда жалтырак күмүш ийнечелери өсүп, эритме көк өңгө өтүшүн көрүңүз.",
      ru: "Рост сверкающих дендритов металлического серебра на медной спирали и посинение раствора за счёт ионов Cu²⁺.",
    },
  },
  {
    id: "exp-16",
    slug: "alkali-metals-sodium-in-water",
    topicId: "metals",
    durationSeconds: 185,
    safetyLevel: "observe",
    youtubeVideo: "https://www.youtube.com/watch?v=dmcfsEEogxs",
    chemicalEquation: "2Na (s) + 2H₂O (l) → 2NaOH (aq) + H₂ (g)↑",
    illustration: "peroxide-foam",
    title: {
      en: "Reactivity of Alkali Metals: Sodium with Water & Phenolphthalein",
      ky: "Щелочтуу металлдардын активдүүлүгү: Натрийдин суу менен реакциясы",
      ru: "Активность щелочных металлов: реакция натрия с водой",
    },
    shortDescription: {
      en: "Observe why a pea-sized piece of sodium melts into a silvery sphere, skitters across water propelled by H₂ gas, and trails pink phenolphthalein.",
      ky: "Натрийдин суу үстүндө күмүш шарчага айланып, H₂ газынын эсебинен жылып, фенолфталеинди мала кызылга боёшун байкаңыз.",
      ru: "Наблюдайте, как натрий плавится в серебристый шарик, стремительно бегает по воде и окрашивает фенолфталеин в малиновый цвет.",
    },
  },
  {
    id: "exp-17",
    slug: "supersaturated-sodium-acetate-hot-ice",
    topicId: "solutions",
    durationSeconds: 210,
    safetyLevel: "student_lab",
    youtubeVideo: "https://www.youtube.com/watch?v=7HDf2pE7mF0",
    chemicalEquation: "CH₃COONa (aq, supersaturated) + 3H₂O —[seed crystal]→ CH₃COONa·3H₂O (s) + heat",
    illustration: "crystal-lattice",
    title: {
      en: "'Hot Ice': Instant Crystallization of Supersaturated Sodium Acetate",
      ky: "«Ысык муз»: Өтө каныккан натрий ацетатынын көз ирмемде кристаллдашуусу",
      ru: "«Горячий лёд»: мгновенная кристаллизация пересыщенного ацетата натрия",
    },
    shortDescription: {
      en: "Touch a single seed crystal to a clear, supercooled sodium acetate solution and watch needle crystals radiate outward while releasing warmth.",
      ky: "Тунук эритмеге бир кристалл тийгизгенде ийне сымал кристаллдар жылуулук бөлүп чыгаруу менен кантип тараларын көрүңүз.",
      ru: "Прикоснитесь кристаллом-затравкой к пересыщенному раствору и наблюдайте стремительный экзотермический рост кристаллов.",
    },
  },
  {
    id: "exp-18",
    slug: "growing-copper-sulfate-single-crystals",
    topicId: "solutions",
    durationSeconds: 225,
    safetyLevel: "student_lab",
    youtubeVideo: "https://www.youtube.com/watch?v=kK42f2b0B4Y",
    chemicalEquation: "Cu²⁺ (aq) + SO₄²⁻ (aq) + 5H₂O (l) ⇌ CuSO₄·5H₂O (s, triclinic blue crystal)",
    illustration: "crystal-lattice",
    title: {
      en: "Growing Triclinic Copper(II) Sulfate Pentahydrate Crystals",
      ky: "Жез купоросунун (CuSO₄·5H₂O) чоң көк кристаллдарын өстүрүү",
      ru: "Выращивание монокристаллов медного купороса (CuSO₄·5H₂O)",
    },
    shortDescription: {
      en: "Prepare a saturated solution, suspend a seed crystal, and understand how slow evaporation produces geometric triclinic crystal facets.",
      ky: "Каныккан эритме даярдап, жай буулантуу аркылуу геометриялык кырлары так болгон көк кристалл өстүрүңүз.",
      ru: "Приготовьте насыщенный раствор и проследите, как медленное испарение формирует правильные грани кристалла.",
    },
  },
  {
    id: "exp-19",
    slug: "solubility-potassium-nitrate-temperature",
    topicId: "solutions",
    durationSeconds: 240,
    safetyLevel: "student_lab",
    youtubeVideo: "https://www.youtube.com/watch?v=kK42f2b0B4Y",
    chemicalEquation: "KNO₃ (s) + ΔH_soln ⇌ K⁺ (aq) + NO₃⁻ (aq)",
    illustration: "crystal-lattice",
    title: {
      en: "Effect of Temperature on the Solubility of Potassium Nitrate (KNO₃)",
      ky: "Калий нитратынын (KNO₃) эригичтигине температуранын таасири",
      ru: "Зависимость растворимости нитрата калия (KNO₃) от температуры",
    },
    shortDescription: {
      en: "Measure crystallization temperatures at different concentrations to plot a real solubility curve and see why KNO₃ precipitates on cooling.",
      ky: "Ар кандай температурада кристаллдардын түшүшүн байкап, эригичтик ийри сызыгын түзүүнү үйрөнүңүз.",
      ru: "Определите температуру начала кристаллизации и постройте кривую растворимости соли в воде.",
    },
  },
  {
    id: "exp-20",
    slug: "filtration-evaporation-sand-salt-mixture",
    topicId: "separation",
    durationSeconds: 215,
    safetyLevel: "student_lab",
    youtubeVideo: "https://www.youtube.com/watch?v=vi_SJBnxmHo",
    chemicalEquation: "NaCl (s) + SiO₂ (s) —[+H₂O, filter, evaporate]→ pure SiO₂ (residue) + NaCl (crystals)",
    illustration: "chromatography-strip",
    title: {
      en: "Separating a Heterogeneous Sand & Salt Mixture (Filtration & Evaporation)",
      ky: "Кум менен туздун аралашмасын бөлүү (эритүү, чыпкалоо жана буулантуу)",
      ru: "Разделение смеси песка и поваренной соли (фильтрование и выпаривание)",
    },
    shortDescription: {
      en: "Exploit differences in water solubility and particle size to separate insoluble quartz sand on filter paper and recover pure NaCl crystals in an evaporating dish.",
      ky: "Эригичтиктин айырмасын пайдаланып, кумду чыпка кагазында бөлүп алып, фарфор табакчада таза туз кристаллдарын алыңыз.",
      ru: "Используйте различие в растворимости, чтобы отделить кварцевый песок на фильтре и выделить кристаллы NaCl выпариванием.",
    },
  },
  {
    id: "exp-21",
    slug: "simple-distillation-colored-salt-water",
    topicId: "separation",
    durationSeconds: 265,
    safetyLevel: "teacher_demo",
    youtubeVideo: "https://www.youtube.com/watch?v=V5ep0-ojPGw",
    chemicalEquation: "H₂O (l, bp 100 °C) —[boil]→ H₂O (g) —[Liebig condenser]→ pure H₂O (l, distillate)",
    illustration: "chromatography-strip",
    title: {
      en: "Simple Distillation: Purifying Water from a Colored Salt Solution",
      ky: "Жөнөкөй дистилляция: Түстүү туздуу эритмеден таза сууну бөлүп алуу",
      ru: "Простая перегонка (дистилляция): получение чистой воды из раствора",
    },
    shortDescription: {
      en: "Assemble a distillation flask, thermometer, and water-cooled Liebig condenser to collect crystal-clear distilled water from an ink-tinted saline solution.",
      ky: "Вюрц колбасы жана Либих муздаткычы аркылуу түстүү туздуу суудан таза дистилденген суу алууну көрүңүз.",
      ru: "Работа установки с холодильником Либиха: кипячение окрашенного солевого раствора и конденсация идеально прозрачного дистиллята.",
    },
  },
  {
    id: "exp-22",
    slug: "daniel-galvanic-cell-copper-zinc-lemon",
    topicId: "electrochemistry",
    durationSeconds: 235,
    safetyLevel: "student_lab",
    youtubeVideo: "https://www.youtube.com/watch?v=GhbuhT1GDpI",
    chemicalEquation: "Zn (s) + Cu²⁺ (aq) → Zn²⁺ (aq) + Cu (s)   (E°_cell = +1.10 V)",
    illustration: "electrolysis-tubes",
    title: {
      en: "Building a Zinc–Copper Galvanic Cell & Fruit Battery",
      ky: "Цинк–жез гальваникалык элементи жана жемиш батареясы",
      ru: "Гальванический элемент Якоби–Даниэля (Zn–Cu) и фруктовая батарейка",
    },
    shortDescription: {
      en: "Convert spontaneous redox electron transfer between zinc and copper electrodes into measurable electrical voltage that lights an LED.",
      ky: "Цинк менен жез электроддорунун ортосундагы электрондордун агымын электр тогуна айландырып, вольтметр жана светодиод менен текшериңиз.",
      ru: "Превратите химическую энергию окислительно-восстановительной реакции между цинком и медью в электрическое напряжение 1,10 В.",
    },
  },
  {
    id: "exp-23",
    slug: "electrolysis-copper-chloride-ki-starch",
    topicId: "electrochemistry",
    durationSeconds: 230,
    safetyLevel: "teacher_demo",
    youtubeVideo: "https://www.youtube.com/watch?v=HQ9Fhd7P_HA",
    chemicalEquation: "2I⁻ (aq, anode) → I₂ (aq, brown) + 2e⁻  |  2H₂O + 2e⁻ (cathode) → H₂ (g) + 2OH⁻ (pink)",
    illustration: "electrolysis-tubes",
    title: {
      en: "Color-Coded Electrolysis of Potassium Iodide in a U-Tube",
      ky: "U-түрүндөгү түтүктө калий иодидинин түстүү электролизи",
      ru: "Наглядный электролиз раствора иодида калия в U-образной трубке",
    },
    shortDescription: {
      en: "Watch two distinct colors appear simultaneously at opposite electrodes: pink phenolphthalein + H₂ bubbles at the cathode and golden-brown iodine (I₂) at the anode.",
      ky: "Эки электроддо эки башка өңдүн пайда болушун көрүңүз: катоддо мала кызыл өң жана H₂ көбүкчөлөрү, аноддо күрөң йод (I₂).",
      ru: "Одновременное появление малиновой окраски у катода (OH⁻ + H₂↑) и бурого иода (I₂) у анода.",
    },
  },
  {
    id: "exp-24",
    slug: "exothermic-endothermic-dissolution-salts",
    topicId: "energy",
    durationSeconds: 195,
    safetyLevel: "student_lab",
    youtubeVideo: "https://www.youtube.com/watch?v=eJXL0IrbtqE",
    chemicalEquation: "CaCl₂ (s) —[+H₂O]→ ΔH < 0 (warms)  |  NH₄NO₃ (s) —[+H₂O]→ ΔH > 0 (chills)",
    illustration: "flame-spectrum",
    title: {
      en: "Exothermic vs. Endothermic Dissolution: Hot & Cold Packs Explained",
      ky: "Экзотермиялык жана эндотермиялык эрүү: Жылуулуктун бөлүнүшү жана жутулушу",
      ru: "Экзо- и эндотермическое растворение солей: химия грелок и хладопакетов",
    },
    shortDescription: {
      en: "Track digital thermometer readings as anhydrous calcium chloride heats water above 50 °C while ammonium nitrate chills water near freezing.",
      ky: "Термометрдин жардамы менен кальций хлориди сууну кантип ысытарын, ал эми аммоний нитраты кантип муздатарын салыштырыңыз.",
      ru: "Измерьте скачок температуры при растворении CaCl₂ (нагрев) и NH₄NO₃ (резкое охлаждение) и сравните энергию решётки с гидратацией.",
    },
  },
];

function hydrateSeedExperiment(seed: (typeof ADDITIONAL_CATALOG_SEEDS)[number]): Experiment {
  const topic = TOPICS.find((t) => t.id === seed.topicId) ?? TOPICS[0];
  return {
    ...seed,
    featured: false,
    objectives: {
      en: [
        `Observe the visual macroscopic changes in ${seed.title.en} and connect them to the balanced chemical equation.`,
        `Explain the particle-level mechanism within ${topic.title.en}.`,
        "Follow proper laboratory safety protocols and identify the required glassware and reagents.",
      ],
      ky: [
        `«${seed.title.ky}» тажрыйбасындагы визуалдык белгилерди байкап, аларды реакциянын теңдемеси менен байланыштыруу.`,
        `«${topic.title.ky}» темасынын негизинде кубулуштун молекулярдык маңызын түшүндүрүү.`,
        "Лабораториялык коопсуздук эрежелерин жана колдонулган шаймандарды билүү.",
      ],
      ru: [
        `Проследить макроскопические признаки в опыте «${seed.title.ru}» и сопоставить их с уравнением процесса.`,
        `Объяснить механизм явления в рамках темы «${topic.title.ru}».`,
        "Соблюдать правила техники безопасности при работе с лабораторной посудой и реактивами.",
      ],
    },
    materials: {
      en: ["Borosilicate test tubes & beakers", "Primary reagents shown in equation", "Graduated pipette / spatula", "Safety goggles, lab coat & gloves"],
      ky: ["Лабораториялык пробиркалар жана стакандар", "Теңдемеде көрсөтүлгөн негизги реактивдер", "Өлчөөчү пипетка же шпатель", "Коргоочу көз айнек, халат жана кол кап"],
      ru: ["Лабораторные пробирки и химические стаканы", "Реактивы согласно уравнению реакции", "Мерная пипетка и шпатель", "Защитные очки, халат и перчатки"],
    },
    safetyNotes: {
      en: [
        "Always wear splash-proof safety goggles and follow your chemistry teacher's instructions.",
        "Dispose of reaction mixtures in designated laboratory waste containers rather than household sinks.",
      ],
      ky: [
        "Тажрыйба учурунда сөзсүз коргоочу көз айнек тагынып, химия мугалиминин көрсөтмөлөрүн так аткарыңыз.",
        "Иштетилген эритмелерди атайын калдык идишке чогултуңуз.",
      ],
      ru: [
        "Обязательно используйте защитные очки и выполняйте работу только под руководством учителя химии.",
        "Собирайте отработанные растворы в маркированные ёмкости для лабораторных отходов.",
      ],
    },
    scientificExplanation: {
      en: [
        seed.shortDescription.en,
        `Reaction summary: ${seed.chemicalEquation}. By watching the rate of change, color shift, phase change, or temperature shift, we can directly verify conservation of mass and charge at the molecular level.`,
      ],
      ky: [
        seed.shortDescription.ky,
        `Процесстин негизги теңдемеси: ${seed.chemicalEquation}. Өңдүн, агрегаттык абалдын же температуранын өзгөрүшү аркылуу молекулярдык деңгээлдеги кубулушту так көрүүгө болот.`,
      ],
      ru: [
        seed.shortDescription.ru,
        `Схема процесса: ${seed.chemicalEquation}. Наблюдая изменение окраски, агрегатного состояния или температуры, мы связываем видимые признаки реакции с перестройкой частиц.`,
      ],
    },
    steps: [
      {
        timeSeconds: 15,
        title: { en: "Apparatus & reagent setup", ky: "Шаймандарды жана реактивдерди даярдоо", ru: "Подготовка приборов и реактивов" },
        detail: {
          en: "Inspect clean glassware, verify labels, and measure initial quantities carefully.",
          ky: "Идиштердин тазалыгын жана реактивдердин этикеткаларын текшерип, баштапкы көлөмдү ченейбиз.",
          ru: "Проверяем чистоту посуды, маркировку склянок и отмеряем исходные порции веществ.",
        },
      },
      {
        timeSeconds: 70,
        title: { en: "Initiate reaction & observe key change", ky: "Реакцияны баштоо жана негизги белгини байкоо", ru: "Проведение опыта и наблюдение эффекта" },
        detail: {
          en: seed.shortDescription.en,
          ky: seed.shortDescription.ky,
          ru: seed.shortDescription.ru,
        },
      },
      {
        timeSeconds: 145,
        title: { en: "Analyze product & record conclusion", ky: "Жыйынтыкты талдоо", ru: "Анализ продуктов и формулировка вывода" },
        detail: {
          en: `Verify the products predicted by ${seed.chemicalEquation}.`,
          ky: `${seed.chemicalEquation} теңдемеси боюнча пайда болгон заттарды талдайбыз.`,
          ru: `Сопоставляем наблюдения с уравнением ${seed.chemicalEquation}.`,
        },
      },
    ],
    quiz: [
      {
        id: "q1",
        conceptTag: seed.topicId,
        hint: {
          en: `Focus on the reactants and products shown in the balanced equation for ${topic.title.en}.`,
          ky: `«${topic.title.ky}» темасындагы реакциянын баштапкы заттарына жана продуктыларына көңүл буруңуз.`,
          ru: `Обратите внимание на исходные вещества и продукты в уравнении реакции по теме «${topic.title.ru}».`,
        },
        prompt: {
          en: `Which equation or relationship represents the core chemical principle demonstrated in "${seed.title.en}"?`,
          ky: `«${seed.title.ky}» тажрыйбасындагы негизги процессти кайсы теңдеме же байланыш туюндурат?`,
          ru: `Какая запись отражает ключевой процесс в эксперименте «${seed.title.ru}»?`,
        },
        options: [
          {
            id: "a",
            text: {
              en: seed.chemicalEquation,
              ky: seed.chemicalEquation,
              ru: seed.chemicalEquation,
            },
            isCorrect: true,
            explanation: {
              en: "Correct! This balanced representation accounts for the observed macroscopic change in the experiment.",
              ky: "Туура! Бул теңдеме тажрыйбада байкалган өзгөрүүнү так сүрөттөйт.",
              ru: "Верно! Эта схема точно описывает наблюдаемые в опыте изменения.",
            },
          },
          {
            id: "b",
            text: {
              en: "No chemical or physical interaction occurs between the components.",
              ky: "Компоненттердин ортосунда эч кандай химиялык же физикалык кубулуш жүрбөйт.",
              ru: "Между компонентами системы не происходит никаких превращений.",
            },
            isCorrect: false,
            misconceptionTag: "ignoring_macroscopic_reaction_evidence",
            misconceptionLabel: {
              en: "Overlooking visible evidence of chemical or phase change",
              ky: "Химиялык же фазалык өзгөрүүнүн визуалдык белгилерин эске албоо",
              ru: "Игнорирование видимых признаков химического или фазового превращения",
            },
            explanation: {
              en: "Look closely at the video observation — a clear measurable change occurs during the procedure.",
              ky: "Видеого көңүл буруңуз — тажрыйба учурунда даана байкалган өзгөрүү жүрөт.",
              ru: "Обратите внимание на видео — в ходе опыта наблюдается отчётливый признак процесса.",
            },
          },
          {
            id: "c",
            text: {
              en: "Mass is destroyed during the reaction so the total number of atoms decreases.",
              ky: "Реакция учурунда заттын массасы жоголуп, атомдордун жалпы саны азаят.",
              ru: "В ходе реакции часть атомов исчезает, нарушая закон сохранения массы.",
            },
            isCorrect: false,
            misconceptionTag: "conservation_of_mass_violation",
            misconceptionLabel: {
              en: "Misunderstanding conservation of mass and atoms in chemical reactions",
              ky: "Заттын массасынын жана атомдордун сакталуу мыйзамын туура эмес түшүнүү",
              ru: "Нарушение закона сохранения массы и числа атомов в химических реакциях",
            },
            explanation: {
              en: "By the Law of Conservation of Mass, atoms are rearranged—never destroyed—in chemical reactions.",
              ky: "Массанын сакталуу мыйзамы боюнча химиялык реакцияда атомдор жоголбойт, кайра топтошот.",
              ru: "Согласно закону сохранения массы, атомы в химических реакциях перегруппировываются, но не исчезают.",
            },
          },
        ],
      },
      {
        id: "q2",
        conceptTag: seed.topicId,
        hint: {
          en: "Consider what visible macroscopic evidence confirms that the process has taken place.",
          ky: "Тажрыйбанын жүргөнүн кайсы негизги визуалдык белги далилдей турганын эстеңиз.",
          ru: "Подумайте, какой наглядный признак подтверждает протекание данного опыта.",
        },
        prompt: {
          en: `What is the key observable outcome verified in "${seed.title.en}"?`,
          ky: `«${seed.title.ky}» тажрыйбасында кайсы негизги кубулуш байкалат?`,
          ru: `Какой ключевой наглядный результат подтверждается в опыте «${seed.title.ru}»?`,
        },
        options: [
          {
            id: "a",
            text: {
              en: seed.shortDescription.en,
              ky: seed.shortDescription.ky,
              ru: seed.shortDescription.ru,
            },
            isCorrect: true,
            explanation: {
              en: "Spot on! This macroscopic observation directly reflects the underlying molecular mechanism.",
              ky: "Эң туура! Бул байкоо молекулярдык деңгээлдеги процессти түздөн-түз чагылдырат.",
              ru: "Точно! Это макроскопическое наблюдение напрямую отражает молекулярный механизм процесса.",
            },
          },
          {
            id: "b",
            text: {
              en: "The glass beaker itself chemically dissolves into the aqueous solution at room temperature.",
              ky: "Бөлмө температурасында лабораториялык айнек стакан эритмеде толук эрип кетет.",
              ru: "Боросиликатное стекло стакана полностью растворяется в воде при комнатной температуре.",
            },
            isCorrect: false,
            misconceptionTag: "inert_apparatus_confusion",
            misconceptionLabel: {
              en: "Confusing inert borosilicate glassware with active chemical reactants",
              ky: "Инерттүү лабораториялык идишти активдүү реактив менен алмаштыруу",
              ru: "Смешение роли инертной химической посуды и реагирующих веществ",
            },
            explanation: {
              en: "Borosilicate laboratory glassware is chemically inert under these conditions; only the reagents inside react.",
              ky: "Лабораториялык боросиликат айнеги бул шарттарда химиялык жактан инерттүү болот.",
              ru: "Лабораторная посуда из боросиликатного стекла химически инертна в условиях данного опыта.",
            },
          },
        ],
      },
    ],
  };
}

const SHORT_EXPERIMENT_TITLES: Record<string, Experiment["title"]> = {
  "red-cabbage-ph-indicator": {
    en: "Red Cabbage pH Experiment",
    ky: "Кызыл кочан pH-индикатору",
    ru: "Шкала pH из красной капусты",
  },
  "catalytic-decomposition-hydrogen-peroxide": {
    en: "Hydrogen Peroxide Catalysis",
    ky: "Пероксиддин каталитикалык ажыроосу",
    ru: "Каталитическое разложение H₂O₂",
  },
  "electrolysis-of-water-hoffman": {
    en: "Electrolysis of Water",
    ky: "Суунун электролизи",
    ru: "Электролиз воды",
  },
  "iron-nail-copper-sulfate-displacement": {
    en: "Iron Nail in Copper Sulfate",
    ky: "Темир мык жана жез сульфаты",
    ru: "Железный гвоздь в сульфате меди",
  },
  "flame-tests-metal-cations": {
    en: "Flame Colors of Metals",
    ky: "Металлдардын жалынынын өңү",
    ru: "Окрашивание пламени металлами",
  },
  "paper-chromatography-plant-ink-pigments": {
    en: "Paper Chromatography",
    ky: "Кагаз хроматографиясы",
    ru: "Бумажная хроматография",
  },
  "acid-base-titration-phenolphthalein": {
    en: "Acid–Base Titration",
    ky: "Кислота-негиздик титрлөө",
    ru: "Кислотно-основное титрование",
  },
  "universal-indicator-ph-column": {
    en: "pH Rainbow Column",
    ky: "Цилиндрдеги pH спектри",
    ru: "Радужная колонка pH",
  },
  "iodine-clock-reaction-kinetics": {
    en: "The Iodine Clock Reaction",
    ky: "Йод сааты реакциясы",
    ru: "Реакция «Йодные часы»",
  },
  "golden-rain-lead-iodide-precipitation": {
    en: "Golden Rain Crystals",
    ky: "«Алтын жамгыр» кристаллдары",
    ru: "Кристаллы «Золотой дождь»",
  },
  "burning-magnesium-ribbon-in-air": {
    en: "Burning Magnesium Ribbon",
    ky: "Магний тасмасынын күйүшү",
    ru: "Горение магниевой ленты",
  },
  "hydrogen-gas-generation-pop-test": {
    en: "Hydrogen Gas Pop Test",
    ky: "Суутек газын алуу жана текшерүү",
    ru: "Получение и проверка водорода",
  },
  "carbon-dioxide-limewater-candle-test": {
    en: "Carbon Dioxide Tests",
    ky: "Көмүр кычкыл газын таануу",
    ru: "Опыты с углекислым газом",
  },
  "oxygen-generation-glowing-splint": {
    en: "Generating Oxygen Gas",
    ky: "Кычкылтек алуу жана текшерүү",
    ru: "Получение кислорода",
  },
  "silver-tree-copper-silver-nitrate": {
    en: "Silver Crystal Tree",
    ky: "«Күмүш дарагын» өстүрүү",
    ru: "Выращивание «Серебряного дерева»",
  },
  "alkali-metals-sodium-in-water": {
    en: "Sodium in Water",
    ky: "Натрийдин суу менен реакциясы",
    ru: "Реакция натрия с водой",
  },
  "supersaturated-sodium-acetate-hot-ice": {
    en: "Hot Ice Crystallization",
    ky: "«Ысык муз» кристаллдашуусу",
    ru: "Кристаллизация «Горячего льда»",
  },
  "growing-copper-sulfate-single-crystals": {
    en: "Copper Sulfate Crystals",
    ky: "Жез купоросунун кристаллдары",
    ru: "Кристаллы медного купороса",
  },
  "solubility-potassium-nitrate-temperature": {
    en: "Solubility of Potassium Nitrate",
    ky: "Калий нитратынын эригичтиги",
    ru: "Растворимость нитрата калия",
  },
  "filtration-evaporation-sand-salt-mixture": {
    en: "Separating Sand and Salt",
    ky: "Кум менен тузду бөлүү",
    ru: "Разделение песка и соли",
  },
  "simple-distillation-colored-salt-water": {
    en: "Simple Water Distillation",
    ky: "Сууну дистилляциялоо",
    ru: "Дистилляция воды",
  },
  "daniel-galvanic-cell-copper-zinc-lemon": {
    en: "Zinc–Copper Galvanic Cell",
    ky: "Цинк–жез гальваникалык элементи",
    ru: "Гальванический элемент Zn–Cu",
  },
  "electrolysis-copper-chloride-ki-starch": {
    en: "Potassium Iodide Electrolysis",
    ky: "Калий иодидинин электролизи",
    ru: "Электролиз иодида калия",
  },
  "exothermic-endothermic-dissolution-salts": {
    en: "Hot & Cold Salt Dissolution",
    ky: "Туздардын жылуулук менен эриши",
    ru: "Тепловой эффект растворения",
  },
};

function enrichExperimentMetadata(exp: Experiment): Experiment {
  const shortTitle = SHORT_EXPERIMENT_TITLES[exp.slug] ?? exp.title;
  const enrichedQuiz = exp.quiz.map((q) => ({
    ...q,
    conceptTag: q.conceptTag ?? exp.topicId,
    hint: q.hint ?? {
      en: `Review the chemical equation (${exp.chemicalEquation}) and what you observed during the key reaction step.`,
      ky: `Реакциянын теңдемесин (${exp.chemicalEquation}) жана тажрыйбанын негизги баскычындагы байкоону эстеңиз.`,
      ru: `Вспомните уравнение процесса (${exp.chemicalEquation}) и наблюдения на ключевом этапе опыта.`,
    },
    options: q.options.map((opt) => {
      if (opt.isCorrect) return opt;
      return {
        ...opt,
        misconceptionTag: opt.misconceptionTag ?? `${exp.topicId}_concept_misinterpretation`,
        misconceptionLabel: opt.misconceptionLabel ?? {
          en: `Misinterpreting the mechanism in ${shortTitle.en}`,
          ky: `«${shortTitle.ky}» тажрыйбасындагы кубулушту туура эмес чечмелөө`,
          ru: `Неточная интерпретация механизма в опыте «${shortTitle.ru}»`,
        },
      };
    }),
  }));

  const segments: TranscriptSegment[] =
    exp.transcriptSegments ??
    exp.steps.map((step, idx) => {
      const nextStep = exp.steps[idx + 1];
      const endSeconds = nextStep ? nextStep.timeSeconds : exp.durationSeconds;
      const sciIdx = Math.min(idx, exp.scientificExplanation.en.length - 1);
      return {
        id: `${exp.id}-seg-${idx + 1}`,
        startSeconds: idx === 0 ? 0 : step.timeSeconds,
        endSeconds,
        text: {
          en: `[Stage ${idx + 1}: ${step.title.en}] ${step.detail.en} Scientific context: ${exp.scientificExplanation.en[sciIdx] ?? ""}`,
          ky: `[${idx + 1}-баскыч: ${step.title.ky}] ${step.detail.ky} Илимий түшүндүрмө: ${exp.scientificExplanation.ky[sciIdx] ?? ""}`,
          ru: `[Этап ${idx + 1}: ${step.title.ru}] ${step.detail.ru} Научное объяснение: ${exp.scientificExplanation.ru[sciIdx] ?? ""}`,
        },
      };
    });

  return {
    ...exp,
    title: shortTitle,
    quiz: enrichedQuiz,
    transcriptSegments: segments,
  };
}

export const EXPERIMENTS: Experiment[] = [
  ...CORE_EXPERIMENTS.map(enrichExperimentMetadata),
  ...ADDITIONAL_CATALOG_SEEDS.map(hydrateSeedExperiment).map(enrichExperimentMetadata),
];

export function getAllExperiments(): Experiment[] {
  return EXPERIMENTS;
}

export function getFeaturedExperiments(): Experiment[] {
  return EXPERIMENTS.filter((exp) => exp.featured);
}

export function getExperimentBySlug(slug: string): Experiment | undefined {
  return EXPERIMENTS.find((exp) => exp.slug === slug);
}

export function getRelatedExperiments(experiment: Experiment, limit = 3): Experiment[] {
  return EXPERIMENTS.filter(
    (item) => item.topicId === experiment.topicId && item.id !== experiment.id
  ).slice(0, limit);
}

export function getTopicById(topicId: TopicId): TopicInfo {
  return TOPICS.find((t) => t.id === topicId) ?? TOPICS[0];
}

export function getTranscriptSegmentsAroundTimestamp(
  experiment: Experiment,
  timestampSeconds: number,
  windowSeconds = 40
): TranscriptSegment[] {
  const segments = experiment.transcriptSegments ?? [];
  const matches = segments.filter(
    (seg) =>
      seg.startSeconds <= timestampSeconds + windowSeconds &&
      seg.endSeconds >= Math.max(0, timestampSeconds - windowSeconds)
  );
  return matches.length > 0 ? matches : segments.slice(0, 2);
}
