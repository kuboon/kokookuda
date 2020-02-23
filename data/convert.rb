gem "mtif"
require "mtif"
require "yaml"
require 'nokogiri'
require 'open-uri'

def clean_body(body)
  doc = Nokogiri::HTML::DocumentFragment.parse body
  doc.xpath('@style|.//@style').remove
  doc.xpath('@class|.//@class').remove
  doc.traverse do |node|
    next unless %w[div span p].include? node.name
    node.remove if node.text.strip.empty?
  end
  doc.css('img').find_all.each do |img|
    src = img[:src]
    file_name = src.split("/").last
    file_name.gsub!("-800wi", "")
    is_gif = file_name.end_with?(".gif")
    file_name += ".jpg" if !file_name.end_with?(".jpg") && !is_gif

    local_path = "img/#{file_name}"
    have = true
    unless File.exists?(local_path)
      p src, local_path
      begin
        open(src) {|img| File.open(local_path, 'w') {|f| f.write img.read}}
      rescue => e
        p src,e
        File.rm local_path
        have = false
      end 
    end
    if have
      img[:src] = "/img/#{file_name}"
      img[:srcset] = [600, 1200].map{|w|"/img/#{file_name}?nf_resize=fit&w=#{w} #{w}w"}.join(?,) unless is_gif
    end
    unless is_gif
      img[:width] = nil
      img[:height] = nil
    end
    if img.parent.name == "a"
      img.parent.swap img
    end
    img
  end
  doc.to_html
end

mtif = MTIF.load_file("typepad-log.txt")
json = mtif.posts.map(&:data).select{|p| p[:status] == "Publish"}
json.each do |post|
  post[:body] = clean_body(post[:body])
end
open("blog.yml", "w") do |f|
  f.write json.to_yaml
end

