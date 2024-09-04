import axios from "axios";
import { baseurl } from "./creds";

const apiClient = axios.create({
    baseURL: baseurl,
    headers:{"Content-Type":"application/json"}
}); 

export const getAllCategories = (url:string, config:any) =>{
    return apiClient.get(url,config);
}

export const insertCategory = (categoryData:any, config:any) =>{
    return apiClient.post('/insertCategory',categoryData,config);
}


export const getAllProducts = (url:string,config:any) =>{
    return apiClient.get(url,config);
}

export const insertProduct = (productData:any ,config:any) =>{
    return apiClient.post('/insertProduct',productData,config);
}

export const deleteProduct = (url:any,config?:any) => {
    return apiClient.delete(url,config);
}

export const updateProduct = async (url: string, data: FormData, config: any) => {
      return apiClient.put(url, data, config);   
}         