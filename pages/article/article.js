const app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
var utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time:'',
    article:'',
    item:{},
    isCollect:false,
    text:'收藏'
  },
  postdata:{

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  var that = this;
  wx.showLoading({
    title: '加载中...',
  })
  // 模拟获取数据
    /**
    * WxParse.wxParse(bindName , type, data, target,imagePadding)
    * 1.bindName绑定的数据名(必填)
    * 2.type可以为html或者md(必填)
    * 3.data为传入的具体数据(必填)
    * 4.target为Page对象,一般为this(必填)
    * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
    */
    // var that = this;
    that.setData({
      item: JSON.parse(unescape(options.item))
    });
    let timestramp = utils.formatTime(that.data.item.timestramp, 'Y-M-D h:m:s');
    that.setData({
      time: timestramp
    })
    console.log(that.data.item);
    console.log(utils.formatTime(that.data.item.timestramp, 'Y-M-D h:m:s'));
    wx.request({
      url: 'https://sv.icewhite.cn:9301/page_content',
      data: { id: that.data.item.id },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.setData({
          article: res.data.content
        });
        WxParse.wxParse('article', 'html', that.data.article, that, 0);
        wx.hideLoading();
      }
    });
    if(app.globalData.collections.indexOf(this.data.item.id)>-1){
      this.setData({
        isCollect:true,
        text:'已收藏'
      })
    }
    


    // 更改数据、获取新数据完成
  },
  star(){
    console.log(this.data.isCollect)
    if(this.data.isCollect == false){

      wx.request({
        url:'https://sv.icewhite.cn:9301/star_page',
        data:{
          userid:app.globalData.openId,
          pageid:this.data.item.id
        },
        method:'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success:res => {
          if(res.statusCode == 200){
            this.isCollect = true;
            wx.showToast({
              title:'收藏成功！'
            })
            this.setData({
              isCollect:true,
              text:'已收藏'
            })
            app.globalData.collections.push(this.data.item.id)
          }
          else{
            wx.showToast({
              title:res.data.message,
              icon:'none'
            })
          }
        }
      })

    }
    else{
      wx.request({
        url:'https://sv.icewhite.cn:9301/cancel_star_page',
        data:{
          userid:app.globalData.openId,
          pageid:this.data.item.id
        },
        method:'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success:res => {
          if(res.statusCode == 200){
            this.isCollect = true;
            wx.showToast({
              title:'已取消'
            });
            this.setData({
              isCollect:false,
              text:'收藏'
            });
            for(var i = 0; i < app.globalData.collections.length ;i++){
              if( app.globalData.collections[i] == this.data.item.id ){
                app.globalData.collections.splice(i,1)
              }
            }
          }
          else{
            wx.showToast({
              title:res.data.message,
              icon:'none'
            })
          }
        }
      })
    }
  }
})
