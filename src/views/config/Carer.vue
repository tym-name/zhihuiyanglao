<template>
    <el-card style="margin-bottom: 10px;">
        <el-form :model="form" label-width="auto" inline>
            <el-form-item label="护工姓名:">
                <el-input v-model="form.name" clearable placeholder="请输入护工姓名" style="width: 180px" />
            </el-form-item>
            <el-form-item label="联系方式:">
                <el-input v-model="form.mobile" clearable placeholder="请输入联系方式" style="width: 180px" />
            </el-form-item>
            <el-form-item label="所属岗位">
                <el-select v-model="form.roles" placeholder="请选择岗位" clearable style="width: 180px">
                    <el-option v-for="item in roleItem" :key="item" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button @click="handleReset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>

    <Table ref="tableRef" :columns="columns" :fetch-data="staffListFun" @selection-change="handleSelectionChange">
        <template #buttons>
            <el-button type="success">添加护工</el-button>
            <el-button type="danger" @click="delAll" :disabled="selectedIds.length === 0">批量删除</el-button>
        </template>

        <template #photo="{ row }">
            <img :src="VITE_IMG_URL + row.photo" style="width: 50px;height: 50px;">
        </template>
        <template #operate="{ row }">
            <el-button link type="danger" @click="carerdel(row.id)">删除</el-button>
        </template>
        <template #enable="{ row }">
            {{ row.enable === 1 ? '否' : '是' }}
        </template>
        <template #name="{ row }">
            <div v-for="role in row.roles" :key="role.id">
                {{ role.name }}
            </div>
        </template>
    </Table>
</template>

<script setup lang='ts'>
import Table from '../../components/table.vue'
import { type TableColumn } from '../../components/table.vue';
import { staffDelete, staffDeleteAll, staffListFun } from '../../api/staff/staff';
import type { staffList, } from '../../api/staff/staffType';
import { reactive, ref } from 'vue';
import { roleListFun } from '../../api/position/position';
import type { roleList } from '../../api/position/positionType';
import { ElMessage, ElMessageBox } from 'element-plus';
import { number } from 'echarts';
const VITE_IMG_URL = 'http://123.57.237.81:8080/caresystem/'

// 表单
const form = reactive({
    name: '',
    mobile: '',
    roles: '',
})
// 表格
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
        label: "头像",
        slot: "photo",
    },
    {
        label: "姓名",
        prop: "name",
    },
    {
        label: "联系方式",
        prop: "mobile",
    },
    {
        label: "所属岗位",
        slot: "name",
    },
    {
        label: "操作",
        slot: "operate",
        width: 180,
        fixed: "right",
    }
]

// 所属岗位
const roleItem = ref<roleList[]>([])
const formss = reactive<roleList>({
    id: 0,
    name: '',
    companyId: 0,
    addAccountId: 0,
    addAccountName: '',
    addTime: '',
    accountCounts: 0,
    menuIds: undefined,
})
const getstaffListFun = async () => {
    const res = await roleListFun(formss)
    console.log('所属岗位', res);
    roleItem.value = res.data.list
}
getstaffListFun()

// 单删
const tableRef = ref()
const carerdel = async (id: number) => {
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
            await staffDelete(id)
            tableRef.value?.refresh();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消删除',
            })
        })
}
// 批量删除
const selectedIds = ref<number[]>([])
//表格选择变化事件
const handleSelectionChange = (selection: staffList[]) => {
    selectedIds.value = selection.map(item => item.id)
}
const delAll = async () => {
    if (selectedIds.value.length === 0) return

    await ElMessageBox.confirm(
        `确定删除这${selectedIds.value.length}项数据吗? 删除后无法恢复`,
        '警告',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
    // 传递选中的ID数组给后端
    await staffDeleteAll(selectedIds.value)
    // 清空选中的ID
    selectedIds.value = []
    // 刷新表格数据
    tableRef.value?.refresh();

    ElMessage.success('删除成功')
}

// 查询
const handleSearch = () => {
    // 处理查询参数，只传递有值的字段
    const params: any = {
        ...form
    }
    // 移除空值
    for (const key in params) {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
            delete params[key]
        }
    }
    // 调用表格的refresh方法，传入查询参数
    tableRef.value?.refresh(params)
}

// 重置
const handleReset = () => {
    // 重置表单数据
    form.name = ''
    form.mobile = ''
    form.roles = ''
    // 调用查询方法，刷新表格
    handleSearch()
}

</script>