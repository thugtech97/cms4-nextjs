
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ConfirmModal from "@/components/UI/ConfirmModal";

type TopbarProps = {
  onToggleSidebar?: () => void;
  sidebarToggleRef?: React.Ref<HTMLButtonElement>;
};

export default function Topbar({ onToggleSidebar, sidebarToggleRef }: TopbarProps) {
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    router.push("/");
  };

  return (
    <>
      <nav className="navbar navbar-light bg-white shadow-sm px-4" style={{ height: '64px' }}>
        <div className="container-fluid w-100 flex-grow-1 d-flex justify-content-end align-items-center gap-2">
        <div className="dropdown">
          <button
            className="btn btn-dark rounded-circle text-white d-flex align-items-center justify-content-center"
            type="button"
            id="userDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ width: '40px', height: '40px', fontSize: '0.875rem', fontWeight: 'bold' }}
          >
            T
          </button>

          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
            <li>
              <Link href="/settings/account" className="dropdown-item">
                Account Settings
              </Link>
            </li>
            <li>
              <Link href="" className="dropdown-item">
                Help
              </Link>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button className="dropdown-item" onClick={() => setShowLogoutConfirm(true)}>
                Logout
              </button>
            </li>
          </ul>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary cms-topbar__sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          ref={sidebarToggleRef}
        >
          <i className="fa-solid fa-bars" />
        </button>
        </div>
      </nav>

      <ConfirmModal
        show={showLogoutConfirm}
        title="Logout"
        message={<div>Are you sure you want to log out?</div>}
        danger={false}
        confirmLabel="Yes, log out"
        cancelLabel="Cancel"
        confirmVariant="primary"
        accentVariant="primary"
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
