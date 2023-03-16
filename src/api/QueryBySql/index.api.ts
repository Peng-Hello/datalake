import BaseAxios from '../base_axios'
import ResHelper from '../ResHelper'
import { PageSizes } from '../../const'
import { currentPage } from '../../ts/data-table/pagination'
// 通过SQL查
export function getTableDataBySQL(sql: string) {
  return BaseAxios({
    url: `/data/sql`,
    method: 'get',
    params: {
      page: currentPage.value,
      pageSize: PageSizes,
      'sqls.sqlQueries': sql
    }
  }).then((res) => {
    return res.data
  })
}
export function downloadTableDataBySqlApi(sql: string) {
  return BaseAxios({
    url: 'data/download',
    method: 'post',
    data: {
      sql
    },
    responseType: 'blob'
  })
}
