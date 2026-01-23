<template>
    <Table ref="tableRef" @selection-change="handleSelectionChange" :init-params="params" :columns="columns"
        :fetch-data="questionList">
        <template #buttons>
            <el-button type="primary" @click="handleAdd">新增咨询</el-button>
            <el-button type="danger" :disabled="isBatchDelDisabled"><i
                    class="iconfont icon-shanchu"></i>批量删除</el-button>
        </template>
        <template #gender="{ row }">
            {{ row.gender === 1 ? '男' : '女' }}
        </template>
        <template #search>
            <el-form :inline="true" class="demo-form-inline" style="height: 80px;">
                <el-form-item label="咨询人姓名:">
                    <el-input placeholder="请输入咨询人姓名" v-model="params.name" clearable />
                </el-form-item>
                <el-form-item label="老人姓名:">
                    <el-input placeholder="请输入老人姓名" v-model="params.customerName" clearable />
                </el-form-item>
                <el-form-item label="回访状态:">
                    <el-select placeholder="请选择" v-model="params.state" style="width: 200px">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search">查询</el-button>
                    <el-button @click="resetSearch">重置</el-button>
                </el-form-item>
            </el-form>
        </template>
        <template #operate="{ row }">
            <el-button link type="primary" @click="Particulars(row)"><i class="iconfont icon-file"></i>详情</el-button>
            <!-- 修复：移除无效的:oldhome绑定，仅保留点击事件 -->
            <el-button link type="primary" @click="updQuestion(row)"><i class="iconfont icon-bianji"></i>编辑</el-button>
            <el-button link type="primary" @click="visit(row)"><i class="iconfont icon-goout"></i>回访记录</el-button>
            <el-button link type="danger" @click="questionDel(row.id)"><i
                    class="iconfont icon-shanchu"></i>删除</el-button>
        </template>
    </Table>

    <!-- 新增弹窗 -->
    <QuestionAdd :handleSuccess="handleSuccess" v-if="dialogForm" v-model="dialogForm" @refreshTable="refreshTable">
    </QuestionAdd>

    <!-- 编辑弹窗：核心-传递编辑数据 editData -->
    <QuestionUpd :handleSuccess2="handleSuccess2" v-if="dialogForm2" v-model="dialogForm2" :editData="editRowData"
        @refreshTable="refreshTable">
    </QuestionUpd>
    <!-- 详情 -->
    <QuestionParticulars :handleSuccess3="handleSuccess3" v-if="dialogForm3" v-model="dialogForm3"
        :editData2="editRowData2" @refreshTable="refreshTable"></QuestionParticulars>

</template>

<script setup lang='ts'>
import Table, { type TableColumn } from "../../components/table.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ref } from "vue";
import { questionDelete, questionGet, questionList } from "../../api/Question/Question";
import QuestionAdd from './QuestionAdd.vue'
import QuestionUpd from './QuestionUpd.vue'
import QuestionParticulars from './QuestionParticulars.vue'
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
// 编辑弹窗显隐
const dialogForm2 = ref(false)

const dialogForm3 = ref(false)
// 存储要传递给编辑子组件的行数据（核心：编辑回显的数据源）
const editRowData = ref<any>({})

const editRowData2 = ref<any>({})

// 新增成功回调
const handleSuccess = () => {
    dialogForm.value = false
    tableRef.value?.refresh()
}
const refreshTable = () => {
    tableRef.value?.refresh();
};

// 编辑成功回调
const handleSuccess2 = () => {
    dialogForm2.value = false
    tableRef.value?.refresh()
}

const handleSuccess3 = () => {
    dialogForm3.value = false
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
        label: "咨询类型",
        prop: "type",
    },
    {
        label: "老人姓名",
        prop: "customerName",
    },
    {
        label: "咨询渠道",
        prop: "source",
    },
    {
        label: "咨询人",
        prop: "name",
    },
    {
        label: "联系方式",
        prop: "mobile",
    },
    {
        label: "与老人关系",
        prop: "relation",
        width: 120,
    },
    {
        label: "登记日期",
        prop: "addTime",
    },
    {
        label: "登记人",
        prop: "addAccountName",
    },
    {
        label: "计划回访日期",
        prop: "visitTime",
        width: 120,
    },
    {
        label: "回访状态",
        prop: "stateName",
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

// 回访记录
const visit = (row: any) => {
    router.push({
        path: '/payAReturnVisit',
        query: {
            id: row.id,
        },
    })
}

// 编辑咨询：核心-获取详情并传递给子组件
const updQuestion = async (row: any) => {
    try {
        // 1. 打开编辑弹窗
        dialogForm2.value = true

        // 2. 根据行ID获取详情数据
        const res = await questionGet(row.id)

        // 3. 校验接口返回
        if (res && res.code === 10000 && res.data) {
            // 4. 存储详情数据，传递给子组件
            editRowData.value = res.data
            console.log('编辑数据回显：', editRowData.value);
        } else {
            ElMessage.error('获取编辑数据失败：' + (res?.msg || '服务器异常'));
            dialogForm2.value = false; // 关闭弹窗
        }
    } catch (error) {
        console.error('获取咨询详情失败：', error);
        ElMessage.error('加载编辑数据失败，请稍后重试');
        dialogForm2.value = false; // 关闭弹窗
    }
}

// 单个删除
const questionDel = (id: number) => {
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
            const res = await questionDelete(id);
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

const Particulars = async (row: any) => {
    try {
        // 1. 打开编辑弹窗
        dialogForm3.value = true

        // 2. 根据行ID获取详情数据
        const res = await questionGet(row.id)

        // 3. 校验接口返回
        if (res && res.code === 10000 && res.data) {
            // 4. 存储详情数据，传递给子组件
            editRowData2.value = res.data
            console.log('详情：', editRowData2.value);
        } else {
            ElMessage.error('详情：' + (res?.msg || '服务器异常'));
            dialogForm3.value = false; // 关闭弹窗
        }
    } catch (error) {
        console.error('获取详情失败：', error);
        ElMessage.error('加载编辑数据失败，请稍后重试');
        dialogForm3.value = false; // 关闭弹窗
    }
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