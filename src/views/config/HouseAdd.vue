<template>
  <div>
    <!-- 动态切换弹窗标题 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑房间' : '新增房间'" width="500">
      <!-- 调试：查看完整层级数据 -->
      <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto">
        <el-form-item label="房间号" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入房间号" />
        </el-form-item>
        <el-form-item label="房间类型" prop="typeName">
          <el-select v-model="ruleForm.typeName" placeholder="请选择">
            <el-option v-for="item in options" :key="item.name" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属楼层" prop="buildingId">
            <CascaderBeg v-model="ruleForm.buildingId" @bedChange="bedChange" :type="'bed'" />
        </el-form-item>
        <el-form-item label="床位数" prop="beds">
          <el-input v-model="ruleForm.beds" placeholder="请输入床位数" />
        </el-form-item>
        <el-form-item label="房间图片" prop="picture">
          <uploads v-model="ruleForm.picture" :baseUrl="VITE_IMG_URL" :uploadUrl="imageUrl"></uploads>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="getPatrolAdd">
            提交
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang='ts'>
import { reactive, ref, watch } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import type { BuildingInfo } from '@/api/house/houseType';
import { housetypeAdd, housetypeUpdate } from '@/api/house/house';
import { housetypeList } from '@/api/houseType/house';
import type { HouseList } from '@/api/houseType/houseType';
import uploads from '@/components/upload/Uploads.vue'
import CascaderBeg from '@/components/form/CascaderBeg.vue'

// 1. 弹窗显隐双向绑定
const dialogVisible = defineModel()
const VITE_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VITE_IMG_URL = import.meta.env.VITE_IMG_URL;
const imageUrl = VITE_BASE_URL + '/upload/add';
// 2. 接收父组件传递的编辑数据（修正：变量名避免冲突，后续用 propsData 表示组件属性）
const propsData = defineProps<{
  editData?: BuildingInfo;
}>()

// 3. 定义表单相关（核心修正：添加 cascaderValue 存储级联完整层级数据）
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<BuildingInfo>({
  name: "",
  id: 0,
  buildingId: 0,
  type: 0,
  beds: null,
  picture: '',
  typeName: '',
})

// 4. 区分新增/编辑状态
const isEdit = ref(false)

let bedChange = (idArr: number[]) => {
    ruleForm.buildingId = idArr[idArr.length - 1]
}

// 5. 表单校验规则（修正：校验级联选择器的绑定字段 cascaderValue）
const rules = reactive<FormRules<BuildingInfo>>({
  name: [
    { required: true, message: '请输入房间号', trigger: 'blur' },
  ],
  typeName: [
    { required: true, message: '请选择房间类型', trigger: 'blur' },
  ],
  buildingId: [
    { required: true, message: '请选择所属楼层', trigger: 'change' }, // 级联用 change 触发更合适
  ],
  beds: [
    { required: true, message: '请输入床位数', trigger: 'blur' },
  ],
  picture: [
    { required: true, message: '请选择房间图片', trigger: 'blur' },
  ]

})

const housetype = {
  page: 1,
  pageSize: 10
}

const options = ref<HouseList[]>([])

const gethousetypeList = async () => {
  let res = await housetypeList(housetype)
  console.log('房间类型', res);
  options.value = res.data.list
}

gethousetypeList()

// 6. 定义成功事件派发
const emit = defineEmits<{
  (e: 'save-success'): void
}>()

// 7. 表单重置方法（修正：重置 cascaderValue 数组）
const resetForm = () => {
  ruleForm.name = "";
  ruleForm.id = 0;
  ruleForm.buildingId = 0;
  ruleForm.type = 0;
  ruleForm.picture = '';
  ruleForm.typeName = '';
  ruleFormRef.value?.clearValidate();
}

// 8. 监听编辑数据，实现回显/重置
watch(() => propsData.editData, (newVal) => {
  if (newVal) {
    isEdit.value = true;
    Object.assign(ruleForm, newVal);
    // 可选：编辑状态下回显级联选择器（需构造完整层级数组，如 [buildingId, type]）
    // 示例：若 newVal 中有 buildingId 和 type，构造层级数组（需根据实际数据源调整）
    console.log("子组件接收的编辑数据：", newVal);
  } else {
    isEdit.value = false;
    resetForm(); // 新增状态重置表单
  }
}, { immediate: true })

// 可选：弹窗关闭时重置表单
watch(dialogVisible, (newVal) => {
  if (!newVal) {
    resetForm();
  }
})

// 9. 统一提交方法（区分新增/编辑）
const getPatrolAdd = async () => {
  // 表单校验
  if (ruleFormRef.value) {
    try {
      await ruleFormRef.value.validate()
    } catch (error) {
      ElMessage.error('表单校验失败，请完善必填项');
      return;
    }
  }

  // 提交接口
  try {
    if (isEdit.value) {
      await housetypeUpdate(ruleForm); // 编辑：调用更新接口
      ElMessage.success('更新成功');
    } else {
      await housetypeAdd(ruleForm); // 新增：调用添加接口
      ElMessage.success('添加成功');
    }

    dialogVisible.value = false;
    emit('save-success'); // 统一派发刷新事件
    resetForm();
  } catch (error) {
    ElMessage.error(isEdit.value ? '更新失败，请重试' : '添加失败，请重试');
    console.error(isEdit.value ? '服务更新失败' : '服务添加失败', error);
  }
}
</script>

<style scoped lang='less'></style>