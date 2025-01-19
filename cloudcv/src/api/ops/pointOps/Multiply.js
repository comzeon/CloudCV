import {Op} from "@/api/OpBase/Op.js"

export default class Multiply extends Op {
    validate(args) {
        if(typeof args['scale'] !== "number")
            throw new Error("[Multiply]: param 'scale' is needed and should be a number")
        return true
    }

    apply(src) {
        src = src["defaultImg"]
        if(! src instanceof Array)
            throw new Error("[Multiply]: The number of operands is needed to be 2")

        let dst = new cv.Mat();
        cv.multiply(src[0], src[1], dst, this.args['scale'])

        return {"defaultImg": dst};
    }
}
