<template>
    <el-dialog v-model="dialogFormVisible" title="新增护工" :before-close="handleClose">
        <el-form :model="formss" inline>
            <el-form-item label="护工姓名:">
                <el-input v-model="formss.name" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="所属岗位">
                <el-select v-model="formss.menuIds" placeholder="请选择岗位" clearable style="width: 180px">
                    <el-option v-for="item in roleItem" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch">
                    查询
                </el-button>
                <el-button @click="handleReset">重置</el-button>
            </el-form-item>
        </el-form>
        <Table ref="tableRef" :columns="columns" :fetch-data="staffList">
            <template #photo="{ row }">
                <img :src="VITE_IMG_URL + row.photo" style="width: 50px;height: 50px;">
            </template>
            <template #operate="{ row }">
                <el-button :type="selectedCarers.includes(row.id) ? 'danger' : 'primary'" @click="toggleSelect(row)">
                    {{ selectedCarers.includes(row.id) ? '取消选择' : '选择' }}
                </el-button>
            </template>
        </Table>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleCancel">取消</el-button>
                <el-button type="primary" @click="submitCarers">提交</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang='ts'>
import Table, { type TableColumn } from '../../components/table.vue'
import { roleListFun } from '@/api/position/position';
import type { roleList } from '@/api/position/positionType';
import { reactive, ref, watch } from 'vue';
import { staffList, staffCarerAdd } from '@/api/carer/carer';
import { ElMessage } from 'element-plus';
const VITE_IMG_URL = 'http://123.57.237.81:8080/caresystem/'

// 接收v-model绑定的值
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})

// 定义事件
const emit = defineEmits(['update:modelValue', 'update:carers'])

// 内部弹窗状态
const dialogFormVisible = ref(props.modelValue)

// 监听外部modelValue变化，更新内部状态
watch(
    () => props.modelValue,
    (newValue) => {
        dialogFormVisible.value = newValue
    }
)

// 监听内部状态变化，通知外部
watch(
    dialogFormVisible,
    (newValue) => {
        emit('update:modelValue', newValue)
    }
)

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

// 选择的护工ID列表
const selectedCarers = ref<number[]>([])

// 表格
const columns: TableColumn[] = [
    {
        label: "头像",
        slot: "photo",
    },
    {
        label: "姓名",
        prop: "name",
    },
    {
        label: "手机号",
        prop: "mobile",
    },
    {
        label: "财务部",
        slot: "adminUserName",
    },
    {
        label: "岗位",
        slot: "roles",
    },
    {
        label: "操作",
        slot: "operate",
        width: 180,
        fixed: "right",
    }
]
const getstaffListFun = async () => {
    const res = await roleListFun(formss)
    console.log('所属岗位', res);
    roleItem.value = res.data.list
}
getstaffListFun()

// 表格引用
const tableRef = ref<any>(null)

// 查询
const handleSearch = () => {
    // 处理查询参数，只传递有值的字段
    const params: any = {
        ...formss
    }
    // 移除空值
    for (const key in params) {
        if (params[key] === '' || params[key] === null || params[key] === undefined || (Array.isArray(params[key]) && params[key].length === 0)) {
            delete params[key]
        }
    }
    // 调用表格的refresh方法，传入查询参数
    tableRef.value?.refresh(params)
}

// 重置
const handleReset = () => {
    // 重置表单数据
    formss.name = ''
    formss.menuIds = []
    // 调用查询方法，刷新表格
    handleSearch()
}

// 切换选择状态
const toggleSelect = (row: any) => {
    const index = selectedCarers.value.indexOf(row.id)
    if (index > -1) {
        // 取消选择
        selectedCarers.value.splice(index, 1)
    } else {
        // 选择
        selectedCarers.value.push(row.id)
    }
}

// 提交护工到管理
const submitCarers = async () => {
    if (selectedCarers.value.length === 0) {
        ElMessage.warning('请至少选择一名护工')
        return
    }
    try {
        const res = await staffCarerAdd(selectedCarers.value)
        if (res.code === 10000) {
            ElMessage.success('提交成功')
            dialogFormVisible.value = false
            // 清空选择列表
            selectedCarers.value = []
            // 通知父组件更新数据
            emit('update:carers')
        } else {
            ElMessage.error(res.msg || '提交失败')
        }
    } catch (error) {
        ElMessage.error('提交失败，请重试')
    }
}

// 关闭对话框前清空选择
const handleClose = () => {
    selectedCarers.value = []
}

// 取消按钮点击事件
const handleCancel = () => {
    selectedCarers.value = []
    dialogFormVisible.value = false
}


</script>