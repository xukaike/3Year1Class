// pages/searchlist/searchlist.js
Page({
  data: {
    searchvalue:'',
    searchresult:[],
    searchitem:'',
    fragment:0,
    isNone:false,
    isLoading:false
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
    this.setData({
      isLoading:true
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
        if(res.statusCode == 400){
          that.setData({
            isNone:true
          })
          console.log(that.data.isLoading)
        }
        else{
          let list = that.data.searchresult;
          for(var i=0;i<res.data.result.length;i++){
            list.push(res.data.result[i])
          }
          that.setData({
            searchresult:list,
            isLoading:false
          })
          console.log(that.data.searchresult)
        }
      }
    })
  },
  back(){
    wx.navigateBack({
      delta: 2
    })
  },
  toarticle(e){
    let item = escape(JSON.stringify(e.currentTarget.dataset.obj));
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