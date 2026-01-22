<template>
    <div>
        <el-dialog v-model="props.isShow" :title="title" width="500" :before-close="handleClose">
            <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto">
                <el-form-item label="老人姓名" prop="elderlyId">
                    <span v-if="sonElderlyId !== 0 && sonElderlyId !== null" @click="OpenOrCloseElderly">{{ name
                        }}</span>
                    <el-button v-else type="primary" @click="OpenOrCloseElderly">选择老人</el-button>
                </el-form-item>
                <el-form-item label="血压" prop="bloodPressure">
                    <el-input v-model="ruleForm.bloodPressure" placeholder="请输入血压" />
                </el-form-item>
                <el-form-item label="脉搏" prop="pulse">
                    <el-input v-model="ruleForm.pulse" placeholder="请输入脉搏" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="props.OpenOrClose">取消</el-button>
                    <el-button type="primary" @click="addOrUpdateBlood(ruleFormRef)">
                        确认
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <ChoseOneElderly :isShow="ElderlyIsShow" :OpenOrClose="OpenOrCloseElderly" @select-elderly="onElderlySelected">
        </ChoseOneElderly>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, watch, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { bloodAddOrUpdateParams, bloodItem } from '../../../api/medicalcare/blood/bloodType';
import ChoseOneElderly from '../../choseelderly/ChoseOneElderly.vue';
import type { ElderlyListItem } from '../../../api/care/activity/activityType';
import { el } from 'element-plus/es/locales.mjs';
import { addBlood, getBloodById, updateBlood } from '../../../api/medicalcare/blood/blood';

const emit = defineEmits<{
    (e: 'refresh'): void; // 刷新列表事件
}>()

//
const props = defineProps<{
    isShow: boolean
    OpenOrClose: () => void
    oneBloodData: bloodItem
    dataId: number | null
}>()
const dataid = ref<number | null>(null)
watch(() => props.dataId, (newValue) => {
    dataid.value = newValue
})

//对话框 title
// computed(() => props.id ? '修改院内活动' : '增加院内活动')
const title = computed(() => props.dataId == 0 ? '添加血压记录' : '修改血压记录')

//关闭对话框
const handleClose = (done: () => void) => {
    ElMessageBox.confirm('你确定要关闭此对话框吗?')
        .then(() => {
            done()
        })
        .catch(() => {
            // catch error
        })
}


const ruleFormRef = ref<FormInstance>()
//表单数据
const ruleForm = ref<bloodAddOrUpdateParams>({
    elderlyId: null,
    bloodPressure: '',
    pulse: '',
})
//表单验证

const rules = reactive<FormRules<bloodAddOrUpdateParams>>({
    elderlyId: [
        { required: true, message: '请选择老人姓名', trigger: 'blur' },
    ],
    bloodPressure: [
        { required: true, message: '请输入血压', trigger: 'blur' },
    ],
    pulse: [
        { required: true, message: '请输入脉搏', trigger: 'blur' },
    ],

})

//选择老人
const ElderlyIsShow = ref(false)
const OpenOrCloseElderly = () => {
    ElderlyIsShow.value = !ElderlyIsShow.value
}

//
watch(() => props.oneBloodData, (newValue) => {
    if (newValue) {
        sonElderlyId.value = newValue.id
        name.value = newValue.elderlyName

        ruleForm.value.elderlyId = newValue.elderlyId
        ruleForm.value.bloodPressure = newValue.bloodPressure
        ruleForm.value.pulse = newValue.pulse
    }
})

//接受子组件传过来的值
const sonElderlyId = ref(0)
const name = ref('')
const onElderlySelected = (elderly: ElderlyListItem) => {
    sonElderlyId.value = elderly.id
    name.value = elderly.name
    console.log('选中的老人:', elderly);
};
watch(() => sonElderlyId.value, (newValue) => {
    ruleForm.value.elderlyId = newValue
})






//添加血压
const add = async () => {
    try {
        let res = await addBlood(ruleForm.value)
        console.log(res);
        if (res.code === 10000) {
            ElMessage({
                type: 'success',
                message: '添加成功',
            })
            // 重置表单
            ruleForm.value.elderlyId = 0
            ruleForm.value.bloodPressure = ''
            ruleForm.value.pulse = ''
            sonElderlyId.value = 0
            name.value = ''
            emit('refresh')
        } else {
            ElMessage({
                type: 'error',
                message: res.msg || '添加失败',
            })
        }
        props.OpenOrClose()
    } catch (error) {
        console.error('添加血压记录失败:', error)
        ElMessage({
            type: 'error',
            message: '网络错误，请稍后重试',
        })
        props.OpenOrClose()
    }
}

//修改血压
// updateBlood
const update = async () => {
    try {
        let res = await updateBlood(ruleForm.value)
        console.log(res);
        if (res.code === 10000) {
            ElMessage({
                type: 'success',
                message: '修改成功',
            })
            // 重置表单
            ruleForm.value.elderlyId = 0
            ruleForm.value.bloodPressure = ''
            ruleForm.value.pulse = ''
            sonElderlyId.value = 0
            name.value = ''
            emit('refresh')
        } else {
            ElMessage({
                type: 'error',
                message: res.msg || '修改失败',
            })
        }
        props.OpenOrClose()
    } catch (error) {
        console.error('修改血压记录失败:', error)
        ElMessage({
            type: 'error',
            message: '网络错误，请稍后重试',
        })
        props.OpenOrClose()
    }
}


//添加血压
const addOrUpdateBlood = async (formEl: FormInstance | undefined) => {
    if (!formEl) return

    // 验证表单
    const valid = await formEl.validate().catch(() => false)
    if (!valid) {
        console.log('表单验证失败')
        return
    }

    if (dataid.value === 0 || dataid.value === null) {
        add()
    } else {
        update()
    }



}

</script>

<style scoped lang='less'></style>