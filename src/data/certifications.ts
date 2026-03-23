export interface Certification {
  name: string;
  issuer: string;
  date: string;
}

export const certificationsData: Certification[] = [
  {
    name: "Microsoft Certified: Azure Developer Associate",
    issuer: "Microsoft",
    date: "Mar 2025",
  },
  {
    name: "Microsoft Certified: Azure Fundamentals",
    issuer: "Microsoft",
    date: "Sep 2024",
  },
];
