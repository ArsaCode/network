web: python3 manage.py collectstatic --noinput
web: python3 manage.py runserver 0.0.0.0:$PORT --noreload
web: gunicorn project4.wsgi