from django.db import models
import requests, json

# Create your models here.
class Stories(models.Model): 
    GENDER_CONSTANTS = [
        ("cis-woman","cis-woman") , 
        ("cis-man","cis-man"), 
        ("non-binary", "non-binary"),
        ("trans-woman", "trans-woman"),
        ("trans-man", "trans-man"), 
        ("other","other"), 
        ("do not wish to disclose", "do not wish to disclose")
    ]
    ASSAILANT_CONSTANTS = [
        ("romantic partner", "romantic partner"), 
        ("friend", "friend"),
        ("teacher", "teacher"),  
        ("boss", "boss"),  
        ("family member", "family member"),  
        ("stranger", "stranger"), 
        ("police officer", "police officer"), 
        ("do not wish to disclose", "do not wish to disclose") 
    ]
    TYPE_OF_ABUSE_CONSTANTS = [
        ("rape", "rape"), 
        ("controlling behaviour", "controlling behaviour"),  
        ("partner assault", "partner assault"), 
        ("stalking", "stalking"),  
        ("indecent exposure", "indecent exposure"), 
        ("pornography", "pornography"), 
        ("cyber bullying", "cyber bullying"),  
        ("genital mutilation", "genital mutilation"), 
        ("threats of physical violence", "threats of physical violence"), 
        ("incest", "incest")
    ]
    LOCATION_CONSTANTS = [
        ("in a public space", "in a public space"), 
        ("on a college campus", "on a college campus"),  
        ("at or near home", "at or near your home"), 
        ("at or near a relative's home", "at or near a relative's home") 
    ]

    REPORTED_CONSTANTS = [
        ("yes", "yes"), 
        ("no", "no"), 
        ("do not wish to disclose", "do not wish to disclose")
    ]

    timestamp = models.DateTimeField(auto_now_add=True)  # Client timestamp
    lng = models.DecimalField(max_digits=20, decimal_places=10)
    lat = models.DecimalField(max_digits=20, decimal_places=10)

    # filters
    gender = models.CharField(max_length=200, choices=GENDER_CONSTANTS, default="do not wish to disclose")
    assailant = models.CharField(max_length=200, choices=ASSAILANT_CONSTANTS, default="do not wish to disclose")
    type_of_abuse = models.CharField(max_length=200, choices=TYPE_OF_ABUSE_CONSTANTS, default="do not wish to disclose")
    location = models.CharField(max_length=200, choices=LOCATION_CONSTANTS, default="do not wish to disclose")
    report = models.CharField(max_length=200, choices=REPORTED_CONSTANTS, default="do not wish to disclose")
    story = models.TextField(null=True, blank=True)
    permission = models.BooleanField(default=False)
    post_id = models.CharField(max_length=500, blank=True, null=True)

    fb_origin = "https://graph.facebook.com/v2.7/"
    page_id = "793855907422734"
    access_token = "EAAUjIZCUJZAV8BAKo7HkirTj0u2OZC3fvOq4tZCILh9h1YdLYY3wrNPXT9ZCy8k1dCvtVQmjQRcZBXZCTO7O23wUYN557rSy1MP6HFz6353DRPnMnDiJR8d3nBqjx09XJD6pJ5SbKzXf7ZBYS4LZBrpl3R3EpqSM44cLKWe45a7vZBNQZDZD"

#Stories.objects.create(html_text="hello world", timestamp=datetime.now(), lng=0, lat=0)

    def get_page_token(self):
        r = requests.get(self.fb_origin + 'me/accounts?access_token=' + self.access_token)
        resp = json.loads(r.text)
        return resp["data"][0]["access_token"]

    def check_not_null(self, val): 
        return val != "do not wish to disclose"

    def can_make_fb_post(self): 
        return self.check_not_null(self.type_of_abuse) or self.check_not_null(self.assailant)

    def make_fb_message(self): 
        gender = "a" + self.gender if self.check_not_null(self.gender) else "an anonymous person"
        abuse = self.type_of_abuse if self.check_not_null(self.type_of_abuse) else "an act of sexual violence"
        assailant = self.assailant if self.check_not_null(self.assailant) else "a fellow human"
        location = " " + self.location if self.check_not_null(self.location) else ""
        return "Today, {0} experienced {1} committed by {2}{3}. End sexual violence.".format(gender, abuse, assailant, location)

    def post_to_fb(self):
        if self.can_make_fb_post(): 
            page_token = self.get_page_token()
            r = requests.post(self.fb_origin + self.page_id + '/feed?message=' + self.make_fb_message() + '&access_token=' + page_token)
            resp = json.loads(r.text)
            post_id = resp["id"]
            self.post_id = post_id
            self.save()

class Resources(models.Model):
    lat = models.DecimalField(max_digits=20, decimal_places=10)
    lng = models.DecimalField(max_digits=20, decimal_places=10)
    place_id = models.TextField(null=True, blank=True)
    name = models.TextField()
    address = models.TextField(null=True, blank=True)
    city = models.TextField(null=True, blank=True)
    state = models.TextField(null=True, blank=True)
    country = models.TextField(null=True, blank=True)
    zip_code = models.TextField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    phone_number = models.TextField(null=True, blank=True)
    url = models.TextField(null=True, blank=True)
