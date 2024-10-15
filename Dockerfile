FROM node:12.14.1-alpine

WORKDIR /app

COPY package*.json ./
COPY .npmrc .npmrc

RUN npm install

RUN rm -f .npmrc

EXPOSE 8080

CMD ["npm", "run", "dev"]

#FROM node:12.14.1 as build-stage

#WORKDIR /app

#COPY package*.json ./
#COPY .npmrc .npmrc

#RUN npm install

#RUN rm -f .npmrc

#COPY . .

#RUN npm run build

#EXPOSE 8080
#CMD ["nginx", "-g", "daemon off;"]

#FROM nginx:stable-alpine
#COPY dist /usr/share/nginx/html
#EXPOSE 8080
#CMD ["nginx","-g","daemonoff;"]
