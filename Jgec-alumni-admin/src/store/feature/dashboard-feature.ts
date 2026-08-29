import { baseApi } from "../baseApi";

interface IResponse {
    data: {
        members: number,
        scholarships: number,
        notices: number,
        gallery: number,
        events: number
    },
    message: string,
    success: boolean,
    error: boolean
}

export const dashboardApi = baseApi
    .enhanceEndpoints({ addTagTypes: ['count'] })
    .injectEndpoints({
        endpoints: (builder) => ({
            getCount: builder.query<IResponse, void>({
                query: () => ({
                    url: '/all-count',
                    method: 'GET',
                    credentials: 'include'
                }),
                providesTags: ['count']
            })
        }),

    });

export const { useGetCountQuery } = dashboardApi;