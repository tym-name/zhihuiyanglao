<template>
    <el-card class="elderly-edit-card">
        <CustomerInfo v-model="elderlyForm" @form="form"></CustomerInfo>
        <Family v-model="elderlyForm.family"></Family>
        <Summary></Summary>
        <div class="round">
            <el-button @click="router.push('/elderly')">取消</el-button>
            <el-button type="primary" @click="handleSubmit">保存</el-button>
        </div>
    </el-card>
</template>

<script setup lang='ts'>
import { onMounted, provide, reactive, ref, watch } from 'vue';
import CustomerInfo from '../../components/form/CustomerInfo.vue'
import Summary from '../../components/form/Summary.vue'
import Family from '../../components/elderly/Family.vue'
import { ElMessage } from 'element-plus';
import router from '../../router';
import { useRoute } from 'vue-router';
import { customerAdd, customerGet } from '../../api/customer/customer';
import type { FamilyMember } from '../../api/market/elderlyType';

const route = useRoute(); // 实例化路由，获取传递的参数
const elderlyId = ref<number>(0); // 存储老人id，用于详情查询和更新

    /* 子组件传过来得知 */
    function form(e:any){
       Object.assign(elderlyForm, e)
    }
// 潜在客户添加表单
let elderlyForm = reactive<any>({
        name: "",
        mobile: "",
        gender: 1,
        birthday: null,
        status: "",
        idCard: "",
        roomRequire: " ",
        content: " ",
        state: 1,
        source: "在线咨询",
        family: []
});
let familyData = ref<FamilyMember[]>([]);

// 关键修复：provide传递响应式数据（直接传递ref.value会丢失响应式）
provide('familyData', familyData);

onMounted(async () => {
    // 两种传参方式兼容：① 查询参数（?id=1） ② 动态路由参数（/elderly/edit/1）
    const id = route.query.id || route.params.id;

    if (id && !isNaN(Number(id))) {
        elderlyId.value = Number(id);
        // 编辑模式：调用详情接口，加载回显数据
        await getElderlyDetail();
    } else {
        elderlyId.value = 0;
        ElMessage.success('进入新增潜在客户页面，请填写相关信息');
    }
});

// 3. 详情接口调用 + 数据回显赋值
const getElderlyDetail = async () => {
    try {
        const res = await customerGet(elderlyId.value); // 调用详情接口，传入老人id
        if (res && res.code === 10000) { // 适配后端接口返回格式，可根据实际调整
            const detailData = res.data;
            // 4. 为elderlyForm赋值，实现全页面数据回显（响应式自动同步到组件）
            Object.assign(elderlyForm, detailData);

            // 5. 家属数据单独回显（同步到familyData，确保Family组件回显）
            if (detailData.family && Array.isArray(detailData.family)) {
                familyData.value = [...detailData.family];
            }


            ElMessage.success('数据加载完成，可进行编辑');
        } else {
            ElMessage.error('获取老人详情失败：' + (res?.msg || '接口返回异常'));
        }
    } catch (error) {
        console.error('获取老人详情出错：', error);
        ElMessage.error('获取老人详情失败，请稍后重试');
    }
};

// 保存老人信息（支持新增 + 编辑双逻辑）
/* // const handleSubmit = async (elderlyForm: ElderlyInfoAdd) => {
//     let res = await customerAdd(elderlyForm)
//     console.log('新增潜在客户', res);
//     ElMessage.success('保存成功');
//     router.push('/Customer');

// }; */

const handleSubmit = async () => {
    let red = await customerAdd(elderlyForm)
    console.log('新增潜在客户', red );
    ElMessage.success('保存成功');
    router.push('/Customer');
    
}

watch(familyData, (newVal) => {
    if (newVal && Array.isArray(newVal)) {
        elderlyForm.family = [...newVal]; // 深拷贝避免引用类型污染
    }
}, { deep: true }); // deep: true 开启深度监听，监听数组内部元素变化
</script>

<style scoped lang='less'>
.round {
    text-align: center;
}

.text {
    margin-bottom: 10px;
}

.edit {
    margin-top: 20px;
}

.round {
    margin-top: 20px;
}
</style>