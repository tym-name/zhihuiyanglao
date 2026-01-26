<template>
    <div>
        <Table :columns="columns" ref="tableRef" @selection-change="handleSelectionChange" :init-params="params"
            :fetch-data="getMedicineLogs">
            <!--查询列插槽 -->
            <template #search>

                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="名称">
                        <el-input v-model="params.name" placeholder="请输入老人姓名" clearable />
                    </el-form-item>


                    <el-form-item label="登记时间">
                        <DateRangePicker v-model:begin-date="params.beginDate" v-model:end-date="params.endDate"
                            style="width: 220px;"></DateRangePicker>
                    </el-form-item>

                    <el-form-item>
                        <el-button @click="query" type="primary" :icon="Search">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button :icon="Refresh" @click="reset">重置</el-button>
                    </el-form-item>
                </el-form>

            </template>

            <template #buttons>
                <el-button type="success" @click="add"><i class="iconfont icon-jia"></i>用药登记</el-button>
                <el-button type="danger" :disabled="isBatchDeleteDisabled" @click="delAll"><i class="iconfont icon-shanchu"></i>批量删除</el-button>
            </template>


            <template #operate="{ row }">
                <el-button type="primary" link @click="handleDetails(row)">
                    <el-icon>
                        <i class="iconfont icon-wenben"></i>
                    </el-icon> 查看详情
                </el-button>
                <el-button type="primary" link @click="handlePlanset(row)">
                    <el-icon>
                        <i class="iconfont icon-wenben"></i>
                    </el-icon> 用药计划
                </el-button>
            </template>
        </Table>

        <SelectOld v-model="dialogVisibleSelectOld" @selectOldId="selectOldId"></SelectOld>
    </div>
</template>
<script setup lang="ts">

import { computed, ref } from 'vue';
import Table from '../../components/table.vue';
import SelectOld from '../../components/selectOld/SelectOld.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import DateRangePicker from '../../components/from/DateRangePicker.vue'
import { Refresh, Search } from '@element-plus/icons-vue';
import router from '../../router';
import type { QrcodeItem } from '../../api/address/type';
import type { MedicineLogsParams } from '../../api/medicalcare/medicineLogs/medicineLogsType';
import type { TableColumn } from '../../components/table.vue';
import { deleteMedicineLogsAll, getMedicineLogs } from '../../api/medicalcare/medicineLogs/medicineLogs';




//列表请求参数
const params = ref<MedicineLogsParams>({})
const tableRef = ref<any>(null)
const columns: TableColumn[] = [
    {
        type: "selection",
        width: "50"
    },
    {
        label: "序号",
        prop: "id",
        width: "70"
    }, {
        label: "老人姓名",
        prop: "elderlyName",

    }, {
        label: "用药品种类",
        prop: "counts"
    }, {
        label: "登记人",
        prop: "addAccountName"
    },
    {
        label: "最新登记时间",
        prop: "addTime",
        formatTime: "YYYY-MM-DD HH:mm:ss"
    },
    {
        label: "操作",
        slot: "operate",
        width: 300,
        fixed: "right",
    }

]





//批量删除
const delAll = async () => {
    // console.log("ids", ids);
    const comifm = await ElMessageBox.confirm(
        '是否确认删除选中的数据?',
        '提示',
        {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning',
        }
    ).catch(() => { undefined })
    if (!comifm) return ElMessage.error("取消删除")
    //获取批量删除的id
    let ids: number[] = selectionData.value.map(item => item.id)
    // console.log("ids", ids);
    const res = await deleteMedicineLogsAll(ids).catch(() => undefined)
    if (!res) return;
    ElMessage.success("删除成功")
    if (tableRef.value) {
        // 使用 Table 组件暴露的 refresh 方法
        tableRef.value.refresh()
    }

}

// 计算属性：判断是否禁用批量删除按钮
const isBatchDeleteDisabled = computed(() => {
    return selectionData.value.length === 0;
})
//要删除选中的数据
const selectionData = ref<QrcodeItem[]>([])
const handleSelectionChange = (e: QrcodeItem[]) => {
    // console.log("rows", e);
    selectionData.value = e;
}


//对话框的显示隐藏
const dialogVisibleSelectOld = ref(false)
//添加
const add = async () => {
    dialogVisibleSelectOld.value = true
}

//选中的老人
const selectOldId = (row: any) => {
    if (row.id) {
        //跳转页面 将选择的老人信息传过去
        router.push({
            path: '/medicalcareAdd',
            query: { elderlyId: String(row.id) }
            // state: {
            //     elderly: row// 整个老人对象
            // }
        })
    }

}


//点击查看详情
const handleDetails = (row: any) => {
    if (row) {
        // 2. 使用 Base64 编码（简单加密）
        const encodedData = btoa(unescape(encodeURIComponent(JSON.stringify(row))));
        router.push({
            path: '/medicalcaredetails',
            query: {
                data: encodedData
            }
        })
    }
}

//点击查看用用药计划
const handlePlanset = (row: any) => {
    if (row) {
        // 2. 使用 Base64 编码（简单加密）
        const plansetData = btoa(unescape(encodeURIComponent(JSON.stringify(row))));
        router.push({
            path: '/medicalcarePlanset',
            query: {
                data: plansetData
            }
        })
    }
}

//点击查询
const query = () => {
    tableRef.value.refresh()
}

// //点击重置
const reset = () => {
    // 清空表单数据 
    Object.assign(params.value, {
        name: '',
        idCard: '',      // 注意字段名
        beginDate: '',
        endDate: ''
    })
    tableRef.value.refresh()
}

</script>

<style scoped lang='less'>
    .iconfont{
        margin-right: 5px;
    }
</style>