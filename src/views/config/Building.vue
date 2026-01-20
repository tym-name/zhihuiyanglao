<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-card style="max-width: 100vw">
    <div class="top">
      <el-button type="success" @click="addBull"><i class="iconfont icon-jia"></i>新增楼层</el-button>
    </div>
    <div class="tree">
      <el-tree style="max-width: 600px" :data="dataSource" show-checkbox node-key="id" 
        :expand-on-click-node="false" :props="{
          label: 'name',
          value: 'name',
          children: 'children'
        }">
        <template #default="{ node, data }">
          <div class="custom-tree-node">
            <span>{{ node.label }}</span>
            <div>
              <el-button style="width: 30px; height: 30px;" type="success" circle @click="addone(data)">
                <i class="iconfont icon-jia"></i>
              </el-button>
              <el-button style="margin-left: 4px;width: 30px; height: 30px;" type="primary" circle @click="edit(data)">
                <span class="iconfont icon-bianji"></span>
              </el-button>
              <el-button style="margin-left: 4px;width: 30px; height: 30px;" circle type="danger" @click="remove(node, data)">
                <span class="iconfont icon-shanchu"></span>
              </el-button>
            </div>
          </div>
        </template>
      </el-tree>
    </div>

    <!-- 新增弹出 -->

    <el-dialog v-model="dialogVisible" :title="!isEnit ? '新增楼层' : '修改楼层'" width="500" :before-close="addBull">
      <div>
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto">
          <el-form-item label="名称" prop="name">
            <el-input v-model="ruleForm.name" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="add(ruleFormRef)">
            提交
          </el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>
<script setup lang='ts'>
import { buildingAdd, buildingDelete, buildingList, buildingUpdate } from '@/api/building/building'
import type { BuildingItem, RuleForm } from '@/api/market/elderlyType'
import { buildTree, type TreeNode } from '@/utils/treeUtil'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules, type RenderContentContext } from 'element-plus'
import { reactive, ref } from 'vue'


const dialogVisible = ref(false)
type Node = RenderContentContext['node']
type Data = RenderContentContext['data']


const dataSource = ref<TreeNode[]>([])
// 列表
const getList = async () => {
  const res = await buildingList()
  dataSource.value = buildTree(res.data.list)
  console.log('楼栋列表',res);

}
getList()
// 删除
const remove = async (_node: Node, data: Data) => {
  ElMessageBox.confirm(
    '是否删除该条节点？',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      await buildingDelete(data.id)
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      getList()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除失败',
      })
    })
}

const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive<RuleForm>({
  name: '',
  id: 0,
  pid: 0,
})
const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
  ],
})
const isEnit = ref(false)

// 子节点
const addone = async (data: BuildingItem) => {
  ruleForm.pid = data.id
  dialogVisible.value = true
  isEnit.value = false
}
// 编辑
const edit = async (data:BuildingItem) => {
  isEnit.value = true
  ruleForm.name = data.name
  ruleForm.id = data.id
  ruleForm.pid = data.pid
  dialogVisible.value = true
}
const addBull = () => {
  dialogVisible.value = true
}
const addBuil =async()=>{
    if (!isEnit.value) {
    const res = await buildingAdd(ruleForm)
    console.log(res);
    if (res.code == 10000) {
      ElMessage.success('添加成功')
      dialogVisible.value = false
      getList()
    }
  } else {
    const res = await buildingUpdate(ruleForm)
    if (res.code == 10000) {
      ElMessage.success('修改成功')
      dialogVisible.value = false
      getList()
    }
  }
  ruleForm.id = 0
  ruleForm.name = ''
}
const add = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      addBuil()
    } else {
      console.log('error submit!', fields)
    }
  })
}

</script>
<style scoped lang='less'>
.tree {
  margin-top: 20px;
  width: 560px;
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .el-button {
    width: 22px;
    height: 22px;
    margin-right: 16px;
  }
}

.iconfont {
  margin: 5px;
}
/deep/.el-tree-node__content{
  margin-bottom: 10px;
}
</style>
