//app.js
const api = require('./api')

App({
  globalData: {
    userInfo: null,
    p: 0, // 推广人ID
    uid: 0, // 用户ID
    token: null
  },

  /**
   * 启动
   */
  onLaunch: function (options) {
    if(options.query.p) {
      this.globalData.p = options.query.p
    }
    this._login()
  },

  /**
   * 登录
   */
  _login: function() {
    const self = this
    wx.login({
      success: res => {
        let url = api.login + '?code=' + res.code + '&p=' + self.globalData.p
        wx.request({url:url, success:function(res){
          if(res.data.code > 0) {
            self.globalData.token = res.data.data.token
            self.globalData.uid = res.data.data.user_id
            //wx.setStorageSync('token', res.data.data.token)
            self._getUserInfo()
          } else {
            wx.showToast({title:'登录失败'})
          }
        }})
      }
    })
  },

  /**
   * 更新用户信息
   */
  _getUserInfo: function() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              const url = api.sync + '?token=' + this.globalData.token
              wx.request({
                url: url,
                method: 'POST',
                data: res.userInfo
              })
            }
          })
        }
      }
    })

  }
})
