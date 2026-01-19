<template>
    <el-card>
        <el-button type="success" @click="handleAdd">添加部门</el-button>
        <el-tree show-checkbox :data="treeData" :props="defaultProps" @node-click="handleNodeClick"
            style="max-width: 400px;" class="department-tree">
            <template #default="{ node, data }">
                <div class="custom-tree-node">
                    <span class="node-label">{{ node.label }}</span>
                    <div class="node-actions">
                        <!-- 添加子部门 -->
                        <el-button type="success" circle :icon="Plus" @click.stop="handleAddChild(data.original)" />
                        <!-- 编辑当前部门 -->
                        <el-button type="primary" :icon="Edit" circle @click.stop="handleEdit(data.original)" />
                        <!-- 删除部门 -->
                        <el-button type="danger" :icon="Delete" circle @click.stop="handleDelete(data.original)" />
                    </div>
                </div>
            </template>
        </el-tree>
    </el-card>
    <!-- 新增编辑弹窗 -->
    <el-dialog v-model="dialogFormVisible" :title="dialogTitle">
        <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="auto">
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleSubmit">
                提交
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup lang='ts'>
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { reactive, ref, computed } from 'vue'
import { departmentAdd, departmentUpdate, departmentDelete, departmentListFun } from '../../api/personel/personel'
import type { departmentList } from '../../api/personel/personelType'
import { ElMessage, type FormInstance, type FormRules, ElMessageBox } from 'element-plus'

interface Tree {
    label: string
    children?: Tree[]
    original?: departmentList
}

const handleNodeClick = (data: Tree) => {
    console.log(data)
}

const treeData = ref<Tree[]>([])
const defaultProps = {
    children: 'children',
    label: 'label',
}

// 表单数据
const form = reactive<departmentList>({
    id: 0,
    companyId: 0,
    name: '',
    pid: 0,
})

// 弹窗控制
const dialogFormVisible = ref(false)
const isEditMode = ref(false) // 标记是编辑模式还是新增模式
const currentParentDept = ref<departmentList | null>(null) // 当前操作的父部门（用于添加子部门）

// 弹窗标题（根据模式动态变化）
const dialogTitle = computed(() => {
    return isEditMode.value ? '编辑部门' : '添加部门'
})

// 构建部门树
const buildDepartmentTree = (departments: departmentList[]): Tree[] => {
    const map = new Map<number, Tree & { original: departmentList }>()
    const tree: Tree[] = []

    departments.forEach(dept => {
        map.set(dept.id, {
            label: dept.name,
            children: [],
            original: dept
        })
    })

    departments.forEach(dept => {
        const node = map.get(dept.id)
        if (node && dept.pid) {
            const parent = map.get(dept.pid)
            if (parent) {
                if (!parent.children) {
                    parent.children = []
                }
                parent.children.push(node)
            } else {
                tree.push(node)
            }
        } else {
            tree.push(node!)
        }
    })

    return tree
}

// 获取部门列表
const getdepartmentListFun = async () => {
    try {
        const res = await departmentListFun({} as departmentList)
        treeData.value = buildDepartmentTree(res.data.list)
    } catch (error) {
        console.error('获取部门列表失败:', error)
        ElMessage.error('获取部门列表失败')
    }
}

// 初始化获取部门列表
getdepartmentListFun()

// 表单验证
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules<departmentList>>({
    name: { required: true, message: '请输入部门名称', trigger: 'blur' },
})

// 打开添加部门弹窗（顶级部门）
const handleAdd = () => {
    resetForm()
    isEditMode.value = false
    currentParentDept.value = null
    dialogFormVisible.value = true
}

// 打开添加子部门弹窗
const handleAddChild = (parentDept: departmentList) => {
    resetForm()
    isEditMode.value = false
    currentParentDept.value = parentDept
    // 设置父部门ID
    form.pid = parentDept.id
    dialogFormVisible.value = true
}

// 打开编辑部门弹窗
const handleEdit = (dept: departmentList) => {
    resetForm()
    isEditMode.value = true
    currentParentDept.value = null

    // 填充表单数据
    Object.assign(form, {
        id: dept.id,
        companyId: dept.companyId,
        name: dept.name,
        pid: dept.pid,
    })

    dialogFormVisible.value = true
}

// 删除部门
const handleDelete = async (dept: departmentList) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除部门 "${dept.name}" 吗？删除后无法恢复！`,
            '警告',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )

        await departmentDelete(dept.id)
        await getdepartmentListFun()
        ElMessage.success('部门删除成功')
    } catch (error) {
        if (error !== 'cancel') {
            console.error('删除部门失败:', error)
            ElMessage.error('删除部门失败')
        }
    }
}

// 提交表单
const handleSubmit = async () => {
    if (!ruleFormRef.value) return
    const isValid = await ruleFormRef.value.validate()
    if (!isValid) return

    if (isEditMode.value) {
        // 编辑模式
        await departmentUpdate(form)
        ElMessage.success('部门更新成功')
    } else {
        // 新增模式
        await departmentAdd(form)
        ElMessage.success('部门添加成功')
    }

    dialogFormVisible.value = false
    await getdepartmentListFun()
    resetForm()
}

// 取消操作
const handleCancel = () => {
    dialogFormVisible.value = false
    resetForm()
}

// 重置表单
const resetForm = () => {
    Object.assign(form, {
        id: 0,
        companyId: 0,
        name: '',
        pid: currentParentDept.value?.pid || 0,
    })

    if (ruleFormRef.value) {
        ruleFormRef.value.clearValidate()
    }
}
</script>

<style scoped>
/* 保持原有的样式不变 */
.el-button {
    margin-bottom: 20px;
}

:deep(.el-tree-node__content) {
    height: 42px;
    align-items: center;
}

.custom-tree-node {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: 0 8px;
}

.node-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    line-height: 1.5;
}

.node-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
    flex-shrink: 0;
}

.node-actions .el-button {
    margin: 0;
    width: 28px;
    height: 28px;
    padding: 0;
}

.node-actions .el-button .el-icon {
    font-size: 14px;
}
</style>