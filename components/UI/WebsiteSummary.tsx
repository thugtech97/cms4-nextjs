import { useState, ReactNode } from "react";

export default function WebsiteSummary() {
  return (
    <div>
        <h4>Website Summary</h4>
          <div className="list-group">
            <div className="list-group-item">
              <strong>Pages</strong>
              <p>41 Published Pages</p>
              <p>1 Private Page</p>
              <p>8 Deleted Pages</p>
            </div>
            <div className="list-group-item">
              <strong>Sub Banners</strong>
              <p>23 Albums</p>
              <p>0 Deleted Albums</p>
            </div>
            <div className="list-group-item">
              <strong>Users</strong>
              <p>2 Active Users</p>
              <p>0 Inactive Users</p>
            </div>
            <div className="list-group-item">
              <strong>News</strong>
              <p>5 Published News</p>
              <p>0 Private News</p>
              <p>1 Deleted News</p>
            </div>
          </div>
    </div>
  );
}
