const api = require('../../api')
const app = getApp()

Page({
  data: {
    data: [],
    buy:0
  },

  onLoad: function(options) {
    if (options['type'] === 'buy'){
      this.setData({buy:1})
    }
  },

  onShow: function() {
    this._fetchAddress()
  },

  selectaddress: function(e){
    var that = this;
    
    wx.navigateBack();
    // 往上一级页面传参
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; // 当前页面
    var prevPage = pages[pages.length - 2]; // 上一级页面

    // 直接调用上一级页面Page对象，存储数据到上一级页面中
    var addressid = e.currentTarget.dataset.addressid;
    wx.request({
      url: api.addressdetail + '?address_id=' + addressid + '&token=' + app.globalData.token,
      success: res => prevPage.setData({ address: res.data.data })
    })
  },

  /**
   * 获取地址列表
   */
  _fetchAddress: function() {
   
    const self = this
    let url = api.address + '?token=' + app.globalData.token
    if(this.data.buy) {
      url += '&c=true'
    }
    wx.request({
      url: url,
      success: function (res) {
        console.log(res)
        self.setData({ list: res.data.data})
      }
    })
  }
})
