import React, { Component } from 'react';
import { Button, Modal, Table } from 'antd';
import { tablePageDefaultOpt, generateColInfo } from 'ADMIN_UTILS';
import { WorkStsStatus } from 'ADMIN_UTILS/tableItemRender';
import 'ADMIN_ASSETS/less/pages/systemManager.less';
export default class extends Component {
    render() {
        const columnsMap = [
            ['RealName', '姓名', undefined, 100],
            ['IdCardNum', '身份证号码'],
            ['TrgtSpShortName', '劳务'],
            ['EntShortName', '企业'],
            ['WorkCardNo', '工号'],
            ['WorkSts', '在职状态', WorkStsStatus]
        ];

        const [columns, width] = generateColInfo(columnsMap);
        const {
            closeMemberModal,
            memberInfo: {
                receiveMemberList, total, loading
            },
            paginationForMember: {
                current, pageSize
            },
            setPaginationForMember
        } = this.props;
        return (
            <div>
                <Modal
                    visible={true}
                    title='接收会员'
                    footer={null}
                    onCancel={closeMemberModal}
                    className='showMessageModal'>
                    <div className='text-center' style={{ padding: '20px 0' }}>
                        <Table
                            columns={columns}
                            bordered={true}
                            dataSource={receiveMemberList.slice()}
                            rowKey='DataId'
                            pagination={{
                                ...tablePageDefaultOpt,
                                current,
                                pageSize,
                                total,
                                onShowSizeChange: (current, size) => {
                                    setPaginationForMember(current, size);
                                },
                                onChange: (page, pageSize) => {
                                    setPaginationForMember(page, pageSize);
                                }
                            }}
                            loading={loading} >
                        </Table>
                        <div style={{ textAlign: 'right' }}>
                            {/* <Button type='primary' onClick={auditBill.bind(this, batchID, 2)}>同意</Button>
                        <Button type='primary' className='ml-8' onClick={auditBill.bind(this, batchID, 3)}>不同意</Button> */}
                            <Button onClick={closeMemberModal}>取消</Button>
                        </div>
                    </div>

                </Modal>
            </div>
        );
    }
}

