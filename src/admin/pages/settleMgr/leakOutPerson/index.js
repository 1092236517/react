import { tabWrap } from 'ADMIN_PAGES';
import { Table, Modal, Button, Form, Row, Col } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { tableDateMonthRender, tableDateRender } from 'ADMIN_UTILS/tableItemRender';
import SearchForm from './searchForm';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';

const FormItem = Form.Item;

@tabWrap({
    tabName: 'X查漏-个人',
    stores: ['leakOutPersonStore']
})

@inject('leakOutPersonStore', 'globalStore')

@observer
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            record: {
                x: null,
                id: null,
                remark: ''
            }
        };
    }
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/settleMgr/leakOutPerson']);
        if (!this.props.leakOutPersonStore.view.isDirty) {
            this.getByPeople();
            this.getAllCompanyInfo();
        }
    }
    getByPeople = this.props.leakOutPersonStore.getByPeople;
    getAllCompanyInfo = this.props.globalStore.getAllCompanyInfo;

    render() {
        const { view, handleFormValuesChange, handleFormReset, getByPeople, resetPageCurrent, setPagination, onSelectChange, line, transData, exportByPeople, exportAllPeople } = this.props.leakOutPersonStore;
        const { searchValue, RecordList, FormListStatus, pagination, totalNum } = view;
        const { companyList, laborList } = this.props.globalStore;
        const ChangeformItemLayout = {
            wrapperCol: { span: 18, offset: 0 }
        };

        let columns = [
            { title: '企业', dataIndex: 'EnterpriseName', align: 'center', width: '13%' },
            { title: '劳务', dataIndex: 'LaborName', align: 'center', width: '13%' },
            { title: '月份', dataIndex: 'Month', align: 'center', width: '10%', render: tableDateMonthRender },
            { title: '身份证号码', dataIndex: 'IDCardNum', align: 'center', width: '10%' },
            { title: '姓名', dataIndex: 'RealName', align: 'center', width: '10%' },
            {
                title: 'X类型', dataIndex: 'XTypeText', align: 'center', width: '10%'
                // render: (text) => ({
                //     1: <span>工资</span>,
                //     2: <span>社保</span>, 
                //     3: <span>管理费</span>,
                //     4: <span>招聘费</span>,
                //     5: <span>自离工资</span>, 
                //     6: <span>其他</span>
                // }[text])
            },
            { title: '工号', dataIndex: 'WorkCardNo', align: 'center', width: '7%' },
            { title: '入职日期', dataIndex: 'EntryDate', align: 'center', width: '10%', render: tableDateRender },
            { title: '离职日期', dataIndex: 'LeaveDate', align: 'center', width: '10%', render: tableDateRender },
            { title: '在离职状态', dataIndex: 'WorkState', align: 'center', width: '7%' }
        ];
        return (
            <div>
                <div className='mb-16'>
                    {authority(resId.settleMgr.leakOutPerson.export)(<Button onClick={() => { exportByPeople(); window._czc.push(['_trackEvent', 'X查漏-个人', '导出', 'X查漏-个人_Y结算']); }} className="ml-8" type="primary">导出</Button>)}
                    {authority(resId.settleMgr.leakOutPerson.exportAllX)(<Button onClick={() => { exportAllPeople(); window._czc.push(['_trackEvent', 'X查漏-个人', '导出所有', 'X查漏-个人_Y结算']); }} className="ml-8" type="primary" className='ml-8'>导出所有</Button>)}
                </div>

                <SearchForm
                    {...{
                        searchValue,
                        handleFormReset,
                        onValuesChange: handleFormValuesChange,
                        handleFormSubmit: getByPeople,
                        resetPageCurrent,
                        laborList,
                        companyList
                    }}
                />
                <Form>
                    <Row>
                        <Col span={24}>
                            <FormItem {...ChangeformItemLayout}>
                                {/* <span style = {{fontWeight: "700", fontSize: "18px", color: '#e84e40'}}>导入X共n元；最终X共m元；差值（最终X-导入X）共r元</span> */}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <Table
                    rowKey={'Number'}
                    bordered={true}
                    dataSource={RecordList.slice()}
                    loading={FormListStatus === "pending"}
                    columns={columns}
                    scroll={{ y: 550 }}
                    pagination={{
                        ...tablePageDefaultOpt,
                        pageSize: pagination.pageSize,
                        current: pagination.current,
                        total: totalNum,
                        onChange: (page, pageSize) => {
                            setPagination(page, pageSize);
                        },
                        onShowSizeChange: (current, size) => {
                            setPagination(current, size);
                        }
                    }}
                />

            </div>

        );
    }
}

