import {Op} from "@/api/OpBase/Op.js"

export default class Threshold extends Op {
    validate(args) {
        // if(typeof args['thresh'] !== "number")
        //     throw new Error("[Threshold]: param 'thresh' is needed and should be a number")
        return true
    }

    apply(src) {
        let src_ = src["defaultImg"]
        let thresh = src["value"]
        console.log(thresh)
        // if(thresh === undefined || isNaN(thresh))
        //     thresh = this.args["thresh"]

        let _src_ = new cv.Mat()
        let dst = new cv.Mat()
        cv.threshold(src_, _src_, thresh, 255, cv.THRESH_TOZERO)
        _src_.convertTo(dst, cv.CV_32F, 1.0 / 255.0)
        // try{
        //     let _src_ = new cv.Mat()
        //     let dst = new cv.Mat()
        //     let dstData = dst.data
        //     src_.convertTo(_src_, cv.CV_32F, 1.0 / 255.0);
        //     let srcData = _src_.data
        //     // cv.threshold(src_, dst, thresh, 255, cv.THRESH_TOZERO)
        //     for (let i = 0; i < dstData.length; i++) {
        //         console.log(srcData[i])
        //
        //     }
        // }catch (err){console.log(err.toString())}

        // for(let  i = 0; i < dstData.length; i ++)
        //     console.log(dstData[i])

        return {"defaultImg": dst};
    }
}
