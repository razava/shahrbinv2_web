FROM node:18.20.3 AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm -g i pnpm
WORKDIR /app

ENV NODE_ENV production
# ENV REACT_APP_BASENAME=/
# ENV REACT_APP_API_URL=https://shahrbinapi.shetabdahi.ir
# ENV PUBLIC_URL=https://shahrbin2.yazd.ir/137
# ENV REACT_APP_SIGNALR_URL=https://shahrbinapi.shetabdahi.ir
ENV PUBLIC_URL=/admin
WORKDIR /app

COPY ./package*.json ./

RUN pnpm i
COPY . .
RUN npm run build

FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
CMD [ "nginx", "-g", "daemon off;" ]