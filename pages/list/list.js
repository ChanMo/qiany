const api = require("../../api")

Page({
  data: {
    sort: 'all', // 排序方式
    asc: true, // 价格正序
    category: 0, // 分类
    search: null, // 搜索内容
    data: [] // 数据
  },

  onLoad: function(options) {
    if(options.category) {
      this.setData({category: options.category})
    }
    if(options.search) {
      this.setData({search: options.search})
    }
    this._fetchData()
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function() {
    this._fetchData()
    wx.stopPullDownRefresh()
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
    this._fetchData()
  },

  /**
   * 获取商品列表
   */
  _fetchData: function() {
    let self = this
    let url = api.commodities
    wx.request({
      url:url,
      data: {
        category_id: this.data.category,
        sortType: this.data.sort,
        sortPrice: this.data.asc,
        search: this.data.search
      },
      method: 'POST',
      success:function(res){
      if(res.data.code > 0) {
        self.setData({data:res.data.data.data})
      }
    }})
  }
})
