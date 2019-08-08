const api = require('../../api')
const app = getApp()

Page({
  data: {
    alphabet: 'abcdefghijklmnopqrstuvwxyz#'.toUpperCase().split(''),
    category: null,
    brands: [],
    active: 0,
    active2: null,
    language: 'zh',
    activeAlphabet: null,
    activeBrands: [],
  },
  onLoad: function() {
    this._fetchData()
  },
  // 获取数据
  _fetchData: function() {
    let self = this
    wx.request({url: api.category + '?token=' + app.globalData.token, success: function(res) {
      if(res.data.code > 0) {
        let category = res.data.data.cate_list
        category.unshift({'name':'国际品牌', 'image_path':'../../images/首页.png'})
        self.setData({
          brands: res.data.data.brand_list,
          category: category
        })
        self._filterBrands()
      }
    }})
  },

  // 选择字母表
  choiceAlphabet: function(e) {
    let value = e.currentTarget.dataset.value
    let actived = this.data.activeAlphabet
    let result = null
    if (actived != value) {
      result = value
    }
      /**
    let result = []
    if(actived.some(item=>item == value)) {
      result = actived.filter(item=>item != value)
    } else {
      result = actived.concat([value])
    }
       **/
    this.setData({activeAlphabet:result})
    this._filterBrands()
  },

  // 设置筛选后品牌
  _filterBrands: function() {
    let language = this.data.language
    let activeAlphabet = this.data.activeAlphabet
    let brands = this.data.brands
    let activeBrands = brands
    if (activeAlphabet) {
      if (language == 'zh') {
        activeBrands = brands.filter(item => item.pinyin.substr(0,1).toUpperCase() == activeAlphabet)
      } else {
        activeBrands = brands.filter(item => item.en.substr(0,1).toUpperCase() == activeAlphabet)
      }
    }
    this.setData({activeBrands:activeBrands})
    /**
    let activeAlphabets = this.data.activeAlphabets
    let activeBrands = this.data.brands
    let language = this.data.language
    if(activeAlphabets.length > 0) {
      if(language == 'zh') {
        activeBrands = this.data.brands.filter(item=>activeAlphabets.some(item2=>item2 == item.pinyin.substr(0,1).toUpperCase()))
      } else {
        activeBrands = this.data.brands.filter(item=>activeAlphabets.some(item2=>item2 == item.en_name.substr(0,1).toUpperCase()))
      }
    }
    console.log(activeBrands)
    this.setData({activeBrands: activeBrands})
     **/
  },

  // 设置左侧分类
  setActive: function(e) {
    this.setData({
      active: e.currentTarget.dataset.index,
      active2: null
    })
  },

  // 设置中英文状态
  setLanguage: function(e) {
    this.setData({'language':e.currentTarget.dataset.language})
    this._filterBrands()
  },

  /**
   *
   */
  onToggle: function(e) {
    const index = e.currentTarget.dataset.index
    if(this.data.active2 == index) {
      this.setData({active2: null})
    } else {
      this.setData({active2: index})
    }
  }
})
