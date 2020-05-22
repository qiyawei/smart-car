// pages/site/site.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t = getCurrentPages(), e = t[t.length - 2];
    this.setData({
        markers: e.data.markers,
        distance: e.data.distance
    }) 
  }

})