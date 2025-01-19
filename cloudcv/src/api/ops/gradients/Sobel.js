import {Op} from "@/api/OpBase/Op.js"

export default class Sobel extends Op{
    validate(args) {
        if (args['dx'] !== 0 && args['dx'] !== 1)
            throw new Error("[Sobel]: param 'dx' is needed to be 0 or 1.");
        else if (args['dy'] !== 0 && args['dy'] !== 1)
            throw new Error("[Sobel]: param 'dy' is needed to be 0 or 1.");
        else if (typeof args['ksize'] !== 'number')
            throw new Error("[Sobel]: param 'ksize' is needed and should be a number.");
        return true
    }

    apply(src){
        src = src["defaultImg"]

        let dst = new cv.Mat();
        cv.Sobel(src, dst, cv.CV_32F, this.args['dx'], this.args['dy'], this.args['ksize'], 1, 0, cv.BORDER_DEFAULT);

        return {"defaultImg": dst}
    }
}
