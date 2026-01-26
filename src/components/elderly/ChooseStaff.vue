<template>
    <el-dialog v-model="dialogVisible" title="选择护工" width="800">
        <span>
            <el-form  :inline="true" class="demo-form-inline" :model="params">
                <el-form-item label="姓名:">
                    <el-input placeholder="请输入姓名" v-model="params.name" style="width: 180px;"></el-input>
                </el-form-item>

                <el-form-item label="">
                    <el-button type="primary" @click="handleSearch">查询</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>

            </el-form>
            <!-- 表格 -->
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column prop="photo" label="头像" width="180">
                    <template #default="scope">
                        <el-image style="width: 50px; height: 50px" :src="IMG_URL + scope.row.photo" :zoom-rate="1.2"
                            :max-scale="7" :min-scale="0.2" :preview-src-list="[IMG_URL + scope.row.photo]" show-progress
                            :initial-index="4" fit="cover" />
                    </template>
                </el-table-column>
                 <el-table-column prop="name" label="姓名" width="180" />
                <el-table-column prop="mobile" label="手机号" />
                <el-table-column prop="departmentName" label="部门" />
                <el-table-column prop="" label="操作">
                    <!-- 自定义插槽列 -->
                     <template #default="scope">
                        <!-- 如果有自定义插槽，使用插槽 -->
                        <slot v-if="$slots.operate" name="operate" :row="scope.row" :index="scope.$index"></slot>
                     </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination :current-page="params.page" :page-size="params.pageSize" :page-sizes="[5, 15, 20, 30]"
                background layout="total, sizes, prev, pager, next, jumper" :total="total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange"
                style="margin-top: 20px; justify-content: center;" />
        </span>
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

import { getStaffList } from '@/api/market/elderly';
import type { StaffItem, StaffParams } from '@/api/market/elderlyType';

// 图片根路径
const IMG_URL = import.meta.env.VITE_IMG_URL;


//子组件接收父组件传过来的值
const dialogVisible = defineModel<boolean>()

let params = reactive<StaffParams>({
    page: 1,
    pageSize: 5,
  
})


//定义表格数据
const tableData = ref<StaffItem[]>([])

/**
 * 获取员工列表
 */
const  getStaffListData= async () => {
    const res = await getStaffList(params)
    tableData.value = res.data.list
    total.value = res.data.counts
}
getStaffListData()



// 定义总页数
const total = ref(0)

const handleSizeChange = (val: number) => {
   
    params.pageSize = val
    getStaffListData()
}
const handleCurrentChange = (val: number) => {
   
    params.page = val
    getStaffListData()
}

/**
 * 查询
 */
const handleSearch = () => {
    params.page = 1
    getStaffListData()
}

/**
 * 重置
 */
const handleReset = () => {

    Object.assign(params, {
        page: 1,
        pageSize: 5,
        name: '',
        idCard: '',
    })
   getStaffListData()
}


</script>

<style scoped></style>