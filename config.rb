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

helpers do
end

helpers CustomHelpers

# Build-specific configuration
# https://middlemanapp.com/advanced/configuration/#environment-specific-settings

require 'uglifier'
configure :build do
  activate :minify_css
  activate :minify_javascript, compressor: ->{Uglifier.new(harmony: true)}
#  activate :automatic_srcset
#  activate :asset_hash

#  activate :asset_host, :host => '//YOURDOMAIN.cloudfront.net'
end

set :sass_assets_paths, [
  File.join(root, 'node_modules'),
]
set :images_dir, "img"
ignore "/img/test/**"
#ignore "/images/**"

