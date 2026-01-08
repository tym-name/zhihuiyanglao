<template>
  <div> 
    <el-card>
      <el-form
        ref="ruleFormRef"
        style="max-width: 600px"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
      >
        <!-- 角色名称输入项 -->
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入角色名称" />
        </el-form-item>

        <!-- 权限配置树形选择项 -->
        <el-form-item label="权限配置" prop="menuIds">
          <el-tree
            ref="treeRef"
            :data="treeMenuList"  
            show-checkbox       
            node-key="id"      
            default-expand-all  
            :props="treeProps"   
            :checked-keys="ruleForm.menuIds"  
            @check="handleCheckChange"        
          />
        </el-form-item>
      </el-form>
            <el-button @click="router.push('/role')">关闭</el-button>
            <el-button type="primary" @click="getRoleAdd">确定</el-button>
    </el-card>
  </div>
</template>

<script setup lang='ts'>
import { reactive, ref, onMounted } from 'vue';
import type { FormRules } from 'element-plus';
import type { MenuItem, MenuPermission } from '../../api/role/roleType';
import { menuList, roleAdd } from '../../api/role/role';
import { ElMessage } from 'element-plus';
import router from '../../router';


// 表单数据模型
const ruleForm = reactive<MenuPermission>({
  name: '',
  id: 0,
  menuIds: []  // 存储选中的权限ID数组
});

const getRoleAdd=async()=>{
  let res=await roleAdd(ruleForm)
  console.log('添加角色',res);
  if(res.code==10000){
    ElMessage.success('添加成功')
    router.push('/role')
  }else{
    ElMessage.error('添加失败')
  }
}

// 原始扁平菜单列表
const rawMenuList = ref<MenuItem[]>([]);
// 处理后的树形菜单列表
const treeMenuList = ref<MenuItem[]>([]);

// 树形控件属性配置
const treeProps = {
  label: 'name',    // 节点显示的文本字段
  children: 'children' // 子节点字段名
};

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

/**
 * 获取菜单列表并处理为树形结构
 */
const getMenuList = async () => {
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

/**
 * 树形控件选中状态变化事件
 * @param _node 选中的节点（未使用）
 * @param checkedInfo 选中状态信息
 */
const handleCheckChange = (_node: any, checkedInfo: { checkedKeys: number[] }) => {
  // 更新表单中的选中权限ID
  ruleForm.menuIds = checkedInfo.checkedKeys;
  console.log('选中的权限ID：', ruleForm.menuIds);
};

// 表单校验规则
const rules = reactive<FormRules<MenuPermission>>({
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
  ],
  menuIds: [
    { 
      required: true, 
      message: '请至少选择一项权限', 
      trigger: 'change',
      validator: (_rule, value) => {
        return value.length > 0;
      }
    }
  ]
});

// 页面挂载时加载菜单列表
onMounted(() => {
  getMenuList();
});


</script>

<style scoped lang='less'>
// 输入框样式
/deep/.el-input {
  width: 300px;
}

// 树形控件样式优化
/deep/.el-tree {
  --el-tree-node-content-height: 36px;
  padding: 8px 0;
  
  // 选中节点高亮
  .el-tree-node.is-current > .el-tree-node__content {
    background-color: #e8f4ff;
    color: #1989fa;
  }
  
  // 复选框间距调整
  .el-tree-node__checkbox {
    margin-right: 8px;
  }
}

// 卡片内边距
.el-card {
  padding: 20px;
}
</style>