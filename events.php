<?php
    /*
     * Parametry:
     *  Wymagane:
         *  lat
         *  lng
         *  distanceMax
         *  dateStart
         *  dateEnd
     *  Opcjonalne:
         *  category
         *  limit
         * offset
         * count
     */

    $categories=array(1=>'Kino', 19=>'Teatr', 51=>'Sztuka', 35=>'Muzyka', 83=>'Nauka', 61=>'Literatura', 69=>'Rozrywka', 77=>'Rekreacja', 96=>'Inne');

	error_reporting(E_ALL & ~E_NOTICE);

	$jsonInput=file_get_contents("http://planer.info.pl/api/rest/places.json");
	$places=json_decode($jsonInput, true);
		
	if(isset($_GET['lat'])==false || isset($_GET['lng'])==false || isset($_GET['distanceMax'])==false || isset($_GET['dateStart'])==false || isset($_GET['dateEnd'])==false)
	{
		echo json_encode( array('status'=>'ERROR') );
        return;
	}
		
	$lat=$_GET['lat'];
	$lng=$_GET['lng'];
	$distanceMax=$_GET['distanceMax'];
	$dateStart=$_GET['dateStart'];
	$dateEnd=$_GET['dateEnd'];
	if(isset($_GET['category']) && $_GET['category'] != '')
		$category='&category='.$_GET['category'];
	else
		$category='';
    if(isset($_GET['limit']))
        $limit='&limit='.$_GET['limit'];
    else
        $limit='';
	
	
	$locationList='[';

	for($i=0; $i!=count($places); ++$i)
	{
		$distance=sqrt(pow(cos(M_PI*$lng/180)*($places[$i]['address']['lat']-$lat), 2)+pow($places[$i]['address']['lng']-$lng, 2))*M_PI*(12756.274/360);
		if($distance<=$distanceMax)
		{
		    $places[$i]['distance']=$distance;
			$locationList.=$places[$i]['id'].',';
		}
	}

	if(strlen($locationList)==1)
    {
        echo json_encode( array('status'=>'NO_DATA') );
        return;
    }
    $locationList=substr($locationList, 0, strlen($locationList)-1);
	$locationList.=']';

	$jsonEvents=file_get_contents("http://planer.info.pl/api/rest/events.json?place=".$locationList.'&start_date='.$dateStart.'&end_date='.$dateEnd.$category.$limit);
	$events=json_decode($jsonEvents, true);



	for($i=0; $i!=count($events); ++$i){
        for($j=0; $j!=count($places); ++$j)
            if($events[$i]['place']['id']==$places[$j]['id']){
                $events[$i]['place']=$places[$j];
                $events[$i]['category']=$categories[$events[$i]['categoryId']];
                break;
            }
    }


    uasort($events,
        function($a, $b){
            return $a['place']['distance']>$b['place']['distance'];
        });


    if(isset($_GET['offset']) && isset($_GET['count']))
        $events=array_slice($events, $_GET['offset'], $_GET['count']);

    echo json_encode($events);
?>