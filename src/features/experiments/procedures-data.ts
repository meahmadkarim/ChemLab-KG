import type { ExperimentProcedure } from "./types";

export const EXPERIMENT_PROCEDURES: Record<string, ExperimentProcedure> = {
  "red-cabbage-ph-indicator": {
    experimentId: "exp-01",
    slug: "red-cabbage-ph-indicator",
    reviewStatus: "under_review",
    teacherSupervised: false,
    introduction: {
      en: "In this practical lab, you will extract natural anthocyanin pigments from red cabbage and observe their reversible structural color shifts across the full pH 1–13 spectrum.",
      ky: "Бул практикалык иште кызыл кочандан табигый антоцианин пигменттерин бөлүп алып, алардын pH 1–13 шкаласындагы өңүнүн өзгөрүшүн изилдейсиз.",
      ru: "В данной лабораторной работе вы выделите природные антоцианы из краснокочанной капусты и исследуете обратимые переходы окраски в диапазоне pH от 1 до 13.",
    },
    supervisionNotice: {
      en: "Suitable for student lab execution with teacher supervision when handling dilute hydrochloric acid and sodium hydroxide.",
      ky: "Суюлтулган туз кислотасы жана щелочь менен иштөөдө мугалимдин көзөмөлү астында аткарылуучу окуучулардын лабораториялык иши.",
      ru: "Лабораторная работа учащихся под наблюдением учителя при обращении с разбавленными растворами кислот и щелочей.",
    },
    safetyOverview: {
      en: "Wear chemical splash goggles and disposable gloves. Hydrochloric acid (0.1 M HCl) and sodium hydroxide (0.1 M NaOH) are irritants.",
      ky: "Коргоочу көз айнек жана кол кап кийиңиз. Туз кислотасы (0.1 M HCl) жана натрий гидроксиди (0.1 M NaOH) терини жана көздү дүүлүктүрөт.",
      ru: "Используйте защитные очки и перчатки. 0,1 М растворы соляной кислоты и гидроксида натрия вызывают раздражение кожи и слизистых.",
    },
    steps: [
      {
        stepNumber: 1,
        title: {
          en: "Step 1 — Prepare the Stock Anthocyanin Extract",
          ky: "1-кадам — Антоцианиндин негизги экстрактын даярдоо",
          ru: "Шаг 1 — Приготовление исходного экстракта антоцианов",
        },
        description: {
          en: "Chop 50 g of fresh red cabbage leaves into small shreds. Transfer into a 250 mL beaker, add 100 mL of warm distilled water (~60 °C), and allow to steep for 10 minutes until a rich violet solution forms. Filter the mixture into an Erlenmeyer flask.",
          ky: "50 г жаңы кызыл кочан жалбырагын майда туурап, 250 мл стаканга салыңыз. 100 мл жылуу дистилденген суу (~60 °C) куюп, 10 мүнөт кармаңыз. Кочкул сыя түстөгү эритмени воронка аркылуу колбага чыпкалап алыңыз.",
          ru: "Мелко нарежьте 50 г листьев краснокочанной капусты, поместите в стакан на 250 мл, залейте 100 мл тёплой дистиллированной воды (~60 °C) и настаивайте 10 минут. Отфильтруйте полученный фиолетовый экстракт через воронку.",
        },
        materialsUsed: {
          en: ["Fresh red cabbage leaves", "250 mL beaker", "Distilled water", "Filter paper & funnel"],
          ky: ["Жаңы кызыл кочан жалбырагы", "250 мл стакан", "Дистилденген суу", "Чыпка кагазы жана воронка"],
          ru: ["Листья краснокочанной капусты", "Стакан 250 мл", "Дистиллированная вода", "Фильтровальная бумага и воронка"],
        },
        observation: {
          en: "The filtered extract appears deep purple-violet at neutral pH (~7).",
          ky: "Чыпкаланган экстракт нейтралдуу чөйрөдө (pH ~7) кочкул сыя өңдө болот.",
          ru: "Отфильтрованный экстракт имеет насыщенный фиолетовый цвет при нейтральном pH (~7).",
        },
      },
      {
        stepNumber: 2,
        title: {
          en: "Step 2 — Set Up and Label the Test Tube Rack",
          ky: "2-кадам — Пробиркаларды штативге тизип, белгилөө",
          ru: "Шаг 2 — Подготовка и маркировка штатива с пробирками",
        },
        description: {
          en: "Place 6 clean, dry test tubes in a test tube rack. Label them clearly from 1 to 6 using a marker: Tube 1 (0.1 M HCl), Tube 2 (Vinegar / CH₃COOH), Tube 3 (Distilled Water), Tube 4 (Sodium Bicarbonate / NaHCO₃), Tube 5 (Dilute Washing Soda / Na₂CO₃), Tube 6 (0.1 M NaOH).",
          ky: "Штативге 6 таза пробирканы коюп, 1ден 6га чейин белгилеңиз: 1 — 0.1 М HCl, 2 — уксус (CH₃COOH), 3 — дистилденген суу, 4 — аш содасы (NaHCO₃), 5 — кир содасы (Na₂CO₃), 6 — 0.1 М NaOH.",
          ru: "Установите в штатив 6 чистых пробирок и пронумеруйте их: №1 — 0,1 М HCl, №2 — уксусная кислота (CH₃COOH), №3 — дистиллированная вода, №4 — гидрокарбонат натрия (NaHCO₃), №5 — карбонат натрия (Na₂CO₃), №6 — 0,1 М NaOH.",
        },
        materialsUsed: {
          en: ["6 borosilicate test tubes", "Test tube rack", "Marker pen"],
          ky: ["6 лабораториялык пробирка", "Пробиркалар штативи", "Маркер"],
          ru: ["6 пробирок", "Штатив для пробирок", "Маркер"],
        },
      },
      {
        stepNumber: 3,
        title: {
          en: "Step 3 — Dispense Reagents and Add Anthocyanin Indicator",
          ky: "3-кадам — Реактивдерди куюп, индикаторду кошуу",
          ru: "Шаг 3 — Внесение реактивов и добавление индикатора",
        },
        description: {
          en: "Pipette 5 mL of the corresponding test solution into each numbered tube. Using a clean dropper pipette, add exactly 2 mL of cabbage indicator into Tube 1 through Tube 6. Gently shake each tube sideways to ensure thorough mixing.",
          ky: "Ар бир пробиркага 5 мл тийиштүү эритмени куюңуз. Таза пипетка менен ар бир пробиркага так 2 мл кызыл кочан индикаторунан кошуп, акырын чайкап аралаштырыңыз.",
          ru: "Пипеткой внесите по 5 мл соответствующих растворов в пробирки №1–6. С помощью капельницы добавьте в каждую пробирку точно по 2 мл экстракта капусты и аккуратно перемешайте.",
        },
        materialsUsed: {
          en: ["Graduated dropper pipettes", "0.1 M HCl", "Vinegar", "Distilled H₂O", "NaHCO₃", "Na₂CO₃", "0.1 M NaOH"],
          ky: ["Өлчөөчү пипеткалар", "0.1 M HCl", "Уксус", "Дистилденген H₂O", "NaHCO₃", "Na₂CO₃", "0.1 M NaOH"],
          ru: ["Мерные пипетки", "0,1 М HCl", "Уксус", "Дистиллированная H₂O", "NaHCO₃", "Na₂CO₃", "0,1 М NaOH"],
        },
        safetyNote: {
          en: "Add acids and bases dropwise to avoid splashing. Rinse skin immediately with tap water if contact occurs.",
          ky: "Чачырап кетпеши үчүн кислота менен щелочту тамчылатып куюңуз. Териге тийсе, дароо суу менен жууңуз.",
          ru: "Добавляйте кислоты и щёлочи по каплям во избежание брызг. При попадании на кожу промойте водой.",
        },
      },
      {
        stepNumber: 4,
        title: {
          en: "Step 4 — Observe Macro Color Shifts and Compare the Rainbow Spectrum",
          ky: "4-кадам — Өңдүн өзгөрүшүн жана спектрди байкоо",
          ru: "Шаг 4 — Фиксация изменений окраски и шкалы спектра",
        },
        description: {
          en: "Hold a white card behind the test tube rack under bright lighting. Observe the vibrant color gradient: Tube 1 shifts to brilliant ruby red (pH ~1), Tube 2 turns rose-pink (pH ~3), Tube 3 remains violet (pH ~7), Tube 4 turns royal blue (pH ~8.5), Tube 5 turns teal-green (pH ~10), and Tube 6 shifts to yellow-green / amber (pH ~13).",
          ky: "Штативдин артына ак кагаз коюп, жарыкта байкаңыз: 1-пробирка ачык кызыл (pH ~1), 2-пробирка кызгылт (pH ~3), 3-пробирка сыя (pH ~7), 4-пробирка ачык көк (pH ~8.5), 5-пробирка зумруд жашыл (pH ~10), 6-пробирка сары-жашыл (pH ~13) өңгө өтөт.",
          ru: "Поместите за штативом белый лист бумаги и оцените цветовую гамму: пробирка №1 — ярко-красная (pH ~1), №2 — розовая (pH ~3), №3 — фиолетовая (pH ~7), №4 — синяя (pH ~8.5), №5 — изумрудно-зелёная (pH ~10), №6 — жёлто-зелёная (pH ~13).",
        },
        observation: {
          en: "Anthocyanins demonstrate multi-step protonation/deprotonation, transitioning continuously across red, violet, blue, and green.",
          ky: "Антоцианиндер протондорду кошуу жана ажыратуу аркылуу кызылдан сыя, көк жана жашыл түскө удаалаш өтөт.",
          ru: "Антоцианы последовательно меняют число связанных протонов H⁺, что приводит к плавной перестройке спектра поглощения.",
        },
      },
      {
        stepNumber: 5,
        title: {
          en: "Step 5 — Neutralize Reaction Mixtures and Clean Up",
          ky: "5-кадам — Эритмелерди нейтралдаштыруу жана жууп-тазалоо",
          ru: "Шаг 5 — Нейтрализация отходов и уборка рабочего места",
        },
        description: {
          en: "Carefully combine the acidic and basic contents into a neutralization beaker until the indicator returns to neutral violet (pH ~7). Dilute with tap water and dispose into laboratory sink drain. Wash test tubes with test-tube brushes and invert to air dry.",
          ky: "Иштетилген кислота жана щелочтуу эритмелерди бир стаканга чогултуп, индикатор сыя өңгө (pH ~7) келгиче аралаштырыңыз. Көп суу менен раковинага агызып, пробиркаларды таза жууп кургатыңыз.",
          ru: "Слейте растворы в общий стакан для нейтрализации до фиолетового цвета (pH ~7). Смойте большим количеством воды в канализацию, вымойте пробирки ёршиком и просушите в штативе.",
        },
        materialsUsed: {
          en: ["Neutralization beaker", "Test tube brush", "Tap water"],
          ky: ["Нейтралдаштыруу стаканы", "Пробирка щеткасы", "Агын суу"],
          ru: ["Стакан для нейтрализации", "Ёршик для пробирок", "Водопроводная вода"],
        },
      },
    ],
  },

  "catalytic-decomposition-hydrogen-peroxide": {
    experimentId: "exp-02",
    slug: "catalytic-decomposition-hydrogen-peroxide",
    reviewStatus: "under_review",
    teacherSupervised: true,
    introduction: {
      en: "This demonstration explores reaction kinetics and catalyst mechanism. You will observe how potassium iodide (I⁻ ions) accelerates the decomposition of hydrogen peroxide into water and trapped oxygen gas foam.",
      ky: "Бул көрсөтмө тажрыйбада химиялык кинетика жана катализаторлордун таасири изилденет. Калий иодидинин (I⁻) таасиринде суутек пероксидинин ажыроосу тездеп, кычкылтек көбүгү атылып чыгат.",
      ru: "Демонстрационный опыт по кинетике реакций и механизму катализа. Иодид-ионы катализируют быстрое разложение перекиси водорода с образованием обильной кислородной пены («слоновья паста»).",
    },
    supervisionNotice: {
      en: "Teacher-supervised demonstration only. Rapid exothermic evolution of hot steam and oxygen gas requires safety containment and eye protection.",
      ky: "Мугалимдин көзөмөлү менен гана өткөрүлүүчү көрсөтмө тажрыйба. Ысык буу жана кычкылтек тез бөлүнүп чыккандыктан коргоочу табак талап кылынат.",
      ru: "Проводится исключительно учителем. Экзотермическое выделение горячего кислорода и пара требует обязательного защитного поддона и очков.",
    },
    safetyOverview: {
      en: "Wear laboratory safety goggles, heat-resistant apron, and nitrile gloves. The generated foam is hot due to strongly exothermic enthalpy (ΔH = -196 kJ/mol).",
      ky: "Коргоочу көз айнек, халат жана кол кап кийиңиз. Бөлүнгөн көбүк экзотермиялык жылуулуктан (ΔH = -196 кДж/моль) улам абдан ысык болот.",
      ru: "Обязательны защитные очки, халат и перчатки. Образующаяся пена горячая из-за высокого теплового эффекта реакции (ΔH = -196 кДж/моль).",
    },
    steps: [
      {
        stepNumber: 1,
        title: {
          en: "Step 1 — Prepare Containment Tray and Measuring Cylinder",
          ky: "1-кадам — Коргоочу табакты жана өлчөөчү цилиндрди даярдоо",
          ru: "Шаг 1 — Установка мерного цилиндра в защитный поддон",
        },
        description: {
          en: "Place a 500 mL or 1000 mL glass graduated cylinder in the center of a wide plastic containment tray. Verify that no combustible objects are within a 1-meter radius.",
          ky: "500 мл же 1000 мл өлчөөчү айнек цилиндрди пластик табактын ортосуна орнотуңуз. 1 метр радиуста күйүүчү буюмдар жок экендигин текшериңиз.",
          ru: "Поместите стеклянный цилиндр на 500 или 1000 мл в центр широкого пластикового поддона. Убедитесь в отсутствии горючих предметов в радиусе 1 метра.",
        },
        materialsUsed: {
          en: ["1000 mL graduated cylinder", "Plastic spill containment tray"],
          ky: ["1000 мл өлчөөчү цилиндр", "Пластик табак"],
          ru: ["Мерный цилиндр на 1000 мл", "Пластиковый поддон"],
        },
      },
      {
        stepNumber: 2,
        title: {
          en: "Step 2 — Dispense Hydrogen Peroxide, Detergent, and Dye",
          ky: "2-кадам — Пероксидди, суюк самынды жана боёкту куюу",
          ru: "Шаг 2 — Внесение перекиси водорода, моющего средства и красителя",
        },
        description: {
          en: "Carefully pour 80 mL of 6%–10% hydrogen peroxide (H₂O₂) into the cylinder. Add 15 mL of liquid dish soap and 4–5 drops of liquid food coloring. Swirl gently to combine the liquids without forming premature froth.",
          ky: "Цилиндрге 80 мл 6%–10% суутек пероксидин (H₂O₂) этият куюңуз. 15 мл суюк самын жана 4–5 тамчы боёк кошуп, көбүртпөй акырын чайкаңыз.",
          ru: "Аккуратно налейте в цилиндр 80 мл 6–10% перекиси водорода (H₂O₂). Добавьте 15 мл жидкого мыла и 4–5 капель красителя, осторожно перемешайте.",
        },
        materialsUsed: {
          en: ["80 mL 6%–10% H₂O₂", "Liquid dish detergent", "Food coloring"],
          ky: ["80 мл 6%–10% H₂O₂", "Суюк самын", "Тамак-аш боёгу"],
          ru: ["80 мл 6–10% H₂O₂", "Жидкое моющее средство", "Пищевой краситель"],
        },
        safetyNote: {
          en: "Avoid skin contact with hydrogen peroxide. If contact occurs, rinse immediately with cold water.",
          ky: "Суутек пероксиди териге тийсе, агарып дүүлүктүрөт; дароо муздак суу менен жууңуз.",
          ru: "Избегайте попадания перекиси водорода на кожу. При попадании немедленно промойте водой.",
        },
      },
      {
        stepNumber: 3,
        title: {
          en: "Step 3 — Dissolve the Catalyst (Potassium Iodide Solution)",
          ky: "3-кадам — Катализаторду (калий иодиди эритмеси) даярдоо",
          ru: "Шаг 3 — Приготовление раствора катализатора (иодида калия)",
        },
        description: {
          en: "In a separate 100 mL beaker, dissolve 10 g of potassium iodide (KI) in 25 mL of warm water. Stir with a glass rod until clear.",
          ky: "Өзүнчө 100 мл стаканда 10 г калий иодидин (KI) 25 мл жылуу сууда айнек таякча менен толук эригенче аралаштырыңыз.",
          ru: "В отдельном стакане на 100 мл растворите 10 г иодида калия (KI) в 25 мл тёплой воды до прозрачности.",
        },
        materialsUsed: {
          en: ["10 g Potassium iodide (KI)", "100 mL beaker", "Glass stirring rod"],
          ky: ["10 г калий иодиди (KI)", "100 мл стакан", "Айнек таякча"],
          ru: ["10 г иодида калия (KI)", "Стакан на 100 мл", "Стеклянная палочка"],
        },
      },
      {
        stepNumber: 4,
        title: {
          en: "Step 4 — Add Catalyst and Step Back",
          ky: "4-кадам — Катализаторду куюп, коопсуз аралыкка чыгуу",
          ru: "Шаг 4 — Добавление катализатора и отход на безопасное расстояние",
        },
        description: {
          en: "Rapidly pour the KI catalyst solution into the graduated cylinder in one smooth motion and step back 1.5 meters immediately. The reaction begins instantaneously with rapid bubbling and steam generation.",
          ky: "Даярдалган калий иодидинин эритмесин цилиндрге тез куюп, дароо 1.5 метр артка чегиниңиз. Реакция көз ирмемде башталып, көбүк жана буу бөлүнөт.",
          ru: "Быстро одним движением влейте раствор KI в цилиндр и отойдите на 1,5 метра. Реакция начинается мгновенно с выделением пара и пены.",
        },
        observation: {
          en: "Within seconds, an energetic plume of thick, warm oxygen-filled foam shoots out of the cylinder neck, overflowing into the containment tray.",
          ky: "Бир нече секунданын ичинде кычкылтекке бай калың, ысык көбүк цилиндрдин оозунан атылып чыгып, табакка толот.",
          ru: "За считанные секунды густая горячая пена, наполненная кислородом, поднимается столбом и заполняет поддон.",
        },
        safetyNote: {
          en: "Do not lean over the cylinder during addition. Steam and droplet ejection may occur.",
          ky: "Цилиндрдин үстүнө эңкейбеңиз. Ысык буу жана көбүк чачырашы мүмкүн.",
          ru: "Не наклоняйтесь над цилиндром в момент добавления катализатора из-за выброса горячего пара.",
        },
      },
      {
        stepNumber: 5,
        title: {
          en: "Step 5 — Verify Oxygen with a Glowing Splint",
          ky: "5-кадам — Чоктонгон чырпык менен кычкылтекти аныктоо",
          ru: "Шаг 5 — Доказательство наличия кислорода тлеющей лучиной",
        },
        description: {
          en: "Ignite a wooden splint and blow it out so that a red glowing ember remains. Gently bring the glowing tip into contact with the rising foam bubbles. The glowing ember immediately flares into an active open flame.",
          ky: "Жыгач чырпыкты күйгүзүп, жалынын үйлөп чок бойдон калтырыңыз. Чокту көбүктүн бетине жакындатканда, ал кычкылтектин таасиринен кайра жалындап күйөт.",
          ru: "Зажгите деревянную лучину и задуйте пламя, оставив тлеющий кончик. Поднесите лучину к пене: она мгновенно ярко вспыхнет, подтверждая выделение чистого O₂.",
        },
        materialsUsed: {
          en: ["Wooden splint", "Matches / lighter", "Crucible tongs"],
          ky: ["Жыгач чырпык", "Ширенке", "Кычкач"],
          ru: ["Деревянная лучина", "Спички", "Тигельные щипцы"],
        },
      },
    ],
  },

  "electrolysis-of-water-hoffman": {
    experimentId: "exp-03",
    slug: "electrolysis-of-water-hoffman",
    reviewStatus: "under_review",
    teacherSupervised: false,
    introduction: {
      en: "In this quantitative electrochemistry laboratory, you will split water molecules into hydrogen and oxygen gases using direct electric current, directly verifying Avogadro's hypothesis and the 2:1 stoichiometry of H₂O.",
      ky: "Бул электрохимиялык лабораториялык иште туруктуу ток менен суу молекулаларын суутек жана кычкылтек газдарына ажыратып, H₂O формуласындагы 2:1 катышын далилдейсиз.",
      ru: "В данной работе по электрохимии вы разложите воду постоянным током на водород и кислород, экспериментально доказав соотношение объёмов газов 2:1 согласно формуле H₂O.",
    },
    supervisionNotice: {
      en: "Student lab with low-voltage direct current (12 V DC power pack). Standard eye protection required.",
      ky: "Төмөнкү чыңалуудагы (12 В) туруктуу ток колдонулуучу окуучулардын лабораториялык иши. Коргоочу көз айнек талап кылынат.",
      ru: "Лабораторная работа учащихся с безопасным источником постоянного тока 12 В.",
    },
    safetyOverview: {
      en: "Hydrogen gas (H₂) generated at the cathode is flammable; keep open flames away except during the controlled acoustic test. Do not exceed 15 V DC.",
      ky: "Катоддо бөлүнгөн суутек газы (H₂) тез күйөт; текшерүүдөн башка учурда ачык жалынды жакындатпаңыз. Ток чыңалуусун 15 В ашырбаңыз.",
      ru: "Водород горюч; открытый огонь допускается только для контролируемой пробы на вспышку. Напряжение не более 15 В.",
    },
    steps: [
      {
        stepNumber: 1,
        title: {
          en: "Step 1 — Prepare the Inert Sulfate Electrolyte",
          ky: "1-кадам — Сульфаттык электролит эритмесин даярдоо",
          ru: "Шаг 1 — Приготовление раствора индифферентного электролита",
        },
        description: {
          en: "Dissolve 14 g of sodium sulfate (Na₂SO₄) in 500 mL of distilled water. Pure water has negligible conductivity; sodium and sulfate ions provide mobile charge carriers without undergoing redox discharge at the electrodes.",
          ky: "500 мл дистилденген сууда 14 г натрий сульфатын (Na₂SO₄) эритиңиз. Таза суу токту өткөрбөйт, ал эми натрий сульфатынын иондору электроддо ажырабастан токту жакшы өткөрөт.",
          ru: "Растворите 14 г сульфата натрия (Na₂SO₄) в 500 мл дистиллированной воды. Чистая вода плохо проводит ток; ионы Na⁺ и SO₄²⁻ служат переносчиками заряда, не разряжаясь на электродах.",
        },
        materialsUsed: {
          en: ["14 g Na₂SO₄", "500 mL volumetric flask", "Distilled water"],
          ky: ["14 г Na₂SO₄", "500 мл колба", "Дистилденген суу"],
          ru: ["14 г Na₂SO₄", "Колба на 500 мл", "Дистиллированная вода"],
        },
      },
      {
        stepNumber: 2,
        title: {
          en: "Step 2 — Fill the Hoffman Apparatus Without Trapped Air",
          ky: "2-кадам — Гофман аппаратын аба калтырбай толтуруу",
          ru: "Шаг 2 — Заполнение аппарата Гофмана без воздушных пузырей",
        },
        description: {
          en: "Open both stopcocks at the top of the graduated columns. Slowly pour the electrolyte into the central reservoir funnel until liquid reaches the top edge of both stopcocks. Close both stopcocks tightly so no air bubble remains above the zero mark.",
          ky: "Аппараттын эки жагындагы крандарды ачыңыз. Электролитти ортоңку воронкага суюктук крандарга жеткенче куюңуз. Крандарды бекитип, жогору жакта аба калбаганын текшериңиз.",
          ru: "Откройте оба крана на градуированных трубках. Наливайте раствор через среднюю воронку до вытеснения воздуха. Плотно закройте краны при нулевом уровне жидкости.",
        },
        materialsUsed: {
          en: ["Hoffman electrolysis apparatus with platinum/graphite electrodes"],
          ky: ["Платина же графит электроддуу Гофман аппараты"],
          ru: ["Аппарат Гофмана с платиновыми или графитовыми электродами"],
        },
      },
      {
        stepNumber: 3,
        title: {
          en: "Step 3 — Connect DC Power Supply and Start Electrolysis",
          ky: "3-кадам — Туруктуу токту туташтыруу жана процессти баштоо",
          ru: "Шаг 3 — Подключение источника постоянного тока",
        },
        description: {
          en: "Connect the negative terminal (black lead, cathode) to the left electrode and the positive terminal (red lead, anode) to the right electrode. Adjust the DC power supply to 12 V and switch on. Start a stopwatch.",
          ky: "Кара өткөргүчтү (терс уюл, катод) сол электродго, кызыл өткөргүчтү (оң уюл, анод) оң электродго туташтырыңыз. 12 В чыңалуу берип, секундомерди басыңыз.",
          ru: "Подключите отрицательный провод (катод) к левому электроду, а положительный (анод) — к правому. Установите 12 В и включите секундомер.",
        },
        materialsUsed: {
          en: ["12 V DC regulated power supply", "Banana-to-alligator test leads"],
          ky: ["12 В туруктуу ток булагы", "Кычкачтуу өткөргүч зымдар"],
          ru: ["Регулируемый блок питания 12 В", "Соединительные провода"],
        },
        observation: {
          en: "Tiny streams of bubbles begin rising immediately from both electrodes. The negative cathode column bubbles at approximately twice the volume rate of the positive anode column.",
          ky: "Эки электроддон тең көбүкчөлөр чыга баштайт. Терс катоддо газдын бөлүнүшү оң анодго караганда эки эсе тез жүрөт.",
          ru: "На обоих электродах начинается бурное выделение пузырьков. На катоде объём газа прибывает в два раза быстрее, чем на аноде.",
        },
      },
      {
        stepNumber: 4,
        title: {
          en: "Step 4 — Record Gas Volumes and Calculate Stoichiometric Ratio",
          ky: "4-кадам — Газдын көлөмүн жазып, катышын эсептөө",
          ru: "Шаг 4 — Фиксация объёмов газов и проверка стехиометрии",
        },
        description: {
          en: "After 10 minutes of continuous electrolysis, read the bottom of the meniscus in both graduated tubes. Record the exact volume of hydrogen gas (V_cathode ~ 20.0 mL) and oxygen gas (V_anode ~ 10.0 mL). Calculate the ratio V(H₂) / V(O₂).",
          ky: "10 мүнөттөн кийин шкаладан деңгээлди караңыз. Катоддогу суутектин (V ~ 20 мл) жана аноддогу кычкылтектин (V ~ 10 мл) көлөмүн жазып, V(H₂) / V(O₂) катышын эсептеңиз.",
          ru: "Через 10 минут снимите показания по нижнему краю мениска: объём водорода на катоде (~20,0 мл) и кислорода на аноде (~10,0 мл). Вычислите соотношение V(H₂) / V(O₂).",
        },
        observation: {
          en: "The experimental volume ratio closely equals 2.0 : 1.0, directly validating 2H₂O → 2H₂ + O₂.",
          ky: "Алынган көлөмдөрдүн катышы 2:1 түзүп, 2H₂O → 2H₂ + O₂ теңдемесин толук ырастайт.",
          ru: "Экспериментальное отношение объёмов составляет 2,0 : 1,0 в точном согласии с уравнением 2H₂O → 2H₂ + O₂.",
        },
      },
      {
        stepNumber: 5,
        title: {
          en: "Step 5 — Gas Confirmation Tests (Pop Test & Glowing Splint)",
          ky: "5-кадам — Газдарды текшерүү (пахтаган үн жана чоктун тутанышы)",
          ru: "Шаг 5 — Идентификация газов пробой на слух и тлеющей лучиной",
        },
        description: {
          en: "Open the cathode stopcock slightly to release hydrogen into an inverted small test tube. Bring a lit splint to the tube mouth to produce a distinctive acoustic 'squeaky pop'. Next, open the anode stopcock toward a glowing wooden splint to observe immediate rekindling into open flame.",
          ky: "Катоддун кранын ачып, суутекти кичинекей пробиркага чогултуңуз. Күйүп турган чырпыкты жакындатканда мүнөздүү пахтаган үн чыгат. Аноддон чыккан кычкылтекке чокту жакындатканда жалын кайра тутанат.",
          ru: "Откройте кран катода и соберите водород в перевёрнутую пробирку. Поднесите горящую спичку: раздастся характерный хлопок («pop test»). Из крана анода направьте струю кислорода на тлеющую лучину — она вспыхнет ярким пламенем.",
        },
        materialsUsed: {
          en: ["Wooden splints", "Matches", "Small collection test tube"],
          ky: ["Жыгач чырпыктар", "Ширенке", "Чакан пробирка"],
          ru: ["Деревянные лучины", "Спички", "Малая пробирка"],
        },
      },
    ],
  },

  "displacement-copper-silver-tree": {
    experimentId: "exp-04",
    slug: "displacement-copper-silver-tree",
    reviewStatus: "under_review",
    teacherSupervised: false,
    introduction: {
      en: "This redox displacement experiment illustrates the electrochemical activity series of metals. Metallic copper reduces silver ions (Ag⁺) to grow branching, dendritic silver needles while releasing pale blue hydrated Cu²⁺ ions.",
      ky: "Бул кычкылдануу-калыбына келүү тажрыйбасында металлдардын активдүүлүк катары көрсөтүлөт. Жез күмүш иондорун (Ag⁺) калыбына келтирип, ийне сымал жалтырак күмүш дарагын өстүрөт.",
      ru: "Опыт наглядно иллюстрирует электрохимический ряд напряжений металлов: металлическая медь вытесняет серебро из раствора его соли, образуя дендритные кристаллы («серебряное дерево»).",
    },
    safetyOverview: {
      en: "Silver nitrate (0.1 M AgNO₃) stains skin and fabrics dark brown when exposed to light. Wear gloves and handle with care.",
      ky: "Күмүш нитраты (0.1 M AgNO₃) териге жана кийимге тийсе кара так калтырат. Кол кап кийип иштеңиз.",
      ru: "Нитрат серебра (AgNO₃) оставляет на коже несмываемые тёмные пятна. Работайте строго в перчатках.",
    },
    steps: [
      {
        stepNumber: 1,
        title: {
          en: "Step 1 — Shape and Clean the Copper Framework",
          ky: "1-кадам — Жез зымдан дарактын түзүлүшүн жасап тазалоо",
          ru: "Шаг 1 — Формование и зачистка медного каркаса",
        },
        description: {
          en: "Take a 20 cm strand of bare copper wire (gauge 18–20). Twist the base into a stable spiral and spread branching limbs upward to mimic a miniature tree. Rub the surface lightly with sandpaper to remove dull oxide and reveal shiny salmon-pink copper.",
          ky: "20 см жез зымдын түбүн туруктуу кылып бурап, жогору жагын дарак сымал бутактатыңыз. Бетиндеги кычкыл катмарын кум кагаз менен сүрүп, жалтыратып тазалаңыз.",
          ru: "Скрутите отрезок медной проволоки длиной 20 см в виде деревца со спиральным основанием. Зачистите поверхность наждачной бумагой до блеска.",
        },
        materialsUsed: {
          en: ["Bare copper wire (18–20 AWG)", "Fine emery sandpaper"],
          ky: ["Жез зым", "Майда кум кагаз"],
          ru: ["Медная проволока", "Мелкозернистая наждачная бумага"],
        },
      },
      {
        stepNumber: 2,
        title: {
          en: "Step 2 — Pour Silver Nitrate Solution into Beaker",
          ky: "2-кадам — Стаканга күмүш нитратынын эритмесин куюу",
          ru: "Шаг 2 — Заполнение стакана раствором нитрата серебра",
        },
        description: {
          en: "Pour 60 mL of 0.1 M silver nitrate (AgNO₃) into a tall 100 mL beaker or petri dish positioned on a flat, vibration-free surface.",
          ky: "100 мл стаканга 60 мл 0.1 М күмүш нитратынын (AgNO₃) тунук эритмесин кыймылсыз түз жерге коюп куюңуз.",
          ru: "Налейте 60 мл 0,1 М раствора нитрата серебра (AgNO₃) в чистый стакан на 100 мл, установленный на ровную поверхность.",
        },
        materialsUsed: {
          en: ["60 mL 0.1 M Silver nitrate (AgNO₃)", "100 mL glass beaker"],
          ky: ["60 мл 0.1 M күмүш нитраты", "100 мл стакан"],
          ru: ["60 мл 0,1 М нитрата серебра", "Стакан на 100 мл"],
        },
      },
      {
        stepNumber: 3,
        title: {
          en: "Step 3 — Submerge the Copper Tree and Observe Crystal Nucleation",
          ky: "3-кадам — Жез даракты салуу жана кристаллдардын өсүшүн байкоо",
          ru: "Шаг 3 — Погружение каркаса и наблюдение роста кристаллов",
        },
        description: {
          en: "Carefully lower the copper tree into the solution. Within 30–60 seconds, notice tiny shimmering crystalline whiskers nucleating along every wire facet. Leave completely undisturbed for 20 minutes.",
          ky: "Жез даракты эритмеге этият салыңыз. 30–60 секунддан кийин зымдын бетинде жылтыраган күмүш ийнелери пайда боло баштайт. Идишти 20 мүнөт козгобой коюңуз.",
          ru: "Аккуратно опустите медное деревце в раствор. Через 30–60 секунд проволока покроется мерцающими игольчатыми кристаллами. Оставьте в покое на 20 минут.",
        },
        observation: {
          en: "Bright metallic silver needles grow rapidly outward into delicate, branching fern-like fronds.",
          ky: "Жалтырак күмүш кристаллдары бутакташып, кооз кар бүртүкчөлөрү сымал өсөт.",
          ru: "Происходит интенсивный рост дендритных кристаллов чистого серебра в виде пушистых хвойных веточек.",
        },
      },
      {
        stepNumber: 4,
        title: {
          en: "Step 4 — Track Solution Color Transition (Cu²⁺ Ion Release)",
          ky: "4-кадам — Эритменин өңүнүн көгүш түскө өтүшүн каттоо",
          ru: "Шаг 4 — Наблюдение появления голубой окраски ионов Cu²⁺",
        },
        description: {
          en: "Examine the liquid against a white backdrop. As copper atoms lose 2 electrons (Cu → Cu²⁺ + 2e⁻), the originally water-clear liquid turns increasingly sky-blue due to hydrated [Cu(H₂O)₆]²⁺ complex ions.",
          ky: "Эритмени ак фондо караңыз. Жез атомдору эки электрон берип (Cu → Cu²⁺ + 2e⁻) эригендиктен, түссүз суюктук бара-бара ачык көгүш тартат.",
          ru: "Обратите внимание на жидкость: по мере растворения меди (Cu → Cu²⁺ + 2e⁻) прозрачный раствор приобретает отчётливый небесно-голубой оттенок гидратированных ионов меди.",
        },
        observation: {
          en: "Colorless solution becomes noticeably blue as mass is transferred from solid copper into aqueous copper ions.",
          ky: "Түссүз эритме жез иондорунун сууга өтүшү менен даана көк түскө өтөт.",
          ru: "Раствор становится голубым, подтверждая окисление нейтральной меди в ионную форму Cu²⁺.",
        },
      },
      {
        stepNumber: 5,
        title: {
          en: "Step 5 — Recover Crystals and Safely Neutralize",
          ky: "5-кадам — Кристаллдарды бөлүп алуу жана калдыкты тазалоо",
          ru: "Шаг 5 — Извлечение кристаллов и утилизация раствора",
        },
        description: {
          en: "Lift the silver tree gently and rinse with distilled water over a filter paper to dry. Store the precious silver crystals in a specimen vial. Precipitate residual silver ions from waste solution with excess NaCl before disposal.",
          ky: "Күмүш даракты этият чыгарып, чыпка кагаздын үстүндө дистилденген суу менен чайкап кургатыңыз. Калган эритмеге аш тузун (NaCl) кошуп, күмүштү толук чөктүрүп анан төгүңүз.",
          ru: "Осторожно извлеките каркас и ополосните дистиллированной водой над фильтром. В оставшийся раствор добавьте избыток поваренной соли для полного осаждения AgCl.",
        },
        materialsUsed: {
          en: ["Filter paper", "Specimen vial", "Saturated NaCl solution"],
          ky: ["Чыпка кагазы", "Үлгү кутучасы", "Каныккан NaCl эритмеси"],
          ru: ["Фильтровальная бумага", "Бюкс для образцов", "Насыщенный раствор NaCl"],
        },
      },
    ],
  },

  "sodium-acetate-hot-ice": {
    experimentId: "exp-05",
    slug: "sodium-acetate-hot-ice",
    reviewStatus: "under_review",
    teacherSupervised: false,
    introduction: {
      en: "This demonstration explores metastable phase equilibrium and latent heat of fusion. You will prepare a supercooled supersaturated solution of sodium acetate and trigger instantaneous crystallization into warm 'hot ice' stalagmites.",
      ky: "Бул тажрыйбада фазалык тең салмактуулук жана кристаллдашуу жылуулугу изилденет. Ашыкча каныккан натрий ацетаты эритмеси көз ирмемде ысык музга айланып, жылуулук бөлүп чыгарат.",
      ru: "Опыт демонстрирует метастабильное фазовое равновесие: переохлаждённый пересыщенный раствор ацетата натрия мгновенно кристаллизуется при контакте с затравкой с выделением скрытой теплоты («горячий лёд»).",
    },
    safetyOverview: {
      en: "Use heat-resistant borosilicate glassware and heat pads when handling hot solutions. Sodium acetate is non-toxic (food additive E262).",
      ky: "Ысык эритмелер менен иштөөдө сак болуңуз. Натрий ацетаты уулуу эмес (тамак-аш кошулмасы E262).",
      ru: "Используйте термостойкую посуду и прихватки при нагревании. Ацетат натрия нетоксичен.",
    },
    steps: [
      {
        stepNumber: 1,
        title: {
          en: "Step 1 — Dissolve Sodium Acetate Trihydrate at Elevated Temperature",
          ky: "1-кадам — Натрий ацетатын жогорку температурада эритүү",
          ru: "Шаг 1 — Растворение тригидрата ацетата натрия при нагревании",
        },
        description: {
          en: "Weigh 160 g of sodium acetate trihydrate (CH₃COONa·3H₂O) into a 250 mL Erlenmeyer flask. Add just 30 mL of distilled water. Heat gently on a hot plate while swirling until all crystals dissolve completely into a crystal-clear liquid (~80 °C).",
          ky: "250 мл колбага 160 г натрий ацетаты тригидратын салып, болгону 30 мл дистилденген суу куюңуз. Плиткада акырын ысытып, бардык кристаллдар толук эрип тунук суюктук болгончо аралаштырыңыз.",
          ru: "Поместите 160 г тригидрата ацетата натрия в колбу на 250 мл и добавьте всего 30 мл дистиллированной воды. Нагревайте на плитке до полного растворения кристаллов (~80 °C).",
        },
        materialsUsed: {
          en: ["160 g Sodium acetate trihydrate", "30 mL Distilled water", "Hot plate", "250 mL flask"],
          ky: ["160 г натрий ацетаты", "30 мл дистилденген суу", "Ысытуучу плитка", "250 мл колба"],
          ru: ["160 г ацетата натрия", "30 мл дистиллированной воды", "Электроплитка", "Колба 250 мл"],
        },
      },
      {
        stepNumber: 2,
        title: {
          en: "Step 2 — Cool the Solution Undisturbed to Room Temperature",
          ky: "2-кадам — Эритмени козгобой бөлмө температурасына чейин муздатуу",
          ru: "Шаг 2 — Охлаждение раствора в состоянии полного покоя",
        },
        description: {
          en: "Rinse the neck of the flask with a few drops of water to dissolve any stray crystal seeds on the glass. Cover the mouth with a watch glass or foil and place in an ice-water bath or quiet benchtop. Allow to cool undisturbed to room temperature (20 °C).",
          ky: "Колбанын моюнчасында калган майда кристаллдарды жууп салыңыз. Оозун айнек же фольга менен жаап, кыймылдатпай бөлмө температурасына чейин муздатыңыз.",
          ru: "Смойте капли со стенок горлышка. Накройте часовым стеклом и оставьте в абсолютном покое до остывания до 20 °C.",
        },
        observation: {
          en: "The liquid remains completely clear despite being heavily supersaturated and thermodynamically unstable.",
          ky: "Эритме ашыкча каныккан болсо да, чайкабаса тунук суюк бойдон сакталат.",
          ru: "Раствор остаётся прозрачным, находясь в метастабильном переохлаждённом состоянии.",
        },
      },
      {
        stepNumber: 3,
        title: {
          en: "Step 3 — Place a Seed Crystal on the Target Surface",
          ky: "3-кадам — Саат айнегине урук кристаллды коюу",
          ru: "Шаг 3 — Размещение кристалла-затравки на подложке",
        },
        description: {
          en: "Place a flat watch glass or shallow dish on the counter. Set a single small dry granule of solid sodium acetate in the center to serve as a nucleation template.",
          ky: "Саат айнегинин же тарелканын ортосуна натрий ацетатынын бир кургак кристаллчасын (урук) коюңуз.",
          ru: "Положите на часовое стекло один сухой кристаллик ацетата натрия, который послужит центром кристаллизации.",
        },
        materialsUsed: {
          en: ["Watch glass or petri dish", "Seed crystal of CH₃COONa"],
          ky: ["Саат айнеги", "Натрий ацетатынын кристаллчасы"],
          ru: ["Часовое стекло", "Кристалл ацетата натрия"],
        },
      },
      {
        stepNumber: 4,
        title: {
          en: "Step 4 — Pour Liquid Steadily to Build 'Hot Ice' Stalagmite",
          ky: "4-кадам — Суюктукту акырын куюп «ысык муз» мунарасын куруу",
          ru: "Шаг 4 — Выливание раствора с ростом кристаллического сталагмита",
        },
        description: {
          en: "Slowly and steadily pour the supercooled liquid directly onto the seed crystal. The moment liquid touches the seed, instantaneous crystallization freezes the stream upward, forming a solid white stalagmite column.",
          ky: "Муздаган суюктукту уруктун үстүнө ичке агым менен акырын куюңуз. Тийген замат кристаллдашуу башталып, ак муз мунарасы өйдө карай өсөт.",
          ru: "Медленно тонкой струйкой лейте переохлаждённую жидкость на затравку. В точке контакта раствор мгновенно застывает, образуя белый столб «горячего льда».",
        },
        observation: {
          en: "Rapid dendritic freeze propagates continuously through the pouring stream, creating an architectural crystal tower.",
          ky: "Суюктук агып түшкөн жеринде көз ирмемде катып, катуу кристаллдык мунарага айланат.",
          ru: "Кристаллизация распространяется по струе, формируя растущую вверх пирамиду белых кристаллов.",
        },
      },
      {
        stepNumber: 5,
        title: {
          en: "Step 5 — Touch the Solid and Measure Exothermic Latent Heat",
          ky: "5-кадам — Кристаллды кармап жылуулукту сезүү жана кайра колдонуу",
          ru: "Шаг 5 — Оценка теплового эффекта и повторное использование",
        },
        description: {
          en: "Touch the side of the crystallized mass with your hand. It feels distinctly warm (~50 °C) as the latent heat of crystallization is liberated. The entire sample can be remelted and reused indefinitely.",
          ky: "Пайда болгон катуу кристаллды колуңуз менен кармап көрүңүз. Кристаллдашуу жылуулугу бөлүнүп чыккандыктан ал абдан жылуу (~50 °C) болот. Аны кайра эритип кайталап колдонсо болот.",
          ru: "Прикоснитесь к образовавшемуся «льду»: он ощутимо горячий (~50 °C) из-за выделения теплоты фазового перехода. Полученную массу можно расплавить и использовать многократно.",
        },
      },
    ],
  },

  "paper-chromatography-plant-pigments": {
    experimentId: "exp-06",
    slug: "paper-chromatography-plant-pigments",
    reviewStatus: "under_review",
    teacherSupervised: false,
    introduction: {
      en: "In this analytical separation experiment, you will separate spinach leaf pigments (chlorophyll a, chlorophyll b, xanthophylls, and carotenes) using ascending paper chromatography based on their differential polarity.",
      ky: "Бул аналитикалык лабораториялык иште кагаз хроматографиясы аркылуу шпинат жалбырагындагы пигменттерди (хлорофилл a, хлорофилл b, ксантофилл, каротин) полярдуулугуна жараша бөлөсүз.",
      ru: "В данной работе методом распределительной бумажной хроматографии вы разделите пигменты зелёных листьев на хлорофилл a, хлорофилл b, ксантофиллы и каротин.",
    },
    safetyOverview: {
      en: "Solvent mixtures (ethanol or acetone) are flammable. Keep away from flames and work in a well-ventilated area.",
      ky: "Спирт же ацетон аралашмасы тез тутанат. Ачык оттон алыс кармап, бөлмөнү желдетиңиз.",
      ru: "Растворители (спирт, ацетон) горючи и летучи. Работайте вдали от открытого огня в проветриваемом помещении.",
    },
    steps: [
      {
        stepNumber: 1,
        title: {
          en: "Step 1 — Extract Concentrated Leaf Pigment",
          ky: "1-кадам — Жалбырактын коюу пигментин даярдоо",
          ru: "Шаг 1 — Экстракция концентрированных пигментов листа",
        },
        description: {
          en: "Tear 10 g of fresh spinach leaves into a porcelain mortar. Add a pinch of clean sand (to rupture cell walls) and 5 mL of 95% ethanol or acetone. Grind vigorously with the pestle until a concentrated, dark green juice forms.",
          ky: "10 г жаңы шпинат жалбырагын фарфор ступкага салыңыз. Клетка кабыкчаларын эзүү үчүн бир аз таза кум жана 5 мл спирт же ацетон кошуп, кара-жашыл коюу шире чыкканча пестик менен эзиңиз.",
          ru: "Разотрите в фарфоровой ступке 10 г листьев шпината с щепоткой чистого песка и 5 мл спирта или ацетона до получения тёмно-зелёного сока.",
        },
        materialsUsed: {
          en: ["Fresh spinach", "Porcelain mortar & pestle", "95% Ethanol or acetone", "Quartz sand"],
          ky: ["Жаңы шпинат", "Фарфор ступка жана пестик", "Спирт же ацетон", "Кварц куму"],
          ru: ["Шпинат", "Фарфоровая ступка с пестиком", "Спирт или ацетон", "Кварцевый песок"],
        },
      },
      {
        stepNumber: 2,
        title: {
          en: "Step 2 — Prepare the Chromatography Strip and Baseline",
          ky: "2-кадам — Хроматография кагазын жана баштапкы сызыкты даярдоо",
          ru: "Шаг 2 — Разметка хроматографической полоски",
        },
        description: {
          en: "Cut a 15 cm x 2.5 cm strip of Whatman No. 1 chromatography paper. Handle by the edges only. Using a graphite pencil (never ink), draw a faint horizontal start line 2.0 cm from the bottom edge.",
          ky: "15 см х 2.5 см өлчөмүндөгү чыпка кагазын кесип, четинен гана кармаңыз. Карандаш менен (калем эмес) төмөнкү четинен 2 см өйдө түз горизонталдуу сызык сызыңыз.",
          ru: "Вырежьте полоску хроматографической бумаги 15х2,5 см. Простым карандашом проведите стартовую линию на расстоянии 2,0 см от нижнего края.",
        },
        materialsUsed: {
          en: ["Chromatography paper strip (Whatman No. 1)", "Graphite pencil & ruler"],
          ky: ["Хроматография кагазы", "Жөнөкөй карандаш жана сызгыч"],
          ru: ["Хроматографическая бумага", "Простой карандаш и линейка"],
        },
      },
      {
        stepNumber: 3,
        title: {
          en: "Step 3 — Spot the Extract on the Baseline",
          ky: "3-кадам — Баштапкы сызыкка пигментти тамчылатуу",
          ru: "Шаг 3 — Нанесение пробы экстракта на стартовую линию",
        },
        description: {
          en: "Dip a glass capillary tube or toothpick into the dark green extract. Touch the tip lightly to the center of the pencil line to produce a tiny spot (<2 mm). Allow to dry for 30 seconds, then repeat 8–10 times on the same spot to build concentrated pigment density.",
          ky: "Капиллярдык түтүкчөнү жашыл ширеге малып, карандаш сызыктын ортосуна кичинекей так (2 мм) түшүрүңүз. Кургатып, ошол эле тактын үстүнө 8–10 жолу кайталап тамызыңыз.",
          ru: "Тонким капилляром нанесите микрокаплю экстракта в центр стартовой линии. Дайте высохнуть и повторите 8–10 раз в одну точку для концентрирования пробы.",
        },
        observation: {
          en: "A dark olive-green spot forms without spreading excessively wide.",
          ky: "Сызыктын үстүндө таралбаган кара-жашыл коюу так пайда болот.",
          ru: "На линии образуется плотное точечное пятно тёмно-зелёного цвета.",
        },
      },
      {
        stepNumber: 4,
        title: {
          en: "Step 4 — Develop the Chromatogram in Developing Chamber",
          ky: "4-кадам — Хроматограмманы идиште өнүктүрүү",
          ru: "Шаг 4 — Проявление хроматограммы в камере",
        },
        description: {
          en: "Pour 1.0 cm of developing solvent (9:1 petroleum ether / acetone) into a glass jar. Suspend the paper strip vertically using a paper clip so the bottom touches solvent, but the green spot remains at least 5 mm ABOVE the liquid surface. Seal the jar lid.",
          ky: "Айнек банкага 1 см эриткич куюңуз. Кагазды асты суюктукка тийип, бирок жашыл так эриткичтин деңгээлинен 5 мм жогору тургандай кылып илиңиз. Банканын капкагын жабыңыз.",
          ru: "Налейте на дно банки 1 см элюента. Закрепите полоску так, чтобы нижний край погрузился в жидкость, а стартовая точка была на 5 мм выше уровня растворителя. Закройте крышку.",
        },
        safetyNote: {
          en: "Keep solvent vapors contained inside the capped jar.",
          ky: "Эриткич бууланып кетпеши үчүн капкакты бекем жабыңыз.",
          ru: "Держите камеру плотно закрытой во избежание испарения элюента.",
        },
      },
      {
        stepNumber: 5,
        title: {
          en: "Step 5 — Mark the Solvent Front and Identify Pigment Bands",
          ky: "5-кадам — Эриткичтин чегин белгилөө жана пигменттерди аныктоо",
          ru: "Шаг 5 — Фиксация фронта растворителя и расчёт Rf",
        },
        description: {
          en: "When the rising solvent front reaches 1 cm from the top, remove the strip immediately and mark the wet front with pencil. Identify the 4 distinct bands from bottom to top: yellow-green chlorophyll b (Rf ~0.28), blue-green chlorophyll a (Rf ~0.45), yellow xanthophyll (Rf ~0.71), and bright orange-yellow carotene at the very top (Rf ~0.95).",
          ky: "Эриткич жогорку чеке 1 см жеткенде кагазды чыгарып, нымдуу чекти карандаш менен белгилеңиз. Төмөндөн жогору карай 4 тилкени көрөсүз: сары-жашыл хлорофилл b, көгүш-жашыл хлорофилл a, сары ксантофилл жана эң жогорудагы кызгылт-сары каротин.",
          ru: "Когда растворитель дойдёт почти до верха, извлеките полоску и сразу отметьте фронт карандашом. Зафиксируйте 4 зоны: жёлто-зелёный хлорофилл b (Rf ~0,28), сине-зелёный хлорофилл a (Rf ~0,45), жёлтый ксантофилл (Rf ~0,71) и жёлто-оранжевый каротин у самого верха (Rf ~0,95).",
        },
        observation: {
          en: "The four pigments clearly separate based on polarity, with non-polar carotene moving fastest near the solvent front.",
          ky: "Пигменттер полярдуулугуна жараша даана бөлүнүп, полярсыз каротин эриткич менен чогуу эң жогору көтөрүлөт.",
          ru: "Чёткое разделение четырёх пигментов: неполярный каротин движется быстрее всех у самого фронта растворителя.",
        },
      },
    ],
  },
};

