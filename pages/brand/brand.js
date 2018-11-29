const api = require('../../api')
const app = getApp()

Page({
  data: {
    id: 0,
    brand: {},
    commodities: [],
    sort: 'all', // 排序方式
    asc: true, // 价格正序
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
  /*
   * 设置排序方式
   */
  setSort: function(e) {
    const value = e.currentTarget.dataset.value

    // 如果是价格
    if(this.data.sort == 'price' && value == 'price') {
      let asc = e.currentTarget.dataset.asc == 'true'
      this.setData({asc: !asc})
    }

    this.setData({sort: value})
    this._fetchCommodities()
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
      data:{
        brand_id: this.data.id,
        sortType: this.data.sort,
        sortPrice: this.data.asc,
      },
      success: function(res) {
        self.setData({commodities: res.data.data.data})
      }
    })
  }
})
