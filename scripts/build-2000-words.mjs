import fs from "node:fs";
import path from "node:path";
import { DICT_PART_1 } from "./dict-1.mjs";
import { DICT_PART_2 } from "./dict-2.mjs";
import { DICT_PART_3 } from "./dict-3.mjs";
import { DICT_PART_4 } from "./dict-4.mjs";
import { DICT_PART_5 } from "./dict-5.mjs";
import { DICT_PART_6 } from "./dict-6.mjs";

const DICT_PART_7 = [
  [
    "Doğa & Coğrafya",
    "🌍",
    "isim",
    [
      "der Kontinent;Kıta;Continent",
      "der Äquator;Ekvator;Equator",
      "der Nordpol;Kuzey Kutbu;North_Pole",
      "der Südpol;Güney Kutbu;South_Pole",
      "die Halbinsel;Yarımada;Peninsula",
      "die Bucht;Körfez / Koy;Bay",
      "die Klippe;Uçurum / Kayalık;Cliff",
      "der Gletscher;Buzul;Glacier",
      "der Wasserfall;Şelale;Waterfall",
      "die Quelle;Kaynak / Pınar;Spring_(hydrology)",
      "der Sumpf;Bataklık;Swamp",
      "die Steppe;Bozkır / Step;Steppe",
      "der Dschungel;Cangıl / Yağmur Ormanı;Jungle",
      "das Riff;Mercan Resifi;Coral_reef",
      "die Lawine;Çığ;Avalanche",
      "die Dürre;Kuraklık;Drought",
      "der Orkan;Kasırga;Tropical_cyclone",
      "die Brise;Esinti / Meltem;Wind",
      "der Tau;Çiy;Dew",
      "der Frost;Don / Ayaz;Frost",
      "der Regenbogen;Gökkuşağı;Rainbow",
      "die Sonnenfinsternis;Güneş Tutulması;Solar_eclipse",
      "der Komet;Kuyruklu Yıldız;Comet",
      "die Galaxie;Galaksi / Gökada;Galaxy",
      "das Teleskop;Teleskop;Telescope",
      "das Mikroskop;Mikroskop;Microscope",
      "der Magnet;Mıknatıs;Magnet",
      "die Antenne;Anten;Antenna_(radio)",
      "das Radar;Radar;Radar",
      "der Laser;Lazer;Laser",
      "der Roboter;Robot;Robot",
      "die Drohne;Dron / İHA;Unmanned_aerial_vehicle",
      "der Sensor;Sensör / Algılayıcı;Sensor",
      "der Chip;Çip / Yonga;Integrated_circuit",
      "die Festplatte;Sabit Disk;Hard_disk_drive",
      "der Lautsprecher;Hoparlör;Loudspeaker",
      "das Mikrofon;Mikrofon;Microphone",
      "der Taschenrechner;Hesap Makinesi;Calculator",
      "das Tagebuch;Günlük / Hatıra Defteri;Diary",
      "das Lexikon;Ansiklopedi / Sözlük;Encyclopedia",
      "der Atlas;Atlas;Atlas",
      "der Globus;Yerküre;Globe",
      "der Zirkel;Pergel;Compass_(drawing_tool)",
      "die Kreide;Tebeşir;Chalk",
      "der Pinsel;Fırça;Paintbrush",
      "die Leinwand;Tuval / Beyaz Perde;Canvas",
      "die Skulptur;Heykel;Sculpture",
      "die Statue;Anıt Heykel;Statue",
      "das Denkmal;Anıt / Abide;Monument",
      "der Brunnen;Çeşme / Kuyu;Fountain",
      "die Säule;Sütun / Kolon;Column",
      "die Kuppel;Kubbe;Dome",
      "der Bogen;Kemer / Yay;Arch",
      "die Fassade;Cephe (Bina);Facade",
      "das Fundament;Temel;Foundation_(engineering)",
      "der Ziegel;Tuğla / Kiremit;Brick",
      "der Beton;Beton;Concrete",
      "der Marmor;Mermer;Marble",
      "der Stahl;Çelik;Steel",
      "das Kupfer;Bakır;Copper",
      "die Bronze;Bronz / Tunç;Bronze",
      "das Aluminium;Alüminyum;Aluminium",
      "die Kohle;Kömür;Coal",
      "das Erdöl;Petrol;Petroleum",
      "das Erdgas;Doğalgaz;Natural_gas",
      "die Keramik;Seramik;Ceramic",
      "das Porzellan;Porselen;Porcelain",
      "der Kristall;Kristal;Crystal",
      "der Diamant;Elmas / Pırlanta;Diamond",
      "die Perle;İnci;Pearl",
      "der Bernstein;Kehribar;Amber",
      "das Leinen;Keten;Linen",
      "der Gummi;Kauçuk / Lastik;Natural_rubber",
      "der Karton;Karton / Kutu;Cardboard",
      "die Folie;Folyo / Film;Aluminium_foil",
      "der Schaum;Köpük;Foam",
      "der Tropfen;Damla;Drop_(liquid)",
      "der Funke;Kıvılcım;Spark_(fire)",
      "die Asche;Kül;Ash",
      "die Glut;Kor / Köz;Ember",
      "der Strahl;Işın / Şua;Ray_(optics)",
      "das Echo;Yankı / Eko;Echo",
      "der Rhythmus;Ritim;Rhythm",
      "die Melodie;Melodi / Ezgi;Melody",
      "die Harmonie;Uyum / Armoni;Harmony",
      "der Chor;Koro;Choir",
      "das Orchester;Orkestra;Orchestra",
      "das Ballett;Bale;Ballet",
      "der Zirkus;Sirk;Circus",
      "das Festival;Festival;Festival",
      "der Karneval;Karnaval;Carnival",
      "das Feuerwerk;Havai Fişek;Fireworks",
      "die Parade;Geçit Töreni;Parade",
      "die Messe;Fuar;Trade_fair",
      "der Kongress;Kongre;Congress",
      "das Seminar;Seminer;Seminar",
      "das Stipendium;Burs;Scholarship",
      "das Diplom;Diploma;Diploma",
      "das Zertifikat;Sertifika;Certification",
      "die Karriere;Kariyer;Career",
      "die Rente;Emekli Maaşı;Pension",
      "die Pension;Pansiyon;Boarding_house",
      "die Herberge;Konukevi / Hostel;Hostel",
      "der Campingplatz;Kamp Alanı;Campsite",
      "das Souvenir;Hediyelik Eşya;Souvenir",
      "die Postkarte;Kartpostal;Postcard",
      "die Briefmarke;Posta Pulu;Postage_stamp",
      "der Umschlag;Zarf;Envelope",
      "das Plakat;Afiş / Poster;Poster",
      "die Broschüre;Broşür;Brochure",
      "der Katalog;Katalog;Catalog",
      "das Formular;Form / Belge;Form_(document)",
      "die Unterschrift;İmza;Signature",
      "der Stempel;Damga / Kaşe;Rubber_stamp",
      "das Siegel;Mühür;Seal_(emblem)",
      "das Symbol;Sembol / Simge;Symbol",
      "das Logo;Logo / Amblem;Logo",
      "die Marke;Marka;Brand",
      "das Etikett;Etiket;Label",
      "das Muster;Desen / Model;Pattern",
      "das Modell;Model / Örnek;Model",
      "das Original;Orijinal / Asıl;Originality",
      "die Kopie;Kopya / Fotokopi;Photocopier",
      "der Entwurf;Taslak / Proje;Drafting",
      "die Skizze;Eskiz / Kroki;Sketch_(drawing)",
      "das Diagramm;Diyagram / Grafik;Chart",
      "die Tabelle;Tablo / Çizelge;Table_(information)",
      "die Statistik;İstatistik;Statistics",
      "die Quote;Oran / Kota;Quota",
      "der Durchschnitt;Ortalama;Average",
      "das Maximum;Maksimum / En Yüksek;Maxima_and_minima",
      "das Minimum;Minimum / En Düşük;Maxima_and_minima",
      "die Summe;Toplam / Meblağ;Summation",
      "der Rest;Kalan / Artık;Remainder",
      "das Detail;Detay / Ayrıntı;Magnifying_glass",
      "der Faktor;Faktör / Etken;Factor",
      "das Element;Element / Unsur;Chemical_element",
      "die Substanz;Madde / Öz;Chemical_substance",
      "die Struktur;Yapı / Bünye;Structure",
      "das System;Sistem / Düzen;System",
      "der Prozess;Süreç / Dava;Process",
      "die Methode;Yöntem / Metot;Scientific_method",
      "die Strategie;Strateji;Strategy",
      "die Taktik;Taktik;Tactic_(method)",
      "das Konzept;Konsept / Kavram;Concept",
      "die Theorie;Teori / Kuram;Theory",
      "die Praxis;Uygulama / Muayenehane;Medical_practice",
      "das Experiment;Deney;Experiment",
      "die Analyse;Analiz / Çözümleme;Analysis",
      "die Diagnose;Teşhis / Tanı;Medical_diagnosis",
      "das Symptom;Belirti / Semptom;Symptom",
      "die Epidemie;Salgın;Epidemic",
      "die Hygiene;Hijyen / Temizlik;Hygiene",
      "die Diät;Diyet / Perhiz;Diet_(nutrition)",
      "die Zutat;Malzeme (Yemek);Ingredient",
      "die Portion;Porsiyon;Serving_size",
      "der Appetit;İştah;Appetite",
      "der Geschmack;Tat / Lezzet;Taste",
      "das Aroma;Aroma / Koku;Aroma_compound",
    ],
  ],
];

