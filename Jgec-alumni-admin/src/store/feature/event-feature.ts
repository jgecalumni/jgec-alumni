import { baseApi } from "../baseApi";
interface IResponse {
	data: IEventType;
	message: string;
	success: boolean;
	error: boolean;
}
export const eventApi = baseApi
	.enhanceEndpoints({
		addTagTypes: [
			"events",
			"event-details",
			"add-events",
			"edit-events",
			"delete-events",
		],
	})
	.injectEndpoints({
		endpoints: (builder) => ({
			allEvents: builder.query<
				any,
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
			getEventById: builder.query<any, string>({
				query: (id) => ({
					url: `/events/${id}`,
					method: "GET",
					credentials: "include",
				}),
				providesTags: ["event-details"],
			}),
			addEvent: builder.mutation<IResponse, any>({
				query: (event) => ({
					url: "/events/add",
					method: "POST",
					body: event,
					credentials: "include",
				}),
				invalidatesTags: ["add-events"],
			}),
			editEvent: builder.mutation<IResponse, { formData: any; id: string }>({
				query: ({ formData, id }) => ({
					url: `/events/update/${id}`,
					method: "PATCH",
					body: formData,
					credentials: "include",
				}),
				invalidatesTags: ["edit-events"],
			}),
			deleteEvent: builder.mutation<any, { id: string }>({
				query: (id) => ({
					url: `/events/delete/${id}`,
					method: "DELETE",
					credentials: "include",
				}),
				invalidatesTags: ["delete-events"],
			}),
		}),
	});

export const {
	useAllEventsQuery,
	useGetEventByIdQuery,
	useAddEventMutation,
	useEditEventMutation,
	useDeleteEventMutation,
} = eventApi;
