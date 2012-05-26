require 'spec_helper'

describe Screencap::Fetcher do
  it 'takes a url' do
    Screencap::Fetcher.new('http://google.com').should_not be_nil
  end

  it 'supports a custom filename' do
    f = Screencap::Fetcher.new('http://yahoo.com')
    f.fetch(:output => Screencap::TMP_DIRECTORY + 'kats.png')
    File.exists?(f.filename).should == true
  end
end