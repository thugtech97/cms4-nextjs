import { useEffect, useState } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";
import DataTable, { Column } from "@/components/UI/DataTable";
import SearchBar from "@/components/UI/SearchBar";
import PageSizeSelector from "@/components/UI/PageSizeSelector";
import { getUsers, UserRow } from "@/services/userService";
import { useRouter } from "next/router";

function ManageUsers() {
  const router = useRouter();

  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const fetchUsers = async () => {
  try {
    setLoading(true);

    const res = await getUsers({
      search,
      page: currentPage,
      per_page: perPage,
    });

    // ✅ MUST BE ARRAY
    setUsers(res.data.data);

    // ✅ pagination meta
    setTotalPages(res.meta.last_page);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const timeout = setTimeout(fetchUsers, 400);
    return () => clearTimeout(timeout);
  }, [search, currentPage, perPage]);

  const columns: Column<UserRow>[] = [
    {
      key: "select",
      header: <input type="checkbox" />,
      render: () => <input type="checkbox" />,
    },
    {
      key: "name",
      header: "Name",
      render: (row) => <span className="fw-bold">{row.name}</span>,
    },
    {
      key: "email",
      header: "Email",
      render: (row) => (
        <span style={{ fontFamily: "monospace" }}>{row.email}</span>
      ),
    },
    {
      key: "role",
      header: "Role",
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span className={`badge ${row.status === "Active" ? "bg-success" : "bg-secondary"}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: "options",
      header: "Options",
      render: (row) => (
        <button
          className="btn btn-link p-0 text-secondary"
          onClick={() => router.push(`/users/edit/${row.id}`)}
        >
          <i className="fas fa-edit" />
        </button>
      ),
    },
  ];

  return (
    <div className="container">
      <h3 className="mb-3">Manage Users</h3>

      <SearchBar
        placeholder="Search users"
        value={search}
        onChange={(v) => {
          setSearch(v);
          setCurrentPage(1);
        }}
      />

      <PageSizeSelector
        value={perPage}
        onChange={(v) => {
          setPerPage(v);
          setCurrentPage(1);
        }}
      />

      <DataTable<UserRow>
        columns={columns}
        data={users}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

ManageUsers.Layout = AdminLayout;
export default ManageUsers;
