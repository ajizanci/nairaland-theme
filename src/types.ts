export type Branch = string | HTMLElement;
export type Attributes = { [attr: string]: string };
export type Tree = [Branch, Attributes, Tree[]] |  [Branch, Tree[]] |  [Branch];
export interface ThreadMeta {
  link: string,
  title: string,
  author: string,
  timeOfPub: string,
};
export interface ThreadCategory {
  title: string;
  link: string;
  current?: "current" | "";
}
export interface ThreadLink {
  title: string;
  link: string;
}
export interface Page {
  page: number;
  link: string;
  current?: "current"
}
export interface CategoryGroup {
  heading: ThreadCategory;
  categories: ThreadCategory[]
}
export interface ThreadPost {
  author: string,
  timeOfPub: string,
  replyingTo: string,
  html: string;
  likes: number;
  shares: number;
  quotesOnPage?: number;
  attachmentImages: string[];
}