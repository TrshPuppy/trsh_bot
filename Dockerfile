#syntax=docker/dockerfile:1
FROM node:slim

WORKDIR /app
COPY . .

RUN npm install

# ENTRYPOINT ["/bin/bash"]

CMD ["node", "trshbot.js"]