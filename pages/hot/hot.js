const app = getApp();
Page({
  data: {
    TabCur: 0,
    scrollLeft: 0,
    title:'热点'
  },
  tabSelect(e) {
    wx.showLoading({
      title:'加载中'
    })
    var that =this;
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    console.log(this.data.tag[that.data.TabCur])
    wx.request({
      url:'https://sv.icewhite.cn:9301/tag_pages',
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      data:{
        userid:app.globalData.openId,
        tag:that.data.tag[that.data.TabCur]
      },
      success:res=>{
        that.setData({
          pages:res.data.result
        });
        wx.hideLoading()
      }
    })
  },
  onLoad(){
    var that = this;
    wx.request({
      url:'https://sv.icewhite.cn:9301/user_tags',
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      data:{
        userid:app.globalData.openId
      },
      success:res=>{
        that.setData({
          tag:res.data.user_tags
        })
        wx.showLoading({
          title: '加载中',
        })
        wx.request({
          url:'https://sv.icewhite.cn:9301/tag_pages',
          method:'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' 
          },
          data:{
            userid:app.globalData.openId,
            tag:that.data.tag[0]
          },
          success:res=>{
            if(res.statusCode == 400){
              wx.showToast({
                title:'加载文章失败！'
              })
            }
            else{
              that.setData({
                pages:res.data.result
              })
              wx.hideLoading()
              console.log(that.data.pages)
            }
          }
        })
      }
    })
  },
  toarticle(e){
    let item = escape(JSON.stringify(e.currentTarget.dataset.obj))
    console.log(item)
    wx.navigateTo({
      url:'../article/article?item='+item
    })
  }
})