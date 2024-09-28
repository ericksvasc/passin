# Etapa 1: Build da aplicação
FROM node:20.17.0-alpine AS build

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm install

# Copia o restante dos arquivos da aplicação
COPY . .

# Realiza o build da aplicação
RUN npm run build

# Etapa 2: Execução da aplicação
FROM node:20.17.0-alpine

WORKDIR /app

# Copia as dependências e arquivos da build da etapa anterior
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

COPY package*.json ./
COPY .env ./

# Expõe a porta usada pela aplicação
EXPOSE 4173

# Comando para iniciar a aplicação
CMD ["npm", "run", "preview", "--", "--host"]
