// pages/details/details.js
Page({

    data: {
        none: "none",
        distance: "0KM",
        markers: {},
        package: "",
        details: {
            upgrade_at: Date.parse(new Date()) / 1e3 - 10
        }
    },
    onLoad: function(a) {
        var e = getCurrentPages(), t = e[e.length - 2];
        this.setData({
            distance: t.data.distance[a.id]
        }),
         this.getDetails(t.data.markers[a.id].id);
    },


    goLocation: function() {
        var a = this;
        wx.getLocation({
            type: "wgs84",
            success: function(e) {
                wx.openLocation({
                    longitude: Number(a.data.markers.lng),
                    latitude: Number(a.data.markers.lat),
                    name: a.data.markers.serial_no,
                    address: a.data.markers.address
                });
            }
        });
    },
    getDetails: function(id) {
        wx.request({
            method:'post',
            header:{'content-type': 'application/x-www-form-urlencoded'},
            url: 'https://m.xime8.com/Api/Machine/get_machine', //仅为示例，并非真实的接口地址
            data:{id:id},
            success: (res)=> {
                if ('1' == res.data.status) {
                    let e = [];
                    for (let n of res.data.data.package){
                        e.push(n.name);
                    } 
                    this.setData({
                        markers: res.data.data.machine,
                        package: e.toString()
                    });
                }
            }
        })
    },
    lineup: function() {
        wx.request({
            method:'post',
            header:{'content-type': 'application/x-www-form-urlencoded'},
            url: 'https://m.xime8.com/Api/Machine/get_scene_img', //仅为示例，并非真实的接口地址
            data:{id:this.data.markers.id},
            success: (res)=> {
                if ('1' == res.data.status) {
                    var t = this.data.markers;
                    t.scene_img = res.data.data.scene_img, 
                    this.setData({
                        markers: t,
                        none: "block"
                    });
                }
            }
        })
    },
    close: function() {
        this.setData({
            none: "none"
        });
    },
})