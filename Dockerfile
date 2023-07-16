FROM node:lts-alpine
WORKDIR /build
COPY package.json /build/package.json
RUN yarn
COPY ./ /build
RUN npm run build

FROM nginx
RUN mkdir /app
COPY --from=0 /build/dist /app
COPY --from=0 /build/nginx.conf /etc/nginx/nginx.conf
EXPOSE 9000