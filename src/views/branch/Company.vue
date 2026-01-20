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
                        <el-button @click="reset">重置</el-button>
                    </el-form-item>
                </el-form>
            </template>
            <template #operate="{ row }">
                <el-button link type="primary">重置密码</el-button>
                <el-button link type="primary" @click="updCompany(row.id)">修改</el-button>
                <el-button link type="danger" @click="deleteCompany(row.id)">删除</el-button>
            </template>
        </Table>
        <SupplierEdit :is-add="isAdd" :editData="editData" :handleSuccess="handleSuccess" v-model="dialogForm" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { companyDeleteAll, companyGet, companyList, deleteAccount } from "../../api/company/company";
import Table, { type TableColumn } from "../../components/table.vue";
import type { HomeType, InstitutionItem } from "../../api/company/companyType";
import { ElMessage, ElMessageBox } from "element-plus";
import SupplierEdit from "./CompanyEdit.vue";

onMounted(() => {
    console.log('机构列表', companyList);
})

//定义一个false值，用于判断是添加还是修改 true是添加 false是修改
const isAdd = ref(false)

const params = ref<HomeType>({
    name: "",
    adminName: "",
    page: 1,
    pageSize: 15
})

const tableRef = ref<any>(null)
const isBatchDelDisabled = ref(true)

const dialogForm = ref(false)
// 添加编辑数据的响应式变量
const editData = ref()

const handleSuccess = () => {
    dialogForm.value = false
    // 清空编辑数据
    editData.value = {}
    tableRef.value?.refresh()
}

const reset = () => {
    params.value = {
        name: "",
        adminName: "",
        page: 1,
        pageSize: 15
    }
    tableRef.value?.refresh();
}

const search = () => {
    tableRef.value?.refresh();
}

const dialogFormVisible = () => {
    isAdd.value = true
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
            try {
                await deleteAccount(id)
                ElMessage({
                    type: 'success',
                    message: '删除成功',
                })
                tableRef.value?.refresh();
            } catch (error) {
                ElMessage({
                    type: 'error',
                    message: '删除失败',
                })
            }
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
    if (selectionData.value.length === 0) return

    ElMessageBox.confirm(
        '是否删除选中的记录？',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
        }
    )
        .then(async () => {
            try {
                await companyDeleteAll(selectionData.value.map(item => item.id))
                ElMessage({
                    type: 'success',
                    message: '删除成功',
                })
                tableRef.value?.refresh();
                selectionData.value = []
                isBatchDelDisabled.value = true
            } catch (error) {
                ElMessage({
                    type: 'error',
                    message: '删除失败',
                })
            }
        })
}

//点击修改判断是修改的接口和获取单条机构信息并且回显修改表单
const updCompany = async (id: number) => {
    try {
        isAdd.value = false
        const res = await companyGet(id)
        console.log('获取单条机构信息', res);
        // 将获取的数据赋值给editData
        editData.value = { ...res.data }
        dialogForm.value = true
    } catch (error) {
        ElMessage({
            type: 'error',
            message: '获取机构信息失败',
        })
    }
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