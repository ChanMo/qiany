const api = require('../../api')
const app = getApp()

Page({
  data: {
    data: null,
    front: null,
    frontFile: null,
    back: null,
    backFile: null
  },

  onLoad: function() {
    this.fetchData()
  },

  fetchData: function() {
    const self = this
    let url = api.authList + '?token=' + wx.getStorageSync('token')
    wx.request({url, success:(res)=>{
      if(res.data.data.list.length > 0) {
        let data = res.data.data.list[0]
        self.setData({
          frontFile: data.front,
          front: 'http://api.uaiworld.com' + data.front,
          backFile: data.back,
          back: 'http://api.uaiworld.com' + data.back,
          data: res.data.data.list[0]
        })
      }
    }})
  },

  onSubmit: function(e) {
    let value = e.detail.value
    console.log(value)
    if(value.name.length <= 1) {
      wx.showToast({title:'请输入真实姓名'})
      return
    }
    if(value.cardno.length !== 18) {
      wx.showToast({title:'请输入身份证号码'})
      return
    }
    if(value.mobile.length !== 11) {
      wx.showToast({title:'请输入手机号码'})
      return
    }
    value['front'] = this.data.frontFile
    value['back'] = this.data.backFile
    value['token'] = wx.getStorageSync('token')

    let url = api.createAuth
    if(this.data.data) {
      value['info_id'] = this.data.data.info_id
      url = api.updateAuth
    }
    wx.request({
      url: url,
      method: 'POST',
      data: value,
      success: (res)=>{
        if(res.data.code == 1) {
          wx.showToast({title:'更新成功'})
        } else {
          wx.showToast({title:res.data.msg})
        }
      }
    })
  },

  /**
   * 选择图片
   */
  onChooseImage: function(e) {
    const self = this
    let formName = e.currentTarget.dataset.name
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: (res)=>{
        let file = res.tempFilePaths[0]
        if(formName == 'front') {
          self.setData({front: file})
        } else {
          self.setData({back: file})
        }
        wx.uploadFile({
          url: api.upload,
          filePath: file,
          name: 'file',
          formData: {
            token: wx.getStorageSync('token')
          },
          success(res) {
            console.log(res)
            const data = JSON.parse(res.data)
            if(data.code == 1) {
              if(formName == 'front') {
                self.setData({frontFile: data.data.src})
              } else {
                self.setData({backFile: data.data.src})
              }
            } else {
              wx.showToast({title:data.msg})
            }
          }
        })
      }
    })
  }
})
