FROM nginx:alpine

# Copy the Flutter web build to nginx public directory
COPY build/web /usr/share/nginx/html

# Copy nginx config to enable SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
