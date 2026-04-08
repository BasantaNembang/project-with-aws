import { AuthDTO } from "../types";
import api from "../utils/api";

export async function loginUser(loginForm: AuthDTO) {

    try {
        const response = await api.post('/auth/login', loginForm);
        console.log(response)
        return response.data;
    } catch (err: any) {
        console.log("first")
        console.error(err)
        throw new Error(err);
    }
}
