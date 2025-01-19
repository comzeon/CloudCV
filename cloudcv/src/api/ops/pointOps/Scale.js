import {Op} from "@/api/OpBase/Op.js"

export default class Scale extends Op {
    validate(args) {
        if(typeof args['scale'] !== "number")
            throw new Error("[Times]: param 'scale' is needed and should be a number")
        return true
    }

    apply(src) {
        src = src["value"]
        return {"value": src["value"] * this.args['scale']}
    }
}
