<template>
    <div>
        <el-dialog v-model="props.isShow" title="价格更新" width="500" :before-close="handleClose">

            <el-form ref="ruleFormRef" style="max-width: 600px" :model="priceUpdateForm" :rules="rules"
                label-width="auto">
                <el-form-item label="更新时间: ">
                    <span>{{ currentDate }}</span>
                </el-form-item>
                <el-form-item label="批发价" prop="wholePrice">
                    <el-input v-model="priceUpdateForm.wholePrice" />
                </el-form-item>
                <el-form-item label="零售价" prop="sellPrice">
                    <el-input v-model="priceUpdateForm.sellPrice" />
                </el-form-item>
                <el-form-item label="采购价" prop="purchasePrice">
                    <el-input v-model="priceUpdateForm.purchasePrice" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="props.close">取消</el-button>
                    <el-button type="primary" @click="update">
                        提交
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, watch } from 'vue';
import { ElForm, ElMessage, ElMessageBox, type FormRules } from 'element-plus'
import type { FoodPriceListItem, FoodPriceType } from '../../../api/diet/food/foodType';
import { updateFoodPrice } from '../../../api/diet/food/food';

const props = defineProps<{
    isShow: boolean;
    close: () => void;
    id?: number;
    foodPrice?: FoodPriceListItem;
}>()

// 2. 声明自定义事件：通知父组件刷新列表
const emit = defineEmits<{
    (e: 'refreshList'): void; // 刷新列表事件
}>()

const handleClose = (done: () => void) => {
    ElMessageBox.confirm('您确定要关闭此对话框吗')
        .then(() => {
            done()
        })
        .catch(() => {
            // catch error
        })
}

//获取当前年月日
const currentDate = ref(new Date().toLocaleDateString('zh-CN').replace(/\//g, '-'))

const ruleFormRef = ref<InstanceType<typeof ElForm>>()

const priceUpdateForm = ref<FoodPriceType>({
    id: 0,
    foodId: 0,
    wholePrice: null,
    sellPrice: null,
    purchasePrice: null
})

watch(() => props.id, (newId) => {
    if (newId) {
        priceUpdateForm.value.id = newId
        priceUpdateForm.value.foodId = newId
    }
}, { immediate: true })

watch(() => props.foodPrice, (newFoodPrice) => {
    if (newFoodPrice) {
        // 注意：这里需要考虑是否要深拷贝，避免影响原数据
        priceUpdateForm.value = { ...newFoodPrice }
        if (newFoodPrice.updateTime) {
            currentDate.value = newFoodPrice.updateTime
        }
    }
}, { immediate: true }) // immediate: true 确保首次渲染时也会执行

const rules = reactive<FormRules<FoodPriceType>>({
    wholePrice: [
        { required: true, message: '请输入批发价', trigger: 'blur' },
    ],
    sellPrice: [
        { required: true, message: '请输入零售价', trigger: 'blur' },
    ],
    purchasePrice: [
        { required: true, message: '请输入采购价', trigger: 'blur' },
    ]
})






const update = async () => {
    // 第一步：先校验表单
    if (!ruleFormRef.value) return
    try {
        const valid = await ruleFormRef.value.validate()
        if (!valid) return
    } catch (error) {
        ElMessage.error('表单校验失败，请检查填写内容')
        return
    }

    // 第二步：提交新增请求
    try {
        let res = await updateFoodPrice(priceUpdateForm.value)
        console.log('价格更新', res);
        if (res.code === 10000) {
            ElMessage.success('更新成功')
            // 3. 触发自定义事件，通知父组件刷新列表
            emit('refreshList')
            // 关闭弹窗
            props.close()
            // 重置表单
            priceUpdateForm.value.wholePrice = null
            priceUpdateForm.value.sellPrice = null
            priceUpdateForm.value.purchasePrice = null
            ruleFormRef.value?.resetFields()
            emit('refreshList')
        } else {
            ElMessage.error('更新失败：' + (res.msg || '服务器异常'))
        }
    } catch (error) {
        ElMessage.error('更新失败：网络异常')
        console.error('更新食材价格报错：', error)
    }
}



</script>

<style scoped lang='less'></style>