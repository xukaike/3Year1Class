const app = getApp();
Page({
  data: {
    loadProgress: 0,
    checks: [
      { name: "搞笑", value: '0', checked: false },
      { name: "养生堂", value: '1', checked: false },
      { name: "私房话", value: '2', checked: false },
      { name: "八卦精", value: '3', checked: false },
      { name: "科技咖", value: '4', checked: false },
      { name: "财经迷", value: '5', checked: false },
      { name: "生活家", value: '7', checked: false },
      { name: "汽车控", value: '7', checked: false },
      { name: "时尚圈", value: '8', checked: false },
      { name: "育儿", value: '9', checked: false },
      { name: "旅游", value: '10', checked: false },
      { name: "职场", value: '11', checked: false },
      { name: "美食", value: '12', checked: false },
      { name: "历史", value: '13', checked: false },
      { name: "教育", value: '14', checked: false },
      { name: "星座", value: '15', checked: false },
      { name: "体育", value: '16', checked: false },
      { name: "游戏", value: '17', checked: false },
      { name: "萌宠", value: '18', checked: false },
      { name: "军事", value: '19', checked: false }
      
    ],
  },
  //点击选项后的功能
  clicks: function (e) {
    let index = e.currentTarget.dataset.index;
    let arrs = this.data.checks;
    if (arrs[index].checked == false) {
      arrs[index].checked = true;
    } else {
      arrs[index].checked = false;
    }
    this.setData({
      checks: arrs
    })
    // console.log(e)
  },

  //弹窗的显示和隐藏
  add() {
    let list= [];
    var that = this;
    for(var i=0;i<this.data.checks.length;i++){
      if(this.data.checks[i].checked == true){
        list.push(this.data.checks[i].name)
      }
    }
    console.log(list);
    wx.request({
      url:'https://sv.icewhite.cn:9301/modify_tag',
          method:'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' 
          },
          data:{
            userid:app.globalData.openId,
            tag:JSON.stringify({'list':list})
          },
          success:res=>{
            if(res.statusCode == 400){
              wx.showToast({
                title:'添加失败！',
                icon:'none'
              })
            }
            else{
              for(var i=0;i<list.length;i++){
                for(var j=0;j<that.data.checks.length;j++){
                  if(list[i]==that.data.checks[j].name){
                    that.data.checks[j].checked = true
                  }
                }
              }
              that.setData({
                checks:that.data.checks
              });
              wx.showToast({
                title:'添加成功',
                duration:500
              })
            }
          }
    });
    setTimeout(function(){
      wx.navigateBack({
        delta: 1
      })
    },500)
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
        if(res.statusCode == 400){
          wx.showToast({
            title:'获取标签失败！',
            icon:'none'
          })
        }
        else{
          that.setData({
            tags:res.data.user_tags
          })
        }
      }
    })
  },
  onReady(){
    this.setChecks();
  },
  setChecks(){
    for(var i=0;i<this.data.tags.length;i++){
      for(var j=0;j<this.data.checks.length;j++){
        if(this.data.tags[i] == this.data.checks[j].name){
          console.log(this.data.checks[j].name)
          this.data.checks[j].checked =true;
        }
      }
    }
    this.setData({
      checks:this.data.checks
    })
    console.log(this.data.checks)
  }
});
