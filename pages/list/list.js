const api = require('../../api')
const app = getApp()

Page({
  data: {
    commodities: []
  },
  onLoad: function() {
    this._fetchData()
  },
  // 获取数据
  _fetchData: function() {
    let self = this
    let url = api.commodities
    wx.request({
      url:url,
      method: 'POST',
      success:function(res){
      if(res.data.code > 0) {
        self.setData({commodities:res.data.data.data})
      }
    }})
  }

})
