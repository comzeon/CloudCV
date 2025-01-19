import {Op} from "@/api/OpBase/Op.js"

export default class BitwiseAnd extends Op{
    validate(args) {
        return true
    }

    apply(src){
        let src_ = src["defaultImg"]
        let mask = src["mask"]

        let dst = new cv.Mat()
        cv.bitwise_and(src_, src_, dst, mask);

        // console.log(dst.channels())
        //
        // for(let i = 0; i < dst.rows; i ++)
        //     for(let j = 0; j < dst.cols; j ++){
        //         if(dst.ucharAt(i, j) !== 0){
        //             console.log(dst.ucharAt(i, j))
        //             cv.circle(dst, new cv.Point(i, j), 10, new cv.Scalar(255, 0, 0), 2)
        //         }
        //     }
        return {"defaultImg": dst}
    }
}
