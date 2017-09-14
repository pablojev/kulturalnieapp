$(document).ready(function() {
	var lat, lng;
	var cate = '';
	
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;
	var yyyy = today.getFullYear();

	if(dd<10) {
		dd='0'+dd
	} 

	if(mm<10) {
		mm='0'+mm
	} 

	today = yyyy+'-'+mm+'-'+dd;
	
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition, showError);
	}
	$("#my-calendar").zabuto_calendar({
		language: "en",		
		action: function() { 
			myDateFunction(this.id); 
		} 
	});
	
	
	var boxH = Math.ceil($('.bar').height());
	$('.map').css('min-height', (boxH+28) + 'px')
	var infowindow = new google.maps.InfoWindow();
	var marker;
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 10, 
		center: new google.maps.LatLng(54.3503503, 18.6382734),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});
	/**/
	
	
	function myDateFunction(id) {
		var date = $("#" + id).data("date");
		var hasEvent = $("#" + id).data("hasEvent");
		//alert(date);
		//var dt = date.split('-').reverse().join('.');
		dt = date;
		today = date;
		$.ajax({
			url: "events.php",
			dataType: 'json',
			data: { lat: lat, lng: lng, distanceMax: 100, rand: Math.random() * 10000000000, dateStart: dt, dateEnd: dt, category: cate },
			success: function(data) {
				console.log(data);
				$('.contentBox').html('');
				for(var i in data) {
                    marker = new google.maps.Marker({
						 position: new google.maps.LatLng(data[i].place.address.lat, data[i].place.address.lng),
						 map: map
					});

					google.maps.event.addListener(marker, 'click', (function(marker, i) {
						return function() {
							infowindow.setContent(data[i].place.name);
							infowindow.open(map, marker);
						}
					})(marker, i));
					
					$('<div/>', { class: 'singlePost' }).html(data[i].descLong).appendTo('.contentBox');
				}
				if(data.length == 0) {
					$('.contentBox').html('Brak wydarzeń dla wybranego dnia.');
				}
			}
		});
	}
	
	/* http://localhost/kulturalnieapp/events.php?lat=54.3520252&lng=18.6466384&distanceMax=100&dateStart=24.10.2016&dateEnd=24.10.2016 */
	function showPosition(position) {
		var currentLocalisationInfo = $('.localisationInfo').html();
		lat = position.coords.latitude;
		lng = position.coords.longitude;
		$('.formularz').addClass('dispBlck');
		$.ajax({
			url: "bycoords.php",
			dataType: 'json',
			data: { lat: position.coords.latitude, lng: position.coords.longitude, rand: Math.random() * 10000000000 },
			success: function(data) {
				console.log(data);
				console.log(position.coords.latitude, position.coords.longitude);
				if( data.status == "OK" ) {
					//$('.localisationInfo').html('<p>Twoja lokalizacja to:<br/><strong class="txt">'+data.place+'</strong></p><p><button class="btnLocalYes" type="submit">Tak</button><button class="btnLocalNo" type="submit">Nie</button></p>');
					$('<p/>').html('Twoja lokalizacja to: <br/><strong>' + data.place+ '</strong>').appendTo('.localisationInfo');
					$('<br/>').appendTo('.localisationInfo');
					$('<button/>', { class: 'btnLocalYes' }).html('Tak').on('click', function() {
						$('#map').removeClass('grayscale');
						$('.formularz').hide(0);
						$('.bar').addClass('dispBlck');
						$('.contentBox').css('display', 'block');
						$('#map').addClass('resizeMap');
					}).appendTo('.localisationInfo');
					$('<button/>', { class: 'btnLocalNo', id: 'test' }).html('Nie').on('click', function() {
						$('.localisationInfo').html(currentLocalisationInfo);
					    $('#lokalizacja').css('display', 'block').html(data.place);
                        $('#confirmLocation').on('click', function() {
                            $('#map').removeClass('grayscale');
				            $('.formularz').hide(0);
				            $('.bar').addClass('dispBlck');
				            $('.contentBox').css('display', 'block');
				            $('#map').addClass('resizeMap');
                            var address = $('#lokalizacja').val();
                            $.ajax( {
                                url: "byaddress.php",
                                dataType: 'json',
                                data: { address: address, rand: Math.random() * 1000000000 },
                                success: function(data) {
                                    if( data.status == "OK" ) {
                                        lat = data.lat;
                                        lng = data.lng;
                                    } else {
                                        console.log('ERROR');
                                    }
                                }
                            });
                        }).appendTo('.localisationInfo');

                    }).appendTo('.localisationInfo');
					
				} else {
					alert('ERROR');
				}
                    $('.brightButton').on('click', function() {
                        $('.bar').css('background-color', '#99ccff');
                        $('.search').css('border-bottom', '2px solid #99ccff');
                        $('.searchBtn').css('border-bottom', '2px solid #99ccff');
                        $('.tekst').css('color', 'black');
                        $('.wyborKolorow').css('color', 'black');
                        $('.cate').css('color', 'black');
                        $('#logo_obrazek').css('filter','none');
                        $('.brightButton').css('color','black');
                        $('.darkButton').css('color','black');
                        
                        
                    
                    }); 
                    $('.darkButton').on('click', function() {
                        $('.bar').css('background-color', '#333366');
                        $('.search').css('border-bottom', '2px #261478');
                        $('.searchBtn').css('border-bottom', '2px #261478');
                        $('.tekst').css('color', 'white');
                        $('.wyborKolorow').css('color', 'white');
                        $('.cate').css('color', 'white');
                        $('#logo_obrazek').css('filter','invert()');
                        $('.darkButton').css('color','white');
                        $('.brightButton').css('color','white');
                        
                        
                        
                    });
                
				$("#test").click(function(){
					$("#confirmLocation").show();
					$("#lokalizacja").show();
				});
			}
		});
		//
		/*
		$('.btnLocalNo').on('click', function() {
			$('.localisationInfo').html(currentLocalisationInfo);
		});
		
		$('.btnLocalYes').on('click', function() {
			$('#map').removeClass('grayscale');
			$('.formularz').hide(0);
			$('.bar').addClass('dispBlck');
			$('.contentBox').css('display', 'block');
			$('#map').addClass('resizeMap');
		});
		*/
	}	
	
	$('.cate').on('click', function() {
		var cateId = $(this).data('id');
		$('.allCate li a').removeClass('activeCate');
		$(this).addClass('activeCate');
		cate = cateId;
		
		$.ajax({
			url: "events.php",
			dataType: 'json',
			data: { lat: lat, lng: lng, distanceMax: 100, rand: Math.random() * 10000000000, dateStart: today, dateEnd: today, category: cate },
			success: function(data) {
				console.log('dane:' + data);
				$('.contentBox').html('');
				for(var i in data) {
					console.log(data[i]);
					marker = new google.maps.Marker({
						 position: new google.maps.LatLng(data[i].place.address.lat, data[i].place.address.lng),
						 map: map
					});

					google.maps.event.addListener(marker, 'click', (function(marker, i) {
						return function() {
							infowindow.setContent(data[i].place.name);
							infowindow.open(map, marker);
						}
					})(marker, i));
					$('<div/>', { class: 'singlePost' }).html(data[i].descLong).appendTo('.contentBox');
					if(cate == '' && i == data.length-1) continue;
				}
				if(data.length == 0) {
					$('.contentBox').html('Brak wydarzeń dla wybranego dnia.');
				}
			}
		});
		return false;
	});
	
	function showError(e) {
		switch(e.code) {
			case e.PERMISSION_DENIED:
				console.log("Użytkownik odmówił dostępu do lokalizacji.");
				break;
			case e.POSITION_UNAVAILABLE:
				console.log("Informacja o lokalizacji jest niedostępna.");
				break;
			case e.TIMEOUT:
				console.log("Minął czas oczekiwania na lokalizację.");
				break;
			case e.UNKNOWN_ERROR:
				console.log("Wystąpił nieznany błąd.");
				break;
		}
	}
});