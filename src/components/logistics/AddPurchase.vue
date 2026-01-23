<template>
    <div>
        <el-card>
            <div class="choseFood_box">
                <el-button type="primary" @click="openOrClose">选择食材</el-button>
                <div class="num">{{ num }}</div>
            </div>
            <!-- :data="tableData"  -->
            <el-table style="width: 100%" :data="foodData" v-if="foodData.length > 0">
                <el-table-column prop="id" label="序号" />
                <el-table-column prop="name" label="材料名称" />
                <el-table-column prop="unit" label="单位" />
                <el-table-column prop="supplierName" label="供应商" />
                <el-table-column prop="wholePrice" label="批发价" />
                <el-table-column prop="sellPrice" label="零售价" />
                <el-table-column prop="purchasePrice" label="采购价" />
                <el-table-column label="采购数量">
                    <template #default="{ row, $index }">
                        <el-input-number :min="0" :max="100"
                            @change="(value: number | undefined) => handleChange(value, row, $index)"
                            v-model="row.purchaseCounts" />
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="{ $index }">
                        <el-button link type="primary" size="small" @click="deleteSelectedFood($index)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>
            <div class="jisuan">
                合计采购品种数{{ num }},采购总成本:{{ price }}元
            </div>
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto" style="margin-top: 20px;">
                <el-form-item prop="remarks" label="请输入备注">
                    <el-input v-model="ruleForm.remarks" type="textarea" clearable style="width: 200px;" />
                </el-form-item>
                <el-form-item prop="receiveTime" label="期望到货日期:">
                    <el-date-picker v-model="ruleForm.receiveTime" type="date" placeholder="请选择" clearable
                        format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
                </el-form-item>
            </el-form>
            <div class="bts">
                <el-button @click="handleBack">返回</el-button>
                <el-button type="primary" @click="savePurchase">保存</el-button>
                <el-button type="primary" @click="savePurchaseAndBack">保存并提交</el-button>
            </div>
        </el-card>
        <ChoseFoods :isShow="isShow" :openOrClose="openOrClose" @confirm="handleSelectedElderly"></ChoseFoods>
    </div>
</template>

<script setup lang='ts'>
import { ref, computed, reactive } from 'vue';
import ChoseFoods from './ChoseFoods.vue';
import type { FoodItem } from '@/api/diet/food/foodType';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { addPurchase } from '@/api/logistics/purchase/purchase';
import type { addPurchaseParams } from '@/api/logistics/purchase/purchaseType';
import router from '@/router';


const handleChange = (value: number | undefined, row: FoodItem & { purchaseCounts: number }, $index: number) => {
    console.log('数量变化:', value, '当前行:', row, '索引:', $index);
    // 使用索引直接更新foodData中的purchaseCounts值，确保price计算属性能够正确响应变化
    foodData.value[$index].purchaseCounts = value || 0;
    console.log('更新后的数据:', foodData.value[$index]);
}


//操作弹框
const isShow = ref(false)
const openOrClose = () => {
    isShow.value = !isShow.value
}

//子组件传过来的值
const foodData = ref<(FoodItem & { purchaseCounts: number })[]>([]);
const handleSelectedElderly = (selectedData: FoodItem[]) => {
    foodData.value = selectedData.map(item => ({
        ...item,
        purchaseCounts: 0
    }));
};
//删除选中食物
const deleteSelectedFood = (index: number) => {
    if (index >= 0 && index < foodData.value.length) {
        foodData.value.splice(index, 1);
    }
}

// 计算采购品种数
const num = computed(() => {
    return foodData.value.length;
});

// 计算采购总成本
const price = computed(() => {
    return foodData.value.reduce((total, item) => {
        return total + (item.purchasePrice || 0) * (item.purchaseCounts || 0);
    }, 0);
});


const ruleFormRef = ref<FormInstance>()
const ruleForm = ref<addPurchaseParams>({
    foods: [],
    receiveTime: '',
    remarks: '',
})


const rules = reactive<FormRules<addPurchaseParams>>({
    receiveTime: [
        { required: true, message: '请选择期望到货日期', trigger: 'change' },
    ],
    foods: [
        { required: true, message: '请至少选择一种食材', trigger: 'change' },
    ],
})

// 保存采购申请 - 只保存到本地，不调用接口，不清空表单
const savePurchase = () => {
    // 将表单数据保存到sessionStorage，以便再次返回时恢复
    const formData = {
        ruleForm: ruleForm.value,
        foodData: foodData.value
    };
    sessionStorage.setItem('addPurchaseFormData', JSON.stringify(formData));
    ElMessage.success('表单已保存');
}

// 返回按钮处理 - 返回父组件页面
const handleBack = () => {
    // 不需要保存数据，直接返回
    router.push('/logistics/Purchase')
}

// 保存并提交 - 调用接口，清空表单，返回父组件
const savePurchaseAndBack = async () => {
    if (!ruleFormRef.value) return;
    
    // 触发表单验证
    await ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            // 准备数据
            const submitData: addPurchaseParams = {
                ...ruleForm.value,
                foods: foodData.value.map(item => ({
                    foodName: item.name,
                    unit: item.unit,
                    supplierId: item.supplierId,
                    wholePrice: item.wholePrice || 0,
                    sellPrice: item.sellPrice || 0,
                    purchasePrice: item.purchasePrice || 0,
                    purchaseCounts: item.purchaseCounts
                }))
            };
            
            try {
                // 调用API添加采购申请
                let res = await addPurchase(submitData);
                if (res.code === 10000) {
                    ElMessage.success('保存并提交成功');
                    // 清空表单
                    ruleForm.value = {
                        foods: [],
                        receiveTime: '',
                        remarks: ''
                    };
                    // 清空选择食物列表
                    foodData.value = [];
                    // 清空sessionStorage中的数据
                    sessionStorage.removeItem('addPurchaseFormData');
                    // 返回父组件页面
                    router.push('/logistics/Purchase');
                }
            } catch (error) {
                ElMessage.error('保存并提交失败');
            }
        }
    });
}

// 从sessionStorage恢复表单数据
const restoreFormData = () => {
    const savedData = sessionStorage.getItem('addPurchaseFormData');
    if (savedData) {
        const { ruleForm: savedRuleForm, foodData: savedFoodData } = JSON.parse(savedData);
        ruleForm.value = savedRuleForm;
        foodData.value = savedFoodData;
    }
};

// 组件挂载时恢复表单数据
restoreFormData();



</script>

<style scoped lang='less'>
.choseFood_box {
    width: 100px;
    position: relative;

    .num {
        position: absolute;
        top: -10px;
        right: 0;
        width: 30px;
        height: 20px;
        background-color: #008000;
        border-radius: 50px;
        font-size: 16px;
        color: #fff;
        line-height: 18px;
        text-align: center;
    }
}

.jisuan {
    margin-top: 20px;
}

.bts {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>