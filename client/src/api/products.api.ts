import axiosInstance from "./AxiosInstance";
import type { Product } from "../utils/Interface.utils";

export async function fetchProducts({
  search,
  category,
}: {
  search: string;
  category: string;
}): Promise<Product[]> {
  const params: Record<string, string> = {};
  if (search && search.trim().length > 0) params.search = search.trim();
  if (category && category.trim().length > 0) params.category = category.trim();

  const res = await axiosInstance.get("/products", { params });
  // backend responds with an array of products (possibly empty)
  return res.data;
}


export async function deleteProoduct(id:string) {
  const res=await axiosInstance.delete(`/admin/deleteProduct/${id}`)
  return res.data
  
}