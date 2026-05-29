FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    unzip git curl \
    libpng-dev libonig-dev libxml2-dev zip

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