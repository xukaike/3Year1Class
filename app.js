//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this;
    // 登录
    wx.login({
      success: res => {
        console.log('code:'+res.code);
        wx.request({
          url:'https://sv.icewhite.cn:9301/login',
          data: { code : res.code },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },//登陆成功后用code与服务器换openId
          success:res => {
            that.globalData.openId = res.data.userid;
            console.log('openid:'+that.globalData.openId);
            wx.request({
              url:'https://sv.icewhite.cn:9301/user_tags',
              data:{userid:that.globalData.openId },
              method:'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success:res => {
                that.globalData.tags = res.data.user_tags
                console.log('标签：'+that.globalData.tags)
              }//获得用户标签
            });
            wx.request({
              url:'https://sv.icewhite.cn:9301/user_collections',
              data:{
                userid:that.globalData.openId,
                fragment:0
              },
              method:'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success:res => {
                that.globalData.collections = res.data.id_list
                console.log('收藏：'+that.globalData.collections)
              }//获得用户标签
            });
          }
        }) // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      } 
    })
  },
  globalData: {
    userInfo: null,
    openId:'',
    tags:[],
    collections:[]
  }
})