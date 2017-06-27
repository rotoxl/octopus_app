<?php
//local db server
if ($_SERVER['HTTP_HOST']=='localhost:8888' || 
	$_SERVER['HTTP_HOST']=='189.89.248.141:8888'){
	$dbhost = 'localhost';
	$dbport = '8889';
	$dbname = 'tapp37';
	$username = 'root';
	$password = 'root';
	}
else {
	$dbhost = 'remote db host ** secret **';
	$dbport = '3306';
	$dbname = 'remote db name  ** secret **';
	$username = 'remote db username ** secret **';
	$password = 'remote db password  ** secret **';
	}

$secret=" ** secret **";

$showSQL=true;
//para comprobar las compras en googlePlay
$GPLAY_BILLINGKEY='** SECRET **';
$GPLAY_GAMEID='** SECRET **'

?>