// Auto-populate remaining experiments (exp-07 to exp-24) with standard verified curriculum procedures
const REMAINING_EXPERIMENTS_CONFIG: Array<{
  id: string;
  slug: string;
  teacherSupervised: boolean;
  intro: { en: string; ky: string; ru: string };
  steps: Array<{
    title: { en: string; ky: string; ru: string };
    desc: { en: string; ky: string; ru: string };
    materials?: { en: string[]; ky: string[]; ru: string[] };
    obs?: { en: string; ky: string; ru: string };
    safety?: { en: string; ky: string; ru: string };
  }>;
}> = [
  {
    id: "exp-07",
    slug: "acid-base-titration-phenolphthalein",
    teacherSupervised: false,
    intro: {
      en: "Standard quantitative acid-base volumetric neutralization using standardized 0.1 M NaOH to determine hydrochloric acid equivalence with phenolphthalein indicator.",
      ky: "Фенолфталеин индикаторунун катышуусунда стандарттуу 0.1 M NaOH менен туз кислотасын сандык титрлөө жана эквиваленттик чекитти табуу.",
      ru: "Количественное объёмное титрование соляной кислоты стандартным 0,1 М раствором гидроксида натрия с индикатором фенолфталеином.",
    },
    steps: [
      {
        title: { en: "Step 1 — Rinse and Fill the Burette", ky: "1-кадам — Бюретканы даярдоо жана толтуруу", ru: "Шаг 1 — Промывка и заполнение бюретки" },
        desc: {
          en: "Rinse a clean 50 mL burette with 5 mL of standardized 0.100 M NaOH solution. Fill above zero, open stopcock briefly into waste to expel air bubbles from tip, and adjust meniscus precisely to 0.00 mL.",
          ky: "50 мл бюретканы 0.100 М NaOH эритмеси менен чайкап, нөлдөн өйдө толтуруңуз. Кранын ачып учундагы абаны чыгарып, деңгээлин 0.00 мл чейин түшүрүңүз.",
          ru: "Ополосните чистую бюретку раствором 0,100 М NaOH. Заполните выше нуля, спустите воздух из носика и установите мениск точно на отметку 0,00 мл.",
        },
        materials: {
          en: ["50 mL Burette with PTFE stopcock", "Standardized 0.100 M NaOH", "Funnel"],
          ky: ["50 мл бюретка", "Стандарттуу 0.100 M NaOH", "Воронка"],
          ru: ["Бюретка на 50 мл", "0,100 М NaOH", "Воронка"],
        },
      },
      {
        title: { en: "Step 2 — Pipette Acid Analyte into Erlenmeyer Flask", ky: "2-кадам — Кислотаны өлчөп колбага куюу", ru: "Шаг 2 — Отмеривание кислоты в коническую колбу" },
        desc: {
          en: "Using a volumetric bulb pipette, transfer exactly 25.0 mL of unknown/sample HCl solution into a 250 mL Erlenmeyer flask. Add 2 drops of 1% phenolphthalein indicator solution.",
          ky: "Көлөмдүк пипетка менен 25.0 мл HCl кислотасын 250 мл конус колбага куюңуз. Ага 2 тамчы 1% фенолфталеин индикаторунан тамызыңыз.",
          ru: "С помощью мерной пипетки перенесите ровно 25,0 мл кислоты HCl в коническую колбу на 250 мл и добавьте 2 капли 1% фенолфталеина.",
        },
        obs: {
          en: "The solution remains completely colorless in acidic media (pH < 8.2).",
          ky: "Кислоталуу чөйрөдө (pH < 8.2) эритме тунук түссүз бойдон калат.",
          ru: "В кислой среде раствор остаётся абсолютно бесцветным.",
        },
      },
      {
        title: { en: "Step 3 — Titrate with Continuous Swirling", ky: "3-кадам — Колбаны чайкап титрлөө", ru: "Шаг 3 — Титрование при постоянном перемешивании" },
        desc: {
          en: "Position the flask under the burette tip over a white tile. Turn stopcock with left hand while swirling flask continuously with right hand. Notice temporary pink flashes that dissipate immediately upon swirling.",
          ky: "Колбанын алдына ак плитка коюңуз. Сол кол менен кранды ачып тамчылатып, оң кол менен колбаны тынымсыз чайкап туруңуз.",
          ru: "Поместите колбу под бюретку на белый фон. Приливайте щёлочь по каплям при непрерывном круговом перемешивании колбы.",
        },
      },
      {
        title: { en: "Step 4 — Catch the Equivalence Endpoint", ky: "4-кадам — Эквиваленттик чекитти аныктоо", ru: "Шаг 4 — Достижение точки эквивалентности" },
        desc: {
          en: "When the pink color persists longer, add NaOH half-drop by half-drop. Stop at the exact instant a single drop produces the faintest pale-pink hue that persists for at least 30 seconds throughout the flask.",
          ky: "Өңдүн жоголушу жайлаганда, щелочту жарым тамчылатып кошуңуз. Бир тамчыдан улам бүткүл эритме 30 секунддан ашык мала кызгылт түскө өткөндө токтотуңуз.",
          ru: "Ближе к концу титрования добавляйте щёлочь по полкапли. Точка эквивалентности — появление устойчивой бледно-розовой окраски, не исчезающей 30 секунд.",
        },
        obs: {
          en: "Sharp transition from colorless to pale blush pink marks complete stoichiometric neutralization.",
          ky: "Түссүздөн ачык мала кызылга өтүү реакциянын толук аяктаганын көрсөтөт.",
          ru: "Мгновенный переход от бесцветного к едва заметному бледно-розовому сигнализирует о нейтрализации.",
        },
      },
      {
        title: { en: "Step 5 — Read Burette and Calculate Acid Concentration", ky: "5-кадам — Бюретканы эсептөө жана концентрацияны табуу", ru: "Шаг 5 — Снятие показаний и расчёт концентрации" },
        desc: {
          en: "Read the lower meniscus of the burette to ±0.02 mL. Record V_titrant. Calculate acid molarity: c(HCl) = [c(NaOH) × V(NaOH)] / V(HCl). Repeat two more trials for concordant titers.",
          ky: "Бюреткадагы көлөмдү 0.02 мл тактыкта жазып алыңыз. Формула боюнча кислотанын концентрациясын эсептеңиз: c(HCl) = [c(NaOH) × V(NaOH)] / V(HCl).",
          ru: "Запишите объём щёлочи с точностью до 0,02 мл. Рассчитайте молярную концентрацию кислоты по формуле: C₁V₁ = C₂V₂.",
        },
      },
    ],
  },
  {
    id: "exp-08",
    slug: "universal-indicator-ph-column",
    teacherSupervised: true,
    intro: {
      en: "Demonstration of a density-stabilized continuous vertical pH gradient spanning acidic red at the top to alkaline violet at the bottom in a tall cylinder.",
      ky: "Бийик цилиндрде универсалдуу индикатор менен тыгыздыкка негизделген түстүү pH градиентин түзүүчү көрсөтмө тажрыйба.",
      ru: "Демонстрационный опыт: создание непрерывного градиента плотности и кислотности от красного pH 2 до фиолетового pH 12 в высоком цилиндре.",
    },
    steps: [
      {
        title: { en: "Step 1 — Prepare the Dense Alkaline Bottom Base", ky: "1-кадам — Түбүнө тыгыз щелочтуу эритмени куюу", ru: "Шаг 1 — Заполнение дна плотным щелочным слоем" },
        desc: {
          en: "Dissolve 15 g of sodium carbonate (Na₂CO₃) in 50 mL of warm water. Pour into the bottom of a 250 mL graduated cylinder. Add 2 mL of universal indicator solution; it turns deep royal violet (pH ~11.5).",
          ky: "15 г соданы (Na₂CO₃) 50 мл сууда эритип, 250 мл цилиндрдин түбүнө куюңуз. 2 мл универсалдуу индикатор кошуңуз; ал кочкул сыя өңгө өтөт.",
          ru: "Растворите 15 г карбоната натрия в 50 мл воды и налейте на дно цилиндра на 250 мл. Добавьте 2 мл универсального индикатора (раствор станет фиолетовым).",
        },
      },
      {
        title: { en: "Step 2 — Layer Neutral Water Column", ky: "2-кадам — Нейтралдуу суу катмарын этият куюу", ru: "Шаг 2 — Наслаивание нейтральной воды" },
        desc: {
          en: "Tilt the cylinder at 45 degrees. Using a pipette directed against the inner glass wall, gently layer 100 mL of distilled water containing 2 mL universal indicator over the dense bottom layer without mixing.",
          ky: "Цилиндрди 45 градуска кыйшайтып, айнек дубалы менен 100 мл индикатор аралашкан сууну этияттык менен катмарлап куюңуз.",
          ru: "Наклонив цилиндр, аккуратно по стенке наслоите 100 мл дистиллированной воды с универсальным индикатором, избегая перемешивания.",
        },
      },
      {
        title: { en: "Step 3 — Introduce Acidic Top Layer and Establish Gradient", ky: "3-кадам — Үстүнкү кислота катмарын кошуу жана спектр түзүү", ru: "Шаг 3 — Добавление кислоты и формирование спектра" },
        desc: {
          en: "Layer 40 mL of dilute hydrochloric acid (0.2 M HCl) at the very top. Stir gently with a long glass rod in a slow vertical motion. A magnificent continuous vertical rainbow emerges from crimson red at top to orange, yellow, green, blue, and purple at base.",
          ky: "Эң үстүнө 40 мл 0.2 М HCl кислотасын куюңуз. Узун айнек таякча менен акырын бир жолу аралаштырганда, үстү кызылдан түбү сыя түскө чейинки толук асан-үсөн спектри жаралат.",
          ru: "Сверху наслоите 40 мл 0,2 М HCl. Медленно проведите стеклянной палочкой сверху вниз один раз. Возникает непрерывный радужный спектр всех цветов шкалы pH.",
        },
        obs: {
          en: "Spectacular vertical color continuum matches the classic universal indicator pH chart.",
          ky: "Вертикалдуу асан-үсөн түстөрү универсалдуу индикатордун pH шкаласына толук дал келет.",
          ru: "По вертикали цилиндра устанавливается радужная колонка от красного (pH 2) до фиолетового (pH 12).",
        },
      },
    ],
  },
  {
    id: "exp-09",
    slug: "iodine-clock-reaction-kinetics",
    teacherSupervised: true,
    intro: {
      en: "Investigation of chemical reaction rates using the Landolt iodine clock reaction: sudden delayed formation of starch-triiodide complex.",
      ky: "Химиялык реакциянын ылдамдыгын изилдөөчү Ландольттун «йод сааты» реакциясы: белгилүү убакыттан кийин эритменин көз ирмемде кара-көк түскө өзгөрүшү.",
      ru: "Исследование кинетики химических реакций на примере реакции «йодные часы»: внезапный скачок окраски крахмал-иодного комплекса через заданное время.",
    },
    steps: [
      {
        title: { en: "Step 1 — Prepare Solution A (Potassium Iodate)", ky: "1-кадам — А эритмесин даярдоо (калий иодаты)", ru: "Шаг 1 — Приготовление раствора А (иодат калия)" },
        desc: {
          en: "Dissolve 2.0 g of potassium iodate (KIO₃) in distilled water to prepare 500 mL of Solution A in a volumetric flask.",
          ky: "2.0 г калий иодатын (KIO₃) дистилденген сууда эритип, 500 мл көлөмдүк колбада А эритмесин даярдаңыз.",
          ru: "Растворите 2,0 г иодата калия (KIO₃) в воде и доведите объём до 500 мл в мерной колбе.",
        },
      },
      {
        title: { en: "Step 2 — Prepare Solution B (Bisulfite, Starch & Acid)", ky: "2-кадам — Б эритмесин даярдоо (бисульфит, крахмал, кислота)", ru: "Шаг 2 — Приготовление раствора Б (бисульфит, крахмал, кислота)" },
        desc: {
          en: "Dissolve 0.5 g sodium metabisulfite (Na₂S₂O₅), 2 mL of 1 M sulfuric acid, and 10 mL of freshly boiled 1% starch solution in water to make 500 mL of Solution B.",
          ky: "0.5 г натрий метабисульфитин, 2 мл 1 М күкүрт кислотасын жана 10 мл 1% крахмал клейстерин сууга кошуп, 500 мл Б эритмесин даярдаңыз.",
          ru: "Растворите 0,5 г метабисульфита натрия, 2 мл 1 М H₂SO₄ и 10 мл 1% раствора крахмала в воде до 500 мл.",
        },
      },
      {
        title: { en: "Step 3 — Mix Equal Volumes and Time the Color Transition", ky: "3-кадам — Эритмелерди кошуп, убакытты ченөө", ru: "Шаг 3 — Сливание растворов и хронометраж" },
        desc: {
          en: "Measure 50 mL of Solution A and 50 mL of Solution B into separate beakers. Pour B rapidly into A, swirling once, and start stopwatch immediately. After an exact incubation window (e.g., 22 seconds), the water-clear liquid instantly flashes jet-black.",
          ky: "50 мл А жана 50 мл Б эритмесин ченеп, Бны Ага бат куюп секундомерди басыңыз. 20–25 секунд бою эч нерсе болбогондой тунук туруп, көз ирмемде капкара-көк түскө өтөт.",
          ru: "Слейте по 50 мл растворов А и Б в один стакан и включите секундомер. Через точно воспроизводимое время (например, 22 секунды) прозрачный раствор мгновенно чернеет.",
        },
        obs: {
          en: "Instantaneous homogeneous optical transition across the entire volume within less than 0.1 seconds.",
          ky: "Бүткүл эритме 0.1 секунддун ичинде көз ирмемде тунуктуктан кара-көк түскө айланат.",
          ru: "Мгновенный оптический скачок по всему объёму жидкости быстрее чем за 0,1 секунды.",
        },
      },
    ],
  },
  {
    id: "exp-10",
    slug: "golden-rain-lead-iodide-precipitation",
    teacherSupervised: true,
    intro: {
      en: "Classic precipitation and recrystallization demonstration: temperature-dependent solubility of lead(II) iodide producing sparkling hexagonal gold crystals.",
      ky: "Коргошун(II) иодидинин температурага жараша эригичтигин жана алтын жалтырак кристаллдардын чөгүшүн көрсөткөн «Алтын жамгыр» тажрыйбасы.",
      ru: "Классический опыт «Золотой дождь»: осаждение и медленная кристаллизация иодида свинца(II) с образованием мерцающих золотистых шестигранных пластинок.",
    },
    steps: [
      {
        title: { en: "Step 1 — Mix Precursor Solutions to Precipitate Lead Iodide", ky: "1-кадам — Баштапкы эритмелерди кошуп чөкмө пайда кылуу", ru: "Шаг 1 — Осаждение иодида свинца" },
        desc: {
          en: "In a 500 mL Erlenmeyer flask, combine 100 mL of 0.05 M lead(II) nitrate with 100 mL of 0.1 M potassium iodide. A dense canary-yellow precipitate of PbI₂ forms immediately.",
          ky: "500 мл колбада 100 мл 0.05 М коргошун нитратына 100 мл 0.1 М калий иодидин куюңуз. Дароо ачык сары түстөгү PbI₂ чөкмөсү түшөт.",
          ru: "Смешайте в колбе на 500 мл по 100 мл растворов 0,05 М Pb(NO₃)₂ и 0,1 М KI. Выпадает плотный жёлтый осадок PbI₂.",
        },
        safety: {
          en: "Lead salts are toxic. Wear gloves and do not ingest.",
          ky: "Коргошун туздары уулуу. Кол кап кийип иштеңиз.",
          ru: "Соли свинца токсичны. Работать в перчатках под тягой.",
        },
      },
      {
        title: { en: "Step 2 — Dissolve Precipitate by Heating with Acetic Acid", ky: "2-кадам — Уксус кислотасын кошуп ысытып эритүү", ru: "Шаг 2 — Растворение осадка при нагревании" },
        desc: {
          en: "Add 5 mL of glacial acetic acid and 150 mL of hot distilled water. Heat the flask on a hot plate to near boiling (~90 °C) while swirling until all yellow solid dissolves to form a completely transparent pale solution.",
          ky: "5 мл уксус кислотасын жана 150 мл ысык суу кошуп, плиткада 90 °C чейин ысытыңыз. Сары чөкмө толук эрип, эритме тунук болуп калат.",
          ru: "Добавьте 5 мл уксусной кислоты и 150 мл горячей воды. Нагревайте до полного растворения осадка (~90 °C).",
        },
      },
      {
        title: { en: "Step 3 — Allow Slow Undisturbed Cooling in Darkness", ky: "3-кадам — Козгобой жай муздатып «алтын жамгырды» көрүү", ru: "Шаг 3 — Медленное охлаждение и наблюдение золотых хлопьев" },
        desc: {
          en: "Remove flask and set on an insulated mat. Shine a strong LED flashlight through the flask in a dimly lit room as it cools. Microscopic golden hexagonal plates crystallize and drift downward like a shimmering golden snowfall.",
          ky: "Колбаны кыймылдатпай коюп, жарыкты өчүрүп фонарик менен караңыз. Эритме муздаган сайын миңдеген алтын жалтырак кристаллдар жамгыр сымал ылдый калкып түшөт.",
          ru: "Поставьте колбу остывать. При боковом освещении фонариком в темноте виден мерцающий золотой дождь из плоских микрокристаллов.",
        },
        obs: {
          en: "Sparkling golden flakes exhibit intense metallic luster as they catch the light.",
          ky: "Кристаллдар жарыкта чыныгы алтын сымал жалтырап көрүнөт.",
          ru: "Интенсивный золотой блеск взвеси кристаллов в луче света.",
        },
      },
    ],
  },
  {
    id: "exp-11",
    slug: "hydrogen-gas-generation-pop-test",
    teacherSupervised: false,
    intro: {
      en: "Generation of hydrogen gas via zinc-acid single displacement and acoustic confirmation using the squeaky pop combustion test.",
      ky: "Цинк менен кислотанын реакциясынан суутек газын бөлүп алуу жана аны пахтаган үнү боюнча таануу.",
      ru: "Получение водорода взаимодействием цинка с соляной кислотой и проверка пробой на горение («squeaky pop test»).",
    },
    steps: [
      {
        title: { en: "Step 1 — Place Zinc Granules into Reaction Tube", ky: "1-кадам — Пробиркага цинк гранулаларын салуу", ru: "Шаг 1 — Помещение гранул цинка в пробирку" },
        desc: {
          en: "Place 3–4 clean granules of zinc metal into a pyrex test tube held securely in a clamp.",
          ky: "Штативдеги пробиркага 3–4 таза цинк грануласын салыңыз.",
          ru: "Поместите 3–4 гранулы металлического цинка в закреплённую пробирку.",
        },
      },
      {
        title: { en: "Step 2 — Add Hydrochloric Acid & Insert Delivery Stopper", ky: "2-кадам — Туз кислотасын куюп, газ чыгаруучу түтүктү тагуу", ru: "Шаг 2 — Приливание соляной кислоты и закрытие пробкой" },
        desc: {
          en: "Add 5 mL of 2 M hydrochloric acid. Fit a rubber bung with a right-angled delivery tube immediately.",
          ky: "5 мл 2 М туз кислотасын куюп, дароо газ чыгаруучу түтүгү бар тыгынды бекитиңиз.",
          ru: "Прилейте 5 мл 2 М соляной кислоты и сразу закройте пробкой с газоотводной трубкой.",
        },
        obs: {
          en: "Vigorous effervescence of colorless gas bubbles rapidly fills the delivery system.",
          ky: "Цинктин бетинен суутек газынын көбүкчөлөрү тез бөлүнүп чыгат.",
          ru: "Наблюдается активное выделение пузырьков бесцветного газа.",
        },
      },
      {
        title: { en: "Step 3 — Collect Gas by Inverted Tube & Perform Pop Test", ky: "3-кадам — Газды чогултуу жана күйгүзүп текшерүү", ru: "Шаг 3 — Сбор газа и проба на слух" },
        desc: {
          en: "Hold a second small test tube inverted over the delivery tip for 30 seconds. Keeping it mouth-down, bring a burning wooden splint near the mouth.",
          ky: "Түтүктүн учуна экинчи пробирканы оозун ылдый каратып 30 секунд кармаңыз. Оозун бурбай, күйгөн ширенкени жакындатыңыз.",
          ru: "Соберите газ в перевёрнутую пробирку (водород легче воздуха). Поднесите горящую лучину к отверстию пробирки.",
        },
        obs: {
          en: "A sharp 'squeak / pop' acoustic combustion verifies pure hydrogen gas.",
          ky: "Мүнөздүү пахтаган үн суутек газынын таза бөлүнүп чыкканын далилдейт.",
          ru: "Характерный резкий хлопок доказывает образование газообразного водорода.",
        },
      },
    ],
  },
  {
    id: "exp-12",
    slug: "oxygen-generation-glowing-splint",
    teacherSupervised: false,
    intro: {
      en: "Catalytic decomposition of dilute hydrogen peroxide by manganese dioxide and relighting a glowing wooden splint.",
      ky: "Марганец диоксидинин каталитикалык таасиринде кычкылтек бөлүп алуу жана чок чырпыкты жалындатып текшерүү.",
      ru: "Каталитическое получение кислорода из перекиси водорода с диоксидом марганца и проба тлеющей лучиной.",
    },
    steps: [
      {
        title: { en: "Step 1 — Measure Hydrogen Peroxide into Test Tube", ky: "1-кадам — Пробиркага суутек пероксидин куюу", ru: "Шаг 1 — Наливание перекиси водорода" },
        desc: {
          en: "Pour 10 mL of 3% hydrogen peroxide into a borosilicate test tube in a rack.",
          ky: "Штативдеги пробиркага 10 мл 3% суутек пероксидин куюңуз.",
          ru: "Налейте 10 мл 3% перекиси водорода в пробирку.",
        },
      },
      {
        title: { en: "Step 2 — Add Manganese Dioxide Catalyst", ky: "2-кадам — Марганец диоксиди катализаторун кошуу", ru: "Шаг 2 — Добавление катализатора MnO₂" },
        desc: {
          en: "Add a small tip of a micro-spatula of black manganese dioxide (MnO₂) powder.",
          ky: "Шпателдин учу менен кара марганец диоксидинин (MnO₂) порошогунан кошуңуз.",
          ru: "Добавьте на кончике шпателя порошок оксида марганца(IV) (MnO₂).",
        },
        obs: {
          en: "Immediate energetic bubbling of oxygen gas effervesces from the black particles.",
          ky: "Кара порошоктун бетинен көз ирмемде кычкылтек көбүкчөлөрү бөлүнө баштайт.",
          ru: "Мгновенное бурное вскипание смеси с выделением газообразного O₂.",
        },
      },
      {
        title: { en: "Step 3 — Insert Glowing Splint to Relight Flame", ky: "3-кадам — Чокту киргизип жалынды тутантуу", ru: "Шаг 3 — Внесение тлеющей лучины" },
        desc: {
          en: "Light a wooden splint and gently blow out flame so a red glowing tip remains. Lower into the upper neck of the tube. The glowing ember reignites instantly into bright yellow-white flame.",
          ky: "Чырпыкты күйгүзүп, жалынын үйлөп чок бойдон пробирканын оозуна салыңыз. Кычкылтектин таасиринен чок дароо жалындап күйөт.",
          ru: "Опустите тлеющую лучину в верхнюю часть пробирки. Лучина мгновенно ярко вспыхивает пламенем.",
        },
        obs: {
          en: "Relighting splint definitively confirms an oxygen-rich atmosphere.",
          ky: "Чоктун тутанышы кычкылтек газынын бар экендигин далилдейт.",
          ru: "Вспыхивание тлеющей лучины — качественная реакция на чистый кислород.",
        },
      },
    ],
  },
  {
    id: "exp-13",
    slug: "carbon-dioxide-limewater-clouding",
    teacherSupervised: false,
    intro: {
      en: "Generation of carbon dioxide from calcium carbonate marble chips and hydrochloric acid with characteristic limewater clouding.",
      ky: "Акиташ ташы менен туз кислотасынан көмүр кычкыл газын алуу жана акиташ суусун тумандатуу.",
      ru: "Получение углекислого газа из мрамора и кислоты с качественной реакцией помутнения известковой воды.",
    },
    steps: [
      {
        title: { en: "Step 1 — Prepare Carbonate Generating Vessel and Limewater Receiver", ky: "1-кадам — Реакциялык идишти жана акиташ суусун даярдоо", ru: "Шаг 1 — Подготовка прибора и известковой воды" },
        desc: {
          en: "Place 3 marble chips (CaCO₃) into Tube 1. Fill Tube 2 with 5 mL of clear, freshly filtered limewater (Ca(OH)₂).",
          ky: "1-пробиркага 3 даана мрамор сыныгын (CaCO₃) салыңыз. 2-пробиркага 5 мл тунук акиташ суусун (Ca(OH)₂) куюңуз.",
          ru: "В пробирку №1 поместите 2–3 кусочка мрамора, в пробирку №2 налейте 5 мл прозрачной известковой воды.",
        },
      },
      {
        title: { en: "Step 2 — Add Acid and Bubble Gas Through Limewater", ky: "2-кадам — Кислотаны куюп, газды акиташ суусу аркылуу өткөрүү", ru: "Шаг 2 — Пропускание газа через известковую воду" },
        desc: {
          en: "Add 4 mL of 1 M HCl to Tube 1 and seal with delivery tube submerged into Tube 2. Effervescent CO₂ bubbles through limewater.",
          ky: "1-пробиркага 4 мл 1 М HCl куюп, түтүктү 2-пробиркадагы сууга салып тыгынды жабыңыз.",
          ru: "Прилейте 4 мл 1 М соляной кислоты и направьте отводную трубку на дно пробирки с известковой водой.",
        },
        obs: {
          en: "Limewater turns visibly cloudy/milky white as fine insoluble calcium carbonate (CaCO₃) precipitates.",
          ky: "Эрибеген кальций карбонаты (CaCO₃) чөккөндүктөн акиташ суусу сүттөй тунук эмес ак түскө өтөт.",
          ru: "Известковая вода быстро мутнеет из-за образования тонкого белого осадка карбоната кальция.",
        },
      },
    ],
  },
  {
    id: "exp-14",
    slug: "zinc-acid-hydrogen-evolution-rate",
    teacherSupervised: false,
    intro: {
      en: "Investigation of collision theory and chemical kinetics: comparing reaction rate of zinc strip vs. fine zinc powder in acid.",
      ky: "Химиялык кинетика: тийүү аянтынын реакциянын ылдамдыгына тийгизген таасирин цинк пластинкасы менен порошогун салыштыруу.",
      ru: "Исследование влияния площади поверхности твёрдого вещества на скорость реакции на примере цинка разной дисперсности с кислотой.",
    },
    steps: [
      {
        title: { en: "Step 1 — Weigh Equal Masses of Strip and Powder", ky: "1-кадам — Пластинка менен порошокту бирдей өлчөө", ru: "Шаг 1 — Взвешивание равных навесок" },
        desc: {
          en: "Weigh exactly 1.00 g of zinc metal strip and 1.00 g of zinc fine powder into separate weighing boats.",
          ky: "Таразага так 1.00 г цинк пластинкасын жана 1.00 г майда цинк порошогун тартып алыңыз.",
          ru: "Взвесьте ровно по 1,00 г металлического цинка в виде пластинки и порошка.",
        },
      },
      {
        title: { en: "Step 2 — Add Concurrently to Twin Acid Tubes & Compare Rates", ky: "2-кадам — Эки пробиркага бир убакта салып ылдамдыгын салыштыруу", ru: "Шаг 2 — Одновременное внесение в кислоту" },
        desc: {
          en: "Simultaneously drop the zinc samples into identical tubes containing 10 mL of 1 M HCl with attached gas syringes. The fine powder reacts violently producing gas 10x faster due to vast exposed surface area.",
          ky: "Эки үлгүнү 10 мл 1 М HCl бар пробиркаларга бир убакта салыңыз. Порошок тийүү аянты чоң болгондуктан он эсе тез реакцияга кирет.",
          ru: "Одновременно добавьте образцы в пробирки с 10 мл 1 М соляной кислоты. Порошок реагирует во много раз интенсивнее гранул.",
        },
      },
    ],
  },
  {
    id: "exp-15",
    slug: "burning-magnesium-ribbon",
    teacherSupervised: true,
    intro: {
      en: "High-temperature exothermic combustion of magnesium ribbon in oxygen forming white magnesium oxide with intense white light.",
      ky: "Магний тасмасынын жалындап күйүшү жана ак түстөгү магний оксидинин пайда болушу (көрсөтмө тажрыйба).",
      ru: "Демонстрационный опыт: горение магниевой ленты на воздухе с ослепительной вспышкой и образованием оксида магния.",
    },
    steps: [
      {
        title: { en: "Step 1 — Clean Ribbon and Grip with Tongs", ky: "1-кадам — Магний тасмасын тазалоо жана кычкач менен кармоо", ru: "Шаг 1 — Зачистка и фиксация ленты" },
        desc: {
          en: "Cut 5 cm of magnesium ribbon, polish with sandpaper to clean oxide, and hold securely with metal crucible tongs.",
          ky: "5 см магний тасмасын кум кагаз менен тазалап, темир кычкач менен бекем кармаңыз.",
          ru: "Отрежьте 5 см магниевой ленты, зачистите до блеска и зажмите тигельными щипцами.",
        },
        safety: {
          en: "Do not look directly at burning magnesium. Intense ultraviolet radiation can injure retinas.",
          ky: "Күйүп жаткан магнийди түз карабаңыз. Күчтүү ультракызгылт-көк нурлар көздү жабыркатат.",
          ru: "Категорически запрещено смотреть прямо на вспышку магния без светофильтра.",
        },
      },
      {
        title: { en: "Step 2 — Ignite in Bunsen Flame and Collect Oxide", ky: "2-кадам — Жалынга кармап күйгүзүү жана оксидди чогултуу", ru: "Шаг 2 — Поджигание в пламени горелки" },
        desc: {
          en: "Hold the tip in Bunsen flame until it ignites with a dazzling white light. Hold over a porcelain dish to collect brittle white magnesium oxide (MgO) ash.",
          ky: "Тасманын учун жалынга тосуңуз. Ал жаркырап күйүп баштаганда фарфор табакчанын үстүнө кармап, ак күлүн (MgO) чогултуңуз.",
          ru: "Внесите ленту в пламя горелки до воспламенения. Соберите белый пепел оксида магния в чашку.",
        },
      },
    ],
  },
  {
    id: "exp-16",
    slug: "iron-nail-copper-sulfate-displacement",
    teacherSupervised: false,
    intro: {
      en: "Single displacement redox reaction where metallic iron reduces copper(II) ions, plating salmon-pink copper metal onto the nail.",
      ky: "Темир мык менен жез сульфатынын орун алмашуу реакциясы: мыктын бетине кызыл-күрөң таза жездин чөгүшү.",
      ru: "Реакция замещения: вытеснение меди из раствора медного купороса железным гвоздём.",
    },
    steps: [
      {
        title: { en: "Step 1 — Clean Iron Nail Surface", ky: "1-кадам — Темир мыктын бетин жылмалоо", ru: "Шаг 1 — Зачистка поверхности гвоздя" },
        desc: {
          en: "Rub an iron nail with sandpaper until shiny and grease-free.",
          ky: "Темир мыктын бетин даттан кум кагаз менен тазалап жылтыратыңыз.",
          ru: "Зачистите железный гвоздь наждачной бумагой до металлического блеска.",
        },
      },
      {
        title: { en: "Step 2 — Submerge in Copper Sulfate Solution", ky: "2-кадам — Жез купоросунун эритмесине салуу", ru: "Шаг 2 — Погружение в раствор сульфата меди" },
        desc: {
          en: "Immerse half of the nail into a test tube containing 10 mL of 0.5 M CuSO₄. After 5 minutes, observe a thick coating of reddish metallic copper forming on the iron.",
          ky: "Мыктын жарымын 10 мл жез купоросу бар пробиркага салыңыз. 5 мүнөттөн кийин мыктын бети кызыл жез менен капталат.",
          ru: "Опустите гвоздь в 0,5 М раствор CuSO₄ на 5–10 минут. На гвозде появится слой красно-розовой меди.",
        },
      },
    ],
  },
  {
    id: "exp-17",
    slug: "supersaturated-sugar-rock-candy-crystallization",
    teacherSupervised: false,
    intro: {
      en: "Preparation of a supersaturated sucrose solution and slow crystal growth over seed skewers to harvest geometric rock candy crystals.",
      ky: "Канттын ашыкча каныккан эритмесинен геометриялык таттуу кристаллдарды (нават) өстүрүү.",
      ru: "Выращивание крупных кристаллов сахара из пересыщенного сиропа на деревянной палочке-затравке.",
    },
    steps: [
      {
        title: { en: "Step 1 — Dissolve 3:1 Ratio of Sugar to Boiling Water", ky: "1-кадам — 3:1 катышта кантты кайнак сууда эритүү", ru: "Шаг 1 — Варка пересыщенного сиропа" },
        desc: {
          en: "Dissolve 3 cups of granulated sugar in 1 cup of boiling water until completely clear. Cool for 15 minutes.",
          ky: "1 стакан кайнак сууга 3 стакан кант кошуп, толук эригенче кайнатыңыз. 15 мүнөт муздатыңыз.",
          ru: "Растворите 3 стакана сахара в 1 стакане кипящей воды до полной прозрачности.",
        },
      },
      {
        title: { en: "Step 2 — Suspend Seeded Skewer and Allow 7-Day Growth", ky: "2-кадам — Уруктанган таякчаны илип, 7 күн өстүрүү", ru: "Шаг 2 — Выдерживание затравки в течение недели" },
        desc: {
          en: "Dip wooden skewer in syrup, roll in dry sugar crystals, dry thoroughly, and suspend into jar of cooled syrup with a peg for 7 days.",
          ky: "Жыгач таякчаны сиропко малып, кант себип кургатыңыз. Банкадагы сиропко илип, 7 күн козгобой коюңуз.",
          ru: "Обваляйте палочку в сахаре, высушите и закрепите в банке с сиропом на 7 дней.",
        },
      },
    ],
  },
  {
    id: "exp-18",
    slug: "copper-sulfate-crystal-growth",
    teacherSupervised: false,
    intro: {
      en: "Growing a pristine monoclinic single crystal of copper(II) sulfate pentahydrate from hot saturated solution via seed crystal suspension.",
      ky: "Каныккан эритмеден жез купоросунун чоң кооз монокристаллын өстүрүү тажрыйбасы.",
      ru: "Выращивание крупного монокристалла медного купороса правильной триклинной формы.",
    },
    steps: [
      {
        title: { en: "Step 1 — Prepare Saturated Solution at 60 °C", ky: "1-кадам — 60 °Cде каныккан эритме даярдоо", ru: "Шаг 1 — Приготовление насыщенного раствора" },
        desc: {
          en: "Dissolve copper sulfate in hot water until no more dissolves. Filter hot into a beaker.",
          ky: "Ысык сууга жез купоросун эрибей калганча кошуп, ысык бойдон чыпкалаңыз.",
          ru: "Насыщайте воду сульфатом меди при 60 °C до прекращения растворения и отфильтруйте.",
        },
      },
      {
        title: { en: "Step 2 — Suspend Selected Seed Crystal for Slow Growth", ky: "2-кадам — Урук кристаллды илип өстүрүү", ru: "Шаг 2 — Подвешивание затравки на нити" },
        desc: {
          en: "Tie a perfect small seed crystal to nylon filament and suspend submerged in filtered solution covered with filter paper.",
          ky: "Түз кырдуу кичинекей урук кристаллды жипке байлап, эритменин ортосуна илип коюңуз.",
          ru: "Подвесьте кристалл-затравку на леске в охлаждённый раствор на несколько суток.",
        },
      },
    ],
  },
  {
    id: "exp-19",
    slug: "simple-distillation-colored-salt-water",
    teacherSupervised: false,
    intro: {
      en: "Physical separation of pure volatile water from non-volatile salts and food dye using a Liebig condenser.",
      ky: "Либих муздаткычынын жардамы менен туздуу жана боёлгон суудан таза дистилденген сууну бөлүү.",
      ru: "Простая перегонка солёной подкрашенной воды с получением чистого дистиллята.",
    },
    steps: [
      {
        title: { en: "Step 1 — Assemble Distillation Apparatus & Boiling Stones", ky: "1-кадам — Дистилляция аппаратын кураштыруу", ru: "Шаг 1 — Сборка установки перегонки" },
        desc: {
          en: "Set up round-bottom flask, distillation head with thermometer, and Liebig condenser with counter-current cooling water.",
          ky: "Тегерек түптүү колбаны, термометрди жана муздаткычты курап, сууну төмөндөн өйдө туташтырыңыз.",
          ru: "Соберите колбу Вюрца, термометр и холодильник Либиха с проточной водой.",
        },
      },
      {
        title: { en: "Step 2 — Distill at 100 °C and Collect Pure Condensate", ky: "2-кадам — 100 °Cде кайнатып таза сууну чогултуу", ru: "Шаг 2 — Перегонка при 100 °C" },
        desc: {
          en: "Boil saline solution steadily. Pure colorless water vapor condenses in the cooling jacket and drips into the receiver flask.",
          ky: "Эритмени кайнатыңыз. Бууланган таза суу муздаткычта суюктукка айланып, кабыл алгычка тунук куюлат.",
          ru: "Нагрейте колбу. Пары воды конденсируются в холодильнике, стекая прозрачными каплями в приёмник.",
        },
      },
    ],
  },
  {
    id: "exp-20",
    slug: "fractional-separation-sand-salt-iron",
    teacherSupervised: false,
    intro: {
      en: "Multi-step separation of a three-component heterogeneous solid mixture exploiting magnetism, differential solubility, and evaporation.",
      ky: "Темир, кум жана туз аралашмасын магнитизм, эрүү жана буулантуу аркылуу бөлүү.",
      ru: "Разделение трёхкомпонентной смеси (железо, песок, соль) на основе различия их физических свойств.",
    },
    steps: [
      {
        title: { en: "Step 1 — Magnetic Extraction of Iron Filings", ky: "1-кадам — Темирди магнит менен бөлүү", ru: "Шаг 1 — Магнитная сепарация железа" },
        desc: {
          en: "Wrap bar magnet in plastic wrap and pass through dry mixture to extract all ferromagnetic iron filings.",
          ky: "Магнитти баштыкка салып, кургак аралашмадан темир күкүмдөрүн толук тартып алыңыз.",
          ru: "Извлеките железные опилки магнитом, обёрнутым полиэтиленовой плёнкой.",
        },
      },
      {
        title: { en: "Step 2 — Dissolve Salt and Gravity Filter Insoluble Sand", ky: "2-кадам — Тузду эритип, кумду чыпкалап алуу", ru: "Шаг 2 — Растворение и фильтрование песка" },
        desc: {
          en: "Add water to remaining sand and salt, stir until NaCl dissolves, then filter through paper to collect dry sand.",
          ky: "Калган кум менен тузга суу куюп тузду эритиңиз. Чыпка кагазы аркылуу кумду бөлүп алыңыз.",
          ru: "Залейте смесь водой, перемешайте и отфильтруйте песок через бумажный фильтр.",
        },
      },
      {
        title: { en: "Step 3 — Evaporate Filtrate to Recover Crystalline Salt", ky: "3-кадам — Эритмени буулантып тузду калыбына келтирүү", ru: "Шаг 3 — Выпаривание соли" },
        desc: {
          en: "Heat clear saline filtrate in an evaporating dish until water evaporates, leaving pure white salt crystals.",
          ky: "Туздуу сууну фарфор чөйчөктө кайнатып суусун учуруңуз, түбүндө ак туз кристаллдары калат.",
          ru: "Выпарьте прозрачный фильтрат в фарфоровой чашке досуха, получив чистую поваренную соль.",
        },
      },
    ],
  },
  {
    id: "exp-21",
    slug: "daniel-galvanic-cell-copper-zinc-lemon",
    teacherSupervised: false,
    intro: {
      en: "Construction of an electrochemical voltaic cell using copper and zinc electrodes in an acidic electrolyte to generate electric potential.",
      ky: "Лимон ширесиндеги жез жана цинк электроддорунун жардамы менен электр чыңалуусун пайда кылуучу гальваникалык элемент.",
      ru: "Создание гальванического элемента из медной и цинковой пластин в кислой среде лимона.",
    },
    steps: [
      {
        title: { en: "Step 1 — Insert Zinc and Copper Electrodes", ky: "1-кадам — Цинк жана жез электроддорун саюу", ru: "Шаг 1 — Установка электродов" },
        desc: {
          en: "Insert cleaned zinc strip and copper coin into lemon 2 cm apart without touching internally.",
          ky: "Лимонго бири-бирине тийгизбей 2 см аралыкта таза цинк жана жез тилкелерин сайыңыз.",
          ru: "Воткните в лимон зачищенные цинковую и медную пластинки на расстоянии 2 см.",
        },
      },
      {
        title: { en: "Step 2 — Measure Voltage and Light LED", ky: "2-кадам — Чыңалууну өлчөө жана жарык диодун күйгүзүү", ru: "Шаг 2 — Измерение ЭДС и питание светодиода" },
        desc: {
          en: "Connect multimeter to measure ~0.9 V DC. Connect 3 lemon cells in series to power a red LED.",
          ky: "Мультиметр менен 0.9 В чыңалууну өлчөңүз. 3 лимонду удаалаш туташтырып диодду күйгүзүңүз.",
          ru: "Измерьте напряжение (~0,9 В) и соедините 3 лимона последовательно для питания светодиода.",
        },
      },
    ],
  },
  {
    id: "exp-22",
    slug: "electrolysis-copper-chloride-ki-starch",
    teacherSupervised: false,
    intro: {
      en: "Electrolysis of potassium iodide solution producing visible simultaneous iodine (blue with starch) at anode and hydroxide (pink with phenolphthalein) at cathode.",
      ky: "Калий иодидинин эритмесин электролиздөө: аноддо йоддун (крахмал менен кара-көк), катоддо щелочтун (фенолфталеин менен кызгылт) пайда болушу.",
      ru: "Электролиз раствора иодида калия с одновременной визуализацией йода (синий с крахмалом) и щёлочи (малиновый с фенолфталеином).",
    },
    steps: [
      {
        title: { en: "Step 1 — Prepare KI Electrolyte with Dual Indicators", ky: "1-кадам — Индикаторлору бар KI эритмесин даярдоо", ru: "Шаг 1 — Подготовка электролита с индикаторами" },
        desc: {
          en: "Add starch and phenolphthalein drops to 0.2 M KI solution. Pour into a U-tube.",
          ky: "0.2 M KI эритмесине крахмал жана фенолфталеин кошуп, U-сымал түтүккө куюңуз.",
          ru: "Добавьте крахмал и фенолфталеин в раствор KI налейте в U-образную трубку.",
        },
      },
      {
        title: { en: "Step 2 — Apply 9 V DC and Observe Dual Colors", ky: "2-кадам — 9 В ток берип эки башка өңдү байкоо", ru: "Шаг 2 — Включение тока и наблюдение окрашивания" },
        desc: {
          en: "Insert pencil graphite electrodes and apply 9 V. Cathode turns deep pink (OH⁻); anode turns dark blue-black (I₂).",
          ky: "Графит электроддорун салып 9 В ток бериңиз. Катод кызгылт өңгө, анод кочкул кара-көккө өтөт.",
          ru: "Включите ток 9 В: катодное пространство мгновенно розовеет, а анодное окрашивается в тёмно-синий цвет.",
        },
      },
    ],
  },
  {
    id: "exp-23",
    slug: "flame-test-emission-spectra-metal-cations",
    teacherSupervised: true,
    intro: {
      en: "Thermal atomic emission spectroscopy: observing unique flame colors produced by metal cations in hot Bunsen flame.",
      ky: "Жалындагы атомдук эмиссиялык спектроскопия: металлдардын катиондорунун жалындын өңүн ар башка түскө боёшу.",
      ru: "Качественный микроанализ методом окрашивания пламени горелки катионами металлов.",
    },
    steps: [
      {
        title: { en: "Step 1 — Clean Nichrome Wire in Concentrated Acid", ky: "1-кадам — Нихром зымын кислотада тазалоо", ru: "Шаг 1 — Очистка нихромовой петли" },
        desc: {
          en: "Dip wire loop into concentrated HCl and hold in hot flame until flame exhibits zero color.",
          ky: "Нихром зымдын илмегин туз кислотасына малып, жалын түссүз болгончо күйгүзүңүз.",
          ru: "Прокалите петлю из нихрома в пламени горелки, предварительно смочив в концентрированной HCl.",
        },
      },
      {
        title: { en: "Step 2 — Introduce Salt Crystals and Record Color", ky: "2-кадам — Тузду жалынга кармап өңүн каттоо", ru: "Шаг 2 — Внесение солей и наблюдение цвета" },
        desc: {
          en: "Touch wire to chloride salt (Li⁺, Na⁺, K⁺, Cu²⁺) and hold in base of flame: Li is crimson, Na is golden yellow, K is lilac (through cobalt glass), Cu is green.",
          ky: "Илмекке тузду тийгизип жалынга кармаңыз: Литий кочкул кызыл, натрий сары, калий кызгылт сыя, жез жашыл өң берет.",
          ru: "Внесите крупинку соли в пламя: литий даёт карминово-красный цвет, натрий — жёлтый, калий — фиолетовый, медь — изумрудный.",
        },
      },
    ],
  },
  {
    id: "exp-24",
    slug: "exothermic-endothermic-dissolution-salts",
    teacherSupervised: false,
    intro: {
      en: "Calorimetric comparison of exothermic lattice/hydration enthalpy (CaCl₂) versus endothermic chill (NH₄NO₃).",
      ky: "Туздун эришиндеги жылуулук кубулуштары: экзотермиялык ысытуу (CaCl₂) жана эндотермиялык муздатуу (NH₄NO₃).",
      ru: "Калориметрическое сравнение экзотермического растворения хлорида кальция и эндотермического охлаждения нитрата аммония.",
    },
    steps: [
      {
        title: { en: "Step 1 — Measure Initial Water Temperatures in Calorimeters", ky: "1-кадам — Суунун баштапкы температурасын өлчөө", ru: "Шаг 1 — Измерение начальной температуры воды" },
        desc: {
          en: "Add 50 mL room-temperature water to two cups. Record initial temperature T₁ (~20 °C) with thermometer.",
          ky: "Эки стаканга 50 мл бөлмө температурасындагы суу куюп, Т₁ температурасын жазыңыз.",
          ru: "Налейте по 50 мл воды в два стакана и замерьте начальную температуру Т₁.",
        },
      },
      {
        title: { en: "Step 2 — Dissolve Salts Separately and Track Temperature Changes", ky: "2-кадам — Туздарды салып, температуранын өзгөрүшүн ченөө", ru: "Шаг 2 — Внесение солей и замер ΔT" },
        desc: {
          en: "Add 5 g CaCl₂ to Cup 1 (temperature shoots up to ~55 °C, exothermic). Add 5 g NH₄NO₃ to Cup 2 (temperature plummets to ~4 °C near freezing, endothermic).",
          ky: "1-стаканга 5 г CaCl₂ салыңыз (ысып 55 °C жетет, экзотермиялык). 2-стаканга 5 г NH₄NO₃ салыңыз (муздап 4 °C чейин түшөт, эндотермиялык).",
          ru: "В стакан №1 добавьте 5 г CaCl₂ (нагрев до 55 °C, экзотермический). В стакан №2 добавьте 5 г NH₄NO₃ (охлаждение до 4 °C, эндотермический).",
        },
        obs: {
          en: "CaCl₂ liberates substantial heat of hydration; NH₄NO₃ lattice enthalpy demands surrounding energy.",
          ky: "CaCl₂ эригенде көп жылуулук бөлүнөт; NH₄NO₃ эригенде чөйрөдөн жылуулук жутулуп муздайт.",
          ru: "Хлорид кальция интенсивно нагревает воду, а селитра аммония резко охлаждает её почти до замерзания.",
        },
      },
    ],
  },
];

