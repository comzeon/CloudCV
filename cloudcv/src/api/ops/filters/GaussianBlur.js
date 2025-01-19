import {Op} from "@/api/OpBase/Op.js"

export default class GaussianBlur extends Op{
    validate(args) {
        if (typeof args['ksize_w'] !== 'number')
            throw new Error("[GaussianBlur]: param 'ksize_w' is needed and should be a number.");
        else if (typeof args['ksize_h'] !== 'number')
            throw new Error("[GaussianBlur]: param 'ksize_h' is needed and should be a number.");
        else if (typeof args['sigmaX'] !== 'number')
            throw new Error("[GaussianBlur]: param 'sigmaX' is needed and should be a Number.")
        else if (typeof args['sigmaY'] !== 'number')
            throw new Error("[GaussianBlur]: param 'sigmaY' is needed and should be a Number.")
        return true
    }

    apply(src) {
        src = src["defaultImg"]

        let dst = new cv.Mat();
        let ksize = new cv.Size(this.args['ksize_w'], this.args['ksize_h']);
        let sigmaX = this.args['sigmaX'];
        let sigmaY = this.args['sigmaY'];
        cv.GaussianBlur(src, dst, ksize, sigmaX, sigmaY, cv.BORDER_DEFAULT);

        return {"defaultImg": dst}
    }
}
