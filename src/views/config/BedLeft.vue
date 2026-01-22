<template>
    <el-card>
        <div class="card-title">房间列表</div>
        <el-form :model="form" label-width="auto" style="margin-top: 20px;">
            <el-form-item>
                <el-input placeholder="请输入房间名称" clearable v-model="form.name" />
            </el-form-item>
            <el-form-item>
                <el-tree style="width: 100%;" @node-click="handleNodeClick" ref="treeRef" :data="buildingLists"
                    :filter-node-method="filterNode" :props="cascaderProps" />
            </el-form-item>
        </el-form>

    </el-card>

</template>

<script setup lang='ts'>
import { buildingList } from '@/api/building/building';
import { convertToTree, type GetBuildingListData } from '@/utils/convertToTree';
import type { FilterNodeMethodFunction } from 'element-plus'
import { inject, onMounted, reactive, ref, watch } from 'vue';
interface Tree {
    [key: string]: any
}

const cascaderProps = {
    value: 'value',
    label: 'label',
    children: 'children'
}

const form = reactive({
    name: '',
})

const treeRef = ref()
watch(() => form.name, () => {
    treeRef.value!.filter(form.name)
}, { deep: true })
const filterNode: FilterNodeMethodFunction = (value: string, data: Tree) => {
    if (!value) return true
    return data.label.includes(value)
}
const listParams = ref(inject<any>('listParams'))
const DialogData = ref(inject<any>('DialogData'))
const handleNodeClick = (data: Tree) => {
    // 仅点击最后一级节点（无子节点）时触发

    if (listParams.value && data.children.length == 0 && DialogData.value) {
        listParams.value.houseId = Number(data.value)
        DialogData.value.houseName = String(data.label)
        DialogData.value.houseId = Number(data.value)
    }

}

let buildingLists = ref<any>([])

let getBuildingListApi = async () => {
    let res = await buildingList()

    buildingLists.value = convertToTree(res.data.list as any)
    const transformBuildingData = (originalData: any[]): GetBuildingListData[] => {
        return originalData.map(item => ({
            label: item.name,
            value: item.id.toString(),
            children: item.children ? transformBuildingData(item.children) : undefined
        }));
    };
    buildingLists.value = transformBuildingData(buildingLists.value);

}

onMounted(() => {
    getBuildingListApi()
})
</script>

<style scoped lang='less'></style>