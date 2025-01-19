import {Op} from "@/api/OpBase/Op.js"

export default class Normalize extends Op{
    validate(args) {
        return true
    }

    apply(src){
        src = src["defaultImg"]

        let dst = new cv.Mat();
        src.convertTo(dst, cv.CV_32F, 1.0 / 255.0);

        return {"defaultImg": dst}
    }
}
