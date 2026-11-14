import { baseApi } from "../baseApi";

export interface IGoverningBodyMember {
	id: number;
	name: string;
	timeline: string;
	image: string;
	image_public_id?: string;
	order: number;
	postId: number;
}

export interface IGoverningBodyPost {
	id: number;
	title: string;
	post: string;
	order: number;
	members: IGoverningBodyMember[];
	member: IGoverningBodyMember[];
}

export interface IGoverningBodyResponse {
	success: boolean;
	data: IGoverningBodyPost[];
}

export const governingBodyApi = baseApi
	.enhanceEndpoints({ addTagTypes: ["governing-body"] })
	.injectEndpoints({
		endpoints: (builder) => ({
			getGoverningBody: builder.query<IGoverningBodyResponse, void>({
				query: () => ({
					url: "/governing-body",
					method: "GET",
					credentials: "include",
				}),
				providesTags: ["governing-body"],
			}),
		}),
	});

export const { useGetGoverningBodyQuery } = governingBodyApi;
