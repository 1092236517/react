import React, { Component } from 'react';
import { Modal, Button, Form, DatePicker, Checkbox, InputNumber, Icon, message, Select, Row, Col } from 'antd';
import { createFormField } from 'ADMIN_UTILS/searchFormUtil';
import moment from 'moment';
import { tableMoneyRender } from 'ADMIN_UTILS/tableItemRender';
import { safeMul } from 'ADMIN_UTILS/math';
import { selectInputSearch } from 'ADMIN_UTILS';
import { addConfigAgentA, editConfigAgentA } from 'ADMIN_SERVICE/ZXX_XManager';

const { MonthPicker } = DatePicker;
const { Option } = Select;
const FormItem = Form.Item;
const END_TM = moment('2099-01-01');
const INIT_AGENT_INFO = [{
    BeginDt: undefined,
    EndDt: END_TM,
    AgentAmt: 0
}];

class ConfigInfo extends Component {
    state = {
        configInfo: {
            AgentInfo: INIT_AGENT_INFO,
            LaborId: undefined,
            EntId: undefined
        }
    }

    componentDidMount() {
        const { record } = this.props;
        if (record) {
            const { AgentInfo, LaborId, EntId } = record;
            //  统一转moment
            this.setState({
                configInfo: {
                    AgentInfo: AgentInfo.map(({ BeginDt, EndDt, AgentAmt }, index) => ({
                        BeginDt: moment(BeginDt),
                        EndDt: moment(EndDt),
                        AgentAmt: tableMoneyRender(AgentAmt)
                    })),
                    LaborId,
                    EntId
                }
            });
        }
    }

    addAgent = () => {
        const { configInfo } = this.state;
        const { AgentInfo } = configInfo;
        const { length } = AgentInfo;
        const { EndDt } = AgentInfo[length - 1];

        if (EndDt == undefined) {
            message.info('请完善当前记录结束月份！');
            return;
        }

        this.setState({
            configInfo: {
                ...configInfo,
                AgentInfo: [...AgentInfo, {
                    BeginDt: moment(EndDt).add(1, 'month'),
                    EndDt: END_TM,
                    AgentAmt: 0
                }]
            }
        });
    }

    delAgent = (row) => {
        const { configInfo } = this.state;
        const { AgentInfo } = configInfo;
        const newAgents = AgentInfo.filter((item, index) => {
            return row != index;
        });
        this.setState({
            configInfo: {
                ...configInfo,
                AgentInfo: newAgents
            }
        });
    }

    saveFormValues = (changedValues, allValues) => {
        const { configInfo: { AgentInfo: { length } } } = this.state;
        const { EntId, LaborId } = allValues;

        let newAgents = [];
        for (let i = 0; i < length; i++) {
            newAgents.push({
                BeginDt: allValues[`BeginDt${i}`],
                EndDt: allValues[`EndDt${i}`] ? allValues[`EndDt${i}`] : END_TM,
                AgentAmt: allValues[`AgentAmt${i}`]
            });
        }

        if (changedValues.Forever) {
            newAgents[length - 1].EndDt = END_TM;
        }

        this.setState({
            configInfo: {
                AgentInfo: newAgents,
                EntId,
                LaborId
            }
        });
    }

    saveData = () => {
        const { configInfo: { AgentInfo, EntId, LaborId } } = this.state;
        const { length } = AgentInfo;
        const { EndDt } = AgentInfo[length - 1];
        const { record } = this.props;

        if (EndDt == undefined) {
            message.info('请完善最后一条记录结束月份！');
            return;
        }

        let reqParam = {
            EntId,
            LaborId
        };

        reqParam.AgentInfo = AgentInfo.map(({ BeginDt, EndDt, AgentAmt }) => ({
            BeginDt: BeginDt.format('YYYY-MM'),
            EndDt: typeof EndDt == 'string' ? '2099-01' : EndDt.format('YYYY-MM'),
            AgentAmt: safeMul(AgentAmt, 100)
        }));
        window._czc.push(['_trackEvent', '中介费配置', record ? '保存修改' : '保存新增', '中介费配置_N非结算']);
        if (record) {
            //  修改
            editConfigAgentA(reqParam).then((resData) => {
                message.success('修改成功！');
                this.reloadData();
            }).catch((err) => {
                message.error(err.message);
                console.log(err);
            });
        } else {
            //  新增
            addConfigAgentA(reqParam).then((resData) => {
                message.success('添加成功！');
                this.reloadData();
            }).catch((err) => {
                message.error(err.message);
                console.log(err);
            });
        }
    }

    reloadData = () => {
        const { reloadData, hideModal } = this.props;
        reloadData();
        hideModal();
    }

    render() {
        const { hideModal, companyList, laborList, record } = this.props;
        const { configInfo } = this.state;

        return (
            <Modal
                width={850}
                visible={true}
                footer={null}
                title={record ? '修改' : '新增'}
                keyboard={false}
                maskClosable={false}
                onCancel={hideModal}>
                <DetailList {...{
                    isEdit: !!record,
                    companyList,
                    laborList,
                    hideModal,
                    configInfo,
                    addAgent: this.addAgent,
                    delAgent: this.delAgent,
                    saveData: this.saveData,
                    saveFormValues: this.saveFormValues
                }} />
            </Modal>
        );
    }
}

