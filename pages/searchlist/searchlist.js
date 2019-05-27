// pages/searchlist/searchlist.js
Page({
  data: {
    searchvalue:'',
    searchresult:[],
    searchitem:'',
    fragment:0
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
        fragment: that.data.fragment
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
  onReachBottom(){
    var that = this;
    this.data.fragment++;
    console.log('bottom','fragment='+this.data.fragment)
    wx.showLoading({
      title:'加载中'
    })
    wx.request({
      url: 'https://sv.icewhite.cn:9301/page_key_search',
      data: {
        key: that.data.searchvalue,
        fragment: that.data.fragment
      },
      method:"POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      success(res){
        let list = that.data.searchresult;
        for(var i=0;i<res.data.result.length;i++){
          list.push(res.data.result[i])
        }
        that.setData({
          searchresult:list
        })
        wx.hideLoading()
        console.log(that.data.searchresult)
      }
    })
  },
  back(){
    wx.navigateBack({
      delta: 2
    })
  },
  toarticle(e){
    
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