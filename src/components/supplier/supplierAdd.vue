<template>
    <div>
        <el-dialog v-model="dialogFormVisible" title="Shipping address" width="500">
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
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';

import type { FormRules } from 'element-plus'

const dialogFormVisible = ref(false)

interface RuleForm {
    name: string
    linkMan: string
    mobile: string
}

const ruleForm = reactive<RuleForm>({
    name: '',
    linkMan: '',
    mobile: '',
})

const rules = reactive<FormRules<RuleForm>>({
    name: [
        { required: true, message: '请输入供应商名称', trigger: 'blur' },
    ],
    linkMan: [
        { required: true, message: '请输入联系人', trigger: 'blur' },
    ],
    mobile: [
        { required: true, message: '请输入联系电话', trigger: 'blur' },
    ],
})

</script>

<style scoped lang='less'></style>