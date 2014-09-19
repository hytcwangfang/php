<?php
	include_once "include/ez_sql_core.php";
	include_once "include/ez_sql_mysql.php";
	//echo "<script type='text/javascript' src='js/jquery-1.9.1.min.js'></script>";
	session_start();
	
	$userid = isset($_POST["userid"])?$_POST["userid"]:"";
	$userpwd = isset($_POST["userpwd"])?$_POST["userpwd"]:"";

	$sessionid = isset($_SESSION["userid"])?$_SESSION["userid"]:"";
	$sessionname = isset($_SESSION["username"])?$_SESSION["username"]:"";
	$sessionimg = isset($_SESSION["userheadimg"])?$_SESSION["userheadimg"]:"";
	$sessionshuo = isset($_SESSION["usershuo"])?$_SESSION["usershuo"]:"";

	// unset($_SESSION["userid"]);
	// unset($_SESSION["username"]);
	// unset($_SESSION["userheadimg"]);
	// unset($_SESSION["usershuo"]);
	
	$db = new ezSQL_mysql();

	if ($sessionid == "") {	
		if($userid == "" || $userpwd == ""){
			//echo "<script>alert("用户名或密码不能为空！");</>";
		}else{
			$sql1 = "select * from userInfo where userId = " . $userid ." and userPwd = '" . $userpwd . "'";
			$result = $db->get_row($sql1);
			if(!$result){
				//echo "<script>alert("用户名或密码输入不正确！");</>";
			}else{
				$_SESSION["userid"] = $result->userId;
				$_SESSION["username"] = $result->userName;
				$_SESSION["userheadimg"] = $result->userHeadImg;
				$_SESSION["usershuo"] = $result->userShuo;
				//向我的所有好友发送上线消息
				//先找到我的所有好友，然后插入上线标识信息
				$sql = "SELECT friendId FROM friendinfo where userId = " . $userid ."";
				$res = $db->get_results($sql);
				if ($res) {
					foreach ($res as $friend) {
						$cursql = "INSERT INTO messageinfo(msgSendId,msgReceiveId,msgContent,msgTime,readFlag)";
						$cursql .= " VALUES(" . $userid . "," . $friend->friendId . ",'msg_login|',now(),'unread')";
						$result = $db->query($cursql);
						if(!$result){

						}else{
							
						}
					}
				}else{

				}
			}
		}
	}else{

		//修改我的在线状态：inline
		$sql1 = "update userInfo set userState = 'inline' where userId = " . $userid ."";
		$result = $db->query($sql1);
		if(!$result){

		}else{

		}
	}
	$curid = isset($_SESSION["userid"])?$_SESSION["userid"]:"";
	$curname = isset($_SESSION["username"])?$_SESSION["username"]:"";
	$curimg = isset($_SESSION["userheadimg"])?$_SESSION["userheadimg"]:"";
	$curshuo = isset($_SESSION["usershuo"])?$_SESSION["usershuo"]:"";
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<link rel="stylesheet" type="text/css" href="css/index.css">
	<link rel="stylesheet" type="text/css" href="css/jquery-ui.css">
	<script type='text/javascript' src='js/jquery-1.9.1.min.js'></script>
	<script type='text/javascript' src='js/jquery-ui.min.js'></script>
	<script type="text/javascript" src="js/index.js"></script>
	<title>首页</title>
