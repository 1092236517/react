import React from 'react';
import { Button, Table, Modal } from 'antd';
import { observer, inject } from 'mobx-react';
import { tabWrap } from 'ADMIN_PAGES';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import SearchForm from './SearchForm';
import AddModalComp from './addModal';
import CoutConfigModal from './coutConfigModal';
import ReissueModal from './reissueModal';
import { tablePageDefaultOpt, generateColInfo } from 'ADMIN_UTILS';
import { tableDateRender, tableMoneyRender, tableDateTimeRender } from 'ADMIN_UTILS/tableItemRender';

@tabWrap({
    tabName: '打卡记录管理',
    stores: 'clockInMagStore'
})
@inject('clockInMagStore', 'globalStore')
@observer
class ColckInMagComp extends React.Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/clickin']);
        if (!this.props.clockInMagStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }
    }

    onChange = (page, pageSize) => {
        this.props.clockInMagStore.getList({ RecordIndex: page, RecordSize: pageSize });
    }

    render() {
        const { agentList, companyList, laborList } = this.props.globalStore;
        const { view, getList, handleFormValuesChange, handleFormReset, setVisible, importList, line, repairClockDetail } = this.props.clockInMagStore;
        const { page, RecordCount, searchValue, loading, dataSource, modalLoading, importVisible, addVisible, detailsVisible, modalCountConfigVisible, modalReissuteClockVisible } = view;

        const columnsMap = [
            ['RealName', '姓名', undefined, 100, 'left'],
            ['IDCardNum', '身份证号', undefined, 150],
            ['Mobile', '手机号码', undefined, 120],
            ['WorkCardNo', '工号', undefined, 100],
            ['InterviewDt', '面试日期', tableDateRender, 100],
            ['EntName', '企业', undefined, 150],
            ['TrgtSpName', '劳务', undefined, 220],
            ['SrceSpName', '中介', undefined, 220],
            ['ClockDt', '打卡日期', tableDateRender, 100],
            ['ClockInTm', '上班时间', (text, record) => (
                record.IsClockInRepaired === 1 ?
                    authority(resId.clockInList.details)(<a onClick={() => repairClockDetail(record, 'up')}>{tableDateTimeRender(text)}</a>)
                    : <span>{tableDateTimeRender(text)}</span>
            ), 150],
            ['ClockInAddr', '位置', (text, record) => <span>{text}<br /><span style={{ color: '#FF0000' }}>{record.ClockInSts === 2 && '位置异常'}</span></span>, 150],
            ['ClockOutTm', '下班时间', (text, record) => (
                record.IsClockOutRepaired === 1 ?
                    authority(resId.clockInList.details)(<a onClick={() => repairClockDetail(record, 'down')}>{tableDateTimeRender(text)}</a>)
                    : <span>{tableDateTimeRender(text)}</span>
            ), 150],
            ['ClockOutAddr', '位置', (text, record) => <span>{text}<br /><span style={{ color: '#FF0000' }}>{record.ClockOutSts === 2 && '位置异常'}</span></span>, 150],
            ['Amount', '打卡金额(元)', tableMoneyRender, 100],
            ['CreditAmount', '信用补贴金额(元)', tableMoneyRender, 150],
            ['CalculatePaySts', '不显示金额原因', undefined, 150],
            ['IsRepaired', '补卡', (text, record) => <span>{(record.IsClockInRepaired === 1 || record.IsClockOutRepaired === 1) && '是'}</span>, 80]
        ];
        const [columns, width] = generateColInfo(columnsMap);

        return (
            <div>
                <div className="mb-10">
                    {authority(resId.clockInList.export)(<Button disabled={dataSource.length === 0} onClick={() => { line('importVisible', true); window._czc.push(['_trackEvent', '打卡记录管理', '导出', '打卡记录管理_Y结算']); }} className="mr-20" type="primary">导出</Button>)}
                    {authority(resId.clockInList.fillClock)(<Button className="mr-20" onClick={() => { setVisible('addVisible', true); window._czc.push(['_trackEvent', '打卡记录管理', '补卡', '打卡记录管理_Y结算']); }} type="primary">补卡</Button>)}
                    {authority(resId.clockInList.reissueClock)(<Button className="mr-20" onClick={() => { setVisible('modalReissuteClockVisible', true); window._czc.push(['_trackEvent', '打卡记录管理', '补卡', '打卡记录管理_Y结算']); }} type="primary">补卡</Button>)}
                    {authority(resId.clockInList.setMaxReissueCount)(<Button type="primary" onClick={() => { setVisible('modalCountConfigVisible', true); window._czc.push(['_trackEvent', '打卡记录管理', '补卡次数限制', '打卡记录管理_Y结算']); }}>补卡次数限制</Button>)}
                </div>

                {(addVisible || detailsVisible) && <AddModalComp />}
                <SearchForm
                    searchValue={searchValue}
                    handleFormReset={handleFormReset}
                    onValuesChange={handleFormValuesChange}
                    handleSubmit={getList}
                    loading={loading}
                    {...{
                        agentList,
                        companyList,
                        laborList
                    }}
                />
                <Table
                    rowKey="ClockRecID"
                    bordered
                    columns={columns}
                    dataSource={dataSource.slice()}
                    scroll={{ x: width, y: 550 }}
                    pagination={{
                        ...tablePageDefaultOpt,
                        current: page.RecordIndex,
                        pageSize: page.RecordSize,
                        total: RecordCount,
                        onChange: (page, pageSize) => this.onChange(page, pageSize),
                        onShowSizeChange: (page, pageSize) => this.onChange(page, pageSize)
                    }}
                    loading={loading}
                />
                <Modal
                    title="导出确认"
                    visible={importVisible}
                    onCancel={() => setVisible('importVisible', false)}
                    onOk={() => { importList(); window._czc.push(['_trackEvent', '打卡记录管理', '导出确认', '打卡记录管理_Y结算']); }}
                    confirmLoading={modalLoading}
                >
                    您确定要导出这些数据吗？
                </Modal>

                {
                    modalCountConfigVisible ? <CoutConfigModal {...this.props} /> : null
                }

                {
                    modalReissuteClockVisible ? <ReissueModal {...this.props} /> : null
                }
            </div>
        );
    }
}

export default ColckInMagComp;