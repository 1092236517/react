import request from 'ADMIN_UTILS/httpRequest';

// 劳务打款数据审核
export const auditRemit = param => request('/ZXX_ReturnFee/Trgt_Pay_Audit', param);

// 劳务打款数据审核页面导出
export const expAudit = param => request('/ZXX_ReturnFee/Trgt_Pay_Export', param);

//  劳务打款数据审核页面查询
export const listAudit = param => request('/ZXX_ReturnFee/Trgt_Pay_Select', param);

// 劳务打款数据导入预览
export const impPreview = param => request('/ZXX_ReturnFee/Trgt_Pay_Import_Preview', param);

// 劳务打款数据导出预览
export const expPreview = param => request('/ZXX_ReturnFee/Trgt_Pay_Export_Preview', param);

// 劳务打款数据提交保存
export const geneRemitSave = param => request('/ZXX_ReturnFee/Trgt_Pay_Save', param);

// 返费明细修改
export const editDetail = param => request('/ZXX_ReturnFee/Detail_Update', param);

// 返费明细导出
export const expDetail = param => request('/ZXX_ReturnFee/Detail_Export', param);

// 返费明细查询
export const listDetail = param => request('/ZXX_ReturnFee/Detail_Select', param);

//  返费报表
export const listReport = param => request('/ZXX_ReturnFee/Summary_Select', param);

//  返费报表导出
export const expReport = param => request('/ZXX_ReturnFee/Summary_Export', param);
// 上传文件
export const saveFile = param => request('/ZXX_ReturnFeeBill/ZXX_ReturnFee_Enclosure_Update', param);