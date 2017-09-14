<?php

$apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=';

$address = urlencode( $_REQUEST['address'] );

$jsonData = file_get_contents( $apiUrl . $address );

$dataArr = json_decode( $jsonData, true );

if( $dataArr['status'] === "OK" ) {
    echo json_encode( [
        'status' => 'OK',
        'lat' => $dataArr['results'][0]['geometry']['location']['lat'],
        'lng' => $dataArr['results'][0]['geometry']['location']['lng']
    ] );
} else {
    echo json_encode( [
        'status' => 'ERROR'
    ] );
}