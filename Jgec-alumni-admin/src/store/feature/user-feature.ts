import { baseApi } from "../baseApi";

export interface UserRecord {
    id: string;
    email: string;
    name: string;
    role: "SUPER_ADMIN" | "ADMIN";
    allowedPaths: string[];
    last_login_at: string | null;
    createdAt: string;
    updatedAt: string;
}

export const userApi = baseApi
    .enhanceEndpoints({ addTagTypes: ["Users"] })
    .injectEndpoints({
        endpoints: (builder) => ({
            getUsers: builder.query<{ success: boolean; data: UserRecord[] }, void>({
                query: () => ({
                    url: "/users",
                    method: "GET",
                    credentials: "include",
                }),
                providesTags: ["Users"],
            }),
            createUser: builder.mutation<
                { success: boolean; message: string; data?: UserRecord },
                {
                    name: string;
                    email: string;
                    password: string;
                    role?: "SUPER_ADMIN" | "ADMIN";
                    allowedPaths?: string[];
                }
            >({
                query: (body) => ({
                    url: "/users",
                    method: "POST",
                    body,
                    credentials: "include",
                }),
                invalidatesTags: ["Users"],
            }),
            updateUser: builder.mutation<
                { success: boolean; message: string; data?: UserRecord },
                {
                    id: string;
                    name?: string;
                    role?: "SUPER_ADMIN" | "ADMIN";
                    allowedPaths?: string[];
                }
            >({
                query: ({ id, ...body }) => ({
                    url: `/users/${id}`,
                    method: "PUT",
                    body,
                    credentials: "include",
                }),
                invalidatesTags: ["Users"],
            }),
            deleteUser: builder.mutation<
                { success: boolean; message: string },
                string
            >({
                query: (id) => ({
                    url: `/users/${id}`,
                    method: "DELETE",
                    credentials: "include",
                }),
                invalidatesTags: ["Users"],
            }),
            forgotPassword: builder.mutation<
                { success: boolean; message: string; debugToken?: string },
                { email: string }
            >({
                query: (body) => ({
                    url: "/users/forgot-password",
                    method: "POST",
                    body,
                    credentials: "include",
                }),
            }),
            resetPassword: builder.mutation<
                { success: boolean; message: string },
                { token: string; newPassword: string }
            >({
                query: (body) => ({
                    url: "/users/reset-password",
                    method: "POST",
                    body,
                    credentials: "include",
                }),
            }),
        }),
    });

export const {
    useGetUsersQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
} = userApi;

