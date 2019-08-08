const api = require('../../api')
const app = getApp()

const countries = [
  {"code":"CN","name":"中国"},
  {"code":"KR","name":"韩国"},
  { "code": "UK", "name": "英国" },
  { "code": "AU", "name": "澳洲" }
]

Page({
  data: {
    id: 0,
    data: null,
    region: ['北京市', '北京市', '东城区'],
    countries: countries,
    index: 0,
  },

  onLoad: function(options) {
    const self = this
    if(options['id']) {
      this.setData({id:options['id']})
      this.fetchData()
    }
  },

  /**
   * 获取地址
   */
  fetchData: function() {
    const self = this
    let url = api.addressdetail + '?address_id=' + this.data.id + '&token=' + app.globalData.token
    wx.request({
      url: url,
      success: function (res) {
        if (res.data.code > 0) {
          self.setData({ 
            data: res.data.data, 
            index: countries.findIndex(item=>item.name == res.data.data.country),
            region: res.data.data.region, 
          })
        }
      }
    })
  },

  /**
   * 选择国家
   */
  onChangeCountry: function(e) {
    this.setData({index: e.detail.value})
  },
  onChangRegion: function(e) {
    this.setData({region: e.detail.value})
  },

  /**
   * 提交表单
   */
  onSubmit: function(e) {
    let data = e.detail.value
    console.log(data)
    if(!data.name) {
      wx.showToast({title:'请输入收件人'})
      return
    }
    if(!data.phone) {
      wx.showToast({title:'请输入手机号'})
      return
    }
    if(data.code == 'AU' && data.phone.length !== 10) {
      wx.showToast({title:'手机号码错误'})
      return
    }
    if(data.code != 'AU' && data.phone.length !== 11) {
      wx.showToast({title:'手机号码错误'})
      return
    }
    if(!data.detail) {
      wx.showToast({title:'请输入街道信息'})
      return
    }

    let url = api.addressadd

    // 如果是更新
    if(this.data.id) {
      data['address_id'] = this.data.id
      url = api.addressedit
    }
    data['default'] = data['default'][0] ? true : false
    data['token'] = app.globalData.token

    let self = this
    wx.request({
      url,
      method: 'POST',
      data: data,
      success: function (res) {
        if (res.data.code > 0) {
          wx.showToast({ 'title': '保存成功' })
          wx.navigateBack()
        }
      }
    })
  },

  onDelete: function() {
    wx.showModal({
      content:'确定删除？',
      success: (res)=>{
        if(res.confirm) {
          let self = this
          let url = api.addressdelete
          wx.request({
            url,
            method: 'POST',
            data: { address_id: self.data.id, token: app.globalData.token},
            success: function (res) {
              console.log(res)
              if (res.data.code > 0) {
                wx.showToast({ 'title': '删除成功' })
                wx.navigateBack();
              }
            }
          })
        }
      }
    })
  }
})
