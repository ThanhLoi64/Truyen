FROM node:latest AS base

FROM base AS deps
WORKDIR /app

COPY . .

EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

RUN yarn install 
RUN npm install -g expo-cli
RUN npm install @expo/ngrok@^4.1.0 -g
CMD [ "npx", "expo", "start", "--port", "8880"]