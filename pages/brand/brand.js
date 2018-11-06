const api = require('../../api')
const app = getApp()

Page({
  data: {
    id: 0,
    brand: {},
    commodities: []
  },
  onLoad: function(options) {
    this.setData({id:options['id']})
    this._fetchBrand()
    this._fetchCommodities()
  },
  onShareAppMessage: function(res) {
    return {
      title: '[代购商城] '+this.data.brand.name,
      path: '/pages/brand/brand?id=' + this.data.id
    }
  },
  _fetchBrand: function() {
    let self = this
    let url = api.brand + '?brand_id=' + this.data.id
    wx.request({url, success:function(res){
      self.setData({brand:res.data.data})
    }})
  },
  _fetchCommodities: function() {
    let self = this
    let url = api.commodities
    wx.request({url,
      method:'POST',
      data:{'brand_id':this.data.id},
      success: function(res) {
        self.setData({commodities: res.data.data.data})
      }
    })
  }
})
