<template>
    <div>
        <Table ref="tableRef" :columns="columns" :init-params="params" :fetch-data="goOutList">
            <template #buttons>
                <el-button type="success" @click="addGoOut"><i class="iconfont icon-jia"></i>添加</el-button>
                <el-button type="danger" :disabled="isBatchDelDisabled"><i
                        class="iconfont icon-shanchu"></i>批量删除</el-button>
            </template>
            <template #search>
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="老人姓名:">
                        <el-input placeholder="请输入老人姓名" v-model="params.name" clearable />
                    </el-form-item>
                    <el-form-item label="审批状态:">
                        <el-select placeholder="请选择状态" v-model="params.adminName" clearable style="width: 200px;">
                            <el-option label="未返回" value="pending" />
                            <el-option label="已返回" value="approved" />
                            <el-option label="逾期未返回" value="rejected" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="外出时间:">
                        <el-date-picker v-model="value1" type="daterange" range-separator="-" start-placeholder="开始日期"
                            end-placeholder="结束日期" :size="size" style="width: 200px;" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search">查询</el-button>
                        <el-button @click="reset">重置</el-button>
                    </el-form-item>
                </el-form>
            </template>
            <template #operate="{ row }" style="font-size: 12px;">
                <el-button link type="primary">查看详情</el-button>
                <el-button link type="primary"><i class="iconfont icon-bianji"></i>修改</el-button>
                <el-button link type="danger" @click="delGoGout(row.id)"><i
                        class="iconfont icon-shanchu"></i>删除</el-button>
            </template>
        </Table>
        <GoOutAdd :is-add="isAdd" :editData="editData" :handleSuccess="handleSuccess" v-model="dialogForm"></GoOutAdd>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Table, { type TableColumn } from "../../components/table.vue";
import { goOutDelete, goOutList } from "../../api/goout/goout";
import type { goOutType } from "../../api/goout/gooutType";
import GoOutAdd from "./GoOutAdd.vue";
import { ElMessage, ElMessageBox } from "element-plus";


const size = ref<'default' | 'large' | 'small'>('default')

const value1 = ref('')

//定义一个false值，用于判断是添加还是修改 true是添加 false是修改
const isAdd = ref(false)
// 添加编辑数据的响应式变量
const editData = ref()

const dialogForm = ref(false)
const handleSuccess = () => {
    dialogForm.value = false
    // 清空编辑数据
    editData.value = {}
    tableRef.value?.refresh()
}

// 添加
const addGoOut = () => {
    isAdd.value = true
    console.log('点击添加了');
    dialogForm.value = true
}

// 扩展类型定义以包含搜索参数
interface GoOutSearchParams extends goOutType {
    name?: string;
    adminName?: string;
}



onMounted(() => {
    console.log('外出登记列表', goOutList);
})

const isBatchDelDisabled = ref(true)

// 声明 tableRef 变量
const tableRef = ref<InstanceType<typeof Table> | null>(null);

const params = ref<GoOutSearchParams>({
    page: 1,
    pageSize: 15,
    name: "",           // 添加搜索字段
    adminName: ""       // 添加搜索字段
})

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





// 删除
const delGoGout = (id: number) => {
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
            await goOutDelete(id)
            tableRef.value?.refresh();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消删除',
            })
        })
}

const columns: TableColumn[] = [
    {
        type: "selection",
        width: "30",
    },
    {
        label: "序号",
        prop: "id",
        width: "100px",
    },
    {
        label: "老人姓名",
        prop: "elderlyName",
    },
    {
        label: "床位号",
        prop: "begName",
    },
    {
        label: "陪同人姓名",
        prop: "name",
    },
    {
        label: "陪同人手机号",
        prop: "mobile",
        width: "150px",
    },
    {
        label: "外出时间",
        // prop: `substring(startTime, 0, 10)`,  // 修正为正确的属性名
        prop: "startTime",
    },
    {
        label: "上报人",
        prop: "addAccountName", // 修正为正确的属性名
    },
    {
        label: "上报时间",
        prop: "addTime", // 修正为正确的属性名
    },
    {
        label: "审批状态",
        prop: 'stateName', // 修正为正确的属性名
    },
    {
        label: "操作",
        slot: "operate",
        width: 250,
        fixed: "right",
    }
];
</script>
