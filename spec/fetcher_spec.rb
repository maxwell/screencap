require 'spec_helper'

describe Screencap::Fetcher do
  it 'takes a url' do
    expect(Screencap::Fetcher.new('http://google.com')).not_to be_nil
  end

  it 'supports a custom filename' do
    screenshot = Screencap::Fetcher.new('http://stackoverflow.com').fetch(:output => TMP_DIRECTORY + 'custom_filename.png')
    File.exists?(screenshot).should == true
  end

  it 'supports a custom width' do
    screenshot = Screencap::Fetcher.new('http://google.com').fetch(:output => TMP_DIRECTORY + 'custom_width.jpg', :width => 800)
    expect(FastImage.size(screenshot)[0]).to eq(800)
  end

  it 'supports a custom height' do
    # note using stackoverflow.com as google.com implements x-frame-options header meaning that it won't load in the object element
    screenshot = Screencap::Fetcher.new('http://stackoverflow.com').fetch(:output => TMP_DIRECTORY + 'custom_height.jpg', :height => 600)
    expect(FastImage.size(screenshot)[1]).to eq(600)
  end

  it 'captures a given element' do
    screenshot = Screencap::Fetcher.new('http://placekitten.com').fetch(:output => TMP_DIRECTORY + 'given_element.jpg', :div => '#image-1')
    FastImage.size(screenshot)[0].should == 200
    FastImage.size(screenshot)[1].should == 287
  end

  it 'should work when given a query string with ampersand in it' do
    screenshot = Screencap::Fetcher.new('http://google.com?1=2&3=4').fetch(:output => TMP_DIRECTORY + 'ampersand.jpg', :width => 800)
    expect(FastImage.size(screenshot)[0]).to eq(800)
  end

  it 'should work with tls' do
    screenshot = Screencap::Fetcher.new('https://www.airbnb.com/').fetch(:output => TMP_DIRECTORY + 'tls.jpg', :phantomjs => {:"--ssl-protocol" => :any})
    expect(File.exists?(screenshot)).to eq(true)
  end
end
