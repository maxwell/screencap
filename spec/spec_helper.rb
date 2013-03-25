$:.unshift File.dirname(__FILE__) + '/../lib'
require 'screencap'
require 'fastimage'

TMP_DIRECTORY = Screencap::SCREENCAP_ROOT.join('..', 'tmp')

RSpec.configure do |config|
  config.treat_symbols_as_metadata_keys_with_true_values = true
  config.run_all_when_everything_filtered = true
  config.filter_run :focus

  config.before(:all) do
    # system("rm #{TMP_DIRECTORY}/*.png") leave them for now
  end
end