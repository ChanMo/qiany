const api = require('../../api')
const app = getApp()
Page({
  data: {
    data: []
  },
  onShow: function() {
    wx.showLoading()
    let timer = setInterval(() => {
      if (app.globalData.token) {
        this._fetchData()
        clearInterval(timer)
        wx.hideLoading()
      }
    }, 1000)
  },
  _fetchData: function() {
    let self = this
    wx.request({
      url: api.blogList + '?token=' + app.globalData.token,
      success: function (res) {
        console.log(res)
        if(res.data.code>0){
          self.setData({ data: res.data.data })
        }
        
      }
    })
  }
})
