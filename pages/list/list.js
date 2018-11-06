const api = require('../../api')
const app = getApp()

Page({
  data: {
    active: 0,
    category: [],
    commodities: []
  },
  onLoad: function(options) {
    this.setData({active: options.category})
    this._fetchCategory()
  },
  _fetchCategory: function() {
    wx.showLoading()
    let self = this
    wx.request({url: api.category, success: function(res) {
      if(res.data.code > 0) {
        let category = res.data.data.cate_list
        self.setData({
          category: category
        })
        self._fetchData()
      }
    }})
  },
  setActive: function(e) {
    this.setData({active:e.currentTarget.dataset.value})
    this._fetchData()
  },
  // 获取数据
  _fetchData: function() {
    wx.showLoading()
    let self = this
    let url = api.commodities
    wx.request({
      url:url,
      data: {'category':self.data.active},
      method: 'POST',
      success:function(res){
        if(res.data.code > 0) {
          self.setData({commodities:res.data.data.data})
        }
      },
      complete: function() {
        wx.hideLoading()
      }
    })
  }

})
