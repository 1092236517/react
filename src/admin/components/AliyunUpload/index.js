import React from 'react';
import AliSignature from './AliSignature';
import { Upload, Icon, Modal, Input, message, Form } from 'antd';
import moment from 'moment';
import './index.less';
import DragImage from 'ADMIN_COMPONENTS/DragImage';

const Formx = Form.create()(({ form }) => {
    const { getFieldDecorator } = form;
    return (
        <Form>
            <Form.Item label="图片描述" required>
                {getFieldDecorator('imgDesc', {
                    rules: [{
                        required: true,
                        message: '请输入图片描述'
                    },
                    {
                        min: 5,
                        message: '描述不能少于5个字'
                    }]
                })(
                    <Input type="text" autoComplete="off" placeholder="请输入上传图片的描述" />
                )}
            </Form.Item>
        </Form>
    );
});


class PicturesWall extends React.Component {
    formRef = React.createRef();
    upCount = -1;
    state = {
        visiablePictureDesc: false,
        currentDesc: {},
        previewVisible: false,
        previewDesc: '',
        previewImage: '',
        sortList: []
    };
    sortList = [];

    customRequest = (fileo) => {
        let file = fileo.file;
        let error = this.validatFile(file);
        if (error) {
            message.error(error);
            return;
        }
        new AliSignature().clientWrapper({
            bucket: this.props.oss.bucket,
            region: this.props.oss.region
        }).then((client) => {

            client.multipartUpload(this.props.oss.path + (moment().format('YYYYMMDDHHmmss').toString() + Math.ceil(Math.random(1) * 10000)), file, {
                parallel: 4,
                partSize: 1024 * 1024
            }).then((res) => {
                let uid = file.uid;
                let temp = this.getFileList();
                for (let i = 0; i < temp.length; i++) {
                    if (temp[i].uid === uid) {
                        temp[i].status = 'done';
                        temp[i].response = res;
                        if (this.props.enableDesc) {
                            temp[i].desc = this.state.currentDesc[uid];
                        }
                        break;
                    }
                }
                this.onChange({ fileList: temp });
            }, (err) => {
                let uid = file.uid;
                let temp = this.getFileList();
                for (let i = 0; i < temp.length; i++) {
                    if (temp[i].uid === uid) {
                        temp[i].status = 'error';
                        temp[i].error = err;
                        break;
                    }
                }
                this.onChange({ fileList: temp });
            });
        }, () => {

        });
    };

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = (file) => {
        if (this.props.previewVisible === false) return;
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewDesc: file.desc || '',
            previewVisible: true
        });
    };

    onChange = ({ file, fileList }) => {
        let error = this.validatFile(file);
        if (!error) this.props.uploadChange ? this.props.uploadChange(this.props.id, fileList, file) : this.setState({ fileList });
    };

    validatFile = (file) => {
        if (file && this.props.fileMaxSize) {
            if (file.size > this.props.fileMaxSize) {
                return `文件必须小于 ${this.props.fileMaxSize} 个字节!`;
            }
        }
        if (file && file.type && this.props.accept) {
            let type = this.props.accept.split(',').find(item => item === file.type);
            if (!type) return '不支持的文件类型';
        }
    };

    getFileList = () => {
        let fileList = this.props.defaultFileList;
        if (!fileList) fileList = this.state.fileList || [];
        return fileList;
    };

    handleBeforeUpload = (file) => {
        if (this.props.enableDesc) {
            this.setState({
                visiablePictureDesc: true,
                currentFileUid: file.uid
            });
            this.upCount = -1;
            return new Promise((resolve, reject) => {
                this.timer = setInterval(() => {
                    if (this.upCount === 1) {
                        resolve();
                        if (this.timer) clearInterval(this.timer);
                    }
                    if (this.upCount === 0) {
                        reject();
                        if (this.timer) clearInterval(this.timer);
                    }
                }, 500);
            });
        } else {
            return true;
        }
    };

    handleOkDesc = (e) => {
        this.formRef.current.validateFieldsAndScroll({}, (errors, values) => {
            if (!errors) {
                let od = this.state.currentDesc;
                od[this.state.currentFileUid] = this.props.form.getFieldValue('imgDesc');
                this.setState({
                    visiablePictureDesc: false,
                    currentDesc: od
                });
                this.upCount = 1;
            }
        });
    };
    handleCancelDesc = (e) => {
        this.setState({
            visiablePictureDesc: false
        });
        this.upCount = 0;
    };
    sortBindListener = (e) => {
        if (this.props.enableSort && e.target.className === "ant-upload-list-item-info") {
            let index = parseInt(e.target.getAttribute('sort'), 10);

            let fileList = this.getFileList();

            let currentFileObj = fileList[index];
            let currentSort = currentFileObj.sort;
            if (currentSort) {
                for (let i = 0; i < this.sortList.length; i++) {
                    if (this.sortList[i].uid === currentFileObj.uid) {
                        this.sortList.splice(i, 1);
                    }
                }

                for (let k = 0; k < fileList.length; k++) {
                    if (fileList[k].sort && fileList[k].sort >= currentSort) {
                        fileList[k].sort = fileList[k].sort - 1;
                    }
                }
                fileList[index].sort = '';
            } else {
                if (this.sortList.length >= this.props.maxUseful) {
                    alert('已经大于最大使用数量');
                } else {
                    currentFileObj.sort = this.sortList.length + 1;
                    fileList[index].sort = this.sortList.length + 1;
                    this.sortList.push(currentFileObj);
                }
            }
            this.setState({
                sortList: this.sortList
            });
            this.onChange({ fileList });
        }
    };

    componentDidMount() {
        this.translateSort();
    }

    componentDidUpdate() {
        this.translateSort();
    }

    translateSort() {
        this.sortList = [];
        let con = document.getElementById(this.props.id);
        let items = con.getElementsByClassName('ant-upload-list-item');
        if (items.length) {
            let fileList = this.getFileList();

            for (let i = 0; i < items.length; i++) {
                let fileObj = fileList[i];
                if (!fileObj || !fileObj.uid) {
                    continue;
                }
                // bind click event
                items[i].removeEventListener('click', this.sortBindListener);
                items[i].addEventListener('click', this.sortBindListener);
                let infoElement = items[i].getElementsByClassName('ant-upload-list-item-info')[0];
                infoElement.setAttribute('sort', i);
                // add sort icon
                let r = document.getElementById(this.props.id + '_fileIcon_' + (fileObj.uid || ''));
                if (r) {
                    let parent = r.parentNode;
                    parent.removeChild(r);
                }
                if (fileObj.sort) {
                    let icon = document.createElement('div');
                    icon.id = this.props.id + '_fileIcon_' + fileObj.uid;
                    icon.className = 'file-item-icon';
                    icon.innerHTML = fileObj.sort;
                    items[i].appendChild(icon);
                    this.sortList.push(fileObj);
                }
            }
            this.sortList = this.sortList.sort((a, b) => a.sort - b.sort);
        }
    }

    render() {
        let fileList = this.getFileList();
        const { previewDesc, previewVisible, previewImage } = this.state;
        const { enableDesc, disabled } = this.props;
        const uploadButton = disabled ?
            <div>
                <div className="ant-upload-text">未上传</div>
            </div> :
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传</div>
            </div>;
        return (
            <div id={this.props.id}>
                <Upload
                    disabled={!!this.props.disabled}
                    accept={this.props.accept}
                    action={this.props.action}
                    listType={this.props.listType || "picture-card"}
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.onChange}
                    customRequest={this.customRequest}
                    beforeUpload={this.handleBeforeUpload}
                    showUploadList={{ showRemoveIcon: !disabled, showPreviewIcon: true }}
                >
                    {fileList.length >= (this.props.maxNum || 10) ? null : this.props.children ? this.props.children : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} title='图片预览'>
                    {enableDesc && previewDesc && <p className='preview-desc'>{previewDesc}</p>}
                    <DragImage imgSrc={previewImage} />
                </Modal>
                {this.state.visiablePictureDesc && <div>
                    <Modal visible={true} title="图片描述" onCancel={this.handleCancelDesc}
                        onOk={this.handleOkDesc}>
                        <Formx ref={this.formRef} />
                    </Modal>
                </div>}
            </div>
        );
    }
}

export default PicturesWall;