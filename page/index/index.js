let app = getApp();


// 内网穿透工具: https://developers.dingtalk.com/document/resourcedownload/http-intranet-penetration?pnamespace=app
// 替换成开发者后台设置的安全域名
let domain = "http://localhost:8080";
let url = domain + '/login';

Page({
    data:{
        corpId: '',
        authCode:'',
        userId:'',
        userName:'',
        hideList: true,
    },
    login() {
        dd.showLoading();
        dd.getAuthCode({
            success:(res)=>{
                // 1. 获取免登授权码
                this.setData({
                    authCode:res.authCode
                })
                
                // 2. 根据免登授权码获取用户身份
                dd.httpRequest({
                    url: url,
                    method: 'POST',
                    data: {
                        authCode: res.authCode
                    },
                    dataType: 'json',
                    success: (res) => {
                        if (res && res.data.success) {
                            console.log('httpRequest success --->', res);
                            let userId = res.data.result.userId;
                            let userName = res.data.result.userName;
                            this.setData({
                                userId:userId,
                                userName:userName,
                                hideList:false
                            })
                        } else {
                            console.log("httpRequest failed --->", res);
                            dd.alert({content: JSON.stringify(res)});
                        }
                    },
                    fail: (res) => {
                        console.log("httpRequest failed --->", res);
                        dd.alert({content: JSON.stringify(res)});
                    },
                    complete: (res) => {
                        dd.hideLoading();
                    }
                    
                });
            },
            fail: (err)=>{
                console.log("getAuthCode failed --->", err)
                dd.alert({
                    content: JSON.stringify(err)
                })
            }
        })

    },
    onLoad(){
        let _this = this;
        this.setData({
            corpId: app.globalData.corpId
        })        
    }
})
