<template>

    <el-cascader style="width: 100%;" v-model="cascaderVal" @change="(val: number[]) => cascaderChange(val)"
<<<<<<< HEAD
        :options="buildingList" />
=======
        :options="buildingLists" placeholder="请选择" />
>>>>>>> faba1291873781602f2deee1773d1a79a1b5e5a7
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue';
<<<<<<< HEAD
import { getBedsList, getBuildingList, getHouseList } from '../../api/building/building';
import { convertToTree, type GetBuildingListData } from '../../utils/convertToTree';
import { findCascadePath } from '../../utils/findCascadePath';
=======
import { buildingList } from '@/api/building/building';
import { findCascadePath } from '@/utils/findCascadePath';
import { convertToTree, type GetBuildingListData } from '@/utils/convertToTree';
import { housetypeList } from '@/api/houseType/house';
>>>>>>> faba1291873781602f2deee1773d1a79a1b5e5a7
const props = defineProps<{
    type?: string,
    id?: number | string
}>()

<<<<<<< HEAD
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
=======
let buildingLists = ref<any>([])
let cascaderVal = ref<(string | number)[]>([])

const optionsList={
    page: 1,
    pageSize:10
}
let getBuildingListApi = async () => {
    let res = await buildingList()
    let resHouse = await housetypeList(optionsList)
    // if (props.type != "bed") {
    //     let resBeds = await getBedsList()
    //     resBeds.data.list.forEach(item => {
    //         res.data.list.push(item as any)
    //     });
    // }

    resHouse.data.list.forEach(item => {
>>>>>>> faba1291873781602f2deee1773d1a79a1b5e5a7
        res.data.list.push(item as any)
    });


<<<<<<< HEAD
    buildingList.value = convertToTree(res.data.list as any)
=======
    buildingLists.value = convertToTree(res.data.list as any)
>>>>>>> faba1291873781602f2deee1773d1a79a1b5e5a7
    const transformBuildingData = (originalData: any[]): GetBuildingListData[] => {
        return originalData.map(item => ({
            label: item.name,
            value: item.id.toString(),
            children: item.children ? transformBuildingData(item.children) : undefined
        }));
    };
<<<<<<< HEAD
    buildingList.value = transformBuildingData(buildingList.value);
    if (props.id) {
        let path = findCascadePath(buildingList.value!, props.id.toString());
        cascaderVal.value = path
=======
    buildingLists.value = transformBuildingData(buildingLists.value);
    if (props.id) {
        let path = findCascadePath(buildingLists.value!, props.id.toString());
        console.log(path, '123');
        cascaderVal.value = path
        console.log(path.toString().split(','));
>>>>>>> faba1291873781602f2deee1773d1a79a1b5e5a7
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