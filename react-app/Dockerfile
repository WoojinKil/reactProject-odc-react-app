# 1단계: 빌드
FROM node:18 as build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# 2단계: Nginx에 정적 파일 복사 + 프록시 설정
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf