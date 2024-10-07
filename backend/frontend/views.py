from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.conf.urls import handler404
def index(request):
    return render(request, 'index.html')
def auth(request):
    return render(request, 'auth.html')
def about(request):
    return render(request, 'about.html')
def contact(request):
    return render(request, 'contact.html')
def menu(request):
    return render(request, 'menu.html')
def menuId(request, id):  
    context = {
        'menu_id': id
    }
    return render(request, 'menuId.html', context)
def reservation(request):
    return render(request, 'reservation.html')
def login(render):
    return render(request, 'auth.html')

@login_required
def dashboard(request):
    return render(request, 'dashboard.html')

def view_404(request, exception):
    return render(request, '404.html', status=404)

