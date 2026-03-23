export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  date?: string;
}

export const testimonialsData: Testimonial[] = [
  {
    quote: "Matt's rapid mastery of GraphQL, React, and Node.js was truly impressive. He fearlessly embraced any challenge that came his way and saw it through to completion. He consistently delivered top-quality code and demonstrated exceptional proficiency with the Unix terminal. What sets him apart is not just his technical prowess but also his positive attitude and dedicated work ethic.",
    name: "Maycon Douglas Santos",
    role: "Senior Software Engineer",
    company: "AAO Holdings",
    date: "2023",
  },
];
