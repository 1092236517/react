import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Table, Button } from 'antd';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { withRouter } from 'react-router';
import { generateColInfo } from 'ADMIN_UTILS';
import { tableMoneyRender } from 'ADMIN_UTILS/tableItemRender';

@withRouter
@observer
class ResTable extends Component {
    render() {
        let columnsMap = [
            ['TrgtSpShortName', '劳务', undefined, 220],
            ['EntShortName', '企业', undefined, 130]
        ];

        const {
            originTableData: { OnWorkDetail, OnWorkStrTime, WeekerDetail, WeekerStrTime, WeeklySalaryStrTime, WeeklySalaryDetail },
            tableSourceType,
            changeDataSource,
            tableLoading
        } = this.props;

        ({ workCount: OnWorkStrTime, zxxCount: WeekerStrTime, zxxSalary: WeeklySalaryStrTime })[tableSourceType].forEach((col) => {
            columnsMap.push([col, col, (value, record) => {
                return tableSourceType == 'zxxSalary' ? tableMoneyRender(record.DataCountMap[col] || 0) : (record.DataCountMap[col] || 0);
            }, 100]);
        });

        const [columns, width] = generateColInfo(columnsMap);

        let dataList = ({ workCount: OnWorkDetail, zxxCount: WeekerDetail, zxxSalary: WeeklySalaryDetail })[tableSourceType];
        dataList.forEach((item, index) => (item.RecordID = index));

        return (
            <div>
                <div className='mt-16'>
                    <Button onClick={changeDataSource.bind(this, 'workCount')} type={tableSourceType == 'workCount' ? 'primary' : 'default'}>在职人数</Button>
                    <Button onClick={changeDataSource.bind(this, 'zxxCount')} type={tableSourceType == 'zxxCount' ? 'primary' : 'default'} className='ml-8'>周薪人数</Button>
                    <Button onClick={changeDataSource.bind(this, 'zxxSalary')} type={tableSourceType == 'zxxSalary' ? 'primary' : 'default'} className='ml-8'>周薪总额</Button>
                </div>

                <Table
                    className='mt-16'
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='RecordID'
                    scroll={{ x: width, y: 550 }}
                    pagination={{
                        ...tablePageDefaultOpt
                    }}
                    loading={tableLoading} >
                </Table>
            </div>
        );
    }
}

export default ResTable;