FROM node
WORKDIR /app

# Install depenencies
COPY package.json .
COPY yarn.lock .
RUN yarn install

# Install Redis tools
RUN apt update
RUN apt install -y redis-tools

# Copy Gears and application
COPY gears ./gears
COPY src ./src
COPY ./docker-cmd.sh .

# Run
CMD [ "./docker-cmd.sh" ]