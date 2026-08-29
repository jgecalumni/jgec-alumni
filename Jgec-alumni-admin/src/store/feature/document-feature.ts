import { baseApi } from "../baseApi";

interface IGetAllDocsRes {
	response: any;
	message: string;
	success: boolean;
	error: boolean;
}

interface IResponse {
	data: any;
	message: string;
	success: boolean;
	error: boolean;
}

export interface INotice {
	title: string;
	link?: string;
}

export const docsApi = baseApi
	.enhanceEndpoints({
		addTagTypes: [
			"getAllScholarshipsDocs",
			"addScholarshipsDocs",
			"deleteScholarshipsDocs",
			"updateScholDocs",
			"getAllkanchenjungaDocs",
			"addkanchenjungaDocs",
			"deletekanchenjungaDocs",
			"updatekanchenjungaDocs",
			"getAllGivingBackDocs",
			"addGivingBackDocs",
			"deleteGivingBackDocs",
			"updateGivingBackDocs",
			"getAllauditReportDocs",
			"addauditReportDocs",
			"deleteauditReportDocs",
			"updateauditReportDocs",
			"getAllAgmMomDocs",
			"addAgmMomDocs",
			"deleteAgmMomDocs",
			"updateAgmMomDocs",
		],
	})
	.injectEndpoints({
		endpoints: (builder) => ({
			getAllScholDocs: builder.query<IGetAllDocsRes, any>({
				query: () => ({
					url: "/documents/scholarshipDocs",
					method: "GET",
					credentials: "include",
				}),
				providesTags: ["getAllScholarshipsDocs"],
			}),
			addScholDocs: builder.mutation<IResponse, any>({
				query: (data) => ({
					url: "/documents/add/scholarshipDocs",
					method: "POST",
					credentials: "include",
					body: data,
				}),
				invalidatesTags: ["addScholarshipsDocs"],
			}),
			updateScholDocs: builder.mutation<
				IResponse,
				{ formData: any; id: string }
			>({
				query: ({ formData, id }) => ({
					url: `/documents/update/scholarshipDocs/${id}`,
					method: "PATCH",
					credentials: "include",
					body: formData,
				}),
				invalidatesTags: ["updateScholDocs"],
			}),
			deleteScholDocs: builder.mutation<IResponse, string>({
				query: (id) => ({
					url: `/documents/delete/scholarshipDocs/${id}`,
					method: "DELETE",
					credentials: "include",
				}),
				invalidatesTags: ["deleteScholarshipsDocs"],
			}),
			getAllKanchenungaDocs: builder.query<IGetAllDocsRes, any>({
				query: () => ({
					url: "/documents/kanchenjungaDocs",
					method: "GET",
					credentials: "include",
				}),
				providesTags: ["getAllkanchenjungaDocs"],
			}),
			addKanchenungaDocs: builder.mutation<IResponse, any>({
				query: (data) => ({
					url: "/documents/add/kanchenjungaDocs",
					method: "POST",
					credentials: "include",
					body: data,
				}),
				invalidatesTags: ["addkanchenjungaDocs"],
			}),
			updateKanchenungaDocs: builder.mutation<
				IResponse,
				{ formData: any; id: string }
			>({
				query: ({ formData, id }) => ({
					url: `/documents/update/kanchenjungaDocs/${id}`,
					method: "PATCH",
					credentials: "include",
					body: formData,
				}),
				invalidatesTags: ["updatekanchenjungaDocs"],
			}),
			deleteKanchenungaDocs: builder.mutation<IResponse, string>({
				query: (id) => ({
					url: `/documents/delete/kanchenjungaDocs/${id}`,
					method: "DELETE",
					credentials: "include",
				}),
				invalidatesTags: ["deletekanchenjungaDocs"],
			}),

			getAllGivingBackDocs: builder.query<IGetAllDocsRes, any>({
				query: () => ({
					url: "/documents/givingBackDocs",
					method: "GET",
					credentials: "include",
				}),
				providesTags: ["getAllGivingBackDocs"],
			}),
			addGivingBackDocs: builder.mutation<IResponse, any>({
				query: (data) => ({
					url: "/documents/add/givingBackDocs",
					method: "POST",
					credentials: "include",
					body: data,
				}),
				invalidatesTags: ["addGivingBackDocs"],
			}),
			updateGivingBackDocs: builder.mutation<
				IResponse,
				{ formData: any; id: string }
			>({
				query: ({ formData, id }) => ({
					url: `/documents/update/givingBackDocs/${id}`,
					method: "PATCH",
					credentials: "include",
					body: formData,
				}),
				invalidatesTags: ["updateGivingBackDocs"],
			}),
			deleteGivingBackDocs: builder.mutation<IResponse, string>({
				query: (id) => ({
					url: `/documents/delete/givingBackDocs/${id}`,
					method: "DELETE",
					credentials: "include",
				}),
				invalidatesTags: ["deleteGivingBackDocs"],
			}),

			getAllauditReportDocs: builder.query<IGetAllDocsRes, any>({
				query: () => ({
					url: "/documents/auditReportDocs",
					method: "GET",
					credentials: "include",
				}),
				providesTags: ["getAllauditReportDocs"],
			}),
			addauditReportDocs: builder.mutation<IResponse, any>({
				query: (data) => ({
					url: "/documents/add/auditReportDocs",
					method: "POST",
					credentials: "include",
					body: data,
				}),
				invalidatesTags: ["addauditReportDocs"],
			}),
			updateauditReportDocs: builder.mutation<
				IResponse,
				{ formData: any; id: string }
			>({
				query: ({ formData, id }) => ({
					url: `/documents/update/auditReportDocs/${id}`,
					method: "PATCH",
					credentials: "include",
					body: formData,
				}),
				invalidatesTags: ["updateauditReportDocs"],
			}),
			deleteauditReportDocs: builder.mutation<IResponse, string>({
				query: (id) => ({
					url: `/documents/delete/auditReportDocs/${id}`,
					method: "DELETE",
					credentials: "include",
				}),
				invalidatesTags: ["deleteauditReportDocs"],
			}),
			addAgmMomDocs: builder.mutation<IResponse, any>({
				query: (data) => ({
					url: "/documents/add/AgmMomDocs",
					method: "POST",
					credentials: "include",
					body: data,
				}),
				invalidatesTags: ["addAgmMomDocs"],
			}),
			updateAgmMomDocs: builder.mutation<
				IResponse,
				{ formData: any; id: string }
			>({
				query: ({ formData, id }) => ({
					url: `/documents/update/AgmMomDocs/${id}`,
					method: "PATCH",
					credentials: "include",
					body: formData,
				}),
				invalidatesTags: ["updateAgmMomDocs"],
			}),
			deleteAgmMomDocs: builder.mutation<IResponse, string>({
				query: (id) => ({
					url: `/documents/delete/AgmMomDocs/${id}`,
					method: "DELETE",
					credentials: "include",
				}),
				invalidatesTags: ["deleteAgmMomDocs"],
			}),
			getAllAgmMomDocs: builder.query<IGetAllDocsRes, any>({
				query: () => ({
					url: "/documents/AgmMomDocs",
					method: "GET",
					credentials: "include",
				}),
				providesTags: ["getAllAgmMomDocs"],
			}),
		}),
	});

export const {
	useGetAllScholDocsQuery,
	useAddScholDocsMutation,
	useDeleteScholDocsMutation,
	useUpdateScholDocsMutation,
	useAddKanchenungaDocsMutation,
	useDeleteKanchenungaDocsMutation,
	useGetAllKanchenungaDocsQuery,
	useUpdateKanchenungaDocsMutation,
	useAddGivingBackDocsMutation,
	useDeleteGivingBackDocsMutation,
	useGetAllGivingBackDocsQuery,
	useUpdateGivingBackDocsMutation,
	useAddauditReportDocsMutation,
	useDeleteauditReportDocsMutation,
	useUpdateauditReportDocsMutation,
	useGetAllauditReportDocsQuery,
	useGetAllAgmMomDocsQuery,
	useAddAgmMomDocsMutation,
	useDeleteAgmMomDocsMutation,
	useUpdateAgmMomDocsMutation,
} = docsApi;
