<template>
    <el-card style="margin-bottom: 10px;">
        <el-form :model="form" label-width="auto" inline>
            <el-form-item label="员工姓名:">
                <el-input v-model="form.name" clearable placeholder="请输入员工姓名" style="width: 180px" />
            </el-form-item>
            <el-form-item label="联系方式:">
                <el-input v-model="form.mobile" clearable placeholder="请输入联系方式" style="width: 180px" />
            </el-form-item>
            <el-form-item label="身份证号:">
                <el-input v-model="form.idCard" clearable placeholder="请输入身份证号" style="width: 180px" />
            </el-form-item>
            <el-form-item label="所属部门">
                <el-select v-model="form.departmentName" placeholder="请选择部门" clearable style="width: 180px">
                    <el-option v-for="item in typeItem" :key="item" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="所属岗位">
                <el-select v-model="form.roles" placeholder="请选择岗位" clearable style="width: 180px">
                    <el-option v-for="item in roleItem" :key="item" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="form.enable" placeholder="请选择状态" clearable style="width: 180px">
                    <el-option v-for="item in stateItem" :key="item" :label="item.value" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">查询</el-button>
                <el-button>重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>

    <Table ref="tableRef" :columns="columns" :fetch-data="staffListFun" @selection-change="handleSelectionChange">
        <template #buttons>
            <el-button type="success" @click="addStaff">添加员工</el-button>
            <el-button type="danger" @click="delAll" :disabled="selectedIds.length === 0">批量删除</el-button>
        </template>

        <template #photo="{ row }">
            <img :src="VITE_IMG_URL + row.photo" style="width: 50px;height: 50px;">
        </template>
        <template #operate="{ row }">
            <el-button link type="primary" @click="openResetPasswordDialog(row)">重置密码</el-button>
            <el-button link type="primary" @click="bianji(row.id)">编辑</el-button>
            <el-button link type="primary" @click="jinyong">禁用</el-button>
            <el-button link type="primary" @click="toggleEnable">取消禁用</el-button>
            <el-button link type="danger" @click="staffdel(row.id)">删除</el-button>
        </template>
        <template #enable="{ row }">
            {{ row.enable === 1 ? '否' : '是' }}
        </template>
        <template #name="{ row }">
            <div v-for="role in row.roles" :key="role.id">
                {{ role.name }}
            </div>
        </template>
    </Table>
    <!-- 重置密码 -->
    <el-dialog v-model="dialogFormVisible" title="重置密码">
        <el-form :model="ruleForm" ref="ruleFormRef" label-width="auto">
            <el-form-item label="用户">
                {{ selectedStaff?.name }}
            </el-form-item>
            <el-form-item label="输入新密码" prop="newPwd"
                :rules="[{ required: true, validator: validateNewPassword, trigger: 'blur' }]">
                <el-input v-model="ruleForm.newPwd" type="password" />
            </el-form-item>
            <el-form-item label="再次输入新密码" prop="confirmPwd"
                :rules="[{ required: true, validator: validateConfirmPassword, trigger: 'blur' }]">
                <el-input v-model="ruleForm.confirmPwd" type="password" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="resetForm(ruleFormRef)">取消</el-button>
            <el-button type="primary" @click="submitForm(ruleFormRef)">
                确定
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup lang='ts'>
import Table from '../../components/table.vue'
import { type TableColumn } from '../../components/table.vue';
import { staffListFun, staffGet } from '../../api/staff/staff';
import type { staffList } from '../../api/staff/staffType';
import { reactive, ref } from 'vue';
import { accountResetPwd, departmentDelete, departmentDeleteAll, departmentListFun } from '../../api/personel/personel';
import type { departmentList } from '../../api/personel/personelType';
import { roleListFun } from '../../api/position/position';
import type { roleList } from '../../api/position/positionType';
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus';
import router from '../../router';
import type { resetPwdType } from '../../api/account/accountType'; // 导入类型
const VITE_IMG_URL = 'http://123.57.237.81:8080/caresystem/'

