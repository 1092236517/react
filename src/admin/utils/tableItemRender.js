import moment from 'moment';

//  录入类型:1批量导入，2手动补发
export const tableSrcRender = text => ({ 1: '批量导入', 2: '手动补发' }[text]);

//  在职状态:1在职,2离职,3转正,4未入职
export const tableWorkStateRender = text => ({ 1: '在职', 2: '离职', 3: '转正', 4: '未入职', 5: '未知', 6: '自离' }[text]);

//  月薪类型
export const tableMonthTypeRender = text => ({ 1: '工资', 2: '社保', 3: '补贴', 4: '公积金', 5: '其他', 6: '补发' }[text]);

//  周薪查询-审核状态
export const tableBillAuditRender = text => ({ 1: '待审核', 2: '通过', 3: '不通过' }[text]);
//  日期格式
export const tableDateRender = text => {
  if (!text) {
    return '';
  }
  let tempRes = moment(text);
  return tempRes.isValid() ? tempRes.format('YYYY-MM-DD') : '';
};

//  年-月-日 时-分
export const tableDateMinutesRender = text => (moment(text)._isValid ? moment(text).format('YYYY-MM-DD HH:mm') : '');

//  时间格式
export const tableDateTimeRender = text => {
  if (!text) {
    return '';
  }
  let tempRes = moment(text);
  return tempRes.isValid() ? tempRes.format('YYYY-MM-DD HH:mm:ss') : '';
};

//  日期-月-格式
export const tableDateMonthRender = text => {
  if (!text) {
    return '';
  }
  let tempRes = moment(text);
  return tempRes.isValid() ? tempRes.format('YYYY-MM') : '';
};

//  是否
export const tableYesNoRender = text => ({ 1: '是', 2: '否' }[text]);

//  分->元
export const tableMoneyRender = text => (!isNaN(text) && (Number(text) / 100).toFixed(2)) || 0;

//  打款类别
export const tableTradeType = text => ({ 1: '周薪', 2: '月薪', 3: '中介费', 4: '周薪重发', 5: '月薪重发', 6: '中介费重发' }[text]);

//  身份证审核状态
export const tableIdCardAuditStsRender = text => ({ 1: '未审核', 2: '通过', 3: '未通过' }[text]);

//  银行卡审核状态
export const tableBankCardAuditStsRender = text => ({ 1: '未审核', 2: '通过', 3: '未通过' }[text]);

//  工牌审核状态
export const tableWorkCardAuditStsRender = text => ({ 1: '未审核', 2: '通过', 3: '未通过' }[text]);

//  银行卡接口调用状态
export const tableBank3keyCheckResultRender = text => ({ 1: '未调用', 2: '调用成功', 3: '调用失败' }[text]);

//  银行卡是否删除
export const tableIsUserDeleteRender = text => ({ 1: '否', 2: '是' }[text]);

//  1.0 2.0模式
export const settleTypeRender = text => ({ 0: '', 1: 'ZX', 2: 'Z', 3: 'ZA', 4: 'Z-B', 5: 'ZX-B', 6: 'ZX-A' }[text]);

//  是否已发劳务
export const sendLaborStsRender = text => ({ 1: '未发', 2: '已发' }[text]);
//  是否禁用
export const disableOpt = text => ({ 1: '否', 2: '是' }[text]);
//  是否禁用
export const WorkStsStatus = text => ({ 1: '在职', 2: '离职', 3: '转正', 4: '未处理', 5: '未知', 6: '自离' }[text]);
//  返费预测表补贴类型
export const hasReturnFeeRender = text => ({ 1: '劳务返费', 2: '平台返费' }[text]);
//  返费预测表结算模式
export const settlementTypRender = text =>
  ({ 1: 'ZX结算方式', 2: 'Z结算方式', 3: 'ZA结算方式', 4: 'Z-B结算方式', 5: 'X-B结算方式', 6: 'ZX-A结算方式' }[text]);
//  返费预测表性别
export const feeTypRender = text => ({ 0: '未知', 1: '男', 2: '女' }[text]);
//  返费预测表申请状态
export const applyStsRender = text => ({ 1: '未申请', 2: '已申请' }[text]);
//  返费预测表审核状态
export const tuditStsRender = text => ({ 0: '无账单数据', 1: '未审核', 2: '审核通过', 3: '审核不通过', 4: '等待' }[text]);
//  返费预测表打款状态
export const transferResultRender = text => ({ 0: '无账单数据', 1: '未打款', 2: '已打款', 3: '拒绝打款' }[text]);
//  zx盈利分析明细模式转换
export const modelTransform = text => ({ 1: 'ZX模式', 5: 'ZX-B模式', 6: 'ZX-A模式' }[text]);
//  zx盈利分析汇总二次入职
export const isSecondEntry = text => ({ 1: '否', 2: '是' }[text]);
//  数字乘法运算
export const accMul = (arg1, arg2) => {
  let m = 0;
  let s1 = arg1.toString();
  let s2 = arg2.toString();
  try {
    m += s1.split('.')[1].length;
  } catch (e) {}
  try {
    m += s2.split('.')[1].length;
  } catch (e) {}
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m);
};

//  身份证加密
export const idCardEncryption = text => (text ? text.toString().replace(/(\d{12})(\d{6})/, '$1******') : '');
//  月薪发放方
export const monthSalaryPayer = text => ({ 1: '周薪薪', 2: '劳务' }[text]);
