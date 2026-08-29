import { baseApi } from "../baseApi";
interface IResponse {
	data: IReceiptType[];
	message: string;
	error: boolean;
	success: boolean;
	docCount: number;
	totalPages: number;
	page: number;
	limit: number;
}
export const receiptApi = baseApi
	.enhanceEndpoints({
		addTagTypes: [
			"getAllReceipt",
			"addReceipt",
			"updateReceipt",
			"deleteReceipt",
			"approveReceipt",
			"denyReceipt",
		],
	})
	.injectEndpoints({
		endpoints: (builder) => ({
			getAllReceipt: builder.query<
				IResponse,
				{ limit?: number; page?: number; search?: string }
			>({
				query: ({ limit = 10, page = 1, search = "" }) => ({
					url: "/receipt",
					params: {
						limit,
						page,
						search,
					},
					method: "GET",
					credentials: "include",
				}),
				providesTags: ["getAllReceipt"],
			}),
			addReceipt: builder.mutation<any, any>({
				query: (data) => ({
					url: "/receipt/request",
					method: "POST",
					credentials: "include",
					body: data,
				}),
				invalidatesTags: ["addReceipt"],
			}),
			approveReceipt: builder.mutation<any, { formData: any; id: string }>({
				query: ({ formData, id }) => ({
					url: `/receipt/approve/${id}`,
					method: "PATCH",
					credentials: "include",
					body: formData,
				}),
				invalidatesTags: ["approveReceipt"],
			}),
			denyReceipt: builder.mutation<any, { formData: any; id: string }>({
				query: ({ formData, id }) => ({
					url: `/receipt/deny/${id}`,
					method: "PATCH",
					credentials: "include",
					body: formData,
				}),
				invalidatesTags: ["denyReceipt"],
			}),
			deleteReceipt: builder.mutation<any, string>({
				query: (id) => ({
					url: `/receipt/delete/${id}`,
					method: "DELETE",
					credentials: "include",
				}),
				invalidatesTags: ["deleteReceipt"],
			}),
		}),
	});
export const {
	useGetAllReceiptQuery,
	useAddReceiptMutation,
	useApproveReceiptMutation,
	useDenyReceiptMutation,
	useDeleteReceiptMutation,
} = receiptApi;
