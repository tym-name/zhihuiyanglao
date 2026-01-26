<template>
    <div>
        <!-- :before-close="handleClose" -->
        <el-dialog v-model="props.isShow" title="选择老人" width="750">
            <Table ref="tableRef" :columns="columns" :fetch-data="getElderlyList" :init-params="searchForm"
                @selection-change="handleSelectionChange">
                <template #search>
                    <!-- //:model="formInline" -->
                    <el-form :inline="true" class="demo-form-inline" style="width: 670px; border:none; padding: 0;">
                        <el-form-item label="老人姓名">
                            <el-input v-model="searchForm.name" placeholder="请输入老人姓名" clearable style="width: 150px;" />
                        </el-form-item>
                        <el-form-item label="身份证号">
                            <el-input v-model="searchForm.name" placeholder="请输入身份证号" clearable style="width: 150px;" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handleSearch">查询</el-button>
                            <el-button @click="handleReset">重置</el-button>
                        </el-form-item>
                    </el-form>
                </template>

                <template #header="{ row }">
                    <el-image style="width: 50px; height: 50px" :src="VITE_IMG_URL + row.photo" />
                </template>
                <template #sex="{ row }">
                    <span>{{ row.gender == 1 ? '男' : '女' }}</span>
                </template>
            </Table>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="props.close">取消</el-button>
                    <!-- @click="dialogVisible = false" -->
                    <el-button type="primary" @click="handleConfirm">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import Table, { type TableColumn } from '../../components/table.vue'
import type { ElderlyListItem, ElderlyListParams } from '../../api/care/activity/activityType';
import { getElderlyList } from '../../api/care/activity/activity';

const VITE_IMG_URL = import.meta.env.VITE_IMG_URL;
const props = defineProps<{
    isShow: boolean
    close: () => void
    open: () => void
}>()

const emit = defineEmits<{
    (e: 'confirm', data: ElderlyListItem[]): void
}>()


const tableRef = ref<any>(null);

const columns: TableColumn[] = [
    {
        type: "selection",
        width: "50",
    },
    {
        label: "姓名",
        prop: "name",
    },
    {
        label: "头像",
        slot: "header",
    },
    {
        label: "性别",
        slot: "sex",
    },
    {
        label: "身份证号",
        prop: "idCard",
        width: "170"
    },
]

const searchForm = ref<ElderlyListParams>({

    name: '',
    idCard: ''
})

//搜索
const handleSearch = () => {
    tableRef.value.refresh()
}
//重置
const handleReset = () => {
    searchForm.value = {
        name: '',
        idCard: ''
    }
    tableRef.value.refresh()
}

const selectionData = ref<ElderlyListItem[]>([])
const handleSelectionChange = (rows: ElderlyListItem[]) => {
    selectionData.value = rows;
}

const handleConfirm = () => {
    emit('confirm', selectionData.value);
    props.close();
}

</script>

<style scoped lang='less'></style>