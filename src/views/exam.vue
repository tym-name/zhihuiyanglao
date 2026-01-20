<template>
    <div>
        <Table :columns="columns" :fetch-data="getRoleList">
            <template #buttons>
                <!--  @click="showAddDialog = !showAddDialog" -->
                <el-button type="success">添加角色</el-button>
                <el-button type="danger">批量删除</el-button>
            </template>

            <template #operate="{  }">
                <el-button link type="primary">
                    <i class="iconfont icon-bianji"></i>
                    修改
                </el-button>
                <el-button link type="danger">
                    <i class="iconfont icon-shanchu"></i>
                    删除
                </el-button>
            </template>
        </Table>
    </div>
</template>

<script setup lang='ts'>
import Table, { type TableColumn } from '.././components/table.vue';
import { getRoleList } from '../api/exam/exam';

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
        label: "角色名称",
        prop: "name",
    },
    {
        label: "关联账号",
        prop: "accountCounts",
    },
    {
        label: "创建人",
        prop: "addAccountName",
    },
    {
        label: "创建时间",
        prop: "addTime",
    },
    {
        label: "操作",
        width: 320,
        slot: "operate",
        fixed: "right",
    }
];
</script>

<style scoped lang='less'></style>