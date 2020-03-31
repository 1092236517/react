const host = 'http://zxx-admin.sit.woda.ink';
// const host = 'http://zxx-admin.alpha.woda.ink';
module.exports = [
    {
        context: (pathname, req) => !!pathname.match(/^\/api\//),
        opts: {
            target: host, changeOrigin: true
            // , pathRewrite: {'^/api': '/'}
        }
    }
];