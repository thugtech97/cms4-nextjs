import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";
import DataTable, { Column } from "@/components/UI/DataTable";
import SearchBar from "@/components/UI/SearchBar";
import {
  SalesTransaction,
  createSalesTransaction,
  deleteSalesTransaction,
  getSalesTransactions,
  updateSalesTransaction,
} from "@/services/salesTransactionService";
import { toast } from "@/lib/toast";

const emptyForm = {
  transaction_no: "",
  customer_name: "",
  customer_email: "",
  subtotal: 0,
  discount_total: 0,
  tax_total: 0,
  shipping_total: 0,
  payment_status: "pending",
  order_status: "pending",
  notes: "",
  transacted_at: "",
};

function ManageSalesTransactions() {
  const [transactions, setTransactions] = useState<SalesTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view" | null>(null);
  const [selected, setSelected] = useState<SalesTransaction | null>(null);
  const [form, setForm] = useState<any>(emptyForm);

  const fetchTransactions = async (opts?: { silent?: boolean }) => {
    try {
      if (!opts?.silent) setLoading(true);
      const res = await getSalesTransactions({ search, page: currentPage, per_page: perPage }, opts);
      setTransactions(Array.isArray(res?.data) ? res.data : []);
      setTotalPages(res?.last_page ?? 1);
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => fetchTransactions({ silent: true }), 350);
    return () => clearTimeout(timeout);
  }, [search, currentPage, perPage]);

  const openCreate = () => {
    setSelected(null);
    setForm({ ...emptyForm, transacted_at: new Date().toISOString().slice(0, 10) });
    setModalMode("create");
  };

  const openEdit = (transaction: SalesTransaction) => {
    setSelected(transaction);
    setForm({
      transaction_no: transaction.transaction_no ?? "",
      customer_name: transaction.customer_name ?? "",
      customer_email: transaction.customer_email ?? "",
      subtotal: transaction.subtotal ?? 0,
      discount_total: transaction.discount_total ?? 0,
      tax_total: transaction.tax_total ?? 0,
      shipping_total: transaction.shipping_total ?? 0,
      payment_status: transaction.payment_status ?? "pending",
      order_status: transaction.order_status ?? "pending",
      notes: transaction.notes ?? "",
      transacted_at: formatDateInput(transaction.transacted_at),
    });
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelected(null);
  };

  const submit = async () => {
    const payload = {
      ...form,
      transaction_no: form.transaction_no || null,
      subtotal: Number(form.subtotal || 0),
      discount_total: Number(form.discount_total || 0),
      tax_total: Number(form.tax_total || 0),
      shipping_total: Number(form.shipping_total || 0),
      transacted_at: form.transacted_at || null,
    };

    try {
      if (modalMode === "edit" && selected) {
        await updateSalesTransaction(selected.id, payload);
        toast.success("Sales transaction updated");
      } else {
        await createSalesTransaction(payload);
        toast.success("Sales transaction created");
      }
      closeModal();
      fetchTransactions();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save sales transaction");
    }
  };

  const remove = async (transaction: SalesTransaction) => {
    if (!confirm(`Delete transaction ${transaction.transaction_no}?`)) return;
    try {
      await deleteSalesTransaction(transaction.id);
      toast.success("Sales transaction deleted");
      fetchTransactions();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete sales transaction");
    }
  };

  const columns: Column<SalesTransaction>[] = [
    { key: "transaction_no", header: "Transaction No.", sortable: true, render: (row) => <span className="fw-bold">{row.transaction_no}</span> },
    { key: "customer_name", header: "Customer", sortable: true, render: (row) => row.customer_name || row.customer_email || "-" },
    { key: "grand_total", header: "Total", sortable: true, render: (row) => money(row.grand_total) },
    {
      key: "payment_status",
      header: "Payment",
      render: (row) => <span className={`badge ${row.payment_status === "paid" ? "bg-success" : "bg-secondary"}`}>{row.payment_status}</span>,
    },
    {
      key: "order_status",
      header: "Order",
      render: (row) => <span className="badge bg-info text-dark">{row.order_status}</span>,
    },
    { key: "transacted_at", header: "Date", render: (row) => formatDate(row.transacted_at) },
    {
      key: "options",
      header: "Options",
      render: (row) => (
        <>
          <button className="btn btn-link p-0 me-2 text-secondary" title="View" onClick={() => { setSelected(row); setModalMode("view"); }} type="button">
            <i className="fas fa-eye" />
          </button>
          <button className="btn btn-link p-0 me-2 text-secondary" title="Edit" onClick={() => openEdit(row)} type="button">
            <i className="fas fa-edit" />
          </button>
          <button className="btn btn-link p-0 text-danger" title="Delete" onClick={() => remove(row)} type="button">
            <i className="fas fa-trash" />
          </button>
        </>
      ),
    },
  ];

  return (
    <div className="container-fluid px-4 pt-3">
      <h3 className="mb-3">Sales Transactions</h3>

      <SearchBar
        placeholder="Search transactions"
        value={search}
        onChange={(v) => { setSearch(v); setCurrentPage(1); }}
        showFiltersButton={false}
        showActionsButton={false}
        rightExtras={(
          <button className="btn btn-primary" onClick={openCreate} type="button" style={{ height: 40, whiteSpace: "nowrap" }}>
            Create Transaction
          </button>
        )}
      />

      <DataTable<SalesTransaction>
        columns={columns}
        data={transactions}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={perPage}
        onItemsPerPageChange={(n) => { setPerPage(n); setCurrentPage(1); }}
      />

      {modalMode && (
        <TransactionModal
          mode={modalMode}
          transaction={selected}
          form={form}
          setForm={setForm}
          onClose={closeModal}
          onSubmit={submit}
        />
      )}
    </div>
  );
}

