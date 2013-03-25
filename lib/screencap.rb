require "screencap/version"
require 'phantomjs.rb'

require 'pathname'

module Screencap
  SCREENCAP_ROOT = Pathname.new(File.dirname(__FILE__))
end

require 'screencap/fetcher'
require 'screencap/phantom'
