export interface GetBuildingListData {
    label: string;
    value: string
    children?: GetBuildingListData[];
}
export interface FlatNode {
    id: number;
    name: string;
    pid: number;
    buildingId: number;
    houseId: number;
    children?: FlatNode[];
}
export function convertToTree(flatData: FlatNode[]): FlatNode[] {
    const map: { [key: number]: FlatNode } = {};
    const roots: FlatNode[] = [];

    // 将所有节点放入 map 中
    flatData?.forEach(node => {
        map[node.id] = { ...node, children: [] };
    });

    // 构建树状结构
    for (const node of flatData) {
        if (node.pid !== null && map[node.pid] || map[node.buildingId] || map[node.houseId]) {
            map[node.pid || node.buildingId || node.houseId].children!.push(map[node.id]);
        } else {
            roots.push(map[node.id]);
        }
    }

    return roots;
}