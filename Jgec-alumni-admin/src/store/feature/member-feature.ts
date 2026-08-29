import { baseApi } from "../baseApi";

export const memberApi = baseApi
    .enhanceEndpoints({ addTagTypes: ['members', 'member-details'] })
    .injectEndpoints({
        endpoints: (builder) => ({
            getAllMembers: builder.query<any, { limit?: number, page?: number, search?: string }>({
                query: ({ limit = 10, page = 1, search = "" }) => ({
                    url: '/auth/member',
                    params: { limit, page, search },
                    method: 'GET',
                    credentials: 'include'
                }),
                providesTags: ['members']
            }),
            memberDetails: builder.query<any, string>({
                query: (id) => ({
                    url: `/auth/member/profile/${id}`,
                    method: 'GET',
                    credentials: 'include'
                }),
                providesTags: ['member-details']
            }),
        }),
    });

export const {
    useGetAllMembersQuery,
    useMemberDetailsQuery
} = memberApi;