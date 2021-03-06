from django.conf.urls import include, url

from django.contrib import admin
admin.autodiscover()

import hello.views

# Examples:
# url(r'^$', 'gettingstarted.views.home', name='home'),
# url(r'^blog/', include('blog.urls')),

urlpatterns = [
    url(r'^$', hello.views.index, name='index'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/stories', hello.views.stories, name="stories"),
    url(r'^api/add/story', hello.views.add_story, name="add_story"),
    url(r'^api/resources', hello.views.resources, name="resources"),
    url(r'^api/create_resource', hello.views.create_resource, name="create_resource"),
]
