module Screencap
  class Phantom
    RASTERIZE = SCREENCAP_ROOT.join('screencap', 'raster.js')

    def self.rasterize(url, path, *args)
      # puts RASTERIZE.to_s, url, path, *args  # Your code goes here...
      system("#{Screencap.binary} #{RASTERIZE.to_s} #{url} #{path} #{args.join(' ')}")
      # Phantomjs.run(RASTERIZE.to_s, url, path, *args) 
    end


    def quoted_args(args)
      args.map{|x| quoted_arg(x)}
    end

    def quoted_arg(arg)
      return arg if arg.starts_with?("'") && arg.ends_with?("'")
      arg = "'" + arg unless arg.starts_with?("'")
      arg = arg + "'" unless arg.ends_with?("'")
      arg
    end
  end
end