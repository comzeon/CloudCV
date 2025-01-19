import opsConfig from "@/config/opsConfig.json";
import pLimit from "p-limit";
import {cloneDeep} from "lodash";

export class Worker {
    constructor(name, op, mapping={"input": "defaultImg", "output": "defaultImg"}) {
        this.name = name;
        this.op = op;
        this.mapping = mapping
    }

    adjust(name, val) {
        this.op.setter(name, val);
    }

    process(inputs) {
        return this.op.apply(inputs);
    }
}

export class Manager {
    static OpFactory = null;
    static name2Table = opsConfig.reduce((acc, group) => {
        group.content.forEach(item => {
            // 直接在 reduce 中转换 param
            acc[item.name] = {
                className: item.className,
                param: Object.keys(item.param).reduce((paramAcc, key) => {
                    paramAcc[key] = item.param[key].val;  // 提取 val
                    return paramAcc;
                }, {}),
                mapping: item.mapping
            };
        });
        return acc;
    }, {});

    static setOpFactory(OpFactory){
        Manager.OpFactory = OpFactory
    }

    constructor(cache) {
        this.workers = new Map();
        this.outputs = new Map();
        this.dependencyMap = new Map();
        this.endId = null;
        this.paramCache = new Map()
        cache.forEach((value, id) => {
            const transformedVal = {}

            for(const key in value)
                transformedVal[key] = value[key].val

            this.paramCache.set(id, transformedVal)
        })
    }

    init(images) {
        // 设置输入节点的输入
        for (let [input_node_id, image] of images) {
            this.outputs.set(input_node_id, image);
            // console.log("[init]:")
            // console.log(this.outputs.get(input_node_id))
        }
    }

    addWorker(workerId, worker) {
        this.workers.set(workerId, worker);
    }

    getOutputById(workerId){
        return this.outputs.get(workerId)
    }

    invalidateOutputs(workerId, visited = new Set()) {
        if (visited.has(workerId)) return;
        visited.add(workerId);

        if (this.outputs.has(workerId))
            this.outputs.delete(workerId);

        const successors = this.dependencyMap.get(workerId)?.linkTo || [];
        for (const successorId of successors) {
            this.invalidateOutputs(successorId, visited);
        }
    }

    async adjustById(workerId, name, val, epsilon=1e-6) {
        let worker = this.workers.get(workerId)
        // !!!!!!!!
        if(Math.abs(worker.op.args[name] - val) > epsilon) {
            worker.adjust(name, val, epsilon);
            this.invalidateOutputs(workerId);
        }
    }

    async runById(workerId, limit=5) {
        // 检查当前 Worker 是否存在
        if (!this.workers.has(workerId)) {
            throw new Error(`Worker with ID ${workerId} does not exist.`);
        }
        // 输入节点不参与处理（can be deleted）
        if(this.workers.get(workerId).name === "输入")    return

        // 如果已经输出过了则不处理
        if(this.outputs.has(workerId))  return

        // 获取当前 Worker 的前驱节点
        const predecessors = this.dependencyMap.get(workerId)?.linkFrom || [];
        let inputs = {};

        // 使用 pLimit 来限制并发数
        const limitTask = pLimit(limit);

        // 并行执行所有前驱节点（限制并发数）
        const promises = predecessors.map(predecessorId => {
            return limitTask(async () => {
                try {
                    if (!this.outputs.has(predecessorId))
                        await this.runById(predecessorId, limit); // 递归执行前驱任务
                    // 获取当前前驱节点的输出
                    const predecessorOutputs = this.outputs.get(predecessorId);

                    // 合并 `inputs` 和 `predecessorOutputs`，如果属性相同，则将值合并成一个列表
                    for (const [key, value] of Object.entries(predecessorOutputs)) {
                        if (inputs.hasOwnProperty(key)) {
                            // 如果 `inputs` 中已经有该属性，则将值合并成一个数组
                            if (Array.isArray(inputs[key])) {
                                inputs[key].push(value);  // 将值推入现有数组
                            } else {
                                inputs[key] = [inputs[key], value];  // 将现有值和新的值都放入数组
                            }
                        } else {
                            // 如果 `inputs` 中没有该属性，直接添加
                            inputs[key] = value;
                        }
                    }
                } catch (error) {
                    return { status: 'rejected', reason: error }; // 捕获错误并返回
                }
            });
        });

        // 等待所有前驱节点执行完成
        const results = await Promise.allSettled(promises);

        // 处理每个任务的结果
        results.forEach(result => {
            if (result.status === 'rejected') {
                console.error('Task failed:', result.reason); // 输出失败信息
            }
        });

        // 获取当前 Worker 并处理
        const worker = this.workers.get(workerId);
        const out = worker.process(inputs)
        this.outputs.set(workerId, out); // 更新当前节点的输出
        console.log("task pool")
        console.log(this.outputs)
    }

    async getWorkflowByNodes(nodes, visited = new Set()) {
        // 初始栈状态，选择输出节点
        const stack = [];
        let currentNode = null;

        nodes = new Map(Object.entries(nodes))
        // 寻找输出节点
        for (let [key, node] of nodes) {
            if (node.label === "输出") {
                this.endId = key
                currentNode = node;
                break;
            }
        }

        if (currentNode === null)
            throw new Error("No output node found!");

        // 将初始节点入栈
        stack.push({ node: currentNode, visitedChildren: false });

        // 使用栈来模拟递归过程
        while (stack.length > 0) {
            const { node, visitedChildren } = stack.pop();

            // 如果当前节点没有被访问过且还没有处理过子节点
            if (!visited.has(node.id)) {
                if (visitedChildren) {
                    // 如果当前节点已经处理过子节点，则添加 Worker 和依赖关系
                    visited.add(node.id);

                    const classNameAndParam = Manager.name2Table[node.label];
                    const op = await Manager.OpFactory.createInstance(classNameAndParam.className,
                        cloneDeep(this.paramCache.get(node.id)));
                    this.addWorker(node.id, new Worker(node.label, op, classNameAndParam.mapping));

                    // 更新依赖关系
                    this.dependencyMap.set(node.id, {
                        linkFrom: node.linkFrom,
                        linkTo: node.linkTo,
                    });
                } else {
                    // 如果当前节点还未访问，则标记为需要访问子节点
                    stack.push({ node, visitedChildren: true });

                    // 如果没有输入节点并且当前节点不是输入节点，则抛出异常
                    if (node.linkFrom.length === 0 && node.label !== "输入")
                        throw new Error("起始节点必须为输出节点！");

                    // 将所有依赖节点（linkFrom）推入栈中以待访问
                    for (let id of node.linkFrom)
                        stack.push({ node: nodes.get(id), visitedChildren: false })
                }
            }
        }
    }
}
