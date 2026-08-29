import { baseApi } from "../baseApi";

export const scholarshipApi = baseApi
    .enhanceEndpoints({ addTagTypes: ['scholarship', 'scholarship-details', 'add-scholarships', 'edit-scholarships', 'delete-scholarships'] })
    .injectEndpoints({
        endpoints: (builder) => ({
            allScholarships: builder.query<any, { limit?: number, page?: number, search?: string }>({
                query: ({ limit = 10, page = 1, search = "" }) => ({
                    url: '/scholarships/admin',
                    params: { limit, page, search },
                    method: 'GET',
                    credentials: 'include'
                }),
                providesTags: ['scholarship']
            }),
            scholarships: builder.query<any, string>({
                query: (id) => ({
                    url: `/scholarships/${id}`,
                    method: 'GET',
                    credentials: 'include'
                }),
                providesTags: ['scholarship-details']
            }),
            getScholarshipApplications: builder.query<any, { id: string, limit?: number, page?: number, search?: string }>({
                query: ({ id, limit = 10, page = 1, search = "" }) => ({
                    url: `/scholarships/applications`,
                    params: { limit, page, scholarshipId: id, search },
                    method: 'GET',
                    credentials: 'include'
                }),
            }),
            addScholarships: builder.mutation<any, any >({
                query: (formData) => ({
                    url: '/scholarships/add',
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                }),
                invalidatesTags: ['add-scholarships']
            }),
            editScholarships: builder.mutation<any, { id: string, formData: FormData }>({
                query: ({ id, formData }) => ({
                    url: `/scholarships/update/${id}`,
                    method: 'PATCH',
                    credentials: 'include',
                    body: formData
                }),
                invalidatesTags: ['edit-scholarships']
            }),
            deleteScholarships: builder.mutation<any, string>({
                query: (id) => ({
                    url: `/scholarships/delete/${id}`,
                    method: 'DELETE',
                    credentials: 'include'
                }),
                invalidatesTags: ['delete-scholarships']
            }),
            deleteScholarshipApplication: builder.mutation<any, string>({
                query: (id) => ({
                    url: `/scholarships/applicants/delete/${id}`,
                    method: 'DELETE',
                    credentials: 'include'
                }),
            }),
        }),
    });

export const {
    useAllScholarshipsQuery,
    useScholarshipsQuery,
    useAddScholarshipsMutation,
    useEditScholarshipsMutation,
    useDeleteScholarshipsMutation,
    useGetScholarshipApplicationsQuery,
    useLazyGetScholarshipApplicationsQuery,
    useDeleteScholarshipApplicationMutation
} = scholarshipApi;