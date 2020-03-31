module.exports = [
	{
		// 导出身份证信息列表
		path: '/ZXX_Audit/ZXX_IDCardInfoListExport',
		method: 'post',
		response: (req, res) => ({
			Data: {
				"FileUrl": "http://fileUrl"
			},
			Code: 0,
			Desc: '成功'
		})
	},
	{
		// 查询工牌信息列表
		path: '/ZXX_Audit/ZXX_QueryIDCardInfoList',
		method: 'post',
		response: (req, res) => ({
			Data: {
				"RecordCount": 4,
				"RecordList|30": [
					{
						"AuditBy": "AuditBy",
						"AuditRemark": "AuditRemark",
						"AuditSts": 1,
						"AuditTm": '@datetime("yyyy-MM-dd hh:mm:ss")',
						"IdCardNum": "IdCardNum",
						"IdcardFrontUrl": "IdcardFrontUrl",
						"Mobile": "Mobile",
						"Realname": "行行行",
						"RegTime": '@datetime("yyyy-MM-dd hh:mm:ss")',
						"UserId": '@increment(1)'
					}
				]
			},
			Code: 0,
			Desc: '成功'
		})
	},
	{
		// 获取下一张身份证图片
		path: '/ZXX_Audit/ZXX_GetNextIDCardPic',
		method: 'post',
		response: (req, res) => ({
			Data: {
				"IdcardFrontUrl": "http://fileUrl"
			},
			Code: 0,
			Desc: '成功'
		})
	},
	{
		// 身份证信息审核
		path: '/ZXX_Audit/ZXX_AuditIDCard',
		method: 'post',
		response: (req, res) => ({
			Data: {
			},
			Code: 0,
			Desc: '成功'
		})
	},
	{
		// 查询银行卡信息列表
		path: '/ZXX_Audit/ZXX_QueryBankCardInfoList',
		method: 'post',
		response: (req, res) => ({
			Data: {
				"RecordCount": 100,
				"RecordList|30": [
					{
						"AreaName": "AreaName",
						"AuditBy": "AuditBy",
						"AuditSts": 2,
						"AuditTm": '@datetime("yyyy-MM-dd hh:mm:ss")',
						"AuidtRemark": "AuidtRemark",
						"IdcardFrontUrl": "IdcardFrontUrl",
						"Bank3keyAvlSts": 1,
						"Bank3keyCheckRemark": "Bank3keyCheckRemark",
						"Bank3keyCheckResult": 1,
						"Bank3keyRemark": "Bank3keyRemark",
						"BankCardNum": "BankCardNum",
						"BankCardUrl": "BankCardUrl",
						"BankName": "BankName",
						"CityName": "CityName",
						"DeleteReason": "DeleteReason",
						"IdCardNum": "IdCardNum",
						"IsUserDelete": 1,
						"Mobile": "Mobile",
						"ProvinceName": "ProvinceName",
						"Realname": "Realname",
						"UploadTime": '@datetime("yyyy-MM-dd hh:mm:ss")',
						"UserId": '@increment(1)'
					}
				]
			},
			Code: 0,
			Desc: '成功'
		})
	},
	{
		// 查询工牌信息列表
		path: '/ZXX_Audit/ZXX_QueryWorkCardInfoList',
		method: 'post',
		response: (req, res) => ({
			Data: {
				"RecordCount": 100,
				"RecordList|30": [
					{
						"AuditBy": "AuditBy",
						"AuditRemark": "AuditRemark",
						"AuditSts": 1,
						"AuditTm": '@datetime("yyyy-MM-dd hh:mm:ss")',
						"EntShortName": "EntShortName",
						"IdCardNum": "IdCardNum",
						"Mobile": "Mobile",
						"Realname": "Realname",
						"UploadTime": "UploadTime",
						"WorkCardNo": "WorkCardNo",
						"WorkCardUrl": "WorkCardUrl",
						"UserId": '@increment(1)'
					}
				]
			},
			Code: 0,
			Desc: '成功'
		})
	}
];
