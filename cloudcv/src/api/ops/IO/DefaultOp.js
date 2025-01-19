import {Op} from "@/api/OpBase/Op.js";

export default class DefaultOp extends Op{
    validate(args) {
        return true
    }

    apply(src){
        return src
    }
}