<template>
    <div>
        <Table ref="tableRef" :columns="columns" :fetch-data="getBloodList" :init-params="searchForm"
            @selection-change="handleSelectionChange">
            <template #search>
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="老人:">
                        <el-input placeholder="请输入老人姓名" clearable v-model="searchForm.name" />
                    </el-form-item>
                    <el-form-item label="床位:">
                        <!-- //:options="options" -->
                        <el-cascader v-model="selectedValue" :options="cascaderOptions" clearable placeholder="请选择床位" />
                    </el-form-item>
                    <el-form-item label="登记时间:">
                        <el-date-picker type="daterange" range-separator="-" start-placeholder="开始日期"
                            end-placeholder="结束日期" style="width: 240px;" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleSearch">查询</el-button>
                        <el-button @click="handleReset">重置</el-button>
                    </el-form-item>
                </el-form>
            </template>
            <template #buttons>
                <el-button type="success">用药登记</el-button>
                <el-button type="danger" @click="delAll">批量删除</el-button>
            </template>

            <template #operate="{ row }">
                <el-button link type="primary">
                    <i class="iconfont icon-bianji"></i>
                    编辑
                </el-button>
                <el-button link type="danger" @click="delOnlyOne(row.id)">
                    <i class="iconfont icon-shanchu"></i>
                    删除
                </el-button>
            </template>
        </Table>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, ref, watch } from 'vue';
import Table, { type TableColumn } from '../../components/table.vue'
import { delBloodById, deleteAllByIds, getBloodList, getBuildingList } from '../../api/medicalcare/blood/blood';
import type { bloodItem, bloodListParams, buildingListItem, CascaderTreeNode } from '../../api/medicalcare/blood/bloodType';
import { ElMessage, ElMessageBox } from 'element-plus';
import { convertFlatToCascaderTree } from '../../utils/checkBed';
//表格
const tableRef = ref<any>(null);

//刷新页面
const Refresh = () => {
    tableRef.value.refresh()
}

//根据Id删除
const delOnlyOne = (id: number) => {

    ElMessageBox.confirm(
        '是否删除该条记录？',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: "warning"
        }
    )
        .then(async () => {
            await delBloodById(id); // 先执行删除接口
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            Refresh()
        })

}

//批量删除
const isBatchDelDisabled = ref(true)
const selectionData = ref<bloodItem[]>([])
const ids = ref<number[]>([])
const handleSelectionChange = (rows: bloodItem[]) => {
    selectionData.value = rows;
    ids.value = rows.map(row => row.id);
    isBatchDelDisabled.value = rows.length === 0;//判断是否禁用
}

const delAll = async () => {
    ElMessageBox.confirm(
        '是否删除多条记录？',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            let res = await deleteAllByIds(ids.value)
            console.log(res);
            if (res.code === 10000) {
                ElMessage({
                    type: 'success',
                    message: '删除成功',
                })
                Refresh()
            }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}



//刷新页面
const refresh = () => {
    tableRef.value.refresh()
}
const columns: TableColumn[] = [
    {
        type: "selection",
        width: "50",
    },
    {
        label: "序号",
        prop: "id",
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
        label: "血压",
        prop: "bloodPressure",
    },
    {
        label: "脉搏",
        prop: "pulse"
    },

    {
        label: "操作",
        width: 160,
        slot: "operate",
        fixed: "right",
    }
]
//查询
const searchForm = ref<bloodListParams>({
    staffName: '',
    id: null,
    name: '',
    begId: null,
})
//搜索
const handleSearch = () => {
    refresh()
}
//重置
const handleReset = () => {
    searchForm.value = {
        staffName: '',
        id: null,
        name: '',
        begId: null,
    }
    selectedValue.value = []
}

const selectedValue = ref<number[]>([])
watch(() => selectedValue.value, (newValue) => {
    searchForm.value.begId = newValue[newValue.length - 1]
})




const cascaderOptions = ref<CascaderTreeNode[]>([])
// 获取楼栋/床位数据并转换（核心简化：调用封装方法）
const buildingList = async () => {
    try {
        let res = await getBuildingList();
        console.log('楼栋列表', res);

        // 核心：传入接口返回数据，调用封装方法完成转换
        const originalList: buildingListItem[] = res.data.list || []; // 容错：避免 list 不存在
        cascaderOptions.value = convertFlatToCascaderTree(originalList);
    } catch (error) {
        console.error('获取床位数据失败：', error);
        cascaderOptions.value = [];
    }
}
buildingList()

</script>

<style scoped lang='less'></style>