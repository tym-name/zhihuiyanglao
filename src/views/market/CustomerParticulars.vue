<template>
    <el-card class="elderly-edit-card">
        <!-- 新增表单验证外层容器 -->
        <el-form ref="formRef" :model="elderlyForm" :rules="formRules" label-width="100px" class="edit-form">
            <CustomerParticulars v-model="elderlyForm" :idgethomr="idgethomr" @form="form"></CustomerParticulars>
            <FamilyParticulars v-model="elderlyForm.family" :familylist="familylist"></FamilyParticulars>
            <SummaryParticulars></SummaryParticulars>
        </el-form>

        <div class="round">
            <el-button @click="router.push('/Customer')">返回</el-button>
        </div>
    </el-card>
</template>

<script setup lang='ts'>
import { reactive, ref, watch, onMounted } from 'vue';
import { ElMessage, type FormRules } from 'element-plus';
import CustomerParticulars from '../../components/form/CustomerParticulars.vue'
import SummaryParticulars from '../../components/form/SummaryParticulars.vue'
import FamilyParticulars from '../../components/form/FamilyParticulars.vue'
import { useRoute } from 'vue-router';
import type { ElderlyInfo, } from '../../api/customer/customerType';
import type { FamilyMember } from '../../api/market/elderlyType';
import { customerGet } from '../../api/customer/customer';
import router from '../../router';

function form(e: any) {
    Object.assign(elderlyForm, e)
}
// 1. 路由实例 - 获取编辑的老人ID
const route = useRoute();
const elderlyId = ref<number>(0);


// 潜在客户编辑表单 - 添加id属性
const elderlyForm = reactive<ElderlyInfo>({
    id: 0, // 添加id属性
    name: '',
    mobile: '',
    gender: 1,
    birthday: null,
    status: '',
    idCard: '',
    roomRequire: '',
    content: '',
    state: 1,
    source: '在线咨询',
    family: [] as FamilyMember[],
});

// 3. 表单验证规则 - 确保核心字段合法
const formRules = reactive<FormRules>({
    name: [
        { required: true, message: '请输入老人姓名', trigger: 'blur' },
        // { min: 2, max: 10, message: '姓名长度需在2-10个字符之间', trigger: 'blur' }
    ],
    mobile: [
        { required: true, message: '请输入手机号码', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的11位手机号码', trigger: 'blur' }
    ],
    idCard: [
        { required: true, message: '请输入身份证号码', trigger: 'blur' },
        // { pattern: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的18位身份证号', trigger: 'blur' }
    ],
    gender: [
        { required: true, message: '请选择性别', trigger: 'change' }
    ],
    birthday: [
        { required: true, message: '请选择出生日期', trigger: 'change' }
    ]
});

let familyData = ref<FamilyMember[]>([]);

// 4. 页面加载时获取老人详情 - 实现数据回显（完全保留你的代码）
onMounted(async () => {
    // 获取路由参数（兼容?id=1 和 /edit/:id 两种传参方式）
    const id = route.query.id || route.params.id;

    if (!id || isNaN(Number(id))) {
        ElMessage.error('未获取到有效的老人ID，无法编辑');
        router.push('/Customer');
        return;
    }

    elderlyId.value = Number(id);
    await getElderlyDetail();
});

let id = Number(route.query.id)
let idgethomr = ref()
let familylist = ref()

// 5. 获取老人详情接口 - 数据回显核心逻辑（完全保留你的代码）
const getElderlyDetail = async () => {
    try {
        let { data } = await customerGet(id)
        console.log(data);
        idgethomr.value = data
        familylist.value = data.family

        // 将获取到的数据填充到表单中，包括id
        Object.assign(elderlyForm, {
            id: data.id,
            name: data.name || '',
            mobile: data.mobile || '',
            gender: data.gender || 1,
            birthday: data.birthday || null,
            status: data.status || '',
            idCard: data.idCard || '',
            roomRequire: data.roomRequire || '',
            content: data.content || '',
            state: data.state || 1,
            source: data.source || '在线咨询',
            family: data.family || []
        })
    } catch (error) {
        console.error('获取老人详情失败:', error);
        ElMessage.error('获取老人详情失败');
    }
};

// 监听家属数据变化，同步到表单（完全保留你的代码）
watch(familyData, (newVal) => {
    if (newVal && Array.isArray(newVal)) {
        // 深拷贝优化：避免引用类型导致的异常
        elderlyForm.family = JSON.parse(JSON.stringify(newVal));

    }
}, { deep: true });
</script>

<style scoped lang='less'>
.elderly-edit-card {
    max-width: 1200px;
    margin: 20px auto;
    padding: 20px;
}

.edit-form {
    margin-bottom: 30px;
}

.round {
    text-align: center;
    margin-top: 20px;

    button {
        margin: 0 10px;
        padding: 8px 20px;
    }
}

.text {
    margin-bottom: 10px;
}

.edit {
    margin-top: 20px;
}
</style>