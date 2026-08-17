export interface ContactLink {
  label: string;
  href: string;
}

export interface ContactSocialLink {
  label: string;
  href: string;
  icon: "github" | "linkedin";
}

export interface ContactData {
  heading: string;
  description: string;
  booking: ContactLink;
  email: ContactLink;
  socialLinks: ContactSocialLink[];
  resumeLink: { label: string; href: string };
}

export const contactData: ContactData = {
  heading: "Let's Work Together",
  description:
    "Building something ambitious and need a partner who can design it, ship it, and run the infrastructure behind it? Book a call to talk it through, or reach out directly.",
  booking: {
    label: "Book a Call",
    href: "https://calendly.com/wilson-mjaw/discovery",
  },
  email: {
    label: "matt@mattwilson.tech",
    href: "mailto:matt@mattwilson.tech",
  },
  socialLinks: [
    {
      label: "GitHub",
      href: "https://github.com/mattwilson02",
      icon: "github",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/matt-wilson-16a671212/",
      icon: "linkedin",
    },
  ],
  resumeLink: {
    label: "Download Resume",
    href: "/matt-wilson-resume.pdf",
  },
};
