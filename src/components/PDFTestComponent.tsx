import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SupabaseService } from '@/services/supabaseService';

const PDFTestComponent = () => {
  const [testResults, setTestResults] = useState<any[]>([]);

  const testUrls = [
    'https://drive.google.com/file/d/1TDF3ZCacGw9A6EcZ01KpVYcV-DUzyj5m/view?usp=drivesdk',
    'https://drive.google.com/file/d/1ABC123XYZ789/view?usp=sharing',
    'https://drive.google.com/file/d/1DEF456UVW012/edit?usp=sharing',
    'https://example.com/sample.pdf',
    'invalid-url',
    ''
  ];

  const runTests = () => {
    const results = testUrls.map(url => {
      const previewUrl = SupabaseService.convertGoogleDrivePdfUrl(url);
      const docsViewerUrl = SupabaseService.convertToGoogleDocsViewer(url);
      
      return {
        original: url,
        preview: previewUrl,
        docsViewer: docsViewerUrl,
        isGoogleDrive: url.includes('drive.google.com/file/d/'),
        fileId: url.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1] || 'N/A'
      };
    });
    
    setTestResults(results);
    console.log('🧪 PDF URL Conversion Test Results:', results);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">PDF URL Conversion Test</h2>
      
      <Button onClick={runTests} className="mb-6">
        Run URL Conversion Tests
      </Button>
      
      {testResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Test Results:</h3>
          {testResults.map((result, index) => (
            <div key={index} className="border p-4 rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div><strong>Original:</strong> {result.original || '(empty)'}</div>
                <div><strong>File ID:</strong> {result.fileId}</div>
                <div><strong>Is Google Drive:</strong> {result.isGoogleDrive ? '✅' : '❌'}</div>
                <div><strong>Preview URL:</strong> {result.preview}</div>
                <div><strong>Docs Viewer URL:</strong> {result.docsViewer}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Live PDF Test</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Preview Method</h4>
            <iframe
              src="https://drive.google.com/file/d/1TDF3ZCacGw9A6EcZ01KpVYcV-DUzyj5m/preview"
              className="w-full h-64 border rounded"
              title="PDF Preview Test"
            />
          </div>
          <div>
            <h4 className="font-medium mb-2">Docs Viewer Method</h4>
            <iframe
              src="https://docs.google.com/viewer?url=https%3A//drive.google.com/file/d/1TDF3ZCacGw9A6EcZ01KpVYcV-DUzyj5m/view%3Fusp%3Ddrivesdk&embedded=true"
              className="w-full h-64 border rounded"
              title="PDF Docs Viewer Test"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFTestComponent;
