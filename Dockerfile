FROM node
WORKDIR /app
COPY package.json .
RUN npm install --quiet

RUN apt update
RUN apt install -y redis-tools

COPY . .

CMD [ "./register-run-cli.sh" ]