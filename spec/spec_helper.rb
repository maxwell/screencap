$:.unshift File.dirname(__FILE__) + '/../lib'
require 'screencap'

RSpec.configure do |config|
  config.treat_symbols_as_metadata_keys_with_true_values = true
  config.run_all_when_everything_filtered = true
  config.filter_run :focus

  config.before(:all) do
    system("rm #{Screencap::TMP_DIRECTORY}/*.png")
  end
end