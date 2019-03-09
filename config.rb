require 'lib/automatic_srcset'
require 'lib/custom_helpers'

# Activate and configure extensions
# https://middlemanapp.com/advanced/configuration/#configuring-extensions

# https://middlemanapp.com/basics/layouts/

# Per-page layout changes
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

# With alternative layout
# page '/path/to/file.html', layout: 'other_layout'

# Proxy pages
# https://middlemanapp.com/advanced/dynamic-pages/

# proxy(
#   '/this-page-has-no-template.html',
#   '/template-file.html',
#   locals: {
#     which_fake_page: 'Rendering a fake page with a local variable'
#   },
# )
(2006..2017).each do |year|
  proxy "/blog/#{year}.html", "/blog.html", :locals => { year: year }, :ignore => true, layout: :layout
end

# Helpers
# Methods defined in the helpers block are available in templates
# https://middlemanapp.com/basics/helper-methods/

require 'open-uri'
helpers do
  def preload_images(body)
    url_patterns =[
      '(http://chisou\.typepad\.jp/\.a/([0-9a-f]+)-[0-9a-z]+)',
      '(http://chisou\.typepad\.jp/blog/images/(\w+)\.jpg)',
      '(http://chisou\.typepad\.jp/photos/\w+/20../../../(\w+)\.jpg)'
    ]
    url_patterns.each do |regex|
      body = body.gsub(%r|<a .+#{regex}.+?</a>|) do
        url, hash = $1, $2
        file_name = "#{hash}.jpg"
        local_path = "source/images/#{file_name}"
        unless File.exists?(local_path)
          open(url) {|img| File.open(local_path, 'w') {|f| f.write img.read}}
        end
        image_tag file_name
      end
    end
    body
  end
end

helpers CustomHelpers

# Build-specific configuration
# https://middlemanapp.com/advanced/configuration/#environment-specific-settings

configure :build do
  activate :minify_css
  activate :minify_javascript
#  activate :automatic_srcset
end

set :sass_assets_paths, [
  File.join(root, 'node_modules'),
]

ignore "/images/**"

