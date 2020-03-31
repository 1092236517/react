import { message } from 'antd';

//  表格分页默认配置
export const tablePageDefaultOpt = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '20', '30', '50', '100', '200'],
    size: 'small',
    showTotal: (total, range) => (`第${range[0]}-${range[1]}条 共${total}条`)
};

//  表格分页默认配置
export const tablePageDefaultOptForQy = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '20', '30', '50', '100', '200', '500'],
    size: 'small',
    showTotal: (total, range) => (`第${range[0]}-${range[1]}条 共${total}条`)
};


//  生成表格的列信息
export const generateColInfo = (columnsMap) => {
    let allWidth = 0;
    return [
        columnsMap.map((aColumn) => {
            const [dataIndex, title, render = null, width = 130, fixed = null, align = 'center'] = aColumn;
            allWidth += typeof width == 'number' ? width : 130;
            return { dataIndex, title, render, align, width, fixed };
        }),
        allWidth
    ];
};

//  下拉框输入查询
export const selectInputSearch = (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

/**
 * 异步查询结果
 * @param {Function} func 异步查询的函数
 * @param {Object} funcParams 异步查询的函数参数
 * @param {Number} intervalTime 异步查询间隔，默认1000ms
 * @param {Number} maxTryCount 异步查询尝试次数，默认200
 */
export const getResAsync = async (func, funcParams, intervalTime = 1000, maxTryCount = 200) => {
    let isEnd = false;
    let returnData;

    try {
        for (let i = 0; i < maxTryCount && !isEnd; i++) {
            let resData = await func(funcParams);
            //  ResData格式不确定
            const { State, TaskCode, TaskDesc, ...ResData } = resData.Data;
            if (State === 0) {
                //  任务在进行中
                message.loading('正在操作，请稍后...');
                //  等待1s
                await sleep(intervalTime);
            } else {
                //  任务已完成
                isEnd = true;
                if (TaskCode === 0) {
                    //  结束，数据返回正确
                    returnData = ResData;
                } else {
                    //  结束，操作失败
                    throw new Error(TaskDesc);
                }
            }
        }
    } catch (err) {
        throw new Error(err);
    }

    return returnData;
};

/**
 * 延迟执行函数
 * @param {Number} time 延迟时间
 */
const sleep = (time) => (new Promise((resolve) => {
    setTimeout(resolve, time);
}));