const api = require('../../api')
const app = getApp()

Page({
  data: {
    amount: 0.00
  },
  onLoad: function(options) {
    this.setData({amount: options['amount']})
  },
  pay: function() {
    wx.showLoading({title:'支付请求中',mask:true})
    //wx.showToast({title:'支付成功'})
  }
})
