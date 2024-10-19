FROM node:18.20.3 AS builder

# نصب pnpm به جای yarn
RUN npm install -g pnpm

WORKDIR /app

# تنظیم متغیرهای محیطی برای React
ENV NODE_ENV production
# ENV REACT_APP_BASENAME=/
# ENV REACT_APP_API_URL=https://shahrbinapi.shetabdahi.ir
# ENV PUBLIC_URL=https://shahrbin2.yazd.ir/137
# ENV REACT_APP_SIGNALR_URL=https://shahrbinapi.shetabdahi.ir
ENV PUBLIC_URL=/admin

# پاک کردن کش npm و pnpm قبل از نصب
RUN npm cache clean --force && pnpm store prune

# کپی کردن فایل‌های package.json و نصب وابستگی‌ها با pnpm
COPY ./package*.json ./
RUN pnpm install

# کپی کردن باقی فایل‌ها و ساخت پروژه
COPY . .
RUN pnpm build

# استفاده از nginx برای سرو کردن برنامه
FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]
