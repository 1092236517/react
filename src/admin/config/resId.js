export default {
  applyList: {
    add: 'applyList-add', // 发薪申请---新增
    modify: 'applyList-modify', // 发薪申请---修改
    delete: 'applyList-delete', // 发薪申请---删除
    submitAudit: 'applyList-submitAudit' // 发薪申请---提交授权
  },
  authorizationList: {
    confirm: 'authorizationList-confirm' // 授权---确认授权
  },
  reAuthorizationList: {
    confirm: 'reAuthorizationList-confirm', // 重发授权---确认授权
    reauthorization: 'reAuthorizationList-reauthorization' // 重发授权---可选择授权多个明细按钮
  },
  entryAndExitList: {
    apply: 'entryAndExitList-apply', // 出入金---申请
    examined: 'entryAndExitList-examined', // 出入金---审核
    check: 'entryAndExitList-check', // 出入金---查看
    split: 'entryAndExitList-split', // 出入金---拆分
    requestRedRush: 'entryAndExitList-requestRedRush'
  },
  entryAndExitDetailList: {
    exportX: 'entryAndExitDetai-export' // 导入导出详情 --导出按钮
  },
  labourAccountList: {
    export: 'labourAccountList-export', // 劳务账户---劳务列表  导出按钮
    exportDetail: 'labourAccountList-exportDetail' // 劳务账户---劳务明细列表  导出按钮
  },
  agencyAccountList: {
    export: 'agencyAccountList-export', // 中介账户---中介列表  导出按钮
    exportDetail: 'agencyAccountList-exportDetail' // 中介账户---中介明细列表  导出按钮
  },
  dunningList: {
    export: 'dunningList-export' // 劳务催账单---导出
  },
  weeklyWageManager: {
    import: {
      importPreviewX: 'weeklyWageManager-import-importPreviewX', //   导入周薪-导入预览
      generateBatchX: 'weeklyWageManager-import-generateBatchX', //   导入周薪-提交保存
      resetTableInfoX: 'weeklyWageManager-import-resetTableInfoX', //  导入周薪-取消导入
      exportPreviewX: 'weeklyWageManager-import-exportPreviewX' //    导入周薪-导出预览结果
    },
    importRecord: {
      exportX: 'weeklyWageManager-importRecord-exportX' // 导入周薪记录-导出
    },
    list: {
      exportX: 'weeklyWageManager-list-exportX', // 周薪查询-导出
      exportSPAmountX: 'weeklyWageManager-list-exportSPAmountX' // 周薪查询-导出中介平台费
    },
    bill: {
      exportX: 'weeklyWageManager-bill-exportX', //    周薪账单-导出
      confirmX: 'weeklyWageManager-bill-confirmX', //    周薪账单-账单审核
      seeDetailX: 'weeklyWageManager-bill-seeDetailX', //    周薪账单-账单详情
      exportDetailX: 'weeklyWageManager-bill-exportDetailX', //    周薪账单-导出单个账单的内容
      cancel: 'weeklyWageManager-bill-cancel' // 周薪账单-作废未审核的周薪账单
    },
    billDetail: {
      exportX: 'weeklyWageManager-billDetail-exportX' //    周薪账单详情进入-导出
    },
    reissue: {
      generateTableX: 'weeklyWageManager-reissue-generateTableX', //    补发周薪-生成表格
      addTableDataX: 'weeklyWageManager-reissue-addTableDataX', //    补发周薪-添加
      resetOldTableX: 'weeklyWageManager-reissue-resetOldTableX', //    补发周薪-删除表格
      commitDataX: 'weeklyWageManager-reissue-commitDataX', //    补发周薪-提交
      editTableDataX: 'weeklyWageManager-reissue-editTableDataX', //    补发周薪-修改
      deleteTableDataX: 'weeklyWageManager-reissue-deleteTableDataX' //    补发周薪-删除
    },
    leak: {
      exportX: 'weeklyWageManager-leak-exportX', //  周薪查漏导出
      operDataX: 'weeklyWageManager-leak-operDataX' //  周薪查漏-批量处理
    },
    noWeekBillLeak: {
      exportX: 'weeklyWageManager-leak-exportX', //  不发薪.周薪查漏导出
      operDataX: 'weeklyWageManager-leak-operDataX' //  不发薪.周薪查漏-批量处理
    },
    departurePredict: {
      exportX: 'weeklyWageManager-predict-exportX', //  导出在离职名单
      queryData: 'weeklyWageManager-predict-queryData', //  查询
      calculate: 'weeklyWageManager-predict-calculate' //  计算
    }
  },
  monthlyWageManager: {
    import: {
      importPreviewX: 'monthlyWageManager-import-importPreviewX', //   导入月薪-导入预览
      generateBatchX: 'monthlyWageManager-import-generateBatchX', //   导入月薪-提交保存
      resetTableInfoX: 'monthlyWageManager-import-resetTableInfoX', //   导入月薪-取消导入
      exportPreviewX: 'monthlyWageManager-import-exportPreviewX' //    导入周薪-导出预览结果
    },
    importRecord: {
      exportX: 'monthlyWageManager-importRecord-exportX' //   导入月薪记录-导出
    },
    list: {
      exportX: 'monthlyWageManager-list-exportX', //   月薪查询-导出
      exportSPAmoutX: 'monthlyWageManager-list-exportSPAmoutX' //   月薪查询-导出平台费
    },
    bill: {
      exportX: 'monthlyWageManager-bill-exportX', //   月薪账单-导出
      confirmX: 'monthlyWageManager-bill-confirmX', //   月薪账单-账单审核
      seeDetailX: 'monthlyWageManager-bill-seeDetailX', //   月薪账单-账单详情
      exportDetailX: 'monthlyWageManager-bill-exportDetailX', //    月薪账单-导出单个账单的内容
      cancel: 'monthlyWageManager-bill-cancel' // 月薪账单-作废未审核的周薪账单
    },
    billDetail: {
      exportX: 'monthlyWageManager-billDetail-exportX' //    月薪账单详情进入-导出
    },
    reissue: {
      generateTableX: 'monthlyWageManager-reissue-generateTableX', //    补发月薪-生成表格
      addTableDataX: 'monthlyWageManager-reissue-addTableDataX', //    补发月薪-添加
      resetOldTableX: 'monthlyWageManager-reissue-resetOldTableX', //    补发月薪-删除表格
      commitDataX: 'monthlyWageManager-reissue-commitDataX', //    补发月薪-提交
      editTableDataX: 'monthlyWageManager-reissue-editTableDataX', //    补发月薪-修改
      deleteTableDataX: 'monthlyWageManager-reissue-deleteTableDataX', //    补发月薪-删除
      impPreviewX: 'monthlyWageManager-reissue-impPreviewX', //    补发月薪-导入预览
      expPreviewX: 'monthlyWageManager-reissue-expPreviewX' //    补发月薪-导出预览
    },
    leak: {
      operDataX: 'monthlyWageManager-leak-operDataX', //  月薪查漏-批量处理
      exportX: 'monthlyWageManager-leak-exportX' //  月薪查漏导出
    },
    missInfo: {
      exportX: 'monthlyWageManager-missInfo-exportX' //  应发未发列表-导出
    }
  },
  withdrawManager: {
    back: {
      withDrawRePayX: 'withdrawManager-back-withDrawRePayX', //    退回列表-申请重发
      destroyBankBackX: 'withdrawManager-back-destroyBankBackX', //    退回列表-作废
      exportX: 'withdrawManager-back-exportX' //    退回列表-导出
    },
    pay: {
      withDrawPayX: 'withdrawManager-pay-withDrawPayX', //    发薪-打款
      exportX: 'withdrawManager-pay-exportX', //    发薪-导出,
      setMoneyFailX: 'withdrawManager-pay-setMoneyFailX' //    发薪-到账失败,
    }
  },
  bankCardList: {
    // 银行卡
    export: 'bankCardList-Export', // 导出
    audit: 'bankCardList-Audit', // 审核
    auditIdCard: 'bankCardList-AuditIdCard', // 审核身份证
    modifyAuth: 'bankCardList-ModifyAuth', // 修改银行卡信息的权限
    refresh: 'bankCardList-Refresh' // 刷新
  },
  idCardList: {
    // 身份证
    export: 'idCardList-Export', // 导出
    audit: 'idCardList-Audit', // 审核
    refresh: 'idCardList-Refresh' // 刷新
  },
  workCardList: {
    // 工牌
    export: 'workCardList-Export', // 导出
    audit: 'workCardList-Audit', // 审核
    modifyWorkAuth: 'workCardList-modifyWorkAuth' // 修改工牌
  },
  baseCompanyList: {
    // 基础数据企业
    sync: 'baseCompanyList-sync', // 同步
    edit: 'baseCompanyList-edit', // 编辑
    payTypeEdit: 'baseCompanyList-payTypeEdit'
  },
  baseLabarList: {
    // 基础数据劳务
    sync: 'baseLabarList-sync', // 同步
    edit: 'baseLabarList-edit' // 编辑
  },
  baseAgentList: {
    // 基础数据中介
    sync: 'baseAgentList-sync', // 同步
    edit: 'baseAgentList-edit' // 编辑
  },
  nameList: {
    // 名单页面
    sync: 'nameList-sync', // 同步名单
    syncOrder: 'nameList-syncOrder', // 同步订单
    bing: 'nameList-bing', // 绑定订单
    cancel: 'nameList-cancel', // 作废名单
    export: 'nameList-export', // 导出
    details: 'nameList-details', // 详情
    recovery: 'nameList-recovery' // 作废名单
  },
  orderList: {
    // 订单页面
    syncOrder: 'orderList-syncOrder', // 同步订单
    batchSyncOrder: 'orderList-batchSyncOrder', // 同步订单
    add: 'orderList-add', // 新增
    cancel: 'orderList-cancel', // 作废订单
    export: 'orderList-export', // 导出
    details: 'orderList-details' // 详情
  },
  clockInList: {
    // 打卡记录管理
    export: 'clockInList-export', // 导出
    fillClock: 'clockInList-fillClock', // 补卡
    reissueClock: 'clockInList-reissueClock', // 补卡，新
    details: 'clockInList-details', // 详情
    setMaxReissueCount: 'clockInList-setMaxReissueCount' // 次数限制
  },
  basicData: {
    bankPayAccount: {
      disableAccountX: 'basicData-bankPayAccount-disableAccountX', // 银行付款账号管理-停用
      enableAccountX: 'basicData-bankPayAccount-enableAccountX', //   银行付款账号管理-启用
      addAccountX: 'basicData-bankPayAccount-addAccountX', // 银行付款账号管理-新增
      editAccountX: 'basicData-bankPayAccount-editAccountX' // 银行付款账号管理-修改
    },
    memberPayAccount: {
      addAccountX: 'basicData-memberPayAccount-addAccountX', //  会员打款虚拟子账户-新增
      editAccountX: 'basicData-memberPayAccount-editAccountX', //  会员打款虚拟子账户-修改
      exportX: 'basicData-memberPayAccount-exportX' //  会员打款虚拟子账户-导出
    },
    agentPayAccount: {
      addAccountX: 'basicData-agentPayAccount-addAccountX', //  中介打款虚拟子账户-新增
      editAccountX: 'basicData-agentPayAccount-editAccountX' //  中介打款虚拟子账户-修改
    },
    laborEntMap: {
      addX: 'basicData-laborEntMap-addX'
    },
    laborDepoMap: {
      addX: 'basicData-laborDepoMap-addX',
      editX: 'basicData-laborDepoMap-editX',
      deleteX: 'basicData-laborDepoMap-deleteX'
    },
    invoice: {
      addX: 'basicData-invoice-addX',
      auditPassX: 'basicData-invoice-auditPassX',
      auditNotPassX: 'basicData-invoice-auditNotPassX',
      editX: 'basicData-invoice-editX',
      historyX: 'basicData-invoice-historyX',
      exportRecordX: 'basicData-invoice-export'
    }
  },
  clockInManager: {
    clockStatistic: {
      exportX: 'clockInManager-clockStatistic-exportX'
    }
  },
  settleMgr: {
    configX: {
      addConfigX: 'settleMgr-configX-addConfigX', //  X项配置-新增
      auditPassX: 'settleMgr-configX-auditPassX', //  X项配置-审核通过
      auditNotPassX: 'settleMgr-configX-auditNotPassX', //  X项配置-审核不通过
      editX: 'settleMgr-configX-editX' //  X项配置-修改
    },
    xCount: {
      exportX: 'settleMgr-xCount-exportX', // X汇总表-导出
      auditPassX: 'settleMgr-xCount-auditPass', // X汇总表-审核通过
      auditNotPassX: 'settleMgr-xCount-auditNotPass', // X汇总表-审核不通过
      modifyX: 'settleMgr-xCount-modifyX' // X汇总表-修改最终X
    },
    settleCount: {
      exportX: 'settleMgr-settleCount-exportX', // ZX结算汇总-导出
      moreHandle: 'settleMgr-settleCount-moreHandle' // ZX结算汇总-批量处理
    },
    leakOutX: {
      export: 'settleMgr-leakOutX-export', // X查漏X项-导出
      modifyLack: 'settleMgr-leakOutX-modifyLack' // X查漏X项-缺
    },
    leakOutPerson: {
      export: 'settleMgr-leakOutPerson-export', // X查漏个人-导出
      exportAllX: 'settleMgr-leakOutPerson-exportAllX'
    },
    memberImpDetail: {
      export: 'settleMgr-memberImpDetail-export', // 筛选会员费用明细-导出
      import: 'settleMgr-memberImpDetail-import' // 导入预览
    },
    configAgentA: {
      addConfigX: 'settleMgr-configAgentA-addConfigX', //  A的中介费配置-新增
      auditPassX: 'settleMgr-configAgentA-auditPassX', //  A的中介费配置-审核通过
      auditNotPassX: 'settleMgr-configAgentA-auditNotPassX', //  A的中介费配置-审核不通过
      editX: 'settleMgr-configAgentA-editX' //  A的中介费配置-修改
    },
    importXList: {
      exportX: 'settleMgr-importXList-exportX', //    导入X查询/审核-导出
      auditPassX: 'settleMgr-importXList-auditPassX', //  导入X查询/审核-审核通过
      auditNotPassX: 'settleMgr-importXList-auditNotPassX', //  导入X查询/审核-审核不通过
      delX: 'settleMgr-importXList-delX' //  导入X查询/审核-删除
    },
    settleDetail: {
      exportX: 'settleMgr-settleDetail-exportX' //  ZX结算明细-导出
    }
  },
  bAccountManager: {
    profit: {
      closeFinanceX: 'bAccountManager-profit-closeFinanceX',
      openFinanceX: 'bAccountManager-profit-openFinanceX',
      exportX: 'bAccountManager-profit-exportX',
      exportBillX: 'bAccountManager-profit-exportBillX'
    },
    profitForX: {
      closeFinanceX: 'bAccountManager-profitForX-closeFinanceX',
      openFinanceX: 'bAccountManager-profitForX-openFinanceX'
    },
    profitKeep: {
      setIsSettle: 'bAccountManager-profitKeep-setIsSettle'
    },
    laborDepo: {
      exportX: 'bAccountManager-laborDepo-exportX',
      refreshX: 'bAccountManager-laborDepo-refreshX'
    }
  },
  fileMgr: {
    list: {
      auditPassX: 'fileMgr-list-auditPassX',
      auditNotPassX: 'fileMgr-list-auditNotPassX'
    },
    add: {}
  },
  returnFee: {
    detail: {
      exportX: 'returnFee-detail-exportX', // 返费明细-导出
      hasSendLaborX: 'returnFee-detail-hasSendLaborX', // 返费明细-已发劳务
      notSendLaborX: 'returnFee-detail-notSendLaborX' // 返费明细-未发劳务
    },
    remitAudit: {
      auditPassX: 'returnFee-remitAudit-auditPassX', //   劳务打款数据审核-审核通过
      auditNotPassX: 'returnFee-remitAudit-auditNotPassX', //   劳务打款数据审核-审核不通过
      exportX: 'returnFee-remitAudit-exportX' //   劳务打款数据审核-导出
    },
    remitImp: {
      impPreviewX: 'returnFee-remitImp-impPreviewX', //   劳务打款数据导入-导入预览
      expPreviewX: 'returnFee-remitImp-expPreviewX', //   劳务打款数据导入-导储预览
      generateBatchX: 'returnFee-remitImp-generateBatchX', //   劳务打款数据导入-提交保存
      resetTableInfoX: 'returnFee-remitImp-resetTableInfoX' //   劳务打款数据导入-取消导入
    },
    report: {
      exportX: 'returnFee-report-exportX' //   返费报表-导出
    },
    bill: {
      exportX: 'returnFee-bill-exportX',
      auditPassX: 'returnFee-bill-auditPassX',
      auditNotPassX: 'returnFee-bill-auditNotPassX',
      hasSendLaborX: 'returnFee-bill-hasSendLaborX',
      refusePayX: 'returnFee-bill-refusePayX',
      successPayX: 'returnFee-bill-successPayX',
      waitX: 'returnFee-bill-waitX',
      unAuditX: 'returnFee-bill-unAuditX'
    },
    labourBill: {
      exportX: 'returnFee-labourBill-exportX',
      auditPassX: 'returnFee-labourBill-auditPassX',
      auditNotPassX: 'returnFee-labourBill-auditNotPassX',
      hasSendLaborX: 'returnFee-labourBill-hasSendLaborX',
      refusePayX: 'returnFee-labourBill-refusePayX',
      successPayX: 'returnFee-labourBill-successPayX',
      waitX: 'returnFee-labourBill-waitX',
      unAuditX: 'returnFee-labourBill-unAuditX'
    },
    memberApply: {
      auditPassX: 'returnFee-memberApply-auditPassX',
      destroyX: 'returnFee-memberApply-destroyX',
      waitAuditX: 'returnFee-memberApply-waitAuditX',
      exportX: 'returnFee-memberApply-exportX',
      taxModefiy: 'returnFee-memberApply-tax'
    },
    returnApplication: {
      generateBatchX: 'returnFee-returnApplication-generateBatchX'
    }
  },
  weekReturnFee: {
    list: {
      exportX: 'weekReturnFee-list-exportX'
    },
    bill: {
      exportX: 'weekReturnFee-bill-exportX',
      destroyX: 'weekReturnFee-bill-destroyX',
      auditX: 'weekReturnFee-bill-auditX',
      seeDetailX: 'weekReturnFee-bill-seeDetailX',
      exportDetailX: 'weekReturnFee-bill-exportDetailX'
    },
    apply: {
      auditPassX: 'weekReturnFee-apply-auditPassX',
      destroyX: 'weekReturnFee-apply-destroyX',
      waitAuditX: 'weekReturnFee-apply-waitAuditX',
      taxHasSend: 'weekReturnFee-apply-taxHasSend'
    },
    imp: {
      impPreviewX: 'weekReturnFee-imp-impPreviewX',
      expPreviewX: 'weekReturnFee-imp-expPreviewX',
      geneBatchX: 'weekReturnFee-imp-geneBatchX',
      resetTableX: 'weekReturnFee-imp-resetTableX'
    },
    reissue: {
      canReissueX: 'weekReturnFee-reissue-canReissueX'
    }
  },
  riskFund: {
    list: {
      exportX: 'riskFund-list-exportX'
    }
  },
  approvedBillVoided: {
    deleteBill: {
      deleteX: 'approvedBillVoided-deleteBill-deleteX'
    }
  },
  chatAnalysis: {
    list: {
      exportX: 'chatAnalysis-list-exportX'
    }
  },
  carManager: {
    payManager: {
      exportX: 'carManager-payManager-exportX'
    }
  },
  rebateForecastReport: {
    exportX: 'rebateForecast-report-exportX'
  },
  dataBoard: {
    priceDifferenceSubsidy: {
      exportX: 'basicData-priceDifferenceSubsidy-exportX'
    }
  }
};
