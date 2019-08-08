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
    spec_ids: null, // 子规则ids
    categoryId: 0, // 当前分类ID
    siblings: [],
    cartCount: 0, // 购物车商品数量
    index: 1, // banner active
  },

  onLoad: function(option) {
    let id = option['id']
    this.setData({id:id})
    this._fetchCommodity()
    this._fetchCart()
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
    let index = e.currentTarget.dataset.index + 1
    let value = e.currentTarget.dataset.id
    let group = e.currentTarget.dataset.group
    let current = this.data.spec_ids
    current[group] = value
    this.setData({
      index: index,
      spec_ids: current
    })
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
    wx.showLoading({title:'处理中', mask:true})
    const self = this
    const url = api.addToCart
    let data = {
      goods_id: this.data.id,
      goods_num: this.data.count,
      goods_sku_id: this.data.spec.spec_sku_id,
      token: app.globalData.token
    }
    wx.request({url,
      method: 'POST',
      data: data,
      success: function(res) {
        console.log(url)
        console.log(res)
        if(res.data.code > 0) {
          self.setData({modalVisible: false})
          wx.showToast({'title':'加入成功'})
          self._fetchCart()
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
    let url = api.commodity + '?goods_id=' + this.data.id + '&token=' + app.globalData.token
    wx.request({url, success:function(res){
      if(res.data.code > 0) {
        let content = res.data.data.detail.content.replace(new RegExp('<img ', 'g'), '<img style="width:100%;height:100%;" ')
        content = content.replace(new RegExp('style=""', 'g'), '')
        self.setData({
          commodity: res.data.data,
          spec: res.data.data.detail.spec[0],
          spec_ids: res.data.data.detail.spec[0].spec_sku_id.split('_'),
          content: content,
          categoryId: res.data.data.detail.category_id
          //content: res.data.data.detail.content.replace(/<img /, '<img style="width:100%" ')
        })
        self.fetchSiblings()
      }
    }})
  },
  /**
   * 获取相关商品
   */
  fetchSiblings: function() {
    let url = api.commodities + '?token=' + app.globalData.token
    const self = this
    wx.request({
      url:url,
      data: {category:self.data.category_id},
      method: 'POST',
      success:function(res){
        if(res.data.code > 0) {
          let data = res.data.data.data.slice(0,9)
          let newData = []
          let j = 0
          let k = 0
          for(let i = 0; i<data.length; i++) {
            j = parseInt(i / 3)
            k = i % 3
            if(k == 0) {
              newData[j] = []
            }
            newData[j][i%3] = data[i]
          }
          console.log(newData)
          self.setData({
            siblings: newData
          })
        }
      },
      complete: function() {
        self.setData({fetching: false})
      }
    })
  },

  /**
   * 获取购物车数量
   */
  _fetchCart: function () {
    let self = this
    let url = api.cart
    wx.request({
      url,
      method: 'POST',
      data: { token: app.globalData.token },
      success: function (res) {
        console.log(res)
        if (res.data.code > 0) {
          self.setData({
            cartCount: res.data.data.order_total_num
          })
        }
      }
    })
  },
  // 关闭modal
  onModalHide: function() {
    this.setData({modalVisible:false})
  },
  // 开启modal
  onModalShow: function(e) {
    let action = e.currentTarget.dataset.action
    this.setData({
      action: action,
      modalVisible:true
    })
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
    this.setData({modalVisible:false})
    wx.navigateTo({url:'/pages/buy/buy?commodity='+this.data.id+'&count='+this.data.count+'&sku='+this.data.spec.spec_sku_id})
  },

  /**
   * 点击确定
   */
  onAction: function() {
    let action = this.data.action
    if(action == 'buy') {
      this.buy()
    } else {
      this.addToCart()
    }
  },

  /**
   * 进入page
   */
  onGoPage: function(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({url:'/pages/page/page?slug=' + id})
  }
})
