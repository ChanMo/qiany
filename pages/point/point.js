const api = require('../../api')
const app = getApp()

Page({
  data: {
    active: 'people', // 当前页面
    point: 0, // 积分余额
    team: [], // 团队列表
    log: [], // 积分记录
    logFrom: [], // 积分来源
    logTo: [] // 积分使用
  },

  onLoad: function() {
    this._fetchPoint()
    this._fetchTeam()
    //this._fetchLog()
    this.fetchLogFrom()
    this.fetchLogTo()
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
  },

  fetchLogFrom: function() {
    const self = this
    const url = api.pointFrom + '?token=' + app.globalData.token
    wx.request({url, success:res=>self.setData({logFrom: res.data.data.data})})
  },

  fetchLogTo: function () {
    const self = this
    const url = api.pointTo + '?token=' + app.globalData.token
    wx.request({ url, success: res => self.setData({ logTo: res.data.data.data }) })
  },  

  onGoLog: function() {
    wx.navigateTo({ url: '/pages/pointLog/pointLog' })
  }
})
