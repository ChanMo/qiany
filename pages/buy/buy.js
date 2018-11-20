const api = require('../../api')
const app = getApp()

Page({
  data: {
    address: null, // 地址对象
    data: null, //
    price: 0, // 总金额
    commodity: 0, // 商品ID
    count: 0, // 数量
    sku: null // 参数商品
  },
  onLoad: function(options) {
    if(options['commodity']) {
      // 如果来自商品详情
      this.setData({
        from: 'goods',
        commodity: options['commodity'],
        count: options['count'],
        sku: options['sku']
      })
    } else {
      // 如果来自购物车
      this.setData({from:'cart'})
    }
    // 获取数据
    this._fetchData()
  },


  // 获取数据
  _fetchData: function() {
    let url = api.buy
    let data = {
      token: app.globalData.token,
      act: 'confirm',
      from: this.data.from
    }
    if(this.data.from == 'goods') {
      data['goods_id'] = this.data.commodity
      data['goods_sku_id'] = this.data.sku
      data['goods_num'] = this.data.count
    }
    wx.request({
      url:url,
      method:'post',
      data: data,
      success:res=>this.setData({data:res.data.data})})
  },

  // 选择收货地址
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
    wx.showLoading({title:'处理中',mask:true})

    // 如果未选择收货地址
    if(!this.data.address) {
      wx.showToast({
        mask:true,
        title:'请选择收货地址'
      })
      return
    }

    // 发送数据
    let self = this
    let url = api.buy
    let data = {
      token: app.globalData.token,
      act: 'submit',
      from: this.data.from,
      address: this.data.address,
    }
    // 如果是来自商品详情
    if(this.data.from == 'goods') {
      data['goods_id'] = this.data.commodity
      data['goods_sku_id'] = this.data.sku
      data['goods_num'] = this.data.count
    }

    wx.request({
      url: url,
      method: 'POST',
      data: data,
      success: (res)=>{
        if(res.data.code == 1) {
          wx.navigateTo({url:'/pages/pay/pay?amount='+res.data.data.order_amount+'&order='+res.data.data.order_id})
        } else {
          wx.showToast({title:res.data.msg})
        }
      },
      fail: ()=>wx.showToast({title:'服务器错误'}),
      complete: ()=>wx.hideLoading()
    })
  }
})
