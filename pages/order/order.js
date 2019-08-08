const api = require('../../api')
const app = getApp()

Page({
  data: {
    id: 0,
    token: wx.getStorageSync('token'),
    order: null,
    point: 0
  },
  onLoad: function(option) {
    this.setData({id:option['id']})
  },
  onShow: function() {
    this._fetchData()
  },
  _fetchData: function() {
    let self = this
    //let url = api.order + '?token=' + this.data.token
    let url = api.order + '?token=' + app.globalData.token
    wx.request({url:url,
      method: 'POST',
      data: {'order_id':self.data.id},
      success: function(res) {
        self.setData({
          order:res.data.data.order,
          point: parseInt(res.data.data.order.total_price/10)
          })
      }
    })
  },

  /**
   * 微信支付
   */
  pay: function() {
    wx.showLoading({title:'支付请求中',mask:true})
    const url = api.pay + '?token=' + wx.getStorageSync('token') + '&order_id=' + this.data.id
    wx.request({url, success:res=>{
      if(res.data.code == 1) {
        wx.requestPayment({
          timeStamp: res.data.data.timeStamp,
          nonceStr: res.data.data.nonceStr,
          package: 'prepay_id='+res.data.data.prepay_id,
          signType: 'MD5',
          paySign: res.data.data.paySign,
          success: ress=>{
            wx.navigateTo({url:'/pages/paySuccess/paySuccess?id='+id})
          },
          fail: error=>{
            wx.showToast({title:'支付失败'})
            //wx.navigateTo({url:'/pages/order/order?id='+id})
          }
        })
      } else {
        wx.showToast({title:res.data.msg})
      }
    }, complete:()=>{
      wx.hideLoading()
    }})
    //wx.showToast({title:'支付成功'})
  },

  /**
   * 进入page
   */
  onGoPage: function(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({url:'/pages/page/page?slug=' + id})
  }

})
