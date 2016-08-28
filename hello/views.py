from django.shortcuts import render
from django.http import HttpResponse

from .models import Stories

# Create your views here.
def index(request):
    # return HttpResponse('Hello from Python!')
    return render(request, 'index.html')

def stories(request): 
	longitude = request.parameters.get("longitude")
	latitude = request.parameters.get("latitude")

	stories = Stories.objects.all()

	return render(request, 'db.html', {'greetings': stories})


