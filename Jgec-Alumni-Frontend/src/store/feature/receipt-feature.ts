import { baseApi } from "../baseApi";
interface IResponse {
	message: string;
	data: IUserType;
	success: boolean;
	error: boolean;
}
export const receiptApi = baseApi
	.enhanceEndpoints({
		addTagTypes: ["addReceipt"],
	})
	.injectEndpoints({
		endpoints: (builder) => ({
			addReceipt: builder.mutation<IResponse, any>({
				query: (data) => ({
					url: "/receipt/request",
					method: "POST",
					credentials: "include",
					body: data,
				}),
				invalidatesTags: ["addReceipt"],
			}),
		}),
	});
export const { useAddReceiptMutation } = receiptApi;
