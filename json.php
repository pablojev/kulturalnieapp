<?php
	$file = $_GET['action'];
	
	switch ($file){
		case 'api':
			include_once('api.php');
			break;
		
		case 'distance':
			include_once('distance.php');
			break;
		
		case 'geolocation':
			include_once('geolocation.js');
			break;
			
		case 'scroll_loading':
			include_once('scroll_loading.js');
			break;
			
		case 'filter_results':
			include_once('filter_results.js');
			break;
		
		default:
			echo json_encode(array('status' => 'ERROR'));
	}
?>