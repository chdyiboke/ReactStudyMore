/**
 * Moli门户公共JS yaoleib@yonyou.com Create by 20180412
 */
window.moli = (function(w, m){
    // 是否私有部署
    m.G_PRIVIATE_DEPLOY = true;
    // 门户ID
    m.G_PORTAL_APPID = "moli-um-template";

    // 全局请求url
    m.G_COMMON_URL = "http://molicloud.app.yyuap.com/moli/";
    // 租户ID
    m.G_COMPANY_ID = "moli";
    
    // EMM地址
    m.G_EMM_URL = "https://emm.yonyoucloud.com";
    // EMM端口
    m.G_EMM_PORT = "443";
    // EMM MDM功能开关
    m.G_EMM_MDM_SWITCH = false;
    
    // 智能助手服务地址
    m.G_ROBOT_URL ="https://aiserver.yonyoucloud.com";
    
    // 图像验证码地址
    m.G_VALIIMAGE_URL = 'https://euc.yonyoucloud.com/cas/images/getValiImage?ts=';
    
    // 刷新显示文本
    m.G_TEXT_DOWN = "放手啊，不想刷新别拉我(｡•ˇ‸ˇ•｡)";
    m.G_TEXT_UP = "够了啊，我赶着刷新呢(｡•ˇ‸ˇ•｡)";
    m.G_TEXT_DO = "别急，马上就好(｡•ˇ‸ˇ•｡)";
            
    // 网络请求封装
    m.ajaxRequest = function(paramObj, successCallback, errorCallback) {
        // 判断网络
        if (!summer.netAvailable()) {
            summer.refreshHeaderLoadDone();
            summer.refreshFooterLoadDone();
            summer.toast({
                msg: "网络异常，请检查网络"
            });
            return false;
        }
        if(!paramObj.unLoading){
            summer.showProgress();
        }    
        var requestPath = ''
        if (paramObj.emmUrl) {
            requestPath = m.G_EMM_URL + ":" + m.G_EMM_PORT + paramObj.url;
        } else if (paramObj.robotUrl) {
            requestPath = m.G_ROBOT_URL + paramObj.url;
        } else {
            requestPath = m.G_COMMON_URL + paramObj.url;
        }
    
        var header = m.getDeviceidAndToken();
        if (paramObj.contentType) {
            header["Content-Type"] = paramObj.contentType;
        }
        
        // 设置超时
        window.cordovaHTTP.settings = {
            timeout: paramObj.timeout || 30000
        };
        summer.ajax({
            type: paramObj.type,
            url: requestPath,
            param: paramObj.param,
            // 考虑接口安全，每个请求都需要将这个公告header带过去
            header: header
        }, function (ret) {
            summer.hideProgress();
            summer.refreshHeaderLoadDone();
            summer.refreshFooterLoadDone();
            var data;
            if ($summer.isJSONObject(ret.data)) {
                data = ret.data;
            } else {
                data = JSON.parse(ret.data);
            }
            successCallback(data);
        }, function (err) {
            summer.hideProgress();
            summer.refreshHeaderLoadDone();
            summer.refreshFooterLoadDone();
            var tokenerror = summer.getStorage("G-TOKEN-ERROR");
            // 避免过快点击到其它页面出现连续跳转到登录页面的现象
            if (tokenerror) {
                return false;
            }
            // 判断是否token失效
            if (err.status == "401") {
                var code = JSON.parse(err.error).code;
                if(code == "402"){
                    m.tokenInvalid();
                } else {
                    m.tokenExpire();
                }
                return;
            }
            errorCallback(err);// 执行自己的错误其它逻辑
        });
    }
    
    // 文件上传
    m.fileUpload = function(paramObj, successCallback, errorCallback) {
        // 判断网络
        if (!summer.netAvailable()) {
            summer.refreshHeaderLoadDone();
            summer.refreshFooterLoadDone();
            summer.toast({
                msg: "网络异常，请检查网络"
            });
            return false;
        }
        if(!paramObj.unLoading){
            summer.showProgress();
        }    
    
        var requestPath = m.G_COMMON_URL + paramObj.url;
        
        summer.multiUpload({
            fileArray : paramObj.fileArray,
            params : paramObj.params,
            headers : m.getDeviceidAndToken(),
            SERVER : requestPath
        }, function(ret){
            summer.hideProgress();
            summer.refreshHeaderLoadDone();
            summer.refreshFooterLoadDone();
            successCallback(ret);
        }, function(err) {
            summer.hideProgress();
            summer.refreshHeaderLoadDone();
            summer.refreshFooterLoadDone();
            if (err.http_status == "401") {
                if(err.code == "402"){
                    m.tokenInvalid();
                } else {
                    m.tokenExpire();
                }
                return;
            }
            errorCallback(err);// 执行自己的错误其它逻辑
        });
    }
    
    // 添加Header信息
    m.getDeviceidAndToken = function() {
        var deviceId = summer.getDeviceInfo().deviceid;
        var moliUserInfo = summer.getStorage("moliUserInfo");
        var moliToken = moliUserInfo ? moliUserInfo.moliToken : "";
        var memberId = moliUserInfo ? moliUserInfo.id : "";
        return {
            "deviceId": deviceId,
            "token": moliToken,
            "code": memberId
        }
    }
    
    // Token失效处理
    m.tokenInvalid = function() {
        // 设置token标志
        summer.setStorage("G-TOKEN-ERROR", true);
        // 清除moliUserInfo，直接退出之后，再进入可以直接跳入到登录
        var tempMoliUserInfo = summer.getStorage('moliUserInfo');
        var moliUserInfo = {
            account : tempMoliUserInfo.account
        }
        summer.setStorage("moliUserInfo", moliUserInfo);
        // 退出有信
        im.logout({});
        // 退出emm
        emm.logout({});
        summer.initializeWin({
            id: 'login',
            url: 'comps/login/index.html'
        });
    }
    
    // Token过期处理
    m.tokenExpire = function() {
        var account = summer.getStorage('moliUserInfo') ? summer.getStorage('moliUserInfo').account : '';
        var password = summer.getStorage('moliUserInfo') ? summer.getStorage('moliUserInfo').password : '';
        moli.ajaxRequest({
            type : "post",
            url : "/auth/login",
            param : {
                userName : account,
                password : password
            },
            unLoading: true
        }, function(res) {
            if (res.flag == 0) {
                m.moliUserInfo = summer.getStorage("moliUserInfo");
                m.moliUserInfo.moliToken = res.data.moliToken; 
                //m.moliUserInfo.expir = res.data.expir || ''; //没用删除
                m.moliUserInfo.imToken = res.data.imToken || '';
                
                // 退出有信
                im.logout({});
                // 登录IM
                var params = {
                    userinfo : {
                        usercode : m.moliUserInfo.userId,
                        userName : m.moliUserInfo.userName
                    }
                };
                im.login(params, function() {
                    summer.setStorage('moliUserInfo', m.moliUserInfo);
                    summer.setAppStorage('moliUserInfo', m.moliUserInfo);
                    
                    //注册成功后跳转到首页
                    summer.openWin({
                        type : 'tabBar',
                        id : 'homePage',
                        addBackListener : "true",
                        url : 'index.html',
                        create : 'false',
                        isKeep : false
                    });
                }, function() {
                    m.tokenInvalid();
                });
            } else {
                m.tokenInvalid();
            }
        }, function(err) {
            m.tokenInvalid();
        });
    }
    
    // 无数据公共处理
    m.createNull = function(id, url, text) {
        var url = url ? url : "../img/def_empty.png";
        var text = text ? text : "暂无数据";
        var html = '<div class="default-error" style="display: -webkit-box;display: flex; -webkit-box-pack: center;justify-content: center; -webkit-box-align: center;align-items: center; -webkit-box-orient: vertical; -webkit-box-direction: normal;flex-direction: column;width: 100%;height: 100%;position: fixed;">' + '<img src=' + url + ' style="width:30%;" alt=""/>' + '<p style="font-size: 14px;color: #CBCBCB;padding-top:20px;">' + text + '</p>' + '</div>';
        var curId = $summer.byId(id);
        $summer.html(curId, html);
    }
    
    // 随机颜色选择
    m.getColor = function(name) {
        var color = ['#eead10', '#f99a2b', '#f38134', '#6495ed', '#3ab1aa', '#0abfb5', '#06aae1', '#00bfff', '#96bc53', '#00ced1', '#89a8e0'];
        var newName = encodeURI(name).replace(/%/g, "");
        var lastName,
            hexadecimal,
            tenBinary;
        if (newName.length >= 6) {
            lastName = newName.substr(lastName, 6);
            hexadecimal = parseInt(lastName, 16);
            tenBinary = hexadecimal % 10;
            if (isNaN(tenBinary)) {
                return color[10];
            }
            return color[tenBinary]
        } else {
            return color[10]
        }
    }
    
    // 获取姓名后两位字符
    m.getName = function(name) {
        if (name) {
            return name.slice(-2);
        } else {
            return "";
        }
    }
    
    //涉及到头像处理
    m.thumbOnload = function(ev) {
        var ev = ev || window.event;
        var oImg = ev.target;
        $(oImg).removeAttr('style');
        var w = oImg.naturalWidth;
        var h = oImg.naturalHeight;
        var parentW = $(oImg).parent().width();
        var parentH = $(oImg).parent().height();
        var move;
        if (w >= h) {
            $(oImg).css('height', parentH);
            var actuallyW = parseFloat($(oImg).css('width'));
            move = -(actuallyW - parentW) / 2 + "px";
            $(oImg).css("transform", "translate(" + move + ",0)");
        } else {
            $(oImg).css('width', parentW);
            var actuallyH = parseFloat($(oImg).css('height'));
            move = -(actuallyH - parentH) / 2 + "px";
            $(oImg).css("transform", "translate(0," + move + ")");
        }
        $(oImg).css("display", "block");
    }
    
    // 设置缓存
    m.setCache = function (key, data, duration) {
        try {
            var _obj = {
                data: data,
                datetime: (new Date()).getTime(),
                duration: duration || 30000
            }
            summer.setStorage(key, _obj);
        } catch (e) {
            alert("ERR100:setCache出错了\n" + e);
        }
    }
    
    // 获取缓存
    m.getCache = function (key) {
        try {
            var old = null; //旧数据
            try {
                old = summer.getStorage(key);
            } catch (e) {
                alert("ERR104:缓存数据转json出错了,\n仅支持json数据缓存\n" + e);
                return null;
            }
            if (old == null) 
                return;
            var oldT = old.datetime;
            var dur = old.duration;
            if ((new Date()).getTime() - parseInt(oldT) <= parseInt(dur)) {
                return old.data;
            } else {
                summer.rmStorage(key);
                return null;
            }
        } catch (e) {
            alert("ERR103:getCache出错了\n" + e);
        }
    }
    
    // 下拉刷新
    m.setRefreshHeaderInfo = function(callback){
        summer.setRefreshHeaderInfo({
            visible: true,
            textColor: '#4d4d4d',
            textDown: m.G_TEXT_DOWN,
            textUp: m.G_TEXT_UP,
            textDo: m.G_TEXT_DO,
            showTime: false,
            style: "moli"
        }, callback);
    }

    // 上拉刷新
    m.setRefreshFooterInfo = function(callback){
        summer.setRefreshFooterInfo({
            visible: true,
            textColor: '#4d4d4d',
            textDown: m.G_TEXT_DOWN,
            textUp: m.G_TEXT_UP,
            textDo: m.G_TEXT_DO,
            showTime: false,
            style: "moli"
        }, callback);
    }
    
    return m;
})(window, window.moli || {});

