import { baseApi } from "../baseApi";

export interface IGoverningBodyMember {
	id: number;
	name: string;
	timeline: string;
	image: string;
	image_public_id?: string | null;
	order: number;
	postId: number;
	createdAt?: string;
	updatedAt?: string;
}

export interface IGoverningBodyPost {
	id: number;
	title: string;
	post?: string;
	order: number;
	members: IGoverningBodyMember[];
	member?: IGoverningBodyMember[];
	_count?: {
		members: number;
	};
	createdAt?: string;
	updatedAt?: string;
}

export const governingBodyApi = baseApi
	.enhanceEndpoints({ addTagTypes: ["GoverningBody"] })
	.injectEndpoints({
		endpoints: (builder) => ({
			getGoverningBody: builder.query<{ success: boolean; data: IGoverningBodyPost[] }, void>({
				query: () => ({
					url: "/governing-body",
					method: "GET",
					credentials: "include",
				}),
				providesTags: ["GoverningBody"],
			}),
			getGoverningBodyPosts: builder.query<{ success: boolean; data: IGoverningBodyPost[] }, void>({
				query: () => ({
					url: "/governing-body/posts",
					method: "GET",
					credentials: "include",
				}),
				providesTags: ["GoverningBody"],
			}),
			createPost: builder.mutation<
				{ success: boolean; message: string; data?: IGoverningBodyPost },
				{ title: string; order?: number }
			>({
				query: (body) => ({
					url: "/governing-body/posts",
					method: "POST",
					body,
					credentials: "include",
				}),
				invalidatesTags: ["GoverningBody"],
			}),
			updatePost: builder.mutation<
				{ success: boolean; message: string; data?: IGoverningBodyPost },
				{ id: number; title?: string; order?: number }
			>({
				query: ({ id, ...body }) => ({
					url: `/governing-body/posts/${id}`,
					method: "PUT",
					body,
					credentials: "include",
				}),
				invalidatesTags: ["GoverningBody"],
			}),
			deletePost: builder.mutation<
				{ success: boolean; message: string },
				number
			>({
				query: (id) => ({
					url: `/governing-body/posts/${id}`,
					method: "DELETE",
					credentials: "include",
				}),
				invalidatesTags: ["GoverningBody"],
			}),
			createMember: builder.mutation<
				{ success: boolean; message: string; data?: IGoverningBodyMember },
				FormData
			>({
				query: (body) => ({
					url: "/governing-body/members",
					method: "POST",
					body,
					credentials: "include",
				}),
				invalidatesTags: ["GoverningBody"],
			}),
			updateMember: builder.mutation<
				{ success: boolean; message: string; data?: IGoverningBodyMember },
				{ id: number; formData: FormData }
			>({
				query: ({ id, formData }) => ({
					url: `/governing-body/members/${id}`,
					method: "PUT",
					body: formData,
					credentials: "include",
				}),
				invalidatesTags: ["GoverningBody"],
			}),
			deleteMember: builder.mutation<
				{ success: boolean; message: string },
				number
			>({
				query: (id) => ({
					url: `/governing-body/members/${id}`,
					method: "DELETE",
					credentials: "include",
				}),
				invalidatesTags: ["GoverningBody"],
			}),
		}),
	});

export const {
	useGetGoverningBodyQuery,
	useGetGoverningBodyPostsQuery,
	useCreatePostMutation,
	useUpdatePostMutation,
	useDeletePostMutation,
	useCreateMemberMutation,
	useUpdateMemberMutation,
	useDeleteMemberMutation,
} = governingBodyApi;
