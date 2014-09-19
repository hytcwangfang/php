$(function(){

	//查看Session
	$.ajax({
		type:"POST",
		url:"include/chatservice.php",
		data:{flag:'checkSession'},
		success:function(res){
			// 1 alert(res); 
			if(res == "outline"){
				//显示登陆框
				$("#all").hide();
				$(".reloginarea").show();
			}else{
				//显示在线主页sessionid=>res
				$(".reloginarea").hide();
				$("#all").show();
				//检测发来的“系统消息”
				checkSysmsg(res);
			}
		}
	});

				

	//登陆按钮
	/*$(document).on("click",".loginbtn",function(){
		var userid = $("#userid").val();
		var userpwd = $("#userpwd").val();
		if(userid == "" || userpwd == ""){
			//提示错误
		}else{
			checkUser(userid,userpwd);
		}
		
	});*/
	 
	//对话框
	$(".middetailli").click(function(){
		var wodeid = $(this).attr("wodeid");
		var friendid = $(this).attr("friendid");
		var id = $(this).attr("id");
		var thisshuo = $(this).find(".midshuoshuo").html();
		//显示对话框
		showdialog(id,wodeid);
		if(thisshuo == "【新消息】"){
			//将对应的“系统消息”改为“已读”
			$.ajax({
				type:"POST",
				url:"include/chatservice.php",
				data:{flag:'hasreadSysmsgtalk',msgSendId:friendid,msgReceiveId:wodeid},
				success:function(res){
					//alet(res);
				}
			});
			$(this).find(".midshuoshuo").html("");
			$(this).find(".midshuoshuo").css({"color":"#AAAAAA"});
		}
		

		var html = $("#chatarea" + friendid).find(".rightcontent").html();

		var val = $("#chatarea" + friendid).find(".rightfootinput").val();

		//显示未读消息（收消息）
		receivemsg(wodeid,friendid);
		
		// setTimeout(function(){
		// 	receivemsg(wodeid,friendid);
		// }, 1000); 
	
		//关闭按钮
		$(".rightclosebtn").click(function(){

			var wodeid = $(this).attr("wodeid");
			var friend = $(this).attr("friend");
			var friendid = $(this).attr("friendid");
			var chatareaid = $(this).attr("chatareaid");
			/*alert(indeedname);*/
			$("#" + chatareaid).remove();
			$("#" + friendid).attr("openstate","false");

			//将未读消息设为已读
			$.ajax({
				type:"POST",
				url:"include/chatservice.php",
				data:{flag:'sethasread',msgReceiveId:wodeid,msgSendId:friend},
				success:function(res){

				}
			});

		});

		//将选中的置顶
		$(".rightall").click(function(){
			$(".rightall").css("z-index","15");
			$(this).css("z-index","20");
		});
		
		//大笑脸表情按钮
		$(".rightfootsmile").click(function(){
			var openstate = $(this).attr("openstate");
			var chatareaid = $(this).attr("chatareaid");
			if(openstate == "false"){
				$("#" + chatareaid).find(".rightcontent").css("height","98px");
				$("#" + chatareaid).find(".feelingarea").show();
				$(this).attr("openstate","true");
			}else{
				$("#" + chatareaid).find(".rightcontent").css("height","400px");
				$("#" + chatareaid).find(".feelingarea").hide();
				$(this).attr("openstate","false");
			};
		});


		//发送按钮
		$(".rightfootsend").click(function(){

			//clearTimeout(timehandle);

			var wodeid = $(this).attr("wodeid");
			var chatareaid = $(this).attr("chatareaid");
			var friendid = $(this).attr("friendid");
			var html = $("#" + chatareaid).find(".rightcontent").html();
			var val = $("#" + chatareaid).find(".rightfootinput").val();
			if(val != ""){

				//在内容区添加发送内容
				$.ajax({
					type:"POST",
					url:"include/chatservice.php",
					data:{flag:'selectme',userId:wodeid},
					success:function(res){

						var obj = eval("(" + res + ")");//解码变成js代码
						//alert(obj);
						//var html = '';
						html += '<div class="textarea">';
						html += '	<div class="textmasterright">';
						html += '		<img src=" '+ obj.userHeadImg +'">';
						html += '	</div>';
						html += '	<div class="textcontentleft">';
						html += '		<div class="textmastername">';
						html += '			<span class="span08">' + obj.userName + '</span>';
						html += '		</div>';
						html += '		<div class="textdetail">';
						html += '			<span class="span09">' + val + '</span>';
						html += '		</div>';
						html += '	</div>';
						html += '</div>';
						$("#" + chatareaid).find(".rightcontent").html(html);
						$("#" + chatareaid).find(".rightfootinput").val("");

						//滚动条滑到最底部
						var height = $("#" + chatareaid).find(".rightcontent").scrollHeight();
						$("#" + chatareaid).find(".rightcontent").scrollTop(height);
					}
				});


				//将发送内容添加到数据库
				$.ajax({
					type:"POST",
					url:"include/chatservice.php",
					data:{flag:'insertmsg',userId:wodeid,msgReceiveId:friendid,msgContent:val},
					success:function(res){
						
					}

				});
			}

			//timehandle = setTimeout("receivemsg(" + wodeid + "," + friendid + ")",1000);
		});
	
		//圆点选择表情图
		$(".littlecircleimgli").click(function(){
			var chatareaid = $(this).parent().parent().attr("id");
			var moodid=$(this).attr("moodid");
			$(this).parent().find(".circle").css("background","none repeat scroll 0% 0% #808080");
			$(this).find(".circle").css("background","none repeat scroll 0% 0% #000");
			$("#" + chatareaid).find(".feelingimglist").hide();
			$("#" + chatareaid).find("#" + moodid).show();
		});

		//选中表情后
		$(".feelingimgsli li").click(function(){
			var title = $(this).attr("title");
			var chatareaid = $(this).parent().parent().parent().attr("chatareaid");
			if(title != "delKey"){
				title = '[' + title + ']';
				var val = $("#" + chatareaid).find(".rightfootinput").val();
				val += title;
				$("#" + chatareaid).find(".rightfootinput").val(val);
			}
		});

		//窗口在整个body中移动
		$(".rightall").draggable({ 
			handle: ".righttittle",
			containment:"body",
			scroll:false
		});
	});


	//窗口最小化
	$(document).on("click",".rightclosebtnmini",function(){

		var miniid = $(this).attr("miniid");
		var friendid = $(this).attr("friendid");
		var chatareaid = $(this).attr("chatareaid");
		var indeedname = $(this).attr("indeedname");
		$("#" + chatareaid).hide();
		$(".mininumarea").show();
		var html = $(".mininumarea").html();
		html += '<li class="mini" id="mini' + miniid + '" friendid = ' + friendid + ' chatareaid = ' + chatareaid + '>';
		html += '	<span class="span010">' + indeedname + '</span>';
		html += '</li>';
		$(".mininumarea").html(html);
		$("#" + friendid).attr("minimun","true");
		$("#" + friendid).attr("openstate","true");

	
		//打开迷你窗口
		$(".mini").click(function(){
			var chatareaid = $(this).attr("chatareaid");
		 	var friendid = $(this).attr("friendid");
			$(this).remove();
		 	$("#" + friendid).attr("minimun","false");
		 	$("#" + chatareaid).show();
		});
	});

	//注销按钮
	$(document).on("click","#signout",function(){

		//清空session 有错误
		clearSession();
		inithtml();
	});	


	
});

