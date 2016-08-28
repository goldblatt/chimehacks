from django.shortcuts import render

from django.http import JsonResponse, HttpResponse
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

    return HttpResponse("success")

def create_resource(request):
	Resources.objects.create(
		lat = float(request.GET.get("lat")),
		lng = float(request.GET.get("lng")),
		place_id = request.GET.get("place_id"),
		name = request.GET.get("name"),
		address = request.GET.get("address"),
		city = request.GET.get("city"),
		state = request.GET.get("state"),
		country = request.GET.get("country"),
		zip_code = request.GET.get("zip_code"),
		description = request.GET.get("description"),
		phone_number = request.GET.get("phone_number"),
		url = request.GET.get("url")
	).save()

	return HttpResponse('success')

