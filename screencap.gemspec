# -*- encoding: utf-8 -*-
require File.expand_path('../lib/screencap/version', __FILE__)

Gem::Specification.new do |gem|
  gem.authors       = ["Maxwell Salzberg","David Spurr"]
  gem.email         = ["maxwell@joindiaspora.com"]
  gem.description   = %q{a gem to grab screenshots of webpages, or just parts of webpages}
  gem.summary       = %q{uses Phantom.js to grab pages, or parts of pages. Simple API.}
  gem.homepage      = "http://github.com/maxwell/screencap"

  gem.files         = `git ls-files`.split($\)
  gem.executables   = gem.files.grep(%r{^bin/}).map{ |f| File.basename(f) }
  gem.test_files    = gem.files.grep(%r{^(test|spec|features)/})
  gem.name          = "screencap"
  gem.require_paths = ["lib"]
  gem.version       = Screencap::VERSION

  gem.add_development_dependency 'rspec', '~> 2.10'
  gem.add_development_dependency 'rake'
  gem.add_development_dependency 'phantomjs.rb'
  gem.add_development_dependency 'fastimage'
  gem.add_runtime_dependency 'phantomjs', '~> 1.9.8'
end
