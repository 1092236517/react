import React, { Component } from 'react';
import { Modal, Icon, message, Button } from 'antd';
import AliyunUpload from 'ADMIN_COMPONENTS/AliyunUpload';
import uploadRule from 'ADMIN_CONFIG/uploadRule';
import { delFile, uploadFile, delFileX, uploadFileX } from 'ADMIN_SERVICE/ZXX_Busi_Manage';
import moment from 'moment';
const fixFile = (fileList) => fileList.map(({ Url, OriginName, Bucket, FileId }) => ({
    uid: FileId,
    name: OriginName,
    status: 'done',
    url: Url
}));

const createFileParam = ((fileList) => {
    let filterFiles = [];
    fileList.forEach(({ uid, response, name }) => {
        if (uid.toString().startsWith('rc-upload-')) {
            filterFiles.push({
                Bucket: response.bucket,
                OriginName: name,
                Url: response.name
            });
        }
    });
    return filterFiles;
});

export default class extends Component {
    state = {
        fileList: []
    }

    componentDidMount() {
        const { list } = this.props;
        this.setState({
            fileList: fixFile(list)
        }, () => {
            // a标签默认事件可能被antd禁了
            const uploadDOMs = document.querySelector('#ProfitFile .ant-upload-list');
            uploadDOMs.addEventListener('click', (e) => {
                const { tagName, className, href } = e.target;
                console.log(`======>`, {
                    tagName, className, href
                });
                if (tagName === 'A' && className.indexOf('ant-upload-list-item-name') > -1) {
                    window.open(href);
                }
            });
        });
    }

    handleFileChange = (fileList, file) => {
        const { isX, extra: { EntId, TrgtSpId, RelatedMo } } = this.props;
        if (file && file.status == 'removed' && !file.uid.toString().startsWith('rc-upload-')) {
            Modal.confirm({
                title: '信息',
                content: '确认要删除该文件吗？',
                onOk: async () => {
                    let reqParam = {
                        EntId: EntId,
                        TrgtSpId: TrgtSpId,
                        Month: RelatedMo,
                        FileIds: [file.uid]
                    };

                    try {
                        await (isX ? delFileX : delFile)(reqParam);
                        this.setState({
                            fileList: [...fileList]
                        });
                    } catch (err) {
                        console.log(err);
                        message.error(err.message);
                    }
                },
                onCancel: () => {
                    console.log('cancel');
                }
            });
        } else {
            this.setState({
                fileList: [...fileList]
            });
        }
    }

    handleOK = async () => {
        const { closeModal, startQuery, extra, type, isX = false } = this.props;
        const { EntId, RelatedMo, TrgtSpId } = extra;
        const { fileList } = this.state;

        const errorFiles = fileList.filter(({ status }) => status == 'error');
        if (errorFiles.length > 0) {
            message.error('文件上传失败，请稍后再试！');
            return;
        }

        let reqParam = {
            EntId,
            ExcelInfo: type == 'ExcelInfo' ? createFileParam(fileList) : [],
            Month: moment(RelatedMo).format('YYYY-MM'),
            PicInfo: type == 'PicInfo' ? createFileParam(fileList) : [],
            TrgtSpId
        };

        try {
            await (isX ? uploadFileX : uploadFile)(reqParam);
            closeModal();
            startQuery();
        } catch (err) {
            console.log(err);
            message.error(err.message);
        }
    }

    render() {
        const { type, closeModal, isX } = this.props;
        const { fileList } = this.state;
        const acceptTypeMap = {
            PicInfo: 'image/jpeg,image/png,image/jpg,image/bmp,image/gif',
            ExcelInfo: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };

        return (
            <Modal
                title='查看文件'
                visible={true}
                onCancel={closeModal}
                onOk={this.handleOK} >
                <div>
                    <AliyunUpload
                        id='ProfitFile'
                        accept={acceptTypeMap[type]}
                        listType={type == 'PicInfo' ? 'picture-card' : 'text'}
                        oss={isX ? uploadRule.profitX : uploadRule.profit}
                        maxNum={type === 'ExcelInfo' ? 10 : 1}
                        previewVisible={type == 'PicInfo'}
                        defaultFileList={fileList}
                        uploadChange={(id, fileList, file) => {
                            this.handleFileChange(fileList, file);
                        }}>
                        {
                            type == 'PicInfo'
                                ? <div><Icon type="plus" /><div>上传</div></div>
                                : <Button><Icon type="upload" />点击上传</Button>
                        }
                    </AliyunUpload>
                </div>
            </Modal>
        );
    }
}