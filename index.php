<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<title>Qiblih.com - Find the direction to Bahji</title>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css" href="styles.css" />
</head>
<body>
<div id="container">
<div id="header"></div>
  <div id="wrapper">
    <div id="content">
      <p><strong>Simply enter your address and use the red line to locate the direction to Bahji.</strong></p>
      <p>In the Bahá'í Faith the Qiblih is the location that Bahá'ís should face when saying their daily obligatory prayers, and is fixed at the Shrine of Bahá'u'lláh in Bahjí, near Akká, in present day Israel.</p>
      
      <div id="MapForm">
  		  <form onsubmit="Qibla.locateAddress(); return false;" action="/">
  			<input type="text" id="QAddress" value="" name="QAddress" class="textfield" size="50"/>
  			<input type="submit" id="submit" value="Locate"/>
        </form>
      </div>
      <div id="QMap"> <br/>&nbsp; Loading Google Map... </div>

      <div id="MapDetails"> 
      	<div class="info-tab"> Latitude <br/><span id="QHomeLat" class="QValue"></span></div>
      	<div class="info-tab"> Longitude <br/><span id="QHomeLng" class="QValue"></span></div>
      	<div class="info-tab"> Distance <br/><span id="QDistance" class="QValue"></span></div>
        <div class="info-tab direction-tab"> True Direction <br/>
      		<span id="QDirection" class="QDirection"></span><span id="QDirLabel" class="QValue"></span></div>
        <div class="info-tab direction-tab"> Magnetic Direction (<a href="javascript:Qibla.showDeclination();" title="declination">Update</a>)<br/>
      		<span id="QDirectionmag" class="QDirectionmag"></span><span id="QDirLabelmag" class="QValue"></span></div>
        
      	<div style="clear: both"></div>
      </div>
      
      <p>Q: Why is the line not straight?<br />
      A: The direction is determined by the shortest path between two points on the surface of a sphere. The shortest path lies on an arc of a great circle. When a path along a great circle is drawn on a flat map, it usually looks curved.</p>
      <p>Q: Why are there two different direction indicators?<br />
      A: The map data provided by Google is based on true north. The "Magnetic Direction" indicator factors in the magnetic declination for your geopraphic region so that you can use a magnetic compass.<br />
      Magnetic declination varies both from place to place, and with the passage of time.</p>
    </div> 
  </div>
  <div id="navigation">
    <p><strong>Menu</strong></p>
    <ul>
      <li><a href="index.php">Home</a></li>
      <li><a href="info.php">Information</a></li>
      <li><a href="links.php">Useful sites</a></li>
    </ul>
  </div>
  <div id="extra">

  </div>
  <div id="trivia">
    <p><em>Did you know that you can easily finger count to 95? <a href="counting.php">Click here to find out more.</a></em></p>
  </div>
  <div id="footer">
    <p>Qiblih.com - 2009</p>
  </div>
  
</div>
<img src="/images/sitebg.jpg" id="bgtexture">

<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
try {
var pageTracker = _gat._getTracker("UA-3958649-6");
pageTracker._trackPageview();
} catch(err) {}</script>
</body>
</html>
<script src="http://maps.google.com/maps?file=api&amp;v=2&amp;key=ABQIAAAAvGCEiN0Sw3_fm3et3W8TaBQgT9IyraRswGlJmBAtF_8lKRqEkRQ1Y3xNwUY9ps_2GVqEDjRRBrdygg" type="text/javascript"></script>
<script src="http://qiblih.com/qiblih.js" type="text/javascript"></script>

<script type="text/javascript">

	// init Qiblih map
	function init()	{
		var params = {
			lat:  '',
			lng:  '',
			zoom: '',
			type: '',
			addr: ''
		};
		Qibla.startMap(params);
	}

	window.onload = init;
	window.onunload = function() { Qibla.unload() };


</script>

