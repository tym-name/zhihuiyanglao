// 导入所需类型（从你的类型定义文件中引入）
import type {
  buildingListItem,
  CascaderTreeNode,
} from "../api/medicalcare/blood/bloodType";

/**
 * 筛选有效床位/楼栋扁平数据，避免脏数据导致树形结构异常
 * @param originalList 原始扁平列表
 * @returns 筛选后的有效扁平列表
 */
export const filterValidFlatItems = (
  originalList: buildingListItem[],
): buildingListItem[] => {
  if (!Array.isArray(originalList)) return []; // 增加容错：非数组返回空数组，避免报错

  const validIdSet = new Set(originalList.map((item) => item.id));

  return originalList.filter((item) => {
    const isIdValid = item.id > 0;
    const isCompanyIdValid = item.companyId === 1327;
    const isPidValid = item.pid === 0 || validIdSet.has(item.pid);

    return isIdValid && isCompanyIdValid && isPidValid;
  });
};

/**
 * 构建 id → 级联节点的映射表，提升父节点查找效率
 * @param validFlatItems 筛选后的有效扁平列表
 * @returns id 与 CascaderTreeNode 节点的 Map 映射表
 */
export const createItemMap = (
  validFlatItems: buildingListItem[],
): Map<number, CascaderTreeNode> => {
  const itemMap = new Map<number, CascaderTreeNode>();

  validFlatItems.forEach((item) => {
    const cascaderNode: CascaderTreeNode = {
      value: item.id,
      label: item.name,
    };
    itemMap.set(item.id, cascaderNode);
  });

  return itemMap;
};

/**
 * 核心：构建 ElCascader 支持的嵌套树形结构
 * @param validFlatItems 筛选后的有效扁平列表
 * @param itemMap id → 级联节点的映射表
 * @returns 最终可用的级联树形数据
 */
export const buildCascaderTree = (
  validFlatItems: buildingListItem[],
  itemMap: Map<number, CascaderTreeNode>,
): CascaderTreeNode[] => {
  const cascaderTree: CascaderTreeNode[] = [];

  validFlatItems.forEach((item) => {
    const currentNode = itemMap.get(item.id);
    if (!currentNode) return;

    const parentId = item.pid;
    if (parentId === 0) {
      cascaderTree.push(currentNode);
    } else {
      const parentNode = itemMap.get(parentId);
      if (parentNode) {
        if (!parentNode.children) {
          parentNode.children = [];
        }
        parentNode.children.push(currentNode);
      }
    }
  });

  return cascaderTree;
};

/**
 * 对外暴露的统一转换方法（一键调用，无需分步执行）
 * @param originalList 原始扁平列表（从接口获取的床位/楼栋数据）
 * @returns ElCascader 可直接绑定的树形选项数据
 */
export const convertFlatToCascaderTree = (
  originalList: buildingListItem[],
): CascaderTreeNode[] => {
  // 容错处理：空数据直接返回空数组
  if (!Array.isArray(originalList) || originalList.length === 0) return [];

  const validItems = filterValidFlatItems(originalList);
  const itemMap = createItemMap(validItems);
  return buildCascaderTree(validItems, itemMap);
};
