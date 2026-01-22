<template>
    <div>
        <el-dialog v-model="props.isShow" title="选择老人" width="750" :before-close="props.closeElderly">
            <el-form :inline="true" :model="params" class="demo-form-inline">
                <el-form-item label="姓名" style="width: 200px;">
                    <el-input v-model="params.name" placeholder="请输入姓名" clearable />
                </el-form-item>
                <el-form-item label="身份证号" style="width: 230px;">
                    <el-input v-model="params.idCard" placeholder="请输入身份证号" clearable />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="ElderlyList">查询</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="name" label="姓名" />
                <el-table-column label="头像">
                    <template #default="scope">
                        <el-image style="width: 50px; height: 50px" :src="VITE_IMG_URL + scope.row.photo" />
                    </template>
                </el-table-column>
                <el-table-column label="性别">
                    <template #default="scope">
                        {{ scope.row.gender === 1 ? '男' : '女' }}
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="身份证号" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="handleSelect(scope.row)">
                            选择
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-model:current-page="params.page" v-model:page-size="params.pageSize"
                :page-sizes="[15, 20, 25, 30]" layout="total, sizes, prev, pager, next, jumper" :total="total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
import { getElderlyList } from '../../api/care/activity/activity';
import type { ElderlyListItem, ElderlyListParams } from '../../api/care/activity/activityType';
const VITE_IMG_URL = import.meta.env.VITE_IMG_URL;
const props = defineProps<{
    isShow: boolean;
    openElderly: () => void
    closeElderly: () => void
}>()
const total = ref(0);
//表格绑定的表单
const tableData = ref<ElderlyListItem[]>([])

// 获取老人列表参数
const params = ref<ElderlyListParams>({
    page: '1',
    pageSize: '10',
    name: '',
    idCard: '',
})
//获取老人列表方法
const ElderlyList = async () => {
    let res = await getElderlyList(params.value);
    console.log('老人列表', res);
    tableData.value = res.data.list;
    total.value = res.data.counts;
}
ElderlyList();

//重置
const handleReset = () => {
    params.value = {
        name: '',
        idCard: '',
    }
    ElderlyList()
}


const handleSizeChange = (val: number) => {
    // console.log(`${val} items per page`)
    params.value.pageSize = val.toString()
    ElderlyList();
}
const handleCurrentChange = (val: number) => {
    // console.log(`current page: ${val}`)
    params.value.page = val.toString()
    ElderlyList();
}


//把选择的值给父组件传过去
const emit = defineEmits<{
    'select-elderly': [elderly: ElderlyListItem]  // 选择老人事件
}>()
const handleSelect = (row: ElderlyListItem) => {
    emit('select-elderly', row);
    props.closeElderly()
}
</script>

<style scoped lang='less'></style>