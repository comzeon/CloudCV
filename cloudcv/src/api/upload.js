import request from "@/utils/request.js"

export function uploadFiles(formData){
    return request.post("/upload", formData, {
        headers:{
            'Content-Type': 'multipart/form-data',
        }
    })
}