// pages/dashboard/news.tsx
import AdminLayout from "@/components/Layout/AdminLayout";
import DataTable, { Column } from "@/components/UI/DataTable";
import SearchBar from "@/components/UI/SearchBar";

interface NewsCategoriesRow {
  name: string;
  url: string;
  total: string;
}

const newsData: NewsCategoriesRow[] = [
  {
    name: "HMO Card Release Advisory",
    url: "https://www.google.com.ph",
    total: "5",
  },
  {
    name: "Dental Mission - Cebu",
    url: "https://www.google.com.ph",
    total: "5",
  },
  {
    name: "System Maintenance Update",
    url: "https://www.google.com.ph",
    total: "5",
  },
  {
    name: "New Clinic Partners 2025",
    url: "https://www.google.com.ph",
    total: "5",
  },
];

const columns: Column<NewsCategoriesRow>[] = [
  {
    key: "select",
    header: <input type="checkbox" aria-label="Select all rows" />,
    render: () => <input type="checkbox" aria-label="Select row" />,
  },
  {
    key: "name",
    header: "Category Name",
    render: (row) => <span className="fw-bold text-primary">{row.name}</span>,
  },
  {
    key: "url",
    header: "URL",
    render: (row) => (
        <a href={row.url} target="_blank" rel="noopener noreferrer" className="text-muted small d-inline-block text-truncate">{row.url}</a>
    ),
  },
  {
    key: "total",
    header: "Total News",
  },
  {
    key: "options",
    header: "Options",
    render: () => (
      <>
        <button className="btn btn-link p-0 me-2 text-secondary" title="Edit">
          <i className="fas fa-edit" />
        </button>
        <button className="btn btn-link p-0 text-secondary" title="Delete">
          <i className="fas fa-trash" />
        </button>
      </>
    ),
  },
];

function ManageNews() {
  return (
    <div className="container">
      <h3 className="mb-3">Manage News Categories</h3>

      <SearchBar placeholder="Search by Name" />

      <DataTable<NewsCategoriesRow> columns={columns} data={newsData} itemsPerPage={10} />
    </div>
  );
}

ManageNews.Layout = AdminLayout;

export default ManageNews;
