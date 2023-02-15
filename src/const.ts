// Axios 配置
export let BASE_URL = "http://9t4jz4.natappfree.cc:8400/";
// 需要特殊处理的白名单 例如:这个 Api 的返回值是 Blob
export const resHelperWhitelist: [String] = ["/data/download"];
// 环境判定
switch (import.meta.env.MODE) {
    // 开发环境
    case "development":
        BASE_URL = "http://c9gcia.natappfree.cc/";
        break;
    // 生产环境
    case "production":
        BASE_URL = "http://9t4jz4.natappfree.cc:8400/";
        break;
}

// 404 页配置
// 重定向定时 (单位:秒)
export const NOT_FOUND_COUNT_DOWN_TIME: number = 3;

// 分页
// 每页大小
export const PageSizes = 1;
