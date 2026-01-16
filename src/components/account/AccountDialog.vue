<template>
    <el-dialog v-model="showDialog" :title="dialogTitle" style="width: 450px;">
        <el-form :model="form" label-width="auto" :rules="rules" ref="ruleFormRef">
            <el-form-item label="头像" prop="photo">
                <uploads v-model="form.photo" :baseUrl="VITE_IMG_URL" :uploadUrl="imageUrl"></uploads>
            </el-form-item>
            <el-form-item label="姓名" prop="username">
                <el-input v-model="form.username" placeholder="请输入姓名" style="width:222.54px" />
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="form.mobile" placeholder="请输入手机号" style="width:222.54px" />
            </el-form-item>
            <el-form-item label="账号" prop="name">
                <el-input v-model="form.name" placeholder="请输入账号" style="width:222.54px" />
            </el-form-item>
            <!-- 新增时显示密码（必填），编辑时隐藏密码（避免覆盖原有密码） -->
            <el-form-item label="密码" prop="pwd" v-if="!form.id">
                <el-input v-model="form.pwd" type="password" placeholder="请输入密码" style="width:222.54px" />
            </el-form-item>
            <el-form-item label="所属角色" prop="roleIds">
                <el-select v-model="form.roleIds" multiple placeholder="请选择" style="width:222.54px">
                    <el-option v-for="role in roleData" :key="role.id" :label="role.name" :value="role.id" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="resetForm(ruleFormRef)">关闭</el-button>
                <el-button type="primary" @click="submitForm(ruleFormRef)">
                    提交
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref, reactive, computed, nextTick } from 'vue';
import { ElMessage } from 'element-plus'
import type { FormRules, FormInstance } from 'element-plus'
import { accountAdd, roleList, accountGet, accountUpdate } from '../../api/account/account';
import type { accountAddData, AccountResult, roleData } from '../../api/account/accountType'
import uploads from '../upload/Uploads.vue'
import { getPublicKey } from '../../api/index';
import type { ApiResponse } from '../../utils/request';
import { sm2 } from 'sm-crypto';

// 定义emit事件，用于通知父组件刷新列表
const emit = defineEmits(['refreshAccountList']);

// 2. 优化弹窗标题：正确区分新增/编辑（原判断form.id !== 1不合理，改为form.id > 0）
const dialogTitle = computed(() => {
    return form.id && form.id > 0 ? '修改账号' : '添加账号';
});

const VITE_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VITE_IMG_URL = import.meta.env.VITE_IMG_URL;
const imageUrl = VITE_BASE_URL + 'upload/add';

// 表单
const ruleFormRef = ref<FormInstance>()
const showDialog = ref(false)
const form = reactive<accountAddData>({
    id: 0,
    username: "",
    pwd: "",
    name: "",
    enable: 1,
    photo: "",
    mobile: "",
    roleIds: [],
})

