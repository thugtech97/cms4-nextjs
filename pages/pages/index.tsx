import AdminLayout from "@/components/Layout/AdminLayout";
import DataTable, { Column } from "@/components/UI/DataTable";
import SearchBar from "@/components/UI/SearchBar";
import { useEffect, useState } from "react";
import { getPages } from "@/services/pageService";
import { useRouter } from "next/router";
import PageSizeSelector from "@/components/UI/PageSizeSelector";

interface PageRow {
  id: number;
  title: string;
  url: string;
  label: string;
  visibility: string;
  lastModified: string;
}

export default function ManagePages() {
  const router = useRouter();
  const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL!;
  const [pages, setPages] = useState<PageRow[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const fetchPages = async () => {
    try {
      setLoading(true);

      const res = await getPages({
        search,
        page: currentPage,
        per_page: perPage,
      });

      setPages(res.data.data);
      setCurrentPage(res.data.meta.current_page);
      setTotalPages(res.data.meta.last_page);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentPage(1);
      fetchPages();
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    fetchPages();
  }, [currentPage, perPage]);

  const columns: Column<PageRow>[] = [
    {
      key: "select",
      header: <input type="checkbox" />,
      render: () => <input type="checkbox" />,
    },
    {
      key: "title",
      header: "Title",
      render: (row: any) => (
        <div>
          <a
            href={`/public/${row.slug}`}
            target="_blank"
            rel="noreferrer"
            className="text-primary fw-bold"
          >
            {row.label}
          </a>

          <div style={{ fontSize: "0.8rem", color: "#6c757d" }}>
            {FRONTEND_URL}/public/{row.slug}
          </div>
        </div>

      ),
    },
    { key: "label", header: "Label" },
    { key: "visibility", header: "Visibility" },
    { key: "lastModified", header: "Last Modified" },
    {
      key: "options",
      header: "Options",
      render: (row: any) => (
        <>
          {/* View */}
          <button
            className="btn btn-link p-0 me-2 text-secondary"
            onClick={() => window.open(`/public/${row.slug}`, "_blank")}
          >
            <i className="fas fa-eye"></i>
          </button>

          {/* Edit */}
          <button
            className="btn btn-link p-0 me-2 text-secondary"
            onClick={() => router.push(`/pages/edit/${row.id}`)}
          >
            <i className="fas fa-edit"></i>
          </button>

          {/* Settings (future) */}
          <button className="btn btn-link p-0 text-secondary">
            <i className="fas fa-cogs"></i>
          </button>
        </>
      ),
    },
  ];

  return (
    <div className="container">
      <h3 className="mb-3">Manage Pages</h3>

      <SearchBar
        placeholder="Search by Title"
        value={search}
        onChange={(value: string) => {
          setSearch(value);
          setCurrentPage(1);
        }}
      />
      
      <PageSizeSelector
        value={perPage}
        onChange={(value) => {
          setPerPage(value);
          setCurrentPage(1);
        }}
      />

      <DataTable<PageRow>
        columns={columns}
        data={pages}
        loading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />


    </div>
  );
}

ManagePages.Layout = AdminLayout;
