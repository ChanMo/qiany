const api = require('../../api')
const app = getApp()

Page({
  data: {
    active: 'all',
    orders: []
  },
  onLoad: function(option) {
    option['active'] && this.setData({active:option['active']})
  },
  onShow: function() {
    this._fetchOrder()
  },
  setActive: function(e) {
    let value = e.currentTarget.dataset.value
    this.setData({active:value})
    this._fetchOrder()
  },
  _fetchOrder: function() {
    let self = this
    let url = api.orderList + '?token=' + app.globalData.token
    wx.request({url:url,
      data: {'dataType':self.data.active},
      method: 'POST',
      success: function(res) {
        self.setData({orders: res.data.data.list})
      }
    })
  },
  /**
   * 微信支付
   */
  pay: function(e) {
    let id = e.currentTarget.dataset.id
    wx.showLoading({title:'支付请求中',mask:true})
    const url = api.pay + '?token=' + wx.getStorageSync('token') + '&order_id=' + id
    wx.request({url, success:res=>{
      if(res.data.code == 1) {
        wx.requestPayment({
          timeStamp: res.data.data.timeStamp,
          nonceStr: res.data.data.nonceStr,
          package: 'prepay_id='+res.data.data.prepay_id,
          signType: 'MD5',
          paySign: res.data.data.paySign,
          success: ress=>{
            console.log(ress)
            wx.navigateTo({url:'/pages/paySuccess/paySuccess?id='+id})
          },
          fail: error=>{
            wx.showToast({title:'支付失败'})
          }
        })

      } else {
        wx.showToast({title:res.data.msg})
      }
    }, complete:()=>{
      wx.hideLoading()
    }})
    //wx.showToast({title:'支付成功'})
  }

})
