<template>
    <Table ref="tableRef" @selection-change="handleSelectionChange" :init-params="params" :columns="columns"
        :fetch-data="getCaptcha">
        <template #buttons>
            <el-button type="primary" @click="handleAdd">新增老人</el-button>
            <el-button type="danger" @click="delAll" :disabled="isBatchDelDisabled"><i
                    class="iconfont icon-shanchu"></i>批量删除</el-button>
        </template>
        <template #gender="{ row }">
            {{ row.gender === 1 ? '男' : '女' }}
        </template>
        <template #search>
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="老人姓名:">
                    <el-input placeholder="请输入老人姓名" v-model="params.name" clearable />
                </el-form-item>
                <el-form-item label="身份证号:">
                    <el-input placeholder="请输入身份证号" v-model="params.idCard" clearable />
                </el-form-item>
                <el-form-item label="床位:">
                    <CascaderBeg v-model="params.begId" @bedChange="bedChange" :type="'bed'" />
                </el-form-item>
                <el-form-item label="入住状况:">
                    <el-select placeholder="请选择入住状况" v-model="params.state" style="width: 200px">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search">查询</el-button>
                    <el-button>重置</el-button>
                </el-form-item>
            </el-form>
        </template>
        <template #operate="{ row }">
            <el-button link type="primary" @click="edit(row)"><i class="iconfont icon-bianji"></i>编辑</el-button>
            <el-button link type="primary" @click="records(row)"><i class="iconfont icon-file"></i>档案管理</el-button>
            <el-button link type="primary" @click="work(row)"><i class="iconfont icon-zxdj"></i>排班管理</el-button>
            <el-button link type="primary" @click="schedule(row)"><i class="iconfont icon-wenben"></i>计划任务</el-button>
            <el-button link type="danger" @click="deleteCompany(row.id)"><i
                    class="iconfont icon-shanchu"></i>删除</el-button>
        </template>
    </Table>
</template>

<script setup lang='ts'>
import Table, { type TableColumn } from "../../components/table.vue";
import { elderlyDelete, elderlyDeleteAll, getCaptcha } from "../../api/market/elderly";
import router from "../../router";
import { ElMessage, ElMessageBox } from "element-plus";
import { ref } from "vue";
import type { ElderlyType, PersonInfo } from "../../api/market/elderlyType";
import CascaderBeg from '@/components/form/CascaderBeg.vue'

const tableRef = ref<any>(null)
const isBatchDelDisabled = ref(true)

// 查询参数
const params = ref<ElderlyType>({
    name: '',
    idCard: '',
    begId: 0,
    state: null
})

let bedChange = (idArr: number[]) => {
    params.value.begId = idArr[idArr.length - 1]
}

// 搜索
const search = () => {
    tableRef.value?.refresh();
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
        label: "头像",
        image: "photo",
    },
    {
        label: "老人姓名",
        prop: "name",
    },
    {
        label: "性别",
        prop: "state",
        slot: "gender",
    },
    {
        label: "身份证号",
        prop: "idCard",
        width: 180,
    },
    {
        label: "床位",
        prop: "begName",
    },
    {
        label: "状态",
        prop: "stateName",
    },
    {
        label: "操作",
        slot: "operate",
        width: 520,
        fixed: "right",
    }
];

const options = [
    {
        value: '1',
        label: '未签约',
    },
    {
        value: '2',
        label: '预定中',
    },
    {
        value: '3',
        label: '已住院',
    }
]

// 新增老人
const handleAdd = () => {
    router.push('/elderly-edit');
};

const edit = (row: PersonInfo) => {
    console.log('点击修改老人', row);
    router.push(`/elderly-edit?id=${row.id}`)
};

const records = (row: PersonInfo) => {
    router.push(`/elderly-records?id=${row.id}`)
};

const work = (row: PersonInfo) => {
    router.push(`/elderly-work?id=${row.id}`)
};

const schedule = (row: PersonInfo) => {
    router.push(`/elderly-schedule?id=${row.id}`)
};

// 单个删除
const deleteCompany = (id: number) => {
    ElMessageBox.confirm(
        '是否删除该条记录？',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: "warning"
        }
    )
        .then(async () => {
            await elderlyDelete(id); // 先执行删除接口
            ElMessage({
                type: 'success',
                message: '删除成功',
            });
            tableRef.value?.refresh();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消删除',
            })
        })
}

// 选中的数据
const selectionData = ref<PersonInfo[]>([])
// 批量删除
const delAll = () => {
    if (selectionData.value.length === 0) return;

    ElMessageBox.confirm(
        `是否删除选中的 ${selectionData.value.length} 条记录？`,
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: "warning"
        }
    )
        .then(async () => {
            const ids = selectionData.value.map((item) => item.id);
            await elderlyDeleteAll(ids); // 执行批量删除接口
            ElMessage({
                type: 'success',
                message: '批量删除成功',
            });
            tableRef.value?.getData();
            isBatchDelDisabled.value = true; // 重置禁用状态
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消删除',
            })
        })
}

// 监听表格选中数据变化
const handleSelectionChange = (rows: PersonInfo[]) => {
    console.log("选中的数据：", rows);
    selectionData.value = rows;
    isBatchDelDisabled.value = rows.length === 0;
}
</script>

<style scoped lang='less'>
.iconfont {
    margin: 5px;
}

.demo-form-inline {
    height: 35px;
}
</style>