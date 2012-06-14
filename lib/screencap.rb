require "screencap/version"
# require 'phantomjs.rb'

require 'pathname'

module Screencap
  SCREENCAP_ROOT = Pathname.new(File.dirname(__FILE__))
  # TMP_DIRECTORY = SCREENCAP_ROOT.join('..', 'tmp')
  def self.binary=(location)
    @@binary = location
  end

  def self.binary
    @@binary
  end
end

#config

#tmp directory to store files

#should return a file handle to tmp director where it is stored

require 'screencap/fetcher'
require 'screencap/phantom'
