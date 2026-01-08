<template>
   <div>
      <el-button style="margin-bottom: 10px;" type="primary" @click="add">新增家属</el-button>
      <el-table border :data="data" style="width: 100%" v-loading="loading">
         <el-table-column prop="id" label="序号" />
         <el-table-column prop="name" label="姓名" />
         <!-- 优化：性别值转换为文字显示 -->
         <el-table-column label="性别">
            <template #default="scope">
               {{ scope.row.gender === 1 ? '男' : '女' }}
            </template>
         </el-table-column>
         <el-table-column prop="idCard" label="身份证号" />
         <el-table-column prop="mobile" label="联系电话" />
         <el-table-column prop="address" label="联系地址" />
         <el-table-column prop="relation" label="与老人的关系" />
         <el-table-column fixed="right" label="操作">
            <template #default="scope">
               <el-button link type="primary" @click="toDetail(scope.row)">
                  编辑
               </el-button>
               <el-button link type="primary" @click="delFamily(scope.row.id)">删除</el-button>
            </template>
         </el-table-column>
      </el-table>
      <el-dialog v-model="roleDialogVisible" :title="isEdit ? '修改家属' : '新增家属'" width="500">
         <el-form 
            ref="ruleFormRef" 
            style="max-width: 600px" 
            :model="fromData" 
            :rules="rules" 
            label-width="auto"
         >
            <el-form-item label="姓名:" prop="name">
               <el-input v-model="fromData.name" placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item label="联系电话:" prop="mobile">
               <el-input v-model="fromData.mobile" placeholder="请输入联系电话" />
            </el-form-item>
            <el-form-item label="身份证号:" prop="idCard">
               <el-input v-model="fromData.idCard" placeholder="请输入身份证号" />
            </el-form-item>
            <el-form-item label="与老人关系:" prop="relation">
               <Relation v-model="fromData.relation"></Relation>
            </el-form-item>
            <el-form-item label="性别:" prop="gender">
               <el-radio-group v-model="fromData.gender">
                  <el-radio :value="1" size="large">男</el-radio>
                  <el-radio :value="2" size="large">女</el-radio> <!-- 修复：0改为2，匹配类型定义 -->
               </el-radio-group>
            </el-form-item>
            <el-form-item label="联系地址:" prop="address">
               <el-input v-model="fromData.address" placeholder="请输入联系地址" />
            </el-form-item>
         </el-form>
         <template #footer>
            <div class="dialog-footer">
               <el-button @click="cancel">取消</el-button>
               <el-button type="primary" @click="submitForm">
                  {{ isEdit ? '确认修改' : '确认新增' }}
               </el-button>
            </div>
         </template>
      </el-dialog>
   </div>
</template>

<script setup lang='ts'>
import { inject, reactive, ref, nextTick } from 'vue';
import type { FamilyMember } from '../../api/market/elderlyType';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
import Relation from '../form/Relation.vue'

// 1. 初始化数据，兜底空数组避免undefined
const data = ref<FamilyMember[]>(inject<FamilyMember[]>('familyData') || []);
const loading = ref(false); // 加载状态
const roleDialogVisible = ref(false);
const isEdit = ref(false); // 标记是否为编辑状态
const ruleFormRef = ref<FormInstance>(); // 表单ref

// 2. 表单初始数据（新增默认值）
const initFormData: FamilyMember = {
   id: 0,
   elderlyId: 0, // 可根据实际业务赋值（比如老人ID）
   name: '',
   mobile: '',
   idCard: '',
   relation: '',
   gender: 1, // 1-男，2-女
   address: ''
};
const fromData = ref<FamilyMember>({ ...initFormData });

// 3. 表单校验规则
const rules = reactive<FormRules<FamilyMember>>({
   name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
   mobile: [
      { required: true, message: '请输入联系电话', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' } // 新增手机号校验
   ],
   idCard: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
   relation: [{ required: true, message: '请选择老人关系', trigger: 'blur' }],
   gender: [{ required: true, message: '请选择性别', trigger: 'change' }], // 优化：trigger改为change
   address: [{ required: true, message: '请输入联系地址', trigger: 'blur' }],
});

// 4. 新增家属
const add = () => {
   isEdit.value = false; // 标记为新增
   roleDialogVisible.value = true;
   // 重置表单数据
   fromData.value = { ...initFormData };
   // 重置表单校验状态
   nextTick(() => {
      ruleFormRef.value?.clearValidate();
   });
};

// 5. 编辑家属
const toDetail = (item: FamilyMember) => {
   isEdit.value = true; // 标记为编辑
   roleDialogVisible.value = true;
   // 深拷贝，避免直接修改原数组数据
   fromData.value = { ...item };
   // 重置表单校验状态
   nextTick(() => {
      ruleFormRef.value?.clearValidate();
   });
};

// 6. 提交表单（新增/编辑统一处理）
const submitForm = async () => {
   if (!ruleFormRef.value) return;
   try {
      // 先校验表单
      await ruleFormRef.value.validate();
      loading.value = true;

      if (isEdit.value) {
         // 编辑逻辑：找到对应项并替换
         const index = data.value.findIndex(item => item.id === fromData.value.id);
         if (index > -1) {
            data.value[index] = { ...fromData.value };
            ElMessage.success('修改家属信息成功');
         }
      } else {
         // 新增逻辑：生成唯一ID（实际业务可由后端生成）
         const newId = data.value.length > 0 
            ? Math.max(...data.value.map(item => item.id)) + 1 
            : 1;
         const newFamily = { ...fromData.value, id: newId };
         data.value.push(newFamily);
         ElMessage.success('新增家属成功');
      }

      // 关闭弹窗+重置表单
      roleDialogVisible.value = false;
      fromData.value = { ...initFormData };
   } catch (error) {
      // 表单校验失败不做处理
      console.error('表单校验失败：', error);
   } finally {
      loading.value = false;
   }
};

// 7. 取消操作（关闭弹窗+重置表单）
const cancel = () => {
   roleDialogVisible.value = false;
   fromData.value = { ...initFormData };
   ruleFormRef.value?.clearValidate();
};

// 8. 删除家属
const delFamily = (id: number) => {
   ElMessageBox.confirm(
      '确定要删除该家属信息吗？',
      '删除确认',
      {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         type: 'warning'
      }
   ).then(() => {
      data.value = data.value.filter(item => item.id !== id);
      ElMessage.success('删除成功');
   }).catch(() => {
      ElMessage.info('已取消删除');
   });
};

// 暴露数据供父组件使用
defineExpose({
   data,
});
</script>

<style scoped lang='less'>
.dialog-footer {
   text-align: right;
}
</style>