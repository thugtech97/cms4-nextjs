// pages/dashboard/albums.tsx
import { useEffect, useState } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";
import DataTable, { Column } from "@/components/UI/DataTable";
import SearchBar from "@/components/UI/SearchBar";
import { getAlbums, AlbumRow } from "@/services/albumService";
import { useRouter } from "next/router";
import PageSizeSelector from "@/components/UI/PageSizeSelector";

function ManageAlbums() {
  const router = useRouter();

  const [albums, setAlbums] = useState<AlbumRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);

  /* ======================
   * Fetch Albums
   * ====================== */
  const fetchAlbums = async () => {
    try {
      setLoading(true);

      const res = await getAlbums({
        search,
        page: currentPage,
        per_page: perPage,
      });

      setAlbums(res.data.data);
      setTotalPages(res.data.meta.last_page);
    } catch (err) {
      console.error("Failed to load albums", err);
    } finally {
      setLoading(false);
    }
  };

  /* ======================
   * Effects
   * ====================== */
  useEffect(() => {
    const timeout = setTimeout(fetchAlbums, 400);
    return () => clearTimeout(timeout);
  }, [search, currentPage, perPage]);

  /* ======================
   * Columns
   * ====================== */
  const columns: Column<AlbumRow>[] = [
    {
      key: "select",
      header: <input type="checkbox" />,
      render: () => <input type="checkbox" />,
    },
    {
      key: "name",
      header: "Album Name",
      render: (row) => (
        <span className="fw-bold text-primary">{row.name}</span>
      ),
    },
    {
      key: "total_images",
      header: "Total Images",
    },
    {
      key: "updated_at",
      header: "Date Updated",
    },
    {
      key: "options",
      header: "Options",
      render: (row) => (
        <>
          <button
            className="btn btn-link p-0 me-2 text-secondary"
            title="Edit"
            onClick={() => router.push(`/banners/edit/${row.id}`)}
          >
            <i className="fas fa-edit" />
          </button>

          <button className="btn btn-link p-0 text-secondary" title="Settings">
            <i className="fas fa-cogs" />
          </button>
        </>
      ),
    },
  ];

  /* ======================
   * UI
   * ====================== */
  return (
    <div className="container">
      <h3 className="mb-3">Manage Albums</h3>

      <SearchBar
        placeholder="Search by Album"
        value={search}
        onChange={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
      />

      {/* Page size selector */}
      <PageSizeSelector
        value={perPage}
        onChange={(value) => {
          setPerPage(value);
          setCurrentPage(1);
        }}
      />

      <DataTable<AlbumRow>
        columns={columns}
        data={albums}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

ManageAlbums.Layout = AdminLayout;
export default ManageAlbums;
