"use client";
import React, { memo, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2, Settings } from "lucide-react";
import { useGetGlobalSettingsQuery, useUpdateGlobalSettingsMutation } from "@/store/feature/settings-feature";
import toast from "react-hot-toast";

interface IProps {
	open: boolean;
	closed: () => void;
}

const ModalGlobalSettings: React.FC<IProps> = memo(({ open, closed }) => {
	const { data, isLoading: isFetching, refetch } = useGetGlobalSettingsQuery();
	const [updateSettings, { isLoading }] = useUpdateGlobalSettingsMutation();

	const [scholarshipStartDate, setScholarshipStartDate] = useState("");
	const [scholarshipEndDate, setScholarshipEndDate] = useState("");

	useEffect(() => {
		if (data?.data) {
			if (data.data.scholarshipStartDate) {
				setScholarshipStartDate(new Date(data.data.scholarshipStartDate).toISOString().substring(0, 10));
			}
			if (data.data.scholarshipEndDate) {
				setScholarshipEndDate(new Date(data.data.scholarshipEndDate).toISOString().substring(0, 10));
			}
		}
	}, [data]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const res = await updateSettings({
				scholarshipStartDate: scholarshipStartDate || null,
				scholarshipEndDate: scholarshipEndDate || null,
			}).unwrap();
			
			if (res?.success) {
				toast.success(res?.message || "Settings updated successfully");
				refetch();
				closed();
			}
		} catch (error: any) {
			toast.error(error?.data?.message || "Failed to update settings");
		}
	};

	return (
		<Dialog open={open} onOpenChange={closed}>
			<DialogContent className="sm:max-w-md border-border/60 shadow-2xl rounded-2xl bg-card">
				<DialogHeader className="border-b border-border/50 pb-4">
					<DialogTitle className="text-xl font-bold flex items-center gap-3 text-foreground">
						<div className="bg-slate-100 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 p-2 rounded-lg">
							<Settings size={18} />
						</div>
						Global Scholarship Settings
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6 py-4">
					<p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
						Updating these dates will automatically clear the individual start/end dates of all existing scholarships and apply these global dates to them.
					</p>

					{isFetching ? (
						<div className="flex justify-center py-8">
							<Loader2 className="animate-spin text-primary w-6 h-6" />
						</div>
					) : (
						<div className="grid grid-cols-1 gap-4">
							<div className="space-y-2">
								<label htmlFor="globalStartDate" className="text-sm font-semibold">Global Start Date</label>
								<input
									id="globalStartDate"
									type="date"
									className="flex h-10 w-full rounded-xl border border-input bg-muted/20 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary transition-colors"
									value={scholarshipStartDate}
									onChange={(e) => setScholarshipStartDate(e.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<label htmlFor="globalEndDate" className="text-sm font-semibold">Global End Date</label>
								<input
									id="globalEndDate"
									type="date"
									className="flex h-10 w-full rounded-xl border border-input bg-muted/20 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary transition-colors"
									value={scholarshipEndDate}
									onChange={(e) => setScholarshipEndDate(e.target.value)}
								/>
							</div>
						</div>
					)}

					<div className="flex justify-end gap-3 items-center pt-4 border-t border-border/50">
						<Button type="button" variant="outline" onClick={closed} className="rounded-xl px-5">
							Cancel
						</Button>
						<Button
							type="submit"
							className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-md transition-all px-6"
							disabled={isLoading || isFetching}
						>
							{isLoading ? (
								<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Applying...</>
							) : (
								"Apply Globally"
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
});

ModalGlobalSettings.displayName = "ModalGlobalSettings";
export default ModalGlobalSettings;
