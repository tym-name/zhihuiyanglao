<!-- 用药计划数据 -->

<template>
    <div>
        <!-- 顶部卡片 -->
        <el-card shadow="never">
            <div style="display: flex; align-items: start; gap: 16px; justify-content: start;">
                <!-- 老人信息 -->
                <div class="info-container">
                    <div>老人：{{ details?.elderlyName }}</div>
                    <div style="margin-top: 10px;">床位：{{ details?.begName }}</div>
                </div>
            </div>

            <!-- table表格数据 -->
            <el-table :data="elderlyMedicineLogsPlanset" style="width: 100%">
                <el-table-column label="序号" prop="id" width="80" />
                <el-table-column label="药品名称" prop="name" />
                <el-table-column label="数量" width="80">
                    <template #default="{ row }">
                        {{ row.counts }} {{ row.unit || '' }}
                    </template>
                </el-table-column>
                <el-table-column label="有效期">
                    <template #default="{ row }">
                        {{ dayjs(row.expTime).format('YYYY-MM-DD') }}
                    </template>
                </el-table-column>
                <el-table-column label="剂量" prop="sum">
                    <template #default="{ row }">
                        {{ row.sum }} {{ row.norms || '' }}
                    </template>
                </el-table-column>
                <el-table-column label="服法" prop="remarks" width="180" />
                <el-table-column label="服用计划" width="180">
                    <template #default="{ row }">
                        <div v-if="row.plans && row.plans.length">
                            <div v-for="(plan, index) in row.plans" :key="index">
                                {{ plan.time }} {{ plan.content }}
                            </div>
                        </div>
                        <span v-else>—</span>
                    </template>
                </el-table-column>
                <el-table-column label="开始时间" prop="startDate" />
                <el-table-column label="结束时间" prop="endDate" />
                <el-table-column label="操作" fixed="right" width="180">
                    <template #default="scope">
                        <el-button size="small" link type="primary" @click="handleSetup(scope.row)">
                            设置
                        </el-button>
                        <el-button size="small" type="primary" link @click="handleStop(scope.row)">
                            停止用药
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- table表格数据 -->


            <!-- 点击返回列表页面 -->
            <div style="width: 100%;display: flex;justify-content: center;margin-top: 20px;">
                <el-button @click="() => { $router.push('/medicalcare/medicinelogs') }">返回</el-button>
            </div>
            <!-- 点击返回列表页面 -->
        </el-card>

        <!-- 设置对话框 -->
        <MedicalcareSetupTime v-model="dialogVisibleSetup" :setupId="setupId" @submit_Refresh="submit_Refresh">
        </MedicalcareSetupTime>
        <!-- 设置对话框 -->

        <!-- 停止用药对话框 -->
        <MedicalcareStop v-model="dialogVisibleStop" :currentDate="currentDate" @stop_Refresh="stop_Refresh">
        </MedicalcareStop>
        <!-- 停止用药对话框 -->
    </div>
</template>
<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import type { MedicationRecord, MedicineRecordPlanset } from '../../api/medicalcare/medicineLogs/medicineLogsType';
import { useRoute } from 'vue-router';
import { getMedicineLogsById } from '../../api/medicalcare/medicineLogs/medicineLogs';
import dayjs from 'dayjs';
import MedicalcareStop from "../../components/medicalcarePlanset/MedicalcareStop.vue"
import MedicalcareSetupTime from "../../components/medicalcarePlanset/MedicalcareSetupTime.vue"


//定义参数 根据参数 来显示对话框的显示隐藏
export interface Params {
    dialogVisibleSetup: boolean
    dialogVisibleStop: boolean
    setupId: number
    stopId: number;

}
const route = useRoute()
//跳转接受的参数
const details = ref<MedicationRecord>()

onMounted(() => {

    //接受传来的数据信息
    if (route.query.data) {
        //解密
        const decodedStr = decodeURIComponent(escape(atob(route.query.data as string)));
        details.value = JSON.parse(decodedStr);
        // console.log('从query接收的数据:', details.value);
         getPlanset(details.value?.elderlyId!)
    }
})


//老人用药记录列表返回类型 
let elderlyMedicineLogsPlanset = ref<MedicineRecordPlanset[]>([])
//用药计划列表
const getPlanset = async (id: number) => {
    const res = await getMedicineLogsById(id)
    elderlyMedicineLogsPlanset.value = res.data.list
    // console.log("获取用药记录列表",res.data.list)
}




//设置用药对话框的显示与隐藏
const dialogVisibleSetup = ref(false)
const setupId = ref<any>();
//设置
const handleSetup = (row: any) => {
    if (row) {
        setupId.value = row
        dialogVisibleSetup.value = true
    }
}
//设置刷新页面
const submit_Refresh = () => {
    getPlanset(details.value?.elderlyId!)
}
//停止用药对话框的显示与隐藏
const dialogVisibleStop = ref(false)
const currentDate = ref<any>();
//停止用药
const handleStop = (row: any) => {
    if (row) {
        currentDate.value = row
        dialogVisibleStop.value = true
    }
}

//停止用药的刷新
const stop_Refresh = () => {
    getPlanset(details.value?.elderlyId!)
}

</script>
<style lang='less' scoped></style>