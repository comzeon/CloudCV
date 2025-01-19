class Op {
    constructor(args) {
        if(this.validate(args))
            this.args = args
        else    throw new Error("Construction failed due to invalid args!")
    }

    validate(args){
        throw new Error("Method validate must be implemented!")
    }

    getter(){
        return this.args
    }

    setter(name, val){
        if(this.args[name] === undefined)
            console.log(name + " is undefined parameter!")
        else{this.args[name] = val}
    }

    apply(src){
        throw new Error("Method apply must be implemented!")
    }
}

const modules = import.meta.glob("../ops/**/*.js");

const OpFactory = {
    registry: {},

    // 用于指示加载是否完成
    loading: false,

    // 提供一个Promise，保证在类加载完成后再进行实例化操作
    ready: null,

    async loadAllClasses() {
        // 如果已经在加载中，直接返回
        if (this.loading) return this.ready;

        this.loading = true;
        this.ready = new Promise(async (resolve, reject) => {
            try {
                // 遍历所有模块并动态加载
                const modulePromises = Object.keys(modules).map(async (moduleKey) => {
                    const module = await modules[moduleKey](); // 加载模块
                    if (module.default) {
                        const className = moduleKey.split("/").pop().replace(".js", ""); // 假设文件名就是类名
                        this.register(className, module.default); // 注册类
                    } else {
                        console.warn(`Default export not found in ${moduleKey}`);
                    }
                });

                // 等待所有模块加载完成
                await Promise.all(modulePromises);
                this.loading = false;
                resolve(); // 所有模块加载完成后，resolve Promise
            } catch (err) {
                this.loading = false;
                reject(err); // 如果加载失败，reject Promise
            }
        });

        return this.ready; // 返回一个 Promise，在类加载完成时会被解析
    },

    async getRegistry() {
        await this.ready
        return this.registry
    },

    async register(name, cls) {
        await this.ready
        if (this.registry[name]) {
            throw new Error(`Class ${name} is already registered.`);
        }
        this.registry[name] = cls;
    },

    async getClass(name) {
        await this.ready
        // 优先从注册表中获取
        if (this.registry[name]) {
            return this.registry[name];
        }
        throw new Error(`Class ${name} not found.`);
    },

    async createInstance(name, args) {
        await this.ready; // 确保类加载完成
        const cls = await this.getClass(name);
        return new cls(args);
    }
};

// 先加载所有类
OpFactory.loadAllClasses().then(() => {
    console.log("所有类已加载并注册", OpFactory.registry);
}).catch(err => {
    console.error("加载类时出错", err);
});

export { Op, OpFactory };
