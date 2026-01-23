<template>
    <Table ref="tableRef" @selection-change="handleSelectionChange" :init-params="params" :columns="columns"
        :fetch-data="customerList">
        <template #buttons>
            <el-button type="primary" @click="handleAdd">新增潜在客户</el-button>
            <el-button type="danger" @click="delAll" :disabled="isBatchDelDisabled"><i
                    class="iconfont icon-shanchu"></i>批量删除</el-button>
            <el-button>EXCEL导入</el-button>
        </template>
        <template #gender="{ row }">
            {{ row.gender === 1 ? '男' : '女' }}
        </template>
        <template #search>
            <el-form :inline="true" class="demo-form-inline" style="height: 80px;">
                <el-form-item label="老人姓名:">
                    <el-input placeholder="请输入老人姓名" v-model="params.name" clearable />
                </el-form-item>
                <el-form-item label="身份证号:">
                    <el-input placeholder="请输入身份证号" v-model="params.idCard" clearable />
                </el-form-item>
                <el-form-item label="创建日期:">
                    <el-date-picker type="daterange" value-format="YYYY-MM-DD" range-separator="-"
                        start-placeholder="开始时间" end-placeholder="结束时间" style="width: 200px;" size="default"
                        @change="(val: string[]) => dateChange(val, params)" v-model="params.date" />
                </el-form-item>
                <el-form-item label="状态:">
                    <el-select placeholder="请选择" v-model="params.state" style="width: 200px">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search">查询</el-button>
                    <el-button>重置</el-button>
                </el-form-item>
            </el-form>
        </template>
        <template #operate="{ row }">
            <el-button link type="primary" @click="records(row)"><i class="iconfont icon-file"></i>详情</el-button>
            <el-button link type="primary" @click="edit(row)" :oldhome="oldhome"><i
                    class="iconfont icon-bianji"></i>编辑</el-button>
            <el-button link type="primary" @click="goQuestion"><i class="iconfont icon-goout"></i>咨询登记</el-button>
            <el-button link type="danger" @click="deleteCustomer(row.id)"><i
                    class="iconfont icon-shanchu"></i>删除</el-button>
        </template>
    </Table>
</template>

<script setup lang='ts'>
import Table, { type TableColumn } from "../../components/table.vue";
import { buildingList, elderlyDeleteAll } from "../../api/market/elderly";
import router from "../../router";
import { ref } from "vue";
import type { BuildingItem, BuildingType, PersonInfo } from "../../api/market/elderlyType";
import { customerDelete, customerList } from "../../api/customer/customer";
import { ElMessage, ElMessageBox } from "element-plus";

const tableRef = ref<any>(null)
const isBatchDelDisabled = ref(true)

// 查询参数
const params = ref<any>({
    name: '',
    idCard: '',
    begId: 0,
    state: null,
    date: '',
})

const dateChange = (val: string[], Params: any) => {
    if (!Params.date) Params.date = [];
    Params.date[0] = val[0]
    Params.date[1] = val[1]
    Params.startTime = val[0];
    Params.beginDate = val[0];
    Params.endDate = val[1];
};

// 床位列表
const elderlyList = ref<BuildingItem[]>([])

const page = ref<BuildingType>({
    page: 1,
    pageSize: 10
})
const getbuildingList = async () => {
    try {
        let res = await buildingList(page.value);
        console.log('床位列表', res);
        // 1. 赋值原始扁平数据（响应式）
        elderlyList.value = res.data.list || [];
        // 2. 格式化数据为级联树形结构，更新 cascaderOptions（响应式）
        cascaderOptions.value = formatCascaderData(elderlyList.value);
    } catch (error) {
        console.error('获取床位列表失败：', error);
        ElMessage.error('获取床位数据失败，请稍后重试');
    }
};

// 页面加载时获取床位数据
getbuildingList();

