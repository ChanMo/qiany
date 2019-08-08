const api = require('../../api')
const app = getApp()

Page({
  data: {
    id: 0,
    data: null,
    list: [],
    order: null,
  },
  onLoad: function(options) {
    this.setData({id: options.order})
    wx.showLoading()
    let timer = setInterval(() => {
      if (app.globalData.token) {
        this.fetchData()
        this.fetchOrder()
        clearInterval(timer)
        wx.hideLoading()
      }
    }, 1000)
  },

  fetchData: function() {
    const self = this
    let url = api.delivery
    wx.request({
      url:url,
      method: 'POST',
      data: JSON.stringify({
        token: app.globalData.token,
        order_id: self.data.id
      }),
      success:res=>self.setData({
        data: res.data.data,
        list: res.data.data.Traces.map(item => {
          item.date = item.AcceptTime.substr(0,10)
          item.time = item.AcceptTime.substr(11,5)
          return item
          }).reverse()
        })
      })
  },

  // 获取商品信息
  fetchOrder: function () {
    let self = this
    let url = api.order + '?order_id=' + this.data.id + '&token=' + app.globalData.token
    wx.request({
      url, success: function (res) {
        self.setData({
          order: res.data.data.order
        })
      }
    })
  },
})
