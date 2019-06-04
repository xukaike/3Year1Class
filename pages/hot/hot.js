const app = getApp();
Page({
  data: {
    TabCur: 0,
    scrollLeft: 0,
    title:'热点',
    loadcount:0
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
    
    switchTabPost(that);//切换Tab
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
        if(res.data.user_tags.length == 0){//如果用户没有标签
          that.setData({
            modalName: 'DialogModal2'
          })
        }
        else{
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
      }
    })
  },
  toarticle(e){
    let item = escape(JSON.stringify(e.currentTarget.dataset.obj))
    console.log(item)
    wx.navigateTo({
      url:'../article/article?item='+item
    })
  },
  
  onShow(){
    if(this.data.loadcount == 0){
     this.data.loadcount++ 
    }
    else{
      this.reLoad();//构造reLoad能同步标签
      console.log('reload')
    }
  },
  tosettag(){
    this.setData({
      modalName: ''
    })
    wx.navigateTo({
      url:'../tag/tag'
    })
  },
  reLoad(){
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
        if(res.data.user_tags.length == 0){
          that.setData({
            modalName: 'DialogModal2'
          })
        }
        else{
          
        that.setData({
          tag:res.data.user_tags
        })
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
            if(res.statusCode == 400){
              wx.showToast({
                title:'加载文章失败！'
              })
            }
            else{
              that.setData({
                pages:res.data.result
              })
              console.log(that.data.pages)
            }
          }
        })
        }
      }
    })
  },
  touchStart(e) {
    this.setData({
      "touch.x": e.changedTouches[0].clientX,
      "touch.y": e.changedTouches[0].clientY
    });
  },
  touchEnd(e) {
    var that = this;
    let endX = e.changedTouches[0].clientX;
    let endY = e.changedTouches[0].clientY;
    
    if (endX - this.data.touch.x > 100 && Math.abs(endY - this.data.touch.y) < 100) {      //右滑
       
      if(this.data.TabCur!=0){
        wx.showLoading({
          title:'加载中'
        })
        this.setData({
          TabCur:this.data.TabCur-1,
          scrollLeft: (this.data.TabCur - 1) * 60
        })
        switchTabPost(that);
      }
    } else if (endX - this.data.touch.x < -100 && Math.abs(endY - this.data.touch.y) < 100) {   //左滑
      
      if(this.data.TabCur!=this.data.tag.length-1){
        wx.showLoading({
          title:'加载中'
        })
        this.setData({
          TabCur:this.data.TabCur+1,
          scrollLeft: (this.data.TabCur - 1) * 60
        })
        switchTabPost(that);
      }
    }
  }
})

function switchTabPost(that) {
  wx.request({
    url: 'https://sv.icewhite.cn:9301/tag_pages',
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      userid: app.globalData.openId,
      tag: that.data.tag[that.data.TabCur]
    },
    success: res => {
      that.setData({
        pages: res.data.result
      });
      wx.hideLoading();
    }
  });
}
