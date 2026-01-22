// types.ts（类型定义）
export interface GetBuildingList {
    label:string
    value:string
    children?:GetBuildingList[]
};
/**
 * 根据子节点ID查找完整级联路径
 * @param nodes 树形数据
 * @param targetId 目标子节点ID
 * @returns 路径数组（从根到子的ID数组）| null
 */
export const findCascadePath = (
    nodes: GetBuildingList[],
    targetId: string | number
): (string | number)[] | [] => {
    // 处理空值情况
    if (!nodes || nodes.length === 0) return []

    // 递归查找路径
    const findPath = (
        nodeList: GetBuildingList[],
        target: string | number,
        path: (string | number)[] = []
    ): (string | number)[] | [] => {
        for (const node of nodeList) {
            const currentPath = [...path, node.value]

            // 找到目标节点
            if (node.value === target) {
                return currentPath
            }

            // 递归查找子节点
            if (node.children?.length) {
                const found = findPath(node.children, target, currentPath)
                if (found) return found
            }
        }
        return []
    }

    return findPath(nodes, targetId)
}