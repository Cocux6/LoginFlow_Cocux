FROM node:18

WORKDIR /login

COPY . ./

# Installa dipendenze
RUN npm install

CMD ["npm", "start"]
