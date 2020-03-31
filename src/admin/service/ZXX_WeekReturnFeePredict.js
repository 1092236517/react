import request from 'ADMIN_UTILS/httpRequest';

//  查询在离职名单
export const getQueryWorkStsList = param => request('/ZXX_WorkStsManager/QueryWorkStsList', param);

//  导出在离职名单
export const exportReturnFeePredictRecord = param => request('/ZXX_WorkStsManager/ExportWorkStsList', param);

//  生成在离职名单
export const runWorkStsList = param => request('/ZXX_WorkStsManager/RunWorkStsList', param);

 //  生成在离职名单结果
 export const getcalculatRes = param => request('/ZXX_WorkStsManager/RunWorkStsListResult', param);

