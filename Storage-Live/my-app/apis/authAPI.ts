import axios from "axios";
import { AuthDTO } from "../types";
import api from "../utils/api";

export async function loginUser(loginForm: AuthDTO) {
    try {
        const response = await api.post('/auth/login', loginForm);
        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            if (error?.response?.status === 403) {
                return 403;
            }
        }
        throw new Error(error);
    }
}


export async function isLoggedIn() {
    try {
        const response = await api.get('/auth/check');
        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            if (error?.response?.status === 403) {
                return 403;
            }
        }
        throw new Error(error);
    }
}


export async function logOut() {
    try {
        const response = await api.post('/auth/logout');
        return response.status;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            if (error?.response?.status === 403) {
                return 403;
            }
        }
        throw new Error(error);
    }
}