function normalizeGerman(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/^(der|die|das)\s+/i, "")
    .replace(/^sich\s+/i, "")
    .trim();
}

function buildExamples(german, turkish, partOfSpeech, theme) {
  const mainTr = turkish.split("/")[0].trim();
  const cleanTr = mainTr.toLowerCase();

  if (partOfSpeech === "isim") {
    const match = german.match(/^(der|die|das)\s+(.+)$/i);
    const article = match ? match[1].toLowerCase() : "das";
    const noun = match ? match[2] : german;
    const capArticle = article.charAt(0).toUpperCase() + article.slice(1);
    const accArticle = article === "der" ? "den" : article;
    const accEin = article === "der" ? "einen" : article === "die" ? "eine" : "ein";

    if (theme.includes("Yeme") || theme.includes("İçme")) {
      return [
        {
          de: `${capArticle} ${noun} schmeckt heute besonders frisch und lecker.`,
          tr: `${mainTr} bugün özellikle taze ve lezzetli.`,
        },
        {
          de: `Wir kaufen auf dem Markt noch ${accEin} ${noun}.`,
          tr: `Pazardan bir de ${cleanTr} satın alıyoruz.`,
        },
      ];
    }

    if (theme.includes("Şehir") || theme.includes("Ulaşım") || theme.includes("Mekanlar")) {
      return [
        {
          de: `${capArticle} ${noun} ist in dieser Stadt sehr bekannt.`,
          tr: `${mainTr} bu şehirde oldukça tanınmıştır.`,
        },
        {
          de: `In Köln sieht man ${accArticle} ${noun} fast jeden Tag.`,
          tr: `Köln'de neredeyse her gün ${cleanTr} görülür.`,
        },
      ];
    }

    if (theme.includes("Ev") || theme.includes("Giysiler")) {
      return [
        {
          de: `${capArticle} ${noun} sieht wirklich modern und praktisch aus.`,
          tr: `${mainTr} gerçekten modern ve kullanışlı görünüyor.`,
        },
        {
          de: `Ich brauche für zu Hause noch ${accEin} ${noun}.`,
          tr: `Ev için bir ${cleanTr} daha gerekiyor.`,
        },
      ];
    }

    return [
      {
        de: `${capArticle} ${noun} spielt im Alltag eine wichtige Rolle.`,
        tr: `${mainTr} günlük yaşamda önemli bir rol oynar.`,
      },
      {
        de: `Auf Deutsch sagt man „${article} ${noun}“ für „${mainTr}“.`,
        tr: `Almancada "${mainTr}" için "${article} ${noun}" denir.`,
      },
    ];
  }

  if (partOfSpeech === "fiil") {
    const cleanVerb = german.replace(/^sich\s+/i, "");
    return [
      {
        de: `Wir wollen heute Nachmittag zusammen ${cleanVerb}.`,
        tr: `Bugün öğleden sonra birlikte ${cleanTr} istiyoruz.`,
      },
      {
        de: `Es ist im Alltag sehr wichtig, richtig zu ${cleanVerb}.`,
        tr: `Günlük hayatta doğru şekilde ${cleanTr} çok önemlidir.`,
      },
    ];
  }

  // sıfat
  return [
    {
      de: `Das Ergebnis ist für uns alle wirklich sehr ${german}.`,
      tr: `Sonuç hepimiz için gerçekten çok ${cleanTr}.`,
    },
    {
      de: `In dieser Situation sollte man immer ${german} bleiben.`,
      tr: `Bu durumda insan her zaman ${cleanTr} kalmalıdır.`,
    },
  ];
}

