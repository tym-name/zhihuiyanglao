<template>
    <div>
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto" style="max-width: 600px">
            <el-form-item label="角色名称" prop="name">
                <el-input v-model="ruleForm.name" placeholder="请输入角色名称" />
            </el-form-item>

            <el-form-item label="角色名称" prop="name">
                <!-- :data="data" -->
                <el-tree :data="treeData" show-checkbox node-key="id" :props="{ label: 'name', children: 'children' }"
                    :default-expand-all="false" />
            </el-form-item>


        </el-form>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
import type { FormRules } from 'element-plus'
import { MenuList } from '../api/exam/exam';
import type { PermissionItem, TreePermissionNode } from '../api/exam/examType';

interface RuleForm {
    name: string
    menuIds: number[]
}

const ruleForm = reactive<RuleForm>({
    name: '',
    menuIds: []
})


const rules = reactive<FormRules<RuleForm>>({
    name: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },
    ],
    menuIds: [
        {
            required: true,
            message: 'Please select Activity zone',
            trigger: 'change',
        },
    ],
})



const treeData = ref<TreePermissionNode[]>([]);
const getMenuList = async () => {
    let res = await MenuList()
    console.log(res);
    const flatList = res.data.list;
    // 转换为树形数据
    treeData.value = convertFlatToTree(flatList);
}
getMenuList()




/**
 * 扁平权限列表转换为树形选择器数据
 * @param flatList 接口返回的扁平权限列表
 * @returns 树形结构数据（适配 ElTree）
 */
const convertFlatToTree = (flatList: PermissionItem[]): TreePermissionNode[] => {
    // 1. 构建 ID -> 节点的映射表（方便快速查找父节点）
    const nodeMap = new Map<number, TreePermissionNode>();
    flatList.forEach(item => {
        // 深拷贝，避免修改原数据
        nodeMap.set(item.id, { ...item });
    });

    // 2. 遍历所有节点，挂载到父节点的 children 中
    const rootNodes: TreePermissionNode[] = []; // 根节点列表（pid=0）
    flatList.forEach(item => {
        const currentNode = nodeMap.get(item.id)!;
        if (item.pid === 0) {
            // pid=0 是根节点，直接加入根列表
            rootNodes.push(currentNode);
        } else {
            // 找到父节点，挂载子节点
            const parentNode = nodeMap.get(item.pid);
            if (parentNode) {
                if (!parentNode.children) {
                    parentNode.children = [];
                }
                parentNode.children.push(currentNode);
            }
        }
    });

    // 3. 递归排序：按 sort 字段升序排列（保证节点顺序）
    const sortNodeChildren = (nodes: TreePermissionNode[]) => {
        // 先排序当前层级
        nodes.sort((a, b) => a.sort - b.sort);
        // 递归排序子节点
        nodes.forEach(node => {
            if (node.children && node.children.length > 0) {
                sortNodeChildren(node.children);
            }
        });
    };
    sortNodeChildren(rootNodes);

    return rootNodes;
};
</script>

<style scoped lang='less'></style>