var imgshowsrc="css/images/open_arrow_fire.png";
var imghidesrc="css/images/open_arrow.png";
var index=0;

var timehandle;

function inithtml(){
	/*var html = '';
	html = '<div class="reloginarea">';
	html = '	<form class="relogin" action="index.php" method="post">';
	html = '		<h2>请登录...</h2>';
	html = '		<div class="login">';
	html = '			<span class="loginspan">用户名：</span>';
	html = '			<input type="text" name="userid" id="userid" class="inputstyle" />';
	html = '		</div>';
	html = '		<div class="login">';
	html = '			<span class="loginspan">密 码：</span>';
	html = '			<input type="password" name="userpwd" id="userpwd" class="inputstyle" />';
	html = '		</div>';
	html = '		<input type="submit" class="loginbtn" value="" />';
	html = '	</form>';
	html = '</div>';
	$("body").html(html);*/
	$("#all").hide();
	$(".reloginarea").show();
}

function checkUser(id,pwd){
	$.ajax({
		type:"POST",
		url:"include/chatservice.php",
		data:{flag:'checkUser',userId:id,userpwd:pwd},
		success:function(res){
			if ( res =="fail") {
				//提示验证错误
				alert(res);
			}else{
				//alert(res);
				$("#all").show();//应该重新加载
				$(".reloginarea").hide();
			}
		}
	});

}

