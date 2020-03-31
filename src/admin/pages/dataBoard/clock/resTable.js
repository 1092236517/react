import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Table, Button } from 'antd';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { withRouter } from 'react-router';
import { generateColInfo } from 'ADMIN_UTILS';

@withRouter
@observer
class ResTable extends Component {
    render() {
        let columnsMap = [
            ['TrgtSpShortName', '劳务', undefined, 220],
            ['EntShortName', '企业', undefined, 130]
        ];

        const {
            originTableData: { FullClockDetail, FullStrTime, ValidClockDetail, ValidStrTime },
            tableSourceType,
            changeDataSource,
            tableLoading
        } = this.props;

        ({ full: FullStrTime, valid: ValidStrTime })[tableSourceType].forEach((col) => {
            columnsMap.push([col, col, (value, record) => {
                return record.DataCountMap[col] || 0;
            }, 100]);
        });

        const [columns, width] = generateColInfo(columnsMap);

        let dataList = ({ full: FullClockDetail, valid: ValidClockDetail })[tableSourceType];
        dataList.forEach((item, index) => (item.RecordID = index));

        return (
            <div>
                <div className='mt-16'>
                    <Button onClick={changeDataSource.bind(this, 'full')} type={tableSourceType == 'full' ? 'primary' : 'default'}>总打卡人数</Button>
                    <Button onClick={changeDataSource.bind(this, 'valid')} type={tableSourceType == 'valid' ? 'primary' : 'default'} className='ml-8'>有效打卡人数</Button>
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