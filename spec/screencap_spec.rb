require 'spec_helper'

describe Screencap do
  it 'works' do
    Screencap::Fetcher.new('http://google.com').fetch
  end
end