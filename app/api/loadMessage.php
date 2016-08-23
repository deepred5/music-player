<?php  
	require_once('connect.php');

	$mid = $_GET['mid'];

	$sql = "select * from message_list where mid = $mid";

	$query = mysql_query($sql);
	
	if( $query && mysql_num_rows($query) ){
		while($row = mysql_fetch_assoc($query)){
			$data[] = $row;
		}
		echo json_encode($data);
	}

?>