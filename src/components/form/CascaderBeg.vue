<template>

    <el-cascader style="width: 100%;" v-model="cascaderVal" @change="(val: number[]) => cascaderChange(val)"
        :options="buildingList" />
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue';
import { getBedsList, getBuildingList, getHouseList } from '../../api/building/building';
import { convertToTree, type GetBuildingListData } from '../../utils/convertToTree';
import { findCascadePath } from '../../utils/findCascadePath';
const props = defineProps<{
    type?: string,
    id?: number | string
}>()

let buildingList = ref<any>([])
let cascaderVal = ref<(string | number)[]>([])
let getBuildingListApi = async () => {
    let res = await getBuildingList()
    let resHouse = await getHouseList()
    if (props.type != "bed") {
        let resBeds = await getBedsList()
        resBeds.data.list.forEach((item: any) => {
            res.data.list.push(item as any)
        });
    }

    resHouse.data.list.forEach((item: any) => {
        res.data.list.push(item as any)
    });


    buildingList.value = convertToTree(res.data.list as any)
    const transformBuildingData = (originalData: any[]): GetBuildingListData[] => {
        return originalData.map(item => ({
            label: item.name,
            value: item.id.toString(),
            children: item.children ? transformBuildingData(item.children) : undefined
        }));
    };
    buildingList.value = transformBuildingData(buildingList.value);
    if (props.id) {
        let path = findCascadePath(buildingList.value!, props.id.toString());
        cascaderVal.value = path
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