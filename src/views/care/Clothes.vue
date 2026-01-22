<template>
    <div>
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
                <el-button type="primary">查询</el-button>
                <el-button>重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>

    <Table ref="tableRef" :columns="columns" :fetch-data="clothesList">
        <template #title="{ row }">
            <!-- showDialog -->
            <el-button link type="primary" @click="addeditclothes = true">
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
            <el-button link type="primary">编辑</el-button>
            <el-button link type="danger">删除</el-button>
        </template>
    </Table>
    <ClothesDialog v-model="dialogFormVisible" :detail-data="currentDetail"></ClothesDialog>
    <AddEditClothes v-model="addeditclothes"></AddEditClothes>
    </div>
    
</template>

<script setup lang='ts'>
import AddEditClothes from '../../components/clothes/AddEditClothes.vue'
import ClothesDialog from './ClothesDialog.vue'
import { reactive, ref } from 'vue'
import Table from '../../components/table.vue'
import type { TableColumn } from '../../components/table.vue';
import { clothesList } from '../../api/clothes/clothes';
import type { ClothesList, } from '../../api/clothes/clothesType';


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
// 详情 
const dialogFormVisible = ref(false)
const currentDetail = ref<ClothesList>() // 存储当前详情数据
const showDetail = (row: ClothesList) => {
    currentDetail.value = row
    dialogFormVisible.value = true
}
// 新增编辑
const addeditclothes = ref(false)

</script>