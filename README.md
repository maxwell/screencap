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
  	:userAgent => 'Screencap browser',
  	:div => '.header', # selector for a specific element to take screenshot of
  	:width => 1024,
    :height => 768,
  	:top => 0, :left => 0, :width => 100, :height => 100 # dimensions for a specific area
  )

```

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Added some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
