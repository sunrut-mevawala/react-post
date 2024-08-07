import axios from "axios";
import {baseurl} from './creds';

const apiClient = axios.create({
    baseURL: baseurl,
    headers:{"Content-Type":"application/json"}
}); 

export const userLogin = (credentials:any, config:any) =>{
    return apiClient.post('/userLogin',credentials, config);
}
export const userRegistration = (userData:any,config:any) =>{
    return apiClient.post('/userRegistration',userData,config);
}
