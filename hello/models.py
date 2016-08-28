from django.db import models

# Create your models here.
class Greeting(models.Model):
    when = models.DateTimeField('date created', auto_now_add=True)


class Stories(models.Model): 
    html_text = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)  # Client timestamp
    longitude = models.DecimalField(max_digits=15, decimal_places=15)
    latitude = models.DecimalField(max_digits=15, decimal_places=15)

class Resources(models.Model):
	latitude = models.DecimalField(max_digits=15, decimal_places=15)
	longitude = models.DecimalField(max_digits=15, decimal_places=15)
	name = models.TextField()
	address = models.TextField()
	city = models.TextField()
	state = models.TextField()
	country = models.TextField()
	description = models.TextField(null=True, blank=True)
	phone_number = models.TextField()
	url = models.TextField()
