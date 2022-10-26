FROM php:8.0-apache

WORKDIR /app

COPY . /var/www/html/

COPY ./run-apache2.sh /usr/local/bin/
CMD [ "run-apache2.sh" ]

# EXPOSE 80

# RUN chown -R www-data:www-data /var/www