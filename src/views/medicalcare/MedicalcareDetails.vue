<template>
    <div>
        <!-- 顶部卡片 -->
        <el-card shadow="never">
            <div style="display: flex; align-items: start; gap: 16px; justify-content: start;">
                <!-- 头像 -->
                <div class="avatar-container">
                    <img :src="(imageUrl + details?.elderlyPhoto) ? (imageUrl + details?.elderlyPhoto) : defaultAvatar"
                        style="width: 80px; height: 80px;  object-fit: cover;" />
                </div>

                <!-- 老人信息 -->
                <div class="info-container">
                    <div>老人：{{ details?.elderlyName }}</div>
                    <div style="margin-top: 10px;margin-bottom: 10px;">身份证号：{{ details?.elderlyIdCard }}</div>
                    <div>床位：{{ details?.begName }}</div>
                </div>
            </div>
        </el-card>

        <!-- table表格数据 -->

        <el-table :data="elderlyMedicineLogs" style="width: 100%">
            <el-table-column label="序号" prop="id" />
            <el-table-column label="药品名称" prop="name" />
            <el-table-column label="数量">
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
            <el-table-column label="服法" prop="remarks" />
            <el-table-column label="操作" fixed="right" width="180">
                <template #default="scope">
                    <el-button size="small" link type="primary" @click="updateBlood(scope.row)">
                        编辑
                    </el-button>
                    <el-button size="small" type="primary" link @click="deleteById(scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 显示对话框 -->
        <AddDrugDialag 
            v-model="ruleForm" 
            :editDate="ruleForm" 
            @addMedicine="addMedicine"
            :elderlyId="details?.elderlyId"
            :familyName="details?.familyName"
            :addTime="details?.addTime"
        />


    </div>
</template>

<script setup lang="ts">

import { deleteMedicineLogs, getElderlyMedicineLogs } from '../../api/medicalcare/medicineLogs/medicineLogs';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { AddMedicineLogsParams, MedicationRecord, MedicineRecordDate, tableData } from '../../api/medicalcare/medicineLogs/medicineLogsType';
import AddDrugDialag from "../../components/MedicalcareAddOld/AddDrugDialag.vue"

import { ElMessage, ElMessageBox } from 'element-plus';
import dayjs from 'dayjs';
const route = useRoute()

//默认的图片
const defaultAvatar: string = "data:image/jpeg;base64,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"
//图片的根路径
const imageUrl = import.meta.env.VITE_IMG_URL

//跳转接受的参数
const details = ref<MedicationRecord>()

onMounted(() => {
    //接受传来的数据信息
    if (route.query.data) {
        //解密
        const decodedStr = decodeURIComponent(escape(atob(route.query.data as string)));
        details.value = JSON.parse(decodedStr);
        // console.log('从query接收的数据:', details.value);
        getMedicineLogsById(details.value?.elderlyId!)
    }
})


//老人存药记录返回类型 
let elderlyMedicineLogs = ref<MedicineRecordDate[]>([])
//根据id获取老人存药记录
const getMedicineLogsById = async (elderlyId: number) => {
    const res = await getElderlyMedicineLogs(elderlyId)
    elderlyMedicineLogs.value = res.data.list!
    // console.log('根据id获取老存药记录', res.data)
}


//对话框的请求参数
const ruleForm = ref<AddMedicineLogsParams>({
    dialogVisible: false,
    id: 0,
    tableData: []
})

//编辑
const updateBlood = (row: tableData) => {
    //显示对话框  将数据回显
    ruleForm.value.dialogVisible = true
    ruleForm.value = {
        ...row,
        dialogVisible: true,
        id: row.id,
        tableData: []
    } as AddMedicineLogsParams
}

//对话框  修改成功  // 刷新页面
const addMedicine = (row: any) => {
    //修改成功  //刷新页面
    getMedicineLogsById(row.elderlyId)
    // console.log('刷新页面的id',row.elderlyId)
}

//根据id删除
const deleteById = async (row: any) => {
    const confirm = await ElMessageBox.confirm(
        '是否确认删除此信息?',
        '提示',
        {
            confirmButtonText: '确认删除',
            cancelButtonText: '取消删除',
            type: 'warning',
        }
    ).catch(() => undefined)
    if (!confirm) return ElMessage.info("已取消删除")
    const res = await deleteMedicineLogs(row.id)
    if (res) ElMessage.success("删除成功")
    // tableRef.value.refresh()
    //刷新页面
    getMedicineLogsById(row.elderlyId)
}




</script>

<style lang="less" scoped>
img {
    width: 24px;
    height: 24px;
}
</style>