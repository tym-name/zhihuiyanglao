<template>

    <el-cascader style="width: 100%;" v-model="cascaderVal" @change="(val: number[]) => cascaderChange(val)"
        :options="buildingLists" placeholder="请选择" />
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue';
import { buildingList } from '@/api/building/building';
import { findCascadePath } from '@/utils/findCascadePath';
import { convertToTree, type GetBuildingListData } from '@/utils/convertToTree';
import { housetypeList } from '@/api/houseType/house';
const props = defineProps<{
    type?: string,
    id?: number | string
}>()

let buildingLists = ref<any>([])
let cascaderVal = ref<(string | number)[]>([])

const optionsList={
    page: 1,
    pageSize:10
}
let getBuildingListApi = async () => {
    let res = await buildingList()
    let resHouse = await housetypeList(optionsList)

    resHouse.data.list.forEach(item => {
        res.data.list.push(item as any)
    });


    buildingLists.value = convertToTree(res.data.list as any)
    const transformBuildingData = (originalData: any[]): GetBuildingListData[] => {
        return originalData.map(item => ({
            label: item.name,
            value: item.id.toString(),
            children: item.children ? transformBuildingData(item.children) : undefined
        }));
    };
    buildingLists.value = transformBuildingData(buildingLists.value);
    if (props.id) {
        let path = findCascadePath(buildingLists.value!, props.id.toString());
        console.log(path, '123');
        cascaderVal.value = path
        console.log(path.toString().split(','));
    }

}


let emit = defineEmits(['bedChange'])
let cascaderChange = (val: number[]) => {
    console.log(val);

    emit('bedChange', val)
}

onMounted(() => {
    getBuildingListApi()

})
</script>

<style scoped lang='less'></style>