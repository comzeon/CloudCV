import {Op} from "@/api/OpBase/Op.js"

export default class Add extends Op {
    validate(args) {
        return true
    }

    apply(src) {
        src = src["defaultImg"]
        if(! src instanceof Array)
            throw new Error("[Add]: The number of operands is needed to be 2")

        let dst = new cv.Mat();
        cv.add(src[0], src[1], dst)

        return {"defaultImg": dst};
    }
}
