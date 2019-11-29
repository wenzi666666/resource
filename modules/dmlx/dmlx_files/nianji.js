
 $(document).ready(function(){		
	$(".njul li").click(function(){
		$(this).addClass('select');
		$(this).siblings().removeClass('select');
	});
			
});
var a = document.createElement("a");
window.openWin = function(url) {
	a.setAttribute("href", url);
	a.setAttribute("target", "_blank");
	document.body.appendChild(a);
	a.click();
}
function createHyperlink(index){
	var url = [];
	url[0] = "http://182.92.170.205:8011/zhihaole/log.php?&uid=zhlcsxxls01&coursecode=1ywrj02&time=1474442378524&key=123456&token=9e3a8aa776262a7334847158b0855762";
	url[1] = "http://182.92.170.205:8011/zhihaole/log.php?&uid=zhlcsxxls01&coursecode=2ywrj02&time=1474444226187&key=123456&token=6e83e4a79f96f42ddcea2cc82d003a4b";
	url[2] = "http://182.92.170.205:8011/zhihaole/log.php?&uid=zhlcsxxls01&coursecode=3ywrj02&time=1474444289484&key=123456&token=551d4a59489700a231e8076ecf409e43";
	url[3] = "http://182.92.170.205:8011/zhihaole/log.php?&uid=zhlcsxxls01&coursecode=4ywrj02&time=1474444311984&key=123456&token=cc33f1657c4133e86e641f910a8d468b";
	url[4] = "http://182.92.170.205:8011/zhihaole/log.php?&uid=zhlcsxxls01&coursecode=5ywrj02&time=1474444374187&key=123456&token=c498a5172b2b96455c9063343e97e02b";
	url[5] = "http://182.92.170.205:8011/zhihaole/log.php?&uid=zhlcsxxls01&coursecode=6ywrj02&time=1474444397906&key=123456&token=13c3e28081770f1d6602fc827f619149";

	openWin(url[index-1])
}