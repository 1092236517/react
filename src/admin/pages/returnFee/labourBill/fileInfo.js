import AliyunUpload from 'ADMIN_COMPONENTS/AliyunUpload';
import uploadRule from 'ADMIN_CONFIG/uploadRule';
import { saveFile } from 'ADMIN_SERVICE/ZXX_ReturnFee';
import { Button, Icon, message, Modal } from 'antd';
import React, { Component } from 'react';
const fixFile = (fileList) => fileList.map(({ Url, OriginName, Bucket, FileId }) => ({
    uid: FileId,
    name: OriginName,
    status: 'done',
    url: Url
}));

const createFileParam = ((fileList) => {
    let filterFiles = {};
    let filterFileList = [];
    fileList.forEach(({ uid, response, name }) => {
        if (uid.toString().startsWith('rc-upload-')) {
            filterFiles = {
                Bucket: response.bucket,
                OriginName: name,
                Url: response.name
            };
            filterFileList.push(filterFiles);
        }
    });
    return filterFileList;
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
            //  a标签默认事件可能被antd禁了
            const uploadDOMs = document.querySelector('#ProfitKeepFile .ant-upload-list');
            uploadDOMs.addEventListener('click', (e) => {
                const { tagName, className, href } = e.target;
                if (tagName == 'A' && className.indexOf('ant-upload-list-item-name') > -1) {
                    window.open(href);
                }
            });
        });
    }


    handleFileChange = (fileList, file) => {
        console.log(fileList);
        console.log(file);
        const { extra: { EntId, RelatedMo, TrgtSpId }, type, closeModal, startQuery, currentId } = this.props;
        if (file && file.status == 'removed' && !file.uid.toString().startsWith('rc-upload-')) {
            Modal.confirm({
                title: '信息',
                content: '确认要删除该文件吗？',
                onOk: async () => {
                    let reqParam = {
                        ReturnFeeBillId: currentId,
                        FileUrl: type == 'PicUrl' ? '' : JSON.stringify(createFileParam(fileList)),
                        PicUrl: type == 'PicUrl' ? JSON.stringify(createFileParam(fileList)) : ''
                    };

                    try {
                        await saveFile(reqParam);
                        this.setState({
                            fileList: [...fileList]
                        });
                        closeModal();
                        startQuery();
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
        const { closeModal, startQuery, extra, type, currentId } = this.props;
        const { EntId, RelatedMo, TrgtSpId } = extra;
        const { fileList } = this.state;
        const errorFiles = fileList.filter(({ status }) => status == 'error');
        if (errorFiles.length > 0) {
            message.error('文件上传失败，请稍后再试！');
            return;
        }
        if (JSON.stringify(createFileParam(fileList)) == "{}") {
            closeModal();
            return;
        }

        let reqParam = {
            ReturnFeeBillId: currentId,
            FileUrl: type == 'PicUrl' ? '' : JSON.stringify(createFileParam(fileList)),
            PicUrl: type == 'PicUrl' ? JSON.stringify(createFileParam(fileList)) : ''
        };
        try {
            await saveFile(reqParam);
            closeModal();
            startQuery();
            window._czc.push(['_trackEvent', '返费账单', '上传', '返费账单_N非结算']);
        } catch (err) {
            console.log(err);
            message.error(err.message);
        }
    }

    render() {
        const { type, closeModal } = this.props;
        const { fileList } = this.state;
        const acceptTypeMap = {
            PicUrl: 'image/jpeg,image/png,image/jpg,image/bmp,image/gif',
            FileUrl: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };

        return (
            <Modal
                title='查看文件'
                visible={true}
                onCancel={closeModal}
                onOk={this.handleOK} >
                <div>
                    <AliyunUpload
                        id='ProfitKeepFile'
                        accept={acceptTypeMap[type]}
                        listType={type == 'PicUrl' ? 'picture-card' : 'text'}
                        oss={uploadRule.labourBill}
                        previewVisible={type == 'PicUrl'}
                        defaultFileList={fileList}
                        maxNum={1}
                        uploadChange={(id, fileList, file) => {
                            this.handleFileChange(fileList, file);
                        }}>
                        {
                            type == 'PicUrl'
                                ? <div><Icon type="plus" /><div>上传</div></div>
                                : <Button><Icon type="upload" />点击上传</Button>
                        }
                    </AliyunUpload>
                </div>
            </Modal>
        );
    }
}