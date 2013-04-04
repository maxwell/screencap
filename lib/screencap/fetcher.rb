module Screencap
  class Fetcher
    def initialize(url)
      @url = url
    end

    def fetch(opts = {})
      @filename = opts.fetch(:output, clean_filename)
      raster(@url, @filename, opts)
      fetched_file
    end

    def filename
      @filename
    end

    def fetched_file
      if File.exists?(filename)
        File.open(filename)
      end
    end

    def raster(*args)
      Screencap::Phantom.rasterize(*args)
    end

    def clean_filename
      "#{@url.delete('/.:?!')}.png"
    end
  end
end