class DetailList extends Component {
    saveData = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }

            const { saveData } = this.props;
            saveData();
        });
    }

    render() {
        const {
            form: { getFieldDecorator, getFieldValue },
            configInfo: { AgentInfo },
            hideModal, addAgent, delAgent, companyList, laborList, isEdit
        } = this.props;
        const formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 4 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 10 } } };

        return (
            <Form
                style={{ padding: 30 }}
                onSubmit={this.saveData}>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label='劳务'>
                            {getFieldDecorator('LaborId', {
                                rules: [{ required: true, message: '请选择劳务' }]
                            })(
                                <Select
                                    disabled={isEdit}
                                    allowClear={false}
                                    placeholder='请选择'
                                    filterOption={selectInputSearch}
                                    optionFilterProp="children"
                                    showSearch>
                                    {
                                        laborList.map((value) => {
                                            return <Option key={value.SpId} value={value.SpId}>{value.SpShortName}</Option>;
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label='企业'>
                            {getFieldDecorator('EntId', {
                                rules: [{ required: true, message: '请选择企业' }]
                            })(
                                <Select
                                    disabled={isEdit}
                                    allowClear={false}
                                    placeholder='请选择'
                                    filterOption={selectInputSearch}
                                    optionFilterProp="children"
                                    showSearch>
                                    {
                                        companyList.map((value) => {
                                            return <Option key={value.EntId} value={value.EntId}>{value.EntShortName}</Option>;
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>

                {
                    AgentInfo.map(({ BeginDt, EndDt, AgentAmt }, index) => (
                        <div key={index} className='mb-8' >
                            {getFieldDecorator(`BeginDt${index}`, {
                                rules: [{ required: true, message: '请选择开始月份' }]
                            })(
                                <MonthPicker
                                    allowClear={false}
                                    disabledDate={(startValue) => {
                                        const lastEndValue = getFieldValue(`EndDt${index - 1}`);
                                        const endValue = getFieldValue(`EndDt${index}`);
                                        if (!startValue) {
                                            return false;
                                        }
                                        return (endValue && startValue.isAfter(endValue, 'month'))
                                            || (lastEndValue && !startValue.isAfter(lastEndValue, 'month'));
                                    }} />
                            )}

                            <span style={{ margin: '0 8px' }}>-</span>

                            {getFieldDecorator(`EndDt${index}`)(
                                <MonthPicker
                                    allowClear={false}
                                    className='mr-8'
                                    disabledDate={(endValue) => {
                                        const nextStartValue = getFieldValue(`BeginDt${index + 1}`);
                                        const startValue = getFieldValue(`BeginDt${index}`);
                                        if (!endValue) {
                                            return false;
                                        }
                                        return (startValue && endValue.isBefore(startValue, 'month'))
                                            || (nextStartValue && !endValue.isBefore(nextStartValue, 'month'));
                                    }} />
                            )}

                            {
                                getFieldDecorator('Forever')(
                                    <Checkbox style={{ visibility: (index == AgentInfo.length - 1) ? 'visible' : 'hidden' }} checked={EndDt.isSame(END_TM, 'month')} className='ml-8'>至永久</Checkbox>
                                )
                            }

                            <span>中介费</span>

                            {getFieldDecorator(`AgentAmt${index}`)(
                                <InputNumber min={0} max={29.99} precision={2} style={{ width: 100, margin: '0 8px', color: AgentAmt >= 20 ? 'red' : '' }} />
                            )}

                            <span>元/天</span>

                            {
                                (index == AgentInfo.length - 1) && !EndDt.isSame(END_TM, 'month') &&
                                <Icon onClick={addAgent} type="plus-circle" style={{ fontSize: 25, marginLeft: 12 }} />
                            }

                            {
                                (index == AgentInfo.length - 1) && AgentInfo.length > 1 &&
                                <Icon onClick={delAgent.bind(this, index)} type="minus-circle" style={{ fontSize: 25, marginLeft: 12 }} />
                            }
                        </div>
                    ))
                }

                <div className='text-right mt-32'>
                    <Button type="primary" htmlType="submit" >确定</Button>
                    <Button className='ml-8' onClick={hideModal}>取消</Button>
                </div>
            </Form>
        );
    }
}

DetailList = Form.create({
    mapPropsToFields: props => {
        const { configInfo: { LaborId, EntId, AgentInfo } } = props;
        let showData = AgentInfo.reduce((prev, { BeginDt, EndDt, AgentAmt }, index) => {
            prev[`BeginDt${index}`] = BeginDt;
            prev[`EndDt${index}`] = !EndDt.isSame(END_TM, 'month') ? EndDt : undefined;
            prev[`AgentAmt${index}`] = AgentAmt;
            return prev;
        }, {});
        showData.LaborId = LaborId;
        showData.EntId = EntId;
        return createFormField(showData);
    },

    onValuesChange: (props, changedValues, allValues) => {
        props.saveFormValues(changedValues, allValues);
    }
})(DetailList);

export default ConfigInfo;