function clearSession(){
	//alert("OK");
	//清空session
	$.ajax({
		type:"POST",
		url:"include/chatservice.php",
		data:{flag:'clearSession'},
		success:function(res){
			//alert(res);
		}
		
	});

}


function showdialog(idname,myid){
		var divtop = Math.random() * 25 + 75;
		var divleft = Math.random() * 300 + 10;
		var friendid = $("#" + idname).attr("friendid");
		var chatareaid = "chatarea" + friendid;
		var indeedname = $("#" + idname).find(".midindeedname").html();
		var openstate = $("#" + idname).attr("openstate");
		var minimun = $("#" + idname).attr("minimun");
		$(".rightall").css("z-index","15");
		if(openstate=="false"){
			var html = $("#allright").html();
			html += '<div class="rightall" id=' + chatareaid + '>';
			html += '	<div class="righttittle">';
			html += '		<div class="rightdownbtn" chatareaid = ' + chatareaid + ' openstate="false">';
			html += '			<div class="rightdownbtnpic">';
			html += '				<img src="images/pannel-arrow-down.png">';
			html += '			</div>';
			html += '		</div>';
			html += '		<span class="span07">' + indeedname + '</span>';
			html += '		<div class="rightclosebtnmini" miniid=' + friendid + ' friendid = "friend' + friendid + '" chatareaid = ' + chatareaid + ' indeedname = ' + indeedname + '>';
			html += '			<span class="span06">最小化</span>';
			html += '		</div>';
			html += '		<div class="rightclosebtn" wodeid=' + myid + ' friend=' + friendid + ' friendid = "friend' + friendid + '" chatareaid = ' + chatareaid + '>';
			html += '			<span class="span06">关闭</span>';
			html += '		</div>';
			html += '		<div class="directiondown">';
			html += '			<ul>';
			html += '				<li class="directionli">';
			html += '					<div class="directionlipic position10"></div>';
			html += '					<span class="span001">群成员</span>';
			html += '				</li>';
			html += '				<li class="directionli">';
			html += '					<div class="directionlipic position42"></div>';
			html += '					<span class="span001">群资料</span>';
			html += '				</li>';
			html += '				<li class="directionli">';
			html += '					<div class="directionlipic position43"></div>';
			html += '					<span class="span001">聊天记录</span>';
			html += '				</li>';
			html += '			</ul>';
			html += '		</div>';
			html += '	</div>';
			html += '	<div class="rightcontent"></div>';
			html += '	<div class="rightfoot">';
			html += '		<div class="rightfootsmile" chatareaid = ' + chatareaid + '  openstate="false">';
			html += '			<img src="images/chat_bottombar_icon_face.png">';
			html += '		</div>';
			html += '		<div class="inputarea">';
			html += '			<input class="rightfootinput">';
			html += '		</div>';
			html += '		<div class="rightfootsend" wodeid=' + myid + ' friendid=' + friendid + ' chatareaid = ' + chatareaid + '><span>发送</span></div>';
			html += '	</div>';
			/*表情区域*/
			html += '	<div class="feelingarea">';
			html += '		<ul id="mood1" class="feelingimglist" chatareaid = ' + chatareaid + '>';
			html += '			<li>';
			html += '				<ul class="feelingimgsli">';
			html += '					<li class="feelingimg1 position20" title="微笑"></li>';
			html += '					<li class="feelingimg1 position21" title="撇嘴"></li>';
			html += '					<li class="feelingimg1 position22" title="色"></li>';
			html += '					<li class="feelingimg1 position23" title="发呆"></li>';
			html += '					<li class="feelingimg1 position24" title="得意"></li>';
			html += '					<li class="feelingimg1 position25" title="流泪"></li>';
			html += '					<li class="feelingimg1 position26" title="害羞"></li>';
			html += '				</ul>';
			html += '			</li>';
			html += '			<li>';
			html += '				<ul class="feelingimgsli">';
			html += '					<li class="feelingimg1 position27" title="闭嘴"></li>';
			html += '					<li class="feelingimg1 position28" title="睡"></li>';
			html += '					<li class="feelingimg1 position29" title="大哭"></li>';
			html += '					<li class="feelingimg1 position30" title="尴尬"></li>';
			html += '					<li class="feelingimg1 position31" title="发怒"></li>';
			html += '					<li class="feelingimg1 position32" title="调皮"></li>';
			html += '					<li class="feelingimg1 position33" title="呲牙"></li>';
			html += '				</ul>';
			html += '			</li>';
			html += '			<li>';
			html += '				<ul class="feelingimgsli">';
			html += '					<li class="feelingimg1 position34" title="惊讶"></li>';
			html += '					<li class="feelingimg1 position35" title="难过"></li>';
			html += '					<li class="feelingimg1 position36" title="酷"></li>';
			html += '					<li class="feelingimg1 position37" title="冷汗"></li>';
			html += '					<li class="feelingimg1 position38" title="抓狂"></li>';
			html += '					<li class="feelingimg1 position39" title="吐"></li>';
			html += '					<li class="feelingimg1 position40" title="delKey"></li>';
			html += '				</ul>';
			html += '			</li>';
			html += '		</ul>';
			html += '		<ul id="mood2" class="feelingimglist" chatareaid = ' + chatareaid + '>';
			html += '			<li>';
			html += '				<ul class="feelingimgsli">';
			html += '					<li class="feelingimg2 position20" title="偷笑"></li>';
			html += '					<li class="feelingimg2 position21" title="可爱"></li>';
			html += '					<li class="feelingimg2 position22" title="白眼"></li>';
			html += '					<li class="feelingimg2 position23" title="傲慢"></li>';
			html += '					<li class="feelingimg2 position24" title="饥饿"></li>';
			html += '					<li class="feelingimg2 position25" title="困"></li>';
			html += '					<li class="feelingimg2 position26" title="惊恐"></li>';
			html += '				</ul>';
			html += '			</li>';
			html += '			<li>';
			html += '				<ul class="feelingimgsli">';
			html += '					<li class="feelingimg2 position27" title="流汗"></li>';
			html += '					<li class="feelingimg2 position28" title="憨笑"></li>';
			html += '					<li class="feelingimg2 position29" title="大兵"></li>';
			html += '					<li class="feelingimg2 position30" title="奋斗"></li>';
			html += '					<li class="feelingimg2 position31" title="咒骂"></li>';
			html += '					<li class="feelingimg2 position32" title="疑问"></li>';
			html += '					<li class="feelingimg2 position33" title="嘘"></li>';
			html += '				</ul>';
			html += '			</li>';
			html += '			<li>';
			html += '				<ul class="feelingimgsli">';
			html += '					<li class="feelingimg2 position34" title="晕"></li>';
			html += '					<li class="feelingimg2 position35" title="折磨"></li>';
			html += '					<li class="feelingimg2 position36" title="衰"></li>';
			html += '					<li class="feelingimg2 position37" title="骷髅"></li>';
			html += '					<li class="feelingimg2 position38" title="敲打"></li>';
			html += '					<li class="feelingimg2 position39" title="再见"></li>';
			html += '					<li class="feelingimg2 position40" title="delKey"></li>';
			html += '				</ul>';
			html += '			</li>';
			html += '		</ul>';
			html += '		<ul id="mood3" class="feelingimglist" chatareaid = ' + chatareaid + '>';
			html += '			<li>';
			html += '				<ul class="feelingimgsli">';
			html += '					<li class="feelingimg3 position20" title="擦汗"></li>';
			html += '					<li class="feelingimg3 position21" title="抠鼻"></li>';
			html += '					<li class="feelingimg3 position22" title="鼓掌"></li>';
			html += '					<li class="feelingimg3 position23" title="糗大了"></li>';
			html += '					<li class="feelingimg3 position24" title="坏笑"></li>';
			html += '					<li class="feelingimg3 position25" title="左哼哼"></li>';
			html += '					<li class="feelingimg3 position26" title="右哼哼"></li>';
			html += '				</ul>';
			html += '			</li>';
			html += '			<li>';
			html += '				<ul class="feelingimgsli">';
			html += '					<li class="feelingimg3 position27" title="哈欠"></li>';
			html += '					<li class="feelingimg3 position28" title="鄙视"></li>';
			html += '					<li class="feelingimg3 position29" title="委屈"></li>';
			html += '					<li class="feelingimg3 position30" title="快哭了"></li>';
			html += '					<li class="feelingimg3 position31" title="阴险"></li>';
			html += '					<li class="feelingimg3 position32" title="亲亲"></li>';
			html += '					<li class="feelingimg3 position33" title="吓"></li>';
			html += '				</ul>';
			html += '			</li>';
			html += '			<li>';
			html += '				<ul class="feelingimgsli">';
			html += '					<li class="feelingimg3 position34" title="可怜"></li>';
			html += '					<li class="feelingimg3 position35" title="菜刀"></li>';
			html += '					<li class="feelingimg3 position36" title="西瓜"></li>';
			html += '					<li class="feelingimg3 position37" title="啤酒"></li>';
			html += '					<li class="feelingimg3 position38" title="篮球"></li>';
			html += '					<li class="feelingimg3 position39" title="乒乓"></li>';
			html += '					<li class="feelingimg3 position40" title="delKey"></li>';
			html += '				</ul>';
			html += '			</li>';
			html += '		</ul>';
			html += '		<ul id="mood4" class="feelingimglist" chatareaid = ' + chatareaid + '>';
			html += '			<li>';
			html += '				<ul class="feelingimgsli">';
			html += '					<li class="feelingimg4 position20" title="咖啡"></li>';
			html += '					<li class="feelingimg4 position21" title="饭"></li>';
			html += '					<li class="feelingimg4 position22" title="猪头"></li>';
			html += '					<li class="feelingimg4 position23" title="玫瑰"></li>';
			html += '					<li class="feelingimg4 position24" title="凋谢"></li>';
			html += '					<li class="feelingimg4 position25" title="示爱"></li>';
			html += '					<li class="feelingimg4 position26" title="爱心"></li>';
			html += '				</ul>';
			html += '			</li>';
			html += '			<li>';
			html += '				<ul class="feelingimgsli">';
			html += '					<li class="feelingimg4 position27" title="心碎"></li>';
			html += '					<li class="feelingimg4 position28" title="蛋糕"></li>';
			html += '					<li class="feelingimg4 position29" title="闪电"></li>';
			html += '					<li class="feelingimg4 position30" title="炸弹"></li>';
			html += '					<li class="feelingimg4 position31" title="刀"></li>';
			html += '					<li class="feelingimg4 position32" title="足球"></li>';
			html += '					<li class="feelingimg4 position33" title="瓢虫"></li>';
			html += '				</ul>';
			html += '			</li>';
			html += '			<li>';
			html += '				<ul class="feelingimgsli">';
			html += '					<li class="feelingimg4 position34" title="便便"></li>';
			html += '					<li class="feelingimg4 position35" title="月亮"></li>';
			html += '					<li class="feelingimg4 position36" title="太阳"></li>';
			html += '					<li class="feelingimg4 position37" title="礼物"></li>';
			html += ' 					<li class="feelingimg4 position38" title="拥抱"></li>';
			html += ' 					<li class="feelingimg4 position39" title="强"></li>';
			html += ' 					<li class="feelingimg4 position40" title="delKey"></li>';
			html += ' 				</ul>';
			html += ' 			</li>';
			html += ' 		</ul>';
			html += '		<ul id="mood5" class="feelingimglist" chatareaid = ' + chatareaid + '>';
			html += '			<li>';
			html += '				<ul class="feelingimgsli">';
			html += '					<li class="feelingimg5 position20" title="弱"></li>';
			html += '					<li class="feelingimg5 position21" title="握手"></li>';
			html += '					<li class="feelingimg5 position22" title="胜利"></li>';
			html += '					<li class="feelingimg5 position23" title="抱拳"></li>';
			html += '					<li class="feelingimg5 position24" title="勾引"></li>';
			html += '					<li class="feelingimg5 position25" title="拳头"></li>';
			html += '					<li class="feelingimg5 position26" title="差劲"></li>';
			html += '				</ul>';
			html += '			</li>';
			html += '			<li>';
			html += '				<ul class="feelingimgsli">';
			html += '					<li class="feelingimg5 position27" title="爱你"></li>';
			html += '					<li class="feelingimg5 position28" title="NO"></li>';
			html += '					<li class="feelingimg5 position29" title="OK"></li>';
			html += '					<li class="feelingimg5 position30" title="爱情"></li>';
			html += '					<li class="feelingimg5 position31" title="飞吻"></li>';
			html += '					<li class="feelingimg5 position32" title="跳跳"></li>';
			html += '					<li class="feelingimg5 position33" title="发抖"></li>';
			html += '				</ul>';
			html += '			</li>';
			html += '			<li>';
			html += '				<ul class="feelingimgsli">';
			html += '					<li class="feelingimg5 position34" title="怄火"></li>';
			html += '					<li class="feelingimg5 position35" title="转圈"></li>';
			html += '					<li class="feelingimg5 position36" title="磕头"></li>';
			html += '					<li class="feelingimg5 position37" title="回头"></li>';
			html += '					<li class="feelingimg5 position38" title="跳绳"></li>';
			html += '					<li class="feelingimg5 position39" title="挥手"></li>';
			html += '					<li class="feelingimg5 position40" title="delKey"></li>';
			html += '				</ul>';
			html += '			</li>';
			html += '		</ul>';
			html += '		<ul id="mood6" class="feelingimglist" chatareaid = ' + chatareaid + '>';
			html += '			<li>';
			html += '				<ul class="feelingimgsli">';
			html += '					<li class="feelingimg6 position20" title="激动"></li>';
			html += '					<li class="feelingimg6 position21" title="街舞"></li>';
			html += '					<li class="feelingimg6 position22" title="献吻"></li>';
			html += '					<li class="feelingimg6 position23" title="左太极"></li>';
			html += '					<li class="feelingimg6 position24" title="右太极"></li>';
			html += '					<li class="feelingimg6 position25" title="双喜"></li>';
			html += '					<li class="feelingimg6 position26" title="鞭炮"></li>';
			html += '				</ul>';
			html += '			</li>';
			html += '			<li>';
			html += '				<ul class="feelingimgsli">';
			html += '					<li class="feelingimg6 position27" title="灯笼"></li>';
			html += '					<li class="feelingimg6 position28" title="发财"></li>';
			html += '					<li class="feelingimg6 position29" title="K歌"></li>';
			html += '					<li class="feelingimg6 position30" title="购物"></li>';
			html += '					<li class="feelingimg6 position31" title="邮件"></li>';
			html += '					<li class="feelingimg6 position32" title="帅"></li>';
			html += '					<li class="feelingimg6 position33" title="喝彩"></li>';
			html += '				</ul>';
			html += '			</li>';
			html += '			<li>';
			html += '				<ul class="feelingimgsli">';
			html += '					<li class="feelingimg6 position34" title="祈祷"></li>';
			html += '					<li class="feelingimg6 position35" title="爆筋"></li>';
			html += '					<li class="feelingimg6 position36" title="棒棒糖"></li>';
			html += '					<li class="feelingimg6 position37" title="喝奶"></li>';
			html += '					<li class="feelingimg6 position38" title="下面"></li>';
			html += '					<li class="feelingimg6 position39" title="香蕉"></li>';
			html += '					<li class="feelingimg6 position40" title="delKey"></li>';
			html += '				</ul>';
			html += '			</li>';
			html += '		</ul>';
			html += '		<div class="feelingnextchoose" id="' + chatareaid + '">';
			html += '			<ul class="littlecircleimglist">';
			html += '				<li moodid="mood1" class="littlecircleimgli">';
			html += '					<div class="circle circlespecial"></div>';
			html += '				</li>';
			html += '				<li moodid="mood2"  class="littlecircleimgli">';
			html += '					<div class="circle"></div>';
			html += '				</li>';
			html += '				<li moodid="mood3" class="littlecircleimgli">';
			html += '					<div class="circle"></div>';
			html += '				</li>';
			html += '				<li moodid="mood4" class="littlecircleimgli">';
			html += '					<div class="circle"></div>';
			html += '				</li>';
			html += '				<li moodid="mood5" class="littlecircleimgli">';
			html += '					<div class="circle"></div>';
			html += '				</li>';
			html += '				<li moodid="mood6" class="littlecircleimgli">';
			html += '					<div class="circle"></div>';
			html += '				</li>';
			html += '			</ul>';
			html += '		</div>';
			html += '	</div>';
			html += '</div>';

			$("#allright").html(html);

			$("#" + chatareaid).css({
				"top" : divtop + "px",
				"left" : divleft + "px",
				"z-index" : "20"
			});
			$("#" + idname).attr("openstate","true");
		}
		else{
			if( minimun == "true")
			{
				$("#" + chatareaid).show();
				$("#" + idname).attr("minimun","false");
				$("#mini" + friendid).remove();
			}
			else{
				//将已有的置顶
				$(".rightall").css("z-index","15");
				$("#" + chatareaid).css("z-index","20");
			}
		};	
}

