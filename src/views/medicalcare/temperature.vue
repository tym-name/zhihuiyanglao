<template>
    <div>
        <Table ref="tableRef" @handleSelectionChange="handleSelectionChange" :columns="columns" :init-params="searchForm"
            :fetch-data="temperatureList">
            <template #buttons>
                <el-button type="success" @click="addTemperature"><i class="iconfont icon-jia"></i>添加</el-button>
                <el-button type="danger" :disabled="isBatchDelDisabled"><i style="margin-right: 5px;"
                        class="iconfont icon-shanchu"></i>批量删除</el-button>
            </template>
            <template #operate="{ row }">
                <el-button link type="primary" @click="updTem(row)"><span style="font-size: 14px; margin-right: 5px;"
                        class="iconfont icon-bianji"></span>编辑</el-button>
                <el-button link type="danger" @click="delTemperature(row.id)"><span
                        style="font-size: 14px; margin-right: 5px;" class="iconfont icon-shanchu"></span>删除</el-button>
            </template>
            <template #search>
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="老人姓名:">
                        <el-input placeholder="请输入老人姓名" v-model="searchForm.name" clearable />
                    </el-form-item>
                    <el-form-item label="审批状态:">
                        <examine v-model="searchForm.stute"></examine>
                    </el-form-item>
                    <el-form-item label="外出时间:">
                        <el-date-picker type="daterange" value-format="YYYY-MM-DD" range-separator="-"
                            start-placeholder="开始日期" end-placeholder="结束日期" style="width: 200px;" size="default"
                            @change="(val: string[]) => dateChange(val, searchForm)" v-model="searchForm.date" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search">查询</el-button>
                        <el-button @click="resetSearch">重置</el-button>
                    </el-form-item>
                </el-form>
            </template>
        </Table>
        <TemperatureAdd @addRefresh="addRefresh" v-model="showAddDialog" @handleSuccess="handleAddSuccess">
        </TemperatureAdd>
        <TemperatureUpd v-model="showAddDialog2" @handleSuccess="handleAddSuccess2" :edit-data="editTemperatureData">
        </TemperatureUpd>
    </div>
</template>

<<<<<<< HEAD
<script setup lang="ts">
import Table, { type TableColumn } from "../../components/table.vue";
import { temperatureDelete, temperatureGet, temperatureList, } from "../../api/temperature/temperature";
import type { SupplierItem } from "../../api/supplier/SupplierType";
import { ref } from "vue";
import type { temperatureData } from "../../api/temperature/temperatureType";
import examine from '../../components/form/examine.vue'
import { ElMessage, ElMessageBox } from "element-plus";
import TemperatureAdd from './TemperatureAdd.vue'
import TemperatureUpd from './TemperatureUpd.vue'

const tableRef = ref<any>(null);
const showAddDialog = ref(false);
const showAddDialog2 = ref(false);

const params = ref<temperatureData>({
    page: '1',
    pageSize: '15'
})
const searchForm = ref<any>({
    name: '',
    stute: '',
    date: ''
})

const dateChange = (val: string[], Params: any) => {
    if (!Params.date) Params.date = [];
    Params.date[0] = val[0]
    Params.date[1] = val[1]
    Params.startTime = val[0];
    Params.beginDate = val[0];
    Params.endDate = val[1];
};

const delTemperature = async (id: number) => {
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
            await temperatureDelete(id)
            tableRef.value?.refresh();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消删除',
            })
        })
}
// 添加 editTemperatureData 响应式变量
const editTemperatureData = ref<any>(null);

const updTem = async (row: any) => {
    try {
        const res = await temperatureGet(row.id);
        console.log('单条体温数据', res);
        // 存储编辑数据并传递给子组件
        editTemperatureData.value = res.data;
        showAddDialog2.value = true; // 打开编辑弹窗

    } catch (error) {
        console.error('获取单条体温记录失败：', error);
        ElMessage.error('获取记录详情失败，请稍后重试');
    }
};

const addRefresh = () => {
    tableRef.value?.refresh();
}
const addTemperature = () => {
    showAddDialog.value = true;
}

const handleAddSuccess = () => {
    showAddDialog.value = false;
    tableRef.value?.refresh(); // 刷新表格数据
}

const handleAddSuccess2 = () => {
    showAddDialog2.value = false; // 应该是关闭第二个对话框
    editTemperatureData.value = null; // 清空编辑数据
    tableRef.value?.refresh(); // 刷新表格数据
}

const isBatchDelDisabled = ref(true)

//要删除选中的数据
const selectionData = ref<SupplierItem[]>([])
const handleSelectionChange = (rows: SupplierItem[]) => {
    console.log("rows", rows);
    selectionData.value = rows;
    isBatchDelDisabled.value = rows.length === 0;
}

// 搜索方法
const search = () => {
    tableRef.value?.refresh();
}

// 重置搜索
const resetSearch = () => {
    // 重置搜索表单和分页参数
    searchForm.value = {
        name: '',
        stute: '',
        mobile: ''
    }
    params.value = {
        page: '1',
        pageSize: '15'
    }
    if (tableRef.value) {
        tableRef.value.fetchData(params.value);
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
        label: "统计日期",
        prop: "addTime",
    },
    {
        label: "记录人",
        prop: "addAccountName",
    },
    {
        label: "老人姓名",
        prop: "elderlyName",
    },
    {
        label: "床位",
        prop: "begName",
    },
    {
        label: "体温",
        prop: "val",
    },
    {
        label: "操作",
        slot: "operate",
        width: 180,
        fixed: "right",
    }
];
=======
<script setup lang='ts'>
>>>>>>> faba1291873781602f2deee1773d1a79a1b5e5a7
</script>

<style scoped lang="less">
.demo-form-inline {
    height: 35px;
}
</style>