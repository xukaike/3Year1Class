const app = getApp();
Page({
  data: {
    TabCur: 0,
    scrollLeft: 0,
    title:'热点',
    loadcount:0,
    isLoad:false
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
          let allpagelist = []
          let page = []
          for(var tag in res.data.user_tags){
            let pageitem = {}
            pageitem[res.data.user_tags[tag]] = page 
            pageitem['isLoad'] = false
            allpagelist[tag] = pageitem
          }
          that.setData({
            tag:res.data.user_tags,
          })
          wx.request({
            url:'https://sv.icewhite.cn:9301/tag_pages',
            method:'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' 
            },
            data:{
              userid:app.globalData.openId,
              tag:that.data.tag[0] //第一个标签
            },
            success:res=>{
              if(res.statusCode == 400){
                wx.showToast({
                  title:'加载文章失败！'
                })
              }
              else{
                allpagelist[0][that.data.tag[0]] = res.data.result
                allpagelist[0]['isLoad'] = true
                that.setData({
                  allpagelist:allpagelist
                })
              }
            }
          })
        }
      }
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
        if(res.data.user_tags.length == 0){//如果用户没有标签
          that.setData({
            modalName: 'DialogModal2'
          })
        }
        else if(that.data.tag.toString() != res.data.user_tags.toString()){
          let allpagelist = []
          let page = []
          for(var tag in res.data.user_tags){
            let pageitem = {}
            pageitem[res.data.user_tags[tag]] = page 
            pageitem['isLoad'] = false
            allpagelist[tag] = pageitem
          }
          that.setData({
            tag:res.data.user_tags,
            TabCur:0
          })
          wx.request({
            url:'https://sv.icewhite.cn:9301/tag_pages',
            method:'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' 
            },
            data:{
              userid:app.globalData.openId,
              tag:that.data.tag[0] //第一个标签
            },
            success:res=>{
              if(res.statusCode == 400){
                wx.showToast({
                  title:'加载文章失败！'
                })
              }
              else{
                allpagelist[0][that.data.tag[0]] = res.data.result
                allpagelist[0]['isLoad'] = true
                that.setData({
                  allpagelist:allpagelist
                })
              }
            }
          })
        }
      }
    })
  },
  tabSelect(e) {
    var that =this;
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      isLoad:false
    })
    
  },
  toarticle(e){
    let item = escape(JSON.stringify(e.currentTarget.dataset.obj))
    wx.navigateTo({
      url:'../article/article?item='+item
    })
  },
  
  
  tosettag(){
    this.setData({
      modalName: ''
    })
    wx.navigateTo({
      url:'../tag/tag'
    })
  },
  
  bindChange(e){
    var that = this
    this.setData({
      TabCur:e.detail.current,
      scrollLeft: (e.detail.current - 1) * 60,
      isLoad:false //防止快速切换页面还在显示加载中
    })
    if(this.data.allpagelist[e.detail.current]['isLoad'] == false){
      that.setData({
        isLoad:true
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
              that.data.allpagelist[e.detail.current][that.data.tag[that.data.TabCur]] = res.data.result
              that.data.allpagelist[e.detail.current]['isLoad'] = true
              that.setData({
                allpagelist:that.data.allpagelist,
                isLoad:false
              })
              wx.hideLoading()
            }
          }
      })
    }
  }
})
