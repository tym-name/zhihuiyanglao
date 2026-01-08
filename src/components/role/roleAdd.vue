<template>
  <div>
    <el-form :model="form" label-width="auto" style="max-width: 600px">
      <el-form-item label="角色名称">
        <el-input v-model="form.name" />
      </el-form-item>
    </el-form>
    <el-tree-v2 style="max-width: 600px" :data="data" :props="props" show-checkbox :height="200" />
  </div>
</template>

<script setup lang='ts'>
import { reactive } from 'vue';

// 定义树节点接口
interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

const form = reactive({
  name: '',
})

const getKey = (prefix: string, id: number) => {
  return `${prefix}-${id}`
}

const createData = (
  maxDeep: number,
  maxChildren: number,
  minNodesNumber: number,
  deep = 1,
  key = 'node'
): TreeNode[] => {
  let id = 0
  return Array.from({ length: minNodesNumber })
    .fill(deep)
    .map(() => {
      const childrenNumber =
        deep === maxDeep ? 0 : Math.round(Math.random() * maxChildren)
      const nodeKey = getKey(key, ++id)
      return {
        id: nodeKey,
        label: nodeKey,
        children: childrenNumber
          ? createData(maxDeep, maxChildren, childrenNumber, deep + 1, nodeKey)
          : undefined,
      }
    })
}

const props = {
  value: 'id',
  label: 'label',
  children: 'children',
}
const data = createData(4, 30, 40)
</script>

<style scoped lang='less'></style>