import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const BULLETINS_DIR = path.join(process.cwd(), 'public', 'uploads', 'bulletins');

const isPdfFile = (fileName: string) => fileName.toLowerCase().endsWith('.pdf');

const formatTitle = (fileName: string) =>
    fileName
        .replace(/\.pdf$/i, '')
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

export async function GET() {
    try {
        const entries = await fs.readdir(BULLETINS_DIR, { withFileTypes: true });

        const pdfs = await Promise.all(
            entries
                .filter((entry) => entry.isFile() && isPdfFile(entry.name))
                .map(async (entry) => {
                    const filePath = path.join(BULLETINS_DIR, entry.name);
                    const stats = await fs.stat(filePath);

                    return {
                        id: encodeURIComponent(entry.name),
                        fileName: entry.name,
                        title: formatTitle(entry.name),
                        url: `/uploads/bulletins/${encodeURIComponent(entry.name)}`,
                        size: stats.size,
                        updatedAt: stats.mtime.toISOString(),
                    };
                })
        );

        pdfs.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));

        return NextResponse.json({ pdfs });
    } catch (error) {
        console.error('Failed to load bulletin PDFs:', error);
        return NextResponse.json(
            { error: 'Unable to load bulletin PDFs right now.', pdfs: [] },
            { status: 500 }
        );
    }
}
