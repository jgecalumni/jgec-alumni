import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    createApi,
    fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

const redirectToLogin = (): void => {
    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
    }
};

const rawBaseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "/v1/api",
    credentials: "include",
});

let refreshPromise: Promise<boolean> | null = null;

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error && (result.error.status === 401 || result.error.status === 403)) {
        const requestUrl = typeof args === "string" ? args : args.url;
        const isAuthEndpoint =
            requestUrl.includes("/auth/member/admin/login") ||
            requestUrl.includes("/auth/member/refresh");

        if (!isAuthEndpoint) {
            if (!refreshPromise) {
                refreshPromise = (async () => {
                    try {
                        const refreshResult = await rawBaseQuery(
                            {
                                url: "/auth/member/refresh",
                                method: "POST",
                                credentials: "include",
                            },
                            api,
                            extraOptions
                        );

                        if (refreshResult.data) {
                            const responseData = refreshResult.data as {
                                success?: boolean;
                            };
                            if (responseData.success) {
                                return true;
                            }
                        }
                        redirectToLogin();
                        return false;
                    } catch {
                        redirectToLogin();
                        return false;
                    } finally {
                        refreshPromise = null;
                    }
                })();
            }

            const refreshSuccess = await refreshPromise;
            if (refreshSuccess) {
                result = await rawBaseQuery(args, api, extraOptions);
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
        login: builder.mutation<any, {
            email: string;
            password: string;
        }>({
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
