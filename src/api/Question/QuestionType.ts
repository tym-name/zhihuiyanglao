export interface QuestionData {
    page: number;
    pageSize: number;
}

export interface ConsultRecordItem {
    id: number;               // 记录ID
    companyId: number;        // 公司ID
    customerId: number;       // 客户ID
    type: string;             // 咨询类型（如：线上咨询）
    source: string;           // 来源（如：来访登记）
    name: string;             // 联系人姓名
    mobile: string;           // 联系电话
    relation: string;         // 与老人关系（如：父女关系）
    visitTime: string;        // 来访/咨询时间（格式：YYYY-MM-DD HH:mm:ss）
    content: string;          // 咨询内容
    addTime: string;          // 记录创建时间
    state: number;            // 回访状态（0=待回访，可根据业务扩展其他值）
    addAccountId: number;     // 创建人账号ID
    customerName: string;     // 老人姓名
    addAccountName: string;   // 创建人姓名
    stateName: string;        // 回访状态名称（如：待回访）
}

export interface ConsultRegisterParams {
  customerId: number;       // 客户/老人ID（关联老人信息的主键）
  customerName: string;     // 老人姓名
  type: string;             // 咨询类型（如：线上咨询、线下咨询）
  source: string;           // 咨询来源（如：来访登记、电话咨询）
  name: string;             // 联系人姓名
  mobile: string;           // 联系人手机号
  relation: string;         // 与老人的关系（如：父子关系、母女关系）
  visitTime: string;        // 咨询/来访时间（格式：YYYY-MM-DD HH:mm）
  content: string;          // 咨询内容
}

export interface ConsultRecord {
  id?: number;              // 咨询记录主键ID（新增时可选，编辑/详情时必传）
  customerId: number;       // 关联的老人/客户ID
  type: string;             // 咨询类型（如：线下咨询、线上咨询）
  source: string;           // 咨询来源（如：来访登记）
  name: string;             // 联系人姓名
  mobile: string;           // 联系人手机号
  relation: string;         // 与老人的关系（如：父子关系）
  visitTime: string;        // 咨询/来访时间（格式：YYYY-MM-DD HH:mm）
  content: string;          // 咨询内容
}