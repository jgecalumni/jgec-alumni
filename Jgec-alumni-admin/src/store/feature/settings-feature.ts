import { baseApi } from "../baseApi";

export const settingsApi = baseApi
    .enhanceEndpoints({ addTagTypes: ['settings'] })
    .injectEndpoints({
        endpoints: (builder) => ({
            getGlobalSettings: builder.query<any, void>({
                query: () => ({
                    url: '/settings/get',
                    method: 'GET',
                    credentials: 'include'
                }),
                providesTags: ['settings']
            }),
            updateGlobalSettings: builder.mutation<any, any>({
                query: (formData) => ({
                    url: '/settings/update',
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                }),
                invalidatesTags: ['settings']
            }),
        }),
    });

export const {
    useGetGlobalSettingsQuery,
    useUpdateGlobalSettingsMutation,
} = settingsApi;
