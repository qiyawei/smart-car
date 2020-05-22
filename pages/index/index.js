var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk = new QQMapWX({
    key: 'UZABZ-AJ4KG-EEUQ3-IMQQQ-3ZGO5-ULFVL' 
});
Page({

      /**
       * 页面的初始数据
       */
      data: {
        longitude: 108.961678,
        latitude: 34.310574,
        markers: [],
        index_img:"b642019-05-27_19082856628..png"
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function (options) {
        this.getLocationInfo();
      },

      jump_url: function(t) {
        wx.navigateTo({
          url: t.currentTarget.dataset.url
        });
      },
      getLocationInfo: function() {
          wx.getLocation({
            type: 'gcj02',
            success:(res)=>{
                this.setData({
                  longitude: res.longitude,
                  latitude: res.latitude
              });
              this.getSiteList();
            },
            fail: function() {
              wx.openSetting({
                  success: function(t) {
                      1 == t.authSetting["scope.userLocation"] ? wx.showToast({
                          title: "授权成功",
                          icon: "success",
                          duration: 1e3
                      }) : wx.showToast({
                          title: "授权失败",
                          icon: "none",
                          duration: 1e3
                      });
                  }
              });
          },
          complete: function() {}
          })
      },


      scanCode: function() {
        wx.scanCode({
            onlyFromCamera:false,
            success: function(t) {
              console.log(t);
                /https:\/\/m.xime8.com\/flow\//.test(t.result) ? wx.navigateTo({
                  url: "/pages/order/flow/flow?q=" + t.result
                }) : /https:\/\/m.xime8.com\/flow_sm\//.test(t.result) ? wx.navigateTo({
                    url: "/pages/order/flow_sm/flow_sm?q=" + t.result
                }) : wx.showModal({
                    title: "温馨提示",
                    content: "无法识别非启动洗车外其他二维码哦~",
                    showCancel: !1
                });
            }
        });
    },
    
      marker_details: function(t) {
        console.log(this.data);
        for (var e in console.log(t), this.data.markers) if (this.data.markers[e].id == t.markerId) {
            i.navigateTo({
                url: "/pages/V2.0/shop/details?id=" + e
            });
            break;
        }
      },
      

      getSiteList: function() {
        let markerks  = [];
        wx.request({
          method:'post',
          url: 'https://m.xime8.com/Api/Machine/get_machine_list', //仅为示例，并非真实的接口地址
          success: (res)=> {
            let s =[];
            for(let item of res.data.data.machine){
               let marker = this.createMarker(item);
                markerks.push(marker);
                s.push({
                  latitude: item.lat,
                  longitude: item.lng
                });
            }

            this.setData({
              markers:markerks
            })
            this.getDistance(s);
          }
        })
      
      },

      createMarker(point){
        let ico = '/static/img/index/position.png';
        if('1' == point.status){
          ico = '/static/img/index/position.png';
        }else if('2' == point.status){
          ico = '/static/img/index/position_yellow.png';
        }else if('3' == point.status){
          ico = '/static/img/index/position_yellow.png';
        }else if('4' == point.status){
          ico = '/static/img/index/position_yellow.png';
        }else if('5' == point.status){
          ico = '/static/img/index/position_red.png';
        }
        let marker= {
          id: point.id,
          iconPath: ico,
          longitude: point.lng,
          latitude: point.lat,
          image: point.image,
          status: point.status,
          width: 50,
          height: 50,
          callout: {
              content: point.serial_no,
              address: point.address,
              type: point.type,
              padding: 5
          }
        };
        return marker;
      },


      getDistance: function(t) {
        var _this = this;
        //调用距离计算接口
        qqmapsdk.calculateDistance({
            mode: 'driving',
            from:  '', 
            to: t, //终点坐标
            success: function(res) {//成功后的回调
              var res = res.result;
              var dis = [];
              for (var i = 0; i < res.elements.length; i++) {
                dis.push(res.elements[i].distance); 
              }
              _this.updateMarksOrder(dis);
            },
            fail: function(error) {
              console.error(error);
            },
            complete: function(res) {
              console.log(res);
            }
        });
      },
      distanceFormat: function(t) {
        for (var e in t) t[e] > 1e3 ? t[e] = (t[e] / 1e3).toFixed(2) + "KM" : t[e] <= 1 && t[e] >= 0 ? t[e] = (100 * t[e]).toFixed(2) + "CM" : t[e] = t[e] + "M";
        return t;
      },
      updateMarksOrder: function(distance) {
       
        let markersBefore = this.data.markers;
      
        for(var i=0;i<distance.length-1;i++){
          for(var j=0;j<distance.length-1-i;j++) {
            if(distance[j]>distance[j+1]){
              let temp = distance[j];
              let temp2 = markersBefore[j]
              distance[j] = distance[j+1];
              distance[j+1] = temp;
              markersBefore[j] = markersBefore[j+1];
              markersBefore[j+1] = temp2;
            }
          }
        }
        distance = this.distanceFormat(distance);
        this.setData({ 
          markerks: markersBefore,
          distance: distance
        });
      }
})
