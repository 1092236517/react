import AliSignature from './AliSignature';

let getClient = function (oss) {
    return new Promise((resolve, reject) => {
        let client = new AliSignature().clientWrapper({
            bucket: oss.bucket,
            region: oss.region
        }).then((client) => {
            resolve(client);
        }, (error) => {
            reject(error);
        });
    });
};
export default getClient;