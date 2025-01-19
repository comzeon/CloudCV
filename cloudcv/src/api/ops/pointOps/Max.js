import {Op} from "@/api/OpBase/Op.js"

export default class Max extends Op {
    validate(args) {
        return true
    }

    apply(src) {
        src = src["defaultImg"]

        let maxVal = null
        maxVal = cv.minMaxLoc(src).maxVal
        console.log(maxVal)

        return {"value": maxVal};
    }
}
