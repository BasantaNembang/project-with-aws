import axios, { Axios, AxiosError } from "axios";
import api from "../utils/api";

export type ImageItem = {
    id: string;
    url: string;
    caption: string;
    timestamp: string;
};

export type PaginatedResponse = {
    content: ImageItem[];
    number: number;
    last: boolean;
};

export async function getAllIMAGES() {
    try {
        const response = await api.get('/image/get-all');
        if (response.status === 200) {
            return response;
        }
    } catch (err: any) {
        throw new Error(err);
    }
}

export async function getPaginationImage(pageParam: number): Promise<PaginatedResponse> {
    try {
        const response = await api.get(`/image/get?page=${pageParam}&size=2`);
        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            if (error?.response?.status === 403) {
                throw new Error("Login")
            }
        }
        throw new Error("some unknown errorr ");
    }

}


export async function saveImage(image: File, caption: string) {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);
    try {
        const response = await api.post('/image/save', formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        if (response.status === 200) {
            return true;
        }
    } catch (err: any) {
        throw new Error(err);
    }
}


