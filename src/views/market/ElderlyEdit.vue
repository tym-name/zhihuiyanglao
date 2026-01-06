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
        <Family v-model="elderlyForm.family"></Family>
      </el-tab-pane>
    </el-tabs>
    <div class="round">
      <el-button>取消</el-button>
      <el-button type="primary" @click="handleSubmit">保存</el-button>
    </div>
  </el-card>
</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue';
import type { ElderlyInfos } from '../../api/market/elderlyType';
import ElderlyInfo from '../../components/elderly/ElderlyInfo.vue'
import Nowillness from '../../components/elderly/Nowillness.vue'
import SelfCares from '../../components/elderly/SelfCares.vue'
import Checkups from '../../components/elderly/Checkups.vue'
import Family from '../../components/elderly/Family.vue'
const activeName = ref('first')

// 老人表单
let elderlyForm = reactive<ElderlyInfos>({
  id: 0,
  companyId: 0,
  name: '',
  mobile: '',
  photo: '',
  gender: 1,
  birthday: '',
  nativePlace: '',
  nation: '',
  idCard: '',
  politics: '',
  socialCard: '',
  marriage: '',
  eduLevel: '',
  education: '',
  resident: '',
  address: '',
  begId: 0,
  houseId: 0,
  state: 3,
  addTime: '',
  addAccountId: 0,
  stateName: '',
  begName: '',
  addAccountName: '',
  houseName: '',
  buildingName: '',
  health: {
    nowillness: '',
    oldillness: '',
    otherillness: '',
    otherCase: '',
    id: 0,
    elderlyId: 0
  },
  selfCares: [],
  checkups: [],
  family: []
});

// 保存老人信息
const handleSubmit = async () => {

};
</script>

<style scoped lang='less'>
.round {
  text-align: center;
}

.text {
  margin-bottom: 10px;
}
.edit{
  margin-top: 20px;
}
.round{
  margin-top: 20px;
}
</style>