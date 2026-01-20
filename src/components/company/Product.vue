<template>
    <div>
        <div class="Nowiln">
            <div class="left"></div>
            <div class="title">基础信息</div>
        </div>
        <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="auto">
            <div class="ruleForm">
                <el-form-item label="机构名称" prop="name">
                    <el-input v-model="formData.name" placeholder="请输入机构名称" />
                </el-form-item>
                <!-- 核心：绑定省市组件，同步到formData -->
                <el-form-item class="formitem" label="选择省份">
                    <Province v-model="formData.cityInfo" @change="triggerProvinceValidate" />
                </el-form-item>
            </div>

            <!-- 隐藏字段：将cityInfo.province同步到formData.province（满足表单校验） -->
            <el-form-item v-show="false" prop="province">
                <el-input v-model="formData.province" />
            </el-form-item>

            <div class="ruleForm">
                <el-form-item label="地址" prop="address">
                    <el-input v-model="formData.address" placeholder="请输入地址" />
                </el-form-item>
                <el-form-item class="formitem" label="对外服务电话" prop="telephone">
                    <el-input v-model="formData.telephone" placeholder="请输入对外服务电话" />
                </el-form-item>
            </div>
            <div class="ruleForm">
                <el-form-item label="管理员姓名" prop="adminName">
                    <el-input v-model="formData.adminName" placeholder="请输入管理员姓名" />
                </el-form-item>
                <el-form-item class="formitem" label="联系方式" prop="adminMobile">
                    <el-input v-model="formData.adminMobile" placeholder="请输入联系方式" />
                </el-form-item>
            </div>
            <div class="ruleForm">
                <el-form-item label="管理员账号" prop="adminUserName">
                    <el-input v-model="formData.adminUserName" placeholder="请输入管理员账号" />
                </el-form-item>
                <el-form-item class="formitem" label="密码" prop="adminPwd">
                    <el-input type="password" v-model="formData.adminPwd" placeholder="请输入密码" />
                </el-form-item>
            </div>
            <!-- 核心修改：开业时间添加value-format，指定输出格式为YYYY-MM-DD HH:mm -->
            <el-form-item label="开业时间" prop="startTime">
                <el-date-picker 
                    style="width: 428px;" 
                    v-model="formData.startTime" 
                    type="datetime" 
                    placeholder="请选择"
                    format="YYYY-MM-DD HH:mm" 
                    value-format="YYYY-MM-DD HH:mm"
                />
            </el-form-item>
        </el-form>
        <div class="Nowiln">
            <div class="left"></div>
            <div class="title">经营信息</div>
        </div>
        <!-- 修复：多个el-form不能用同一个ref，改为ruleFormRef2 -->
        <el-form ref="ruleFormRef2" :model="formData" :rules="rules" label-width="auto">
            <div class="ruleForm">
                <el-form-item label="法人代表" prop="legalPerson">
                    <el-input v-model="formData.legalPerson" placeholder="请输入法人代表" />
                </el-form-item>
                <el-form-item class="formitem" label="法人代表联系号码" prop="mobile">
                    <el-input v-model="formData.mobile" placeholder="请输入法人代表联系号码" />
                </el-form-item>
            </div>
            <div class="ruleForm">
                <el-form-item label="统一社会信用代码" prop="creditCode">
                    <el-input v-model="formData.creditCode" placeholder="请输入统一社会信用代码" />
                </el-form-item>
                <!-- 修复：v-model绑定错误 data → formData -->
                <el-form-item class="FormWrap" label="卫生许可证:">
                    <el-radio-group v-model="formData.license">
                        <el-radio :value="0" size="large">是</el-radio>
                        <el-radio :value="1" size="large">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </div>
            <div class="ruleForm">
                <!-- 修复：v-model绑定错误 data → formData，优化单选框文案 -->
                <el-form-item class="radio" label="是否具备医疗定点资格:">
                    <el-radio-group v-model="formData.medicalPoint">
                        <el-radio :value="0" size="large">是</el-radio>
                        <el-radio :value="1" size="large">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 修复：v-model绑定错误 data → formData，value改为字符串（匹配house类型） -->
                <el-form-item class="FormWrap" label="房屋性质:">
                    <el-radio-group v-model="formData.house">
                        <el-radio value="0" size="large">自有产权</el-radio>
                        <el-radio value="1" size="large">租赁</el-radio>
                        <el-radio value="2" size="large">合作使用</el-radio>
                        <el-radio value="3" size="large">其他</el-radio>
                    </el-radio-group>
                </el-form-item>
            </div>
            <div class="ruleForm">
                <!-- 修复：v-model绑定错误 data → formData -->
                <el-form-item class="radio" label="营业执照">
                    <uploads v-model="formData.picture" :baseUrl="VITE_IMG_URL" :uploadUrl="imageUrl"></uploads>
                </el-form-item>
                <el-form-item class="FormWraps" label="上传图片">
                    <uploads v-model="formData.certificate" :baseUrl="VITE_IMG_URL" :uploadUrl="imageUrl" :isText="true">
                        <template #upload-text>
                            <el-button type="primary">上传图片</el-button>
                        </template>
                    </uploads>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onMounted } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import type { CompanyInfo } from '../../api/company/companyType';
import Province from '../form/Province.vue';
import uploads from '../upload/Uploads.vue';
import { companyGet } from '../../api/company/company';
// 引入Element Plus的消息提示组件（用于错误提示）
import { ElMessage } from 'element-plus';

const VITE_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VITE_IMG_URL = import.meta.env.VITE_IMG_URL;
const imageUrl = VITE_BASE_URL + '/upload/add';

