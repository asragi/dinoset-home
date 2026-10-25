export const site = {
  name: "恐竜定食",
  tagline: "ボードゲーム制作サークル",
  description:
    "ボードゲーム制作サークル「恐竜定食」の公式サイト。最新作『クラッシュ・コンボ・カンフー！』ほか作品情報。",
  url: "https://kyoryuteishoku.ragi.house",
  sns: {
    x: "https://x.com/kyoryuteishoku",
    instagram: "https://www.instagram.com/kyoryuteishoku/",
  },
  emailjs: {
    serviceId: "service_tl2s4dr",
    templateId: "template_90fvelc",
    publicKey: "IHJjlIOiDwkmYdrTk", // 公開前提のキー
  },
  nav: [
    { href: "#works", label: "作品" },
    { href: "#members", label: "メンバー" },
    { href: "#contact", label: "お問い合わせ" },
  ],
} as const;
