FROM node:current-alpine
WORKDIR /app
COPY . .
RUN npm i
EXPOSE 8080
CMD ["npm", "run", "serve"]