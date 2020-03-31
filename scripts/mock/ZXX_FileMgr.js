module.exports = [{
    path: '/ZXX_FileMgr/ZXX_FileMgr_GetList',
    method: 'post',
    response: (req, res) => ({
        Data: {
            RecordCount: 4,
            'RecordList|4': [
                {
                    AuditRemark: '审核备注-@csentence(5,10)',
                    'AuditState|1': [1, 2, 3],
                    AuditTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
                    AuditUserName: '@cname',
                    BeginDate: '@datetime("yyyy-MM-dd")',
                    EndDate: '@datetime("yyyy-MM-dd")',
                    EnterName: '企业-@csentence(5,10)',
                    'EnterID|1': [5, 6, 7],
                    FileList1: [{
                        FileName: 'file1', OriginFileName: '文件1'
                    },{
                        FileName: 'file2', OriginFileName: '文件2'
                    }],
                    FileList2: [{
                        FileName: 'file3', OriginFileName: '文件3'
                    },{
                        FileName: 'file4', OriginFileName: '文件4'
                    }],                    
                    'FileType|1': [1, 2],
                    'LaborID|1': [10725, 10296, 18796],
                    LaborName: '劳务-@csentence(5,10)',
                    RecordID: '@increment',
                    Remark: '备注-@csentence(5,10)',
                    UploadTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
                    UploadUserName: '@cname'
                }
            ]
        },
        Code: 0,
        Desc: '成功'
    })
}]