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
// import router from '../../router';
import Product from '../../components/company/Product.vue'
import { getPublicKey } from '../../api/index';
import type { ApiResponse } from '../../utile/request';
import { sm2 } from 'sm-crypto';
import router from '../../router';

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
    if (!ruleForm.id) {
        let publicKey: ApiResponse<string> = await getPublicKey(); //调接口获取公钥
        ruleForm.adminPwd = sm2.doEncrypt(ruleForm.adminPwd, publicKey.data); //加密
        await companyAdd(ruleForm);
        ElMessage.success('机构新增成功！');
        router.push('/company');
    } else {
        let publicKey: ApiResponse<string> = await getPublicKey(); //调接口获取公钥
        ruleForm.adminPwd = sm2.doEncrypt(ruleForm.adminPwd, publicKey.data); //加密
        await companyAdd(ruleForm);
        ElMessage.success('机构修改成功！');
        router.push('/company');
    }
}
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