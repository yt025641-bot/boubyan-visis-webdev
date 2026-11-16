export type Watch = {
  id: string;
  name: string;
  image: string;
  features: string[];
};

export const WATCHES: Watch[] = [
  {
    id: "square-black",
    name: "ساعة ذكية مربعة — أسود",
    image: "/images/square-watch-black.jpg",
    features: [
      "تصميم مربع عصري",
      "شاشة لمس واضحة",
      "تتبع النشاط والنوم",
      "إشعارات المكالمات والتطبيقات",
    ],
  },
  {
    id: "square-blue",
    name: "ساعة ذكية مربعة — أزرق",
    image: "/images/square-watch-blue.jpg",
    features: ["سوار أزرق أنيق", "مقاومة الرذاذ والعرق", "عداد خطوات وسعرات", "مزامنة مع الهاتف"],
  },
  {
    id: "square-orange",
    name: "ساعة ذكية مربعة — برتقالي",
    image: "/images/square-watch-orange.jpg",
    features: ["لون رياضي مميز", "مراقبة نبض القلب", "أوضاع تمرين متعددة", "بطارية طويلة الأمد"],
  },
  {
    id: "square-pink",
    name: "ساعة ذكية مربعة — وردي",
    image: "/images/square-watch-pink.jpg",
    features: ["تصميم نسائي أنيق", "تتبع الدورة والصحة", "واجهة ملونة سهلة", "خفيفة الوزن على المعصم"],
  },
  {
    id: "round-gold",
    name: "ساعة ذكية دائرية — ذهبي",
    image: "/images/round-watch-gold.jpg",
    features: ["إطار ذهبي فاخر", "شاشة AMOLED ساطعة", "دفع من المعصم", "مكالمات Bluetooth"],
  },
  {
    id: "round-green",
    name: "ساعة ذكية دائرية — أخضر",
    image: "/images/round-watch-green.jpg",
    features: ["سوار رياضي مريح", "GPS مدمج للجري", "تحليل النوم", "تحكم بالموسيقى"],
  },
  {
    id: "round-red",
    name: "ساعة ذكية دائرية — أحمر",
    image: "/images/round-watch-red.jpg",
    features: ["لون جريء ومميز", "تنبيهات ذكية", "قياس الأكسجين في الدم", "مقاومة للماء"],
  },
  {
    id: "round-navy",
    name: "ساعة ذكية دائرية — كحلي",
    image: "/images/round-watch-navy.jpg",
    features: ["مظهر رسمي وعملي", "عرض الساعة دائم", "تقويم وتذكيرات", "بطارية موفرة للطاقة"],
  },
];
