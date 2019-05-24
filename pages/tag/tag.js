const app = getApp();
var num=0;
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    loadProgress: 0,
    checks: [
      { name: "奶茶", value: '0', checked: false },
      { name: "喝再多", value: '1', checked: false },
      { name: "都不会胖的", value: '2', checked: false },
      { name: "减肥没用的", value: '3', checked: false },
      { name: "瘦不下来的", value: '4', checked: false },
      { name: "柠檬精", value: '5', checked: false },
      { name: "奶黄包", value: '6', checked: false },
      { name: "咸鸭蛋", value: '7', checked: false },
      { name: "华晨宇", value: '8', checked: false },
      { name: "歌手", value: '9', checked: false },
      { name: "林宥嘉", value: '10', checked: false },
      { name: "爬虫", value: '11', checked: false },
      { name: "python", value: '12', checked: false },
      { name: "大数据", value: '13', checked: false },
      { name: "笑", value: '14', checked: false },
      { name: "人工智能", value: '15', checked: false },
      { name: "哔哩哔哩", value: '16', checked: false },
      { name: "Java", value: '17', checked: false },
      { name: "RNG", value: '18', checked: false },
      { name: "dota", value: '19', checked: false },
      { name: "lol", value: '24', checked: false },
      { name: "游戏", value: '20', checked: false },
      { name: "前端", value: '25', checked: false },
      { name: "富婆", value: '21', checked: false },
      { name: "少奋斗20年", value: '22', checked: false },
      { name: "白日梦", value: '23', checked: false },
      
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
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
});
