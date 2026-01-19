<template>
 <el-dialog
    v-model="dialogVisible"
    title=""
    width="500"
  >
    <el-form
    ref="ruleFormRef"
    style="max-width: 600px"
    :model="ruleForm"
    :rules="rules"
    label-width="auto"
  >
    <el-form-item label="输入旧密码" prop="pwd">
      <el-input type="password" v-model="ruleForm.pwd" />
    </el-form-item>
     <el-form-item label="输入新密码" prop="newPwd">
      <el-input type="password" v-model="ruleForm.newPwd" />
    </el-form-item>
     <el-form-item label="再次输入新密码" prop="confirmPwd">
      <el-input type="password" v-model="ruleForm.confirmPwd" />
    </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary"@click="submitForm">
          提交
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang='ts'>
import { getPublicKey, updatePwd } from '@/api/index';
import type { UpdatePwd } from '@/api/index/indexType';
import type { ApiResponse } from '@/utils/request';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { sm2 } from 'sm-crypto';
import { reactive, ref } from 'vue';

const dialogVisible = defineModel()

// 表单引用
const ruleFormRef = ref<FormInstance>();

const ruleForm=reactive<UpdatePwd>({
    pwd: '',
    newPwd: '',
    confirmPwd: ''
})

const rules = reactive<FormRules<UpdatePwd>>({
  pwd: [
    { required: true, message: '请输入旧密码', trigger: 'blur' },
  ],
   newPwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
  ],
   confirmPwd: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value === ruleForm.newPwd) {
          callback();
        } else {
          callback(new Error('两次输入的密码不一致'));
        }
      },
      trigger: 'blur'
    }
  ],
})

const submitForm = async () => {
  if (!ruleFormRef.value) return;
  
  try {
    // 表单验证
    await ruleFormRef.value.validate(async (valid) => {
      if (valid) {
        // 表单验证通过，提交密码修改
        let publicKey: ApiResponse<string> = await getPublicKey(); //调接口获取公钥
        ruleForm.pwd = sm2.doEncrypt(ruleForm.pwd, publicKey.data); //加密
        ruleForm.newPwd = sm2.doEncrypt(ruleForm.newPwd, publicKey.data); //加密
        let res=await updatePwd(JSON.parse(JSON.stringify(ruleForm)))
        console.log('修改密码',res);
        
        // 显示成功提示
        ElMessage.success('密码修改成功');
        
        // 关闭对话框
        dialogVisible.value = false
      }
    });
  } catch (error) {
    console.error('密码修改失败:', error);
    ElMessage.error('密码修改失败，请重试');
  }
}
</script>

<style scoped lang='less'>
</style>