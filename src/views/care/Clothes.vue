<template>
        <el-card style="margin-bottom: 10px;">
        <el-form :model="form" label-width="auto" inline>
            <el-form-item label="发布人">
                <el-input v-model="form.elderlyName" clearable placeholder="请输入姓名" style="width: 180px" />
            </el-form-item>
            <el-form-item label="发布时间">
                <el-date-picker v-model="form.addTime" type="daterange" start-placeholder="开始时间" end-placeholder="结束时间"
                    style="width: 350px" format="YYYY-MM-DD" value-format="YYYY-MM-DD" clearable />
            </el-form-item>
            <el-form-item label="类型">
                <el-select v-model="form.type" placeholder="请选择类型" clearable style="width: 180px">
                    <el-option v-for="item in typeItem" :key="item" :label="item.value" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="form.state" placeholder="请选择状态" clearable style="width: 180px">
                    <el-option v-for="item in stateItem" :key="item" :label="item.value" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="query">查询</el-button>
                <el-button @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>

    <Table ref="tableRef" :columns="columns" :fetch-data="fetchData" :init-params="form"
        @selection-change="handleSelectionChange">
        <template #buttons>
            <el-button type="success" @click="showDialog">添加</el-button>
            <el-button type="danger" @click="delAll" :disabled="selectedIds.length === 0">批量删除</el-button>
        </template>
        <template #title="{ row }">
            <el-button link type="primary" @click="showDialog(row)">
                {{ row.title }}
            </el-button>
        </template>
        <template #state="{ row }">
            <el-text :type="row.state === '已解决' ? 'success' : 'danger'">
                {{ row.state }}
            </el-text>
        </template>
        <template #operate="{ row }">
            <el-button link type="primary" @click="showDetail(row)">详情</el-button>
            <el-button link type="primary" @click="showDialog(row)">编辑</el-button>
            <el-button link type="danger" @click="clothesdel(row.id)">删除</el-button>
        </template>
    </Table>
    <ClothesDialog v-model="dialogFormVisible" :detail-data="currentDetail" />
    <AddEditClothes v-model="addeditclothes" :detail-data="currentDetail" @success="handleSuccess" />
</template>

<script setup lang='ts'>
import AddEditClothes from '../../components/clothes/AddEditClothes.vue'
import ClothesDialog from './ClothesDialog.vue'
import { reactive, ref } from 'vue'
import Table from '../../components/table.vue'
import type { TableColumn } from '../../components/table.vue';
import { clothesDelete, clothesDeleteAll, clothesList } from '../../api/clothes/clothes';
import type { ClothesList, } from '../../api/clothes/clothesType';
import { ElMessage, ElMessageBox } from 'element-plus';

// 状态
const stateItem = [
    { value: '未解决', }, { value: '已解决', }
]
// 类型
const typeItem = [
    { value: '错衣', }, { value: '缺衣', }
]

// 表单
const form = reactive<ClothesList>({
    id: 0,
    companyId: 0,
    elderlyId: 0,
    title: '',
    content: '',
    type: '',
    state: '',
    addTime: '',
    addAccountId: 0,
    addAccountName: '',
    begName: null,
    elderlyName: null,
    elderlyPhoto: null,
    elderlyGender: null,
    elderlyIdCard: null,
    houseName: null,
    buildingName: '',
    pictures: [],
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
        label: "标题",
        slot: "title",
    },
    {
        label: "发布人",
        prop: "elderlyName",
    },
    {
        label: "发布时间",
        prop: "addTime",
    },
    {
        label: "类型",
        prop: "type",
    },
    {
        label: "状态",
        slot: "state",
    },
    {
        label: "操作",
        slot: "operate",
        width: 180,
        fixed: "right",
    }
];
// 重置
const reset = () => {
    form.type = ''
    form.state = ''
    form.addTime = ''
    form.elderlyName = null
};
// 详情 
const dialogFormVisible = ref(false)
const currentDetail = ref<ClothesList>() // 存储当前详情数据
const showDetail = (row: ClothesList) => {
    currentDetail.value = row
    dialogFormVisible.value = true
}
// 新增编辑
const addeditclothes = ref(false)
const showDialog = (row?: ClothesList) => {
    currentDetail.value = row // 如果是编辑，传入当前行数据
    addeditclothes.value = true
}
// 添加成功回调
const handleSuccess = () => {
    tableRef.value?.refresh(); // 刷新表格
    ElMessage.success('操作成功');
}
// 单删
const tableRef = ref<any>(null)
const clothesdel = async (id: number) => {
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
            await clothesDelete(id)
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
const handleSelectionChange = (selection: ClothesList[]) => {
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
    await clothesDeleteAll(selectedIds.value)
    // 清空选中的ID
    selectedIds.value = []
    // 刷新表格数据
    tableRef.value?.refresh();

    ElMessage.success('删除成功')
}
// 自定义查询方法
const fetchData = async (params: any) => {
    // 处理日期范围
    const queryParams = { ...params };
    if (queryParams.addTime && Array.isArray(queryParams.addTime) && queryParams.addTime.length === 2) {
        queryParams.startTime = queryParams.addTime[0];
        queryParams.endTime = queryParams.addTime[1];
        delete queryParams.addTime;
    }
    return await clothesList(queryParams);
};

// 查询
const query = () => {
    tableRef.value?.refresh();
    ElMessage.success('查询成功');
}


</script>