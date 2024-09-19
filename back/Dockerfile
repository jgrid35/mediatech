FROM node:22.8.0

WORKDIR /usr/app

COPY package*.json pnpm-lock.yaml ./

RUN mkdir /files
RUN chown node /files

RUN npm i -g pnpm

RUN pnpm install --frozen-lockfile
            
COPY src/ ./src/

COPY tsconfig.json ./

RUN pnpm run build

CMD pnpm run start