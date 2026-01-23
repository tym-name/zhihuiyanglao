<template>
    <div>
        <el-dialog v-model="dialogVisible" title="添加服务" width="500px" :close-on-click-modal="false"
            @close="handleDialogClose">
            <el-table ref="tableRef" :data="tableData" style="width: 100%">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="name" label="服务名称" width="180" />
                <el-table-column prop="content" label="服务描述" width="180" />
            </el-table>
            <div class="btns">
                <el-button @click="close">关闭</el-button>
                <el-button type="primary" @click="addServe">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import { serviceList } from '@/api/service/service';
import { onMounted, ref } from 'vue';
import type { TableInstance } from 'element-plus';

const dialogVisible = ref(true);

// 定义事件发射器
const emit = defineEmits(['addServices']);

// 弹窗关闭时重置表单
const handleDialogClose = () => {

};

const tableData = ref<any>([]);
const tableRef = ref<TableInstance>();

onMounted(() => {
    getList();
});

let getList = async () => {
    let res = await serviceList({
        page: 1,
        pageSize: 10,
    });
    console.log(res);
    tableData.value = res.data.list
};

const close = () => {
    dialogVisible.value = false;
};

const addServe = async () => {
    // 获取选中的行数据
    const selectedRows = tableRef.value?.getSelectionRows() || [];
    if (selectedRows.length === 0) {
        console.log('请选择要添加的服务');
        return;
    }

    console.log('选中的服务:', selectedRows);

    // 向父组件传递选中的服务数据
    emit('addServices', selectedRows);

    // 关闭对话框
    dialogVisible.value = false;
};
</script>

<style scoped lang='less'>
.btns {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
}
</style>