import { baseApi } from "../baseApi";
interface IMemberResponse {
	message: string;
	data: IUserType;
	success: boolean;
	error: boolean;
}
export const userDetailsApi = baseApi
	.enhanceEndpoints({
		addTagTypes: ["user", "user_update"],
	})
	.injectEndpoints({
		endpoints: (builder) => ({
			userDetails: builder.query<IMemberResponse, string>({
				query: (id) => ({
					url: `/auth/member/profile/${id}`,
					method: "GET",
					credentials: "include",
				}),
				providesTags: ["user"],
			}),
			updateUser: builder.mutation<
				IMemberResponse,
				{ formData: FormData; id: string }
			>({
				query: ({ formData, id }) => ({
					url: `/auth/member/update/${id}`,
					method: "PATCH",
					body: formData,
					credentials: "include",
				}),
				invalidatesTags: ["user_update"],
			}),
		}),
	});
export const { useUserDetailsQuery, useUpdateUserMutation } = userDetailsApi;
