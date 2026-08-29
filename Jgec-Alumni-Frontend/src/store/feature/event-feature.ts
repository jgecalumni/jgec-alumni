import { baseApi } from "../baseApi";
interface IGetAllEventsRes {
	events: IEventType[];
	message: string;
	success: boolean;
	error: boolean;
	limit: number;
	page: number;
	docCount: number;
	totalPages: any;
	totalCount: number;
}
interface IResponse {
	data: IEventType;
	message: string;
	success: boolean;
	error: boolean;
}
export const eventApi = baseApi
	.enhanceEndpoints({
		addTagTypes: ["events", "event-details"],
	})
	.injectEndpoints({
		endpoints: (builder) => ({
			allEvents: builder.query<
				IGetAllEventsRes,
				{ limit?: number; page?: number; search?: string }
			>({
				query: ({ limit = 10, page = 1, search = "" }) => ({
					url: "/events",
					params: { limit, page, search },
					method: "GET",
					credentials: "include",
				}),
				providesTags: ["events"],
			}),
			getEventById: builder.query<IResponse, string >({
				query: (id) => ({
					url: `/events/${id}`,
					method: "GET",
					credentials: "include",
				}),
				providesTags: ["event-details"],
			}),
		}),
	});

export const { useAllEventsQuery, useGetEventByIdQuery } = eventApi;
