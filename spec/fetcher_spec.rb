require 'spec_helper'

describe Screencap::Fetcher do
  it 'takes a url' do
    Screencap::Fetcher.new('http://google.com').should_not be_nil
  end

  it 'supports a custom filename' do
    screenshot = Screencap::Fetcher.new('http://yahoo.com').fetch(:output => Screencap::TMP_DIRECTORY + 'kats.png')
    File.exists?(screenshot).should == true
  end
end