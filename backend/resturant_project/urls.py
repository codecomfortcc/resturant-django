from django.contrib import admin
from django.urls import path,re_path,include
from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required
from frontend.views import index,about,contact,menu,reservation,menuId,auth,dashboard
from django.conf.urls import handler404
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('reservation.urls')),
    path('api/', include('menu.urls')),
    path('api/', include('authentication.urls')),
    path('', index, name='index'),
    path('about/', about, name='about'),
    path('contact/', contact, name='contact'),
    path('menu/', menu, name='menu'),
    path('menu/<int:id>/', menuId, name='menuId'),
    path('reservation/', reservation, name='reservation'),
    path('auth/', auth, name='auth'),
    path('dashboard/', login_required(dashboard), name='dashboard'),
]

handler404 = 'frontend.views.view_404'
