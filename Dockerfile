FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    unzip git curl ca-certificates \
    libpng-dev libonig-dev libxml2-dev zip libpq-dev libsqlite3-dev \
    && docker-php-ext-install pdo_mysql pdo_pgsql pdo_sqlite

RUN curl -fsSL https://letsencrypt.org/certs/isrgrootx1.pem -o /etc/ssl/certs/isrgrootx1.pem

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /app
COPY . .
RUN composer install
RUN npm install
RUN npm run build
EXPOSE 10000

CMD php artisan serve --host=0.0.0.0 --port=10000