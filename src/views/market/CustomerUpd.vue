<template>
    <el-card class="elderly-edit-card">
        <!-- 新增表单验证外层容器 -->
        <el-form ref="formRef" :model="elderlyForm" :rules="formRules" label-width="100px" class="edit-form">
            <CustomerInfo v-model="elderlyForm" :idgethomr="idgethomr" @form="form"></CustomerInfo>
            <Family v-model="elderlyForm.family" :familylist="familylist"></Family>
            <Summary></Summary>
        </el-form>

        <div class="round">
            <el-button @click="router.push('/Customer')">取消</el-button>
            <!-- 仅添加加载状态，其他不变 -->
            <el-button type="primary" @click="handleSubmit" :loading="isSubmitting">保存修改</el-button>
        </div>
    </el-card>
</template>

<script setup lang='ts'>
import { reactive, ref, watch, onMounted } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import CustomerInfo from '../../components/form/CustomerInfo.vue'
import Summary from '../../components/form/Summary.vue'
import Family from '../../components/elderly/Family.vue'
import { useRoute } from 'vue-router';
import type { ElderlyInfo, } from '../../api/customer/customerType';
import type { FamilyMember } from '../../api/market/elderlyType';
import { customerUpdate, customerGet } from '../../api/customer/customer';
import router from '../../router';

function form(e:any){
    Object.assign(elderlyForm, e)
}
// 1. 路由实例 - 获取编辑的老人ID
const route = useRoute();
const elderlyId = ref<number>(0);
// 新增：提交加载状态
const isSubmitting = ref<boolean>(false);

// 2. 表单Ref - 用于表单验证
const formRef = ref<FormInstance>();

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
        familylist.value=data.family
        
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

// 6. 完善的修改提交逻辑（仅修改这部分，解决null问题）
const handleSubmit = async () => {
    // 防止重复提交
    if (isSubmitting.value) return;

    try {
        isSubmitting.value = true;
        console.log(elderlyForm);
        
        // 调用更新接口
        const res = await customerUpdate(elderlyForm);
        console.log('修改潜在客户返回结果:', res);

        // 核心：解决返回null的问题 - 先判断res是否存在
        if (!res) {
            ElMessage.error('修改请求已发送，但服务器未返回任何响应');
            isSubmitting.value = false;
            return;
        }

        // 兼容不同的返回结构（可能res是{data: null}或直接null）
        const responseData = res.data || res;
        if (!responseData) {
            ElMessage.error('服务器返回数据为空，修改失败');
            isSubmitting.value = false;
            return;
        }

        // 原有判断逻辑
        if (res.code === 10000) {
            ElMessage.success('修改成功');
            router.push('/Customer');
        } else {
            ElMessage.error(`修改失败：${'未知错误'}`);
        }
    } catch (error: any) {
        console.error('修改失败:', error);
        // 更精准的错误提示
        if (error.message) {
            ElMessage.error(`修改失败：${error.message}`);
        } else {
            ElMessage.error('修改失败，请重试');
        }
    } finally {
        // 无论成功失败，都结束加载状态
        isSubmitting.value = false;
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