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
  f.fetch(:output => "some path that isnt the default tmp directory", :div => 'the div you want to snap, like .header') #these options are OPTIONAL
```

## To-do

more tests
better configuration
expose more options
## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Added some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
