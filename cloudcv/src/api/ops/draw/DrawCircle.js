import {Op} from "@/api/OpBase/Op.js"

export default class DrawCircle extends Op {
    validate(args) {
        if (typeof args['radius'] !== 'number')
            throw new Error("[DrawCircle]: param 'radius' is needed and should be a number.")
        else if (typeof args['colorB'] !== 'number')
            throw new Error("[DrawCircle]: param 'colorB' is needed and should be a number.")
        else if (typeof args['colorG'] !== 'number')
            throw new Error("[DrawCircle]: param 'colorG' is needed and should be a number.")
        else if (typeof args['colorR'] !== 'number')
            throw new Error("[DrawCircle]: param 'colorR' is needed and should be a number.")
        else if (typeof args['thickness'] !== 'number')
            throw new Error("[DrawCircle]: param 'thickness' is needed and should be a number.")
        return true
    }

    apply(src) {
        let src_ = src["defaultImg"]
        let points = src["point"]

        let dst = src_.clone();
        let color = new cv.Scalar(this.args["colorR"], this.args["colorG"], this.args["colorB"]);
        for(let point of points)
            cv.circle(dst, point, this.args["radius"], color, this.args["thickness"])

        return {"defaultImg": dst};
    }
}
