//index.js
//获取应用实例
const api = require('../../api')
const app = getApp()

const countries = [
  { "code": "CN", "name": "中国" },
  { "code": "KR", "name": "韩国" },
  { "code": "AU", "name": "澳洲" },
  { "code": "UK", "name": "英国" }
]

//var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
Page({
  data: {
    userInfo: {},
    banner: [],
    link: [],
    hot: [],
    countryCode: 'CN',
    array: ['中国', '韩国', '英国', '澳洲'],
    index: 0,
    objectArray: [
      {
        id: 0,
        name: '中国'
      },
      {
        id: 1,
        name: '韩国'
      },
      {
        id: 2,
        name: '英国'
      },
      {
        id: 3,
        name: '澳洲'
      }
    ],
  },
  onShareAppMessage: function (res) {
    return {
      title: '千樱',
      path: '/pages/index/index'
    }
  },
  // 获取轮播图数据
  _fetchBanner: function () {
    let self = this
    wx.request({
      url: api.banner + '?token=' + app.globalData.token, success: function (res) {
        if (res.data.code > 0) {
          self.setData({ banner: res.data.data })
        }
      }
    })
  },

  // 获取链接
  _fetchLink: function () {
    let self = this
    wx.request({
      url: api.link + '?token=' + app.globalData.token, success: function (res) {
        if (res.data.code > 0) {
          self.setData({ link: res.data.data })
        }
      }
    })
  },

  // 获取推荐商品
  _fetchHot: function () {
    let self = this
    let url = api.recommand + '?token=' + app.globalData.token
    wx.request({
      url: url,
      success: function (res) {
        console.log(res)
        self.setData({ hot: res.data.data })
      }
    })
  },

  /**
   * 获取国家信息
   */
  getCountry: function () {
    let countryCode = wx.getStorageSync('countryCode')
    if (!countryCode) {
      countryCode = 'CN'
    }
    let countryIndex = wx.getStorageSync('countryIndex')
    if (!countryIndex) {
      countryIndex = 0
    }
    this.setData({
      countryCode: countryCode,
      index: countryIndex
    })
    this.updateCountry(countryCode)

  },

  /**
   * 更新用户所在国家
   */
  updateCountry: function (code) {
    let url = api.country
    wx.request({
      url: url,
      method: 'POST',
      data: { 'code': code, 'token': app.globalData.token },
      success: res => console.log(res)
    })
  },

  // 首次加载
  onShow: function () {
    this.getCountry()
    this._fetchBanner()
    this._fetchLink()
    this._fetchHot()
  },

  /**
   * 手动选择国家
   */
  bindPickerChange: function (e) {
    const countryName = this.data.objectArray[e.detail.value]['name'];
    //app.globalData.countryid = parseInt(e.detail.value);
    //app.globalData.countryname = this.data.objectArray[e.detail.value]['name'];
    //
    let countryCode = countries.filter((item) => item.name == countryName)[0].code
    this.setData({
      countryCode: countryCode,
      index: e.detail.value
    })
    wx.setStorageSync('countryCode', countryCode)
    wx.setStorageSync('countryIndex', e.detail.value)
    this.updateCountry(countryCode)
    this._fetchBanner()
    this._fetchLink()
    this._fetchHot()
  },
})
