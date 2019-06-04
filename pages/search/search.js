// pages/search/search.js
Page({
  data: {
    searchitem:'',
    list1:['波音',
          '海南',
          '新闻联播'
        ],
    list2:[
      '郎朗',
      '巴菲特午餐',
      '杨幂'
    ]
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
  buttoncheck:function(e){
    let result = e.currentTarget.dataset.result
    this.setData({
      searchitem:result
    })
    wx.redirectTo({
      url: '../searchlist/searchlist?searchvalue='+this.data.searchitem
    })
  }
})