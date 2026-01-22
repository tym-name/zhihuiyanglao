export interface orderData {
    page: number;
    pageSize: number;
}

/**
 * 老人费用/入住信息主模型
 */
export interface ElderlyCostInfo {
    /** 老人ID */
    elderlyId: number;
    /** 床位ID */
    begId: number;
    /** 床位价格 */
    begPrice: number;
    /** 入住天数 */
    days: number;
    /** 开始日期 */
    startDate: string;
    /** 餐费 */
    foodPrice: number;
    /** 服务费 */
    servicePrice: number;
    /** 押金 */
    cashPledge: number;
    /** 床位费/居住费用 */
    livingPrice: number;
    /** 付款周期（天） */
    payDays: number;
    /** 状态（1-待确认/2-已确认/3-已结算 等，根据业务定义） */
    state: number;
    /** 服务项列表 */
    services: [{
        serviceId: number
    }];
    /** 文件附件列表 */
    files: [
        {
            file: string
        }
    ];
}
//修改
export interface ElderlyOrderInfo {
    /** 订单ID */
    id: number;
    /** 公司ID */
    companyId: number;
    /** 老人ID */
    elderlyId: number;
    /** 床位ID */
    begId: number;
    /** 床位名称（可为空） */
    begName: string | null;
    /** 床位价格 */
    begPrice: number;
    /** 入住天数 */
    days: number;
    /** 开始日期 */
    startDate: string;
    /** 餐费 */
    foodPrice: number;
    /** 服务费 */
    servicePrice: number;
    /** 押金 */
    cashPledge: number;
    /** 居住费用 */
    livingPrice: number;
    /** 付款周期（天） */
    payDays: number;
    /** 订单状态（0-初始/1-已确认/2-已结算 等，根据业务定义） */
    state: number;
    /** 订单添加时间 */
    addTime: string;
    /** 添加人账号ID */
    addAccountId: number;
    /** 添加人姓名（可为空） */
    addAccountName: string | null;
    /** 老人姓名（可为空） */
    elderlyName: string | null;
    /** 老人照片（可为空） */
    elderlyPhoto: string | null;
    /** 老人性别（可为空） */
    elderlyGender: number | string | null;
    /** 老人身份证号（可为空） */
    elderlyIdCard: string | null;
    /** 楼栋名称（可为空） */
    houseName: string | null;
    /** 楼宇名称（可为空） */
    buildingName: string | null;
    /** 订单关联的服务项列表 */
    services: [
        {
            id: number;
            orderId: number;
            serviceId: number;
            serviceName: string;
            serviceContent: string;
        }
    ];
    /** 订单关联的文件附件列表 */
    files: [
        {
            id: number;
            orderId: number;
            file: string
        }
    ];
}