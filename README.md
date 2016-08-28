basic django project outline on heroku came from the python-getting-started provided by herkokue

# TODO: 
`pip install -r requirements.txt`

ADD DB migrations to hello/models.py
To run generate db migration files: `python manage.py makemigrations`
To deploy to herokue `git push origin master`, `git push heroku master`, `heroku run python manage.py migrate`

To delete all rows in DB:
`python manage.py flush`

To undo all migrations:
`python manage.py migrate hello zero`

To run all migrations:
`python manage.py migrate`
