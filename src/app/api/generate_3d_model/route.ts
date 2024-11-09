import { NextResponse } from 'next/server';
import FormData from 'form-data';
import fetch from 'node-fetch';
import { Readable } from 'stream';

export async function POST(req: Request) {
    try {
        const formData = new FormData();
        const files = await req.formData();

        // Append each DICOM file from the request to the form data
        files.forEach(({file, name}:any) => {
            const stream = Readable.from(file.stream() as any);
            formData.append(name, stream, {
                filename: file.name,
                contentType: file.type,
            });
        });

        // Forward the request to the Flask API
        const response = await fetch('http://127.0.0.1:5000/generate_3d_model', {
            method: 'POST',
            headers: formData.getHeaders(),
            body: formData as any,
        });

        if (!response.ok) {
            throw new Error('Error in Flask API response');
        }

        // Convert the response back to a blob to handle it in Next.js
        const fileBlob = await response.blob();
        const responseBuffer = await fileBlob.arrayBuffer();

        // Send the STL file back as a response
        return new NextResponse(new Uint8Array(responseBuffer), {
            status: 200,
            headers: {
                'Content-Disposition': 'attachment; filename="3d_model.stl"',
                'Content-Type': 'application/vnd.ms-pki.stl',
            },
        });
    } catch (error) {
        console.error('Error forwarding to Flask API:', error);
        return NextResponse.json({ error: 'Failed to process DICOM files' }, { status: 500 });
    }
}
