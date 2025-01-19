import {Op} from "@/api/OpBase/Op.js"

export default class NonZero extends Op{
    validate(args) {
        return true
    }

    apply(src){
        src = src["defaultImg"]

        let points = []

        for (let y = 0; y < src.rows; y++) {
            for (let x = 0; x < src.cols; x++) {
                // 获取当前像素的灰度值
                let grayValue = src.ucharPtr(y, x)[0];

                // 检查像素值是否不为0
                if (Math.abs(grayValue) > 1e-6)
                    points.push(new cv.Point(x, y))

            }
        }

        // let points = [];
        // for (let i = 0; i < src.rows; i++)
        //     for (let j = 0; j < src.cols; j++) {
        //         console.log(src.ucharAt(i, j))
        //         if (Math.abs(src.ucharAt(i, j)) > 1e-6)
        //             points.push(new cv.Point(i, j));
        //     }

        return {"point": points}
    }
}
