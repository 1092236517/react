import request from 'ADMIN_UTILS/httpRequest';

// 作废订单
export const orderInvalid = param => request('/ZXX_OrderManager/ZXX_DeleteOrderByIdList', param);

// 导出订单
export const importOrderList = param => request('/ZXX_OrderManager/ZXX_ExportOrderListToExcel', param);

// 新建订单
export const addOrder = param => request('/ZXX_OrderManager/ZXX_CreateNewOrder', param);
// 获取订单列表
export const getOrderList = param => request('/ZXX_OrderManager/ZXX_GetOrderList', param);

// 获取名单绑定订单的目标订单
export const getBindOrderList = param => request('/ZXX_OrderManager/ZXX_GetWaitToBindOrderList', param);

// 同步订单
export const SynchronousOrderList = param => request('/ZXX_OrderManager/ZXX_SynchronousOrderList', param);