import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => {
      const isCurrentlyOpen = prev[key];
      
      return { [key]: !isCurrentlyOpen };
    });
  };

  const user = {
    name: "Thugtech97",
    role: "Admin",
    avatar: "https://avatars.githubusercontent.com/u/34189306?s=96&v=4"
  };

  const isActive = (href: string) => pathname === href;

  const menuItems = [
    {
      label: "🏠 Dashboard",
      href: "/dashboard",
    },
    {
      label: "📄 Pages",
      href: "/pages",
      children: [
        { label: "• Manage Pages", href: "/pages" },
        { label: "• Create a Page", href: "" }
      ]
    },
    { 
      label: "🖼️ Banners", 
      href: "/banners",
      children: [
        { label: "• Manage Home Banner", href: "/banners" },
        { label: "• Create Subpage Banners", href: "" },
        { label: "• Create an Album", href: ""}
      ] 
    },
    { label: "📁 Files", href: "/files" },
    { 
      label: "📌 Menu", 
      href: "/menu",
      children: [
        { label: "• Manage Menu", href: "/menu" },
        { label: "• Create a Menu", href: "" },
      ]
    },
    { 
      label: "📰 News", 
      href: "/news",
      children: [
        { label: "• Manage News", href: "/news" },
        { label: "• Create a News", href: "" },
        { label: "• Manage Categories", href: ""},
        { label: "• Create a Category", href: ""}
      ]
    },
    { 
      label: "⚙️ Settings", 
      href: "/settings",
      children: [
        { label: "• Account Settings", href: "/settings" },
        { label: "• Website Settings", href: "" },
        { label: "• Audit Trail", href: ""}
      ]
    },
    { 
      label: "👥 Users", 
      href: "/users",
      children: [
        { label: "• Manage Users", href: "/users" },
        { label: "• Create a User", href: "" },
      ]
    },
    { 
      label: "🔐 Account Management", 
      href: "/account-management",
      children: [
        { label: "• Roles", href: "/account-management" },
        { label: "• Access Rights", href: "" },
      ]
    }
  ];

  return (
    <aside
      className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white"
      style={{ width: "250px", height: "100vh", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}
    >
      <h1 className="fs-4 fw-bold mb-5">Admin Portal</h1>
      
      <div className="d-flex align-items-center mb-4">
        <img
          src={user.avatar}
          alt="Avatar"
          className="rounded-circle me-2"
          style={{ width: "40px", height: "40px", objectFit: "cover" }}
        />
        <div>
          <div className="fw-bold">{user.name}</div>
          <div className="text-white small">{user.role}</div>
        </div>
      </div>

      <div className="mb-4">
        <Link href="/" className="nav-link text-white p-0 text-decoration-none d-flex align-items-center">
          🌐 View Website
        </Link>
      </div>

      <div className="mb-3 text-uppercase text-white small fw-bold">
        CMS
      </div>

      <nav className="nav nav-pills flex-column mb-auto">
        {menuItems.map((item: any, index) => (
          <div key={index}>

            {"children" in item ? (
              <>
                <button
                  onClick={() => toggleMenu(item.href)}
                  className={`nav-link text-white mb-2 rounded w-100 text-start border-0 bg-transparent ${
                    pathname.startsWith(item.href) ? "active bg-primary" : ""
                  }`}
                >
                  {item.label}
                </button>

                {openMenus[item.href] && (
                  <div className="ms-3">
                    {item.children.map((child: any) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`nav-link text-white mb-1 ${
                          isActive(child.href) ? "active bg-primary" : ""
                        }`}
                        style={{ fontSize: "12px" }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (

              <Link
                href={item.href}
                className={`nav-link text-white mb-2 rounded ${
                  isActive(item.href) ? "active bg-primary text-white" : ""
                }`}
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="mt-auto text-white pt-3 small">
        © {new Date().getFullYear()}
      </div>
    </aside>
  );
}
