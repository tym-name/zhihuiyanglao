<template>
    <div>
        <Table ref="tableRef" @handleSelectionChange="handleSelectionChange" :columns="columns" :init-params="params"
            :fetch-data="companyList">
            <template #buttons>
                <el-button type="success" @click="dialogFormVisible"><i class="iconfont icon-jia"></i>添加</el-button>
                <el-button type="danger" @click="delAll" :disabled="isBatchDelDisabled"><i
                        class="iconfont icon-shanchu"></i>批量删除</el-button>
            </template>
            <template #search>
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="机构名称:">
                        <el-input placeholder="请输入机构名称" v-model="params.name" clearable />
                    </el-form-item>
                    <el-form-item label="管理员姓名:">
                        <el-input placeholder="请输入管理员姓名" v-model="params.adminName" clearable />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search">查询</el-button>
                        <el-button>重置</el-button>
                    </el-form-item>
                </el-form>
            </template>
            <template #operate="{ row }">
                <el-button link type="primary">重置密码</el-button>
                <el-button link type="primary">修改</el-button>
                <el-button link type="danger" @click="deleteCompany(row.id)">删除</el-button>
            </template>
        </Table>
        <SupplierEdit :handleSuccess="handleSuccess" v-if="dialogForm" v-model="dialogForm"></SupplierEdit>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { companyDeleteAll, companyList, deleteAccount } from "../../api/company/company";
import Table, { type TableColumn } from "../../components/table.vue";
import type { HomeType, InstitutionItem } from "../../api/company/companyType";
import { ElMessage, ElMessageBox } from "element-plus";
import SupplierEdit from "./CompanyEdit.vue";

onMounted(() => {
    console.log('机构列表', companyList);
})

const params = ref<HomeType>({
    name: "",
    adminName: "",
    page: 1,
    pageSize: 15
})

const tableRef = ref<any>(null)
const isBatchDelDisabled = ref(true)

const dialogForm = ref(false)
const handleSuccess = () => {
    dialogForm.value = false
    tableRef.value?.refresh()
}

const search = () => {
    tableRef.value?.refresh();
}

const dialogFormVisible = () => {
    console.log('点击添加了');
    dialogForm.value = true
}

const deleteCompany = (id: number) => {
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
            await deleteAccount(id)
            tableRef.value?.refresh();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消删除',
            })
        })
}

//要删除选中的数据
const selectionData = ref<InstitutionItem[]>([])
const handleSelectionChange = (rows: InstitutionItem[]) => {
    console.log("rows", rows);
    selectionData.value = rows;
    isBatchDelDisabled.value = rows.length === 0;
}

// 批量删除
const delAll = () => {
    ElMessageBox.confirm(
        '是否删除选中的记录？',
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
            await companyDeleteAll(selectionData.value.map(item => item.id))
        })
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
        label: "机构名称",
        prop: "name",
    },
    {
        label: "区域",
        prop: "address",
    },
    {
        label: "管理员姓名",
        prop: "adminName",
    },
    {
        label: "联系电话",
        prop: "telephone",
    },
    {
        label: "管理员账号",
        prop: "adminUserName",
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
