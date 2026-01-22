<template>
    <div>
        <el-card>
            <!-- 动态标题：区分新增/修改 -->
            <div style="font-size: 18px; font-weight: 600; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #e4e7ed;">
                {{ isEdit ? '编辑外出登记' : '新增外出登记' }}
            </div>

            <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto">
                <el-form-item label="选择外出老人" prop="elderlyName">
                    <el-input v-model="ruleForm.elderlyName" disabled />
                </el-form-item>
                <el-form-item label="外出时间" prop="startTime">
                    <el-date-picker v-model="dateRange" type="daterange" range-separator="-" start-placeholder="选择开始时间"
                        end-placeholder="选择结束时间" :size="size" style="width: 100%;" @change="handleDateChange"
                        format="YYYY-MM-DD" value-format="YYYY-MM-DD" :disabled="isEdit" />
                </el-form-item>
                <el-form-item label="陪同人员类型" prop="relation" placement="bottom">
                    <Relation v-model="ruleForm.relation"></Relation>
                </el-form-item>
                <el-form-item label="陪同人员姓名" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="请输入陪同人员姓名" />
                </el-form-item>
                <el-form-item label="陪同人员电话" prop="mobile">
                    <el-input v-model="ruleForm.mobile" placeholder="请输入11位手机号码" />
                </el-form-item>
                <el-form-item label="陪同人员地址" prop="address">
                    <el-input v-model="ruleForm.address" placeholder="请输入陪同人员详细地址" />
                </el-form-item>
                <el-form-item label="外出原因" prop="content">
                    <el-input v-model="ruleForm.content" style="width: 500px" :rows="2" type="textarea"
                        placeholder="请输入外出原因" />
                </el-form-item>
            </el-form>
            <!-- 动态按钮文案 -->
            <el-button size="small" type="primary" @click="sub" :loading="isSubmitting">
                <template v-if="isEdit">保存修改</template>
                <template v-else>保存</template>
            </el-button>
            <el-button size="small" @click="cancel">取消</el-button>
        </el-card>
    </div>
</template>

<script setup lang='ts'>
import { reactive, ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, type FormRules, type ElForm } from 'element-plus';
import Relation from '../../components/form/Relation.vue'

// 类型定义
interface ElderlyOutingItem {
    id: number;
    name: string;
}

interface GoOutInfo {
    id: number;
    elderlyId: number;
    elderlyName: string;
    startTime: string;
    endTime: string;
    mobile: string;
    address: string;
    content: string;
    relation: string;
    name: string;
    companyId: number;
    state: number;
    addTime: string;
    addAccountId: number;
}

// 路由实例
const route = useRoute();
const router = useRouter();

// 接收父组件参数
const props = defineProps<{
    elderlyInfo?: { id: number; name: string };
    editInfo?: GoOutInfo; // 编辑回显数据
}>();

// 向父组件派发事件
const emit = defineEmits(['submitSuccess', 'cancel']);

// 提交加载状态
const isSubmitting = ref(false);
// 判断是否为编辑模式（有回显数据则为编辑）
const isEdit = ref(!!props.editInfo);
const size = ref<'default' | 'large' | 'small'>('default')
const ruleFormRef = ref<InstanceType<typeof ElForm>>()
const dateRange = ref<[string, string] | null>(null)

// 核心：获取路由/Props中的老人信息
const getRouteElderlyInfo = () => {
    // 优先从路由参数中获取 id（与 GoOut.vue 页面的传递方式匹配）
    const idFromRoute = Number(route.query.id);
    
    const elderlyId = props.elderlyInfo?.id
        || idFromRoute
        || Number(route.query.elderlyId)
        || Number(localStorage.getItem('elderlyId'))
        || 0;

    const elderlyName = props.elderlyInfo?.name
        || (route.query.elderlyName as string)
        || localStorage.getItem('elderlyName')
        || '';

    console.log('获取老人信息:', { elderlyId, elderlyName });
    return { elderlyId, elderlyName };
};

// 初始化表单数据
const initFormData = (): GoOutInfo => {
    const { elderlyId, elderlyName } = getRouteElderlyInfo();
    // 编辑模式：用回显数据初始化；新增模式：用默认值初始化
    if (props.editInfo) {
        return {
            ...props.editInfo,
            elderlyId: props.editInfo.elderlyId || elderlyId,
            elderlyName: props.editInfo.elderlyName || elderlyName,
        };
    }
    return {
        name: '',
        id: 0,
        companyId: Number(localStorage.getItem('companyId')) || 0,
        elderlyId: elderlyId,
        elderlyName: elderlyName,
        startTime: '',
        endTime: '',
        mobile: '',
        address: '',
        content: '',
        state: 0,
        relation: '',
        addTime: new Date().toISOString(),
        addAccountId: Number(localStorage.getItem('userId')) || 0,
    };
};

// 表单核心数据
const ruleForm = reactive<GoOutInfo>(initFormData());

