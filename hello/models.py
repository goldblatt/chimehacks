from django.db import models

# Create your models here.
class Stories(models.Model): 
    html_text = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField()  # Client timestamp
    longitude = models.DecimalField(max_digits=20, decimal_places=10)
    latitude = models.DecimalField(max_digits=20, decimal_places=10)

class Resources(models.Model):
	latitude = models.DecimalField(max_digits=20, decimal_places=10)
	longitude = models.DecimalField(max_digits=20, decimal_places=10)
	name = models.TextField()
	address = models.TextField()
	city = models.TextField()
	state = models.TextField()
	country = models.TextField()
	zip_code = models.TextField()
	description = models.TextField(null=True, blank=True)
	phone_number = models.TextField()
	url = models.TextField()
