import Link from "next/link";

export default function MenuItem({
  item,
  currentPath,
}: {
  item: any;
  currentPath: string;
}) {
  const href = `/public/${item.slug}`;

  const isCurrent =
    currentPath === href ||
    currentPath.startsWith(href + "/");

  return (
    <li className={`menu-item ${isCurrent ? "current" : ""}`}>
      <Link href={href} className="menu-link">
        <div>{item.title}</div>
      </Link>

      {item.children?.length > 0 && (
        <ul className="sub-menu-container">
          {item.children.map((child: any) => (
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