// 新增：格式化后的级联树形数据（el-cascader 所需格式，响应式）
const cascaderOptions = ref<Array<{
    value: number;
    label: string;
    children?: Array<{
        value: number;
        label: string;
        children?: Array<{
            value: number;
            label: string;
        }>;
    }>;
}>>([]);
// 核心：扁平数组转 el-cascader 支持的树形结构
const formatCascaderData = (flatList: BuildingItem[]) => {
    // 1. 先构建 id 到 数据项的映射表，提高查询效率
    const itemMap = new Map<number, BuildingItem>();
    flatList.forEach(item => {
        itemMap.set(item.id, item);
    });

    // 2. 构建树形结构（三级：楼栋→单元→楼层）
    const treeData: typeof cascaderOptions.value = [];

    // 3. 先筛选顶级节点（楼栋，pid=0）
    const topLevelItems = flatList.filter(item => item.pid === 0);

    // 4. 递归/循环构建子节点（单元→楼层）
    topLevelItems.forEach(building => {
        // 构建一级节点（楼栋）
        const buildingNode = {
            value: building.id,
            label: building.name,
            children: [] as any[]
        };

        // 筛选二级节点（单元，pid=楼栋id）
        const unitItems = flatList.filter(item => item.pid === building.id);
        unitItems.forEach(unit => {
            // 构建二级节点（单元）
            const unitNode = {
                value: unit.id,
                label: unit.name,
                children: [] as any[]
            };

            // 筛选三级节点（楼层，pid=单元id）
            const floorItems = flatList.filter(item => item.pid === unit.id);
            floorItems.forEach(floor => {
                // 构建三级节点（楼层）
                unitNode.children.push({
                    value: floor.id,
                    label: floor.name
                });
            });

            // 给楼栋节点添加单元子节点（仅当有楼层时添加，可选优化）
            if (unitNode.children.length > 0 || floorItems.length > 0) {
                buildingNode.children.push(unitNode);
            }
        });

        // 给树形数据添加楼栋节点（仅当有单元时添加，可选优化）
        if (buildingNode.children.length > 0 || unitItems.length > 0) {
            treeData.push(buildingNode);
        }
    });

    return treeData;
};

// 跳转到咨询登记页面
const goQuestion = () => {
    router.push({
        path: '/Question'
    })
}

// 搜索
const search = () => {
    tableRef.value?.refresh();
}


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
        label: "老人姓名",
        prop: "name",
    },
    {
        label: "性别",
        prop: "state",
        slot: "gender",
    },
    {
        label: "身份证",
        prop: "idCard",
        width: 180,
    },
    {
        label: "来源渠道",
        prop: "source",
    },
    {
        label: "创建时间",
        prop: "addTime",
        width: 180,
    },
    {
        label: "状态",
        prop: "stateName",
    },
    {
        label: "操作",
        slot: "operate",
        width: 400,
    }
];

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

// 新增老人
const handleAdd = () => {
    router.push('/Customer-add');
};

const oldhome = ref()
const edit = (row: PersonInfo) => {
    console.log('点击修改老人', row);
    oldhome.value = row
    router.push(`/CustomerUpd?id=${row.id}`)
};

const records = (row: PersonInfo) => {
    router.push(`/CustomerParticulars?id=${row.id}`)
};


// 单个删除
const deleteCustomer = (id: number) => {
    ElMessageBox.confirm(
        '是否删除该条记录？',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: "warning"
        }
    )
        .then(async () => {
            await customerDelete(id); // 先执行删除接口
            ElMessage({
                type: 'success',
                message: '删除成功',
            });
            tableRef.value?.refresh();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消删除',
            })
        })
}

// 选中的数据
const selectionData = ref<PersonInfo[]>([])
// 批量删除
const delAll = () => {
    if (selectionData.value.length === 0) return;

    ElMessageBox.confirm(
        `是否删除选中的 ${selectionData.value.length} 条记录？`,
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: "warning"
        }
    )
        .then(async () => {
            const ids = selectionData.value.map((item) => item.id);
            await elderlyDeleteAll(ids); // 执行批量删除接口
            ElMessage({
                type: 'success',
                message: '批量删除成功',
            });
            tableRef.value?.getData();
            isBatchDelDisabled.value = true; // 重置禁用状态
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消删除',
            })
        })
}

// 监听表格选中数据变化
const handleSelectionChange = (rows: PersonInfo[]) => {
    console.log("选中的数据：", rows);
    selectionData.value = rows;
    isBatchDelDisabled.value = rows.length === 0;
}
</script>

<style scoped lang='less'>
.iconfont {
    margin: 5px;
}

.demo-form-inline {
    height: 35px;
}
</style>