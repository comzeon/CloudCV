import {Op} from "@/api/OpBase/Op.js"

export default class Times extends Op {
    validate(args) {
        if(typeof args['scale'] !== "number")
            throw new Error("[Times]: param 'scale' is needed and should be a number")
        return true
    }

    apply(src) {
        src = src["defaultImg"]

        let dst = new cv.Mat();
        cv.multiply(src, new cv.Mat(src.rows, src.cols, src.type(), new cv.Scalar(this.args['scale'])), dst)

        return {"defaultImg": dst};
    }
}
