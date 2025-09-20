import express from "express";
import dotenv from "dotenv";

// Carrega as variáveis de ambiente definidas no arquivo .env
dotenv.config();

// Cria uma instância do servidor Express
const app = express();

// Define a porta do servidor a partir da variável de ambiente PORT,
// ou usa 3000 como valor padrão se não existir
const PORT = process.env.PORT || 3000;

// Cria uma rota GET para o caminho raiz ("/")
// Quando alguém acessa essa rota, o servidor responde com a mensagem
app.get("/", (_req, res) => {
  res.send("✅ Backend está rodando em TypeScript!");
});

// Faz o servidor "escutar" a porta definida
// Quando subir, exibe no console a URL para acessar
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
