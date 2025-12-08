import AdminLayout from '@/components/Layout/AdminLayout'
import FileManagerUI from '@/components/UI/FileManager'

export default function FileManagerPage() {
  return (
    <div>
      <h3 className="mb-3">File Manager</h3>
      <FileManagerUI/>
    </div>
  )
}

FileManagerPage.Layout = AdminLayout
