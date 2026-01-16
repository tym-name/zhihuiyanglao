<template>
    <el-dialog v-model="props.isShow" :title="addForm.id == 0 ? addtitle : updatetitle" width="500"
        :before-close="handleClose">
        <!-- 表单开始 -->
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="addForm" :rules="rules" label-width="auto">
            <el-form-item label="物料名称" prop="name">
                <el-input v-model="addForm.name" />
            </el-form-item>
            <el-form-item label="单位" prop="unit">
                <el-select v-model="addForm.unit" placeholder="请选择">
                    <el-option v-for="item in unitOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="供应商" prop="supplierId">
                <el-select v-model="addForm.supplierId" placeholder="请选择">
                    <el-option v-for="item in supplierOptions" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
        </el-form>
        <!-- 表单结束 -->
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="addFood">
                    提交
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref, reactive, watch } from 'vue';
import { ElMessage, ElMessageBox, ElForm } from 'element-plus'
import type { FormRules } from 'element-plus'
import { addFoods, supplierList, updateFood } from '../../../api/diet/food/food';
import type { FoodItem, FoodsAddType, SupplierItem, supplierListType } from '../../../api/diet/food/foodType';

const addtitle = ref('新增食材')
const updatetitle = ref('修改食材')

// 1. 声明props（优化：添加类型约束，更规范）
const props = defineProps<{
    isShow: boolean;
    close: () => void; // 明确close是一个函数
    food: FoodItem
}>()

// 2. 声明自定义事件：通知父组件刷新列表
const emit = defineEmits<{
    (e: 'refreshList'): void; // 刷新列表事件
}>()

// 表单ref（之前代码遗漏了定义）
const ruleFormRef = ref<InstanceType<typeof ElForm>>()

const handleClose = (done: () => void) => {
    ElMessageBox.confirm('您确定要关闭此对话框吗')
        .then(() => {
            resetForm()
            done()
        })
        .catch(() => {
            // catch error
        })
}

const addForm = ref<FoodsAddType>({
    id: null,
    name: '',
    unit: '',
    supplierId: null,
})

const resetForm = () => {
    if (ruleFormRef.value) {
        ruleFormRef.value.clearValidate()
        ruleFormRef.value.resetFields()
    }
    addForm.value = {
        id: 0,
        name: '',
        unit: '',
        supplierId: null
    }
}

watch(() => props.food, (newFood) => {
    if (newFood && newFood.id) { // 确保有数据才填充
        Object.assign(addForm.value, {
            id: newFood.id || 0,
            name: newFood.name || '',
            unit: newFood.unit || '',
            supplierId: newFood.supplierId || null
        })
    } else {
        // 如果没有food数据，重置为新增状态
        addForm.value = {
            id: 0,
            name: '',
            unit: '',
            supplierId: null
        }
    }
}, { immediate: true })




const rules = reactive<FormRules<FoodsAddType>>({
    name: [
        { required: true, message: '请输入物料名称', trigger: 'blur' },
    ],
    unit: [
        {
            required: true,
            message: '请选择单位',
            trigger: 'change',
        },
    ],
    supplierId: [
        {
            required: true,
            message: '请选择供应商',
            trigger: 'change',
        },
    ],
})

//供应商
const supplierData = ref<supplierListType>({
    page: 1,
    pageSize: 10,
})
//供应商列表
const supplierOptions = ref<SupplierItem[]>([])
const getSupplierList = async () => {
    let res = await supplierList(supplierData.value)
    console.log('供应商列表', res);
    supplierOptions.value = res.data.list
}
getSupplierList()

//单位
const unitOptions = [
    {
        value: '斤',
        label: '斤',
    },
    {
        value: '吨',
        label: '吨',
    },
    {
        value: '个',
        label: '个',
    },
    {
        value: '克',
        label: '克',
    }
]

//添加（核心修改：增加表单校验 + 提交成功后触发刷新事件）
const addFood = async () => {

    // 第一步：先校验表单
    if (!ruleFormRef.value) return
    try {
        const valid = await ruleFormRef.value.validate()
        if (!valid) return
    } catch (error) {
        ElMessage.error('表单校验失败，请检查填写内容')
        return
    }

    if (addForm.value.id) {
        try {
            let res = await updateFood(addForm.value)
            console.log('修改', res);
            if (res.code === 10000) {
                ElMessage.success('修改成功')
                // 3. 触发自定义事件，通知父组件刷新列表
                emit('refreshList')
                // 关闭弹窗
                props.close()
                // 重置表单
                addForm.value = ({
                    id: 0,
                    name: '',
                    unit: '',
                    supplierId: null
                })
                ruleFormRef.value?.resetFields()
            } else {
                ElMessage.error('修改失败：' + (res.msg || '服务器异常'))
            }
        } catch (error) {
            ElMessage.error('修改失败：网络异常')
            console.error('修改食材报错：', error)
        }

    } else {
        // 第二步：提交新增请求
        try {
            let res = await addFoods(addForm.value)
            console.log('添加', res);
            if (res.code === 10000) {
                ElMessage.success('添加成功')
                // 3. 触发自定义事件，通知父组件刷新列表
                emit('refreshList')
                // 关闭弹窗
                props.close()
                // 重置表单
                addForm.value = ({
                    id: 0,
                    name: '',
                    unit: '',
                    supplierId: null
                })
                ruleFormRef.value?.resetFields()
            } else {
                ElMessage.error('添加失败：' + (res.msg || '服务器异常'))
            }
        } catch (error) {
            ElMessage.error('添加失败：网络异常')
            console.error('新增食材报错：', error)
        }
    }

}

</script>

<style scoped lang='less'></style>