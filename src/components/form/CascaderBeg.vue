houselist<template>
    <div>
        <el-cascader style="width: 100%;" v-model="cascaderVal" @change="cascaderChange" :options="buildingList"
            placeholder="请选择" :loading="loading" />
    </div>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue';
import { getBuildingList } from '../../api/medicalcare/blood/blood';
import { convertToTree, type GetBuildingListData } from '../../utils/convertToTree';
import { findCascadePath } from '../../utils/findCascadePath';
import { houselist } from '@/api/house/house';
import { bedsList } from '@/api/bed/bed';

const props = defineProps<{
    type?: string,
    id?: number | string
}>()

const emit = defineEmits(['bedChange'])

let buildingList = ref<GetBuildingListData[]>([])
let cascaderVal = ref<(string | number)[]>([])
let loading = ref(false)

let getBuildingListApi = async () => {
    loading.value = true;
    try {
        // 并行获取数据，提高性能
        const [resBuilding, resHouse, resBeds] = await Promise.all([
            getBuildingList(),
            houselist(),
            props.type !== "bed" ? bedsList() : Promise.resolve({ data: { list: [] } })
        ]);

        // 合并数据
        const allData = [...resBuilding.data.list];

        // 添加房屋数据
        resHouse.data.list.forEach((item: any) => {
            allData.push(item as any);
        });

        // 如果需要，添加床位数据
        if (props.type !== "bed") {
            resBeds.data.list.forEach((item: any) => {
                allData.push(item as any);
            });
        }

        // 转换数据结构
        const treeData = convertToTree(allData as any);
        const transformBuildingData = (originalData: any[]): GetBuildingListData[] => {
            return originalData.map(item => ({
                label: item.name,
                value: item.id.toString(),
                children: item.children ? transformBuildingData(item.children) : undefined
            }));
        };

        buildingList.value = transformBuildingData(treeData);

        // 根据 id 设置级联值
        if (props.id) {
            let path = findCascadePath(buildingList.value, props.id.toString());
            cascaderVal.value = path;
        }
    } catch (error) {
        console.error('获取数据失败:', error);
        // 错误处理，显示错误提示
    } finally {
        loading.value = false;
    }
}

let cascaderChange = (val: (string | number)[]) => {
    console.log('级联选择值:', val);
    emit('bedChange', val);
}

onMounted(() => {
    getBuildingListApi();
});
</script>

<style scoped lang='less'>
/* 可以添加一些样式 */
</style>