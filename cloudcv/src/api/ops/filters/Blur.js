import {Op} from "@/api/OpBase/Op.js"

export default class Blur extends Op{
    validate(args) {
        if (typeof args['ksize_w'] !== 'number')
            throw new Error("[Blur]: param 'ksize_w' is needed and should be a number.");
        else if (typeof args['ksize_h'] !== 'number')
            throw new Error("[Blur]: param 'ksize_h' is needed and should be a number.");
        return true
    }

    apply(src){
        src = src["defaultImg"]

        let dst = new cv.Mat();
        let ksize = new cv.Size(this.args['ksize_w'], this.args['ksize_h']);
        let anchor = new cv.Point(-1, -1);
        cv.blur(src, dst, ksize, anchor, cv.BORDER_DEFAULT);

        return {"defaultImg": dst}
    }
}
