const bodyParser = require('body-parser');
const path = require('path');
const chokidar = require('chokidar');
const chalk = require('chalk');
const Mock = require('mockjs');
const pathToRegexp = require('path-to-regexp');

function mergeMockItem(mockData, mockItem, conf) {
    const pre = mockData[mockItem];
    const cur = require(mockItem);
    let mockPList = [];
    if (cur instanceof Array)
        for (let mockItem of cur) {
            if (mockItem.path && mockItem.method) {
                let mockP = `${mockItem.path } ${mockItem.method}`;
                mockPList.push(mockP);
                conf[mockP] = mockItem;
            }
        }
    if (pre)
        for (let pMockItem of pre) {
            if (pMockItem.path && pMockItem.method) {
                let mockP = `${pMockItem.path } ${pMockItem.method}`;
                if (mockPList.indexOf(mockP) < 0) {
                    delete conf[mockP];
                }
            }
        }
    mockData[mockItem] = cur;
    return Object.entries(conf);
}

module.exports = function (app, mockPath, mockConf = {}) {
    const mockData = {};
    let mockConfEntries = Object.entries(mockConf);
    const watchFile = 'scripts/mock';
    chokidar.watch(path.resolve(watchFile))
        .on('all', function (event, _path) {
            if (event === 'change' || event === 'add') {
                try {
                    const mockItem = `./mock/${path.parse(_path).base}`;
                    delete require.cache[require.resolve(mockItem)];
                    mockConfEntries = mergeMockItem(mockData, mockItem, mockConf);
                    console.log(`${chalk.black.bgGreen(` Done `)} Mocker Server: ${chalk.green(mockItem)} file replacement success!`);
                } catch (e) {
                    console.error(`${chalk.black.bgRed(` Failed `)} Mocker Server: file replacement failed!!`, e);
                }
            }
        });
    app.use(bodyParser.json());
    app.all('/api/*', function (req, res, next) {
        let mock = mockConfEntries.find(value => {
            let reqq = value[0].split(' ');
            if (reqq.length !== 2 || reqq[1] !== req.method.toLocaleLowerCase()) return false;
            return pathToRegexp('/api' + reqq[0]).exec(req.path);
        });
        if (mock) {
            res.send(Mock.mock(mock[1].response(req, res)));
        } else {
            next();
        }
    });

    return function (req, res, next) {
        next();
    };
};