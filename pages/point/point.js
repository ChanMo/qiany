const api = require('../../api')
const app = getApp()

Page({
  data: {
    active: 'people', // 当前页面
    point: 0, // 积分余额
    team: [], // 团队列表
    log: [], // 积分记录
  },

  onLoad: function() {
    this._fetchPoint()
    this._fetchTeam()
    this._fetchLog()
  },

  /**
   * 设置激活页
   */
  setActive: function(e) {
    this.setData({active:e.currentTarget.dataset.value})
  },

  /**
   * 获取积分总数
   */
  _fetchPoint: function() {
    const self = this
    const url = api.point + "?token=" + app.globalData.token
    wx.request({
      url: url,
      success: (res)=>self.setData({point: res.data.data.userInfo.money})
    })
  },

  /**
   * 获取团队列表
   */
  _fetchTeam: function() {
    const self = this
    const url = api.team + "?token=" + app.globalData.token
    wx.request({
      url: url,
      success: (res)=>self.setData({team: res.data.data})
    })
  },

  /**
   * 获取积分记录
   */
  _fetchLog: function() {
    const self = this
    const url = api.pointLog + "?token=" + app.globalData.token
    wx.request({
      url: url,
      success: (res)=>self.setData({log: res.data.data})
    })
  }
})
