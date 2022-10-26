FROM php:8.0-apache

WORKDIR /app

COPY . /var/www/html/

COPY ./run-apache2.sh /usr/local/bin/

EXPOSE 80

RUN chown -R www-data:www-data /var/www

CMD [ "run-apache2.sh" ]