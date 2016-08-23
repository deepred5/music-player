<?php  

	/** 数据库的名称 */

	define('DB_NAME', 'demo');

	/** MySQL数据库用户名 */

	define('DB_USER', 'root');

	/** MySQL数据库密码 */

	define('DB_PASSWORD', '1234');

	/** MySQL主机 */

	define('DB_HOST', 'localhost');


	header("Content-type: text/html; charset=utf-8");

	$con = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD);

	mysql_select_db(DB_NAME);

	mysql_query('set names utf8');

?>