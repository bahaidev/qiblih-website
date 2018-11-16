<?php

$latitude = $_GET["lat"];
$longitude = $_GET["lng"];

// $latitude = 38;
// $longitude = -77;
$license = "beta";
$client = new SoapClient("http://www.magnetic-declination.com/ws/ws.php?wsdl");
$declination = $client->GetMagneticDeclination(
  $latitude, $longitude, $license
);
echo $declination;

?>
