import {Op} from "@/api/OpBase/Op.js"

export default class IsEq extends Op{
    validate(args) {
        return true
    }

    apply(src){
        src = src["defaultImg"]
        if(! src instanceof Array)
            throw new Error("[IsEq]: The number of operands is needed to be 2")

        let dst = new cv.Mat()
        cv.compare(src[0], src[1], dst, cv.CMP_EQ);

        return {"mask": dst}
    }
}
