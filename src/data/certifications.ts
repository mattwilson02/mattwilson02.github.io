export interface Certification {
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export const certificationsData: Certification[] = [
  {
    name: "Microsoft Certified: Azure Developer Associate",
    issuer: "Microsoft",
    date: "Mar 2025",
    link: "https://learn.microsoft.com/api/credentials/share/en-us/MattWilson-2787/8C0C35F61CF72BC1?sharingId=D6137FDC1D04120F",
  },
  {
    name: "Microsoft Certified: Azure Fundamentals",
    issuer: "Microsoft",
    date: "Sep 2024",
    link: "https://learn.microsoft.com/api/credentials/share/en-us/MattWilson-2787/A34295880A1E17D?sharingId=D6137FDC1D04120F",
  },
];
