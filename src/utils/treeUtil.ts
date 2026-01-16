// export interface FlatNode {
//     id: number;
//     pid: number | null;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     [key: string]: any; // 允许其他任意属性
//   }

import type { MenuItem } from "../api/index/indexType";

//   export interface TreeNode extends Omit<FlatNode, 'pid'> {
//     children: TreeNode[];
//   }
export  function flatToTree(flatData: MenuItem[]): MenuItem[] {
    // 1. 创建ID到节点的映射
    const nodeMap = new Map<number, MenuItem>();

    // 2. 初始化所有节点并添加children属性
    flatData.forEach(item => {
      nodeMap.set(item.id, {
        ...item,
        children: []
      });
    });

    // 3. 构建树形结构
    const tree: MenuItem[] = [];

    nodeMap.forEach(node => {
      if (node.pid === 0) {
        tree.push(node); // 根节点
      } else {
        const parent = nodeMap.get(node.pid);
        parent?.children.push(node); // 挂载到父节点
      }
    });

    return tree;
  }
