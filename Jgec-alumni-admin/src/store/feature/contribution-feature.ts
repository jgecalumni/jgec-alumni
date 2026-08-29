import { baseApi } from "../baseApi";

// ✅ Response types from backend
interface IStats {
	totalAmount: number;
	totalContributions: number;
	uniqueBatches: number;
	monthlyContributions: number;
}

interface IContribution {
	id?: string;
	slNo: Number;
	nameOfAluminus?: string;
	email?: string;
	mobileNo?: string;
	graduationYear?: number;
	amount?: number;
	depositedOn?: string;
	pdfLink: string;
	
}

interface IResponse {
	data: IContribution[];
	message: string;
	error: boolean;
	success: boolean;
	docCount: number;
	totalPages: number;
	page: number;
	limit: number;
	stats: IStats;
	pdfLinksAndNames: [{name: string, pdf: string, graduationYear: string}];
	allGraduationYears: number[]; // ✅ added this
}

interface IAddContribution {
	success: boolean;
	message: string;
	data: Record<string, any>;
}

// ✅ Final RTK Query API
export const contributionApi = baseApi
	.enhanceEndpoints({
		addTagTypes: [
			"getAllContribution",
			"AddAllContribution",
			"addReceipt",
			"updateReceipt",
			"deleteReceipt",
			"approveReceipt",
			"denyReceipt",
		],
	})
	.injectEndpoints({
		endpoints: (builder) => ({
			// ✅ Fetch contributions (supports pagination, search, graduationYear)
			getAllContributions: builder.query<
				IResponse,
				{
					limit?: number;
					page?: number;
					search?: string;
					graduationYear?: number | string;
				}
			>({
				query: ({
					limit = 10,
					page = 1,
					search = "",
					graduationYear = "",
				}) => ({
					url: "/contributions",
					method: "GET",
					params: {
						limit,
						page,
						search,
						graduationYear,
					},
					credentials: "include",
				}),
				providesTags: ["getAllContribution"],
			}),

			// ✅ Bulk Add Contributions
			addContributions: builder.mutation<IAddContribution, any>({
				query: (contributions) => ({
					url: "/contributions/bulk",
					method: "POST",
					body: contributions,
					credentials: "include",
				}),
				invalidatesTags: ["getAllContribution"], // changed for proper cache invalidation
			}),
		}),
	});

export const { useGetAllContributionsQuery, useAddContributionsMutation } =
	contributionApi;
