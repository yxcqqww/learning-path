/*
 1. 项目名称：m.360guanai.com
 2. 页面名称：appDownload(APP下载)
 3. 作者：刘昌逵(liuchangkui@guanaihui.com)
 4. 备注：
*/

function AppDownloadController(){
	// 继承Controller
	Controller.call(this);
	
	this.bindEvent();
}
// 绑定事件
AppDownloadController.prototype.bindEvent = function(){
	require([this.staticDomain + '/guanaihui/js/download.min.js'],function(){
			var tm = new Terminal();
			// 只要是微信，就提示用户在浏览器打开
			if(tm.isWeChat()){
				$("#btnDownload").click(function(){
					$("#tipPanel").removeClass("hidden");
					$("#tipPanel").unbind("click").bind("click",function(){
						$(this).addClass("hidden");
					});
				});
			}
			// 如果是安卓，直接下载
			else if(tm.isAndroid()){
				$("#btnDownload").click(function() {
					window.location.href = 'http://mobile-app.oss-cn-hangzhou.aliyuncs.com/download/android/guanaihui_v1.1.0.apk';
				});
			}
			// 如果是IOS，自动跳转到iTunes下载
			else if(tm.isIPhone()){
				$("#btnDownload").click(function() {
					window.location.href = 'https://itunes.apple.com/cn/app/guan-ai-hui/id1036167230?mt=8';
				});
			}
	});
}

$(document).ready(function(){
	new AppDownloadController();
});