function TransactionModal({ mode, transaction, form, setForm, onClose, onSubmit }: any) {
  const readonly = mode === "view";
  const title = mode === "create" ? "Create Sales Transaction" : mode === "edit" ? "Edit Sales Transaction" : "View Sales Transaction";
  const display = transaction ?? form;
  const computedTotal = useMemo(() => {
    return Math.max(
      0,
      Number(form.subtotal || 0) - Number(form.discount_total || 0) + Number(form.tax_total || 0) + Number(form.shipping_total || 0)
    );
  }, [form.subtotal, form.discount_total, form.tax_total, form.shipping_total]);

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ background: "rgba(15,23,42,0.35)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            {readonly ? (
              <div className="row g-3">
                <ReadField label="Transaction No." value={display.transaction_no} />
                <ReadField label="Customer Name" value={display.customer_name} />
                <ReadField label="Customer Email" value={display.customer_email} />
                <ReadField label="Subtotal" value={money(display.subtotal)} />
                <ReadField label="Discount" value={money(display.discount_total)} />
                <ReadField label="Tax" value={money(display.tax_total)} />
                <ReadField label="Shipping" value={money(display.shipping_total)} />
                <ReadField label="Grand Total" value={money(display.grand_total)} />
                <ReadField label="Payment Status" value={display.payment_status} />
                <ReadField label="Order Status" value={display.order_status} />
                <ReadField label="Date" value={formatDate(display.transacted_at)} />
                <div className="col-12">
                  <label className="form-label">Notes</label>
                  <div className="form-control bg-light" style={{ minHeight: 80 }}>{display.notes || "-"}</div>
                </div>
              </div>
            ) : (
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Transaction No.</label>
                  <input className="form-control" placeholder="Auto-generated if blank" value={form.transaction_no} onChange={(e) => setForm({ ...form, transaction_no: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Date</label>
                  <input type="date" className="form-control" value={form.transacted_at} onChange={(e) => setForm({ ...form, transacted_at: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Customer Name</label>
                  <input className="form-control" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Customer Email</label>
                  <input type="email" className="form-control" value={form.customer_email} onChange={(e) => setForm({ ...form, customer_email: e.target.value })} />
                </div>
                <MoneyInput label="Subtotal" value={form.subtotal} onChange={(v: string) => setForm({ ...form, subtotal: v })} />
                <MoneyInput label="Discount" value={form.discount_total} onChange={(v: string) => setForm({ ...form, discount_total: v })} />
                <MoneyInput label="Tax" value={form.tax_total} onChange={(v: string) => setForm({ ...form, tax_total: v })} />
                <MoneyInput label="Shipping" value={form.shipping_total} onChange={(v: string) => setForm({ ...form, shipping_total: v })} />
                <div className="col-md-6">
                  <label className="form-label">Payment Status</label>
                  <select className="form-select" value={form.payment_status} onChange={(e) => setForm({ ...form, payment_status: e.target.value })}>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Order Status</label>
                  <select className="form-select" value={form.order_status} onChange={(e) => setForm({ ...form, order_status: e.target.value })}>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Grand Total</label>
                  <div className="form-control bg-light">{money(computedTotal)}</div>
                </div>
                <div className="col-12">
                  <label className="form-label">Notes</label>
                  <textarea className="form-control" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={onClose} type="button">Close</button>
            {!readonly && <button className="btn btn-primary" onClick={onSubmit} type="button">Save</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

function MoneyInput({ label, value, onChange }: { label: string; value: any; onChange: (value: string) => void }) {
  return (
    <div className="col-md-3">
      <label className="form-label">{label}</label>
      <input type="number" min="0" step="0.01" className="form-control" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function ReadField({ label, value }: { label: string; value: any }) {
  return (
    <div className="col-md-6">
      <label className="form-label">{label}</label>
      <div className="form-control bg-light">{value || "-"}</div>
    </div>
  );
}

const money = (value: any) => Number(value || 0).toLocaleString(undefined, { style: "currency", currency: "USD" });
const formatDate = (value?: string | null) => value ? new Date(value).toLocaleDateString() : "-";
const formatDateInput = (value?: string | null) => value ? String(value).slice(0, 10) : "";

ManageSalesTransactions.Layout = AdminLayout;
export default ManageSalesTransactions;
