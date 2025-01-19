import axios from "axios";

// !!!!!!!!!!!!!!!!!!!!IF YOU USE INSTANCE,YOU MUST KEEP THE URL PARAM THE SAME WITH THE CONTROLLER, ESPECIALLY WHEN THE
// !!!!!!!!!!!!!!!!!!!!METHOD IS POST
export const baseURL = 'http://localhost:8000';
const loginURL = 'http://localhost:5173/user/login'
const instance = axios.create({baseURL});

instance.interceptors.response.use(
    result =>{
            if(!result.data || result.data.code === 0)
            {
                    window.setTimeout(()=>{alert(result.data.message)}, 100);
            }
            return result.data;
            },
    err =>{
            if(err.response.status === 401){
                if(!(window.location.href === loginURL))
                    window.location.href = loginURL;
                return;
            }
            window.setTimeout('alert("服务异常")', 100);
            return Promise.reject(err);
    }
)
export default instance;