export default function RecentActivity() {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">My Recent Activities</h4>
      </div>

      <ul className="list-group list-group-flush p-3">
        <li className="list-group-item rounded mb-2 border bg-light px-3 py-3">
          <div className="fw-semibold">Adminz</div>
          <div className="text-muted small">
            updated the settings copyright • 22 hours ago
          </div>
        </li>

        <li className="list-group-item rounded mb-2 border bg-light px-3 py-3">
          <div className="fw-semibold">Adminz</div>
          <div className="text-muted small">
            updated the page contents • Mar 14, 2025 3:15 PM
          </div>
        </li>

        <li className="list-group-item rounded mb-2 border bg-light px-3 py-3">
          <div className="fw-semibold">Adminz</div>
          <div className="text-muted small">
            deleted a page • Mar 14, 2025 3:12 PM
          </div>
        </li>

        <li className="list-group-item rounded mb-2 border bg-light px-3 py-3">
          <div className="fw-semibold">Adminz</div>
          <div className="text-muted small">
            updated the page contents • Mar 14, 2025 3:11 PM
          </div>
        </li>
      </ul>
    </div>
  );
}
