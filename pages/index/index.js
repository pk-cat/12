//index.js
// 引入SDK核心类
var QQMapWX = require('../qqmap/qqmap.js');
let ip = require("../ip.js")
var qqmapsdk;
//获取应用实例
var app = getApp()
Page({
  data: {
    height: '', // 获取当前页面的可视高度----懒加载
    navbar: ['热映', '待映'],
    currentTab: 0,
    ip: ip, //IP
    hotArr: [], //热映电影信息
    commingArr: [], //待映电影信息
    hot: [], // 近期最受欢迎
    dayArr: [7, 1, 2, 3, 4, 5, 6], //日期
    dataA: ["天", "一", "二", "三", "四", "五", "六"], //日期
    location: "", //当前城市
    // 因为数据库不齐全，所以从数据库里拿到固定的电影的id
    // 热映的电影的数据
    movieHot: ["5b505f15924e0aa8b3f7fef6",
      "5b50cdbf8155980298ffbb06",
      "5b519005e419db26ecfda42e",
      "5b519ae2e419db26ecfda42f",
      "5b51a052e419db26ecfda430",
      "5b51a5d4e419db26ecfda431",

      "5b505f15924e0aa8b3f7fef6",
      "5b50cdbf8155980298ffbb06",
      "5b519005e419db26ecfda42e",
      "5b519ae2e419db26ecfda42f",
      "5b51a052e419db26ecfda430",
      "5b51a5d4e419db26ecfda431",

      "5b505f15924e0aa8b3f7fef6",
      "5b50cdbf8155980298ffbb06",
      "5b519005e419db26ecfda42e",
      "5b519ae2e419db26ecfda42f",
      "5b51a052e419db26ecfda430",
      "5b51a5d4e419db26ecfda431",

      "5b505f15924e0aa8b3f7fef6",
      "5b50cdbf8155980298ffbb06",
      "5b519005e419db26ecfda42e",
      "5b519ae2e419db26ecfda42f",
      "5b51a052e419db26ecfda430",
      "5b51a5d4e419db26ecfda431",

      "5b505f15924e0aa8b3f7fef6",
      "5b50cdbf8155980298ffbb06",
      "5b519005e419db26ecfda42e",
      "5b519ae2e419db26ecfda42f",
      "5b51a052e419db26ecfda430",
      "5b51a5d4e419db26ecfda431",

      "5b505f15924e0aa8b3f7fef6",
      "5b50cdbf8155980298ffbb06",
      "5b519005e419db26ecfda42e",
      "5b519ae2e419db26ecfda42f",
    ],
    // 待映的电影的数据的id
    movieComing: ["5b505f15924e0aa8b3f7fef6",
      "5b50cdbf8155980298ffbb06",
      "5b519005e419db26ecfda42e",
      "5b519ae2e419db26ecfda42f",
      "5b51a052e419db26ecfda430",
      "5b51a5d4e419db26ecfda431",

      "5b505f15924e0aa8b3f7fef6",
      "5b50cdbf8155980298ffbb06",
      "5b519005e419db26ecfda42e",
      "5b519ae2e419db26ecfda42f"
    ]


  },
  // 导航
  navbarTap: function(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  // 在生命周期函数中获得热映信息
  onLoad: function() {
    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({　　　
      // key: 'HPNBZ-B426V-CZQPP-UN4R6-QYOF2-MYFU3' 
      key: 'BHOBZ-3EQ6W-UTORR-OKU2O-E6BTE-W4BY6' //此处使用你自己申请的key
      　　
    });
    //1、获取当前位置坐标
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        // 调用接口
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: (res) => {
            // console.log(res.result.address_component.city);
            let city = res.result.address_component.city;
            this.setData({
              location: city
            })
          }
          // ,
          // fail: function(res) {
          //   console.log(res);
          // },
          // complete: function(res) {
          //   console.log(res);
          // }
        });
      }
    })
    // 热映的所有电影
    wx.request({
      url: this.data.ip + '/getHot',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        let arr = res.data;
        // 转义字符串
        arr.forEach(e => {
          // 懒加载---显示状态为否
          e.show = false;
          // 图片替换反斜杠
          e.movie_image = e.movie_image.replace(/\\/g, "/");
        })

        let thisTime = new Date().getTime(); //当前时间毫秒
        let aTime = new Date(); //当前时间
        for (let i = 0; i < arr.length; i++) {
          let movieTime = new Date(arr[i].movie_time).getTime(); //电影上映时间毫秒
          // console.log(movieTime - thisTime)
          let week = 1000 * 60 * 60 * 24 * 7; //这是一周的毫秒数
          // 先获得电影上映时间
          let num = new Date(arr[i].movie_time)
          // 不在一周范围内-已经上映
          if (movieTime - thisTime < 0) {
            // 否则改为状态值2，这样就可以去判断状态值，当为1的时候预售，否则为购买
            arr[i].movie_time = 2;
            arr[i].time = "今天145家影院放映345场"
          }
          // 判断如果时间超过本地时间，则为预售，将时间改为状态值1
          else if (week > movieTime - thisTime > 0) {
            // arr[i].movie_time = 1;//状态值
            // 判断是这周还是下周
            let theweek;
            if (this.data.dayArr[num.getDay()] - this.data.dayArr[aTime.getDay()] <= 0) {
              theweek = "下周"
            } else {
              theweek = "本周"
            }
            arr[i].time = (num.getFullYear()) + "-" + (num.getMonth() + 1) + "-" + num.getDate() + theweek + this.data.dataA[num.getDay()] + "上映";
            // 不在一周范围内-还未上映，则预售
          } else if (week < movieTime - thisTime) {
            arr[i].time = (num.getFullYear()) + "-" + (num.getMonth() + 1) + "-" + num.getDate() + "周" + this.data.dataA[num.getDay()] + "上映";
          }

        }
        // console.log(res.data)
        this.setData({
          hotArr: res.data
        })
        
      }
    })

    // 待映的所有电影
    wx.request({
      url: this.data.ip + '/getComing',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        let arr = res.data;
        // 字符串转义
        arr.forEach(e => e.movie_image = e.movie_image.replace(/\\/g, "/"))
        // console.log(res.data)
        // 排序
        var compare = function(obj1, obj2) {
          var val1 = new Date(obj1.movie_time).getTime();
          var val2 = new Date(obj2.movie_time).getTime();
          if (val1 < val2) {
            return -1;
          } else if (val1 > val2) {
            return 1;
          } else {
            return 0;
          }
        }
        // 将日期的格式转变
        arr.sort(compare).forEach(e => {
          let num = new Date(e.movie_time)
          e.movie_time = (num.getMonth() + 1) + "月" + num.getDate() + "日" + "周" + this.data.dataA[num.getDay()]
          e.time = (num.getFullYear()) + "-" + (num.getMonth() + 1) + "-" + num.getDate() + e.movie_area + "上映";
        })
        this.setData({
          commingArr: res.data
        })
        // 比较想看人数，得到最受欢迎
        var pare = function(obj1, obj2) {
          var val1 = new Date(obj1.movie_want).getTime();
          var val2 = new Date(obj2.movie_want).getTime();
          if (val1 < val2) {
            return -1;
          } else if (val1 > val2) {
            return 1;
          } else {
            return 0;
          }
        }
        this.setData({
          hot: arr
        })

      }
    })
  },

  // 跳转至电影详情
  toMovie: function(e) {
    // console.log(e.currentTarget.dataset.a)
    // 因为数据库的信息不能对应本条电影的信息，所以造了一个假数据库；将假数据库的id存进
    // 数组中，保证点击电影的时候，跳转到详情界面，至少有假的信息
    let numID = e.currentTarget.dataset.a;
    let movieData = this.data.movieHot[numID];
    // 点击跳转
    wx.navigateTo({
      url: '../movie/movie?id=' + movieData
    })
  },
  // 跳转至购物
  toShop: function(e) {
    console.log(e.target)
  }

})