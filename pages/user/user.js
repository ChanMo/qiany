const api = require('../../api')
const app = getApp()

Page({
  data: {
    user: null,
    link: [], // 功能链接
    order: [], // 订单链接
    point: 0, // 积分
  },
  onShow: function() {
    this.setData({user:app.globalData.userInfo})
    this._setOrder()
    this._fetchLink()
    this.fetchPoint()
  },


  /**
   * 获取积分总数
   */
  fetchPoint: function () {
    const self = this
    const url = api.point + "?token=" + app.globalData.token
    wx.request({
      url: url,
      success: (res) => self.setData({ point: res.data.data.userInfo.money })
    })
  },
  /**
   * 设置功能列表
   */
  _fetchLink: function() {
    let data = [
      {"name":"我的二维码","icon":"../../images/qrcode2.png","path":"/pages/qrcode/qrcode"},
      {"name":"实名认证","icon":"../../images/shimingrenzheng.png","path":"/pages/auth/auth"},
      {"name":"积分中心","icon":"../../images/wodefenxiao.png","path":"/pages/point/point"},
      {"name":"地址管理","icon":"../../images/dizhiguanli.png","path":"/pages/addresses/addresses"},
      { "name": "积分规则", "icon":"../../images/jifenguize.png","path":"/pages/jifenguize/jifenguize"},
      {"name":"买家须知","icon":"../../images/maijiaxuzhi.png","path":"/pages/maijiaxuzhi/maijiaxuzhi"}
    ]
    this.setData({link:data})
  },

  /**
   * 设置订单链接
   */
  _setOrder: function() {
    let data = [
      {"name": "全部订单", "icon": "../../images/quanbudingdan.png", "param": "all" },
      {"name":"待付款","icon":"../../images/daifukuan.png","param":"payment"},
      {"name":"待发货","icon":"../../images/daifahuo.png","param":"delivery"},
      {"name":"待收货","icon":"../../images/daishouhuo.png","param":"received"},
      {"name":"退款","icon":"../../images/tuikuan.png","param":"refund"}
    ]
    this.setData({order:data})
  },


})
