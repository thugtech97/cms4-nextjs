import AdminLayout from "@/components/Layout/AdminLayout";
import { useState } from "react";
import TinyEditor from "@/components/UI/Editor";

export default function CreatePage() {
  const [visibility, setVisibility] = useState(true); // Public by default

  return (
    <div className="container">
      <h3 className="mb-4">Create a Page</h3>
      
      <div className="card mb-4">
        <div className="card-header fw-bold">Page Details</div>
        <div className="card-body">

          <div className="mb-3">
            <label htmlFor="pageTitle" className="form-label">Page Title</label>
            <input type="text" className="form-control" id="pageTitle" />
          </div>

          <div className="mb-3">
            <label htmlFor="pageLabel" className="form-label">Page Label</label>
            <input type="text" className="form-control" id="pageLabel" />
          </div>

          <div className="mb-3">
            <label htmlFor="parentPage" className="form-label">Parent Page</label>
            <select id="parentPage" className="form-select">
              <option value="">-- Select Parent Page --</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="pageBanner" className="form-label">Page Banner</label>
            <select id="pageBanner" className="form-select">
              <option value="">-- Select Banner Type --</option>
              <option value="slider">Slider</option>
              <option value="image">Image</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="pageContent" className="form-label">Page Content</label>
            <TinyEditor initialValue='<h1 style="color: #0056b3; border-bottom: 2px solid rgb(0, 86, 179); padding-bottom: 5px; font-family: Arial, sans-serif; text-align: center;"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdbk6PtQqqKgVprlkd1tzekP3ufz1tCW8q_w&amp;s" alt="" width="54" height="54"> About WebFocus Solutions, Inc.</h1>
<p style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333;"><strong>WebFocus Solutions, Inc.</strong> is a Philippines-based IT company founded in <strong>2001</strong>, headquartered in Pasig City, at the Antel Global Corporate Center, Ortigas Center.</p>
<h2 style="color: #007bff; font-family: Arial, sans-serif; margin-top: 20px;">Services &amp; Capabilities</h2>
<ul style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; padding-left: 20px;">
<li><strong>Web Design &amp; Development:</strong> Custom websites and web applications tailored to client needs.</li>
<li><strong>Web Hosting &amp; Domains:</strong> Domain registration, cloud hosting, dedicated servers, and managed hosting.</li>
<li><strong>Managed IT Services:</strong> Ongoing IT support and infrastructure management.</li>
<li><strong>E-Commerce Solutions:</strong> Custom online stores and e-commerce platforms.</li>
<li><strong>Document Management Systems:</strong> Secure storage and management of enterprise documents.</li>
</ul>
<h2 style="color: #007bff; font-family: Arial, sans-serif; margin-top: 20px;">Approach &amp; Values</h2>
<ul style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; padding-left: 20px;">
<li>Focus on <strong>custom solutions</strong> rather than one-size-fits-all templates.</li>
<li>Emphasis on <strong>security and reliability</strong> for client websites and applications.</li>
<li>Prioritizes <strong>customer support</strong> with 24/7 assistance for hosting and managed services.</li>
<li>Committed to <strong>innovation</strong> and up-to-date technology stacks.</li>
<li>Seeks <strong>return on investment (ROI)</strong> for clients through effective web solutions.</li>
</ul>
<h2 style="color: #007bff; font-family: Arial, sans-serif; margin-top: 20px;">Reputation &amp; Strengths</h2>
<ul style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; padding-left: 20px;">
<li>Over two decades of experience in IT services.</li>
<li>Serving over 1,600 clients, from SMEs to large enterprises.</li>
<li>Offers an all-in-one service: hosting, domains, web development, and e-commerce solutions.</li>
<li>Customizable solutions tailored to client requirements.</li>
<li>Local support with knowledge of Philippine business environment.</li>
</ul>
<h2 style="color: #007bff; font-family: Arial, sans-serif; margin-top: 20px;">Considerations</h2>
<ul style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; padding-left: 20px;">
<li>Shared hosting uptime may be slightly below industry average; no formal SLA for some plans.</li>
<li>Some employee reviews mention limited benefits and growth opportunities.</li>
<li>Enterprise-scale projects may require verifying infrastructure capabilities.</li>
</ul>
<h2 style="color: #007bff; font-family: Arial, sans-serif; margin-top: 20px;">Quick Facts</h2>
<table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
<tbody>
<tr>
<td style="border: 1px solid #ccc; padding: 8px;"><strong>Founded</strong></td>
<td style="border: 1px solid #ccc; padding: 8px;">2001</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 8px;"><strong>Headquarters</strong></td>
<td style="border: 1px solid #ccc; padding: 8px;">Pasig City, Philippines</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 8px;"><strong>Number of Clients</strong></td>
<td style="border: 1px solid #ccc; padding: 8px;">1,600+</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 8px;"><strong>Company Size</strong></td>
<td style="border: 1px solid #ccc; padding: 8px;">51&ndash;100 employees</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 8px;"><strong>Website</strong></td>
<td style="border: 1px solid #ccc; padding: 8px;"><a style="color: #007bff; text-decoration: none;" href="https://www.webfocus.ph" target="_blank" rel="noopener">webfocus.ph</a></td>
</tr>
</tbody>
</table>
<p style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333;">🎯 <strong>WebFocus Solutions</strong> is a trusted partner for SMEs and organizations seeking reliable, custom web solutions, IT services, and online business support in the Philippines.</p>' onChange={(content: any) => console.log(content)}/>

            {/* <textarea id="pageContent" rows={6} className="form-control"></textarea> */}
          </div>

          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="pageVisibility"
              checked={visibility}
              onChange={() => setVisibility(!visibility)}
            />
            <label className="form-check-label" htmlFor="pageVisibility">
              {visibility ? "Public" : "Private"}
            </label>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header fw-bold">Manage SEO</div>
        <div className="card-body">
          {/* SEO Title */}
          <div className="mb-3">
            <label htmlFor="seoTitle" className="form-label">SEO Title</label>
            <input type="text" className="form-control" id="seoTitle" />
          </div>

          <div className="mb-3">
            <label htmlFor="seoDescription" className="form-label">SEO Description</label>
            <textarea id="seoDescription" rows={4} className="form-control"></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="seoKeywords" className="form-label">SEO Keywords</label>
            <input type="text" className="form-control" id="seoKeywords" />
          </div>
        </div>
      </div>

      <div className="btn-group">
        <button className="btn btn-primary">Save Page</button>
        <button className="btn btn-outline-secondary">Cancel</button>
      </div>
    </div>
  );
}

CreatePage.Layout = AdminLayout;
