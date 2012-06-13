module Screencap
  class Fetcher
    def initialize(url)
      @url = url
    end

    def fetch(opts = {})
      @filename = opts.fetch(:output, clean_filename)
      raster(@url, @filename, opts[:div])
      fetched_file
    end

    def filename
      @filename
    end

    def fetched_file
      File.open(filename)
    end

    def raster(*args)
      Screencap::Phantom.rasterize(*args)
    end

    def clean_filename
      "#{@url.delete('/.:?!')}.png"
    end
  end
end