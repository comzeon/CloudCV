import {Op} from "@/api/OpBase/Op.js"

export default class MedianBlur extends Op{
    validate(args) {
        if (typeof args['ksize'] !== 'number')
            throw new Error("[MedianBlur]: param 'ksize' is needed and should be a number.");
        return true
    }

    apply(src){
        src = src["defaultImg"]

        let dst = new cv.Mat();
        cv.medianBlur(src, dst, this.args['ksize']);

        return {"defaultImg": dst}
    }
}
