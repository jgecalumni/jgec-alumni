import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        credentials: "include",
    }),
    tagTypes: ["login",'logout'],
    endpoints: (builder) => ({
        login: builder.mutation<any, {
            email: string;
            password: string;
        }>({
            query: (data) => ({
                url: "/auth/member/admin/login",
                method: "POST",
                body: data, 
                credentials: "include"
            }),
            invalidatesTags: ["login"],
        }),
        logout: builder.mutation<any, void>({
            query: () => ({
                url: "/auth/member/admin/logout",
                method: "GET",
                // credentials: "include"
            }),
            invalidatesTags: ["logout"],
        }),
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
} = baseApi;