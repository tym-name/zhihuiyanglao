<template>
    <Table ref="tableRef" @selection-change="handleSelectionChange" :init-params="params" :columns="columns"
        :fetch-data="orderList">
        <template #buttons>
            <el-button type="success" @click="handleAdd"><i class="iconfont icon-jia"></i>新增</el-button>
            <el-button type="danger" :disabled="isBatchDelDisabled"><i
                    class="iconfont icon-shanchu"></i>批量删除</el-button>
        </template>
        <template #elderlyGender="{ row }">
            {{ row.elderlyGender === 1 ? '男' : '女' }}
        </template>
        <template #state="{ row }">
            {{ row.state === 1 ? '已入院' : '未入院' }}
        </template>
        <template #search>
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="老人姓名:">
                    <el-input placeholder="请输入老人姓名" v-model="params.name" clearable />
                </el-form-item>
                <el-form-item label="身份证号:">
                    <el-input placeholder="请输入身份证号" v-model="params.elderlyIdCard" clearable />
                </el-form-item>
                <el-form-item label="床位:">
                    <CascaderBeg @bedChange="bedChange" v-model="params.bed" />
                </el-form-item>
                <el-form-item style="width: 200px;">
                    <el-button type="primary" @click="search">查询</el-button>
                    <el-button @click="resetSearch">重置</el-button>
                </el-form-item>
            </el-form>
        </template>
        <template #operate="{ row }">
            <el-button link type="primary"><i class="iconfont icon-file"></i>详情</el-button>
            <el-button link type="primary"><i class="iconfont icon-bianji"></i>编辑</el-button>
            <el-button link type="danger" @click="HospitalizedDel(row.id)"><i
                    class="iconfont icon-shanchu"></i>删除</el-button>
        </template>
    </Table>
    <HospitalizedAdd v-if="dialogForm" v-model="dialogForm" @tableRefersh="tableRefersh"></HospitalizedAdd>

</template>

<script setup lang='ts'>
import Table, { type TableColumn } from "../../components/table.vue";
import { ref } from "vue";
import { orderDelete, orderList } from "../../api/Hospitalized/Hospitalized";
import { ElMessage, ElMessageBox } from "element-plus";
import CascaderBeg from "../../components/form/CascaderBeg.vue";
import HospitalizedAdd from "./HospitalizedAdd.vue";

const tableRef = ref<any>(null)
const isBatchDelDisabled = ref(true)

// 查询参数
const params = ref<any>({
    begId: '',
    name: '',
    elderlyIdCard: '',
    bed: ''
})




// 床位变更回调
const bedChange = (idArr: number[]) => {
    params.value.begId = idArr[idArr.length - 1] || 0;
    console.log('床位ID更新：', params.value.begId); // 调试床位ID
};

const dialogForm = ref(false)

const tableRefersh = () => {
    tableRef.value?.refresh()
}


// 搜索
const search = () => {
    tableRef.value?.refresh();
}

// 重置搜索条件（补充）
const resetSearch = () => {
    params.value = {
        name: '',
        elderlyIdCard: '',
        state: ''
    }
    tableRef.value?.refresh();
}

// 表格列配置
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
        label: "头像",
        image: "elderlyPhoto",
    },
    {
        label: "性别",
        slot: "elderlyGender",
    },
    {
        label: "老人姓名",
        prop: "elderlyName",
    },
    {
        label: "身份证号",
        prop: "elderlyIdCard",
    },
    {
        label: "床位",
        prop: "begName",
    },
    {
        label: "申请时间",
        prop: "addTime",
        width: 130,
    },
    {
        label: "入住开始时间",
        prop: "startDate",
        width: 130,
    },
    {
        label: "入住时长",
        prop: "payDays",
    },
    {
        label: "状态",
        prop: "state",
        slot: "state",
    },
    {
        label: "操作",
        slot: "operate",
        width: 250,
    }
];

// 新增咨询
const handleAdd = () => {
    dialogForm.value = true
};

// 单个删除
const HospitalizedDel = (id: number) => {
    ElMessageBox.confirm(
        '是否删除该条记录？',
        '删除确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: "warning"
        }
    )
        .then(async () => {
            const res = await orderDelete(id);
            if (res.code === 10000) {
                ElMessage.success('删除成功');
                tableRef.value?.refresh();
            } else {
                ElMessage.error('删除失败：' + res.msg);
            }
        })
        .catch(() => {
            ElMessage.info('已取消删除');
        })
}

// 监听表格选中数据变化
const handleSelectionChange = (rows: any[]) => {
    console.log("选中的数据：", rows);
    isBatchDelDisabled.value = rows.length === 0;
}
</script>

<style scoped lang='less'>
.iconfont {
    margin-right: 5px;
}

.demo-form-inline {
    height: 35px;
    display: flex;
    align-items: center;
}
</style>