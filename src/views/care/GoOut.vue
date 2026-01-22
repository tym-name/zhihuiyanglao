<template>
    <div>
        <!-- 添加模态框 -->
        <el-dialog v-model="dialogVisible" title="添加" width="50%" :before-close="handleClose">

            <Table :columns="oldman" :fetch-data="getCaptcha" ref="checkRef" :initParams="checkModel">

                <template #search>
                    <el-form :inline="true">
                        <el-form-item label="姓名:">
                            <el-input placeholder="请输入姓名" clearable style="width: 200px;" v-model="checkModel.name" />
                        </el-form-item>
                        <el-form-item label="身份证号:">
                            <el-input placeholder="请输入身份证号" clearable style="width: 200px;"
                                v-model="checkModel.idCard" />
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="check" type="primary">查询</el-button>
                            <el-button @click="chong">重置</el-button>
                        </el-form-item>
                    </el-form>
                </template>

                <template #button="scoped">
                    <el-button type="primary" @click="choice(scoped.row)">选择</el-button>
                </template>
            </Table>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">关闭</el-button>
                    <el-button type="primary" @click="dialogVisible = false">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <Table ref="tableRef" :columns="columns" :fetch-data="getElderlyList" :initParams="params"
            @selection-change="handleSelectionChange">

            <template #search>
                <el-form :inline="true" class="demo-form-inline">
                    <!-- 老人姓名 -->
                    <el-form-item label="老人姓名:">
                        <el-input placeholder="请输入老人姓名" clearable style="width: 200px;" v-model="params.name" />
                    </el-form-item>
                    <el-form-item label="审批状态">
                        <el-select placeholder="请选择状态" v-model="params.state" clearable style="width: 220px;">
                            <el-option label="已返回" value="0" />
                            <el-option label="未返回" value="1" />
                            <el-option label="逾期未返回" value="2" />
                        </el-select>
                    </el-form-item>

                    <!-- 外出时间 -->
                    <el-form-item label="上报时间:">
                        <el-date-picker type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期"
                            format="YYYY-MM-DD HH:mm:ss" date-format="YYYY/MM/DD ddd" style="width: 250px;"
                            v-model="params.beginDate" @change="handleDate" />
                    </el-form-item>
                    <!-- 按钮 -->
                    <el-form-item>
                        <el-button @click="query" type="primary">查询</el-button>
                        <el-button @click="reset">重置</el-button>
                    </el-form-item>

                    <div class="button">
                        <el-button type="success" @click="dialogVisible = true">+新增外出</el-button>
                        <el-button type="danger" :disabled="multipleSelection.length === 0"
                            @click="delAll">-批量删除</el-button>
                    </div>


                </el-form>
            </template>



            <template #operate="{ row }">
                <el-button @click="goout" type="primary" link size="small"
                    style="width: 20px; font-size: 13px !important;margin-right: 8px;">
                    <el-icon>
                        <View />
                    </el-icon>查看详情
                </el-button>

                <el-button @click="Update(row)" type="primary" link size="small"
                    style="width: 60px; font-size: 13px !important;margin-right: 8px;">
                    <el-icon>
                        <EditPen />
                    </el-icon>编辑
                </el-button>

                <el-button type="danger" link size="small" style="width: 10px; font-size: 13px !important; "
                    @click="getDel(row.id)">
                    <el-icon>
                        <Delete />
                    </el-icon>删除
                </el-button>

            </template>
        </Table>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import Table from '../../components/Table/Table.vue';
import { columns } from './Outbound';
import { getDel1, getElderlyList, getAllDel, getOldManList } from '../../api/OutboundRegistration/Outbound';
import type { ElderlyOutRecordItem } from '../../api/OutboundRegistration/type';
import { dayjs, ElMessage, ElMessageBox } from 'element-plus';
import { View, EditPen, Delete } from '@element-plus/icons-vue';
import router from '../../router';
import { oldman } from './oldManList';
import type { ApifoxModel } from '../../api/OutboundRegistration/oldManList';
import { getCaptcha } from '../../api/market/elderly';




