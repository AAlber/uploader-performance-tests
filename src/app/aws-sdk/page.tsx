'use client';

import { useState, } from 'react';

export default function AwsSdkUploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const handleUpload = async () => {
    setError(null);
    setUploading(true);
    const uploadedFiles: string[] = [];

    try {
      for (const file of files) {
        // Get presigned URL
        const presignedUrlResponse = await fetch(
          `/api/aws-sdk-presigned-url?key=${encodeURIComponent(file.name)}`
        );
        const { url } = await presignedUrlResponse.json();

        // Upload file using presigned URL
        const uploadResponse = await fetch(url, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        uploadedFiles.push(url.split('?')[0]); // Store the base URL without presigned params
      }

      setUploadedUrls(uploadedFiles);
      setFiles([]); // Clear files after successful upload
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">AWS SDK Upload</h1>

      <div className="space-y-4">
        <input
          type="file"
          multiple
          onChange={(e) => {
            const fileList = e.target.files;
            if (fileList) {
              setFiles(Array.from(fileList));
            }
          }}
          className="block w-full"
        />

        {files.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Selected files:</h3>
            <ul className="list-disc pl-5">
              {files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : 'Upload Files'}
        </button>

        {error && (
          <div className="text-red-500 mt-4">
            Error: {error}
          </div>
        )}

        {uploadedUrls.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Uploaded files:</h3>
            <ul className="list-disc pl-5">
              {uploadedUrls.map((url, index) => (
                <li key={index}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {url.split('/').pop()}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
