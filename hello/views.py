from django.shortcuts import render

from django.http import JsonResponse
from django.core import serializers

from .models import *

SF_DEFAULT_LAT = 37.773972
SF_DEFAULT_LNG = -122.431297

# Create your views here.
def index(request):
    # return HttpResponse('Hello from Python!')
    return render(request, 'index.html')

def stories(request): 
    lng = float(request.GET.get("lng", SF_DEFAULT_LNG))
    lat = float(request.GET.get("lat", SF_DEFAULT_LAT))

    stories = Stories.objects.filter(lat__lte=lat + 2).filter(lat__gte=lat - 2).filter(lng__lte=lng + 2).filter(lng__gte=lng - 2)
    serialized_stories = serializers.serialize("json", stories)

    return JsonResponse(serialized_stories, safe=False)

def resources(request): 
    lng = float(request.GET.get("lng", SF_DEFAULT_LNG))
    lat = float(request.GET.get("lat", SF_DEFAULT_LAT))

    resources = Resources.objects.filter(lat__lte=lat + 2).filter(lat__gte=lat - 2).filter(lng__lte=lng + 2).filter(lng__gte=lng - 2)
    serialized_resources = serializers.serialize("json", resources)

    return JsonResponse(serialized_resources, safe=False)


def add_story(request): 
    lng = float(request.POST.get("lng", SF_DEFAULT_LNG))
    lat = float(request.POST.get("lat", SF_DEFAULT_LAT))
    gender = request.POST.get("gender")
    assailant = request.POST.get("assailant")
    type_of_abuse = request.POST.get("type")
    location = request.POST.get("location")
    reported = request.POST.get("report")
    story = request.POST.get("story")
    permission = bool(request.POST.get("permission"))

    story = Stories.objects.create(
        lng=lng,
        lat=lat,
        gender=gender, 
        assailant=assailant, 
        type_of_abuse=type_of_abuse, 
        location=location, 
        report=reported, 
        story=story,
        permission=permission   
    )

    return JsonResponse(serializers.serialize("json", [story]), safe=False)

