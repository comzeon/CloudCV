import {Op} from "@/api/OpBase/Op.js"

export default class GammaCorrection extends Op{
    validate(args){
        if (typeof args['gamma'] !== 'number')
            throw new Error("[GammaCorrection]: param 'gamma' is needed and should be a number.")
        return true
    }

    apply(src) {
        src = src["defaultImg"]

        let dst = new cv.Mat(src.rows, src.cols, src.type());
        const data = src.data;
        const dstData = dst.data;

        // 遍历每个像素并进行 gamma 校正
        for (let i = 0; i < data.length; i++) {
            // 对每个像素的通道进行处理
            dstData[i] = Math.pow(data[i] / 255.0, this.args['gamma']) * 255;  // Gamma 校正
        }

        return {"defaultImg": dst};
    }
}