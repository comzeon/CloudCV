import {defineStore} from "pinia";
import {ref} from "vue";

export const useSliderCache = defineStore('sliderCache', () => {
    const cache = ref(new Map())
    const name = ref(null)
    const id = ref(null)
    const getter = (key) => cache.value.get(key) || {}
    const getName = () => {if(name.value !== null)    return name.value}
    const getId = () => {if(id.value !== null)    return id.value}
    const update = (key, val) => cache.value.set(key, val)
    const rename = (val) => name.value = val
    const setId = (val) => id.value = val
    const remove = (key) => cache.value.delete(key)

    const destroy = () => {cache.value = new Map();name.value = null;id.value = null;}

    return {cache, name, id, getter, getName, getId, update, rename, setId, remove}
})