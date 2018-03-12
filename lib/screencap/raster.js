//
// Takes a screenshot of the given URL, uses named arguments passed in like so: phantomjs raster.js arg=value arg2=value2
//
// Arguments:
// - url                      - URL to screenshot
// - output                   - page to output (e.g. /tmp/output.png)
// - width         [optional] - default 1024 - viewport width
// - height        [optional] - viewport height (see note below on using height)
// - debug         [optional] - default false - whether to do some extra debugging
// - div           [optional] - a selector to use to screenshot to a specific element
// - resourceWait  [optional] - default 300 - the time to wait after the last resource has loaded in MS before taking the screenshot
// - maxRenderWait [optional] - default 10000 - the maximum time to wait before taking the screenshot, regardless of whether resources are waiting to be loaded
// - cutoffWait    [optional] - default null - the maximum time to wait before cutting everything off and failing...this helps if there is a page taking a long time to load
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
    cutoffWait     = null,
    args           = {},
    resourceCount  = 0,
    debug          = false,
    mask           = null,
    forcedRenderTimeout,
    renderTimeout,
    cutoffTimeout;

//
// Functions
//
function pickupNamedArguments() {
    var pair, scriptArgs;
    if(typeof phantom.args != 'undefined') {
        // phantomjs < 2.0
        scriptArgs = phantom.args;
    } else {
        // phantomjs 2.0
        var system = require('system');
        scriptArgs = system.args;
        // remove first arg as always script name
        scriptArgs.shift();
    }

    scriptArgs.forEach(function(arg, i) {
        pair = arg.split(/=(.*)/);
        args[pair[0]] = pair[1];
    });

    if(!args.width)        { args.width = 1024; }
    if(!args.dpi)          { args.dpi = 1; }
    if(args.url)           { args.url = decodeURIComponent(args.url); }
    if(args.debug)         { debug = true; }
    if(args.resourceWait)  { resourceWait = args.resourceWait; }
    if(args.maxRenderWait) { maxRenderWait = args.maxRenderWait; }
    if(args.cutoffWait)    { cutoffWait = args.cutoffWait; }
}

function setupMask() {
    // if given settings for an area to take create a mask for that
    if(!args.div && args.width && args.height) {
        mask = {
            top:    args.top || 0,
            left:   args.left || 0,
            width:  args.width,
            height: args.height
        };
    }
}

function doRender() {
    clearTimeout(renderTimeout);
    clearTimeout(forcedRenderTimeout);
    clearTimeout(cutoffTimeout);
    if (updateClipping()) {
        page.render(args.output);
    } else {
        console.log('Not rendering as clipping failed, likely due to not finding the div');
    }
    phantom.exit();
}

// if the page is taking too long (set via cutoffWait) to load, just exit cleanly
function cutoff() {
    clearTimeout(renderTimeout);
    clearTimeout(forcedRenderTimeout);
    console.log('Unable to load: ' + args.url + '. Process exceeded cutoff timeout.');
    phantom.exit();
}

function delayScreenshotForResources() {
    forcedRenderTimeout = setTimeout(doRender, maxRenderWait);
}

function cutoffExecution() {
  if(cutoffWait != null) {
    cutoffTimeout = setTimeout(cutoff, cutoffWait);
  }
}

function evaluateWithArgs(func) {
    var args = [].slice.call(arguments, 1);
    var fn =  "function() { return (" + func.toString() + ").apply(this, " + JSON.stringify(args) + "); }";
    return page.evaluate(fn);
}

function takeScreenshot() {
    cutoffExecution();
    page.open(args.url, function(status) {
        if(status !== 'success') {
            console.log('Unable to load: ' + args.url);
            phantom.exit();
        } else {
            delayScreenshotForResources();
        }
    });
}

function updateClipping() {
    var foundDiv = true;

    if(args.div) {
        var clip = evaluateWithArgs(withinPage_GetDivDimensions, args.div);
        foundDiv = !!clip;
        page.clipRect = clip;
    } else if(mask) {
        page.clipRect = mask;
    }

    if (args.dpi !== 1) {
        evaluateWithArgs(
            function(dpi) {
                document.body.style.webkitTransform = "scale(" + dpi + ")";
                document.body.style.webkitTransformOrigin = "0% 0%";
                document.body.style.width = (100 / dpi) + "%";
            },
            args.dpi
        );
    }

    return foundDiv
}

//
// Functions evaluated within the page context
//
function withinPage_GetDivDimensions(div){
    var el = document.querySelector(div);
    if(el === null) {
        console.log(div + ' was not found. exiting');
        return false;
    }

    return el.getBoundingClientRect();
};

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

    if(res.url === args.url && res.status !== 200) {
        console.log('Unable to load: ' + args.url);
        phantom.exit();
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
