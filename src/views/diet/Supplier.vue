<template>
    <div>
        <Table ref="tableRef" @handleSelectionChange="handleSelectionChange" :columns="columns" :init-params="params"
            :fetch-data="supplierList">
            <template #buttons>
                <el-button type="success" @click="dialogFormVisible"><i class="iconfont icon-jia"></i>添加</el-button>
                <el-button type="danger" @click="delAll" :disabled="isBatchDelDisabled"><i style="margin-right: 5px;"
                        class="iconfont icon-shanchu"></i>批量删除</el-button>
            </template>
            <template #operate="{ row }">
                <el-button link type="primary" @click="supplierUpd(row)"><span
                        style="font-size: 14px; margin-right: 5px;" class="iconfont icon-bianji"></span>编辑</el-button>
                <el-button link type="danger" @click="deleteSupplier(row.id)"><span
                        style="font-size: 14px; margin-right: 5px;" class="iconfont icon-shanchu"></span>删除</el-button>
            </template>
        </Table>
        <SupplierEdit :handleSuccess="handleSuccess" v-if="dialogForm" v-model="dialogForm"></SupplierEdit>
        <SupplierUpdate :upd="upd"  v-if="dialogForm2" v-model="dialogForm2"></SupplierUpdate>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Table, { type TableColumn } from "../../components/table.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { supplierDelete, supplierDeleteAll, supplierGet, supplierList } from "../../api/supplier/Supplier";
import type { supplier, SupplierItem } from "../../api/supplier/SupplierType";
import SupplierEdit from "./SupplierEdit.vue";
import SupplierUpdate from "./SupplierUpdate.vue";
const params = ref<supplier>({
    page: 1,
    pageSize: 15
})
const dialogForm = ref(false)

const dialogForm2 = ref(false)

const tableRef = ref<any>(null)
const isBatchDelDisabled = ref(true)
const dialogFormVisible = () => {
    dialogForm.value = true
}

const deleteSupplier = (id: number) => {
    ElMessageBox.confirm(
        '是否删除该条记录？',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
        }
    )
        .then(async () => {
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            await supplierDelete(id)
            tableRef.value?.refresh();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消删除',
            })
        })
}

// 编辑
const supplierUpd = async (row: any) => {
    dialogForm2.value = true
    // let res = await supplierGet(id)
    // console.log('根据id获取供应商', res);
    console.log(row);
    // 实现回显
    dialogForm2.value = row
}
const upd = (row: any) => {
    supplierUpd(row)
}

const handleSuccess = () => {
    dialogForm.value = false
    tableRef.value?.refresh()
}

//要删除选中的数据
const selectionData = ref<SupplierItem[]>([])
const handleSelectionChange = (rows: SupplierItem[]) => {
    console.log("rows", rows);
    selectionData.value = rows;
    isBatchDelDisabled.value = rows.length === 0;
}

const delAll = async () => {
    let ids: number[] = selectionData.value.map((item) => item.id);
    await supplierDeleteAll(ids)
    tableRef.value?.getData();
}

const columns: TableColumn[] = [
    {
        type: "selection",
        width: "50",
    },

    {
        label: "序号",
        prop: "id",
        width: "100px",
    },
    {
        label: "供应商名称",
        prop: "name",
    },
    {
        label: "供给食材数",
        prop: "foodCounts",
    },
    {
        label: "联系人",
        prop: "linkMan",
    },
    {
        label: "联系电话",
        prop: "mobile",
    },
    {
        label: "操作",
        slot: "operate",
        width: 180,
        fixed: "right",
    }
];
</script>

<style scoped lang="less">
.demo-form-inline {
    height: 35px;
}
</style>
