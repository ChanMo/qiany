const api = require('../../api')
const app = getApp()

Page({
  data: {
    article: null,
    content: null
  },
  onLoad: function(option) {
    this.setData({id:option['id']})
    this._fetchArticle()
  },
  _fetchArticle: function() {


    let self = this
    wx.request({
      url: api.blog + '?id=' + self.data.id + '&token=' + app.globalData.token,
      success: function (res) {
        if (res.data.code > 0) {
          let content = res.data.data.content.replace(new RegExp('<img ', 'g'), '<img style="width:100%;height:100%;" ')
          content = content.replace(new RegExp('style=""', 'g'), '')
          self.setData({
            article: res.data.data,
            content: content
          })
        }

      }
    })
  }
})
