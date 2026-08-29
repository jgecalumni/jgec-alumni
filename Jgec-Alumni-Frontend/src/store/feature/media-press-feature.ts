import { baseApi } from "../baseApi";
type MediaType = "image" | "facebook" | "youtube";


interface MediaAsset {
  id: number;
  type: MediaType;
  url: string;
  newsId: number;
}


interface NewsDispatch {
  id: number;
  tag: string; 
  title: string;
  excerpt: string;
  date: string; 
  location: string;
  createdAt: string; 
  media: MediaAsset[];
}
interface IResponse {
    data: [NewsDispatch];
    
    success: boolean;
    error: boolean;
    
}
export const galleryApi = baseApi
    .enhanceEndpoints({
        addTagTypes: ["get-news"],
    })
    .injectEndpoints({
        endpoints: (builder) => ({
            getNews: builder.query<
                IResponse,
                {  search?: string }
            >({
                query: ({  search = "" }) => ({
                    url: "/media_press",
                    params: { search },
                    method: "GET",
                    credentials: "include",
                }),
                providesTags: ["get-news"],
            }),

            
        }),
    });
export const { useGetNewsQuery } = galleryApi;