// 表单
const form = reactive<staffList>({
    id: 0,
    companyId: 0,
    photo: '',
    name: '',
    mobile: '',
    isCarer: 0,
    departmentId: 0,
    addAccountId: 0,
    addAccountName: '',
    addTime: '',
    departmentName: '',
    roles: [
        {
            id: 0,
            name: '',
            companyId: 0,
            addAccountId: 0,
            addAccountName: null,
            addTime: '',
            accountCounts: 0,
            menuIds: null,
        }
    ],
    adminId: 0,
    adminUserName: '',
    adminPwd: '',
    enable: '',
    idCard: '',
})
// 表格
const columns: TableColumn[] = [
    {
        type: "selection",
        width: "50",
    },
    {
        label: "序号",
        prop: "id",
        width: "100px",
    },
    {
        label: "头像",
        slot: "photo",
    },
    {
        label: "姓名",
        prop: "name",
    },
    {
        label: "联系方式",
        prop: "mobile",
    },
    {
        label: "身份证号",
        prop: "idCard",
    },
    {
        label: "所属部门",
        prop: "departmentName",
    },
    {
        label: "所属岗位",
        slot: "name",
    },
    {
        label: "账号",
        prop: "adminUserName",
    },
    {
        label: "创建人",
        prop: "addAccountName",
    },
    {
        label: "是否禁用",
        slot: "enable",
    },
    {
        label: "操作",
        slot: "operate",
        width: 300,
        fixed: "right",
    }
]
// 所属部门
const forms = reactive<departmentList>({
    id: 0,
    companyId: 0,
    name: '',
    pid: 0,
})
const typeItem = ref<departmentList[]>([])
const getdepartmentListFun = async () => {
    const res = await departmentListFun(forms)
    console.log('所属部门', res);
    typeItem.value = res.data.list
}
getdepartmentListFun()

// 所属岗位
const roleItem = ref<roleList[]>([])
const formss = reactive<roleList>({
    id: 0,
    name: '',
    companyId: 0,
    addAccountId: 0,
    addAccountName: '',
    addTime: '',
    accountCounts: 0,
    menuIds: [],
})
const getstaffListFun = async () => {
    const res = await roleListFun(formss)
    console.log('所属岗位', res);
    roleItem.value = res.data.list
}
getstaffListFun()
// 状态
const stateItem = [
    { value: '未解决', }, { value: '已解决', }
]
// 单删
const tableRef = ref<any>(null)
const staffdel = async (id: number) => {
    ElMessageBox.confirm(
        '是否删除该条记录？',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
        }
    )
        .then(async () => {
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            await departmentDelete(id)
            tableRef.value?.refresh();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消删除',
            })
        })
}
// 批量删除
const selectedIds = ref<number[]>([])
//表格选择变化事件
const handleSelectionChange = (selection: departmentList[]) => {
    selectedIds.value = selection.map(item => item.id)
}
const delAll = async () => {
    if (selectedIds.value.length === 0) return

    await ElMessageBox.confirm(
        `确定删除这${selectedIds.value.length}项数据吗? 删除后无法恢复`,
        '警告',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
    // 传递选中的ID数组给后端
    await departmentDeleteAll(selectedIds.value)
    // 清空选中的ID
    selectedIds.value = []
    // 刷新表格数据
    tableRef.value?.refresh();

    ElMessage.success('删除成功')
}
// 取消禁用
const toggleEnable = async () => {
    // await accountUpdateEnable()
    ElMessage.success(`取消成功`)
    tableRef.value?.refresh()
}
// 禁用
const jinyong = async () => {
    // await accountUpdateEnable()
    ElMessage.success(`禁用成功`)
    tableRef.value?.refresh()
}
// 新增
const addStaff = () => {
    router.push("/staff-add")
}
// 编辑
const bianji = (id: number) => {
    router.push(`/staff-edit/${id}`)
}
// 重置密码相关
const dialogFormVisible = ref(false)
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
    newPwd: '',
    confirmPwd: '',
})
const selectedStaff = ref<staffList | null>(null)

// 密码验证规则
const validateNewPassword = (rule: any, value: string, callback: Function) => {
    if (!value) {
        callback(new Error('请输入新密码'))
    } else if (value.length < 6) {
        callback(new Error('密码长度不能少于6位'))
    } else if (value.length > 20) {
        callback(new Error('密码长度不能超过20位'))
    } else if (!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@$!%*?&.,<>{}[\]|;':\"`~()]+$/.test(value)) {
        callback(new Error('密码必须包含字母和数字'))
    } else {
        callback()
    }
}

const validateConfirmPassword = (rule: any, value: string, callback: Function) => {
    if (!value) {
        callback(new Error('请再次输入新密码'))
    } else if (value !== ruleForm.newPwd) {
        callback(new Error('两次输入的密码不一致'))
    } else {
        callback()
    }
}

// 打开重置密码对话框
const openResetPasswordDialog = async (row: staffList) => {
    selectedStaff.value = row
    ruleForm.newPwd = ''
    ruleForm.confirmPwd = ''
    dialogFormVisible.value = true
}

// 提交重置密码
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid) => {
        if (valid && selectedStaff.value) {
            try {
                // 调用重置密码API
                await accountResetPwd({
                    id: selectedStaff.value.id,
                    pwd: ruleForm.newPwd,
                } as resetPwdType)

                ElMessage.success('密码重置成功')
                dialogFormVisible.value = false
                formEl.resetFields()
                tableRef.value?.refresh()
            } catch (error) {
                ElMessage.error('密码重置失败，请重试')
            }
        }
    })
}
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    dialogFormVisible.value = false
}
</script>