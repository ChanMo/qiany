const app = getApp()
const api = require("../../api")

Page({
  data: {
    sort: 'all', // 排序方式
    asc: true, // 价格正序
    category: 0, // 分类
    search: null, // 搜索内容
    data: [], // 数据
    end: false, // 是否结束
    currentPage: 0, // 当前页面
    totalPage: 1, // 总页数
    fetching: true,
    menu: 0, // 首页按钮
    index: 0, // 顶部banner, 首页10按钮
    ad: []
  },

  onLoad: function(options) {
    if(options.menu) {
      this.setData({menu: parseInt(options.menu)})
    }
    if(options.category) {
      this.setData({category: options.category})
    }
    if(options.search) {
      this.setData({search: options.search})
    }
    if(options.index) {
      this.setData({index: parseInt(options.index) + 1})
    }
    this._fetchData()
    this._fetchAd()
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function() {
    this._fetchData()
    wx.stopPullDownRefresh()
  },

  _fetchAd: function () {
    let self = this
    let url = api.banner + '?token=' + app.globalData.token + '&menu=C'+this.data.index
    wx.request({
      url: url,
      success: function (res) {
        self.setData({ ad: res.data.data })
      }
    })
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
    this._fetchData(true)
  },

  /**
   * 获取商品列表
   */
  _fetchData: function(refreshing=false) {
    console.log('refreshing:', refreshing)
    let self = this
    let url = api.commodities + '?token=' + app.globalData.token
    let page = this.data.currentPage + 1
    if(refreshing) {
      page = 1
    }
    if(page > this.data.totalPage && !refreshing) {
      // 如果已经是最后一夜
      return
    }
    let data = {
      category_id: this.data.category,
      sortType: this.data.sort,
      sortPrice: this.data.asc,
      search: this.data.search,
      page: page,
    }
    if(this.data.menu) {
      data['menu'] = this.data.menu
    }
    wx.request({
      url:url,
      data: data,
      method: 'POST',
      success:function(res){
        if(res.data.code > 0) {
          let data = res.data.data.data
          if(refreshing) {
            // 如果是刷新
          } else {
            data = self.data.data.concat(data)
          }
          self.setData({
            data: data,
            currentPage: res.data.data.current_page,
            totalPage: res.data.data.last_page,
          })
        }
      },
      complete: function() {
        self.setData({fetching: false})
      }
    })
  },

  /**
   * 加载更多
   */
  onLoadMore: function(e) {
    if(this.data.fetching) {
      return
    }
    if(this.data.currentPage == this.data.totalPage) {
      return
    }
    this.setData({fetching: true})
    this._fetchData()
  }
})
