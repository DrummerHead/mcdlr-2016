###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

# With alternative layout
# page "/path/to/file.html", layout: :otherlayout

# Proxy pages (http://middlemanapp.com/basics/dynamic-pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", locals: {
#  which_fake_page: "Rendering a fake page with a local variable" }

# General configuration
ignore 'stylesheets/*.scss'
ignore 'javascripts/modules/*'

configure :development do
end

###
# Helpers
###

# Methods defined in the helpers block are available in templates
helpers do
  def markdown(text)
    Tilt['markdown'].new { text }.render(scope=self)
  end
end

# Build-specific configuration
configure :build do
  ignore 'javascripts/*.map'
  ignore 'color-test.*'
  ignore '/**/color-test.*'
  # Minify CSS on build
  # activate :minify_css

  # Minify Javascript on build
  # activate :minify_javascript
end

activate :external_pipeline,
  name: :gulp,
  command: build? ? 'gulp build' : 'gulp',
  source: ".tmp",
  latency: 0
