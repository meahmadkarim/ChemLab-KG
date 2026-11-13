import type { Experiment, TopicInfo, TopicId, TranscriptSegment } from "./types";
import catalog from "./public-catalog.json";
export const EXPERIMENTS = catalog as Experiment[];
export const TOPICS: TopicInfo[] = [
  {
    "id": "acids-bases",
    "iconName": "FlaskConical",
    "accentColor": "#087F8C",
    "softBg": "#EAE3F5",
    "title": {
      "en": "Acids & Bases",
      "ky": "Кислоталар жана негиздер",
      "ru": "Кислоты и основания"
    },
    "description": {
      "en": "See how natural and lab indicators change color across the pH scale.",
      "ky": "Табигый жана лабораториялык индикаторлордун өңүнүн өзгөрүшүн байкаңыз.",
      "ru": "Наглядные переходы окраски индикаторов и реакции нейтрализации."
    }
  },
  {
    "id": "reactions",
    "iconName": "Sparkles",
    "accentColor": "#087F8C",
    "softBg": "#F7DED0",
    "title": {
      "en": "Chemical Reactions",
      "ky": "Химиялык реакциялар",
      "ru": "Химические реакции"
    },
    "description": {
      "en": "Watch rapid catalysis, color-changing clock reactions, and golden crystals.",
      "ky": "Тез катализди, саат реакцияларын жана жаркыраган чөкмөлөрдү көрүңүз.",
      "ru": "Быстрый катализ, часовые реакции и выпадение кристаллов."
    }
  },
  {
    "id": "gases",
    "iconName": "Wind",
    "accentColor": "#087F8C",
    "softBg": "#DCECF6",
    "title": {
      "en": "Gas Tests",
      "ky": "Газдарды аныктоо",
      "ru": "Опыты с газами"
    },
    "description": {
      "en": "Generate and test hydrogen, oxygen, and carbon dioxide in the lab.",
      "ky": "Лабораторияда суутек, кычкылтек жана көмүр кычкыл газын таануу.",
      "ru": "Получение и распознавание водорода, кислорода и углекислого газа."
    }
  },
  {
    "id": "metals",
    "iconName": "Shield",
    "accentColor": "#087F8C",
    "softBg": "#DCE9DF",
    "title": {
      "en": "Metals & Reactivity",
      "ky": "Металлдар",
      "ru": "Металлы и активность"
    },
    "description": {
      "en": "Compare how different metals displace ions, grow crystal trees, and react.",
      "ky": "Металлдардын орун алмашуу реакцияларын жана активдүүлүгүн салыштырыңыз.",
      "ru": "Реакции замещения, серебряное дерево и активность металлов."
    }
  },
  {
    "id": "solutions",
    "iconName": "Droplets",
    "accentColor": "#087F8C",
    "softBg": "#DCE9DF",
    "title": {
      "en": "Crystals & Solutions",
      "ky": "Кристаллдар жана эритмелер",
      "ru": "Кристаллы и растворы"
    },
    "description": {
      "en": "Trigger instant crystallization and grow geometric mineral crystals.",
      "ky": "Көз ирмемдик кристаллдашууну жана геометриялык кристаллдарды өстүрүү.",
      "ru": "Мгновенная кристаллизация и выращивание кристаллов из растворов."
    }
  },
  {
    "id": "separation",
    "iconName": "Layers",
    "accentColor": "#087F8C",
    "softBg": "#EAE3F5",
    "title": {
      "en": "Separation Methods",
      "ky": "Аралашмаларды бөлүү",
      "ru": "Разделение смесей"
    },
    "description": {
      "en": "Separate pigments and purify liquids with chromatography and distillation.",
      "ky": "Хроматография, чыпкалоо жана дистилляция аркылуу заттарды тазалоо.",
      "ru": "Бумажная хроматография, фильтрование и простая перегонка."
    }
  },
  {
    "id": "electrochemistry",
    "iconName": "Zap",
    "accentColor": "#087F8C",
    "softBg": "#DCECF6",
    "title": {
      "en": "Electrochemistry",
      "ky": "Электрохимия",
      "ru": "Электрохимия"
    },
    "description": {
      "en": "Split water with electricity and build working chemical batteries.",
      "ky": "Электр тогу менен сууну ажыратып, химиялык батарея куруңуз.",
      "ru": "Электролиз воды и солей, работа гальванических элементов."
    }
  },
  {
    "id": "energy",
    "iconName": "Flame",
    "accentColor": "#087F8C",
    "softBg": "#F7DED0",
    "title": {
      "en": "Flame & Energy",
      "ky": "Жалын жана энергия",
      "ru": "Пламя и энергия"
    },
    "description": {
      "en": "Identify elements by flame colors and measure heat release in reactions.",
      "ky": "Жалындын өңү боюнча металлдарды таанып, жылуулук кубулуштарын ченеңиз.",
      "ru": "Окрашивание пламени и тепловые эффекты химических процессов."
    }
  }
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
