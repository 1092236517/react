import React, { Component } from 'react';
import { Table, message, Radio, Button } from 'antd';
import { Link } from 'react-router-dom';
import { expBillDetail } from 'ADMIN_SERVICE/ZXX_WeekReturnFee';
import { WorkStsStatus, tableSrcRender, tableDateTimeRender, tableMoneyRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt, generateColInfo } from 'ADMIN_UTILS';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import ConFIlterSearchForm from './conFIlterSearchForm';
import 'ADMIN_ASSETS/less/pages/systemManager.less';
class ResTable extends Component {
    showAuditModal = (batchID) => {
        const { setSelectRowKeys, showAuditModal } = this.props;
        setSelectRowKeys([batchID]);
        showAuditModal();
    }

    exportDetail = (batchID) => {
        expBillDetail({
            IdCardNum: "",
            RealName: "",
            WorkSts: -9999,
            BillWeeklyBatchIdList: [batchID]
        }).then((resData) => {
            window.open(resData.Data.FileUrl);
        }).catch((err) => {
            message.error(err.message);
            console.log(err);
        });
    }
    commitImport = () => {

    }
    onChange = e => {
        this.props.receiveMemberTypeOpt(e.target.value);
    };
    render() {
        const {
            startQuery,
            resetPageCurrent,
            handleFormFilterValuesChange,
            resetForm,
            agentList, companyList, laborList,
            filterSearchValue
        } = this.props;

        const { seeDetailX, exportDetailX } = resId.weekReturnFee.bill;

        const columnsMap = [
            ['RealName', '姓名', undefined, 100],
            ['IdCardNum', '身份证号码'],
            ['TrgtSpShortName', '劳务'],
            ['EntShortName', '企业'],
            ['WorkCardNo', '工号', undefined, 220],
            ['WorkSts', '在职状态', WorkStsStatus]
        ];

        const {
            paginationForMember: {
                current, pageSize
            },
            setPaginationForMember,
            setSelectRowKeys,
            infoBean,
            radioButtonBean,
            startQueryFilterTable,
            memberInfo: {
                receiveMemberList, loading, total, selectedRowKeys
            },
            saveImportContent,
            backToEditPage, resetMemberForm
        } = this.props;

        const [columns, width] = generateColInfo(columnsMap);

        return (
            <div>
                <div className='optItemGroup'>
                    <div className='optItem'><Radio.Group onChange={this.onChange} value={radioButtonBean.Typ}>
                        <Radio value={1}>表格导入</Radio>
                        <Radio value={2}>条件筛选</Radio>
                        <Radio value={3}>全部在职会员</Radio>
                    </Radio.Group></div>
                    <div className='optItem'> <Button onClick={backToEditPage}>返回</Button><Button type="primary" onClick={() => { saveImportContent(); window._czc.push(['_trackEvent', '公告推送管理', '提交', '公告推送管理_N非结算']); }}>提交</Button></div>
                </div>
                <ConFIlterSearchForm {...{ filterSearchValue, handleFormFilterValuesChange, startQueryFilterTable, resetPageCurrent, startQuery, resetMemberForm, agentList, companyList, laborList }} />
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={receiveMemberList.slice()}
                    rowKey='DataId'
                    rowSelection={{
                        selectedRowKeys,
                        onChange: (selectedRowKeys, selectedRows) => {
                            setSelectRowKeys(selectedRowKeys, selectedRows);
                        }
                    }}
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
            </div>
        );
    }
}

export default ResTable;