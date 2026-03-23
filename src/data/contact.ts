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
  email: ContactLink;
  socialLinks: ContactSocialLink[];
  resumeLink: { label: string; href: string };
}

export const contactData: ContactData = {
  heading: "Get in Touch",
  description:
    "I'm always open to hearing about new opportunities, collaborations, or interesting engineering problems. Whether you're building something ambitious or just want to connect — reach out.",
  email: {
    label: "mattwilsonbusiness25@gmail.com",
    href: "mailto:mattwilsonbusiness25@gmail.com",
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
