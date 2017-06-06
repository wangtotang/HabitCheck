// add.js

var Toast = require('../../../components/toast/toast');
var Event = require('../../../utils/event.js');
var Bmob = require('../../../utils/bmob.js');

var app = getApp();
const STORAGE_KEY = 'habits';

Page(Object.assign({}, Toast, {

  /**
   * 页面的初始数据
   */
  data: {
    showDialog: false,
    typeItem: '',
    category: app.globalData.category,
    typeIndex: -1,
  },

  /**
   * 显示类别窗口
   */
  showDialog() {
    this.setData({
      showDialog: !this.data.showDialog,
    });
  },

  /**
  * 选择类别
  */
  selectType(event) {
    let index = event.currentTarget.dataset.type;
    this.setData({
      typeIndex: index,
      typeItem: this.data.category[index].name,
      showDialog: !this.data.showDialog,
    });
  },

  /**
   * 保存数据
   */
  addHabit(event) {
    wx.showLoading({
      title: '正在添加',
      mask:true,
    });
    //检查数据
    let title = event.detail.value.title;
    let desc = event.detail.value.desc;
    if (!title) {
      this.showZanToast('请输入标题');
      wx.hideLoading();
      return;
    }
    if (this.data.typeIndex == -1) {
      this.showZanToast('请选择类别');
      wx.hideLoading();
      return;
    }
    //添加并保存
    // let habits = wx.getStorageSync(STORAGE_KEY);
    // if (habits == null || habits == '') {
    //   habits = [];
    // }
    // habits.unshift(
    //   {
    //     id: habits.length,
    //     name: title,
    //     category: this.data.typeIndex,
    //     desc: desc,
    //     totalCount: 0,
    //     monthSignCount: {},
    //     monthSignData: {}
    //   }
    // );
    // wx.setStorageSync(STORAGE_KEY, habits);
    // wx.showToast({
    //   title: '保存成功',
    //   icon: 'success',
    //   duration: 2000,
    //   complete: function () {
    //     wx.navigateBack();
    //   }
    // });

    //添加并上传
    let Habit = Bmob.Object.extend('habit');
    let habit = new Habit();
    habit.set('title',title);
    habit.set('category', this.data.typeIndex);
    habit.set('desc',desc);
    habit.set('totalCount',0);
    //关联用户
    let currentUser = Bmob.User.current();
    let User = Bmob.Object.extend("_User");
    let UserModel = new User();
    if(currentUser){
      UserModel.id = currentUser.id;
      habit.set('own',UserModel);
    }
    let that = this;
    habit.save(null,{
      success(result){
        wx.hideLoading();
        wx.showToast({
          title: '添加习惯成功',
          icon:'success',
          duration:2000,
          complete(){
            Event.getInstance().emit('add');
            wx.navigateBack();
          }
        });
      },
      error(result,err){
        wx.hideLoading();
        that.showZanToast('添加习惯失败，请重新添加');
      }
    });
  },
}))