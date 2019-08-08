const api = require('../../api')
const app = getApp()

Page({
  data: {
    slug: null,
    page: null,
    content: null
  },
  onLoad: function(option) {
    let slug = option['slug']
    this.setData({slug:slug})
    this._fetchPage()
  },
  _fetchPage: function() {
    let self = this
    let url = api.page + '?code=' + this.data.slug
    wx.request({url:url, success:function(res){
      let content = res.data.data.content.replace(new RegExp('<img ', 'g'), '<img style="width:100%;height:100%;" ')
      content = content.replace(new RegExp('style=""', 'g'), '')
      self.setData({
        page:res.data.data,
        content: content
      })
    }})
  }
})
