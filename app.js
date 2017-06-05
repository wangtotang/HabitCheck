//app.js

//初始化bmob
var Bmob = require('utils/bmob.js');
Bmob.initialize("***", "***");

App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

    //建立会话
    let user = new Bmob.User();
    let newOpenid = wx.getStorageSync('openid');//token - 7200s
    if (!newOpenid) {
      let that = this;
      wx.login({
        success(res) {
          user.loginWithWeapp(res.code).then(user => {
            let openid = user.get('authData').weapp.openid;
            console.log("openid" + openid);
            if (user.get('nickName')) {
              wx.setStorageSync('openid', openid);
            } else {
              that.getUserInfo((userInfo) => {
                let u = Bmob.Object.extend('_User');
                let query = new Bmob.Query(u);
                query.get(user.id, {
                  success(result) {
                    //注册用户
                    result.set('nickName', userInfo.nickName);
                    result.set('userPic', userInfo.avatarUrl);
                    result.set('openid', openid);
                    result.save();

                    //默认习惯
                    for (let habit of that.globalData.iHabit) {
                      let Habit = Bmob.Object.extend('habit');
                      let tmp = new Habit();
                      tmp.set('title', habit.title);
                      tmp.set('category', habit.category);
                      tmp.set('desc', '');
                      tmp.set('totalCount', 0);
                      //关联用户
                      tmp.set('own', result);
                      tmp.save();
                    }

                  },
                });
              });
            }
          });
        },
        fail(err) {
          //console.log(err,'err');
        }
      });
    }

  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    category: [
      { name: '健康', icon: '../../../images/ic_apple.png' },
      { name: '运动', icon: '../../../images/ic_muscle.png' },
      { name: '学习', icon: '../../../images/ic_learn.png' },
      { name: '效率', icon: '../../../images/ic_rocket.png' },
      { name: '思考', icon: '../../../images/ic_think.png' },
    ],
    iHabit: [
      { title: '每天学习一小时', category: 2 },
      { title: '每天健身一小时', category: 1 },
      { title: '早起', category: 0 },
    ],
  }
})
