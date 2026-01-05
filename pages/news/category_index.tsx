"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";
import DataTable, { Column } from "@/components/UI/DataTable";
import SearchBar from "@/components/UI/SearchBar";
import PageSizeSelector from "@/components/UI/PageSizeSelector";
import { useRouter } from "next/router";
import {
  getArticleCategories,
  NewsCategoryRow,
} from "@/services/articleService";

function ManageNews() {
  const router = useRouter();

  const [categories, setCategories] = useState<NewsCategoryRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);

  /* ======================
   * Fetch Categories
   * ====================== */
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await getArticleCategories({
        search,
        page: currentPage,
        per_page: perPage,
      });

      setCategories(res.data);
      setTotalPages(res.last_page); // ✅ FIX
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  };

  /* ======================
   * Effects
   * ====================== */
  useEffect(() => {
    const timeout = setTimeout(fetchCategories, 400);
    return () => clearTimeout(timeout);
  }, [search, currentPage, perPage]);

  /* ======================
   * Columns
   * ====================== */
  const columns: Column<NewsCategoryRow>[] = [
    {
      key: "select",
      header: <input type="checkbox" />,
      render: () => <input type="checkbox" />,
    },
    {
      key: "name",
      header: "Category Name",
      render: (row) => (
        <span className="fw-bold text-primary">{row.name}</span>
      ),
    },
    {
      key: "slug",
      header: "URL",
      render: (row) => (
        <span className="text-muted small">
          /news/{row.slug}
        </span>
      ),
    },
    {
      key: "articles_count",
      header: "Total News",
      render: (row) => row.articles_count ?? 0,
    },
    {
      key: "options",
      header: "Options",
      render: (row) => (
        <>
          <button
            className="btn btn-link p-0 me-2 text-secondary"
            title="Edit"
            onClick={() =>
              router.push(`/news/edit_category/${row.id}`)
            }
          >
            <i className="fas fa-edit" />
          </button>

          <button
            className="btn btn-link p-0 text-danger"
            title="Delete"
          >
            <i className="fas fa-trash" />
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
      <h3 className="mb-3">Manage News Categories</h3>

      <SearchBar
        placeholder="Search by Category"
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

      <DataTable<NewsCategoryRow>
        columns={columns}
        data={categories}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

ManageNews.Layout = AdminLayout;
export default ManageNews;
