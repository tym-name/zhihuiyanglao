<template>
  <el-card class="elderly-edit-card">
    <el-tabs v-model="activeName" type="card" class="demo-tabs">
      <el-tab-pane label="基本信息" name="first">
        <ElderlyInfo v-model="elderlyForm"></ElderlyInfo>
      </el-tab-pane>
      <el-tab-pane label="健康信息" name="second">
        <Nowillness title="现病史" v-model="elderlyForm.health.nowillness"></Nowillness>
        <Nowillness title="既往病史" v-model="elderlyForm.health.oldillness"></Nowillness>
        <div>
          <div class="text">其他疾病</div>
          <el-input v-model="elderlyForm.health.otherillness" :rows="2" type="textarea" placeholder="如有其它疾病，请输入" />
        </div>
        <SelfCares v-model="elderlyForm.selfCares"></SelfCares>
        <div class="edit">
          <div class="text">其他特殊情况说明</div>
          <el-input v-model="elderlyForm.health.otherCase" :rows="2" type="textarea" placeholder="如有其他特殊情况，请输入" />
        </div>
        <Checkups v-model="elderlyForm.checkups"></Checkups>
      </el-tab-pane>
      <el-tab-pane label="家属信息" name="third">
        <Family></Family>
      </el-tab-pane>
    </el-tabs>
    <div class="round">
      <el-button @click="router.push('/elderly')">取消</el-button>
      <el-button type="primary" @click="handleSubmit">保存</el-button>
    </div>
  </el-card>
</template>

<script setup lang='ts'>
import { onMounted, provide, reactive, ref, watch } from 'vue';
import type { ElderlyInfos, FamilyMember } from '../../api/market/elderlyType';
import ElderlyInfo from '../../components/elderly/ElderlyInfo.vue'
import Nowillness from '../../components/elderly/Nowillness.vue'
import SelfCares from '../../components/elderly/SelfCares.vue'
import Checkups from '../../components/elderly/Checkups.vue'
import Family from '../../components/elderly/Family.vue'
import { ElderlyAdd, elderlyGet, ElderlyUpdate } from '../../api/market/elderly';
import { ElMessage } from 'element-plus';
import router from '../../router';
import { useRoute } from 'vue-router';

const activeName = ref('first')
const route = useRoute(); // 实例化路由，获取传递的参数
const elderlyId = ref<number>(0); // 存储老人id，用于详情查询和更新

// 老人表单
let elderlyForm = reactive<ElderlyInfos>({
  name: "",
  mobile: "",
  photo: "",
  gender: 0,
  birthday: "",
  nativePlace: "",
  nation: "",
  idCard: "",
  politics: "",
  socialCard: "",
  marriage: "",
  eduLevel: "",
  education: "",
  resident: "",
  address: "",
  health: {
    oldillness: "",
    nowillness: "",
    otherillness: "",
    otherCase: "",
    id: 0,
    elderlyId: 0
  },
  selfCares: [],
  checkups: [],
  family: [],
  id: 0,
  companyId: 0,
  begId: 0,
  houseId: 0,
  state: 1,
  addTime: '',
  addAccountId: 0,
  stateName: null,
  begName: null,
  addAccountName: null,
  houseName: null,
  buildingName: null,
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
    // 新增模式：不报错，仅静默初始化（可选：给出新增模式提示）
    elderlyId.value = 0;
    ElMessage.success('进入新增老人模式，请填写相关信息');
  }
});

// 3. 详情接口调用 + 数据回显赋值
const getElderlyDetail = async () => {
  try {
    const res = await elderlyGet(elderlyId.value); // 调用详情接口，传入老人id
    if (res && res.code === 10000) { // 适配后端接口返回格式，可根据实际调整
      const detailData = res.data;
      
      // 4. 为elderlyForm赋值，实现全页面数据回显（响应式自动同步到组件）
      Object.assign(elderlyForm, detailData);
      
      // 5. 家属数据单独回显（同步到familyData，确保Family组件回显）
      if (detailData.family && Array.isArray(detailData.family)) {
        familyData.value = [...detailData.family];
      }
      
      // 6. 修复checkups的picture属性（兼容无该字段的情况，避免编辑时报错）
      elderlyForm.checkups = elderlyForm.checkups.map(checkup => ({
        ...checkup,
        picture: checkup.picture || ''
      }));
      
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
const handleSubmit = async () => {
  // 统一处理checkups的picture属性，避免提交时缺失字段
  const formWithValidCheckups = {
    ...elderlyForm,
    checkups: elderlyForm.checkups.map(checkup => ({
      ...checkup,
      picture: checkup.picture || ''
    }))
  };

  try {
    let res;
    if (elderlyId.value) {
      // 编辑模式：调用更新接口，传入老人id和编辑后的数据
      res = await ElderlyUpdate(elderlyId.value, formWithValidCheckups);
      ElMessage.success('老人信息编辑成功');
    } else {
      // 新增模式：调用原有的新增接口
      res = await ElderlyAdd(formWithValidCheckups);
      ElMessage.success('新增老人成功');
    }

    console.log(elderlyId.value ? '老人编辑' : '老人添加', res);
    // 跳转回老人列表页
    router.push('/elderly');
  } catch (error) {
    console.error(elderlyId.value ? '老人编辑出错' : '老人添加出错', error);
    ElMessage.error(elderlyId.value ? '编辑老人失败，请稍后重试' : '新增老人失败，请稍后重试');
  }
};

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