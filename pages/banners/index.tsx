// pages/dashboard/albums.tsx
import AdminLayout from "@/components/Layout/AdminLayout";
import DataTable, { Column } from "@/components/UI/DataTable";
import SearchBar from "@/components/UI/SeachBar";

interface AlbumRow {
  name: string;
  totalImages: number;
  dateUpdated: string;
}

const albums: AlbumRow[] = [
  {
    name: "Homepage Hero",
    totalImages: 4,
    dateUpdated: "Mar 14, 2025 3:10 PM",
  },
  {
    name: "Dental Benefits",
    totalImages: 3,
    dateUpdated: "Mar 10, 2025 11:02 AM",
  },
  {
    name: "Member Resources",
    totalImages: 5,
    dateUpdated: "Feb 22, 2025 4:31 PM",
  },
  {
    name: "Provider Network",
    totalImages: 2,
    dateUpdated: "Jan 15, 2025 9:17 AM",
  },
  {
    name: "About Us",
    totalImages: 3,
    dateUpdated: "Dec 2, 2024 2:05 PM",
  },
];

const columns: Column<AlbumRow>[] = [
  {
    key: "select",
    header: <input type="checkbox" aria-label="Select all rows" />,
    render: () => <input type="checkbox" aria-label="Select row" />,
  },
  {
    key: "name",
    header: "Album Name",
    render: (row) => (
      <div>
        <span className="fw-bold text-primary">{row.name}</span>
      </div>
    ),
  },
  {
    key: "totalImages",
    header: "Total images",
  },
  {
    key: "dateUpdated",
    header: "Date Updated",
    render: (row) => row.dateUpdated,
  },
  {
    key: "options",
    header: "Options",
    render: () => (
      <>
        <button className="btn btn-link p-0 me-2 text-secondary" title="View">
          <i className="fas fa-eye" />
        </button>
        <button className="btn btn-link p-0 me-2 text-secondary" title="Edit">
          <i className="fas fa-edit" />
        </button>
        <button className="btn btn-link p-0 text-secondary" title="Settings">
          <i className="fas fa-cogs" />
        </button>
      </>
    ),
  },
];

function ManageAlbums() {
  return (
    <div>
      <h3 className="mb-3">Manage Albums</h3>

      <SearchBar placeholder="Search by Album" />

      <DataTable<AlbumRow> columns={columns} data={albums} itemsPerPage={10} />
    </div>
  );
}

ManageAlbums.Layout = AdminLayout;

export default ManageAlbums;
