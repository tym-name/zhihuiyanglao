<template>
  <div style="background-color: #fff;padding: 20px;">
     <div>排班管理</div>
    <div class="schedule-manager">
      <el-table :data="scheduleData" style="width: 100%">
        <!-- 班次列 -->
        <el-table-column prop="shift" label="" width="100" fixed />

        <!-- 动态生成星期列 -->
        <el-table-column v-for="day in weekDays" :key="day" :label="day">
          <template #default="{ row }">
            <!-- 选择人员 -->
            <template v-for="item in list" :key="item.id">
              <!-- 只显示当前单元格对应的护工（班次和星期都匹配） -->
              <div v-if="item.day === row.shift && item.week === day"
                style="display: flex; align-items: center; margin-bottom: 5px; margin-top: 5px;">
                <div class="left" style="position: relative; margin-right: 10px;">
                  <img :src="IMG_URL + item.staffPhoto" alt=""
                    style="width: 30px;height: 30px;border-radius: 50%;object-fit: cover;">
                  <el-icon class="close-icon" style="position: absolute; top: -5px; right: -5px;
 cursor: pointer; color: gray; border-radius: 50%; padding: 2px;
  font-size: 12px;" @click="removeStaff(item.id)">
                    <Close />
                  </el-icon>
                </div>
                <div class="right">{{ item.staffName }}</div>
              </div>
            </template>
            <el-button type="primary" :icon="Plus" link @click="openStaffDialog(row.shift, day)">请选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="text-align: center; margin-top: 20px;">
      <el-button @click="goBack">返回</el-button>
    </div>
  </div>

  <!-- 选择护工弹窗 -->
  <choose-staff v-if="dialogVisible" v-model="dialogVisible" @reload="handleAdd">
    <template #operate="{ row }">
      <el-button size="small" type="primary" @click="select(row.id)">选择</el-button>
    </template>
  </choose-staff>

</template>

<script setup lang="ts">

import { onMounted, reactive, ref, } from 'vue';

import { Plus } from '@element-plus/icons-vue';
import ChooseStaff from './ChooseStaff.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Close } from '@element-plus/icons-vue'
import { addElderlySchedule, deleteElderlySchedule, getElderlyScheduleList, getStaffInfo } from '@/api/market/elderly';
import type { AddScheduleParams, StaffSchedule } from '@/api/market/elderlyType';
import router from '@/router';

//图片根路径
const IMG_URL = import.meta.env.VITE_IMG_URL;

const dialogVisible = ref(false);

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

const props = defineProps<{
  id: number
}>()

const list = ref<StaffSchedule[]>([])



// 当前编辑的单元格信息
const currentEditCell = ref<{
  shift: string;
  day: string;
} | null>(null);

onMounted(async () => {
  await loadScheduleData()
})

/**
 * 获取老人排班列表
 */
const loadScheduleData = async () => {
  if (props.id) {
    try {
      const res = await getElderlyScheduleList(props.id);

      // ✅ 确保数据正确赋值
      list.value = res.data.list || [];
    } catch (error) {
      console.error('加载排班数据失败:', error);
      ElMessage.error('加载排班数据失败');
      list.value = []; // 失败时清空列表
    }
  }
};

// 表格数据（仅显示班次行）
const scheduleData = reactive([
  { shift: '白班' },
  { shift: '夜班' },
]);


// 打开选择护工弹窗
const openStaffDialog = (shift: string, day: string) => {
  currentEditCell.value = { shift, day };
  dialogVisible.value = true;
};


/**
 * 根据员工id选择护工
 */
const select = async (id: number) => {
  if (!currentEditCell.value || !props.id) {
    ElMessage.warning('请先选择排班位置');
    return;
  }

  try {
    // 1. 先获取员工详情
    const staffRes = await getStaffInfo(id);

    if (!staffRes.data || !staffRes.data.id) {
      ElMessage.warning('未查询到该员工信息');
      return;
    }

    const selectedStaff = staffRes.data;
    const { shift, day } = currentEditCell.value;

    // 2. 检查是否已存在排班
    const existingIndex = list.value.findIndex(item =>
      item.elderlyId === props.id &&
      item.day === shift &&
      item.week === day &&
      item.staffId === selectedStaff.id
    );

    if (existingIndex > -1) {
      ElMessage.warning('该护工已在此时间段排班');
      return;
    }

    // 3. 构建排班数据
    const scheduleParams: AddScheduleParams = {
      elderlyId: props.id,
      day: shift as "白班" | "夜班",
      week: day as "周一" | "周二" | "周三" | "周四" | "周五" | "周六" | "周日",
      staffId: selectedStaff.id
    };



    // 4. 调用添加排班接口
    const addRes = await addElderlySchedule(scheduleParams);


    if (addRes.code === 10000) {
      // 5. 重新加载排班列表
      await loadScheduleData();
      ElMessage.success('护工添加成功');
    } else {
      ElMessage.error(addRes.msg || '添加护工失败');
    }
  } catch (error) {
    console.error('选择护工失败:', error);
    ElMessage.error('添加护工失败，请重试');
  } finally {
    // 关闭选择弹窗
    dialogVisible.value = false;
    currentEditCell.value = null;
  }
};

// 移除护工
const removeStaff = async (scheduleId: number) => {
  try {
    // 确认删除
    await ElMessageBox.confirm('确定要移除该护工吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });



    //调接口删除护工
    const res = await deleteElderlySchedule(scheduleId);
    if (res.code === 10000) {
      ElMessage.success('移除成功');
      // 刷新列表
      // elderlyScheduleList(props.id)
      loadScheduleData()

    } else {
      ElMessage.error(res.msg || '移除失败');
    }
  } catch (error) {
    console.error('移除护工失败:', error);
    if (error !== 'cancel') {
      ElMessage.error('移除失败');
    }
  }
};
//关闭添加弹出框时刷新列表
const handleAdd = () => {
  //关闭弹出框
  dialogVisible.value = false
  currentEditCell.value = null;

}

//返回
const goBack = () => {
  router.back()
}
</script>

<style scoped lang="less">
.close-icon {
  transition: all 0.3s ease;
}

.close-icon:hover {
  background-color: white;
  color: gray;
}
.schedule-manager{
  margin-top: 20px;
  width: 100%;
}
/deep/.el-card__body{
  display: block;
}
</style>