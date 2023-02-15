import BaseAxios from "../base_axios";
import ResHelper from "../ResHelper";
import { PageSizes } from "../../const";
import { currentPage } from "../../hooks/pagination.hook";
// 通过SQL查
export function getTableDataBySQL(sql: string) {
    return BaseAxios({
        url: `/data/sql`,
        method: "get",
        params: {
            page: currentPage.value,
            pageSize: PageSizes,
            "sqls.sqlQueries": sql,
        },
    }).then(ResHelper);
}
export function downloadTableDataBySqlApi(sql: string) {
    return BaseAxios({
        url: "data/download",
        method: "post",
        data: {
            sql,
        },
        responseType: "blob",
    });
}
