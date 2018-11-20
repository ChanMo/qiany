const api = require('../../api')
const app = getApp()
Page({
  data: {
    id: 0,
    modalVisible: false,
    modalAnimation: null,
    commodity: {},
    count: 1,
    content: null, // 图文详情
    spec: null, // 规则obj数据
    spec_ids: null // 子规则ids
  },

  onLoad: function(option) {
    let id = option['id']
    this.setData({id:id})
    this._fetchCommodity()
  },

  // 分享
  onShareAppMessage: function(res) {
    return {
      title: '[代购商城] '+this.data.commodity.detail.goods_name,
      path: '/pages/commodity/commodity?id=' + this.data.id
    }
  },

  // 选择规格
  setSpec: function(e) {
    let value = e.currentTarget.dataset.id
    let group = e.currentTarget.dataset.group
    let current = this.data.spec_ids
    current[group] = value
    this.setData({spec_ids: current})
    this.getSpecItem()
  },

  // 获取spec单条数据
  getSpecItem: function() {
    let ids = this.data.spec_ids.join('_')
    let result = this.data.commodity.detail.spec.filter(
      item => item.spec_sku_id == ids
    )
    console.log(result)
    if(result.length > 0) {
      this.setData({spec: result[0]})
    }
  },

  // 加入购物车
  addToCart: function() {
    const url = api.addToCart
    let data = {
      goods_id: this.data.id,
      goods_num: 1,
      goods_sku_id: this.data.spec.spec_sku_id,
      token: app.globalData.token
    }
    wx.request({url,
      method: 'POST',
      data: data,
      success: function(res) {
        if(res.data.code > 0) {
          wx.showToast({'title':'加入成功'})
        } else {
          wx.showToast({'title':res.data.msg})
        }
      },
      fail: function(){
        wx.showToast({'title':'服务器错误'})
      }
    })
  },
  // 获取商品信息
  _fetchCommodity: function() {
    let self = this
    let url = api.commodity + '?goods_id=' + this.data.id
    wx.request({url, success:function(res){
      if(res.data.code > 0) {
        self.setData({
          commodity: res.data.data,
          spec: res.data.data.detail.spec[0],
          spec_ids: res.data.data.detail.spec[0].spec_sku_id.split('_'),
          content: res.data.data.detail.content.replace(/<img /, '<img style="width:100%" ')
        })
      }
    }})
  },
  // 关闭modal
  onModalHide: function() {
    this.setData({modalVisible:false})
  },
  // 开启modal
  onModalShow: function() {
    this.setData({modalVisible:true})
  },
  onDecrease: function() {
    if(this.data.count == 1) {
      return
    }
    this.setData({count:this.data.count-1})
  },
  onIncrease: function() {
    this.setData({count:this.data.count+1})
  },
  buy: function() {
    wx.navigateTo({url:'/pages/buy/buy?commodity='+this.data.id+'&count='+this.data.count+'&sku='+this.data.spec.spec_sku_id})
  }
})
