import { baseApi } from "../baseApi";

interface IGetAllNoticeRes {
	notices: INoticeType[];
	message: string;
	success: boolean;
	error: boolean;
	limit: number;
	page: number;
	totalPages: number;
	totalCount: number;
}
interface IResponse {
	data: INoticeType;
	message: string;
	success: boolean;
	error: boolean;
}

export const noticeApi = baseApi
	.enhanceEndpoints({ addTagTypes: ["notices", "notice-details"] })
	.injectEndpoints({
		endpoints: (builder) => ({
			getAllNotices: builder.query<
				IGetAllNoticeRes,
				{ limit?: number; page?: number }
			>({
				query: () => ({
					url: "/notice",
					method: "GET",
					credentials: "include",
				}),
				providesTags: ["notices"],
			}),
			getNoticeDetails: builder.query<IResponse, number>({
				query: (id) => ({
					url: `/notice/${id}`,
					method: "GET",
					credentials: "include",
				}),
				providesTags: ["notice-details"],
			}),
		}),
	});

export const { useGetAllNoticesQuery, useGetNoticeDetailsQuery } = noticeApi;
