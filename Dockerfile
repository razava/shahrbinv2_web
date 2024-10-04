FROM node:18.20.3 AS builder

# نصب yarn به جای pnpm
RUN npm install -g yarn

WORKDIR /app

# تنظیم متغیرهای محیطی برای React
ENV NODE_ENV production
# ENV REACT_APP_BASENAME=/
# ENV REACT_APP_API_URL=https://shahrbinapi.shetabdahi.ir
# ENV PUBLIC_URL=https://shahrbin2.yazd.ir/137
# ENV REACT_APP_SIGNALR_URL=https://shahrbinapi.shetabdahi.ir
ENV PUBLIC_URL=/admin

# پاک کردن کش npm و yarn قبل از نصب
RUN npm cache clean --force && yarn cache clean

# کپی کردن فایل‌های package.json و نصب وابستگی‌ها با yarn
COPY ./package*.json ./
RUN yarn install

# کپی کردن باقی فایل‌ها و ساخت پروژه
COPY . .
RUN yarn build

# استفاده از nginx برای سرو کردن برنامه
FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]
