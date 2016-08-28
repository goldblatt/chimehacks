from django.shortcuts import render

from django.http import JsonResponse
from django.core import serializers

from .models import *

# Create your views here.
def index(request):
    # return HttpResponse('Hello from Python!')
    return render(request, 'index.html')

def stories(request): 
	longitude = float(request.GET.get("lng"))
	latitude = float(request.GET.get("lat"))

	stories = Stories.objects.filter(latitude__lte=latitude + 2).filter(latitude__gte=latitude - 2).filter(longitude__lte=longitude + 2).filter(longitude__gte=longitude - 2)
	serialized_stories = serializers.serialize("json", stories)

	return JsonResponse(serialized_stories, safe=False)

def resources(request): 
	longitude = float(request.GET.get("lng"))
	latitude = float(request.GET.get("lat"))

	resources = Resources.objects.filter(latitude__lte=latitude + 2).filter(latitude__gte=latitude - 2).filter(longitude__lte=longitude + 2).filter(longitude__gte=longitude - 2)
	serialized_resources = serializers.serialize("json", resources)

	return JsonResponse(serialized_resources, safe=False)

def create_resource(request):
	Resources.objects.create(
		latitude = float(request.GET.get("latitude")),
		longitude = float(request.GET.get("longitude")),
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

	return JsonResponse('success')

