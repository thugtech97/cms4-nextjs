"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FlatItem } from "./types";
import { INDENT } from "./treeUtils";

export default function SortableItem({ item }: { item: FlatItem }) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginLeft: item.depth * INDENT,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-2">
      <div
        className="border rounded bg-light p-2 d-flex justify-content-between align-items-center"
        {...attributes}
        {...listeners}
      >
        <strong>{item.label}</strong>
        <span style={{ cursor: "grab" }}>☰</span>
      </div>
    </div>
  );
}
