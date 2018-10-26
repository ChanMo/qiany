const api = require('../../api')
const app = getApp()

Page({
  data: {
    list: []
  },
  onLoad: function() {
    let data = [
      {'title':'【收货地址】中国山东省济南市高新区'},
      {'date':'08-23','time':'15:40','title':'已签收','content':'[日照市]已签收，签收者是本人','active':true},
      {'date':'08-22','time':'10:40','title':'派送中','content':'[日照市]正在为您配送'},
      {'date':'08-22','time':'8:40','title':'运输中','content':'[日照市]到达日照市'},
      {'date':'08-22','time':'8:40','title':'运输中','content':'[日照市]已发货'},
      {'date':'08-22','time':'8:40','title':'运输中','content':'[日照市]已揽件'},
      {'date':'08-22','time':'8:40','title':'运输中','content':'[日照市]已发货'}
    ]
    this.setData({list: data})
  }
})
