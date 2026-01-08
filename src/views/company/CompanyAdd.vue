<template>
    <el-card>
        {{ ruleForm }}
        <Product v-model="ruleForm" :id="id"></Product>
        <div class="substr">
            <el-button @click="$router.push('/company')">取消</el-button>
            <el-button type="primary" @click="handleSave">保存</el-button>
        </div>
    </el-card>
</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue';
import type { CompanyInfo } from '../../api/company/companyType';
import { companyAdd } from '../../api/company/company';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import router from '../../router';
import Product from '../../components/company/Product.vue'

const ruleForm = reactive<CompanyInfo>({
    name: "",
    province: "",
    cityInfo: { province: '', city: '' },
    city: "",
    address: "",
    telephone: null,
    startTime: null,
    legalPerson: null,
    mobile: null,
    creditCode: null,
    license: 0,
    medicalPoint: 0,
    house: null,
    certificate: "",
    picture: "",
    adminUserName: "",
    adminPwd: "",
    adminName: "",
    adminMobile: "",
    id: 0
})

const route = useRoute();

const id = ref<number>(route.query.id as unknown as number);

// 保存按钮点击事件（区分新增/编辑）
const handleSave = async () => {
    const result = await Product.value.submitForm();
    if (!result.success) return;

    try {
        if (id.value) {
            // 编辑：调用编辑接口
            await companyAdd(result.data);
            ElMessage.success('机构编辑成功！');
        } else {
            // 新增：调用新增接口
            await companyAdd(result.data);
            ElMessage.success('机构新增成功！');
        }
        router.push('/company');
    } catch (error) {
        ElMessage.error(id.value ? '机构编辑失败！' : '机构新增失败！');
    }
};
</script>

<style scoped lang='less'>
.substr {
    width: 100%;
    text-align: right;
    margin-left: -160px;
}

.el-button {
    width: 100px;
    height: 40px;
}
</style>