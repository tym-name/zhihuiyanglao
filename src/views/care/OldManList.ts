// import type { TableColumn } from "../../components/Table/Table.vue";

import type { TableColumn } from "../../components/table.vue";

// import type { TableColumn } from "../../components/Table/Table.vue";

export const oldman: TableColumn[] = [

    {
        label: "姓名",
        prop: "name",
        width: "100px"
    },
    {
        label: "头像",
        image: 'photo',
        width: "200px",
        
    },
    {
        label: "性别",
        // slot:"gender",
        prop: "gender", 
        width: "100px"
    },
    {
        label: "身份证号",
        prop: "idCard", 
        width: "200px"
    },
    {
        label: "操作",
        slot: "button", 
        fixed: "right",
    },
    
];