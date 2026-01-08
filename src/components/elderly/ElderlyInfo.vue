<template>
    <div class="elederly">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="data" :rules="rules" label-width="auto">
            <el-form-item label="老人姓名:" prop="name">
                <el-input v-model="data.name" placeholder="请输入老人姓名" />
            </el-form-item>
            <!-- 修复：性别字段名 state → gender（匹配ElderlyInfos类型） -->
            <el-form-item label="性别:" prop="gender">
                <el-radio-group v-model="data.gender">
                    <el-radio :value="1" size="large">男</el-radio>
                    <el-radio :value="2" size="large">女</el-radio> <!-- 统一值为1/2，避免0/1混淆 -->
                </el-radio-group>
            </el-form-item>
            <!-- 核心修改：出生日期添加format和value-format，确保输出YYYY-MM-DD格式 -->
            <el-form-item label="出生日期:" prop="birthday">
                <div class="block">
                    <el-date-picker 
                        v-model="data.birthday" 
                        type="date" 
                        placeholder="请选择"
                        format="YYYY-MM-DD" 
                        value-format="YYYY-MM-DD"
                        style="width: 300px; height: 40px;"
                    />
                </div>
            </el-form-item>
            <el-form-item label="籍贯:" prop="nativePlace">
                <PlaceOrigin v-model="data.nativePlace"></PlaceOrigin>
            </el-form-item>
            <el-form-item label="民族:" prop="nation">
                <Ethnicity v-model="data.nation"></Ethnicity>
            </el-form-item>
            <el-form-item label="身份证号:" prop="idCard">
                <el-input v-model="data.idCard" placeholder="请输入身份证号" />
            </el-form-item>
            <el-form-item label="政治面貌:" prop="politics">
                <Politics v-model="data.politics"></Politics>
            </el-form-item>
            <el-form-item label="社保卡号:" prop="socialCard">
                <el-input v-model="data.socialCard" placeholder="请输入社保卡号" />
            </el-form-item>
            <el-form-item label="婚姻状况:" prop="marriage">
                <el-radio-group v-model="data.marriage">
                    <el-radio value="已婚" size="large">已婚</el-radio>
                    <el-radio value="离婚" size="large">离婚</el-radio>
                    <el-radio value="丧偶" size="large">丧偶</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="受教育程度:" prop="eduLevel">
                <el-radio-group v-model="data.eduLevel">
                    <el-radio value="文盲" size="large">文盲</el-radio>
                    <el-radio value="略识文字" size="large">略识文字</el-radio>
                    <el-radio value="能读写" size="large">能读写</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="最高学历:" prop="education">
                <EducationSelect v-model="data.education"></EducationSelect>
            </el-form-item>
            <el-form-item label="户口所在地:" prop="resident">
                <el-input v-model="data.resident" placeholder="区/路(存)/弄/号/室" />
            </el-form-item>
            <el-form-item label="现居住地址:" prop="address">
                <el-input v-model="data.address" placeholder="区/路(存)/弄/号/室" />
            </el-form-item>
        </el-form>
            <Upload 
                class="login" 
                v-model="data.photo" 
                :baseUrl="VITE_IMG_URL" 
                :uploadUrl="imageUrl"
            ></Upload>
    </div>
</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue';
import type { ElderlyInfos } from '../../api/market/elderlyType';
import type { FormInstance, FormRules } from 'element-plus';
import PlaceOrigin from '../form/PlaceOrigin.vue';
import Ethnicity from '../form/Ethnicity.vue';
import Politics from '../form/Politics.vue';
import EducationSelect from '../form/EducationSelect.vue';
import Upload from '../upload/Upload.vue';

// 1. 完善defineModel默认值：兜底空对象，避免undefined报错
const data = defineModel<ElderlyInfos>({ 
    default: () => ({
        name: '',
        gender: 1, // 默认男
        birthday: '', // 出生日期默认空字符串（YYYY-MM-DD格式）
        nativePlace: '',
        nation: '',
        idCard: '',
        politics: '',
        socialCard: '',
        marriage: '',
        eduLevel: '',
        education: '',
        resident: '',
        address: '',
        photo: ''
    })
});

// 2. 表单ref，用于整体校验
const ruleFormRef = ref<FormInstance>();

// 3. 环境变量
const VITE_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VITE_IMG_URL = import.meta.env.VITE_IMG_URL;
const imageUrl = VITE_BASE_URL + '/api/upload/add';

// 4. 完善表单校验规则
const rules = reactive<FormRules<ElderlyInfos>>({
    name: [
        { required: true, message: '请输入老人姓名', trigger: 'blur' },
    ],
    gender: [ // 修复：state → gender
        { required: true, message: '请选择性别', trigger: 'change' }, // 优化：trigger改为change
    ],
    birthday: [
        { required: true, message: '请选择出生日期', trigger: 'change' }, // 优化：trigger改为change
    ],
    nativePlace: [
        { required: true, message: '请选择籍贯', trigger: 'blur' },
    ],
    nation: [ // 新增：民族必填
        { required: true, message: '请选择民族', trigger: 'blur' },
    ],
    idCard: [
        { required: true, message: '请输入身份证号', trigger: 'blur' },
    ],
    politics: [ // 新增：政治面貌必填
        { required: true, message: '请选择政治面貌', trigger: 'blur' },
    ],
    marriage: [ // 新增：婚姻状况必填
        { required: true, message: '请选择婚姻状况', trigger: 'change' },
    ],
    eduLevel: [ // 新增：受教育程度必填
        { required: true, message: '请选择受教育程度', trigger: 'change' },
    ],
    education: [ // 新增：最高学历必填
        { required: true, message: '请选择最高学历', trigger: 'blur' },
    ],
    resident: [
        { required: true, message: '请输入户口所在地', trigger: 'blur' },
    ],
    address: [
        { required: true, message: '请输入现居住地址', trigger: 'blur' },
    ],
    photo: [ // 新增：照片必填
        { required: true, message: '请上传老人照片', trigger: 'change' },
    ]
});

// 可选：表单提交方法（供父组件调用）
const submitForm = async () => {
    if (!ruleFormRef.value) return;
    try {
        await ruleFormRef.value.validate();
        // 校验通过，data.value中的birthday已为YYYY-MM-DD格式
        console.log('表单数据：', data.value);
        return true;
    } catch (error) {
        console.error('表单校验失败：', error);
        return false;
    }
};

// 暴露提交方法
defineExpose({
    submitForm
});
</script>

<style scoped lang='less'>
/deep/.el-form-item {
    display: flex;
    align-items: center;
    margin-bottom: 16px; // 增加表单项间距
}

/deep/.el-input,
/deep/.el-date-editor { // 统一日期选择器宽度
    width: 300px !important;
    height: 40px;
}

// 单选框组样式优化
/deep/.el-radio-group {
    display: flex;
    gap: 20px;
}

.login {
    margin-top: 16px;
}
</style>