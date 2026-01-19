<template>
    <el-dialog v-model="dialogVisible" :title="ruleForm.id ? '编辑床位' : '新增床位'" width="500" :before-close="handleClose">

        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto" style="max-width: 400px;">
            <el-form-item label="房间号" prop="houseId">
                <div>
                    {{ propsDialogData.houseName }}
                </div>
            </el-form-item>
            <el-form-item label="床位号" prop="name">
                <el-input v-model="ruleForm.name" placeholder="请输入床位号" />
            </el-form-item>
            <el-form-item label="床位月价格" prop="price">
                <el-input v-model="ruleForm.price" placeholder="请输入床位月价格" />
            </el-form-item>

        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">关闭</el-button>
                <el-button type="primary" @click="submitForm">
                    提交
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref, reactive, inject } from 'vue';
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { bedsAdd, bedsUpdate } from '@/api/bed/bed';
import type { BedInfo } from '@/api/bed/bedType';

// 定义事件
const emit = defineEmits(['save-success']);

const propsDialogData = withDefaults(defineProps<BedInfo>(), {
    id: 0,
    closeDialog: Function,
    houseName: '',
    houseId: 0
})
const ruleFormRef = ref<FormInstance>()


let dialogVisible = ref(inject('dialogVisible'));

const rules = reactive<FormRules<BedInfo>>({
    name: [
        { required: true, message: '请输入床位号', trigger: 'blur' },
    ],
    price: [
        { required: true, message: '请输入床位月价格', trigger: 'blur' },
    ],
})


const ruleForm = ref<any>({
    id: propsDialogData.id,
    houseId: propsDialogData.houseId,
    name: propsDialogData.name,
    price: propsDialogData.price,
    state: 0
})

const handleClose = (_done: () => void) => {
    ElMessageBox.confirm('是否要关闭弹框?')
        .then(() => {
            propsDialogData.closeDialog()
        })
}
const submitForm = async () => {
    ElMessageBox.confirm('是否要提交?')
        .then(async () => {
            if (!ruleFormRef.value) return
            await ruleFormRef.value.validate(async (valid) => {
                if (valid) {
                    ruleForm.value.name = propsDialogData.houseName + ruleForm.value.name
                    let res
                    if (propsDialogData.id) {
                        res = await bedsUpdate(ruleForm.value)
                    } else {
                        res = await bedsAdd(ruleForm.value)
                    }

                    if (res.code == 10000) {
                        ElMessage.success('提交成功')
                        emit('save-success'); // 触发保存成功事件
                        propsDialogData.closeDialog()
                    }

                }
            })
        })

}

</script>

<style scoped lang='less'>
.from-item-div {
    display: flex;
}

.el-dialog {
    margin-top: 3vh;
}
</style>