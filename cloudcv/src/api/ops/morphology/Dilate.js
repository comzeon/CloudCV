import {Op} from "@/api/OpBase/Op.js"

export default class Dilate extends Op{
    validate(args) {
        if (typeof args['iterations'] !== 'number')
            throw new Error("[Dilate]: param 'iterations' is needed and should be a number.")
        else if (typeof args['ksize_w'] !== 'number')
            throw new Error("[Dilate]: param 'ksize_w' is needed and should be a number.")
        else if (typeof args['ksize_h'] !== 'number')
            throw new Error("[Dilate]: param 'ksize_h' is needed and should be a number.")
        return true
    }

    apply(src){
        src = src["defaultImg"]

        let dst = new cv.Mat();
        console.log(this.args)
        let kernel = cv.Mat.ones(this.args['ksize_w'], this.args['ksize_h'], cv.CV_8U);
        let anchor = new cv.Point(-1, -1);
        cv.dilate(src, dst, kernel, anchor, this.args["iterations"], cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());

        return {"defaultImg": dst}
    }
}
