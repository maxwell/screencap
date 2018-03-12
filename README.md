# Screencap

A screenshot gem you can use from your ruby application. Uses Phantom.js under the hood.

## Installation

Add this line to your application's Gemfile:

    gem 'screencap'

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install screencap

## Usage

```ruby
  require 'screencap'

  f = Screencap::Fetcher.new('http://google.com')
  screenshot = f.fetch
```

it also currently supports a couple of options

```ruby
  f = Screencap::Fetcher.new('http://google.com')
  screenshot = f.fetch(
  	:output => '~/my_directory.png', # don't forget the extension!
  	# optional:
  	:div => '.header', # selector for a specific element to take screenshot of
  	:width => 1024,
    :height => 768,
  	:top => 0, :left => 0, :width => 100, :height => 100 # dimensions for a specific area
  )

```

### Arguments

* `url`                     - URL to screenshot
* `output`                  - page to output (e.g. /tmp/output.png)
* `width`        [optional] - default 1024 - viewport width
* `height`       [optional] - viewport height (see note below on using height)
* `debug`        [optional] - default false - whether to do some extra debugging
* `div`          [optional] - a selector to use to screenshot to a specific element
* `resourceWait` [optional] - default 300 - the time to wait after the last resource has loaded in MS before taking the screenshot
* `maxRenderWait`[optional] - default 10000 - the maximum time to wait before taking the screenshot, regardless of whether resources are waiting to be loaded
* `cutoffWait`   [optional] - default null - the maximum time to wait before cutting everything off and failing...this helps if there is a page taking a long time to load
* `top`, `left`, `width`, `height` [optional] - dimensions to use to screenshot a specific area of the screen

### Important notice when providing height

If you provide a height then we resize the html & body tags. Otherwise, `render()` renders the entire page.
Changing the viewport height does not affect this behaviour of `render()`, see https://github.com/ariya/phantomjs/issues/10619

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Added some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
