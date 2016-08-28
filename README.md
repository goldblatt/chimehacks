basic django project outline on heroku came from the python-getting-started provided by herkokue

# TODO: 
`pip install -r requirements.txt`

ADD DB migrations to hello/models.py
To run generate db migration files: `python manage.py makemigrations`
To deploy to herokue `git push origin master`, `git push heroku master`, `heroku run python manage.py migrate`


To reset the DB to a clean state:

1. Delete all rows in DB:

`python manage.py flush`

2. Undo all migrations:

`python manage.py migrate hello zero`

3. Redo all migrations

`python manage.py migrate`

4. Run command to fill DB with real resources

`python manage.py import_resources`
