import { useEffect, useState } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";
import DataTable, { Column } from "@/components/UI/DataTable";
import SearchBar from "@/components/UI/SearchBar";
import PageSizeSelector from "@/components/UI/PageSizeSelector";
import { getAuditTrails, AuditRow } from "@/services/auditService";

function AuditTrailsPage() {
  const [audits, setAudits] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);

  /* ======================
   * Fetch Audit Trails
   * ====================== */
  const fetchAudits = async () => {
    try {
      setLoading(true);

      const res = await getAuditTrails({
        search,
        page: currentPage,
        per_page: perPage,
      });

      setAudits(res.data.data);
      setTotalPages(res.data.last_page);
    } catch (err) {
      console.error("Failed to load audit trails", err);
    } finally {
      setLoading(false);
    }
  };

  /* ======================
   * Effects
   * ====================== */
  useEffect(() => {
    const timeout = setTimeout(fetchAudits, 400);
    return () => clearTimeout(timeout);
  }, [search, currentPage, perPage]);

  const renderValues = (values?: Record<string, any>) => {
    if (!values || Object.keys(values).length === 0) {
        return <span className="text-muted">—</span>;
    }

    return (
        <ul className="mb-0 ps-3">
        {Object.entries(values).map(([key, value]) => (
            <li key={key}>
            <strong>{key}</strong>:{" "}
            <span className="text-break">{String(value)}</span>
            </li>
        ))}
        </ul>
    );
};

  /* ======================
   * Columns
   * ====================== */
  const columns: Column<AuditRow>[] = [
    {
        key: "event",
        header: "Action",
        render: (row) => (
        <span className="badge bg-primary text-uppercase">
            {row.event}
        </span>
        ),
    },
    {
        key: "user",
        header: "Performed By",
        render: (row) =>
        row.user
            ? `${row.user.fname ?? ""} ${row.user.lname ?? ""}` ||
            row.user.email
            : "System",
    },
    {
        key: "auditable_type",
        header: "Model",
        render: (row) => row.auditable_type.split("\\").pop(),
    },
    {
        key: "auditable_id",
        header: "Record ID",
    },

    // 🔹 OLD VALUES
    {
        key: "old_values",
        header: "Old Value",
        render: (row) => renderValues(row.old_values),
    },

    // 🔹 NEW VALUES
    {
        key: "new_values",
        header: "New Value",
        render: (row) => renderValues(row.new_values),
    },

    {
        key: "created_at",
        header: "Date",
        render: (row) =>
        new Date(row.created_at).toLocaleString(),
    },
    {
        key: "ip_address",
        header: "IP Address",
    },
    ];

  /* ======================
   * UI
   * ====================== */
  return (
    <div className="container">
      <h3 className="mb-3">Audit Trail</h3>

      <SearchBar
        placeholder="Search audit logs"
        value={search}
        onChange={(value) => {
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

      <DataTable<AuditRow>
        columns={columns}
        data={audits}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

AuditTrailsPage.Layout = AdminLayout;
export default AuditTrailsPage;
