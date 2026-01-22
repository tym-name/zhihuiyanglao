// import type { TableColumn } from "../../components/Table/Table.vue";

import type { TableColumn } from "../../components/table.vue";

// import type { TableColumn } from "../../components/Table/Table.vue";

export const columns: TableColumn[] = [
    {
        type: "selection",
        width: "50"
    },

    {
        label: "序号",
        prop: "id",
        width: "100px"
    },
    {
        label: "老人姓名",
        prop: "elderlyName", // 老人姓名字段名
        width: "100px"
    },
    {
        label: "床位号",
        prop: "begName"
    },
    {
        label: "陪同人姓名",
        prop: "name",
    },
    {
        label: "陪同人手机号",
        prop: "mobile",
    },
    {
        label: "外出时间",
        prop: "startTime",
        
        
    },
    {
        label: "上报人",
        prop: "addAccountName",
    },
    {
        label: "上报时间",
        prop: "addTime",
    },
    {
        label: "审批状态",
        prop: "stateName",
    },
    {
        label: "操作",
        slot: "operate",
        // width: 180,
        fixed: "right",
    }
];