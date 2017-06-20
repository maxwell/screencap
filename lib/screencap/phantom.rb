require 'cgi'

module Screencap
  class Phantom
    RASTERIZE = SCREENCAP_ROOT.join('screencap', 'raster.js')

    def self.rasterize(url, path, args = {})
      cloned_args = args.clone
      phantom_args = phantomjs_config(cloned_args)
      params = {
        url: CGI::escape(url),
        output: path
      }.merge(cloned_args).collect {|k,v| "#{k}=#{v}"}
      puts phantom_args, RASTERIZE.to_s, params
      result = Phantomjs.run(phantom_args, RASTERIZE.to_s, *params)
      puts result if(cloned_args[:debug])
      raise Screencap::Error, "Could not load URL #{url}" if result.match /Unable to load/
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
    
    private
    def self.phantomjs_config(args)
      opts = args[:phantomjs]
      args.delete(:phantomjs)
      return opts.collect {|k,v| "#{k}=#{v}"}.join(" ") if opts
      ""
    end
  end
end
