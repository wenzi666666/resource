(function() {
	window.openwin = function(url) {
	    var a = document.createElement("a");  
	    a.setAttribute("href", url);  
	    a.setAttribute("target", "_new");  
	    document.body.appendChild(a);  
	    a.click();
	}
}());