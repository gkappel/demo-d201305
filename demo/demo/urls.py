from django.conf.urls import patterns, url

from .views import *

urlpatterns = patterns('',
    url(r'^$', Index.as_view(), name='index'),
    url(r'^api/item/$', ItemList.as_view(), name='item-list'),
    url(r'^api/item/(?P<pk>\d+)/$', ItemDetail.as_view(), name='item-detail'),
)
