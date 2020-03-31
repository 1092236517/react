let LazyLoadMap = function (opts) {
    const defaults = {};
    let config = Object.assign({}, defaults, opts);
    let normalPromise = new Promise(function (resolve, reject) {
        if (!window.BMap) {
            let eBody = document.body;
            let c = document.createElement('script');
            c.src = '//api.map.baidu.com/api?v=2.0&ak=utIIkRnygE6N0jTrsWNjksjVATGh4KrX&callback=init';
            c.type = 'text/javascript';
            eBody.appendChild(c);
            let timeout = 18;
            let si = setInterval(function () {
                if (timeout < 0 && !window.BMap) {
                    reject();
                } else {
                    if (!window.BMap) {
                        timeout--;
                    } else {
                        clearInterval(si);
                        resolve();
                    }
                }
            }, 1000);
        } else {
            resolve();
        }
    });
    let libPromise = new Promise(function (resolve, reject) {
        normalPromise.then(function () {
            if (!window.BMapLib) {
                let eBody = document.body;
                let d = document.createElement('script');
                d.src = '//api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js';
                d.type = 'text/javascript';
                eBody.appendChild(d);
                let dc = document.createElement('link');
                dc.href = '//api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css';
                dc.rel = 'stylesheet';
                eBody.appendChild(dc);
                let timeout = 18;
                let sd = setInterval(function () {
                    if (timeout < 0 && !window.BMapLib) {
                        reject();
                    } else {
                        if (!window.BMapLib) {
                            timeout--;
                        } else {
                            clearInterval(sd);
                            resolve();
                        }
                    }
                }, 1000);
            } else {
                resolve();
            }
        }, function () {
            reject();
        });
    });
    return config.needDraw ? libPromise : normalPromise;
};

export default LazyLoadMap;