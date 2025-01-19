import {Op} from "@/api/OpBase/Op.js"

export default class ToFloat32 extends Op{
    validate(args) {
        return true
    }

    apply(src){
        src = src["defaultImg"]

        let dst = new cv.Mat();
        src.convertTo(dst, cv.CV_32F);

        return {"defaultImg": dst}
    }
}
