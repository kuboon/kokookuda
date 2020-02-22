gem "mtif"
require "mtif"
require "yaml"
require 'nokogiri'
require 'open-uri'

def clean_body(body)
  doc = Nokogiri::HTML.parse body
  doc.at_css("p:first-child:empty")&.remove
  # body.gsub!("FONT-FAMILY: &quot;ＭＳ Ｐゴシック&quot;", "")
  # body.gsub!("FONT-FAMILY: ''ＭＳ 明朝'';", "")
  # body.gsub!("FONT-FAMILY: &quot;ＭＳ Ｐゴシック&quot;", "")
  # body.gsub!("mso-bidi-font-size: 10.5pt", "")
  # body.gsub!('style="MARGIN: 0mm 0mm 0pt"', "")
  # body.gsub!("", "")
  # body.gsub!("", "")
  # body.gsub!("", "")
  doc.css('img').find_all.each do |img|
    src = img[:src]
    file_name = src.split("/").last
    file_name.gsub!("-800wi", "")
    file_name += ".jpg" if !file_name.end_with?(".jpg") && file_name.end_with?(".gif") 

    local_path = "../source/img/#{file_name}"
    unless File.exists?(local_path)
      p local_path
      open(src) {|img| File.open(local_path, 'w') {|f| f.write img.read}}
    end
    img[:src] = "/img/#{file_name}"
    img[:srcset] = [600, 1200].map{|w|"/img/#{file_name}?nf_resize=fit&w=#{w} #{w}w"}.join(?,)
    if img.parent.name == "a"
      img.parent.replace img
    end
  end
  doc.to_html
end

mtif = MTIF.load_file("typepad-log.txt")
json = mtif.posts.map(&:data).select{|p| p[:status] == "Publish"}
json.map! do |post|
  post[:body] = clean_body(post[:body])
end
open("blog.yml", "w") do |f|
  f.write json.to_yaml
end