// 1. 定义双向绑定的表单数据（扩展cityInfo存储省市）
const data = defineModel<CompanyInfo & {
    cityInfo: { province: string; city: string }; // 新增：存储省市选择值
}>({
    default: () => ({
        name: '',
        province: '',
        city: '',
        cityInfo: { province: '', city: '' },
        // 其他字段默认值...
        address: '',
        telephone: null,
        startTime: '', // 改为字符串类型，匹配YYYY-MM-DD HH:mm格式
        legalPerson: null,
        mobile: null,
        creditCode: null,
        license: 0,
        medicalPoint: 0,
        house: '', // 改为字符串类型，匹配单选框的value（"0"/"1"/"2"/"3"）
        certificate: '',
        picture: '',
        adminUserName: '',
        adminPwd: '',
        adminName: '',
        adminMobile: ''
    })
});

const props = defineProps({
  id: {
    type: [Number], // 兼容数字/字符串类型的id
    required: false,
    default: 0 // 默认值改为0，更符合id的常规取值
  }
});

const { id } = props;

// 简化：解构formData方便使用
const formData = data;

// 2. 表单Ref（修复：多个表单需要不同的ref）
const ruleFormRef = ref<FormInstance>();
const ruleFormRef2 = ref<FormInstance>(); // 经营信息表单的ref

// 3. 监听cityInfo变化，同步到province/city（满足原有数据结构）
watch(() => formData.value.cityInfo, (val) => {
    formData.value.province = val.province;
    formData.value.city = val.city;
}, { deep: true, immediate: true });

// 4. 表单校验规则（优化：startTime触发方式改为change）
const rules = reactive<FormRules<CompanyInfo>>({
    name: [
        { required: true, message: '请输入机构名称', trigger: 'blur' },
    ],
    province: [ // 新增：省市选择的必填校验
        { required: true, message: '请选择省市', trigger: 'change' },
    ],
    address: [
        { required: true, message: '请输入地址', trigger: 'blur' },
    ],
    telephone: [
        { required: true, message: '请输入对外服务电话', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$|^\d{3,4}-\d{7,8}$/, message: '请输入正确的电话格式（手机号或座机号）', trigger: 'blur' }
    ],
    adminName: [
        { required: true, message: '请输入管理员姓名', trigger: 'blur' },
    ],
    adminMobile: [
        { required: true, message: '请输入联系方式', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ],
    adminUserName: [
        { required: true, message: '请输入管理员账号', trigger: 'blur' },
    ],
    adminPwd: [
        { required: true, message: '请输入密码', trigger: 'blur' }, // 修复：trigger错误改为blur
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
    ],
    startTime: [
        { required: true, message: '请选择开业时间', trigger: 'change' }, // 改为change触发更合理
    ],
    legalPerson: [
        { required: true, message: '请输入法人代表', trigger: 'blur' },
    ],
    mobile: [
        { required: true, message: '请输入法人代表联系号码', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ],
    creditCode: [
        { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
    ]
});

// 5. 手动触发省份字段校验（解决级联选择器不触发blur的问题）
const triggerProvinceValidate = () => {
    ruleFormRef.value?.validateField('province');
};

// 核心修改：增加id有效性判断，只有编辑模式才请求详情
onMounted(async () => {
    // 判断是否为编辑模式：id存在且不为0/空字符串/undefined
    if (id && id !== 0) {
        try {
            const res = await companyGet(id);
            console.log('获取机构单条详情', res);
            // 处理返回数据，适配cityInfo字段
            const detailData = res.data;
            // 同步省市信息到cityInfo，避免回显异常
            if (detailData.province || detailData.city) {
                detailData.cityInfo = {
                    province: detailData.province || '',
                    city: detailData.city || ''
                };
            }
            Object.assign(formData.value, detailData);
        } catch (error) {
            // 异常处理：接口请求失败时提示用户
            console.error('获取机构详情失败：', error);
            ElMessage.error('加载机构详情失败，请刷新重试');
        }
    } else {
        // 新增模式：控制台提示（可选），不执行任何操作
        console.log('当前为新增模式，跳过机构详情请求');
    }
});

// 可选：表单整体提交方法
const submitForm = async () => {
    try {
        // 校验基础信息表单
        await ruleFormRef.value?.validate();
        // 校验经营信息表单
        await ruleFormRef2.value?.validate();
        
        // 提交逻辑：formData.value 包含所有表单数据，startTime已为YYYY-MM-DD HH:mm格式
        console.log('表单提交数据：', formData.value);
        return true;
    } catch (error) {
        console.error('表单校验失败：', error);
        return false;
    }
};

// 暴露提交方法给父组件
defineExpose({
    submitForm
});
</script>

<style scoped lang="less">
.Nowiln {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    margin-top: 20px;

    .left {
        width: 8px;
        height: 16px;
        background-color: #529bfd;
        margin-right: 10px;
    }

    .title {
        font-size: 16px;
        font-weight: 500;
    }
}

.el-form-item {
    display: block;
    margin-bottom: 16px; // 增加表单项间距
}

/deep/.el-form-item__label-wrap {
    margin-left: 0 !important;
}

/deep/.el-input,
/deep/.el-cascader,
/deep/.el-date-editor { // 统一所有输入组件宽度
    width: 428px;
    height: 40px;
}

.ruleForm {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 16px;
}

.formitem {
    margin-left: 200px;
}

.FormWrap {
    margin-left: 200px;
    display: flex;
    align-items: center;
}

.radio {
    width: 428px;
    display: flex;
    align-items: center;
    gap: 20px; // 增加单选框间距
}

.el-button {
    width: 100px;
    height: 40px;
}

.FormWraps {
    margin-left: 200px;
}

.upload-demo {
    margin-top: 16px;
    margin-bottom: 16px;
}

// 优化单选框样式
/deep/.el-radio {
    margin-right: 15px;
}
</style>