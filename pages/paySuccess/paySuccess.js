Page({
  data: {
    id: 0
  },
  onLoad: function(options) {
    this.setData({id: options.id})
  },
  onGoHome: function() {
    wx.switchTab({url: '/pages/index/index'})
  }
})
