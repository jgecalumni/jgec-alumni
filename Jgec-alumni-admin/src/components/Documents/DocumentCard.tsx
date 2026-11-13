"use client";

import React from "react";
import Link from "next/link";
import { Eye, FilePenLine, Loader2, Trash2, FileText, ExternalLink } from "lucide-react";

interface DocumentCardProps {
	item: {
		id: string;
		title: string;
		link: string;
	};
	onEdit: (item: any) => void;
	onDelete: (id: string) => void;
	isDeleting: boolean;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
	item,
	onEdit,
	onDelete,
	isDeleting,
}) => {
	return (
		<div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between group overflow-hidden">
			{/* Top Area with Preview Banner */}
			<div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
				<div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
					<FileText className="h-5 w-5" />
				</div>
				<span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
					PDF / Doc
				</span>
			</div>

			{/* Title Area */}
			<div className="p-4 flex-1">
				<h3
					className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-primary transition-colors"
					title={item.title}
				>
					{item.title}
				</h3>
				<p className="text-xs text-slate-400 mt-1">Official Archival Record</p>
			</div>

			{/* Action Footer */}
			<div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-900/30 flex items-center justify-between">
				<Link
					href={item.link || "#"}
					target="_blank"
					className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
					title="Open Document in New Tab"
				>
					<Eye className="h-3.5 w-3.5" />
					<span>Inspect</span>
					<ExternalLink className="h-3 w-3 opacity-60" />
				</Link>

				<div className="flex items-center gap-1">
					<button
						type="button"
						onClick={() => onEdit(item)}
						className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
						title="Edit Document"
					>
						<FilePenLine className="h-3.5 w-3.5" />
					</button>

					{isDeleting ? (
						<div className="p-1.5">
							<Loader2 className="h-3.5 w-3.5 animate-spin text-rose-500" />
						</div>
					) : (
						<button
							type="button"
							onClick={() => onDelete(item.id)}
							className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
							title="Delete Document"
						>
							<Trash2 className="h-3.5 w-3.5" />
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default DocumentCard;
