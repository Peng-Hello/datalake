import {
    ConsoleSqlOutlined,
    DatabaseOutlined,
    FileSearchOutlined,
} from "@vicons/antd";

import {
    MenuDividerOption,
    MenuGroupOption,
    MenuOption,
    NIcon,
} from "naive-ui";
import { h, Component } from "vue";
import { RouterLink } from "vue-router";

function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) });
}

export const menuOptions: Array<
    MenuOption | MenuDividerOption | MenuGroupOption
> = [
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: "Query",
                    },
                },
                {
                    default: () => "Query",
                }
            ),
        key: "query",
        icon: renderIcon(FileSearchOutlined),
    },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: "QueryBySql",
                    },
                },
                {
                    default: () => "Query by SQL",
                }
            ),
        key: "query_by_sql",
        icon: renderIcon(ConsoleSqlOutlined),
    },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: "SupplyData",
                    },
                },
                {
                    default: () => "Supply data",
                }
            ),
        key: "supply_data",
        icon: renderIcon(DatabaseOutlined),
    },
];