// Hydrate remaining experiment procedures
for (const config of REMAINING_EXPERIMENTS_CONFIG) {
  EXPERIMENT_PROCEDURES[config.slug] = {
    experimentId: config.id,
    slug: config.slug,
    reviewStatus: "under_review",
    teacherSupervised: config.teacherSupervised,
    introduction: config.intro,
    supervisionNotice: config.teacherSupervised
      ? {
          en: "Teacher-supervised demonstration. Hazardous reaction conditions or high thermal energies require educator execution.",
          ky: "Мугалимдин көзөмөлү менен өткөрүлүүчү көрсөтмө тажрыйба. Коопсуздук эрежелерин так сактоо талап кылынат.",
          ru: "Демонстрационный опыт под руководством учителя с соблюдением требований безопасности.",
        }
      : {
          en: "Approved secondary school laboratory practical. Follow standard benchtop safety guidelines.",
          ky: "Мектептин химия лабораториясында окуучулар аткарууга бекитилген практикалык иш.",
          ru: "Одобренная школьная лабораторная работа для учащихся при соблюдении стандартных мер безопасности.",
        },
    safetyOverview: {
      en: "Always wear safety goggles, lab coat, and protective gloves. Handle glassware with care.",
      ky: "Сөзсүз коргоочу көз айнек, халат жана кол кап кийиңиз. Айнек идиштерди этият колдонуңуз.",
      ru: "Обязательно используйте защитные очки, халат и перчатки. Бережно обращайтесь со стеклом.",
    },
    steps: config.steps.map((st, idx) => ({
      stepNumber: idx + 1,
      title: st.title,
      description: st.desc,
      materialsUsed: st.materials,
      observation: st.obs,
      safetyNote: st.safety,
      isTeacherSupervised: config.teacherSupervised,
    })),
  };
}

export function getExperimentProcedure(slugOrId: string): ExperimentProcedure | undefined {
  if (EXPERIMENT_PROCEDURES[slugOrId]) {
    return EXPERIMENT_PROCEDURES[slugOrId];
  }
  for (const proc of Object.values(EXPERIMENT_PROCEDURES)) {
    if (proc.experimentId === slugOrId || proc.slug === slugOrId) {
      return proc;
    }
  }
  return undefined;
}