// 处理预置文本
(function (w) {
    if (typeof $ == "undefined")
        return;
    $.fn.placeholder = function () {
        return this.each(function () {
            var $this = $(this);
            var holderText = $this.attr('placeholder');
            var holder = $('<div class="x-placeholder">' + holderText + '</div>');

            holder.css({
                position: 'absolute',
                display: 'none',
                zIndex: 999,
                cursor: 'text',
                wordWrap: 'break-word',
                color: '#bbb'
            });

            $this.after(holder).removeAttr('placeholder').parent().css('position', 'relative');

            $this.bind('focus', function () {
                holder.hide();
            }).bind('blur', function () {
                if ($this.val().length)
                    return;

                var offset = $this.offset();
                var top = (parseInt($this.css('paddingTop'), 10) || 0) + (parseInt($this.css('borderTop'), 10) || 0) + (parseInt($this.parent().css('padding-top'), 10) || 0);
                var left = (parseInt($this.css('paddingLeft'), 10) || 0) + (parseInt($this.css('borderLeft'), 10) || 0) + (parseInt($this.parent().css('padding-left'), 10) || 0);
                holder.css({
                    top: top,
                    left: left,
                    width: $this.width()
                }).show();
            }).trigger('blur');

            holder.bind('click', function () {
                $this.focus();
            });
        });
    };
})(window);

// 字体REM
(function (doc, win) {
    var docEl = doc.documentElement;
    var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    var recalc = function() {
        var clientWidth = docEl.clientWidth;
        if (clientWidth >= 750) {
            clientWidth = 750;
        };
        if (!clientWidth)
            return;
        docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
    };
    if (!doc.addEventListener)
        return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false); 

})(document, window);

