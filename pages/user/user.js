const api = require('../../api')
const app = getApp()

Page({
  data: {
    user: null,
    link: [], // 功能链接
    order: [], // 订单链接
  },
  onLoad: function() {
    this.setData({user:app.globalData.userInfo})
    this._setOrder()
    this._fetchLink()
  },

  /**
   * 获取用户信息
   */
  onGotUserInfo: function(res) {
    let userInfo = res.detail.userInfo
    app.globalData.userInfo = userInfo
    this.setData({user:userInfo})
  },

  /**
   * 设置功能列表
   */
  _fetchLink: function() {
    let data = [
      {"name":"我的二维码","icon":"http://doyou.oss-cn-beijing.aliyuncs.com/icon/qrcode.png","path":"/pages/qrcode/qrcode"},
      {"name":"我的分销","icon":"http://doyou.oss-cn-beijing.aliyuncs.com/icon/user.png","path":"/pages/point/point"},
      {"name":"积分规则","icon":"http://doyou.oss-cn-beijing.aliyuncs.com/icon/point.png","path":"/pages/page/page?slug=1"},
      {"name":"买家须知","icon":"http://doyou.oss-cn-beijing.aliyuncs.com/icon/book.png","path":"/pages/page/page?slug=2"}
    ]
    this.setData({link:data})
  },

  /**
   * 设置订单链接
   */
  _setOrder: function() {
    let data = [
      {"name":"待付款","icon":"http://doyou.oss-cn-beijing.aliyuncs.com/icon/nopay.png","param":"payment"},
      {"name":"待发货","icon":"http://doyou.oss-cn-beijing.aliyuncs.com/icon/gift.png","param":"delivery"},
      {"name":"待收货","icon":"http://doyou.oss-cn-beijing.aliyuncs.com/icon/delivery.png","param":"received"},
      {"name":"已收货","icon":"http://doyou.oss-cn-beijing.aliyuncs.com/icon/send.png","param":"finished"},
      {"name":"退款","icon":"http://doyou.oss-cn-beijing.aliyuncs.com/icon/refund.png","param":"refund"}
    ]
    this.setData({order:data})
  },

  /**
   * 更新用户头像等信息
   */
  getUserInfo: function(e) {
    if(!e.detail.userInfo) {
      return
    }
    app.globalData.userInfo = e.detail.userInfo
    this.setData({user: e.detail.userInfo})
    // 更新用户数据
    const url = api.sync + '?token=' + app.globalData.token
    wx.request({
      url: url,
      method: 'POST',
      data: e.detail.userInfo
    })
  }

})
