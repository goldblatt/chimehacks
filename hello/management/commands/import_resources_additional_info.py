from django.core.management.base import BaseCommand
from hello.models import *

class Command(BaseCommand):
    def handle(self, *args, **options):
        api_key = "AIzaSyDejAzAJyykimzQANJYLRei8JBljZ3zWvw"
        for resource in Resources.objects.all():
            print(resource.name)
            r = requests.get("https://maps.googleapis.com/maps/api/place/details/json?key=" + api_key + "&placeid=" + resource.place_id)
            result = r.json()['result']
            print(result)
            if 'formatted_address'in result:
                resource.address = result['formatted_address']
                print("Saved new address.")
            if 'formatted_phone_number' in result:
                resource.phone_number = result['formatted_phone_number']
                print("Saved new phone number.")
            if 'website' in result:
                resource.url = result['website']
                print("Saved new website.")
            resource.save