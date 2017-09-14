<?php

$apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
$address = urlencode( $_REQUEST['lat'] . ',' . $_REQUEST['lng'] );

$jsonOutput = file_get_contents( $apiUrl . $address );

$outputArr = json_decode( $jsonOutput, true );

if( $outputArr['status'] == "OK" ) {
	echo json_encode( array( 	'status' => 'OK', 
								'place' => $outputArr['results'][0]['formatted_address']
							) 
					  );
} else {
	echo json_encode( array( 'status' => 'ERROR' ) );
}

