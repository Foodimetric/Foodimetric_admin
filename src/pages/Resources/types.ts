export type ResourceStatus = "published" | "draft";
export type ResourceCategory = "ARTICLES" | "COURSES";

export interface Resource {
  id: number;
  slug: string;
  date: string;
  image: string;
  category: ResourceCategory;
  title: string;
  description: string;
  author: string;
  likes: number;
  status: ResourceStatus;
  content: string;
}

export interface ResourceFormData {
  title: string;
  author: string;
  category: ResourceCategory;
  description: string;
  image: string;
  slug: string;
  content: string;
  status: ResourceStatus;
}
