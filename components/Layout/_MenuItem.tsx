import { useState } from "react";
import Link from "next/link";
import { PublicMenuItem } from "@/services/publicPageService";

export default function MenuItem({
  item,
  currentPath,
}: {
  item: PublicMenuItem;
  currentPath: string;
}) {
  const [open, setOpen] = useState(false);

  const href = item.target;
  const isInternal = item.type === "page";
  const hasChildren = item.children && item.children.length > 0;

  const normalizePath = (url: string) => {
    try {
      return new URL(url).pathname;
    } catch {
      return url;
    }
  };

  const hrefPath = normalizePath(href);
  const isCurrent =
    isInternal &&
    (currentPath === hrefPath ||
      currentPath.startsWith(hrefPath + "/"));

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      //e.preventDefault(); // stop navigation
      setOpen((prev) => !prev);
    }
  };

  return (
    <li
      className={`menu-item ${isCurrent ? "current" : ""} ${
        open ? "open" : ""
      }`}
    >
      {isInternal ? (
        <Link href={href} className="menu-link" onClick={handleClick}>
          <span>{item.label}</span>
        </Link>
      ) : (
        <a
          href={href}
          className="menu-link"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
        >
          <span>{item.label}</span>
        </a>
      )}

      {hasChildren && (
        <ul className="sub-menu-container">
          {item.children!.map((child) => (
            <MenuItem
              key={child.id}
              item={child}
              currentPath={currentPath}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
