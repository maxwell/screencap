require 'spec_helper'

describe Screencap do
  it 'works' do
    screenshot = Screencap::Fetcher.new('http://google.com').fetch(output: TMP_DIRECTORY + 'google.png')
    expect(FastImage.size(screenshot)[0]).to eq(1024)
  end

  it 'throws error when phantom could not load page' do
    expect {
      Screencap::Fetcher.new('http://www.google.com/404').fetch(output: TMP_DIRECTORY + 'foo.png')
    }.to raise_error Screencap::Error, "Could not load URL http://www.google.com/404"
  end
end
