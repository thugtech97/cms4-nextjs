

export default function RecentActivity(){

    return(
        <div>
            <h4>My Recent Activities</h4>
          <ul className="list-group">
            <li
              className="list-group-item"
              style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #ddd',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '10px',
              }}
            >
              <strong>Adminz</strong> updated the settings copyright at 22 hours ago
            </li>
            <li
              className="list-group-item"
              style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #ddd',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '10px',
              }}
            >
              <strong>Adminz</strong> updated the page contents at Mar 14, 2025 3:15 PM
            </li>
            <li
              className="list-group-item"
              style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #ddd',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '10px',
              }}
            >
              <strong>Adminz</strong> deleted a page at Mar 14, 2025 3:12 PM
            </li>
            <li
              className="list-group-item"
              style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #ddd',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '10px',
              }}
            >
              <strong>Adminz</strong> updated the page contents at Mar 14, 2025 3:11 PM
            </li>
            {/* Add more activities here */}
          </ul>
        </div>
    )
}