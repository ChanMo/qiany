const api = require('../../api')
const app = getApp()

Page({
  data: {
    token: wx.getStorageSync('token'),
    address: null, // 地址对象
    data: null, //
    price: 0, // 总金额
    commodity: 0, // 商品ID
    count: 0, // 数量
    sku: null, // 参数商品
    goods_sku_id: '',
    useIntegral: false, // 是否使用积分
    amount: 0.00, // 合计金额
    authData: {}, // renzhengxinxi
    authValid: false, // 身份认证结果
    modal: false, // 身份认证modal层
    authStatus: 0, // 身份认证状态
    point: 0, // 积分总数
  },

  onLoad: function(options) {
    if(options['commodity']) {
      // 如果来自商品详情
      this.setData({
        from: 'goods',
        commodity: options['commodity'],
        count: options['count'],
        sku: options['sku']
      })
    } else if (options['key']) {
      this.setData({ from: 'cart', key: options['key'] })
    }
    this.fetchAuthStatus() //判断认证状态
    // 获取数据
    this._fetchData()
    this.fetchPoint()
  },

  /**
   * 获取积分总数
   */
  fetchPoint: function () {
    const self = this
    const url = api.point + "?token=" + app.globalData.token
    wx.request({
      url: url,
      success: (res) => self.setData({ point: res.data.data.userInfo.money })
    })
  },

  /**
   * 获取身份验证状态
   */
  fetchAuthStatus: function () {
    const self = this
    let url = api.authList + '?token=' + wx.getStorageSync('token')
    wx.request({
      url, success: (res) => {
        if (res.data.data.list.length > 0) {
          self.setData({
            authData: res.data.data.list[0],
            //authValid: false
          })
        } else {
          //self.setData({authValid: false})
        }
      }
    })
  },

  // 获取数据
  _fetchData: function() {
    let url = api.buy
    let data = {
      token: wx.getStorageSync('token'),
      act: 'confirm',
      from: this.data.from
    }
    if(this.data.from == 'goods') {
      data['goods_id'] = this.data.commodity
      data['goods_sku_id'] = this.data.sku
      data['goods_num'] = this.data.count
    }
    if (this.data.from == 'cart') {
      data['key'] = this.data.key
    }
    var that = this
    wx.request({
      url:url,
      method:'post',
      data: data,
      success:function(res){
        console.log(res)
        if(res.data.code == 1) {
          that.setData({ 
            data: res.data.data,
            authStatus: res.data.data.intraAuth,
            authValid: res.data.data.intraAuth > 0 ? false : true,
            price: parseFloat(res.data.data.order_pay_price)
          })
        } else {
          wx.showToast({title:res.data.msg, mask:true, duration:3000})
          setTimeout(()=>wx.navigateBack(), 3500)
        }
      }
    })

    wx.request({
      url: api.addressdefault,
      method: 'post',
      data: { token: wx.getStorageSync('token')},
      success:function(res){

        if(res.data.code>0){
          that.setData({
            address: res.data.data
          })
        }

      }
    })


  },

  // 选择收货地址
  chooseAddress: function() {

    wx.navigateTo({//保留当前页面，跳转到应用内的某个页面
      url:'/pages/addresses/addresses?type=buy',//url里面就写上你要跳到的地址
    })
  },

  /**
   * toggle modal
   */
  onToggleModal: function() {
    this.setData({modal: !this.data.modal})
  },

  /**
   * check auth
   */
  checkAuth: function() {
    if(this.data.authValid) {
      return true
    } else {
      return false
    }
  },

  /**
   * submit auth
   */
  onSubmitAuth: function(e) {
    const self = this
    let value = e.detail.value
    console.log(value)
    if (value.name.length <= 1) {
      wx.showToast({ title: '请输入真实姓名', duration: 3000})
      return
    }
    if (value.cardno.length !== 18) {
      wx.showToast({ title: '请输入身份证号码', duration: 3000 })
      return
    }
    if (value.mobile.length !== 11) {
      wx.showToast({ title: '请输入手机号码', duration: 3000})
      return
    }
    if(this.data.authStatus == 2) {
      if (!this.data.frontFile || !this.data.backFile) {
        wx.showToast({ title: '请选择身份证照片', duration: 3000})
        return
      }
    }
    value['front'] = this.data.frontFile
    value['back'] = this.data.backFile
    value['token'] = wx.getStorageSync('token')
    let url = api.createAuth
    if (this.data.authData) {
      value['info_id'] = this.data.authData.info_id
      url = api.updateAuth
    }
    wx.request({
      url: url,
      method: 'POST',
      data: value,
      success: (res) => {
        if (res.data.code == 1) {
          self.setData({
            authValid: true,
            modal: false
          })
          self.submit()
          //wx.showToast({ title: '更新成功' })
        } else {
          wx.showToast({ title: res.data.msg, duration: 3000})
        }
      }
    })

  },

  submit: function() {
    // 如果未选择收货地址
    if(!this.data.address) {
      wx.showToast({
        mask:true,
        title: '请选择收货地址', duration: 3000
      })
      return
    }

    // 验证身份
    if(!this.checkAuth()) {
      this.setData({ modal: true })
      return
    }

    wx.showLoading({title:'处理中',mask:true})

    // 发送数据
    let self = this
    let url = api.buy
    let data = {
      token: wx.getStorageSync('token'),
      act: 'submit',
      from: this.data.from,
      address: this.data.address,
      integral: this.data.useIntegral
    }
    // 如果是来自商品详情
    if(this.data.from == 'goods') {
      data['goods_id'] = this.data.commodity
      data['goods_sku_id'] = this.data.sku
      data['goods_num'] = this.data.count
    }
    if (this.data.from == "cart"){
      data['key'] = this.data.key
    }
    wx.request({
      url: url,
      method: 'POST',
      data: data,
      success: (res)=>{
        if(res.statusCode == 200) {
          wx.hideLoading()
          if (res.data.code == 1) {
            self.pay(res.data.data.order_id)
            //wx.navigateTo({url:'/pages/pay/pay?amount='+res.data.data.order_amount+'&order='+res.data.data.order_id})
          } else {
            wx.showToast({ title: res.data.msg })
          }
        } else {
          wx.showToast({ title: '服务器错误', duration: 3000})
        }

      },
      fail: () => wx.showToast({ title: '服务器错误', duration: 3000}),
      //complete: ()=>wx.showToast({title:'服务器错误'})
    })
  },

  /**
   * 使用积分
   */
  checkIntegral: function(e) {
    let value = e.detail.value
    this.setData({useIntegral: value})
  },

  /**
   * 微信支付
   */
  pay: function(id) {
    wx.showLoading({title:'支付请求中',mask:true})
    const url = api.pay + '?token=' + wx.getStorageSync('token') + '&order_id=' + id
    wx.request({url, success:res=>{
      wx.requestPayment({
        timeStamp: res.data.data.timeStamp,
        nonceStr: res.data.data.nonceStr,
        package: 'prepay_id='+res.data.data.prepay_id,
        signType: 'MD5',
        paySign: res.data.data.paySign,
        success: ress=>{
          console.log(ress)
          //wx.navigateBack({delta:1})
          //wx.navigateTo({url:'/pages/order/order?id='+id})
          wx.navigateTo({url:'/pages/paySuccess/paySuccess?id='+id})
        },
        fail: error=>{
          wx.showToast({ title: '支付失败', duration: 3000})
          wx.navigateTo({url:'/pages/order/order?id='+id})
        }
      })
    }, complete:()=>{
      wx.hideLoading()
    }})
    //wx.showToast({title:'支付成功'})
  },

  /**
   * 进入page
   */
  onGoPage: function(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({url:'/pages/page/page?slug=' + id})
  },

  /**
   * 选择图片
   */
  onChooseImage: function (e) {
    const self = this
    let formName = e.currentTarget.dataset.name
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: (res) => {
        let file = res.tempFilePaths[0]
        if (formName == 'front') {
          self.setData({ front: file })
        } else {
          self.setData({ back: file })
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
            if (data.code == 1) {
              if (formName == 'front') {
                self.setData({ frontFile: data.data.src })
              } else {
                self.setData({ backFile: data.data.src })
              }
            } else {
              wx.showToast({ title: data.msg, duration: 3000 })
            }
          }
        })
      }
    })
  }
})
