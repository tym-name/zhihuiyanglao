<template>
    <el-card>
        <el-form ref="ruleFormRef" :model="forms" style="max-width: 600px" :rules="rules" label-width="auto">
            <el-form-item label="岗位名称" prop="name">
                <el-input v-model="forms.name" placeholder="请输入岗位名称" />
            </el-form-item>
            <el-form-item label="权限配置" prop="menuIds">
                <el-tree ref="treeRef" :data="treeData" node-key="id" :props="treeProps" show-checkbox highlight-current
                    @check="handleTreeCheck" />
            </el-form-item>
        </el-form>
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
            确定
        </el-button>
    </el-card>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, nextTick } from 'vue'
import { ElMessage, type FormInstance, type FormRules, type TreeInstance } from 'element-plus'
import { menuGetListForUser, roleAdd, roleListFun } from '../../api/position/position'
import type { getListForUserList, roleAddData, roleList } from '../../api/position/positionType'
import router from '../../router'
import { useRoute } from 'vue-router'

// 路由相关
const route = useRoute()
const id = route.params.id ? Number(route.params.id) : 0 // 获取路由参数，0 表示新增

// 表单相关
const ruleFormRef = ref<FormInstance>()
const treeRef = ref<TreeInstance>()

// 表单验证规则
const rules = reactive<FormRules>({
    name: {
        required: true,
        message: '请输入岗位名称',
        trigger: 'blur'
    },
    menuIds: {
        required: true,
        // 修正：恢复 rule 第一个参数，与 Element Plus 官方格式一致
        validator: (value: any, callback: any) => {
            if (!value || value.length === 0) {
                callback(new Error('请至少选择一个权限'))
            } else {
                callback()
            }
        },
        trigger: 'change'
    }
})

// 树形控件配置
const treeProps = {
    label: 'name',
    children: 'children'
}

// 树形控件数据
const treeData = ref<any[]>([])

// 权限配置相关
const menuList = ref<getListForUserList[]>([])

// 表单数据
const forms = reactive({
    id: 0,
    name: '',
    companyId: 0,
    addAccountId: 0,
    addAccountName: null as string | null,
    addTime: '',
    accountCounts: 0,
    menuIds: [] as number[],
})

// 获取权限列表和编辑数据
const getMenuList = async () => {
    try {
        const params = {
            id: 0,
            name: '',
            icon: null,
            url: null,
            pathName: null,
            pid: 0,
            sort: 0,
            type: 0,
            isButton: 0,
        }
        const res = await menuGetListForUser(params)
        console.log('权限配置', res)

        if (res.data && res.data.list) {
            menuList.value = res.data.list
            // 构建树形结构
            treeData.value = buildTree(res.data.list)

            // 等待DOM更新后展开所有节点
            await nextTick()

            // 如果是编辑模式，获取岗位详情并回显数据
            if (id > 0) {
                await getRoleDetail()
            }
        }
    } catch (error) {
        console.error('获取权限列表失败:', error)
        ElMessage.error('获取权限列表失败')
    }
}



// 构建树形结构
const buildTree = (list: getListForUserList[]): any[] => {
    const menuMap = new Map<number, any>()
    const result: any[] = []

    // 首先将所有节点存入map
    list.forEach(item => {
        menuMap.set(item.id, {
            id: item.id,
            name: item.name,
            icon: item.icon,
            url: item.url,
            pathName: item.pathName,
            pid: item.pid,
            sort: item.sort,
            type: item.type,
            isButton: item.isButton,
            children: []
        })
    })

    // 构建树形结构
    list.forEach(item => {
        const node = menuMap.get(item.id)
        if (node) {
            if (item.pid === 0) {
                // 根节点
                result.push(node)
            } else {
                // 子节点，找到父节点
                const parent = menuMap.get(item.pid)
                if (parent) {
                    parent.children.push(node)
                } else {
                    // 如果找不到父节点，也作为根节点
                    result.push(node)
                }
            }
        }
    })

    // 按sort排序
    const sortNodes = (nodes: any[]) => {
        nodes.sort((a, b) => (a.sort || 0) - (b.sort || 0))
        nodes.forEach(node => {
            if (node.children && node.children.length > 0) {
                sortNodes(node.children)
            }
        })
        return nodes
    }
    return sortNodes(result)
}

