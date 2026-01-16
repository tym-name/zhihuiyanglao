<template>
    <div>
        <Table ref="tableRef" :columns="columns" :fetch-data="getPlayList" :init-params="searchForm"
            @selection-change="handleSelectionChange">
            <template #search>
                <!-- //:model="formInline" -->
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="分类">
                        <el-select v-model="searchForm.type" placeholder="请选择类型" style="width: 240px">
                            <el-option v-for="item in playTypeOptions" :key="item.id" :label="item.name"
                                :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="老人姓名">
                        <el-input v-model="searchForm.name" placeholder="请输入老人姓名" clearable />
                    </el-form-item>
                    <el-form-item label="活动标题">
                        <el-input v-model="searchForm.key" placeholder="请输入活动标题" clearable />
                    </el-form-item>
                    <el-form-item label="上报时间">
                        <el-date-picker v-model="searchForm.beginDate" type="daterange" range-separator="-"
                            start-placeholder="开始日期" end-placeholder="结束日期" style="width: 240px;" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleSearch">查询</el-button>
                        <el-button @click="handleReset">重置</el-button>
                    </el-form-item>
                </el-form>
            </template>
            <template #buttons>
                <el-button type="success" @click="openDialog">添加</el-button>
                <el-button type="danger" @click="delAll" :disabled="isBatchDelDisabled">批量删除</el-button>
            </template>

            <template #operate="{ row }">
                <el-button link type="primary" @click="handleViewDetails(row.id)">
                    <i class="iconfont icon-xiangqing"></i>
                    详情
                </el-button>
                <el-button link type="primary">
                    <i class="iconfont icon-bianji"></i>
                    编辑
                </el-button>
                <el-button link type="danger" @click="deletePlay(row.id)">
                    <i class="iconfont icon-shanchu"></i>
                    删除
                </el-button>
            </template>

            <!--  -->
            <template #elderlyNames="{ row }">
                <div v-if="row.elderly && row.elderly.length > 0">
                    <el-tooltip :content="row.elderly.map((e: any) => e.elderlyName).join('、')" placement="top">
                        <span>
                            {{row.elderly.map((e: any) => e.elderlyName).join('、')}}
                        </span>
                    </el-tooltip>
                </div>
            </template>
        </Table>
        <ViewDetails :drawer="detailsIsShow" :id="activityId" :typeList="playTypeOptions" :close="closeViewDetails">
        </ViewDetails>

        <PlayAddOrUpdate :open="addOrUpdateIshow" :close="closeDialog"></PlayAddOrUpdate>

    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
import Table, { type TableColumn } from '../../components/table.vue'
import { delAllPlay, delPlay, getPlayList, getPlayTypeList } from '../../api/care/activity/activity';
import type { ActivityTypeItem, playListItem, playListParams } from '../../api/care/activity/activityType';
import ViewDetails from '../../components/care/ViewDetails.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import PlayAddOrUpdate from '../../components/care/PlayAddOrUpdate.vue';

const tableRef = ref<any>(null);

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
        label: "标题",
        prop: "title",
    },
    {
        label: "老人姓名",
        slot: "elderlyNames",
    },
    {
        label: "分类",
        prop: "typeName",
    },
    {
        label: "上报人",
        prop: "addAccountName",
    },
    {
        label: "上报时间",
        prop: "addTime",
        formatTime: "YYYY-MM-DD HH:mm"
    },
    {
        label: "操作",
        width: 240,
        slot: "operate",
        fixed: "right",
    }
]
//刷新页面
const Refresh = () => {
    tableRef.value?.refresh();
}

//添加修改
const addOrUpdateIshow = ref(false)
const openDialog = () => {
    addOrUpdateIshow.value = !addOrUpdateIshow.value
}
const closeDialog = () => {
    addOrUpdateIshow.value = false
}

const searchForm = ref<playListParams>({
    name: '',
    beginDate: '',
    endDate: '',
    type: null,
    key: '',
})

const playTypeOptions = ref<ActivityTypeItem[]>([])
const playtypelist = async () => {
    let res = await getPlayTypeList()
    console.log(res);
    playTypeOptions.value = res.data.list
}
playtypelist()

//搜索
const handleSearch = () => {
    tableRef.value.refresh()
}
//重置
const handleReset = () => {
    searchForm.value = {
        name: '',
        beginDate: '',
        endDate: '',
        type: null,
        key: '',
    }
    tableRef.value.refresh()
}
//查看详情
const detailsIsShow = ref(false)
const activityId = ref<number>(0)
const handleViewDetails = (id: number) => {
    detailsIsShow.value = !detailsIsShow.value
    activityId.value = id
}

const closeViewDetails = () => {
    detailsIsShow.value = false
}

//删除单条数据
const deletePlay = (id: number) => {
    ElMessageBox.confirm(
        '是否删除该条记录？',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: "warning"
        }
    )
        .then(async () => {
            await delPlay(id); // 先执行删除接口
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            Refresh()
        })
}

//批量删除
const isBatchDelDisabled = ref(true)
const selectionData = ref<playListItem[]>([])
const ids = ref<number[]>([])
const handleSelectionChange = (rows: playListItem[]) => {
    selectionData.value = rows;
    ids.value = rows.map(row => row.id);
    isBatchDelDisabled.value = rows.length === 0;//判断是否禁用
}

const delAll = async () => {
    ElMessageBox.confirm(
        '是否删除多条记录？',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            let res = await delAllPlay(ids.value)
            console.log(res);
            if (res.code === 10000) {
                ElMessage({
                    type: 'success',
                    message: '删除成功',
                })
                Refresh()
            }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}




</script>

<style scoped lang='less'>
.el-card__body {
    padding: 18px 0 0 10px
}
</style>
