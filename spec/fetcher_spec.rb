require 'spec_helper'

describe Screencap::Fetcher do
  it 'takes a url' do
    Screencap::Fetcher.new('http://google.com').should_not be_nil
  end

  it 'supports a custom filename' do
    screenshot = Screencap::Fetcher.new('http://yahoo.com').fetch(:output => TMP_DIRECTORY + 'kats.png')
    File.exists?(screenshot).should == true
  end

  it 'supports a custom width' do
  	screenshot = Screencap::Fetcher.new('http://google.com').fetch(:output => TMP_DIRECTORY + 'foo.jpg', :width => 800)
  	FastImage.size(screenshot)[0].should == 800
  end

  it 'captures a given element' do
  	screenshot = Screencap::Fetcher.new('http://google.com').fetch(:output => TMP_DIRECTORY + 'bar.jpg', :div => '#hplogo')
  	FastImage.size(screenshot)[1].should == 110
  end

  it 'should work when given a query string with ampersand in it' do
    screenshot = Screencap::Fetcher.new('http://google.com?1=2&3=4').fetch(:output => TMP_DIRECTORY + 'foo.jpg', :width => 800)
    FastImage.size(screenshot)[0].should == 800
  end
end