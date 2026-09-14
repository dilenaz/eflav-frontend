/** @type {import("next").MetadataRoute.Manifest} */
export default function manifest() {
  return {
    name: "Karabük Eflani Hayır Kervanı Vakfı",
    short_name: "Eflani Vakfı",
    description:
      "Karabük Eflani Hayır Kervanı Vakfı'nın faaliyet, sosyal yardım, bağış ve duyurularını içeren resmî kurumsal web sitesi.",

    start_url: "/",
    scope: "/",

    display: "standalone",
    orientation: "portrait-primary",

    background_color: "#f7f5ef",
    theme_color: "#0f513b",

    lang: "tr",
    dir: "ltr",

    categories: [
      "social",
      "education",
      "charity",
      "nonprofit",
    ],

    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
        purpose: "any",
      },
    ],

  };
}
