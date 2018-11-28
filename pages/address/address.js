const api = require('../../api')
const app = getApp()

const countries = [
  {"code":"CN","name":"中国"},
  {"code":"JP","name":"日本"},
  {"code":"KR","name":"韩国"}
]

Page({
  data: {
    id: 0,
    data: [],
    countries: countries,
    index: 0,
    region: ["北京","北京","北京"]
  },

  onLoad: function(options) {
    if(options['id']) {
      this.setData({id: options['id']})
      this._fetchAddress()
    }
  },

  /**
   * 获取地址
   */
  _fetchAddress: function() {
    this.setData({
      data: {'id':1, 'name':'ChanMo', 'mobile':'15550001234', 'region':'山东济南高新区', 'street':'会展西路88号','default':true}
    })
    return
    const self = this
    const url = api.address + '?token=' + app.globalData.token
    wx.request({
      url: url,
      success: (res)=>self.setData({data: res.data.data})
    })
  },

  /**
   * 选择国家
   */
  onChangeCountry: function(e) {
    this.setData({index: e.detail.value})
  },

  /**
   * 提交表单
   */
  onSubmit: function(e) {
    let data = e.detail.value
    if(!data.name) {
      wx.showToast({title:'请输入收件人姓名'})
      return
    }
    if(!data.mobile || data.mobile.length != 11) {
      wx.showToast({title:'请输入手机号码'})
      return
    }
    if(!data.street) {
      wx.showToast({title:'请输入详细街道信息'})
      return
    }

    // 如果是更新
    if(this.data.id) {
      data['id'] = this.data.id
    }
    data['default'] = data['default'][0] ? true : false
    console.log(data)
  },

  onDelete: function() {
    wx.showModal({
      content:'确定删除？',
      success: (res)=>{
        if(res.confirm) {
          wx.navigateBack({delta:1})
        }
      }
    })
  }
})
