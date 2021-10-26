FROM node:14

WORKDIR /app/

COPY .yarn/releases/yarn-3.1.0.cjs ./.yarn/releases/
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install

COPY . .

CMD ["yarn", "dev"]
