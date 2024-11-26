#!/bin/sh

# todo: ディレクトリ名変更
cd /usr/src/app/web

python manage.py makemigrations --noinput
python manage.py migrate --noinput
# todo: 入れる(staticディレクトリを作る)
# python manage.py collectstatic --noinput

# 環境変数のDEBUGの値がTrueの時はrunserverを、Falseの時はgunicornを実行
if [ $DEBUG = "True" ]
then
    python manage.py runserver 0.0.0.0:8000
else
    gunicorn core.wsgi:application --bind 0.0.0.0:8000
fi
