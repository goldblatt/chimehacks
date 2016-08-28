from django.db import models
import requests, json

# Create your models here.
class Stories(models.Model): 
    html_text = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)  # Client timestamp
    longitude = models.DecimalField(max_digits=20, decimal_places=10)
    latitude = models.DecimalField(max_digits=20, decimal_places=10)

    fb_origin = "https://graph.facebook.com/v2.7/"
    page_id = "793855907422734"
    access_token = "EAAUjIZCUJZAV8BAKo7HkirTj0u2OZC3fvOq4tZCILh9h1YdLYY3wrNPXT9ZCy8k1dCvtVQmjQRcZBXZCTO7O23wUYN557rSy1MP6HFz6353DRPnMnDiJR8d3nBqjx09XJD6pJ5SbKzXf7ZBYS4LZBrpl3R3EpqSM44cLKWe45a7vZBNQZDZD"

#Stories.objects.create(html_text="hello world", timestamp=datetime.now(), longitude=0, latitude=0)

    def get_page_token(self):
    	r = requests.get(self.fb_origin + 'me/accounts?access_token=' + self.access_token)
    	#print r.text
    	import pdb; pdb.set_trace()
    	resp = json.loads(r.text)
    	return resp["data"][0]["access_token"]

    def post_to_fb(self):
    	page_token = self.get_page_token()
    	r = requests.post(self.fb_origin + self.page_id + '/feed?message=' + self.html_text + '&access_token=' + page_token)
    	print ("response from posting to FB page: " + r.text)

class Resources(models.Model):
	latitude = models.DecimalField(max_digits=20, decimal_places=10)
	longitude = models.DecimalField(max_digits=20, decimal_places=10)
	place_id = models.TextField()
	name = models.TextField()
	address = models.TextField(null=True, blank=True)
	city = models.TextField(null=True, blank=True)
	state = models.TextField(null=True, blank=True)
	country = models.TextField(null=True, blank=True)
	zip_code = models.TextField(null=True, blank=True)
	description = models.TextField(null=True, blank=True)
	phone_number = models.TextField(null=True, blank=True)
	url = models.TextField(null=True, blank=True)
