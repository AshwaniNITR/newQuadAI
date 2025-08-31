// import { NextResponse } from 'next/server';
// import FormData from 'form-data';
// import fetch from 'node-fetch';
// import { Readable } from 'stream';

// export async function POST(req: Request) {
//     try {
//         const formData = new FormData();
//         const files = await req.formData();

//         // Append each DICOM file from the request to the form data
//         files.forEach(({file, name}: any) => {
//             const stream = Readable.from(file.stream() as String);
//             formData.append(name, stream, {
//                 filename: file.name,
//                 contentType: file.type,
//             });
//         });

//         // Forward the request to the Flask API
//         const response = await fetch('http://127.0.0.1:5000/generate_3d_model', {
//             method: 'POST',
//             headers: formData.getHeaders(),
//             body: formData as any,
//         });

//         if (!response.ok) {
//             throw new Error('Error in Flask API response');
//         }

//         // Convert the response back to a blob to handle it in Next.js
//         const fileBlob = await response.blob();
//         const responseBuffer = await fileBlob.arrayBuffer();

//         // Send the STL file back as a response
//         return new NextResponse(new Uint8Array(responseBuffer), {
//             status: 200,
//             headers: {
//                 'Content-Disposition': 'attachment; filename="3d_model.stl"',
//                 'Content-Type': 'application/vnd.ms-pki.stl',
//             },
//         });
//     } catch (error) {
//         console.error('Error forwarding to Flask API:', error);
//         return NextResponse.json({ error: 'Failed to process DICOM files' }, { status: 500 });
//     }
// }
// import { NextResponse } from 'next/server';
// import FormData from 'form-data';
// import fetch, { HeadersInit } from 'node-fetch';
// import { Readable } from 'stream';

// export async function POST(req: Request) {
//     try {
//         const formData = new FormData();
//         const files = await req.formData();

//         // Append each DICOM file from the request to the form data
//         for (const [name, file] of files.entries()) {
//             if (file instanceof File) {
//                 const stream = Readable.from(file.stream() as unknown as Iterable<Buffer>);
//                 formData.append(name, stream, {
//                     filename: file.name,
//                     contentType: file.type,
//                 });
//             }
//         }

//         // Convert FormData into a readable stream for fetch
//         const formDataHeaders = formData.getHeaders() as HeadersInit;
//         const formDataBuffer = await new Promise<Buffer>((resolve, reject) => {
//             const chunks: Buffer[] = [];
//             formData.on('data', (chunk) => chunks.push(chunk));
//             formData.on('end', () => resolve(Buffer.concat(chunks)));
//             formData.on('error', reject);
//         });

//         // Forward the request to the Flask API
//         const response = await fetch('http://127.0.0.1:5000/generate_3d_model', {
//             method: 'POST',
//             headers: formDataHeaders,
//             body: formDataBuffer,
//         });

//         if (!response.ok) {
//             throw new Error('Error in Flask API response');
//         }

//         // Convert the response back to a blob to handle it in Next.js
//         const fileBlob = await response.blob();
//         const responseBuffer = await fileBlob.arrayBuffer();

//         // Send the STL file back as a response
//         return new NextResponse(new Uint8Array(responseBuffer), {
//             status: 200,
//             headers: {
//                 'Content-Disposition': 'attachment; filename="3d_model.stl"',
//                 'Content-Type': 'application/vnd.ms-pki.stl',
//             },
//         });
//     } catch (error) {
//         console.error('Error forwarding to Flask API:', error);
//         return NextResponse.json({ error: 'Failed to process DICOM files' }, { status: 500 });
//     }
// }
// app/api/generateModel/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Forward request to the external API
    const response = await fetch("https://hexa-api-latest.onrender.com/generate_3d_model", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || "Failed to process DICOM files" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: Error | unknown) {
    console.error("Error in generateModel API:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
