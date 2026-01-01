export type Page = {
  id: number;
  title: string;
};

export type MenuItem = {
  id: number;
  label: string;
  children: MenuItem[];
};

export type FlatItem = {
  id: number;
  label: string;
  depth: number;
  parentId: number | null;
};