function receivemsg(myid,friend){

	//显示未读消息（收消息）
		$.ajax({
			type:"POST",
			url:"include/chatservice.php",
			data:{flag:'showUnreadmsg',msgReceiveId:myid,msgSendId:friend},
			success:function(res){

				var objs = eval("(" + res + ")");//解码变成js代码
				$("#chatarea" + friend).find(".rightcontent").html(" ");

				$.each(objs,function(){
					var msgflag = this.msgContent.split("|");
					var html = '';

					if (this.msgSendId == myid) {
						//我今天发给好友的
						html += '<div class="textarea">';
						html += '	<div class="textmasterright">';
						html += '		<img src=" '+ this.userHeadImg +'">';
						html += '	</div>';
						html += '	<div class="textcontentleft">';
						html += '		<div class="textmastername">';
						html += '			<span class="span08">' + this.userName + '</span>';
						html += '		</div>';
						html += '		<div class="textdetail">';
						html += '			<span class="span09">' + msgflag[1] + '</span>';
						html += '		</div>';
						html += '	</div>';
						html += '</div>';
						
						$("#chatarea" + friend).find(".rightcontent").append(html);

					}else{
						//好友今天发给我的以及之前发的我还未读
						html += '<div class="textareaopp">';
						html += '	<div class="textmasteropp">';
						html += '		<img src=" '+ this.userHeadImg +'">';
						html += '	</div>';
						html += '	<div class="textcontentleft">';
						html += '		<div class="textmasternameopp">';
						html += '			<span class="span08">' + this.userName + '</span>';
						html += '		</div>';
						html += '		<div class="textdetailopp">';
						if(msgflag[0] == "hasread"){
							html += '			<span class="span09">' + msgflag[2] + '</span>';
						}else{
							html += '			<span class="span09">' + msgflag[1] + '</span>';
						}
						html += '		</div>';
						html += '	</div>';
						html += '</div>';
						
						$("#chatarea" + friend).find(".rightcontent").append(html);
					}
				});
			}
		});

		timehandle = setTimeout("receivemsg(" + myid + "," + friend + ")",1000);
}

