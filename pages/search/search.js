// pages/search/search.js
Page({
  data: {
    searchitem:''
  },
  back:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  bindinput:function(e){
    this.setData({
      searchitem:e.detail.value
    })
  },
  search:function(){
    wx.redirectTo({
      url: '../searchlist/searchlist?searchvalue='+this.data.searchitem
    })
  },
  buttoncheck:function(){
    wx.redirectTo({
      url: '../searchlist/searchlist?searchvalue=推荐1'
    })
  }
})