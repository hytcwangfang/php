<?php
	include_once "ez_sql_core.php";
	include_once "ez_sql_mysql.php";
	session_start();

	$flag = isset($_POST["flag"])?$_POST["flag"]:"";

	$userId = isset($_POST["userId"])?$_POST["userId"]:"";
	$userpwd = isset($_POST["userpwd"])?$_POST["userpwd"]:"";

	$msgFlag = isset($_POST["msgFlag"])?$_POST["msgFlag"]:"";
	$msgId = isset($_POST["msgId"])?$_POST["msgId"]:"";
	$msgSendId = isset($_POST["msgSendId"])?$_POST["msgSendId"]:"";
	$msgReceiveId = isset($_POST["msgReceiveId"])?$_POST["msgReceiveId"]:"";
	$msgContent = isset($_POST["msgContent"])?$_POST["msgContent"]:"";

	$db_msg = new ezSQL_mysql();

	//验证Session信息
	if($flag == "checkSession"){
		$sessionid = isset($_SESSION["userid"])?$_SESSION["userid"]:"";
		if($sessionid == ""){
			echo "outline";
		}else{
			echo "$sessionid";
		}
		die();
	}

	//检测是否发来“系统消息”
	if($flag == "checkSysmsg")
	{
		$sql = "select * from messageinfo where msgReceiveId = " . $userId ." and readFlag = 'unread' and msgContent like 'msg_%|%'";
		$result = $db_msg->get_results($sql);
		if($result){
			echo json_encode($result);
			die();
		}else{
			die();
		}
	}

	//将处理过的“系统消息”改为已读
	if($flag == "hasreadSysmsg"){

		if ($msgFlag != "msg_talk") {
			$sql = "update messageinfo set readFlag = 'hasread' where id = " . $msgId ."";
			$result = $db_msg->query($sql);
			if($result){
				echo "success";
			}else{
				echo "fail";
			}
		}
		die();
	}
	//“系统消息”（普通聊天消息）
	if($flag == "hasreadSysmsgtalk"){

		//将msg_talk|XXX 改为hasread|msg_talk|XXX
		$sql = "update messageinfo set msgContent = concat('hasread|',msgContent) ";
		$sql .= "where msgSendId = " . $msgSendId . " and msgReceiveId =" . $msgReceiveId . " ";
		$sql .= "and readFlag = 'unread' and msgContent like 'msg_talk|%'";
		$result = $db_msg->query($sql);
		if($result){
			echo "success";
		}else{
			echo "fail";
		}
	}
	

	//验证登陆信息
	if($flag == "checkUser"){
		$sql = "select * from userInfo where userId = " . $userId ." and userPwd = '" . $userpwd . "'";
		$result = $db_msg->get_row($sql);
		if(!$result){
			echo "fail";
		}else{
			$_SESSION["userid"] = $result->userId;
			$_SESSION["username"] = $result->userName;
			$_SESSION["userheadimg"] = $result->userHeadImg;
			$_SESSION["usershuo"] = $result->userShuo;
			echo "success";
		}
		die();
	}

	//清空SESSION
	if($flag == "clearSession"){
		$_SESSION["userid"]="";
		unset($_SESSION["username"]);
		unset($_SESSION["userheadimg"]);
		unset($_SESSION["usershuo"]);
		//$res = $_SESSION["userid"];
		//echo "$res";
		die();
	}

	//显示对应未读消息(收消息)（以及对应的今天的所有聊天内容）
	if ($flag == 'showUnreadmsg') {
		$day = date("Y-m-d");
		$sql = "SELECT msgSendId, msgReceiveId, userHeadImg, userLevel, userName, userState,msgContent,msgTime, readFlag FROM view_senderinfo ";
		$sql .= "WHERE (msgReceiveId = $msgReceiveId and msgSendId = $msgSendId and readFlag = 'unread' and (msgContent like 'msg_talk|%' or msgContent like 'hasread|msg_talk|%')) or ";
		$sql .= "(msgReceiveId = $msgSendId and msgSendId = $msgReceiveId and msgTime like '%" . $day . "%' and (msgContent like 'msg_talk|%' or msgContent like 'hasread|msg_talk|%')) or ";
		$sql .= "(msgReceiveId = $msgReceiveId and msgSendId = $msgSendId and msgTime like '%" . $day . "%' and (msgContent like 'msg_talk|%' or msgContent like 'hasread|msg_talk|%')) order by msgTime";
		$result = $db_msg->get_results($sql);
		if($result){
			echo json_encode($result);
			die();
		}else{
			die();
		}
	}

	//将未读消息设为已读
	if ($flag == 'sethasread') {

		$sql = "update messageinfo set readFlag = 'hasread' WHERE msgReceiveId = $msgReceiveId and msgSendId = $msgSendId and readFlag = 'unread'";
		$res = $db_msg->query($sql);
		if(!$res){
			echo "fail";
		}else{
		}
		die();
	}

	//从数据库获取我的信息
	if($flag == "selectme"){

		$sql = "select userName,userHeadImg,userShuo,userLevel,userState from userinfo where userId = $userId";
		$result = $db_msg->get_row($sql);
		if($result){
			echo json_encode($result);
			die();
		}else{
			die();
		}
	}

	//将发送内容添加到数据库
	if($flag == "insertmsg"){
		$sql = "INSERT INTO messageinfo(msgSendId,msgReceiveId,msgContent,msgTime,readFlag) ";
		$sql .= "VALUES ($userId,$msgReceiveId,'msg_talk|" . $msgContent . "',now(),'unread');";
		$res = $db_msg->query($sql);
		if(!$res){
			echo "fail";
		}else{
			echo "success";
		}
		die();
	}
	

?>