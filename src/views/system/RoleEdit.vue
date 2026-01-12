<template>
  <div>
    <el-card style="max-width: 100%">
      <el-form :model="form" label-width="auto" style="max-width: 400px">
        <el-form-item label="角色名称">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
      </el-form>
      <el-form-item label="权限配置">
        <el-tree ref="treeRef" :data="treeMenuList" show-checkbox node-key="id" default-expand-all :props="treeProps"
          :checked-keys="ruleForm.menuIds" @check="handleCheckChange" />
      </el-form-item>
      <el-form-item>
        <el-button>关闭</el-button>
        <el-button type="primary" @click="addRole">确定</el-button>
      </el-form-item>
    </el-card>
  </div>
</template>

<script setup lang='ts'>
import { onMounted, reactive, ref } from 'vue';
import { menuList, roleAdd } from '../../api/role';
import type { MenuItem, RolePermission } from '../../api/roleList';
import { ElMessage } from 'element-plus';
import router from '../../router';

onMounted(() => {
  getmenuList()
})

// 原始扁平菜单列表
const rawMenuList = ref<MenuItem[]>([]);
// 处理后的树形菜单列表
const treeMenuList = ref<MenuItem[]>([]);

/**
 * 将扁平的菜单列表转换为树形结构
 * @param list 扁平菜单列表
 * @param pid 父节点ID，默认0（顶级节点）
 * @returns 树形结构的菜单列表
 */
const buildTreeData = (list: MenuItem[], pid: number = 0): MenuItem[] => {
  return list
    .filter(item => item.pid === pid)  // 筛选当前父节点下的子节点
    .map(item => {
      // 递归查找子节点
      const children = buildTreeData(list, item.id);
      return {
        ...item,
        children: children.length > 0 ? children : [] // 补充children字段
      };
    });
};

const getmenuList = async () => {
  try {
    const res = await menuList();
    console.log('权限列表', res);
    if (res.data && res.data.list) {
      rawMenuList.value = res.data.list;
      // 构建树形结构
      treeMenuList.value = buildTreeData(rawMenuList.value);
    }
  } catch (error) {
    console.error('获取权限列表失败：', error);
    ElMessage.error('加载权限列表失败，请刷新重试');
  }
};

const ruleForm = reactive<RolePermission>({
  id: 0,
  name: '',
  menuIds: []
});

const handleCheckChange = (_node: any, checkedInfo: { checkedKeys: number[] }) => {
  // 更新表单中的选中权限ID
  ruleForm.menuIds = checkedInfo.checkedKeys;
  console.log('选中的权限ID：', ruleForm.menuIds);
};

const treeProps = {
  label: 'name',    // 节点显示的文本字段
  children: 'children' // 子节点字段名
};


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

// 添加角色
const addRole = async () => {
  try {
    const res = await roleAdd(ruleForm);
    console.log('添加角色结果', res);
    if (res.code === 200) {
      ElMessage.success('添加角色成功');
      // 添加成功后，重置表单
      ruleForm.name = '';
      ruleForm.menuIds = [];
      // 重置树形结构
      treeMenuList.value = buildTreeData(rawMenuList.value);
      router.push('/Role');
    }
  } catch (error) {
    console.error('添加角色失败：', error);
    ElMessage.error('添加角色失败，请重试');
  }
}

</script>

<style scoped lang='less'></style>