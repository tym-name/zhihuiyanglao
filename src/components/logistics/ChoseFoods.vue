<template>
    <div>
        <el-dialog v-model="props.isShow" title="选择你喜欢的食材" width="800" :before-close="props.openOrClose">
            <Table ref="tableRef" :columns="columns" :fetch-data="foodList" @selection-change="handleSelectionChange">
            </Table>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="props.openOrClose">取消</el-button>
                    <el-button type="primary" @click="handleConfirm">
                        确认
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import Table, { type TableColumn } from '../table.vue'
import { foodList } from '@/api/diet/food/food';
import type { FoodItem } from '@/api/diet/food/foodType';


const props = defineProps<{
    isShow: boolean;
    openOrClose: () => void;
}>()

const emit = defineEmits<{
    (e: 'confirm', data: FoodItem[]): void
}>()

const columns: TableColumn[] = [
    {
        type: "selection",
        width: "50",
    },
    {
        label: "序号",
        prop: "id",
    },
    {
        label: "物料名称",
        prop: "name",
    },
    {
        label: "单位",
        prop: "unit",
    },
    {
        label: "供应商",
        prop: "supplierName",
    },
    {
        label: "批发价",
        prop: "wholePrice",
    },
    {
        label: "零售价",
        prop: "sellPrice",
    },
    {
        label: "采购价",
        prop: "purchasePrice",
    },
]

const choseFoodList = ref<FoodItem[]>([])
//选中状态
const handleSelectionChange = (rows: FoodItem[]) => {
    choseFoodList.value = rows
}

const handleConfirm = () => {
    emit('confirm', choseFoodList.value);
    props.openOrClose();
}
</script>

<style scoped lang='less'></style>