<template>
    <div>
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="data" :rules="rules" label-width="auto">
            <el-form-item label="老人姓名:" prop="name">
                <el-input v-model="data.name" placeholder="请输入老人姓名" />
            </el-form-item>
            <el-form-item label="性别:" prop="state">
                <el-radio-group v-model="data.state">
                    <el-radio :value="1" size="large">男</el-radio>
                    <el-radio :value="0" size="large">女</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="出生日期:" prop="birthday">
                <div class="block">
                    <el-date-picker v-model="data.birthday" type="date" placeholder="请选择" />
                </div>
            </el-form-item>
            <el-form-item label="籍贯:" prop="nativePlace">
                <PlaceOrigin v-model="data.nativePlace"></PlaceOrigin>
            </el-form-item>
            <el-form-item label="民族:">
                <Ethnicity v-model="data.nation"></Ethnicity>
            </el-form-item>
            <el-form-item label="身份证号:" prop="idCard">
                <el-input v-model="data.idCard" placeholder="请输入身份证号" />
            </el-form-item>
            <el-form-item label="政治面貌:">
                <Politics v-model="data.politics"></Politics>
            </el-form-item>
            <el-form-item label="社保卡号:">
                <el-input v-model="data.socialCard" placeholder="请输入社保卡号" />
            </el-form-item>
            <el-form-item label="婚姻状况:">
                <el-radio-group v-model="data.marriage">
                    <el-radio value="已婚" size="large">已婚</el-radio>
                    <el-radio value="离婚" size="large">离婚</el-radio>
                    <el-radio value="丧偶" size="large">丧偶</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="受教育程度:">
                <el-radio-group v-model="data.eduLevel">
                    <el-radio value="文盲" size="large">文盲</el-radio>
                    <el-radio value="略识文字" size="large">略识文字</el-radio>
                    <el-radio value="能读写" size="large">能读写</el-radio>
                </el-radio-group>

            </el-form-item>
            <el-form-item label="最高学历:">
                <EducationSelect v-model="data.education"></EducationSelect>
            </el-form-item>
            <el-form-item label="户口所在地:" prop="resident">
                <el-input v-model="data.resident" placeholder="区/路(存)/弄/号/室" />
            </el-form-item>
            <el-form-item label="现居住地址:" prop="address">
                <el-input v-model="data.address" placeholder="区/路(存)/弄/号/室" />
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang='ts'>
import { reactive } from 'vue';
import type { ElderlyInfos } from '../../api/market/elderlyType';
import type { FormRules } from 'element-plus';
import PlaceOrigin from '../form/PlaceOrigin.vue';
import Ethnicity from '../form/Ethnicity.vue';
import Politics from '../form/Politics.vue';
import EducationSelect from '../form/EducationSelect.vue';

let data = defineModel<ElderlyInfos>({ default: {} });

const rules = reactive<FormRules<ElderlyInfos>>({
    name: [
        { required: true, message: '请输入老人姓名', trigger: 'blur' },
    ],
    state: [
        { required: true, message: '请选择性别', trigger: 'blur' },
    ],
    birthday: [
        { required: true, message: '请输入出生日期', trigger: 'blur' },
    ],
    nativePlace: [
        { required: true, message: '请选择籍贯', trigger: 'blur' },
    ],
    idCard: [
        { required: true, message: '请输入身份证号', trigger: 'blur' },
    ],
    resident: [
        { required: true, message: '请输入户口所在地', trigger: 'blur' },
    ],
    address: [
        { required: true, message: '请输入现居住地址', trigger: 'blur' },
    ]
})

</script>

<style scoped lang='less'>
/deep/.el-form-item {
    display: flex;
    align-items: center;
}

/deep/.el-input {
    width: 300px !important;
    height: 40px;
}
</style>