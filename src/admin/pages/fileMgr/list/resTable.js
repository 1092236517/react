import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import { Table, Menu, Dropdown, Icon } from 'antd';
import { tableDateRender, tableDateTimeRender, tableBillAuditRender, tableDateMonthRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { withRouter } from 'react-router';
import { generateColInfo } from 'ADMIN_UTILS';
import getClient from 'ADMIN_COMPONENTS/AliyunUpload/getClient';
import uploadRule from 'ADMIN_CONFIG/uploadRule';

const fileRender = (files, type) => {
    const downloadFile = async (OriginFileName, FileName) => {
        let client = await getClient(uploadRule.fileMgr[type]);
        let fileUrl = client.signatureUrl(FileName, {
            response: {
                'content-disposition': `attachment; filename=${OriginFileName}`
            }
        });
        window._czc.push(['_trackEvent', '文件查询', '下载', '文件查询_Y结算']);
        window.open(fileUrl);
    };

    const menu = (
        <Menu>
            {
                files.map(({ OriginFileName, FileName }, index) => (
                    <Menu.Item key={index} onClick={downloadFile.bind(this, OriginFileName, FileName)}>
                        <a href='#' >{OriginFileName}</a>
                    </Menu.Item>
                ))
            }
        </Menu>
    );

    return (
        <Fragment>
            <span>{files.length}个</span>
            <Dropdown overlay={menu} trigger={['click']}>
                <a className='ml-8' href='#'>
                    查看<Icon type='down' />
                </a>
            </Dropdown>
        </Fragment>
    );
};

@withRouter
@observer
class ResTable extends Component {
    render() {
        const columnsMap = [
            ['LaborName', '劳务', undefined, 220],
            ['EnterName', '企业'],
            ['FileType', '类型', (text) => ({ 1: '周薪', 2: '月薪' }[text]), 80],
            ['BeginDate', '开始日期', tableDateRender, 100],
            ['EndDate', '截止日期', tableDateRender, 100],
            ['Month', '归属月份', tableDateMonthRender, 100],
            ['FileList1', '原件', (files) => fileRender(files, 'origin')],
            ['FileList2', '导入件', (files) => fileRender(files, 'import')],
            ['UploadUserName', '上传人'],
            ['UploadTime', '上传时间', tableDateTimeRender, 150],
            ['Remark', '备注'],
            ['AuditState', '审核状态', tableBillAuditRender, 80],
            ['AuditUserName', '审核人'],
            ['AuditTime', '审核时间', tableDateTimeRender, 150],
            ['AuditRemark', '审核备注'],
            ['Action', '操作', (text, record) => record.AuditState == 1 && <a href='#' onClick={this.props.showInfo.bind(this, record)}>编辑</a>]
        ];

        const {
            tableInfo: {
                dataList, total, loading, selectedRowKeys
            },
            pagination: {
                current, pageSize
            },
            setPagination,
            setSelectRowKeys
        } = this.props;

        const [columns, width] = generateColInfo(columnsMap);

        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='RecordID'
                    scroll={{ x: width + 62, y: 550 }}
                    pagination={{
                        ...tablePageDefaultOpt,
                        current,
                        pageSize,
                        total,
                        onShowSizeChange: (current, size) => {
                            setPagination(current, size);
                        },
                        onChange: (page, pageSize) => {
                            setPagination(page, pageSize);
                        }
                    }}
                    rowSelection={{
                        selectedRowKeys: selectedRowKeys,
                        onChange: (selectedRowKeys, selectedRows) => {
                            setSelectRowKeys(selectedRowKeys, selectedRows);
                        },
                        getCheckboxProps: (record) => ({ disabled: !(record.AuditState == 1) })
                    }}
                    loading={loading} >
                </Table>
            </div>
        );
    }
}

export default ResTable;