module Screencap
  class Phantom
    RASTERIZE = SCREENCAP_ROOT.join('screencap', 'raster.js')

    def self.rasterize(url, path, args = {})
      params = {
        url: url,
        output: path
      }.merge(args).collect {|k,v| "#{k}=#{v}"}
      puts RASTERIZE.to_s, params
      Phantomjs.run(RASTERIZE.to_s, *params)
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