// 处理树节点选中
const handleTreeCheck = (checkedInfo: any) => {
    // 现在能正确获取选中状态信息
    const { checkedKeys, halfCheckedKeys } = checkedInfo
    // 合并选中的和半选的节点（保持你原有的业务逻辑）
    const allCheckedKeys = [...checkedKeys, ...halfCheckedKeys]

    // 更新表单数据
    forms.menuIds = allCheckedKeys

    // 触发验证
    ruleFormRef.value?.validateField('menuIds')
}

// 获取岗位详情（编辑模式） - 使用列表接口获取单个岗位
const getRoleDetail = async () => {
    try {
        const params = {
            id: id,
            name: '',
            companyId: 0,
            addAccountId: 0,
            addAccountName: null,
            addTime: '',
            accountCounts: 0,
            menuIds: null,
        }

        const res = await roleListFun(params as any)
        console.log('岗位列表响应:', res)

        if (res.data && res.data.list && res.data.list.length > 0) {
            const roleData = res.data.list.find(item => item.id === id) as roleList

            if (roleData) {
                // 填充表单基础数据（保持不变）
                forms.id = roleData.id
                forms.name = roleData.name
                forms.companyId = roleData.companyId
                forms.addAccountId = roleData.addAccountId
                forms.addAccountName = roleData.addAccountName
                forms.addTime = roleData.addTime
                forms.accountCounts = roleData.accountCounts

                // 处理 menuIds（保持不变）
                let menuIdsArray: number[] = []
                if (roleData.menuIds) {
                    if (Array.isArray(roleData.menuIds)) {
                        menuIdsArray = roleData.menuIds
                    } else if (typeof roleData.menuIds === 'string') {
                        try {
                            menuIdsArray = JSON.parse(roleData.menuIds)
                        } catch {
                            menuIdsArray = []
                        }
                    }
                }

                forms.menuIds = menuIdsArray
                console.log('菜单ID已设置:', forms.menuIds)

                // 优化：确保树形控件完全渲染后再设置选中状态
                if (menuIdsArray.length > 0 && treeData.value.length > 0) {
                    // 双重等待：先等 DOM 更新，再等组件内部初始化
                    await nextTick()

                    if (treeRef.value) {
                        console.log('设置树形控件选中状态:', menuIdsArray)
                        // 调用官方 API 设置选中（node-key 必须与 menuIds 中的 id 对应，此处已满足）
                        treeRef.value.setCheckedKeys(menuIdsArray)
                        // 验证是否设置成功（用于调试）
                        treeRef.value.getCheckedKeys()
                    }

                }
            }
        }
    } catch (error) {
        ElMessage.error('获取岗位详情失败')
    }
}

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid) => {
        if (valid) {
            try {
                // 准备提交的数据
                const submitData = {
                    ...forms,
                    addAccountName: forms.addAccountName as any,
                    menuIds: Array.isArray(forms.menuIds) ? forms.menuIds : []
                }

                console.log('提交的数据:', submitData)

                // 无论新增还是编辑，都使用同一个接口
                await roleAdd(submitData as roleAddData)

                if (id > 0) {
                    ElMessage.success('更新成功')
                } else {
                    ElMessage.success('添加成功')
                }
                router.back()
            } catch (error) {

                ElMessage.error('提交失败')
            }
        }
    })
}

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()

    // 重置树形控件选中状态
    if (treeRef.value) {
        treeRef.value.setCheckedKeys([])
    }

    // 清空表单数据
    forms.id = 0
    forms.name = ''
    forms.companyId = 0
    forms.addAccountId = 0
    forms.addAccountName = null
    forms.addTime = ''
    forms.accountCounts = 0
    forms.menuIds = []
    router.back()
}

// 初始化时获取权限数据
onMounted(() => {
    getMenuList()
})
</script>

<style scoped>
.el-card {
    margin: 20px;
}

.el-form {
    margin-bottom: 20px;
}

.el-button {
    margin-right: 10px;
}
</style>