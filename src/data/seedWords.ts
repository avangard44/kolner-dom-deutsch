import { VocabWord } from "@/types/vocab";
import { WORDS_PART_1 } from "./words-part1";
import { WORDS_PART_2 } from "./words-part2";
import { WORDS_PART_3 } from "./words-part3";
import { WORDS_EXTRA } from "./words-extra";

export const SEED_WORDS: VocabWord[] = [
  // A1 - Ev & Yaşam / Temel İsimler, Fiiller, Sıfatlar (18 words)
  {
    id: "w-01",
    german: "der Tisch",
    plural: "die Tische",
    turkish: "Masa",
    level: "A1",
    partOfSpeech: "isim",
    theme: "Ev & Yaşam",
    wikiSearchTerm: "Table_(furniture)",
    emoji: "🪑",
    examples: [
      {
        de: "Das Buch liegt auf dem Tisch.",
        tr: "Kitap masanın üzerinde duruyor.",
      },
      {
        de: "Wir sitzen zusammen am Tisch.",
        tr: "Birlikte masada oturuyoruz.",
      },
    ],
  },
  {
    id: "w-02",
    german: "die Tür",
    plural: "die Türen",
    turkish: "Kapı",
    level: "A1",
    partOfSpeech: "isim",
    theme: "Ev & Yaşam",
    wikiSearchTerm: "Door",
    emoji: "🚪",
    examples: [
      {
        de: "Mach bitte die Tür zu!",
        tr: "Lütfen kapıyı kapat!",
      },
      {
        de: "Jemand klopft an die Tür.",
        tr: "Birisi kapıyı çalıyor.",
      },
    ],
  },
  {
    id: "w-03",
    german: "das Fenster",
    plural: "die Fenster",
    turkish: "Pencere",
    level: "A1",
    partOfSpeech: "isim",
    theme: "Ev & Yaşam",
    wikiSearchTerm: "Window",
    emoji: "🪟",
    examples: [
      {
        de: "Kannst du bitte das Fenster öffnen?",
        tr: "Lütfen pencereyi açabilir misin?",
      },
      {
        de: "Sie schaut aus dem Fenster.",
        tr: "Pencereden dışarı bakıyor.",
      },
    ],
  },
  {
    id: "w-04",
    german: "der Schlüssel",
    plural: "die Schlüssel",
    turkish: "Anahtar",
    level: "A1",
    partOfSpeech: "isim",
    theme: "Ev & Yaşam",
    wikiSearchTerm: "Key_(lock)",
    emoji: "🔑",
    examples: [
      {
        de: "Ich habe meinen Schlüssel verloren.",
        tr: "Anahtarımı kaybettim.",
      },
      {
        de: "Wo ist der Schlüssel für das Haus?",
        tr: "Evin anahtarı nerede?",
      },
    ],
  },
  {
    id: "w-05",
    german: "die Küche",
    plural: "die Küchen",
    turkish: "Mutfak",
    level: "A1",
    partOfSpeech: "isim",
    theme: "Ev & Yaşam",
    wikiSearchTerm: "Kitchen",
    emoji: "🍳",
    examples: [
      {
        de: "Meine Mutter kocht in der Küche.",
        tr: "Annem mutfakta yemek pişiriyor.",
      },
      {
        de: "Die Küche ist sehr hell und groß.",
        tr: "Mutfak çok aydınlık ve büyük.",
      },
    ],
  },
  {
    id: "w-06",
    german: "das Wasser",
    plural: "die Wässer",
    turkish: "Su",
    level: "A1",
    partOfSpeech: "isim",
    theme: "Yeme & İçme",
    wikiSearchTerm: "Drinking_water",
    emoji: "💧",
    examples: [
      {
        de: "Ich trinke jeden Tag zwei Liter Wasser.",
        tr: "Her gün iki litre su içerim.",
      },
      {
        de: "Ein Glas Wasser mit Zitrone, bitte.",
        tr: "Bir bardak limonlu su lütfen.",
      },
    ],
  },
  {
    id: "w-07",
    german: "der Apfel",
    plural: "die Äpfel",
    turkish: "Elma",
    level: "A1",
    partOfSpeech: "isim",
    theme: "Yeme & İçme",
    wikiSearchTerm: "Apple",
    emoji: "🍎",
    examples: [
      {
        de: "Der rote Apfel schmeckt sehr süß.",
        tr: "Kırmızı elmanın tadı çok tatlı.",
      },
      {
        de: "Ich esse morgens gerne einen Apfel.",
        tr: "Sabahları severek bir elma yerim.",
      },
    ],
  },
  {
    id: "w-08",
    german: "das Brot",
    plural: "die Brote",
    turkish: "Ekmek",
    level: "A1",
    partOfSpeech: "isim",
    theme: "Yeme & İçme",
    wikiSearchTerm: "Bread",
    emoji: "🍞",
    examples: [
      {
        de: "In Deutschland gibt es viele Sorten Brot.",
        tr: "Almanya'da çok çeşit ekmek vardır.",
      },
      {
        de: "Ich kaufe frisches Brot beim Bäcker.",
        tr: "Fırından taze ekmek alıyorum.",
      },
    ],
  },
  {
    id: "w-09",
    german: "der Kaffee",
    plural: "die Kaffees",
    turkish: "Kahve",
    level: "A1",
    partOfSpeech: "isim",
    theme: "Yeme & İçme",
    wikiSearchTerm: "Coffee",
    emoji: "☕",
    examples: [
      {
        de: "Trinkst du deinen Kaffee mit Milch?",
        tr: "Kahveni sütlü mü içersin?",
      },
      {
        de: "Der Kaffee ist noch sehr heiß.",
        tr: "Kahve hâlâ çok sıcak.",
      },
    ],
  },
  {
    id: "w-10",
    german: "die Zeitung",
    plural: "die Zeitungen",
    turkish: "Gazete",
    level: "A1",
    partOfSpeech: "isim",
    theme: "Günlük Yaşam",
    wikiSearchTerm: "Newspaper",
    emoji: "📰",
    examples: [
      {
        de: "Mein Großvater liest jeden Morgen die Zeitung.",
        tr: "Dedem her sabah gazete okur.",
      },
      {
        de: "Steht heute etwas Interessantes in der Zeitung?",
        tr: "Bugün gazetede ilginç bir şey yazıyor mu?",
      },
    ],
  },
  {
    id: "w-11",
    german: "das Auto",
    plural: "die Autos",
    turkish: "Araba / Otomobil",
    level: "A1",
    partOfSpeech: "isim",
    theme: "Ulaşım & Seyahat",
    wikiSearchTerm: "Car",
    emoji: "🚗",
    examples: [
      {
        de: "Wir fahren mit dem Auto nach Berlin.",
        tr: "Arabayla Berlin'e gidiyoruz.",
      },
      {
        de: "Mein Auto steht vor dem Haus.",
        tr: "Arabam evin önünde duruyor.",
      },
    ],
  },
  {
    id: "w-12",
    german: "der Bahnhof",
    plural: "die Bahnhöfe",
    turkish: "Tren İstasyonu / Gar",
    level: "A1",
    partOfSpeech: "isim",
    theme: "Ulaşım & Seyahat",
    wikiSearchTerm: "Train_station",
    emoji: "🚉",
    examples: [
      {
        de: "Entschuldigung, wie komme ich zum Bahnhof?",
        tr: "Affedersiniz, tren istasyonuna nasıl gidebilirim?",
      },
      {
        de: "Der Zug kommt pünktlich am Bahnhof an.",
        tr: "Tren tam zamanında istasyona varıyor.",
      },
    ],
  },
  {
    id: "w-13",
    german: "die Straße",
    plural: "die Straßen",
    turkish: "Cadde / Sokak",
    level: "A1",
    partOfSpeech: "isim",
    theme: "Ulaşım & Seyahat",
    wikiSearchTerm: "Street",
    emoji: "🛣️",
    examples: [
      {
        de: "In welcher Straße wohnst du?",
        tr: "Hangi sokakta oturuyorsun?",
      },
      {
        de: "Die Straße ist wegen Bauarbeiten gesperrt.",
        tr: "Cadde inşaat çalışmaları nedeniyle kapalı.",
      },
    ],
  },
  {
    id: "w-14",
    german: "das Buch",
    plural: "die Bücher",
    turkish: "Kitap",
    level: "A1",
    partOfSpeech: "isim",
    theme: "İş & Eğitim",
    wikiSearchTerm: "Book",
    emoji: "📖",
    examples: [
      {
        de: "Ich lese gerade ein spannendes Buch.",
        tr: "Şu sıralar heyecan verici bir kitap okuyorum.",
      },
      {
        de: "Dieses Buch gehört meiner Schwester.",
        tr: "Bu kitap kız kardeşime ait.",
      },
    ],
  },
  {
    id: "w-15",
    german: "sprechen",
    turkish: "Konuşmak",
    level: "A1",
    partOfSpeech: "fiil",
    theme: "Günlük Fiiller",
    wikiSearchTerm: "Speech",
    emoji: "🗣️",
    examples: [
      {
        de: "Sprichst du Deutsch oder Englisch?",
        tr: "Almanca mı yoksa İngilizce mi konuşuyorsun?",
      },
      {
        de: "Können Sie bitte etwas langsamer sprechen?",
        tr: "Lütfen biraz daha yavaş konuşabilir misiniz?",
      },
    ],
  },
  {
    id: "w-16",
    german: "lernen",
    turkish: "Öğrenmek / Ders Çalışmak",
    level: "A1",
    partOfSpeech: "fiil",
    theme: "Günlük Fiiller",
    wikiSearchTerm: "Learning",
    emoji: "🎓",
    examples: [
      {
        de: "Ich lerne jeden Tag zwanzig neue Wörter.",
        tr: "Her gün yirmi yeni kelime öğreniyorum.",
      },
      {
        de: "Wir lernen zusammen für die Prüfung.",
        tr: "Sınav için birlikte ders çalışıyoruz.",
      },
    ],
  },
  {
    id: "w-17",
    german: "kaufen",
    turkish: "Satın Almak",
    level: "A1",
    partOfSpeech: "fiil",
    theme: "Günlük Fiiller",
    wikiSearchTerm: "Shopping",
    emoji: "🛍️",
    examples: [
      {
        de: "Was möchtest du im Supermarkt kaufen?",
        tr: "Süpermarketten ne satın almak istiyorsun?",
      },
      {
        de: "Er kauft sich einen neuen Mantel.",
        tr: "Kendisine yeni bir palto satın alıyor.",
      },
    ],
  },
  {
    id: "w-18",
    german: "schön",
    turkish: "Güzel / Hoş",
    level: "A1",
    partOfSpeech: "sıfat",
    theme: "Duygular & Nitelikler",
    wikiSearchTerm: "Beauty",
    emoji: "✨",
    examples: [
      {
        de: "Heute ist das Wetter wirklich schön.",
        tr: "Bugün hava gerçekten güzel.",
      },
      {
        de: "Vielen Dank für das schöne Geschenk!",
        tr: "Güzel hediye için çok teşekkürler!",
      },
    ],
  },

  // A2 - Günlük Yaşam, Seyahat, sağlık, fiiller (16 words)
  {
    id: "w-19",
    german: "der Flughafen",
    plural: "die Flughäfen",
    turkish: "Havalimanı",
    level: "A2",
    partOfSpeech: "isim",
    theme: "Ulaşım & Seyahat",
    wikiSearchTerm: "Airport",
    emoji: "✈️",
    examples: [
      {
        de: "Wir müssen zwei Stunden vor dem Abflug am Flughafen sein.",
        tr: "Uçuştan iki saat önce havalimanında olmalıyız.",
      },
      {
        de: "Der Flughafen Frankfurt ist sehr groß.",
        tr: "Frankfurt Havalimanı çok büyüktür.",
      },
    ],
  },
  {
    id: "w-20",
    german: "die Rechnung",
    plural: "die Rechnungen",
    turkish: "Hesap / Fatura",
    level: "A2",
    partOfSpeech: "isim",
    theme: "Yeme & İçme",
    wikiSearchTerm: "Invoice",
    emoji: "🧾",
    examples: [
      {
        de: "Herr Ober, die Rechnung bitte!",
        tr: "Garson bey, hesap lütfen!",
      },
      {
        de: "Ich muss noch die Stromrechnung bezahlen.",
        tr: "Henüz elektrik faturasını ödemem gerekiyor.",
      },
    ],
  },
  {
    id: "w-21",
    german: "das Krankenhaus",
    plural: "die Krankenhäuser",
    turkish: "Hastane",
    level: "A2",
    partOfSpeech: "isim",
    theme: "Sağlık & Yaşam",
    wikiSearchTerm: "Hospital",
    emoji: "🏥",
    examples: [
      {
        de: "Mein Onkel arbeitet als Arzt im Krankenhaus.",
        tr: "Amcam hastanede doktor olarak çalışıyor.",
      },
      {
        de: "Nach dem Unfall wurde er ins Krankenhaus gebracht.",
        tr: "Kazadan sonra hastaneye kaldırıldı.",
      },
    ],
  },
  {
    id: "w-22",
    german: "der Kühlschrank",
    plural: "die Kühlschränke",
    turkish: "Buzdolabı",
    level: "A2",
    partOfSpeech: "isim",
    theme: "Ev & Yaşam",
    wikiSearchTerm: "Refrigerator",
    emoji: "🧊",
    examples: [
      {
        de: "Die Milch steht im Kühlschrank.",
        tr: "Süt buzdolabında duruyor.",
      },
      {
        de: "Unser Kühlschrank ist fast leer, wir müssen einkaufen.",
        tr: "Buzdolabımız neredeyse boş, alışveriş yapmalıyız.",
      },
    ],
  },
  {
    id: "w-23",
    german: "die Brücke",
    plural: "die Brücken",
    turkish: "Köprü",
    level: "A2",
    partOfSpeech: "isim",
    theme: "Ulaşım & Seyahat",
    wikiSearchTerm: "Bridge",
    emoji: "🌉",
    examples: [
      {
        de: "Gehen Sie über die Brücke und dann nach links.",
        tr: "Köprüden geçin ve sonra sola dönün.",
      },
      {
        de: "Diese alte Brücke verbindet die beiden Stadtteile.",
        tr: "Bu eski köprü iki semti birbirine bağlıyor.",
      },
    ],
  },
  {
    id: "w-24",
    german: "das Fahrrad",
    plural: "die Fahrräder",
    turkish: "Bisiklet",
    level: "A2",
    partOfSpeech: "isim",
    theme: "Ulaşım & Seyahat",
    wikiSearchTerm: "Bicycle",
    emoji: "🚲",
    examples: [
      {
        de: "Bei gutem Wetter fahre ich mit dem Fahrrad zur Arbeit.",
        tr: "İyi havalarda işe bisikletle giderim.",
      },
      {
        de: "Mein Fahrrad hat einen platten Reifen.",
        tr: "Bisikletimin lastiği patlak.",
      },
    ],
  },
  {
    id: "w-25",
    german: "der Regenschirm",
    plural: "die Regenschirme",
    turkish: "Şemsiye",
    level: "A2",
    partOfSpeech: "isim",
    theme: "Günlük Yaşam",
    wikiSearchTerm: "Umbrella",
    emoji: "☂️",
    examples: [
      {
        de: "Vergiss deinen Regenschirm nicht, es wird heute regnen!",
        tr: "Şemsiyeni unutma, bugün yağmur yağacak!",
      },
      {
        de: "Ich habe meinen Regenschirm im Bus liegen lassen.",
        tr: "Şemsiyemi otobüste unuttum.",
      },
    ],
  },
  {
    id: "w-26",
    german: "die Bibliothek",
    plural: "die Bibliotheken",
    turkish: "Kütüphane",
    level: "A2",
    partOfSpeech: "isim",
    theme: "İş & Eğitim",
    wikiSearchTerm: "Library",
    emoji: "📚",
    examples: [
      {
        de: "In der Bibliothek muss man leise sein.",
        tr: "Kütüphanede sessiz olunmalıdır.",
      },
      {
        de: "Ich leihe mir regelmäßig Bücher aus der Bibliothek aus.",
        tr: "Kütüphaneden düzenli olarak kitap ödünç alırım.",
      },
    ],
  },
  {
    id: "w-27",
    german: "das Geschenk",
    plural: "die Geschenke",
    turkish: "Hediye / Armağan",
    level: "A2",
    partOfSpeech: "isim",
    theme: "Günlük Yaşam",
    wikiSearchTerm: "Gift",
    emoji: "🎁",
    examples: [
      {
        de: "Ich suche ein passendes Geschenk für meinen besten Freund.",
        tr: "En yakın arkadaşım için uygun bir hediye arıyorum.",
      },
      {
        de: "Die Kinder freuen sich sehr über die Geschenke.",
        tr: "Çocuklar hediyelere çok seviniyor.",
      },
    ],
  },
  {
    id: "w-28",
    german: "der Spiegel",
    plural: "die Spiegel",
    turkish: "Ayna",
    level: "A2",
    partOfSpeech: "isim",
    theme: "Ev & Yaşam",
    wikiSearchTerm: "Mirror",
    emoji: "🪞",
    examples: [
      {
        de: "Im Badezimmer hängt ein großer Spiegel.",
        tr: "Banyoda büyük bir ayna asılı.",
      },
      {
        de: "Er schaut morgens müde in den Spiegel.",
        tr: "Sabahları yorgun bir şekilde aynaya bakıyor.",
      },
    ],
  },
  {
    id: "w-29",
    german: "die Insel",
    plural: "die Inseln",
    turkish: "Ada",
    level: "A2",
    partOfSpeech: "isim",
    theme: "Ulaşım & Seyahat",
    wikiSearchTerm: "Island",
    emoji: "🏝️",
    examples: [
      {
        de: "Wir verbringen unseren Sommerurlaub auf einer kleinen Insel.",
        tr: "Yaz tatilimizi küçük bir adada geçiriyoruz.",
      },
      {
        de: "Die Insel ist nur mit dem Schiff erreichbar.",
        tr: "Adaya sadece gemiyle ulaşılabiliyor.",
      },
    ],
  },
  {
    id: "w-30",
    german: "das Gewitter",
    plural: "die Gewitter",
    turkish: "Fırtına / Gök Gürültülü Yağış",
    level: "A2",
    partOfSpeech: "isim",
    theme: "Doğa & Hava",
    wikiSearchTerm: "Thunderstorm",
    emoji: "⛈️",
    examples: [
      {
        de: "Heute Abend zieht ein starkes Gewitter auf.",
        tr: "Bu akşam şiddetli bir fırtına yaklaşıyor.",
      },
      {
        de: "Bei einem Gewitter sollte man nicht unter Bäumen stehen.",
        tr: "Fırtına sırasında ağaçların altında durulmamalıdır.",
      },
    ],
  },
  {
    id: "w-31",
    german: "erklären",
    turkish: "Açıklamak / İzah Etmek",
    level: "A2",
    partOfSpeech: "fiil",
    theme: "Günlük Fiiller",
    wikiSearchTerm: "Explanation",
    emoji: "💡",
    examples: [
      {
        de: "Die Lehrerin erklärt die Grammatik sehr verständlich.",
        tr: "Öğretmen dilbilgisini çok anlaşılır bir şekilde açıklıyor.",
      },
      {
        de: "Kannst du mir bitte den Weg erklären?",
        tr: "Bana yolu tarif edebilir (açıklayabilir) misin?",
      },
    ],
  },
  {
    id: "w-32",
    german: "vergessen",
    turkish: "Unutmak",
    level: "A2",
    partOfSpeech: "fiil",
    theme: "Günlük Fiiller",
    wikiSearchTerm: "Forgetting",
    emoji: "🧠",
    examples: [
      {
        de: "Ich habe leider seinen Namen vergessen.",
        tr: "Maalesef onun adını unuttum.",
      },
      {
        de: "Vergiss nicht, mir heute Abend anzurufen!",
        tr: "Bu akşam beni aramayı unutma!",
      },
    ],
  },
  {
    id: "w-33",
    german: "wichtig",
    turkish: "Önemli / Mühim",
    level: "A2",
    partOfSpeech: "sıfat",
    theme: "Duygular & Nitelikler",
    wikiSearchTerm: "Priority",
    emoji: "⭐",
    examples: [
      {
        de: "Gesundheit ist das Wichtigste im Leben.",
        tr: "Sağlık hayattaki en önemli şeydir.",
      },
      {
        de: "Morgen habe ich einen sehr wichtigen Termin.",
        tr: "Yarın çok önemli bir randevum var.",
      },
    ],
  },
  {
    id: "w-34",
    german: "pünktlich",
    turkish: "Dakik / Tam Zamanında",
    level: "A2",
    partOfSpeech: "sıfat",
    theme: "Duygular & Nitelikler",
    wikiSearchTerm: "Clock",
    emoji: "⏰",
    examples: [
      {
        de: "Bitte seien Sie morgen um acht Uhr pünktlich da.",
        tr: "Lütfen yarın saat sekizde tam zamanında orada olun.",
      },
      {
        de: "Die Straßenbahn fährt heute leider nicht pünktlich.",
        tr: "Tramvay bugün maalesef zamanında gelmiyor.",
      },
    ],
  },

  // B1 - İş, Eğitim, Toplum, Soyut Kavramlar (14 words)
  {
    id: "w-35",
    german: "die Entscheidung",
    plural: "die Entscheidungen",
    turkish: "Karar",
    level: "B1",
    partOfSpeech: "isim",
    theme: "İş & Eğitim",
    wikiSearchTerm: "Decision-making",
    emoji: "⚖️",
    examples: [
      {
        de: "Das war keine leichte Entscheidung für uns.",
        tr: "Bu bizim için kolay bir karar değildi.",
      },
      {
        de: "Du musst bald eine endgültige Entscheidung treffen.",
        tr: "Yakında kesin bir karar vermelisin.",
      },
    ],
  },
  {
    id: "w-36",
    german: "der Erfolg",
    plural: "die Erfolge",
    turkish: "Başarı",
    level: "B1",
    partOfSpeech: "isim",
    theme: "İş & Eğitim",
    wikiSearchTerm: "Trophy",
    emoji: "🏆",
    examples: [
      {
        de: "Wir wünschen Ihnen viel Erfolg bei der neuen Arbeit!",
        tr: "Yeni işinizde size bol başarılar dileriz!",
      },
      {
        de: "Geduld und Fleiß führen oft zum Erfolg.",
        tr: "Sabır ve çalışkanlık çoğu zaman başarıya götürür.",
      },
    ],
  },
  {
    id: "w-37",
    german: "das Ziel",
    plural: "die Ziele",
    turkish: "Hedef / Amaç",
    level: "B1",
    partOfSpeech: "isim",
    theme: "İş & Eğitim",
    wikiSearchTerm: "Archery",
    emoji: "🎯",
    examples: [
      {
        de: "Mein großes Ziel ist es, fließend Deutsch zu sprechen.",
        tr: "Büyük hedefim akıcı bir şekilde Almanca konuşmak.",
      },
      {
        de: "Nach vier Stunden Wanderung haben wir unser Ziel erreicht.",
        tr: "Dört saatlik yürüyüşten sonra hedefimize ulaştık.",
      },
    ],
  },
  {
    id: "w-38",
    german: "die Erfahrung",
    plural: "die Erfahrungen",
    turkish: "Deneyim / Tecrübe",
    level: "B1",
    partOfSpeech: "isim",
    theme: "İş & Eğitim",
    wikiSearchTerm: "Skill",
    emoji: "🧭",
    examples: [
      {
        de: "Für diese Stelle braucht man mindestens drei Jahre Erfahrung.",
        tr: "Bu pozisyon için en az üç yıl deneyim gerekiyor.",
      },
      {
        de: "Das Auslandssemester war eine wunderbare Erfahrung.",
        tr: "Yurt dışı dönemi harika bir deneyimdi.",
      },
    ],
  },
  {
    id: "w-39",
    german: "der Vertrag",
    plural: "die Verträge",
    turkish: "Sözleşme / Kontrat",
    level: "B1",
    partOfSpeech: "isim",
    theme: "İş & Eğitim",
    wikiSearchTerm: "Contract",
    emoji: "📝",
    examples: [
      {
        de: "Lesen Sie den Vertrag sorgfältig durch, bevor Sie unterschreiben.",
        tr: "İmzalamadan önce sözleşmeyi dikkatlice okuyun.",
      },
      {
        de: "Beide Parteien haben den Mietvertrag gestern unterzeichnet.",
        tr: "Her iki taraf da dün kira sözleşmesini imzaladı.",
      },
    ],
  },
  {
    id: "w-40",
    german: "die Umwelt",
    plural: "die Umwelten",
    turkish: "Çevre / Doğa",
    level: "B1",
    partOfSpeech: "isim",
    theme: "Doğa & Hava",
    wikiSearchTerm: "Natural_environment",
    emoji: "🌿",
    examples: [
      {
        de: "Wir müssen mehr tun, um die Umwelt zu schützen.",
        tr: "Çevreyi korumak için daha fazlasını yapmalıyız.",
      },
      {
        de: "Plastikmüll schadet der Umwelt enorm.",
        tr: "Plastik atıklar çevreye muazzam zarar veriyor.",
      },
    ],
  },
  {
    id: "w-41",
    german: "das Gedächtnis",
    plural: "die Gedächtnisse",
    turkish: "Hafıza / Bellek",
    level: "B1",
    partOfSpeech: "isim",
    theme: "Sağlık & Yaşam",
    wikiSearchTerm: "Human_brain",
    emoji: "🧩",
    examples: [
      {
        de: "Sie hat ein ausgezeichnetes Gedächtnis für Zahlen.",
        tr: "Sayılar konusunda mükemmel bir hafızası var.",
      },
      {
        de: "Mit Karteikarten kann man sein Gedächtnis gut trainieren.",
        tr: "Bilgi kartlarıyla insan hafızasını iyi eğitebilir.",
      },
    ],
  },
  {
    id: "w-42",
    german: "der Vorschlag",
    plural: "die Vorschläge",
    turkish: "Öneri / Teklif",
    level: "B1",
    partOfSpeech: "isim",
    theme: "İş & Eğitim",
    wikiSearchTerm: "Light_bulb",
    emoji: "💬",
    examples: [
      {
        de: "Das ist ein sehr guter Vorschlag, machen wir das so!",
        tr: "Bu çok iyi bir öneri, böyle yapalım!",
      },
      {
        de: "Hat noch jemand einen anderen Vorschlag für das Projekt?",
        tr: "Proje için başka bir önerisi olan var mı?",
      },
    ],
  },
  {
    id: "w-43",
    german: "die Gelegenheit",
    plural: "die Gelegenheiten",
    turkish: "Fırsat / Vesile",
    level: "B1",
    partOfSpeech: "isim",
    theme: "Günlük Yaşam",
    wikiSearchTerm: "Sunrise",
    emoji: "🌅",
    examples: [
      {
        de: "Nutzen Sie diese einmalige Gelegenheit!",
        tr: "Bu eşsiz fırsatı değerlendirin!",
      },
      {
        de: "Bei dieser Gelegenheit möchte ich mich herzlich bedanken.",
        tr: "Bu vesileyle içtenlikle teşekkür etmek isterim.",
      },
    ],
  },
  {
    id: "w-44",
    german: "das Verhalten",
    turkish: "Davranış / Tutum",
    level: "B1",
    partOfSpeech: "isim",
    theme: "Duygular & Nitelikler",
    wikiSearchTerm: "Human_behavior",
    emoji: "🤝",
    examples: [
      {
        de: "Sein Verhalten in der Besprechung war sehr professionell.",
        tr: "Toplantıdaki davranışı çok profesyoneldi.",
      },
      {
        de: "Ich kann ihr seltsames Verhalten nicht verstehen.",
        tr: "Onun tuhaf davranışını anlayamıyorum.",
      },
    ],
  },
  {
    id: "w-45",
    german: "vergleichen",
    turkish: "Karşılaştırmak / Kıyaslamak",
    level: "B1",
    partOfSpeech: "fiil",
    theme: "Günlük Fiiller",
    wikiSearchTerm: "Weighing_scale",
    emoji: "🔍",
    examples: [
      {
        de: "Vor dem Kauf sollte man die Preise im Internet vergleichen.",
        tr: "Satın almadan önce internetteki fiyatları karşılaştırmak gerekir.",
      },
      {
        de: "Man kann diese beiden Städte kaum miteinander vergleichen.",
        tr: "İnsan bu iki şehri birbiriyle neredeyse hiç kıyaslayamaz.",
      },
    ],
  },
  {
    id: "w-46",
    german: "entwickeln",
    turkish: "Geliştirmek",
    level: "B1",
    partOfSpeech: "fiil",
    theme: "İş & Eğitim",
    wikiSearchTerm: "Software_development",
    emoji: "🚀",
    examples: [
      {
        de: "Unser Team entwickelt eine neue App zum Sprachenlernen.",
        tr: "Ekibimiz dil öğrenmek için yeni bir uygulama geliştiriyor.",
      },
      {
        de: "Die Stadt hat sich in den letzten Jahren stark entwickelt.",
        tr: "Şehir son yıllarda büyük ölçüde gelişti.",
      },
    ],
  },
  {
    id: "w-47",
    german: "notwendig",
    turkish: "Gerekli / Zorunlu",
    level: "B1",
    partOfSpeech: "sıfat",
    theme: "Duygular & Nitelikler",
    wikiSearchTerm: "Checklist",
    emoji: "📌",
    examples: [
      {
        de: "Für die Reise ist ein gültiger Reisepass notwendig.",
        tr: "Seyahat için geçerli bir pasaport gereklidir.",
      },
      {
        de: "Wir haben alle notwendigen Informationen gesammelt.",
        tr: "Tüm gerekli bilgileri topladık.",
      },
    ],
  },
  {
    id: "w-48",
    german: "zufrieden",
    turkish: "Memnun / Hoşnut",
    level: "B1",
    partOfSpeech: "sıfat",
    theme: "Duygular & Nitelikler",
    wikiSearchTerm: "Smile",
    emoji: "😊",
    examples: [
      {
        de: "Sind Sie mit Ihrem neuen Arbeitsplatz zufrieden?",
        tr: "Yeni iş yerinizden memnun musunuz?",
      },
      {
        de: "Die Kunden waren mit dem Service äußerst zufrieden.",
        tr: "Müşteriler hizmetten son derece memnundu.",
      },
    ],
  },

  // B2 - İleri Düzey Akademik, İş, Bilim ve Analitik Kelimeler (12 words)
  {
    id: "w-49",
    german: "die Verantwortung",
    plural: "die Verantwortungen",
    turkish: "Sorumluluk / Mesuliyet",
    level: "B2",
    partOfSpeech: "isim",
    theme: "İş & Eğitim",
    wikiSearchTerm: "Leadership",
    emoji: "🛡️",
    examples: [
      {
        de: "Als Projektleiter trägt er eine große Verantwortung.",
        tr: "Proje yöneticisi olarak büyük bir sorumluluk taşıyor.",
      },
      {
        de: "Wer übernimmt die Verantwortung für diesen Fehler?",
        tr: "Bu hatanın sorumluluğunu kim üstleniyor?",
      },
    ],
  },
  {
    id: "w-50",
    german: "der Zusammenhang",
    plural: "die Zusammenhänge",
    turkish: "Bağlam / İlişki / Bağlantı",
    level: "B2",
    partOfSpeech: "isim",
    theme: "İş & Eğitim",
    wikiSearchTerm: "Network_topology",
    emoji: "🔗",
    examples: [
      {
        de: "Man muss das Wort immer im Zusammenhang lernen.",
        tr: "Kelimeyi her zaman bağlam içinde öğrenmek gerekir.",
      },
      {
        de: "Es besteht ein klarer Zusammenhang zwischen Bewegung und Gesundheit.",
        tr: "Hareket ve sağlık arasında açık bir bağlantı vardır.",
      },
    ],
  },
  {
    id: "w-51",
    german: "das Bewusstsein",
    turkish: "Bilinç / Farkındalık",
    level: "B2",
    partOfSpeech: "isim",
    theme: "Sağlık & Yaşam",
    wikiSearchTerm: "Consciousness",
    emoji: "👁️",
    examples: [
      {
        de: "Das Bewusstsein für gesunde Ernährung wächst ständig.",
        tr: "Sağlıklı beslenme konusundaki farkındalık sürekli artıyor.",
      },
      {
        de: "Der Patient hat kurzzeitig das Bewusstsein verloren.",
        tr: "Hasta kısa süreliğine bilincini kaybetti.",
      },
    ],
  },
  {
    id: "w-52",
    german: "die Voraussetzung",
    plural: "die Voraussetzungen",
    turkish: "Ön Koşul / Şart",
    level: "B2",
    partOfSpeech: "isim",
    theme: "İş & Eğitim",
    wikiSearchTerm: "Padlock",
    emoji: "🗝️",
    examples: [
      {
        de: "Gute Sprachkenntnisse sind eine wichtige Voraussetzung für das Studium.",
        tr: "İyi dil bilgisi üniversite eğitimi için önemli bir ön koşuldur.",
      },
      {
        de: "Unter diesen Voraussetzungen können wir dem Plan zustimmen.",
        tr: "Bu şartlar altında planı onaylayabiliriz.",
      },
    ],
  },
  {
    id: "w-53",
    german: "der Fortschritt",
    plural: "die Fortschritte",
    turkish: "İlerleme / Gelişme",
    level: "B2",
    partOfSpeech: "isim",
    theme: "İş & Eğitim",
    wikiSearchTerm: "Space_exploration",
    emoji: "📈",
    examples: [
      {
        de: "Du hast beim Deutschlernen schon große Fortschritte gemacht.",
        tr: "Almanca öğrenirken şimdiden büyük ilerlemeler kaydettin.",
      },
      {
        de: "Der technologische Fortschritt verändert unseren Alltag rasant.",
        tr: "Teknolojik gelişme günlük hayatımızı hızla değiştiriyor.",
      },
    ],
  },
  {
    id: "w-54",
    german: "das Ergebnis",
    plural: "die Ergebnisse",
    turkish: "Sonuç / Netice",
    level: "B2",
    partOfSpeech: "isim",
    theme: "İş & Eğitim",
    wikiSearchTerm: "Data_analysis",
    emoji: "📊",
    examples: [
      {
        de: "Die Ergebnisse der Studie wurden gestern veröffentlicht.",
        tr: "Araştırmanın sonuçları dün yayımlandı.",
      },
      {
        de: "Nach langen Verhandlungen kamen wir zu einem positiven Ergebnis.",
        tr: "Uzun müzakerelerden sonra olumlu bir sonuca vardık.",
      },
    ],
  },
  {
    id: "w-55",
    german: "die Wissenschaft",
    plural: "die Wissenschaften",
    turkish: "Bilim",
    level: "B2",
    partOfSpeech: "isim",
    theme: "İş & Eğitim",
    wikiSearchTerm: "Microscope",
    emoji: "🔬",
    examples: [
      {
        de: "Die moderne Wissenschaft sucht nach Lösungen für den Klimawandel.",
        tr: "Modern bilim iklim değişikliği için çözümler arıyor.",
      },
      {
        de: "Sie interessiert sich sehr für Naturwissenschaften.",
        tr: "Doğa bilimlerine çok ilgi duyuyor.",
      },
    ],
  },
  {
    id: "w-56",
    german: "der Einfluss",
    plural: "die Einflüsse",
    turkish: "Etki / Nüfuz",
    level: "B2",
    partOfSpeech: "isim",
    theme: "Duygular & Nitelikler",
    wikiSearchTerm: "Domino_effect",
    emoji: "🌊",
    examples: [
      {
        de: "Das Wetter hat einen großen Einfluss auf unsere Stimmung.",
        tr: "Havanın ruh halimiz üzerinde büyük bir etkisi vardır.",
      },
      {
        de: "Er hat viel Einfluss in diesem Unternehmen.",
        tr: "Bu şirkette çok fazla etkisi (nüfuzu) var.",
      },
    ],
  },
  {
    id: "w-57",
    german: "überzeugen",
    turkish: "İkna Etmek",
    level: "B2",
    partOfSpeech: "fiil",
    theme: "Günlük Fiiller",
    wikiSearchTerm: "Debate",
    emoji: "🎙️",
    examples: [
      {
        de: "Seine Argumente haben mich vollkommen überzeugt.",
        tr: "Argümanları beni tamamen ikna etti.",
      },
      {
        de: "Es war schwierig, die Investoren von der Idee zu überzeugen.",
        tr: "Yatırımcıları bu fikre ikna etmek zordu.",
      },
    ],
  },
  {
    id: "w-58",
    german: "berücksichtigen",
    turkish: "Göz Önünde Bulundurmak / Dikkate Almak",
    level: "B2",
    partOfSpeech: "fiil",
    theme: "İş & Eğitim",
    wikiSearchTerm: "Compass",
    emoji: "📐",
    examples: [
      {
        de: "Wir müssen bei der Planung alle Kosten berücksichtigen.",
        tr: "Planlama yaparken tüm maliyetleri göz önünde bulundurmalıyız.",
      },
      {
        de: "Ihre Wünsche wurden bei der Entscheidung berücksichtigt.",
        tr: "Karar alınırken istekleriniz dikkate alındı.",
      },
    ],
  },
  {
    id: "w-59",
    german: "nachhaltig",
    turkish: "Sürdürülebilir / Kalıcı",
    level: "B2",
    partOfSpeech: "sıfat",
    theme: "Doğa & Hava",
    wikiSearchTerm: "Wind_turbine",
    emoji: "♻️",
    examples: [
      {
        de: "Immer mehr Firmen setzen auf nachhaltige Energiequellen.",
        tr: "Giderek daha fazla şirket sürdürülebilir enerji kaynaklarına yöneliyor.",
      },
      {
        de: "Regelmäßiges Wiederholen sorgt für einen nachhaltigen Lernerfolg.",
        tr: "Düzenli tekrar kalıcı bir öğrenme başarısı sağlar.",
      },
    ],
  },
  {
    id: "w-60",
    german: "ausführlich",
    turkish: "Ayrıntılı / Detaylı / Kapsamlı",
    level: "B2",
    partOfSpeech: "sıfat",
    theme: "Duygular & Nitelikler",
    wikiSearchTerm: "Magnifying_glass",
    emoji: "📑",
    examples: [
      {
        de: "Vielen Dank für Ihre ausführliche Antwort.",
        tr: "Ayrıntılı cevabınız için çok teşekkür ederim.",
      },
      {
        de: "Wir haben das Thema gestern ausführlich besprochen.",
        tr: "Konuyu dün detaylı bir şekilde ele aldık.",
      },
    ],
  },
  ...WORDS_PART_1,
  ...WORDS_PART_2,
  ...WORDS_PART_3,
  ...WORDS_EXTRA,
];
