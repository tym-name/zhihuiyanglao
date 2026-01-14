<template>
    <div>
        <el-card>
            <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto">
                <el-form-item label="选择外出老人" prop="elderlyName">
                    <el-input v-model="ruleForm.elderlyName" disabled />
                </el-form-item>
                <el-form-item label="外出时间" prop="startTime">
                    <el-date-picker v-model="value1" type="daterange" range-separator="-"
                        start-placeholder="2026-01-13 15:05:36" end-placeholder="2026-01-14 15:05:36" :size="size"
                        style="width: 200px;" />
                </el-form-item>
                <el-form-item label="陪同人员类型" prop="relation" placement="bottom">
                    <Relation></Relation>
                </el-form-item>
                <el-form-item label="陪同人员姓名" prop="name">
                    <el-input v-model="ruleForm.name" />
                </el-form-item>
                <el-form-item label="陪同人员电话" prop="mobile">
                    <el-input v-model="ruleForm.mobile" />
                </el-form-item>
                <el-form-item label="陪同人员地址" prop="address">
                    <el-input v-model="ruleForm.address" />
                </el-form-item>
                <el-form-item label="外出原因" prop="begName">
                    <el-input v-model="ruleForm.begName" style="width: 500px" :rows="2" type="textarea" />
                </el-form-item>
            </el-form>
            <el-button size="small" type="primary" @click="sub">保存</el-button>
            <el-button size="small" @click="router.push('/GoOut')">取消</el-button>
        </el-card>
    </div>
</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue';
import router from '../../router';
import type { FormRules } from 'element-plus';
import type { OutingApplication } from '../../api/goout/gooutType';
import Relation from '../../components/form/Relation.vue'
import { goOutadd } from '../../api/goout/goout';

const begName = ref('')

const size = ref<'default' | 'large' | 'small'>('default')

const value1 = ref('')

const ruleForm = reactive<OutingApplication>({
    name: '',
    id: 0,
    companyId: 0,
    elderlyId: 0,
    startTime: '',
    endTime: '',
    mobile: '',
    address: '',
    content: '',
    state: 0,
    relation: '',
    addTime: '',
    addAccountId: 0
})

const rules = reactive<FormRules<OutingApplication>>({
    startTime: [{ required: true, message: '请输入外出时间', trigger: 'blur' }],
    // relation: [{ required: true, message: '请选择陪同人关系', trigger: 'blur' }],
    name: [{ required: true, message: '请输入陪同人姓名', trigger: 'blur' }],
    mobile: [{ required: true, message: '请输入陪同人电话', trigger: 'blur' }],
    address: [{ required: true, message: '请输入陪同人地址', trigger: 'blur' }],
    begName: [{ required: true, message: '请输入外出原因', trigger: 'blur' }],

})

const sub = async () => {
    let res = await goOutadd(ruleForm)
    console.log('新增老人', res);

}

</script>

<style scoped lang='less'>
.el-form-item {
    width: 500px;
}

// 卡片内边距
.el-card {
    padding: 20px;
}

// 按钮样式优化
.el-button {
    margin-top: 20px;
    margin-right: 10px;
    width: 100px;
}
</style>