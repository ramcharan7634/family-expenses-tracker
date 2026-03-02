'use client'

import { useState } from 'react'
import { FileUpload } from '@/components/forms/file-upload'
import { Upload, Download, FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      throw new Error('Upload failed')
    }

    setIsUploading(false)
  }

  const downloadSample = () => {
    const headers = ['Date', 'J_E', 'J_X', 'S_E', 'S_X', 'C_E', 'C_X', 'Daily']
    const sampleData = [
      ['2024-01-01', 5000, 1500, 4000, 1200, 3500, 800, 200],
      ['2024-01-02', 0, 0, 0, 0, 0, 0, 150],
    ]
    
    const csvContent = [headers.join(','), ...sampleData.map(row => row.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample_template.csv'
    a.click()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Data</h1>
        <p className="text-muted-foreground mt-1">Import financial records from Excel or CSV files</p>
      </div>

      <div className="grid gap-6">
        {/* Upload Section */}
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Upload className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Upload File</h2>
              <p className="text-sm text-muted-foreground">Drag and drop or browse to upload</p>
            </div>
          </div>
          <FileUpload onUpload={handleUpload} isUploading={isUploading} />
        </div>

        {/* Format Instructions */}
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <FileSpreadsheet className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">File Format</h2>
              <p className="text-sm text-muted-foreground">Required columns for Excel/CSV files</p>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-2 text-left font-medium">Column</th>
                  <th className="pb-2 text-left font-medium">Description</th>
                  <th className="pb-2 text-left font-medium">Example</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-2 font-mono">Date</td>
                  <td className="py-2 text-muted-foreground">Record date</td>
                  <td className="py-2 font-mono">2024-01-01</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono">J_E</td>
                  <td className="py-2 text-muted-foreground">Jagan Earnings</td>
                  <td className="py-2 font-mono">5000</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono">J_X</td>
                  <td className="py-2 text-muted-foreground">Jagan Expenses</td>
                  <td className="py-2 font-mono">1500</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono">S_E</td>
                  <td className="py-2 text-muted-foreground">Sunitha Earnings</td>
                  <td className="py-2 font-mono">4000</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono">S_X</td>
                  <td className="py-2 text-muted-foreground">Sunitha Expenses</td>
                  <td className="py-2 font-mono">1200</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono">C_E</td>
                  <td className="py-2 text-muted-foreground">Sai Charan Earnings</td>
                  <td className="py-2 font-mono">3500</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono">C_X</td>
                  <td className="py-2 text-muted-foreground">Sai Charan Expenses</td>
                  <td className="py-2 font-mono">800</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono">Daily</td>
                  <td className="py-2 text-muted-foreground">Daily Expenses</td>
                  <td className="py-2 font-mono">200</td>
                </tr>
              </tbody>
            </table>
          </div>

          <Button variant="outline" className="mt-4" onClick={downloadSample}>
            <Download className="mr-2 h-4 w-4" />
            Download Sample Template
          </Button>
        </div>
      </div>
    </div>
  )
}
