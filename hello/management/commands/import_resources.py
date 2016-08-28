from django.core.management.base import BaseCommand
from hello.models import *

class Command(BaseCommand):
    def handle(self, *args, **options):
        api_key = "AIzaSyDejAzAJyykimzQANJYLRei8JBljZ3zWvw"
        cities = {
                'NYC': {'lat': '40.555', 'lng': '-74.159'},
                'SF': {'lat': '37.778305', 'lng': '-122.416145'},
                'Sao Paolo': {'lat': '-23.577734', 'lng': '-46.625549'},
                'Nairobi': {'lat': '-1.292021', 'lng': '36.806476'},
                'Beijing': {'lat': '39.913992', 'lng': '116.389003'},
                'New Delhi': {'lat': '28.597453', 'lng': '77.221997'},
                'London': {'lat': '51.431817', 'lng': '-0.070920'}
            }
        for city, coordinates in cities.iteritems():
            print("-----------------------------")
            print("Importing resources for " + city)
            print("-----------------------------")
            lat = coordinates['lat']
            lng = coordinates['lng']
            r = requests.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=" + api_key + "&location=" + lat + "," + lng + "&radius=50000&name=sexual%20assault")
            
            results = r.json()['results']
            if len(results) == 0:
                print("Found no results for sexual abuse centers. Now looking for women's hospitals.")
                r = requests.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=" + api_key + "&location=" + lat + "," + lng + "&radius=50000&name=women%20hospital")
                results = r.json()['results']
            for result in results:
                place_id = result['place_id']
                print("Importing " + result['name'])
                if not Resources.objects.filter(place_id=place_id):
                    Resources.objects.create(
                        lat=result['geometry']['location']['lat'], 
                        lng=result['geometry']['location']['lng'],
                        name=result['name'],
                        place_id=place_id).save()