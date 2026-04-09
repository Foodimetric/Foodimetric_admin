import type { Resource } from "./types";

export const MOCK_ARTICLES: Resource[] = [
  {
    id: 1,
    slug: "why-knowing-better-doesnt-always-mean-eating-better",
    date: "01/04/2026",
    image:
      "https://res.cloudinary.com/dqf23mtna/image/upload/v1775044113/4_ulvybq.webp",
    category: "ARTICLES",
    title: "Why Knowing Better Doesn't Always Mean Eating Better",
    description:
      "An insightful exploration of why people with chronic conditions like diabetes struggle to follow dietary advice.",
    author: "Bukola Adeleye",
    likes: 12,
    status: "published",
    content: `<div><p><strong>Living with a chronic condition such as diabetes</strong> often comes with repeated dietary advice — eat less refined carbohydrates, reduce sugar, watch portions.</p><p>Food is deeply tied to culture, identity, comfort, and routine. For many individuals, staples like rice or pounded yam are not just meals — they represent familiarity and satisfaction.</p></div>`,
  },
  {
    id: 2,
    slug: "understanding-glycemic-index",
    date: "20/03/2026",
    image: "",
    category: "ARTICLES",
    title: "Understanding Glycemic Index for Better Blood Sugar Control",
    description:
      "A practical guide to using the glycemic index in everyday meal planning.",
    author: "Amaka Osei",
    likes: 8,
    status: "draft",
    content: `<div><p>The glycemic index (GI) is a ranking of carbohydrates based on their effect on blood glucose levels.</p></div>`,
  },
];

export const MOCK_COURSES: Resource[] = [
  {
    id: 1,
    slug: "diabetes-nutrition-basics",
    date: "15/03/2026",
    image: "",
    category: "COURSES",
    title: "Diabetes Nutrition Basics",
    description:
      "A beginner's guide to nutrition for people living with type 2 diabetes.",
    author: "Dr. Folake Bello",
    likes: 34,
    status: "published",
    content: `<div><p>This course covers the fundamentals of nutrition management for people with type 2 diabetes.</p></div>`,
  },
];
