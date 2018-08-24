// pages/movie/movie.js
let ip = require("../ip.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieData: "",
    ip: ip
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 监听页面加载的时候接收到传递过来的id
    // 根据这条id发送http请求得到电影详情
    // console.log(options.id);
    wx.request({
      url: this.data.ip + '/getMovie',
      data: {
        _id: options.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        let arr = res.data;
        // 将反斜杠转化成正斜杠
        // 评论头像
        for (let i = 0; i < arr.movie_comment.length;i++){
          arr.movie_comment[i].image = arr.movie_comment[i].image.replace(/\\/g, "/")
        }
        // 导演图片
        arr.movie_director_photo[0] = arr.movie_director_photo[0].replace(/\\/g, "/");
        // 电影大图
        arr.movie_image = arr.movie_image.replace(/\\/g, "/");
        // 电影细节图片
        for (let i = 0; i < arr.movie_imgs.length; i++) {
          arr.movie_imgs[i] = arr.movie_imgs[i].replace(/\\/g, "/")
        }
        // 演员信息
        for (let i = 0; i < arr.stage_photo.length; i++) {
          arr.stage_photo[i] = arr.stage_photo[i].replace(/\\/g, "/")
        }
        // console.log(arr)
        // 修改原始的数据
        this.setData({
          movieData: arr
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})