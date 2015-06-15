<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<title>Qiblih.com - Counting</title>
<meta http-equiv="content-type" content="text/html; charset=iso-8859-1">
<link rel="stylesheet" type="text/css" href="styles.css" />
<script type="text/javascript" src="/jquery.js"></script>
<script type="text/javascript">
    <!--

    // wrap as a jQuery plugin and pass jQuery in to our anoymous function
    (function ($) {
        $.fn.cross = function (options) {
            return this.each(function (i) { 
                // cache the copy of jQuery(this) - the start image
                var $$ = $(this);
                
                // get the target from the backgroundImage + regexp
                var target = $$.css('backgroundImage').replace(/^url|[\(\)'"]/g, '');

                // nice long chain: wrap img element in span
                $$.wrap('<span style="position: relative;"></span>')
                    // change selector to parent - i.e. newly created span
                    .parent()
                    // prepend a new image inside the span
                    .prepend('<img>')
                    // change the selector to the newly created image
                    .find(':first-child')
                    // set the image to the target
                    .attr('src', target);

                // the CSS styling of the start image needs to be handled
                // differently for different browsers
                if ($.browser.msie || $.browser.mozilla) {
                    $$.css({
                        'position' : 'absolute', 
                        'left' : 0,
                        'background' : '',
                        'top' : this.offsetTop
                    });
                } else if ($.browser.opera && $.browser.version < 9.5) {
                    // Browser sniffing is bad - however opera < 9.5 has a render bug 
                    // so this is required to get around it we can't apply the 'top' : 0 
                    // separately because Mozilla strips the style set originally somehow...                    
                    $$.css({
                        'position' : 'absolute', 
                        'left' : 0,
                        'background' : '',
                        'top' : "0"
                    });
                } else { // Safari
                    $$.css({
                        'position' : 'absolute', 
                        'left' : 0,
                        'background' : ''
                    });
                }

                // similar effect as single image technique, except using .animate 
                // which will handle the fading up from the right opacity for us
                $$.hover(function () {
                    $$.stop().animate({
                        opacity: 0
                    }, 500);
                }, function () {
                    $$.stop().animate({
                        opacity: 1
                    }, 500);
                });
            });
        };
        
    })(jQuery);
    
    // note that this uses the .bind('load') on the window object, rather than $(document).ready() 
    // because .ready() fires before the images have loaded, but we need to fire *after* because
    // our code relies on the dimensions of the images already in place.
    $(window).bind('load', function () {
        $('img.fade').cross();
    });
    
    //-->
</script>

</head>
<body>
<div id="container">
<div id="header"></div>
  <div id="wrapper">
    <div id="content">
      <p><strong>Finger Counting to 95</strong></p>
      <p>If you happen to be without prayer beads you can easily keep track of your recitation of 95 Alláh'u'Abhás using your fingers. Simply use one hand's finger tips and joints to count to 19 and use your other <br /> hand's five fingers to keep track of every 19 repetitions. 5 times 19 equals 95.</p>
      <p>Move your mouse over the image below to see the 19 points.</p>
      <div>
        <img class="fade" src="images/hand_simple.jpg" style="background: url(images/hand_numbers.jpg);" alt="Hand" />
      </div>

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
    <p><strong>Advertising</strong></p>
    <p><em>Would you like to see your advertisement here? Please send me an email for more details.</em></p>
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
