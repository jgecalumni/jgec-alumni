"use client";

import React, { useState, useMemo, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
	Award,
	Users,
	Plus,
	Search,
	Pencil,
	Trash2,
	UploadCloud,
	Check,
	X,
	LayoutGrid,
	List,
	Loader2,
	RefreshCw,
	Sparkles,
	Building2,
	Calendar,
	ArrowUpDown,
	Briefcase,
	ExternalLink,
	UserPlus,
	FolderPlus,
	SlidersHorizontal,
} from "lucide-react";

import {
	useGetGoverningBodyQuery,
	useCreatePostMutation,
	useUpdatePostMutation,
	useDeletePostMutation,
	useCreateMemberMutation,
	useUpdateMemberMutation,
	useDeleteMemberMutation,
	IGoverningBodyPost,
	IGoverningBodyMember,
} from "@/store/feature/governing-body-feature";
import Loading from "@/app/loading";

export default function GoverningBodyPage() {
	const { data, isLoading, isFetching, refetch } = useGetGoverningBodyQuery();

	const [createPost, { isLoading: isCreatingPost }] = useCreatePostMutation();
	const [updatePost, { isLoading: isUpdatingPost }] = useUpdatePostMutation();
	const [deletePost, { isLoading: isDeletingPost }] = useDeletePostMutation();

	const [createMember, { isLoading: isCreatingMember }] = useCreateMemberMutation();
	const [updateMember, { isLoading: isUpdatingMember }] = useUpdateMemberMutation();
	const [deleteMember, { isLoading: isDeletingMember }] = useDeleteMemberMutation();

	// Search & View Mode
	const [searchQuery, setSearchQuery] = useState("");
	const [viewMode, setViewMode] = useState<"grouped" | "table">("grouped");

	// Modals State
	const [managePostsModalOpen, setManagePostsModalOpen] = useState(false);
	const [quickPostTitle, setQuickPostTitle] = useState("");

	const [postModalOpen, setPostModalOpen] = useState(false);
	const [editingPost, setEditingPost] = useState<IGoverningBodyPost | null>(null);
	const [postTitle, setPostTitle] = useState("");
	const [postOrder, setPostOrder] = useState<number>(1);

	const [memberModalOpen, setMemberModalOpen] = useState(false);
	const [editingMember, setEditingMember] = useState<IGoverningBodyMember | null>(null);
	const [memberPostId, setMemberPostId] = useState<number>(0);
	const [memberName, setMemberName] = useState("");
	const [memberTimeline, setMemberTimeline] = useState("");
	const [memberOrder, setMemberOrder] = useState<number>(1);
	const [memberImageFile, setMemberImageFile] = useState<File | null>(null);
	const [memberImagePreview, setMemberImagePreview] = useState<string>("");

	const fileInputRef = useRef<HTMLInputElement>(null);

	const posts = useMemo(() => data?.data || [], [data]);

	const totalMembers = useMemo(() => {
		return posts.reduce((acc, p) => acc + (p.members?.length || 0), 0);
	}, [posts]);

	// Filtered posts based on search query
	const filteredPosts = useMemo(() => {
		if (!searchQuery.trim()) return posts;
		const query = searchQuery.toLowerCase();
		return posts
			.map((post) => {
				const matchesPostTitle = post.title.toLowerCase().includes(query);
				const matchedMembers = post.members?.filter(
					(m) =>
						m.name.toLowerCase().includes(query) ||
						m.timeline.toLowerCase().includes(query)
				);
				if (matchesPostTitle) return post;
				if (matchedMembers && matchedMembers.length > 0) {
					return { ...post, members: matchedMembers };
				}
				return null;
			})
			.filter(Boolean) as IGoverningBodyPost[];
	}, [posts, searchQuery]);

	// Open Add Post Modal
	const handleOpenAddPost = () => {
		setEditingPost(null);
		setPostTitle("");
		const nextOrder = posts.length > 0 ? Math.max(...posts.map((p) => p.order || 0)) + 1 : 1;
		setPostOrder(nextOrder);
		setPostModalOpen(true);
	};

	// Open Edit Post Modal
	const handleOpenEditPost = (post: IGoverningBodyPost) => {
		setEditingPost(post);
		setPostTitle(post.title);
		setPostOrder(post.order || 1);
		setPostModalOpen(true);
	};

	// Handle Save Post
	const handleSavePost = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!postTitle.trim()) {
			toast.error("Please enter a designation title");
			return;
		}

		try {
			if (editingPost) {
				const res = await updatePost({
					id: editingPost.id,
					title: postTitle.trim(),
					order: Number(postOrder) || 1,
				}).unwrap();
				toast.success(res.message || "Post updated successfully");
			} else {
				const res = await createPost({
					title: postTitle.trim(),
					order: Number(postOrder) || 1,
				}).unwrap();
				toast.success(res.message || "Post created successfully");
			}
			setPostModalOpen(false);
			refetch();
		} catch (err: any) {
			toast.error(err?.data?.message || "Failed to save post");
		}
	};

	// Handle Delete Post
	const handleDeletePost = async (post: IGoverningBodyPost) => {
		const memberCount = post.members?.length || 0;
		const confirmMsg =
			memberCount > 0
				? `Delete post "${post.title}" and its ${memberCount} appointed member(s)? Cloudinary images will also be removed.`
				: `Are you sure you want to delete post "${post.title}"?`;

		if (!window.confirm(confirmMsg)) return;

		try {
			const res = await deletePost(post.id).unwrap();
			toast.success(res.message || "Post deleted");
			refetch();
		} catch (err: any) {
			toast.error(err?.data?.message || "Failed to delete post");
		}
	};

	// Quick create post from Manage Posts modal
	const handleQuickCreatePost = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!quickPostTitle.trim()) {
			toast.error("Please enter a designation title");
			return;
		}
		const nextOrder = posts.length > 0 ? Math.max(...posts.map((p) => p.order || 0)) + 1 : 1;
		try {
			const res = await createPost({
				title: quickPostTitle.trim(),
				order: nextOrder,
			}).unwrap();
			toast.success(res.message || "Executive post created");
			setQuickPostTitle("");
			refetch();
		} catch (err: any) {
			toast.error(err?.data?.message || "Failed to create post");
		}
	};

	// Open Add Member Modal
	const handleOpenAddMember = (presetPostId?: number) => {
		setEditingMember(null);
		const targetPostId = presetPostId || (posts[0]?.id ?? 0);
		setMemberPostId(targetPostId);
		setMemberName("");
		setMemberTimeline("");
		setMemberOrder(1);
		setMemberImageFile(null);
		setMemberImagePreview("");
		setMemberModalOpen(true);
	};

	// Open Edit Member Modal
	const handleOpenEditMember = (member: IGoverningBodyMember) => {
		setEditingMember(member);
		setMemberPostId(member.postId);
		setMemberName(member.name);
		setMemberTimeline(member.timeline || "");
		setMemberOrder(member.order || 1);
		setMemberImageFile(null);
		setMemberImagePreview(member.image || "");
		setMemberModalOpen(true);
	};

	// Image file selection
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith("image/")) {
			toast.error("Please select a valid image file");
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			toast.error("Image size must be under 5MB");
			return;
		}

		setMemberImageFile(file);
		const reader = new FileReader();
		reader.onload = () => {
			setMemberImagePreview(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	// Handle Save Member
	const handleSaveMember = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!memberName.trim()) {
			toast.error("Please enter the member's name");
			return;
		}
		if (!memberPostId) {
			toast.error("Please select a designation/post");
			return;
		}

		const formData = new FormData();
		formData.append("postId", String(memberPostId));
		formData.append("name", memberName.trim());
		formData.append("timeline", memberTimeline.trim());
		formData.append("order", String(memberOrder || 1));

		if (memberImageFile) {
			formData.append("image", memberImageFile);
		}

		try {
			if (editingMember) {
				const res = await updateMember({
					id: editingMember.id,
					formData,
				}).unwrap();
				toast.success(res.message || "Member updated successfully");
			} else {
				const res = await createMember(formData).unwrap();
				toast.success(res.message || "Member appointed successfully");
			}
			setMemberModalOpen(false);
			refetch();
		} catch (err: any) {
			toast.error(err?.data?.message || "Failed to save member");
		}
	};

	// Handle Delete Member
	const handleDeleteMember = async (member: IGoverningBodyMember) => {
		if (!window.confirm(`Remove member "${member.name}"? Cloudinary image will be deleted.`)) {
			return;
		}

		try {
			const res = await deleteMember(member.id).unwrap();
			toast.success(res.message || "Member removed");
			refetch();
		} catch (err: any) {
			toast.error(err?.data?.message || "Failed to remove member");
		}
	};

	if (isLoading) return <Loading />;

	return (
		<div className="w-full space-y-6">
			{/* Command Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div className="flex items-center gap-3">
					<div className="h-10 w-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
						<Award className="h-5 w-5" />
					</div>
					<div>
						<h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
							<span>Governing Body</span>
							<span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60">
								Live
							</span>
						</h1>
						<p className="text-sm text-slate-500 dark:text-slate-400">
							Manage council executive designations, leadership portfolios, and member credentials.
						</p>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
					<button
						onClick={() => refetch()}
						disabled={isFetching}
						className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
						title="Sync with database"
					>
						<RefreshCw className={`h-4 w-4 text-slate-500 ${isFetching ? "animate-spin" : ""}`} />
						<span className="hidden md:inline">Sync</span>
					</button>

					<button
						onClick={() => setManagePostsModalOpen(true)}
						className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-sm font-medium text-amber-700 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 rounded-xl hover:bg-amber-100/70 dark:hover:bg-amber-900/50 transition-all shadow-xs"
						title="Manage, update, reorder and delete executive posts"
					>
						<SlidersHorizontal className="h-4 w-4 text-amber-600 dark:text-amber-400" />
						<span>Manage Posts</span>
					</button>

					<button
						onClick={handleOpenAddPost}
						className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-xs"
					>
						<FolderPlus className="h-4 w-4 text-primary" />
						<span>New Post</span>
					</button>

					{/* <button
						onClick={() => handleOpenAddMember()}
						className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/95 rounded-xl transition-all shadow-xs active:scale-95"
					>
						<UserPlus className="h-4 w-4" />
						<span>Add Member</span>
					</button> */}
				</div>
			</div>

			{/* Metric Ribbon */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
				<div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-3.5 flex items-center justify-between">
					<div>
						<p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Executive Posts</p>
						<p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">{posts.length}</p>
					</div>
					<div className="h-9 w-9 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
						<Briefcase className="h-4 w-4" />
					</div>
				</div>

				<div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-3.5 flex items-center justify-between">
					<div>
						<p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Appointed Members</p>
						<p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">{totalMembers}</p>
					</div>
					<div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
						<Users className="h-4 w-4" />
					</div>
				</div>

				<div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-3.5 flex items-center justify-between">
					<div>
						<p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Cloud Storage</p>
						<p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">Cloudinary</p>
					</div>
					<div className="h-9 w-9 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
						<UploadCloud className="h-4 w-4" />
					</div>
				</div>

				<div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-3.5 flex items-center justify-between">
					<div>
						<p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Public Portal</p>
						<p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">Synced & Live</p>
					</div>
					<div className="h-9 w-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
						<Sparkles className="h-4 w-4" />
					</div>
				</div>
			</div>

			{/* Main Card */}
			<div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
				{/* Toolbar */}
				<div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
					<div className="relative flex-1 max-w-md">
						<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search by member name, timeline, or post designation..."
							className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
						/>
					</div>

					<div className="flex items-center justify-between sm:justify-end gap-2.5">
						<div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
							<button
								onClick={() => setViewMode("grouped")}
								className={`p-1.5 rounded-md text-xs font-medium transition-all ${viewMode === "grouped"
										? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs"
										: "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
									}`}
								title="Grouped by Designation"
							>
								<LayoutGrid className="h-4 w-4" />
							</button>
							<button
								onClick={() => setViewMode("table")}
								className={`p-1.5 rounded-md text-xs font-medium transition-all ${viewMode === "table"
										? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs"
										: "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
									}`}
								title="All Members Table"
							>
								<List className="h-4 w-4" />
							</button>
						</div>

						<span className="text-xs text-slate-500 dark:text-slate-400">
							Posts: <strong className="text-slate-900 dark:text-slate-100">{filteredPosts.length}</strong>
						</span>
					</div>
				</div>

				{/* 1. Grouped By Post View */}
				{viewMode === "grouped" && (
					<div className="p-4 sm:p-6 space-y-6">
						{filteredPosts.length > 0 ? (
							filteredPosts.map((post) => {
								const members = post.members || [];
								return (
									<div
										key={post.id}
										className="border border-slate-200/90 dark:border-slate-800/90 rounded-2xl bg-white dark:bg-slate-900/60 overflow-hidden shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
									>
										{/* Post Header Bar */}
										<div className="px-5 py-3.5 bg-slate-50/90 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
											<div className="flex items-center flex-wrap gap-2.5">
												<span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-300 bg-slate-200/70 dark:bg-slate-700/70 px-2.5 py-0.5 rounded-md">
													#{String(post.order || 0).padStart(2, "0")}
												</span>
												<h3 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
													{post.title}
												</h3>
												<span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/50">
													{members.length} {members.length === 1 ? "member" : "members"}
												</span>
											</div>

											<div className="flex items-center flex-wrap gap-2">
												<button
													type="button"
													onClick={() => handleOpenAddMember(post.id)}
													className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20 transition-all shadow-2xs"
													title="Appoint member under this post"
												>
													<UserPlus className="h-3.5 w-3.5" />
													<span>+ Member</span>
												</button>

												<button
													type="button"
													onClick={() => handleOpenEditPost(post)}
													className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-all shadow-2xs"
													title="Update post designation title and rank order"
												>
													<Pencil className="h-3.5 w-3.5 text-amber-500" />
													<span>Update Post</span>
												</button>

												<button
													type="button"
													onClick={() => handleDeletePost(post)}
													className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-all shadow-2xs"
													title="Delete post and its appointed members"
												>
													<Trash2 className="h-3.5 w-3.5" />
													<span>Delete Post</span>
												</button>
											</div>
										</div>

										{/* Members Grid under Post */}
										<div className="p-4 sm:p-5">
											{members.length > 0 ? (
												<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
													{members.map((member) => (
														<div
															key={member.id}
															className="border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-4 bg-slate-50/40 dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all flex flex-col justify-between group relative"
														>
															<div className="flex flex-col items-center text-center space-y-2">
																{/* Member Cloudinary Image */}
																<div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm shrink-0 bg-slate-100 dark:bg-slate-800">
																	{member.image ? (
																		<Image
																			src={member.image}
																			alt={member.name}
																			fill
																			className="object-cover"
																		/>
																	) : (
																		<div className="w-full h-full flex items-center justify-center text-slate-400">
																			<Users className="h-8 w-8" />
																		</div>
																	)}
																</div>

																<div className="w-full min-w-0">
																	<h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate" title={member.name}>
																		{member.name}
																	</h4>
																	<p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5" title={member.timeline}>
																		{member.timeline || "Governing Member"}
																	</p>
																</div>
															</div>

															{/* Card Action Controls */}
															<div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
																<span className="font-mono text-[11px]">
																	Rank: #{member.order || 1}
																</span>

																<div className="flex items-center gap-1">
																	<button
																		type="button"
																		onClick={() => handleOpenEditMember(member)}
																		className="p-1 rounded-md hover:text-slate-900 hover:bg-slate-200/60 dark:hover:text-slate-100 dark:hover:bg-slate-700 transition-colors"
																		title="Edit member"
																	>
																		<Pencil className="h-3.5 w-3.5" />
																	</button>
																	<button
																		type="button"
																		onClick={() => handleDeleteMember(member)}
																		className="p-1 rounded-md hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-950/40 transition-colors"
																		title="Remove member"
																	>
																		<Trash2 className="h-3.5 w-3.5" />
																	</button>
																</div>
															</div>
														</div>
													))}
												</div>
											) : (
												<div className="py-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
													<Users className="h-6 w-6 text-slate-300 dark:text-slate-700 mb-1.5" />
													<p>No members appointed under this designation yet.</p>
													<button
														type="button"
														onClick={() => handleOpenAddMember(post.id)}
														className="mt-2 text-xs font-semibold text-primary hover:underline"
													>
														+ Appoint Member
													</button>
												</div>
											)}
										</div>
									</div>
								);
							})
						) : (
							<div className="py-14 text-center text-slate-500">
								<Award className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
								<p className="font-semibold text-slate-900 dark:text-slate-100">No governing body records found</p>
								<p className="text-xs text-slate-400 mt-1">Get started by creating your first post or member.</p>
							</div>
						)}
					</div>
				)}

				{/* 2. All Members Table View */}
				{viewMode === "table" && (
					<div className="overflow-x-auto">
						<table className="w-full text-left text-sm">
							<thead className="bg-slate-50/80 dark:bg-slate-950/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800">
								<tr>
									<th className="py-4 px-6">Member Name & Photo</th>
									<th className="py-4 px-6">Executive Post</th>
									<th className="py-4 px-6">Timeline / Credentials</th>
									<th className="py-4 px-4 text-center">Order</th>
									<th className="py-4 px-6 text-right">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
								{posts.flatMap((p) => (p.members || []).map((m) => ({ ...m, postTitle: p.title }))).length > 0 ? (
									posts.flatMap((p) => (p.members || []).map((m) => ({ ...m, postTitle: p.title }))).map((member: any) => (
										<tr key={member.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
											<td className="py-3 px-6">
												<div className="flex items-center gap-3">
													<div className="relative h-10 w-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800">
														{member.image ? (
															<Image src={member.image} alt={member.name} fill className="object-cover" />
														) : (
															<div className="w-full h-full flex items-center justify-center text-slate-400">
																<Users className="h-5 w-5" />
															</div>
														)}
													</div>
													<div>
														<p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
															{member.name}
														</p>
														<span className="text-[10px] font-mono text-slate-400">ID #{member.id}</span>
													</div>
												</div>
											</td>
											<td className="py-3 px-6 font-medium text-slate-800 dark:text-slate-200">
												<span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40">
													{member.postTitle}
												</span>
											</td>
											<td className="py-3 px-6 text-slate-600 dark:text-slate-400 text-xs">
												{member.timeline || "—"}
											</td>
											<td className="py-3 px-4 text-center font-mono text-xs font-bold text-slate-500">
												#{member.order || 1}
											</td>
											<td className="py-3 px-6 text-right">
												<div className="flex items-center justify-end gap-1">
													<button
														type="button"
														onClick={() => handleOpenEditMember(member)}
														className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors"
														title="Edit member"
													>
														<Pencil className="h-4 w-4" />
													</button>
													<button
														type="button"
														onClick={() => handleDeleteMember(member)}
														className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-950/40 transition-colors"
														title="Delete member"
													>
														<Trash2 className="h-4 w-4" />
													</button>
												</div>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
											No members registered yet.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* Modal: Manage All Posts / Executive Designations */}
			{managePostsModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
					<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
						{/* Header */}
						<div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
							<div className="flex items-center gap-2.5">
								<div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
									<SlidersHorizontal className="h-5 w-5" />
								</div>
								<div>
									<h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
										Executive Posts & Designations Management
									</h3>
									<p className="text-xs text-slate-500 dark:text-slate-400">
										View, create, reorder, update titles, or delete executive designations.
									</p>
								</div>
							</div>
							<button
								onClick={() => setManagePostsModalOpen(false)}
								className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
							>
								<X className="h-4 w-4" />
							</button>
						</div>

						{/* Quick Create Form */}
						<div className="p-4 sm:p-5 bg-slate-50/60 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
							<form onSubmit={handleQuickCreatePost} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
								<div className="relative flex-1">
									<input
										type="text"
										value={quickPostTitle}
										onChange={(e) => setQuickPostTitle(e.target.value)}
										placeholder="New post designation (e.g. Governing Body Member, Patron)"
										className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-slate-100"
									/>
								</div>
								<button
									type="submit"
									disabled={isCreatingPost}
									className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/95 rounded-xl transition-all shadow-xs disabled:opacity-50 shrink-0"
								>
									{isCreatingPost ? (
										<Loader2 className="h-3.5 w-3.5 animate-spin" />
									) : (
										<Plus className="h-3.5 w-3.5" />
									)}
									<span>Add Post</span>
								</button>
							</form>
						</div>

						{/* Posts List / Table */}
						<div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5 no-scrollbar">
							{posts.length > 0 ? (
								posts.map((post) => {
									const memberCount = post.members?.length || 0;
									return (
										<div
											key={post.id}
											className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-2xs"
										>
											<div className="flex items-center gap-3 min-w-0">
												<span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md shrink-0">
													#{String(post.order || 0).padStart(2, "0")}
												</span>
												<div className="min-w-0">
													<h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">
														{post.title}
													</h4>
													<p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
														{memberCount} {memberCount === 1 ? "member assigned" : "members assigned"}
													</p>
												</div>
											</div>

											<div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
												<button
													type="button"
													onClick={() => {
														handleOpenAddMember(post.id);
														setManagePostsModalOpen(false);
													}}
													className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-primary hover:bg-primary/10 transition-colors"
													title="Add member directly to this post"
												>
													<UserPlus className="h-3.5 w-3.5" />
													<span className="hidden sm:inline">Add Member</span>
												</button>

												<button
													type="button"
													onClick={() => {
														handleOpenEditPost(post);
													}}
													className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
													title="Update designation title and order"
												>
													<Pencil className="h-3.5 w-3.5 text-amber-500" />
													<span>Update</span>
												</button>

												<button
													type="button"
													onClick={() => handleDeletePost(post)}
													className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
													title="Delete this post"
												>
													<Trash2 className="h-3.5 w-3.5" />
													<span>Delete</span>
												</button>
											</div>
										</div>
									);
								})
							) : (
								<div className="py-8 text-center text-slate-400 text-xs">
									No executive posts found. Create your first post using the input above.
								</div>
							)}
						</div>

						{/* Footer */}
						<div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
							<button
								onClick={() => setManagePostsModalOpen(false)}
								className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Modal: Create / Edit Post */}
			{postModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
					<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
						<div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
									<FolderPlus className="h-4 w-4" />
								</div>
								<h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
									{editingPost ? "Update Executive Post" : "Create New Executive Post"}
								</h3>
							</div>
							<button
								onClick={() => setPostModalOpen(false)}
								className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
							>
								<X className="h-4 w-4" />
							</button>
						</div>

						<form onSubmit={handleSavePost} className="p-5 space-y-4">
							<div className="space-y-1.5">
								<label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
									Designation / Post Title <span className="text-rose-500">*</span>
								</label>
								<input
									type="text"
									required
									value={postTitle}
									onChange={(e) => setPostTitle(e.target.value)}
									placeholder="e.g. Governing Body Member, President, Secretary"
									className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-slate-100"
								/>
							</div>

							<div className="space-y-1.5">
								<label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
									Display Order Priority
								</label>
								<input
									type="number"
									value={postOrder}
									onChange={(e) => setPostOrder(parseInt(e.target.value, 10) || 1)}
									className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-slate-100"
								/>
								<p className="text-[11px] text-slate-400">
									Controls the sorting position on the council executive board.
								</p>
							</div>

							<div className="pt-3 flex items-center justify-end gap-2.5">
								<button
									type="button"
									onClick={() => setPostModalOpen(false)}
									className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={isCreatingPost || isUpdatingPost}
									className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/95 rounded-xl transition-colors disabled:opacity-50"
								>
									{isCreatingPost || isUpdatingPost ? (
										<Loader2 className="h-3.5 w-3.5 animate-spin" />
									) : (
										<Check className="h-3.5 w-3.5" />
									)}
									<span>{editingPost ? "Update Post" : "Create Post"}</span>
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Modal: Create / Edit Member */}
			{memberModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
					<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
						<div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="p-2 rounded-lg bg-primary/10 text-primary">
									<UserPlus className="h-4 w-4" />
								</div>
								<h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
									{editingMember ? "Edit Appointed Member" : "Appoint New Council Member"}
								</h3>
							</div>
							<button
								onClick={() => setMemberModalOpen(false)}
								className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
							>
								<X className="h-4 w-4" />
							</button>
						</div>

						<form onSubmit={handleSaveMember} className="p-5 space-y-4">
							<div className="space-y-1.5">
								<label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
									Select Designation / Post <span className="text-rose-500">*</span>
								</label>
								<select
									required
									value={memberPostId}
									onChange={(e) => setMemberPostId(Number(e.target.value))}
									className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-slate-100"
								>
									{posts.map((p) => (
										<option key={p.id} value={p.id}>
											{p.title} (Order #{p.order})
										</option>
									))}
								</select>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="space-y-1.5">
									<label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
										Member Full Name <span className="text-rose-500">*</span>
									</label>
									<input
										type="text"
										required
										value={memberName}
										onChange={(e) => setMemberName(e.target.value)}
										placeholder="e.g. Dr. Amitava Ray"
										className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-slate-100"
									/>
								</div>

								<div className="space-y-1.5">
									<label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
										Batch Timeline / Role
									</label>
									<input
										type="text"
										value={memberTimeline}
										onChange={(e) => setMemberTimeline(e.target.value)}
										placeholder="e.g. (1980-1984) or Principal, JGEC"
										className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-slate-100"
									/>
								</div>
							</div>

							<div className="space-y-1.5">
								<label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
									Display Order Priority Under this Post
								</label>
								<input
									type="number"
									value={memberOrder}
									onChange={(e) => setMemberOrder(parseInt(e.target.value, 10) || 1)}
									className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-slate-100"
								/>
							</div>

							{/* Photo Upload with Preview */}
							<div className="space-y-2">
								<label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
									<span>Member Photo</span>
									<span className="text-[11px] font-normal text-purple-600 dark:text-purple-400">
										Folder: Governing Body (Cloudinary)
									</span>
								</label>

								<div className="flex items-center gap-4 p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50">
									<div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm shrink-0 bg-slate-200 dark:bg-slate-800">
										{memberImagePreview ? (
											<Image
												src={memberImagePreview}
												alt="Preview"
												fill
												className="object-cover"
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center text-slate-400">
												<Users className="h-6 w-6" />
											</div>
										)}
									</div>

									<div className="flex-1 min-w-0">
										<input
											ref={fileInputRef}
											type="file"
											accept="image/*"
											onChange={handleImageChange}
											className="hidden"
										/>
										<button
											type="button"
											onClick={() => fileInputRef.current?.click()}
											className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors shadow-2xs"
										>
											<UploadCloud className="h-3.5 w-3.5" />
											<span>Choose Photo</span>
										</button>
										<p className="text-[11px] text-slate-400 mt-1 truncate">
											{memberImageFile ? memberImageFile.name : "PNG, JPG up to 5MB"}
										</p>
									</div>
								</div>
							</div>

							<div className="pt-3 flex items-center justify-end gap-2.5">
								<button
									type="button"
									onClick={() => setMemberModalOpen(false)}
									className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={isCreatingMember || isUpdatingMember}
									className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/95 rounded-xl transition-colors disabled:opacity-50"
								>
									{isCreatingMember || isUpdatingMember ? (
										<Loader2 className="h-3.5 w-3.5 animate-spin" />
									) : (
										<Check className="h-3.5 w-3.5" />
									)}
									<span>{editingMember ? "Save Member" : "Appoint Member"}</span>
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
