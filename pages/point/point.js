const api = require('../../api')
const app = getApp()

Page({
  data: {
    active: 'people'
  },
  onLoad: function() {
  },
  setActive: function(e) {
    this.setData({active:e.currentTarget.dataset.value})
  }
})
