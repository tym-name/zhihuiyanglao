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

    <Table ref="tableRef" :columns="columns" :fetch-data="staffList" @selection-change="handleSelectionChange">
        <template #buttons>
            <el-button type="success" @click="dialogFormVisible = true"><i class="iconfont icon-jia"></i>添加护工</el-button>
            <el-button type="danger" @click="delAll" :disabled="selectedIds.length === 0"><i class="iconfont icon-shanchu"></i>批量删除</el-button>
        </template>

        <template #photo="{ row }">
            <img :src="VITE_IMG_URL + row.photo" style="width: 50px;height: 50px;">
        </template>
        <template #operate="{ row }">
            <el-button link type="danger" @click="carerdel(row.id)"><i class="iconfont icon-shanchu"></i>删除</el-button>
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
    <CarerTanChang v-model="dialogFormVisible" @update:carers="handleUpdateCarers"></CarerTanChang>
</template>

<script setup lang='ts'>
import CarerTanChang from './CarerTanChang.vue'
import Table from '../../components/table.vue'
import { type TableColumn } from '../../components/table.vue';
import { staffDelete, staffDeleteAll, } from '../../api/staff/staff';
import { reactive, ref } from 'vue';
import { roleListFun } from '../../api/position/position';
import type { roleList } from '../../api/position/positionType';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { roleListFunList } from '@/api/carer/carerType';
import { staffList } from '@/api/carer/carer';
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
    menuIds: [],
})
const getstaffListFun = async () => {
    const res = await roleListFun(formss)
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
const handleSelectionChange = (selection: roleListFunList[]) => {
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
    await staffDeleteAll(selectedIds.value)
    selectedIds.value = []
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
    tableRef.value?.refresh(params)
}
// 重置
const handleReset = () => {
    form.name = ''
    form.mobile = ''
    form.roles = ''
    handleSearch()
}
const dialogFormVisible = ref(false)
// 处理护工更新事件，刷新表格数据

const handleUpdateCarers = () => {
    tableRef.value?.refresh();
}
</script>

<style scoped lang="less">
    .iconfont{
        margin-right: 5px;
    }
</style>