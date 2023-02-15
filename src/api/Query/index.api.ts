import BaseAxios from "../base_axios";
import ResHelper from "../ResHelper";
import type { PostQueryForm } from "../../type/postQueryForm.type";
import { PageSizes } from "../../const";
import { currentPage } from "../../hooks/pagination.hook";
// 获取表集合
export function getTablesApi() {
    return BaseAxios.get("/data/getTables").then(ResHelper);
}
// 按条件查询表数据
export function getTableDataByConditionApi(form: PostQueryForm) {
    const { id, text, timestamp, source, symbols, company_name, table } = form;
    return BaseAxios({
        url: `data/selectCondition`,
        method: "get",
        params: {
            page: currentPage.value,
            pageSize: PageSizes,
            table,
            companyName: company_name,
            endTime: timestamp ? timestamp[1] : null,
            id,
            source,
            startTime: timestamp ? timestamp![0] : null,
            symbols,
            text,
        },
    }).then(ResHelper);
}

export function downloadTableDataByConditionApi(form: PostQueryForm) {
    const { id, text, timestamp, source, symbols, company_name, table } = form;
    return BaseAxios({
        url: "data/download",
        method: "post",
        data: {
            page: currentPage.value,
            pageSize: PageSizes,
            table,
            companyName: company_name,
            endTime: timestamp ? timestamp[1] : null,
            id,
            source,
            startTime: timestamp ? timestamp![0] : null,
            symbols,
            text,
        },
        responseType: "blob",
    });
}