// 1. Read existing words from seedWords.ts and words-part1..3.ts so we never duplicate them
const dataDir = path.join(process.cwd(), "src", "data");
const existingFiles = [
  "seedWords.ts",
  "words-part1.ts",
  "words-part2.ts",
  "words-part3.ts",
];

const seenLemmas = new Set();
let existingCount = 0;

for (const file of existingFiles) {
  const filePath = path.join(dataDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf8");
    const matches = content.matchAll(/"?german"?\s*:\s*"([^"]+)"/g);
    for (const m of matches) {
      const lemma = normalizeGerman(m[1]);
      seenLemmas.add(lemma);
      existingCount++;
    }
  }
}

console.log(`Found ${existingCount} existing words (${seenLemmas.size} unique lemmas).`);

const allGroups = [
  ...DICT_PART_1,
  ...DICT_PART_2,
  ...DICT_PART_3,
  ...DICT_PART_4,
  ...DICT_PART_5,
  ...DICT_PART_6,
  ...DICT_PART_7,
];

const levels = ["A1", "A2", "B1", "B2"];
const extraWords = [];
let nextId = 311;

for (const group of allGroups) {
  const [themeName, defaultEmoji, partOfSpeech, entries] = group;
  const list = Array.isArray(entries)
    ? entries
    : typeof entries === "string"
    ? entries.split("|")
    : [];
  if (list.length === 0) continue;

  for (let i = 0; i < list.length; i++) {
    const rawEntry = list[i];
    if (typeof rawEntry !== "string") continue;

    const parts = rawEntry.split(";");
    const german = (parts[0] || "").trim();
    const turkish = (parts[1] || "").trim();
    const wikiSearchTerm = (parts[2] || "Germany").trim();

    if (!german || !turkish) continue;

    const lemma = normalizeGerman(german);
    if (seenLemmas.has(lemma)) continue;
    if (existingCount + extraWords.length >= 2000) break;
    seenLemmas.add(lemma);

    const level = levels[extraWords.length % levels.length];

    extraWords.push({
      id: `w-${nextId++}`,
      german,
      turkish,
      level,
      partOfSpeech: partOfSpeech || "isim",
      theme: themeName || "Günlük Yaşam",
      wikiSearchTerm,
      emoji: defaultEmoji || "🇩🇪",
      examples: buildExamples(
        german,
        turkish,
        partOfSpeech || "isim",
        themeName || "Günlük Yaşam"
      ),
    });
  }
}

console.log(`Generated ${extraWords.length} new unique words.`);
console.log(`Total catalog size: ${existingCount + extraWords.length} words.`);

// Write JSON dataset
const jsonPath = path.join(dataDir, "words-2000.json");
fs.writeFileSync(jsonPath, JSON.stringify(extraWords, null, 2), "utf8");

// Write TypeScript module importing words-2000.json
const tsPath = path.join(dataDir, "words-extra.ts");
const tsContent = `import { VocabWord } from "@/types/vocab";
import words2000 from "./words-2000.json";

export const WORDS_EXTRA: VocabWord[] = words2000 as VocabWord[];
`;
fs.writeFileSync(tsPath, tsContent, "utf8");
console.log("Saved src/data/words-2000.json and src/data/words-extra.ts");
