import { baseApi } from "../baseApi";


interface IGetAllNoticeRes {
    notices: INoticeType[],
    message: string,
    success: boolean,
    error: boolean,
    limit: number,
    page: number,
    totalPages: number,
    totalCount: number
}

interface IResponse {
    data: INoticeType,
    message: string,
    success: boolean,
    error: boolean
}

export interface INotice {
    title: string,
    description: string,
    link?: string
    date: string
}

export const noticeApi = baseApi
    .enhanceEndpoints({ addTagTypes: ['notices', 'notice-details', 'add-notice', 'delete-notice', 'edit-notice'] })
    .injectEndpoints({
        endpoints: (builder) => ({
            getAllNotices: builder.query<IGetAllNoticeRes, { limit?: number, page?: number }>({
                query: () => ({
                    url: '/notice',
                    method: 'GET',
                    credentials: 'include'
                }),
                providesTags: ['notices']
            }),
            getNoticeDetails: builder.query<IResponse, number>({
                query: (id) => ({
                    url: `/notice/${id}`,
                    method: 'GET',
                    credentials: 'include'
                }),
                providesTags: ['notice-details']
            }),
            addNewNotice: builder.mutation<IResponse, any>({
                query: (notice) => ({
                    url: '/notice/add',
                    method: 'POST',
                    credentials: 'include',
                    body: notice
                }),
                invalidatesTags: ['add-notice']
            }),
            updateNotice: builder.mutation<IResponse, { formData: any, id: string }>({
                query: ({ formData, id }) => ({
                    url: `/notice/update/${id}`,
                    method: 'PATCH',
                    credentials: 'include',
                    body: formData
                }),
                invalidatesTags: ['edit-notice']
            }),
            deleteNotice: builder.mutation<IResponse, string>({
                query: (id) => ({
                    url: `/notice/delete/${id}`, 
                    method: 'DELETE',
                    credentials: 'include'
                }),
                invalidatesTags: ['delete-notice']
            }),
        }),

    });

export const {
    useGetAllNoticesQuery,
    useGetNoticeDetailsQuery,
    useAddNewNoticeMutation,
    useUpdateNoticeMutation,
    useDeleteNoticeMutation
} = noticeApi;