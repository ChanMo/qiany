const api = require('../../api')
const app = getApp()

Page({
  data: {
    data: []
  },

  onLoad: function() {
    this._fetchAddress()
  },

  /**
   * 获取地址列表
   */
  _fetchAddress: function() {
    this.setData({
      data: [
        {'id':1, 'name':'ChanMo', 'mobile':'15550001234', 'region':'山东济南高新区', 'street':'会展西路88号','default':true},
        {'id':2, 'name':'小花花', 'mobile':'15550001238', 'region':'山东烟台开发区', 'street':'滨海路2号','default':false},
      ]
    })
    return
    const self = this
    const url = api.address + '?token=' + app.globalData.token
    wx.request({
      url: url,
      success: (res)=>self.setData({data: res.data.data})
    })
  }
})
