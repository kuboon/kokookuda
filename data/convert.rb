gem "mtif"
require "mtif"
require "yaml"

mtif = MTIF.load_file("typepad-log.txt")
open("blog.yml", "w") do |f|
  f.write mtif.posts.map(&:data).select{|p| p[:status] == "Publish"}.to_yaml
end

