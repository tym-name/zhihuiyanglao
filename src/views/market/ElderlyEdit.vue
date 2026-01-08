<template>
  <el-card class="elderly-edit-card">
    {{ elderlyForm }}
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
      <el-button>取消</el-button>
      <el-button type="primary" @click="handleSubmit">保存</el-button>
    </div>
  </el-card>
</template>

<script setup lang='ts'>
import { provide, reactive, ref, watch } from 'vue';
import type { ElderlyInfos, FamilyMember } from '../../api/market/elderlyType';
import ElderlyInfo from '../../components/elderly/ElderlyInfo.vue'
import Nowillness from '../../components/elderly/Nowillness.vue'
import SelfCares from '../../components/elderly/SelfCares.vue'
import Checkups from '../../components/elderly/Checkups.vue'
import Family from '../../components/elderly/Family.vue'
import { ElderlyAdd } from '../../api/market/elderly';
import { ElMessage } from 'element-plus';
const activeName = ref('first')

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
  checkups: [ {
    name: "肝功能+HbsAg",
    picture: "upload/2024/5/21/20240521091004371.png",
    id: 0,
    elderlyId: 0
  },
        {
          name: "肝功能+HbsAg",
          picture: "upload/2024/5/21/20240521091007413.jpg",
          id: 0,
          elderlyId: 0
        },
        {
          name: "血脂全套",
          picture: "upload/2024/5/21/20240521091013674.png",
          id: 0,
          elderlyId: 0
        },
        {
          name: "血脂全套",
          picture: "upload/2024/5/21/20240521091010339.jpg",
          id: 0,
          elderlyId: 0
        }],
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
  buildingName: null
});
let familyData = ref<FamilyMember[]>([]);
provide('familyData', familyData.value)
// 保存老人信息
const handleSubmit = async () => {
    let res=await ElderlyAdd(elderlyForm)
    console.log('老人添加',res);
    ElMessage.success('新增老人成功');
};

watch(familyData.value, () => {
  elderlyForm.family = familyData.value
})
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