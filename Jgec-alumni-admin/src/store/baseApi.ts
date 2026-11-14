import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    createApi,
    fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "/v1/api",
    credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        const url = typeof args === "string" ? args : args.url;

        if (!url.includes("/auth/member/refresh") && !url.includes("/auth/member/admin/login")) {
            const refreshResult = await rawBaseQuery(
                {
                    url: "/auth/member/refresh",
                    method: "POST",
                },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                result = await rawBaseQuery(args, api, extraOptions);
            } else {
                if (typeof window !== "undefined" && window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
            }
        }
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["login", "logout", "Users"],
    endpoints: (builder) => ({
        login: builder.mutation<any, { email: string; password: string }>({
            query: (data) => ({
                url: "/auth/member/admin/login",
                method: "POST",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["login"],
        }),
        logout: builder.mutation<any, void>({
            query: () => ({
                url: "/auth/member/admin/logout",
                method: "GET",
                credentials: "include",
            }),
            invalidatesTags: ["logout"],
        }),
        getAdminMe: builder.query<{ success: boolean; user: any }, void>({
            query: () => ({
                url: "/auth/member/admin/me",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Users", "login"],
        }),
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useGetAdminMeQuery,
} = baseApi;
