'use client';

import { type PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';
import { useState, useRef } from 'react';

export default function UploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">File Upload</h1>

      <form
        onSubmit={async (event) => {
          event.preventDefault();
          setError(null);
          setUploading(true);

          if (!inputFileRef.current?.files) {
            setError('No file selected');
            setUploading(false);
            return;
          }

          try {
            const file = inputFileRef.current.files[0];
            const newBlob = await upload(file.name, file, {
              access: 'public',
              handleUploadUrl: '/api/upload',
            });

            setBlob(newBlob);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
          } finally {
            setUploading(false);
          }
        }}
        className="space-y-4"
      >
        <div>
          <input
            name="file"
            ref={inputFileRef}
            type="file"
            required
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {blob && (
        <div className="mt-4 p-4 bg-green-50 rounded-md">
          <p className="font-medium">Upload successful!</p>
          <p className="mt-2 text-sm">
            File URL:{' '}
            <a
              href={blob.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {blob.url}
            </a>
          </p>
        </div>
      )}
    </div>
  );
} 