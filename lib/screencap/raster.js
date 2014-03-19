//
// Takes a screenshot of the given URL, uses named arguments passed in like so: phantomjs raster.js arg=value arg2=value2
//
// Arguments:
// - url               - URL to screenshot
// - output            - page to output (e.g. /tmp/output.png)
// - width  [optional] - default 1024 - viewport width
// - height [optional] - viewport height (see note below on using height)
// - debug  [optional] - default false - whether to do some extra debugging
// - div    [optional] - a selector to use to screenshot to a specific element
// - top, left, width, height [optional] - dimensions to use to screenshot a specific area of the screen
//
// == Important notice when providing height ==
//
// If you provide a height then we resize the html & body tags otherwise render() renders the entire page
// changing the viewport height does not affect this behaviour of render(), see https://github.com/ariya/phantomjs/issues/10619
//
var page           = new WebPage(),
    resourceWait   = 300,
    maxRenderWait  = 10000,
    args           = {},
    resourceCount  = 0,
    debug          = false,
    mask           = null,
    forcedRenderTimeout,
    renderTimeout;

//
// Functions
//
function pickupNamedArguments() {
    var i, pair;
    for(i = 0; i < phantom.args.length; i++) {
        pair = phantom.args[i].split(/=(.*)/);
        args[pair[0]] = pair[1];
    }

    if(args.url)    { args.url = decodeURIComponent(args.url); }
    if(!args.width) { args.width = 1024; }
    if(args.debug)  { debug = true; }
}

function setupMask() {
    // if given settings for an area to take create a mask for that
    if( args.top && args.left && args.width && args.height) {
        mask = {
            top:    args.top,
            left:   args.left,
            width:  args.width,
            height: args.height
        };
    }
}

function doRender() {
    clearTimeout(renderTimeout);
    clearTimeout(forcedRenderTimeout);
    page.render(args.output);
    phantom.exit();
}

function delayScreenshotForResources() {
    forcedRenderTimeout = setTimeout(doRender, maxRenderWait);
}

function evaluateWithArgs(func) {
    var args = [].slice.call(arguments, 1);
    var fn =  "function() { return (" + func.toString() + ").apply(this, " + JSON.stringify(args) + "); }";
    return page.evaluate(fn);
}

function takeScreenshot() {
   page.open(args.url, function(status) {
        if(status !== 'success') {
            console.log('Unable to load: ' + args.url);
            phantom.exit();
        } else {
            page.includeJs(
                "https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js",
                function() {

                    var foundDiv = true;
                    page.evaluate(function(){ jQuery.noConflict(); });

                    if(args.div) {
                        var clip = evaluateWithArgs(withinPage_GetDivDimensions, args.div);
                        foundDiv = clip;
                        page.clipRect = clip;
                    } else if(mask) {
                        page.clipRect = mask;
                    } else if(args.height) {
                        // have a height resize the html & body to workaround https://github.com/ariya/phantomjs/issues/10619
                        evaluateWithArgs(
                            function(w,h) {
                                jQuery('body, html').css({
                                    width: w + 'px',
                                    height: h + 'px',
                                    overflow: 'hidden'
                               });
                            },
                            page.viewportSize.width,
                            page.viewportSize.height
                        );
                    }

                    if(foundDiv) {
                        delayScreenshotForResources();
                    } else {
                        phantom.exit();
                    }
                }
            );
        }
    });
}

//
// Functions evaluated within the page context
//
function withinPage_GetDivDimensions(div){
    var $el = jQuery(div);

    if($el.length === 0){
        console.log(div + ' was not found. exiting');
        return false;
    }

    var dims    = $el.offset();
    dims.height = $el.height();
    dims.width  = $el.width();
    return dims;
}

//
// Event handlers
//
page.onConsoleMessage = function(msg) {
    console.log('from page: ' + msg);
};

page.onResourceRequested = function(req) {
    resourceCount += 1;
    if(debug) { console.log('> ' + req.id + ' - ' + req.url); }
    clearTimeout(renderTimeout);
};

page.onResourceReceived = function(res) {
    if(!res.stage || res.stage == 'end') {
        resourceCount -= 1;
        if(debug) {
            console.log(res.id + ' ' + res.status + ' - ' + res.url);
            console.log(resourceCount + ' resources remaining');
        }
        if(resourceCount === 0) {
            // Once all resources are loaded, we wait a small amount of time
            // (resourceWait) in case these resources load other resources.
            clearTimeout(forcedRenderTimeout);
            renderTimeout = setTimeout(doRender, resourceWait);
        }
    }
};

//
// Do the processing
//
pickupNamedArguments();
setupMask();

console.log(JSON.stringify(args));

if( !args.url || !args.output ) {
    console.log('Usage: raster.js url=URL output=filename width=width[optional] height=height[optional] debug=true/false[optional] (div=div[optional] OR top=top left=left width=width height=height)');
    phantom.exit();
}

page.viewportSize = { width: args.width, height: args.height || 1024 };

takeScreenshot();
