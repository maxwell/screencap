var page = new WebPage(),
    address, output, div;

if (phantom.args.length < 2 || phantom.args.length > 4) {
    console.log('Usage: rasterize.js URL filename div(optional) OR top, left, width, height');
    phantom.exit();
} 

address = phantom.args[0];
output = phantom.args[1];
mask = {}

if(phantom.args.length > 3){ //then this is defining a top, left, width, height
    mask.top = phantom.args[2]
    mask.left = phantom.args[3]
    mask.width = phantom.args[4]
    mask.height = phantom.args[5]
}else{
    div = phantom.args[2];
}

//console.log(address, output, div)

function evaluate(page, func) {
    var args = [].slice.call(arguments, 2);
    var fn = "function() { return (" + func.toString() + ").apply(this, " + JSON.stringify(args) + ");}";
    return page.evaluate(fn);
}

 function returnDivDimensions(div){
    var $el = jQuery(div);
    
    if($el.length == 0){ console.log(div + ' was not found. exiting'); phantom.exit(); } //if you dont find the div, abort!

    var box = $el.offset()
    box.height = $el.height();
    box.width = $el.width();
    return box;
}

page.onConsoleMessage = function (msg) { 
    console.log("from page: " + msg); 
};

page.viewportSize = { width: 1000, height: 550 }

page.open(address, function (status) {
     if (status !== 'success') {
            console.log('Unable to load:' + address);
            phantom.exit();
        } 
    //once page loaded, include jQuery from cdn
    page.includeJs("https://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
        page.evaluate(function(){jQuery.noConflict()})

        if(div) {
            var clip =  evaluate(page, returnDivDimensions, div);
            

            page.clipRect = clip;
        }else if (mask){
            page.clipRect = mask
        }


        page.render(output);
        phantom.exit();     
    });
});
