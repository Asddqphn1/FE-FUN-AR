# ==========================================
# Stage 1: Build the React application
# ==========================================
FROM node:20-alpine AS builder

# Menentukan direktori kerja di dalam container
WORKDIR /app

# Menyalin package.json dan package-lock.json
COPY package*.json ./

# Menginstal semua dependencies
RUN npm install

# Menyalin seluruh source code ke dalam container
COPY . .

# Melakukan proses build (Vite + TypeScript)
RUN npm run build

# ==========================================
# Stage 2: Serve the application with Nginx
# ==========================================
FROM nginx:alpine

# Menyalin konfigurasi Nginx kustom untuk React Router (SPA fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Menyalin hasil build dari stage 1 ke direktori Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Mengekspos port 80
EXPOSE 80

# Menjalankan Nginx di foreground
CMD ["nginx", "-g", "daemon off;"]
