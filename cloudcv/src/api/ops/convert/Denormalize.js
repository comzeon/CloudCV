import {Op} from "@/api/OpBase/Op.js"

export default class Denormalize extends Op{
    validate(args) {
        return true
    }

    apply(src){
        src = src["defaultImg"]

        let src_ = new cv.Mat()
        let dst = new cv.Mat();
        cv.normalize(src, src_, 0, 255, cv.NORM_MINMAX);
        src_.convertTo(dst, cv.CV_8U);
        src_.delete()

        return {"defaultImg": dst}
    }
}