const dialogVisible = ref(false)

const handleClose = () => {
    dialogVisible.value = false
}


const elderlyList = ref<any[]>([]);
const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);

const searchParams = reactive({
    name: '',
    idCard: ''
});

const fetchElderlyList = async () => {
    const params = {
        page: currentPage.value,
        pageSize: pageSize.value,
        ...searchParams
    };
    const res = await getElderlyList(params);
    if (res.code === 10000) {
        elderlyList.value = res.data.list;
        total.value = res.data.counts;
    }
};


// 日期处理 // 时间处理
const handleDate = (e: any) => {
    if (e && e.length > 1) {
        params.beginDate = e[0] ? dayjs(e[0]).format('YYYY-MM-DD HH-mm') : "";
        params.endDate = e[1] ? dayjs(e[1]).format('YYYY-MM-DD HH-mm') : "";
    } else {
        params.beginDate = "";
        params.endDate = "";
    }
};

onMounted(() => {
    fetchElderlyList();
});
// 定义tableRef
const tableRef = ref();

// 搜索参数
const params = reactive<ElderlyOutRecordItem>({
    name: "",
    state: undefined,
    beginDate: ""
})

// 选中的行
const multipleSelection = ref<ElderlyOutRecordItem[]>([]);

// 查询点击事件
const query = () => {
    // 调用Table组件的refresh方法刷新数据
    tableRef.value?.refresh();
}

// 重置搜索条件
const reset = () => {
    // 重置搜索参数
    params.name = "";
    params.startTime = "";
    params.endTime = "";
    params.beginDate = ""

    // 调用Table组件的refresh方法刷新数据
    tableRef.value?.refresh();
}

// 处理表格多选
const handleSelectionChange = (val: ElderlyOutRecordItem[]) => {
    multipleSelection.value = val;
}

// 添加搜索参数
const checkModel = reactive<ApifoxModel>({
    name: "",
    idCard: "",
})

const checkRef = ref()

// 添加里面的搜索
const check = () => {
    // 调用Table组件的refresh方法刷新数据
    checkRef.value?.refresh();
}

// 重置搜索条件
const chong = () => {
    // 重置搜索参数
    checkModel.name = "";
    checkModel.idCard = "";

    // 调用Table组件的refresh方法刷新数据
    checkRef.value?.refresh();
}

// 添加选择功能
const choice = (row: any) => {
    let id = row.id;
    router.push('/AddOutings?id=' + id)
}

// 查看详情功能
const goout = () => {

    router.push({
        path: "/details",
    });
}

// 修改外出功能
const Update = (row: ElderlyOutRecordItem) => {
    router.push({
        path: "/edit",
        query: {
            row: encodeURIComponent(JSON.stringify(row)) // 序列化对象并编码
        }
    });
}
// 批量删除
const delAll = async () => {
    if (!multipleSelection.value.length) return ElMessage.error('请选择要删除的数据')
    const confirm = await ElMessageBox.confirm(
        '确定要删除选中的数据吗？',
        '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
    }
    ).catch(() => undefined)
    if (!confirm) return ElMessage.info('已取消删除');

    const ids: number[] = multipleSelection.value.map(item => item.id!)
    // console.log(ids)
    await getAllDel(ids).catch(() => undefined)

    ElMessage.success('删除成功')
    tableRef.value?.refresh();
}



// 删除功能
const getDel = async (id: number) => {
    console.log(id);

    ElMessageBox.confirm(
        '此删除操作将无法恢复，请确认是否删除?',
        '删除',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            await getDel1(id)
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            // 删除成功后刷新表格数据
            tableRef.value?.refresh();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })

}


</script>
<style scoped lang="less">
.dialog-footer {
    text-align: right;
}
</style>