const api = require('../../api')
const app = getApp()

Page({
  data: {
    search: null,
    keywords: [] // 热门搜索
  },

  onLoad: function() {
    this._fetchHotSearch()
  },

  /**
   * 获取热门搜索
   */
  _fetchHotSearch: function() {
    const self = this
    const url = api.search
    wx.request({
      url: url,
      success: (res)=>self.setData({keywords:res.data.data})
    })
  },

  /**
   * 设置搜索词
   */
  setValue: function(e) {
    let value = e.detail.value
    wx.navigateTo({url: '/pages/list/list?search='+value})
  }
})
