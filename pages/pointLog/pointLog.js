// pages/pointLog.js
const api = require('../../api')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchLog()

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 获取积分记录
   */
  fetchLog: function () {
    const self = this
    const url = api.pointLog + "?token=" + app.globalData.token
    wx.request({
      url: url,
      success: (res) => self.setData({ data: res.data.data.data })
    })
  },
})