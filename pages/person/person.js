//person.js
var util = require('../../utils/util.js')
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {
      avatarUrl: "https://avatars3.githubusercontent.com/u/11703635?v=3&u=0b50b78646a480030df040223e7f91ddb00f65ae&s=400",
      nickName: "--",
      gender: "--",
      country: "--",
      city: "--",
      province: "--"
    }
  },
  onLoad: function () {
    var self = this
    // 微信登陆  
    wx.login({
      success: function (res) {
        if (res.code) {
          // 登陆成功后获取用户信息
          wx.getUserInfo({
            success: function (res) {
              // 更新全局用户信息
              self.setData({
                userInfo: {
                  avatarUrl: res.userInfo.avatarUrl,
                  nickName: res.userInfo.nickName,
                  gender: util.formatGender(res.userInfo.gender),
                  country: util.formatCountry(res.userInfo.country),
                  city: res.userInfo.city,
                  province: res.userInfo.province
                }
              })
            },
            fail: function (res) {
              console.log("getUserInfo-fail" + res.errMsg)
            }
          })
        } else {
          console.log("wx.login-success-else" + res.errMsg)
        }
      },
      fail: function (res) {
        console.log("wx.login-fail" + res.errMsg)
      }
    })
  }
})
