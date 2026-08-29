import { baseApi } from "../baseApi";
interface IResponse {
	data: any;
	message: string;
	success: boolean;
	error: boolean;
	page: number;
	totalPages: number;
}
export const galleryApi = baseApi
	.enhanceEndpoints({
		addTagTypes: ["get-category", "get-image"],
	})
	.injectEndpoints({
		endpoints: (builder) => ({
			getCategory: builder.query<
				IResponse,
				{ limit?: number; page?: number; search?: string }
			>({
				query: ({ limit = 1000, page = 1, search = "" }) => ({
					url: "/gallery/all-category",
					params: { limit, page, search },
					method: "GET",
					credentials: "include",
				}),
				providesTags: ["get-category"],
			}),

			getCategoryById: builder.query<any, string>({
				query: (id) => ({
					url: `/gallery/get-category/${id}`,
					method: "GET",
					credentials: "include",
				}),
				providesTags: ["get-image"],
			}),
		}),
	});
export const { useGetCategoryQuery, useGetCategoryByIdQuery } = galleryApi;
