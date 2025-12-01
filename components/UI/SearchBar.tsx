interface SearchBarProps {
  placeholder?: string;
}

export default function SearchBar({ placeholder = "Search..." }: SearchBarProps) {
  return (
    <div className="d-flex justify-content-between mb-3">
      <div>
        <button className="btn btn-outline-secondary me-2">Filters</button>
        <button className="btn btn-outline-secondary">Actions</button>
      </div>

      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        style={{ maxWidth: 260 }}
      />
    </div>
  );
}
