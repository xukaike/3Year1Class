// pages/searchlist/searchlist.js
Page({
  data: {
    searchvalue:'',
    searchresult:[],
    searchitem:''
  },
  onLoad(option){
    var that = this;
    this.setData({
      searchvalue:option.searchvalue
    });
    console.log(this.data.searchvalue);

    wx.request({
      url: 'https://sv.icewhite.cn:9301/page_key_search',
      data: {
        key: that.data.searchvalue,
        fragment: 1
      },
      method:"POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      success(res){
        that.setData({
          searchresult:res.data.result
        });
        console.log(that.data.searchresult)
      }
    });
  },
  back:function(){
    wx.navigateBack({
      delta: 2
    })
  },
  toarticle:function(e){
    
    var obj = e.currentTarget.dataset.obj;
    let item = escape(JSON.stringify(obj));
    console.log(item)
    wx.navigateTo({
      url:'../article/article?item='+item
    })
  },
  bindinput(e){
    this.setData({
      searchitem:e.detail.value,
    })
  },
  search(){
    wx.redirectTo({
      url: '../searchlist/searchlist?searchvalue='+this.data.searchitem
    })
  }
})