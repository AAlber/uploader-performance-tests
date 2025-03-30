'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-x-4">
        <Link 
          href="/vercel-blob"
          className="px-6 py-3 bg-blue-600 text-black rounded-md hover:bg-blue-700 transition-colors"
        >
          Vercel Blob Upload
        </Link>
        <Link
          href="/upload-thing" 
          className="px-6 py-3 bg-green-600 text-black rounded-md hover:bg-green-700 transition-colors"
        >
          UploadThing
        </Link>
        <Link
          href="/aws-sdk"
          className="px-6 py-3 bg-purple-600 text-black rounded-md hover:bg-purple-700 transition-colors" 
        >
          AWS SDK Upload
        </Link>
      </div>
    </div>
  );
}

