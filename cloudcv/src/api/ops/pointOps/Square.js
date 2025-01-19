import {Op} from "@/api/OpBase/Op.js"

export default class Square extends Op {
    validate(args) {
        return true
    }

    apply(src) {
        src = src["defaultImg"]

        let dst = new cv.Mat();
        cv.multiply(src, src.clone(), dst, 1, cv.CV_32F)

        return {"defaultImg": dst};
    }
}