function checkSysmsg(wodeid){

	//处理好友操作状态的消息
	$.ajax({
		type:"POST",
		url:"include/chatservice.php",
		data:{flag:'checkSysmsg',userId:wodeid},
		success:function(res){			
			var objs = eval("(" + res + ")");
			$.each(objs,function(){
				var msgflag = this.msgContent.split("|");				
				var thisid = this.msgSendId;
				var msgid = this.id;
				if(msgflag[0] == "msg_login"){
					//有人上线
					$("#friend" + thisid).removeClass("middetaillioutline");
				}else if(msgflag[0] == "msg_logout"){
					//有人离线
					$("#friend" + thisid).addClass("middetaillioutline");
				}else if(msgflag[0] == "msg_change"){
					//有人改变了头像
					//alert(msgflag[1]);
					$("#friend" + thisid).find(".midheadimg img").attr("src",msgflag[1]);
				}else if(msgflag[0] == "msg_talk"){
					//有人发来新消息
					var openstate = $("#friend" + thisid).attr("openstate");
					var minimun = $("#friend" + thisid).attr("minimun");
					if (openstate == "true") {
						//对话窗口已经打开 
					}else if (openstate == "false" || minimun == "true"){
						//对话窗口未打开或最小化状态
						var html = '【新消息】';
						$("#friend" + thisid).find(".midshuoshuo").html(html);
						$("#friend" + thisid).find(".midshuoshuo").css({"color":"red"});
					}
						
				}//处理新消息，注意要改成已读的正确时侯

				//还要做：有人改了昵称，有人新发说说

				//=>改为已读
				$.ajax({
					type:"POST",
					url:"include/chatservice.php",
					data:{flag:'hasreadSysmsg',msgId:msgid,msgFlag:msgflag[0]},
					success:function(res){
						//alet(res);
					}
				});
			});
		}
	});

	
	setTimeout(function(){
		checkSysmsg(wodeid);
	},1000);
}