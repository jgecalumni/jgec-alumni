'use client';
import { useEffect, useMemo, useState } from 'react';

type BulletinPdf = {
    id: string;
    fileName: string;
    title: string;
    url: string;
    size: number;
    updatedAt: string;
};

const formatBytes = (bytes: number) => {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / Math.pow(1024, index);
    return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

const formatDate = (isoDate: string) =>
    new Date(isoDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

const Page = () => {
    const [pdfs, setPdfs] = useState<BulletinPdf[]>([]);
    const [selectedPdfId, setSelectedPdfId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const loadBulletins = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch('/api/bulletins', {
                    method: 'GET',
                    signal: controller.signal,
                    cache: 'no-store',
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data?.error || 'Could not load bulletins.');
                }

                const nextPdfs: BulletinPdf[] = data?.pdfs || [];
                setPdfs(nextPdfs);
                setSelectedPdfId((current) => current || nextPdfs[0]?.id || null);
            } catch (loadError) {
                if ((loadError as Error).name !== 'AbortError') {
                    setError('Unable to load bulletin documents at the moment.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadBulletins();

        return () => {
            controller.abort();
        };
    }, []);

    const selectedPdf = useMemo(
        () => pdfs.find((pdf) => pdf.id === selectedPdfId) ?? null,
        [pdfs, selectedPdfId]
    );

    const handleDownload = (url: string, fileName: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
    };

    return (
        <div className="min-h-screen px-4 py-36 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 border border-slate-400 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8">
                    <p className="mb-2 inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold tracking-wide text-white">
                        Alumni Bulleins
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Bulletin Archive
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
                        Browse official alumni bulletins, preview documents instantly, and download copies
                        for offline reading.
                    </p>
                </div>

                {isLoading && (
                    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className="h-24 animate-pulse rounded-xl bg-slate-100" />
                            ))}
                        </div>
                        <div className="h-[70vh] animate-pulse rounded-2xl border border-slate-200 bg-white" />
                    </div>
                )}

                {!isLoading && error && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
                        {error}
                    </div>
                )}

                {!isLoading && !error && pdfs.length === 0 && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
                        No bulletin PDFs are available yet in the archive.
                    </div>
                )}

                {!isLoading && !error && pdfs.length > 0 && selectedPdf && (
                    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                        <aside className="border border-slate-400 bg-white p-3 shadow-sm">
                            <h2 className="px-2 py-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                                Available Bulletins ({pdfs.length})
                            </h2>
                            <div className="space-y-2">
                                {pdfs.map((pdf) => {
                                    const isActive = selectedPdfId === pdf.id;

                                    return (
                                        <button
                                            key={pdf.id}
                                            onClick={() => setSelectedPdfId(pdf.id)}
                                            className={`w-full rounded-xl border p-3 text-left transition ${
                                                isActive
                                                    ? 'border-slate-900 bg-slate-900 text-white'
                                                    : 'border-slate-200 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50'
                                            }`}
                                        >
                                            <p className="line-clamp-2 text-sm font-semibold">{pdf.title}</p>
                                            <div
                                                className={`mt-2 flex items-center justify-between text-xs ${
                                                    isActive ? 'text-slate-300' : 'text-slate-500'
                                                }`}
                                            >
                                                <span>{formatBytes(pdf.size)}</span>
                                                <span>{formatDate(pdf.updatedAt)}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </aside>

                        <section className="border border-slate-400 bg-white p-4 shadow-sm sm:p-5">
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">{selectedPdf.title}</h3>
                                    <p className="text-sm text-slate-500">
                                        Updated {formatDate(selectedPdf.updatedAt)} • {formatBytes(selectedPdf.size)}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <a
                                        href={selectedPdf.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="rounded-lg border border-slate-400 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                    >
                                        Open
                                    </a>
                                    <button
                                        onClick={() => handleDownload(selectedPdf.url, selectedPdf.fileName)}
                                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                                    >
                                        Download
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-xl border border-slate-200">
                                <iframe
                                    title={selectedPdf.title}
                                    src={`${selectedPdf.url}#toolbar=0&navpanes=0&view=FitH`}
                                    className="h-[72vh] w-full"
                                />
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;
