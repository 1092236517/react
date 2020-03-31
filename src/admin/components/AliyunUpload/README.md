 
     <AliyunUpload  id='yourID'   // id可以随便填写，会在 uploadChange的回调参数中用到
                    accept="image/jpeg,image/png" // 可以上传的文件类型
                    oss={uploadRule.yourRule} // 阿里云的上传规则，本质上为一个obj
                    listType="picture-card"  // 上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card
                    defaultFileList={} // 默认数据，可以在页面恢复时，将store里保存的数据设置
                    maxNum={5} // 最大可以上传的文件数
                    uploadChange={(id, fileList)=> { // 这里的id即上面的id
                        // 上传文件的回调，可以将数据保存在store里
                    }}/>
                    
     accept 参数，逗号分隔
        image/jpeg
        image/png
        application/vnd.ms-excel
        application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
        application/x-rar-compressed
        application/zip
        application/msword
        application/vnd.openxmlformats-officedocument.wordprocessingml.document
        application/pdf