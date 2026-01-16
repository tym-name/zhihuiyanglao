<template>
    <div>
        <el-dialog v-model="dialogVisible" title="编辑供应商" width="500">
            <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto">
                <el-form-item label="供应商名称" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="供应商名称" />
                </el-form-item>
                <el-form-item label="联系人" prop="linkMan">
                    <el-input v-model="ruleForm.linkMan" placeholder="请输入联系人" />
                </el-form-item>
                <el-form-item label="联系电话" prop="mobile">
                    <el-input v-model="ruleForm.mobile" placeholder="请输入联系电话" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="updSipplier">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import type { FormRules } from 'element-plus';
import { reactive } from 'vue';
import type { SupplierInfo } from '../../api/supplier/SupplierType';
import { supplierUpdate } from '../../api/supplier/Supplier';

const rules = reactive<FormRules<SupplierInfo>>({
    name: [
        { required: true, message: '请输入供应商名称', trigger: 'blur' },
    ],
    linkMan: [
        { required: true, message: '请输入联系人', trigger: 'blur' },
    ],
    mobile: [
        { required: true, message: '请输入联系电话', trigger: 'blur' },
        // 手机号格式验证
        { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
    ],
})

const ruleForm = reactive<SupplierInfo>({
    id: 0,
    companyId: 0,
    name: '',
    linkMan: '',
    mobile: '',
    foodCounts: 1
})

let updSupplier = defineProps<{ upd: any }>()
console.log('000', updSupplier);


// 修改供应商
const updSipplier = async (updSupplier: any) => {
    let res = await supplierUpdate(updSupplier)
    console.log('修改供应商信息',res);
    dialogVisible.value = false

}

const dialogVisible = defineModel()

</script>

<style scoped lang='less'></style>