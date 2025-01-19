import {Op} from "@/api/OpBase/Op.js"

export default class BGR2GRAY extends Op{
    validate(args) {
        return true
    }

    apply(src){
        src = src["defaultImg"]

        let dst = new cv.Mat();
        cv.cvtColor(src, dst, cv.COLOR_BGR2GRAY, 0);

        return {"defaultImg": dst}
    }
}
