import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface IRegisterResponse {
	message: string;
	data: IRegisterType;
	success: boolean;
	error: boolean;
}



export const baseApi = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		credentials: "include",
	}),
	tagTypes: ["login", "logout", "register", "user"],
	endpoints: (builder) => ({
		login: builder.mutation<any, ILoginType>({
			query: (data) => ({
				url: "/auth/member/login",
				method: "POST",
				body: data,
			}),
			invalidatesTags: ["login"],
		}),
		
		register: builder.mutation<IRegisterResponse, any>({
			query: (data) => ({
				url: "/auth/member/register",
				method: "POST",
				body: data,
			}),
			invalidatesTags: ["register"],
		}),
		logout: builder.mutation<any, void>({
			query: () => ({
				url: "/auth/member/logout",
				method: "GET",
			}),
			invalidatesTags: ["logout"],
		}),
	}),
});

export const {
	useLoginMutation,
	useRegisterMutation,
	useLogoutMutation,
} = baseApi;
