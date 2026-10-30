// Site-wide settings. Edit these, not the components.

export const site = {
  name: "Ifeanyi Emmanuel Joseph",
  shortName: "Ifeanyi E. Joseph",
  alterEgo: "The Cipher",
  url: "https://ifeanyiemmanueljoseph.com",
  description:
    "An archive of becoming. Software engineer in Lagos, building products with founders and writing down what the work teaches.",

  location: {
    origin: "Ikwuano, Abia",
    now: "Lagos",
    next: "Argentina", // set to "" once you've moved, and update `now`
  },

  // Leave a link empty ("") and it is hidden everywhere.
  socials: {
    linkedin: "https://linkedin.com/in/ifeanyi-emmanuel",
    instagram: "",
    tiktok: "",
    x: "",
    github: "",
  },

  bookingUrl: "https://calendar.app.google/HURrFXc5dp8MhMMg6",

  // Kit (newsletter): paste the form "action" URL from Kit's HTML embed code
  // into NEXT_PUBLIC_KIT_FORM_ACTION in .env.local. Until then the footer
  // says letters start soon.
  kitFormAction: process.env.NEXT_PUBLIC_KIT_FORM_ACTION ?? "",
} as const;