</head>
<body>
	<div id="all">
		<div id="allleft">
			<ul class="topcontent">
					<?php
						echo '<li class="topup">';
							echo '<div class="topupleft">';
								echo "<img src='$curimg'>";
							echo '</div>';
							echo '<div class="topupright">';
								echo "<span class='span1'>$curname</span>";
								echo "<span class='span2'>$curshuo</span>";
							echo '</div>';

						echo '</li>';
					?>
					<li class="toplink">
						<a href="" class="position1"></a>
						<a href="" class="position2"></a>
						<a href="" class="position3"></a>
						<a href="" class="position4"></a>
						<a href="" class="position5"></a>
						<a href="" class="position6"></a>
						<a href="" class="position7"></a>
						<a href="" class="position8"></a>
						<a href="" class="position9"></a>
					</li>
			</ul>
			<div class="midcontent">
				<div id="huihuacontent" class="midcontentup">
					<div class="midup">
						<span class="span3">会话</span>
					</div>
					<ul class="middetail">
						<?php
							$db_friend = new ezSQL_mysql();
							$sql2 = "SELECT * FROM view_friendinfo where parentId = $curid  and userState ='inline'";
							$sql3 = "SELECT * FROM view_friendinfo where parentId = $curid  and userState ='outline'";
							$result2 = $db_friend->get_results($sql2);
							$result3 = $db_friend->get_results($sql3);
							if ($result2) {
								foreach ($result2 as $friend) {
									//在线列表
									echo "<li class='middetailli' wodeid='$curid' id='friend".$friend->userId."' friendid='$friend->userId' openstate='false' minimun='false'>";
										echo "<div class='midheadimg'>";
											echo "<a href=''><img src='$friend->userHeadImg'></a>";
										echo "</div>";
										echo "<div class='midliright'>";
											echo "<span class='midindeedname'>$friend->friendbeizhu</span>";
											echo "<span class='midusername'>($friend->userName)</span>";
											echo "<span class='midshuoshuo'>$friend->userShuo</span>";
										echo "</div>";
									echo "</li>";
								}
							}
							if ($result3) {
								foreach ($result3 as $friend) {
									//离线列表
									echo "<li class='middetailli middetaillioutline' wodeid='$curid' id='friend".$friend->userId."' friendid='$friend->userId' openstate='false' minimun='false'>";
										echo "<div class='midheadimg'>";
											echo "<a href=''><img src='$friend->userHeadImg'></a>";
										echo "</div>";
										echo "<div class='midliright'>";
											echo "<span class='midindeedname'>$friend->friendbeizhu</span>";
											echo "<span class='midusername'>($friend->userName)</span>";
											echo "<span class='midshuoshuo'>$friend->userShuo</span>";
										echo "</div>";
									echo "</li>";
								}
							}
						?>
					</ul>
				</div>
			<ul class="middown">
				<li id="huihuaspan4" class="middownli middownlispecial1">
					<div class="middownlipic">
						<img src="images/tab_icon_conversation_selected.png">
					</div>
					<span class="span4">会话</span>
				</li>
				<li id="lianxirenspan4" class="middownli">
					<div class="middownlipic">
						<img src="images/tab_icon_contact.png">
					</div>
					<span class="span4">联系人</span>
				</li>
				<li id="faxianspan4" class="middownli">
					<div class="middownlipic">
						<img src="images/tab_icon_plugin.png">
					</div>
					<span class="span4">发现</span>
				</li>
				<li id="shezhispan4" class="middownli middownlispecial2">
					<div class="middownlipic">
						<img src="images/tab_icon_setup.png">
					</div>
					<span class="span4">设置</span>
				</li>
			</ul>
			</div>
		</div>
		<div id="allright">
		</div>
		<div class="funcarea">
			<ul class="funcinfo">
				<li class="funcli">修改个人信息</li>
				<li id="signout" class="funcli">注销</li>
			</ul>
		</div>
		<ul class="mininumarea">
		</ul>
	</div>
	<div class="reloginarea">
		<form class="relogin" action="index.php" method="post">
			<h2>请登录...</h2>
			<div class="login">
				<span class="loginspan">用户名：</span>
				<input type="text" name="userid" id="userid" class="inputstyle" />
			</div>
			<div class="login">
				<span class="loginspan">密 码：</span>
				<input type="password" name="userpwd" id="userpwd" class="inputstyle" />
			</div>
			<input type="submit" class="loginbtn" value="" />
		</form>
		<!-- <form class="relogin">
			<h2>请登录...</h2>
			<div class="login">
				<span class="loginspan">用户名：</span>
				<input type="text" id="userid" class="inputstyle" />
			</div>
			<div class="login">
				<span class="loginspan">密 码：</span>
				<input type="password" id="userpwd" class="inputstyle" />
			</div>
			<input type="button" class="loginbtn" value="" />
		</form> -->
	</div>
</body>
</html>