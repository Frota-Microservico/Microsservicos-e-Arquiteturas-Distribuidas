# Use a imagem oficial do Node.js como base
FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia package.json e package-lock.json para instalar dependências
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install -g nodemon
RUN npm install --production

# Copia o restante do código da aplicação para dentro do container
COPY . .

# Exponha a porta que o microserviço irá rodar
EXPOSE 3003

# Define a variável de ambiente para produção (opcional)
ENV NODE_ENV=production

# Comando para iniciar o microserviço
CMD ["npm", "run", "dev"]
