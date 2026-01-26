<template>
    <Table ref="tableRef" @selection-change="handleSelectionChange" :init-params="params" :columns="columns"
        :fetch-data="reservationList">
        <template #buttons>
            <el-button type="success" @click="handleAdd">+ 新增</el-button>
            <el-button type="danger" :disabled="isBatchDelDisabled"><i
                    class="iconfont icon-shanchu"></i>批量删除</el-button>
        </template>
        <template #elderlyGender="{ row }">
            {{ row.elderlyGender === 1 ? '男' : '女' }}
        </template>
        <template #search>
            <el-form :inline="true" class="demo-form-inline" style="height: 80px;">
                <el-form-item label="老人姓名:">
                    <el-input placeholder="请输入老人姓名" v-model="params.name" clearable />
                </el-form-item>
                <el-form-item label="身份证号:">
                    <el-input placeholder="请输入身份证号" v-model="params.customerName" clearable />
                </el-form-item>
                <el-form-item label="床位:">
                    <el-select placeholder="请选择床位" v-model="params.state" style="width: 200px">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号:">
                    <el-input placeholder="请输入" v-model="params.mobile" clearable />
                </el-form-item>
                <el-form-item style="width: 200px;">
                    <el-button type="primary" @click="search">查询</el-button>
                    <el-button @click="resetSearch">重置</el-button>
                </el-form-item>
            </el-form>
        </template>
        <template #operate="{ row }">
            <el-button link type="primary" @click="particulars(row)"><i class="iconfont icon-file"></i>详情</el-button>
            <el-button link type="primary" @click="updReserve(row)"><i class="iconfont icon-bianji"></i>编辑</el-button>
            <el-button link type="danger" @click="ReserveDel(row.id)"><i
                    class="iconfont icon-shanchu"></i>删除</el-button>
        </template>
    </Table>
    <ReserveAdd v-if="dialogForm" v-model="dialogForm" @tableRefersh="tableRefersh"></ReserveAdd>


    <!-- 编辑弹窗：核心-传递编辑数据 editData -->
    <!-- <ReserveUpd :handleSuccess2="handleSuccess2" v-if="dialogForm2" v-model="dialogForm2" :editData="editRowData"
        @refreshTable="refreshTable">
    </ReserveUpd> -->

</template>

<script setup lang='ts'>
import Table, { type TableColumn } from "../../components/table.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ref } from "vue";
import { reservationDelete, reservationList } from "../../api/Reserve/Reserve";
import ReserveAdd from './ReserveAdd.vue'
import router from "../../router";

const tableRef = ref<any>(null)
const isBatchDelDisabled = ref(true)



// 查询参数
const params = ref<any>({
    name: '',
    customerName: '',
    state: '' // 补充回访状态参数
})

// 新增弹窗显隐
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
        customerName: '',
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
        label: "老人姓名",
        prop: "elderlyName",
    },
    {
        label: "性别",
        slot: "elderlyGender",
    },
    {
        label: "身份证号",
        prop: "elderlyIdCard",
    },
    {
        label: "预订人姓名",
        prop: "name",
        width: 100,
    },
    {
        label: "联系电话",
        prop: "mobile",
    },
    {
        label: "与老人关系",
        prop: "relation",
        width: 100,
    },
    {
        label: "预定床位",
        prop: "begName",
    },
    {
        label: "开始日期",
        prop: "startDate",
        width: 120,
    },
    {
        label: "预定时常（月）",
        prop: "addTime",
        width: 130,
    },
    {
        label: "已缴定金",
        prop: "amount",
    },
    {
        label: "剩余天数",
        prop: "day",
    },
    {
        label: "登记日期",
        prop: "startDate",
        width: 120,
    },
    {
        label: "操作",
        slot: "operate",
        width: 350,
        fixed: "right",
    }
];

// 回访状态下拉选项
const options = [
    {
        value: '1',
        label: '未签约',
    },
    {
        value: '2',
        label: '预定中',
    },
    {
        value: '3',
        label: '已住院',
    }
]

// 新增咨询
const handleAdd = () => {
    dialogForm.value = true
};

// 编辑咨询：核心-获取详情并传递给子组件
const updReserve = (row: any) => {
    router.push({
        path: '/ReserveUpd',
        query: {
            elderlyId: row.elderlyId,
            id: row.id
        }
    })
}

const particulars = async (row: any) => {
    router.push({
        path: '/ReserveParticulars',
        query: {
            id: row.id
        }
    })
}


// 单个删除
const ReserveDel = (id: number) => {
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
            const res = await reservationDelete(id);
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
    margin: 5px;
}

.demo-form-inline {
    height: 35px;
    display: flex;
    align-items: center;
}
</style>