// 3. 优化校验规则：编辑时密码非必填（仅新增时必填）
const rules = reactive<FormRules<accountAddData>>({
    photo: { required: true, message: '头像不能为空', trigger: 'blur' },
    username: { required: true, message: '姓名不能为空', trigger: 'blur' },
    mobile: [
        { required: true, message: '手机号不能为空', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
    ],
    name: { required: true, message: '账号不能为空', trigger: 'blur' },
    // 仅新增时（form.id不存在）密码必填，编辑时不校验密码
    pwd: { 
        required: true, message: '请输入密码', trigger: 'blur'
    },
    roleIds: { 
        required: true, 
        message: '请选择角色', 
        trigger: 'change',
        validator: (_rule, value) => Array.isArray(value) && value.length > 0
    },
})

// 所属角色
const roleData = ref<roleData[]>([])
const getroleList = async () => {
    try {
        const res = await roleList()
        console.log('所属角色', res);
        if (res.code === 10000 && res.data?.list) {
            roleData.value = res.data.list
        } else {
            ElMessage.error('获取角色列表失败')
        }
    } catch (error) {
        console.error('获取角色列表失败：', error);
        ElMessage.error('加载角色列表失败，请刷新重试')
    }
}
getroleList()

// 重置表单
const resetform = () => {
    Object.assign(form, {
        id: 0,
        username: "",
        pwd: "",
        name: "",
        enable: 1,
        photo: "",
        mobile: "",
        roleIds: [],
    })
}

// 4. 新增：获取账号详情（编辑模式专用，用于回显数据）
const getAccountDetail = async (id: number) => {
    try {
        const res = await accountGet(id)
        console.log('账号详情', res);
        if (res.code === 10000 && res.data) {
            const detail = res.data
            // 回显账号基础信息
            form.id = detail.id || 0
            form.username = detail.name || '' // 对应表格中的姓名字段
            form.mobile = detail.mobile || ''
            form.name = detail.username || '' // 对应表格中的账号字段
            form.photo = detail.photo || ''
            
            // 回显所属角色：确保为数组格式，兼容后端返回的多种数据类型
            form.roleIds = detail.roleIds 
                ? (Array.isArray(detail.roleIds) ? detail.roleIds : [detail.roleIds]) 
                : []
            
            // 确保角色回显同步到视图（等待组件渲染完成）
            nextTick(() => {
                ruleFormRef.value?.clearValidate('roleIds') // 清除角色字段的校验提示
            })
        } else {
            ElMessage.error('获取账号详情失败')
        }
    } catch (error) {
        console.error('获取账号详情失败：', error);
        ElMessage.error('加载账号详情失败，请刷新重试')
    }
}

// 5. 优化提交方法：区分新增/编辑接口，分别处理
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    
    try {
        await formEl.validate(async (valid) => {
            if (valid) {
                // 构建提交数据，深拷贝避免修改原表单
                const submitData = { ...form }
                let res: any;

                // 区分新增/编辑逻辑
                if (form.id && form.id > 0) {
                    // 调用编辑接口
                    res = await accountUpdate(submitData)
                } else {
                    // 新增模式：密码加密后提交
                    let publicKey: ApiResponse<string>;
                    try {
                        publicKey = await getPublicKey();
                        if (!publicKey.data) {
                            ElMessage.error('获取加密公钥失败，无法提交');
                            return;
                        }
                        submitData.pwd = sm2.doEncrypt(form.pwd, publicKey.data, 1);
                    } catch (encryptError) {
                        console.error('密码加密失败：', encryptError);
                        ElMessage.error('密码加密失败，请重试');
                        return;
                    }
                    // 调用新增接口
                    res = await accountAdd(submitData)
                }

                console.log(form.id > 0 ? '编辑账号结果' : '添加账号结果', res);
                
                // 提交成功处理
                if (res.code === 10000) {
                    const successMsg = form.id > 0 ? '编辑成功' : '提交成功'
                    ElMessage.success(successMsg);
                    showDialog.value = false;
                    emit('refreshAccountList'); // 通知父组件刷新列表
                } else {
                    const errorMsg = res.msg || (form.id > 0 ? '编辑失败' : '提交失败')
                    ElMessage.error(errorMsg);
                }
            } else {
                ElMessage.error('表单填写有误，请检查后提交');
            }
        })
    } catch (error) {
        console.error('提交流程异常：', error);
        ElMessage.error('提交失败，请稍后重试');
    }
}

// 取消弹窗，重置表单
const resetForm = (formEl: FormInstance | undefined) => {
    if (formEl) {
        nextTick(() => {
            formEl.resetFields(); // 重置表单校验状态
        });
    }
    showDialog.value = false;
    resetform();
}

// 6. 优化打开弹窗方法：完善编辑模式的详情回显
const openDialog = (row?: AccountResult) => {
    // 先重置表单，避免残留上一次的数据
    resetform();
    showDialog.value = true;
    
    // 编辑模式：传入row数据时，获取账号详情并回显
    if (row && row.id) {
        nextTick(async () => {
            // 确保角色列表已加载完成，再回显角色数据
            if (roleData.value.length === 0) {
                await getroleList();
            }
            // 调用详情接口，回显完整数据
            await getAccountDetail(row.id);
        })
    }
}

// 暴露方法给父组件
defineExpose({
    openDialog,
})
</script>

<style scoped lang='less'>
.avatar-uploader {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    text-align: center;
}

.dialog-footer {
    text-align: right;
}

.el-button {
    margin-left: 10px;
}
</style>