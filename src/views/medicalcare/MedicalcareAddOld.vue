<template>
    <div>
        <el-card style="max-width: 100%">
            <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="100px">
                <el-form-item label="登记时间" prop="addTime">
                    <el-date-picker v-model="ruleForm.addTime" type="datetime" format="YYYY-MM-DD HH:mm:ss"
                        value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择登记时间" style="width: 190px;" />
                </el-form-item>

                <el-form-item label="家属姓名" prop="familyName">
                    <el-input v-model="ruleForm.familyName" placeholder="请输入家属姓名" style="width:190px" />
                </el-form-item>


                <div style="margin-left: 20px;margin-bottom: 10px;">
                    <el-button type="primary" @click="addDrug">新增药品</el-button>
                </div>

            </el-form>

            <!-- 新增药品的对话框显示 -->
            <AddDrugDialag v-model="ruleForm" @addMedicine="addMedicine" :editDate="currentEditData"
                :elderlyId="ruleForm.elderlyId" :familyName="ruleForm.familyName" :addTime="ruleForm.addTime">
            </AddDrugDialag>

            <!-- 新增药品的表格数据 -->
            <el-table style="width: 100%" :data="ruleForm.tableData">
                <el-table-column label="序号" width="80">
                    <template #default="scope">
                        {{ scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="药品名称" />
                <el-table-column prop="counts" label="数量">
                    <template #default="scope">
                        {{ scope.row.counts }} {{ scope.row.unit }}
                    </template>
                </el-table-column>
                <el-table-column prop="expTime" label="有效期" />
                <el-table-column prop="sum" label="剂量">
                    <template #default="scope">
                        {{ scope.row.sum }} {{ scope.row.norms }}
                    </template>
                </el-table-column>
                <el-table-column prop="remarks" label="服法" />
                <el-table-column fixed="right" label="操作" width="180">
                    <template #default="scope">
                        <el-button size="small" type="primary" link @click="handleEdit(scope.row, scope.$index)">
                            编辑
                        </el-button>
                        <el-button size="small" link type="danger" @click="handleDelete(scope.row, scope.$index)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>


            <div style="margin-top: 20px;">
                <el-button type="primary" class="Save" @click="submitForm(ruleFormRef)">保存</el-button>
                <el-button class="Cancel" @click="() => { $router.push('/medicalcare/medicinelogs') }">取消</el-button>
            </div>
        </el-card>
    </div>
</template>
<script setup lang='ts'>
import { dayjs, ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import AddDrugDialag from '../../components/MedicalcareAddOld/AddDrugDialag.vue'
import type { AddMedicineLogsParams, DrugAddParams, tableData } from '../../api/medicalcare/medicineLogs/medicineLogsType';
import { addDrug as addDrugApi } from '../../api/medicalcare/medicineLogs/medicineLogs';
import { useRoute } from 'vue-router'
import router from '../../router';

const route = useRoute()
const elderlyId = route.query.elderlyId as any
//请求参数
const ruleForm = reactive<AddMedicineLogsParams>({
    id: 0,
    dialogVisible: false,
    elderlyId: elderlyId,
    tableData: []
})



//添加到表格的数据（新增或更新）
const addMedicine = (fromDate: any) => {
    // 如果存在编辑索引，说明是编辑模式，更新对应索引的数据
    if (currentEditIndex.value !== null && ruleForm.tableData) {
        const editIndex = currentEditIndex.value
        if (ruleForm.tableData[editIndex]) {
            // 更新表格中对应索引的数据，保留原有的 id（如果有）
            const existingItem = ruleForm.tableData[editIndex]
            ruleForm.tableData[editIndex] = {
                ...fromDate,
                // 保留原有的 id，如果没有则使用新数据的 id
                id: existingItem?.id || fromDate.id
            }
            ElMessage.success('药品信息已更新')
        }
        // 重置编辑索引
        currentEditIndex.value = null
    } else {
        // 新增模式，添加到表格
        ruleForm.tableData?.push(fromDate)
    }

    // 重置编辑数据
    currentEditData.value = null
}



// 添加编辑相关状态
const currentEditData = ref<any>(null)
const currentEditIndex = ref<number | null>(null) // 记录当前编辑的索引

// 修改 handleEdit 函数
const handleEdit = (row: any, index: number) => {
    // console.log("点击编辑", row, index)
    currentEditData.value = { ...row } // 复制当前行数据
    currentEditIndex.value = index // 记录编辑的索引
    ruleForm.dialogVisible = true
}

//点击删除数据
const handleDelete = (_row: any, index: number) => {
    ElMessageBox.confirm('确定要删除这条药品记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        // 从数组中删除指定索引的元素
        ruleForm.tableData?.splice(index, 1)
        ElMessage.success('删除成功')
    }).catch(() => {
        // 用户取消删除
        // console.log('用户取消删除')
    })
}




const ruleFormRef = ref<FormInstance>()
//点击保存数据
const handleSave = async () => {
    // 验证必要字段
    if (!ruleForm.elderlyId) {
        ElMessage.error('缺少老人ID')
        return
    }
    if (!ruleForm.familyName) {
        ElMessage.error('请填写家属姓名')
        return
    }
    if (!ruleForm.addTime) {
        ElMessage.error('请选择登记时间')
        return
    }
    if (!ruleForm.tableData || ruleForm.tableData.length === 0) {
        ElMessage.error('请至少添加一个药品')
        return
    }

    try {
        // 格式化登记时间
        let addTimeStr = ruleForm.addTime
        if (addTimeStr && !addTimeStr.includes(':')) {
            // 如果没有时间部分，添加默认时间
            addTimeStr = dayjs(addTimeStr).format('YYYY-MM-DD HH:mm:ss')
        } else if (addTimeStr) {
            addTimeStr = dayjs(addTimeStr).format('YYYY-MM-DD HH:mm:ss')
        }

        // 为每个药品调用添加接口
        const promises = ruleForm.tableData.map(async (item: tableData) => {
            // 格式化有效期
            let expTimeStr: string | undefined = undefined
            if (item.expTime) {
                const expTimeValue = item.expTime as any;
                if (expTimeValue instanceof Date || (typeof expTimeValue === 'object' && expTimeValue !== null && 'getTime' in expTimeValue)) {
                    expTimeStr = dayjs(expTimeValue).format('YYYY-MM-DD')
                } else if (typeof expTimeValue === 'string') {
                    // 确保格式正确
                    expTimeStr = dayjs(expTimeValue).format('YYYY-MM-DD')
                }
            }

            if (!expTimeStr) {
                throw new Error(`药品 ${item.name} 的有效期格式不正确`)
            }

            const drugData: DrugAddParams = {
                elderlyId: ruleForm.elderlyId!,
                addTime: addTimeStr!,
                familyName: ruleForm.familyName!,
                name: item.name!,
                counts: item.counts!,
                unit: item.unit!,
                expTime: expTimeStr,
                sum: item.sum!,
                norms: item.norms!,
                remarks: item.remarks || ''
            }

            // 如果是编辑模式，包含 id
            if (item.id) {
                (drugData as any).id = item.id
            }

            const res = await addDrugApi(drugData)
            return res
        })

        // 等待所有请求完成
        const results = await Promise.all(promises)

        // 检查是否所有请求都成功
        const allSuccess = results.every(res => res && 'code' in res && res.code === 10000)

        if (allSuccess) {
            ElMessage.success('用药登记添加成功')
            router.replace({ path: '/layout/Medicinelogs' })
        } else {
            const failedCount = results.filter(res => !res || !('code' in res) || res.code !== 10000).length
            ElMessage.error(`有 ${failedCount} 个药品添加失败，请重试`)
        }
    } catch (error) {
        console.error('添加用药登记失败:', error)
        ElMessage.error('添加失败，请重试')
    }
}

//点击确定  触发校验
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            // console.log('submit!')
            handleSave()
        } else {
            // console.log('error submit!', fields)
        }
    })
}




//正则校验
const rules = reactive<FormRules<AddMedicineLogsParams>>({
    addTime: [
        { required: true, message: '请选择日期', trigger: 'blur' },
    ],

    familyName: [
        { required: true, message: '请填写家属姓名', trigger: 'blur' },
    ],

})

//点击新增药品
const addDrug = () => {
    // 重置编辑数据，确保是新增模式
    currentEditData.value = null
    currentEditIndex.value = null
    ruleForm.dialogVisible = true
}
</script>
<style lang='less' scoped></style>