from django.core.management.base import BaseCommand
from hello.models import *

class Command(BaseCommand):
    def handle(self, *args, **options):
        api_key = "AIzaSyDejAzAJyykimzQANJYLRei8JBljZ3zWvw"
        cities = {
                'NYC': {'lat': '40.555', 'lng': '-74.159'},
                'SF': {'lat': '37.778305', 'lng': '-122.416145'},
                'Sao Paolo': {'lat': '-23.577734', 'lng': '-46.625549'}
            }
        for city, coordinates in cities.iteritems():
            lat = coordinates['lat']
            lng = coordinates['lng']
            r = requests.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=" + api_key + "&location=" + lat + "," + lng + "&radius=50000&name=sexual%20assault")
            
            results = r.json()['results']
            if len(results) == 0:
                r = requests.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=" + api_key + "&location=" + lat + "," + lng + "&radius=50000&name=women%20hospital")
                results = r.json()['results']
            for result in results:
                place_id = result['place_id']
                if not Resources.objects.filter(place_id=place_id):
                    Resources.objects.create(
                        latitude=result['geometry']['location']['lat'], 
                        longitude=result['geometry']['location']['lng'],
                        name=result['name'],
                        place_id=place_id).save()