import { baseApi } from "../baseApi";
interface IResponse {
	data: any;
	message: string;
	success: boolean;
	error: boolean;
	page: number;
	totalPages: number;
	totalCount?: number;
}
export const galleryApi = baseApi
	.enhanceEndpoints({
		addTagTypes: [
			"create-category",
			"get-category",
			"update-category",
			"delete-category",
			"upload-image",
			"delete-image",
			"get-image",
		],
	})
	.injectEndpoints({
		endpoints: (builder) => ({
			createCategory: builder.mutation<IResponse, any>({
				query: (category) => ({
					url: "/gallery/add-category",
					method: "POST",
					body: category,
					credentials: "include",
				}),
				invalidatesTags: ["create-category"],
			}),
			getCategory: builder.query<
				IResponse,
				{ limit?: number; page?: number; search?: string }
			>({
				query: ({ limit = 10, page = 1, search = "" }) => ({
					url: "/gallery/all-category",
					params: { limit, page, search },
					method: "GET",
					credentials: "include",
				}),
				providesTags: ["get-category"],
			}),
			updateCategory: builder.mutation<any, { id: string; values: any }>({
				query: ({ id, values }) => ({
					url: `/gallery/update-category/${id}`,
					method: "PATCH",
					credentials: "include",
					body: values,
				}),
				invalidatesTags: ["update-category"],
			}),
			deleteCategory: builder.mutation<any, string>({
				query: (id) => ({
					url: `/gallery/delete-category/${id}`,
					method: "DELETE",
					credentials: "include",
				}),
				invalidatesTags: ["delete-category"],
			}),
			uploadImage: builder.mutation<
				IResponse,
				{ formData: FormData; id: string }
			>({
				query: ({ formData, id }) => ({
					url: `/gallery/add-images/${id}`,
					method: "POST",
					body: formData,
					credentials: "include",
				}),
				invalidatesTags: ["upload-image"],
			}),
			deleteImage: builder.mutation<any, string>({
				query: (id) => ({
					url: `/gallery/delete-image/${id}`,
					method: "DELETE",
					credentials: "include",
				}),
				invalidatesTags: ["delete-image"],
			}),
			getImageById: builder.query<any, string>({
				query: (id) => ({
					url: `/gallery/get-image/${id}`,
					method: "GET",
					credentials: "include",
				}),
				providesTags: ["get-image"],
			}),
		}),
	});
export const {
	useCreateCategoryMutation,
	useGetCategoryQuery,
	useUpdateCategoryMutation,
	useDeleteCategoryMutation,
	useUploadImageMutation,
	useDeleteImageMutation,
	useGetImageByIdQuery,
} = galleryApi;
