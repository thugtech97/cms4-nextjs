import { FlatItem, MenuItem } from "./types";

export const INDENT = 30;

export const flattenTree = (
  items: MenuItem[],
  depth = 0,
  parentId: number | null = null
): FlatItem[] =>
  items.flatMap((item) => [
    { id: item.id, label: item.label, depth, parentId },
    ...flattenTree(item.children, depth + 1, item.id),
  ]);

export const buildTree = (flat: FlatItem[]): MenuItem[] => {
  const root: MenuItem[] = [];
  const map = new Map<number, MenuItem>();

  flat.forEach((i) =>
    map.set(i.id, { id: i.id, label: i.label, children: [] })
  );

  flat.forEach((i) => {
    const node = map.get(i.id)!;
    if (i.parentId === null) {
      root.push(node);
    } else {
      map.get(i.parentId)?.children.push(node);
    }
  });

  return root;
};
