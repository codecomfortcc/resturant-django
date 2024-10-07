from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from rest_framework.authtoken.models import Token
import json
def login_view(request):
    if request.method == 'POST':
        print("Request Content-Type:", request.content_type)
        print("Request body:", request.body.decode('utf-8'))
        
        if request.content_type == 'application/json':
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
        else:
            email = request.POST.get('email')
            password = request.POST.get('password')
        
        print(f"Received email: {email}, password: {password}")
        
        if not email or not password:
            return JsonResponse({'error': 'Email and password are required'}, status=400)
        
        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            return JsonResponse({
                'token': token.key,
                'user_id': user.id,
                'email': user.email
            }, status=200)
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@login_required 
def logout_view(request):
    logout(request)
    return redirect('index')