// 表单校验规则
const rules = reactive<FormRules<GoOutInfo>>({
    elderlyName: [
        { required: true, message: '请先选择外出老人', trigger: 'blur' }
    ],
    startTime: [
        { required: true, message: '请选择外出时间', trigger: 'change' },
        {
            validator: (_rule, _value, callback) => {
                if (!ruleForm.startTime || !ruleForm.endTime) {
                    callback(new Error('请完整选择开始和结束时间'));
                } else if (new Date(ruleForm.startTime) > new Date(ruleForm.endTime)) {
                    callback(new Error('开始时间不能晚于结束时间'));
                } else {
                    callback();
                }
            },
            trigger: 'change'
        }
    ],
    relation: [{ required: true, message: '请选择陪同人关系', trigger: 'blur' }],
    name: [{ required: true, message: '请输入陪同人姓名', trigger: 'blur' }],
    mobile: [
        { required: true, message: '请输入陪同人电话', trigger: 'blur' },
        { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ],
    address: [{ required: true, message: '请输入陪同人地址', trigger: 'blur' }],
    content: [{ required: true, message: '请输入外出原因', trigger: 'blur' }],
})

// 修改handleSingleElderly函数
const handleSingleElderly = (elderly: ElderlyOutingItem) => {
    if (elderly?.id && elderly?.name !== undefined) {
        ruleForm.elderlyId = elderly.id;
        ruleForm.elderlyName = elderly.name;
        localStorage.setItem('elderlyId', elderly.id.toString());
        localStorage.setItem('elderlyName', elderly.name || '');
    } else {
        ElMessage.error('老人信息不完整');
    }
}
// 日期选择处理
const handleDateChange = (val: [string, string] | null) => {
    if (val) {
        const [start, end] = val;
        if (new Date(start) > new Date(end)) {
            ElMessage.error('开始时间不能晚于结束时间，请重新选择');
            dateRange.value = null;
            ruleForm.startTime = '';
            ruleForm.endTime = '';
            return;
        }
        ruleForm.startTime = start;
        ruleForm.endTime = end;
    } else {
        ruleForm.startTime = '';
        ruleForm.endTime = '';
    }
}

// 取消按钮逻辑
const cancel = () => {
    emit('cancel');
    router.push('/care/GoOut');
}

// 提交核心逻辑：区分新增/修改
// 修改提交核心逻辑部分
const sub = async () => {
    // 先做表单校验
    if (!ruleFormRef.value) return;
    try {
        await ruleFormRef.value.validate();
    } catch (error) {
        ElMessage.error('请完善表单必填项');
        return;
    }

    // 验证必填字段
    if (!ruleForm.elderlyId || !ruleForm.elderlyName) {
        ElMessage.error('请先选择外出老人');
        return;
    }

    if (!ruleForm.startTime || !ruleForm.endTime) {
        ElMessage.error('请完整选择外出时间');
        return;
    }

    isSubmitting.value = true;
    try {
        // 模拟提交成功
        setTimeout(() => {
            if (isEdit.value) {
                ElMessage.success('修改成功');
            } else {
                ElMessage.success('添加成功');
            }
            emit('submitSuccess');
            // 提交成功后返回列表页
            router.push('/care/GoOut');
        }, 500);
    } catch (error) {
        ElMessage.error('网络异常，请稍后重试');
        console.error('提交失败：', error);
    } finally {
        isSubmitting.value = false;
    }
}

// 重置表单逻辑
const resetForm = () => {
    if (ruleFormRef.value) {
        ruleFormRef.value.resetFields();
    }
    dateRange.value = null;

    // 重置基础数据（保留老人信息）
    const { elderlyId, elderlyName } = getRouteElderlyInfo();
    Object.assign(ruleForm, {
        name: '',
        elderlyId: elderlyId,
        elderlyName: elderlyName,
        startTime: '',
        endTime: '',
        mobile: '',
        address: '',
        content: '',
        relation: '',
        id: isEdit.value ? ruleForm.id : 0
    });
};

// 初始化编辑数据（日期范围回显）
const initEditData = () => {
    if (isEdit.value) {
        // 回显日期范围
        if (ruleForm.startTime && ruleForm.endTime) {
            dateRange.value = [ruleForm.startTime, ruleForm.endTime];
        }
        console.log('编辑模式初始化数据:', ruleForm);
    }
};

// 监听路由参数变化
watch([() => route.query.elderlyId, () => route.query.elderlyName], () => {
    const { elderlyId, elderlyName } = getRouteElderlyInfo();
    ruleForm.elderlyId = elderlyId;
    ruleForm.elderlyName = elderlyName;
}, { immediate: true });

// 监听编辑数据变化（父组件传值更新时重新初始化）
watch(() => props.editInfo, (newVal) => {
    if (newVal) {
        isEdit.value = true;
        Object.assign(ruleForm, initFormData());
        initEditData();
    }
}, { immediate: true });

// 页面挂载时初始化
onMounted(() => {
    initEditData();

    // 检查是否为编辑模式
    if (isEdit.value) {
        console.log('进入编辑模式');
    } else {
        // 提示未选择老人
        if (!ruleForm.elderlyId) {
            ElMessage.warning('请先返回选择外出老人');
        } else {
            console.log('进入新增模式，已选择老人:', ruleForm.elderlyName);
        }
    }
});

// 暴露方法给父组件
defineExpose({ resetForm, handleSingleElderly });
</script>

<script lang="ts">
export default {
    name: 'AddGoOut'
}
</script>

<style scoped lang='less'>
.el-form-item {
    width: 500px;
    margin-bottom: 16px;
}

.el-card {
    padding: 20px;
}

.el-button {
    margin-top: 20px;
    margin-right: 10px;
    width: 100px;
}
</style>