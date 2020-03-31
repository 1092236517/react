module.exports = {
  port: 9200,
  modes: {
    dev: 'development',
    prod: 'production'
  },
  //  entries下配置的path相对src目录
  entries: [{
    name: 'admin',
    title: {
      development: '周薪薪admin-开发',
      production: '周薪薪运营管理平台'
    },
    entry: 'admin/index.js',
    template: 'admin/index.html',
    favicon: 'admin/assets/images/admin.favicon.ico',
    filename: {
      development: 'admin/index.html',
      production: '../admin/index.html'
    }
  }],
  proxy: './proxy.config.js',
  mock: './mock.config.js',
  antdCover: {
    'font-size-base': '13px',
    'form-item-margin-bottom': '16px'
  }
};