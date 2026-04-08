import api from "../utils/api";

export type VideoItem = {
    id: string;
    title: string;
    thumbnail: string;
    date: string;
};

export type PaginatedVideoResponse = {
    content: VideoItem[];
    number: number;
    last: boolean;
};


export async function getAllVideosInfo(pageParam: number): Promise<PaginatedVideoResponse> {
    try {
        const response = await api.get(`/video/get?page=${pageParam}&size=3`);
        return response.data;
    } catch (err: any) {
        throw new Error(err);
    }
}


export async function getAllVideoURL(id: string) {
    try {
        const response = await api.get('/video/get/' + id);
        if (response.status === 200) {
            return response;
        }
    } catch (err: any) {
        throw new Error(err);
    }
}



export async function saveVideo(video: File, title: string) {
    const formData = new FormData();
    formData.append("video", video);
    formData.append("title", title);
    try {
        const response = await api.post('/video/save', formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        console.log('response')
        console.log(response)
        if (response.status === 200) {
            return true;
        }
    } catch (err: any) {
        throw new Error(err);
    }
}


