import { getTablesApi } from "../api/Query/index.api";
import { ref, Ref } from "vue";
export const selectTableOptions: Ref<
    {
        label: string;
        value: string;
    }[]
> = ref([]);

export function initTableSelectItem() {
    getTablesApi().then((res) => {
        res.forEach((tableName: string) => {
            const temp = {
                label: "",
                value: "",
            };
            temp.label = tableName;
            temp.value = tableName;
            selectTableOptions.value.push(temp);
        });
    });
}
