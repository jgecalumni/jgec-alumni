import React from "react";
import Link from "next/link";
import { Eye, FilePenLine, Loader2, Trash2, FileText } from "lucide-react";

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
		<div className="group relative flex flex-col items-center justify-between overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:border-indigo-500/50 hover:shadow-md hover:-translate-y-1">
			{/* Icon Area */}
			<div className="flex h-32 w-full items-center justify-center bg-muted/20 transition-colors group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/20">
				<div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-110 dark:bg-zinc-800 dark:ring-white/10">
					<FileText size={40} className="text-indigo-500 opacity-90" strokeWidth={1.5} />
				</div>
			</div>

			{/* Content Area */}
			<div className="flex w-full flex-col border-t border-border bg-card p-4 transition-all duration-300">
				<h3 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 min-h-[2.5rem]" title={item.title}>
					{item.title}
				</h3>

				{/* Action Buttons */}
				<div className="mt-4 flex items-center justify-center gap-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
					<Link
						href={item.link}
						target="_blank"
						className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400"
						title="View Document"
					>
						<Eye size={16} />
					</Link>
					<button
						onClick={() => onEdit(item)}
						className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400"
						title="Edit Document"
					>
						<FilePenLine size={16} />
					</button>
					{isDeleting ? (
						<div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
							<Loader2 size={16} className="animate-spin text-destructive" />
						</div>
					) : (
						<button
							onClick={() => onDelete(item.id)}
							className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
							title="Delete Document"
						>
							<Trash2 size={16} />
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default DocumentCard;
