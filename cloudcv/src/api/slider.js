import request from "@/utils/request.js";
import opsConfig from "@/config/opsConfig.json"

export function sendParam(value, serviceName, paramName){
    return request.get("/slider/router", {params: {value: value, serviceName: serviceName, paramName: paramName}});
}

export function sliderParamParser() {
    const map = new Map();

    for (let group of opsConfig) {
        for (let opInfo of group["content"])
            map.set(opInfo["name"], opInfo["param"]);
    }

    return map;
}
