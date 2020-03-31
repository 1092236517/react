import 'ADMIN_ASSETS/less/pages/bAccountManager.less';
import 'ADMIN_ASSETS/less/pages/imageView.less';
import 'ADMIN_ASSETS/less/pages/informationQueryModal.less';
import { Modal, Table } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';

@inject('entryAndExitStore')
@observer
export default class RightBox extends React.Component {
    componentDidMount() {
        if (!this.props.entryAndExitStore.view.isDirty) {
            this.getList();
        }
    }
    getList = this.props.entryAndExitStore.getList;

    setModalVisible = () => {
        Modal.warning({
            title: '出入金类型错误',
            okText: "我去修改文件",
            content: ("贷方金额、借方金额、出入金类型校验不通过，请输入导入件后重新导入"),
            style: { "top": "30%" }
        });
    }

    setInfo = (dis, record) => {
        this.props.entryAndExitStore.setInfo(dis, record.primaryIndex);
    }

    render() {
        let { source, imageView } = this.props;
        const { view: { ExcelRecordList, flag, FormListStatus, uncommited, commited }, setBg } = this.props.entryAndExitStore;
        let columns = [
            {
                title: '序号',
                dataIndex: 'primaryIndex',
                align: 'center',
                width: 60,
                render: (text, record) => record.IsExsit === 1 ? <span>{text + 1}</span> : record.IsExsit === 2 ? <span>{text + 1}</span> : <span>{text + 1}</span>
            },
            {
                title: '银行流水号',
                dataIndex: 'BankOrderID',
                align: 'center',
                width: 120,
                render: (text, record) => record.IsExsit === 1 ? <span >{text}</span> : record.IsExsit === 2 ? <span>{text}</span> : <span>{text}</span>
            },
            {
                title: '状态',
                dataIndex: 'IsExsit',
                align: 'center',
                width: 80,
                render: (text, record) => text === 1 ? <span>未提交</span> : text === 2 ? <span>已提交</span> : <span>类型错误</span>
            }
        ];
        return (
            <div className="drag"
                id="tableStyle"
            >
                {
                    flag === true ? '' : <Table
                        style={{
                            left: '0',
                            top: '100px'
                        }}
                        className="rightTable"
                        rowKey={'primaryIndex'}
                        bordered={true}
                        dataSource={ExcelRecordList.slice()}
                        loading={FormListStatus === "pending"}
                        columns={columns}
                        scroll={{ y: 350 }}
                        pagination={false}
                        rowClassName={(record) => {
                            if (record.IsExsit === 1) {
                                if (uncommited === record.primaryIndex) {
                                    return 'bg';
                                }
                            } else if (record.IsExsit === 2) {
                                if (commited === record.primaryIndex) {
                                    return 'bg commited';
                                }
                                return 'commited';
                            } else if (record.IsExsit === 3) {
                                return 'wrongStatus';
                            }
                        }}
                        onRow={(record) => {
                            return {
                                onClick: () => {
                                    if (record.IsExsit === 1) {
                                        this.setInfo(false, record);
                                        setBg(record, 1, 'uncommited');
                                    }
                                    if (record.IsExsit === 2) {
                                        this.setInfo(true, record);
                                        setBg(record, 2, 'commited');
                                    }
                                    if (record.IsExsit === 3) {
                                        this.setModalVisible();
                                    }
                                }
                            };
                        }}
                    />
                }
            </div>
        );
    }
}
