import {Sql} from '@vicons/carbon'
import {ConsoleSqlOutlined} from '@vicons/antd'
import { MenuDividerOption, MenuGroupOption, MenuOption, NIcon } from "naive-ui";
import { h, Component } from "vue";

function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) });
}

export const menuOptions:Array<MenuOption | MenuDividerOption | MenuGroupOption> = [
    {
        label: "查询",
        key: "query",
        icon: renderIcon(Sql),
    },
    {
        label: "SQL 查询",
        key: "query_by_sql",
        icon: renderIcon(ConsoleSqlOutlined),
    },
];
