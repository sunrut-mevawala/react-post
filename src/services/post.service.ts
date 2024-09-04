import axios from "axios";
import { baseurl } from "./creds";

const apiClient = axios.create({
    baseURL: baseurl,
    headers:{"Content-Type":"application/json"}
}); 

export const getAllPost = (url:string,config:any) =>{
    return apiClient.get(url,config);
}

export const insertPost = (postData:any ,config:any) =>{
    return apiClient.post('/insertPost',postData,config);
}

export const deletePost = (url:any,config?:any) => {
    return apiClient.delete(url,config);
}

export const updatePost = async (url: string, data: FormData, config: any) => {
      return apiClient.put(url, data, config);   
}         