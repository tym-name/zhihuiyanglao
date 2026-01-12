<template>
    <Table ref="tableRef" :columns="columns" :fetch-data="getCaptcha">
        <template #buttons>
            <el-button type="primary" @click="handleAdd">新增老人</el-button>
            <el-button type="danger" disabled><i class="iconfont icon-shanchu"></i>批量删除</el-button>
        </template>
        <template #gender="{ row }">
            {{ row.gender === 1 ? '男' : '女' }}
        </template>
        <template #search>
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="机构名称:">
                    <el-input placeholder="请输入机构名称" clearable />
                </el-form-item>
                <el-form-item label="管理员姓名:">
                    <el-input placeholder="请输入管理员姓名" clearable />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">查询</el-button>
                    <el-button>重置</el-button>
                </el-form-item>
            </el-form>
        </template>
        <template #operate="{ }">
            <el-button link type="primary"><i class="iconfont icon-bianji"></i>编辑</el-button>
            <el-button link type="primary"><i class="iconfont icon-file"></i>档案管理</el-button>
            <el-button link type="primary"><i class="iconfont icon-zixun"></i>排班管理</el-button>
            <el-button link type="primary"><i class="iconfont icon-xiangqing"></i>计划任务</el-button>
            <el-button link type="danger"><i class="iconfont icon-shanchu"></i>删除</el-button>
        </template>
    </Table>
</template>

<script setup lang='ts'>
import Table, { type TableColumn } from "../../components/table.vue";
import { getCaptcha } from "../../api/market/elderly";
import router from "../../router";

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
        image: "photo",
    },
    {
        label: "老人姓名",
        prop: "name",
    },
    {
        label: "性别",
        prop: "state",
        slot: "gender",
    },
    {
        label: "身份证号",
        prop: "idCard",
        width: 180,
    },
    {
        label: "床位",
        prop: "begName",
    },
    {
        label: "状态",
        prop: "stateName",
    },
    {
        label: "操作",
        slot: "operate",
        width: 520,
        fixed: "right",
    }
];

// 新增老人
const handleAdd = () => {
    router.push('/elderly-edit');
};
</script>

<style scoped lang='less'>
.iconfont {
    margin: 5px;
}

.demo-form-inline {
    height: 35px;
}
</style>