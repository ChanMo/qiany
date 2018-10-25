const api = require('../../api')
const app = getApp()

Page({
  data: {
    address: null,
    data: null,
    price: 0
  },
  onLoad: function() {
    this._fetchData()
  },
  _fetchData: function() {
    let url = api.buy + '?token=' + app.globalData.token + '&act=confirm'
    wx.request({url, success:res=>this.setData({data:res.data.data})})
  },

  /** 计算价格 **/
  _makePrice: function() {
    let price = 0
    this.data.commodities.map(item => price += item.price * item.count)
    this.setData({price:price})
  },

  chooseAddress: function() {
    let self = this
    wx.getSetting({success:function(res) {
      if(res.authSetting['scope.address']) {
        self._chooseAddress(self)
      } else {
        wx.authorize({scope:'scope.address',success:function(res) {
          self._chooseAddress(self)
        }})
      }
    }})
  },
  _chooseAddress: function(e) {
    wx.chooseAddress({success:function(result) {
      e.setData({address: result})
    }})
  },
  submit: function() {
    if(!this.data.address) {
      wx.showToast({mask:true,title:'请选择收货地址',icon:'error'})
    }
  }
})
