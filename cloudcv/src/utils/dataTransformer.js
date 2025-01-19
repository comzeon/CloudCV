export function toForm(form){
    const formData = new FormData()
    for(const key in form)
        formData.append(key, form[key])
    return formData;
}