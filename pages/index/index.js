//index.js
//获取应用实例
const app = getApp()
var utils = require('../../utils/util.js');
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    cardCur: 0,
    isLoading:false,
    isNone:false,
    hot_page:[]
  },
  onLoad(){
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    };
    wx.request({
      url: 'https://sv.icewhite.cn:9301/index_page',
      method:"GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      success:res=>{
        this.setData({
          index_page:res.data.result
        })
      }
    })
    wx.request({
      url: 'https://sv.icewhite.cn:9301/hot_page',
      method:"GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      success:res=>{
        for(var i=0;i<res.data.result.length;i++){
          res.data.result[i].time=utils.formatTime(res.data.result[i].timestramp, 'Y-M-D');
        }
        this.setData({
          hot_page:res.data.result
        })
      }
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  getUserInfo(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  search(){
    wx.navigateTo({
      url:'../search/search'
    })
  },
  bindkeyinput(e){
    this.setData({
      value:e.detail.value
    })
  },
  toarticle(e){
    let item = escape(JSON.stringify(e.currentTarget.dataset.obj));
    console.log(item)
    wx.navigateTo({
      url:'../article/article?item='+item
    })
  },
  onReachBottom(){
    if(this.data.isNone == false){
      this.setData({
        isLoading:true
      });
      wx.request({
        url: 'https://sv.icewhite.cn:9301/tag_pages',
        method:"POST",
        data:{
          userid:app.globalData.openId,
          tag:'热门'
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' 
        },
        success:res=>{
          for(var i=3;i<res.data.result.length;i++){
            res.data.result[i].time=utils.formatTime(res.data.result[i].timestramp, 'Y-M-D');
            this.data.hot_page.push(res.data.result[i])
          }
          this.setData({
            hot_page:this.data.hot_page, 
            isNone:true
          })
        }
      })
    }
  }
})
