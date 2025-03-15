import Fastify from 'fastify';
import cors from '@fastify/cors';
import fs from 'fs';
import path from 'path';

const server = Fastify();

// 🔹 Configuração do CORS para múltiplas origens
server.register(cors, {
    origin: ["http://localhost:3000", "http://localhost:8080"], 
    methods: ["GET", "POST"], 
});

// 🔹 Rota POST para atualizar JSON
server.post('/changetype', async (request, reply) => {
    try {
        const jsonFilePath = path.join(process.cwd(), 'data.json');
        const newData = request.body;

        if (!newData || Object.keys(newData).length === 0) {
            return reply.status(400).send({ error: 'Os dados para atualização são obrigatórios' });
        }

        let jsonData = {};
        if (fs.existsSync(jsonFilePath)) {
            const fileContent = fs.readFileSync(jsonFilePath, 'utf8');
            jsonData = JSON.parse(fileContent);
        }

        jsonData = { ...jsonData, ...newData };

        fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null,- 2), 'utf8');
        console.log("✅ POST /changetype chamado");

        return reply.status(200).send({ message: 'JSON atualizado com sucesso', data: jsonData });
    } catch (error) {
        console.error('❌ Erro ao atualizar JSON:', error);
        return reply.status(500).send({ error: 'Erro interno no servidor' });
    }
});

// 🔹 Rota GET para obter dados do JSON
server.get('/getdata', async (request, reply) => {
    const jsonFilePath = path.join(process.cwd(), 'data.json');
    try {
        if (!fs.existsSync(jsonFilePath)) {
            return reply.status(404).send({ error: 'Arquivo JSON não encontrado' });
        }

        const fileContent = fs.readFileSync(jsonFilePath, 'utf8');
        const jsonData = JSON.parse(fileContent);
        console.log("✅ GET /getdata chamado");

        return reply.status(200).send({ data: jsonData });
    } catch (error) {
        console.error('❌ Erro ao obter JSON:', error);
        return reply.status(500).send({ error: 'Erro interno no servidor' });
    }
});

// 🔹 Iniciando o servidor corretamente
server.listen({ port: 3333 }, (err, address) => {
    if (err) {
        console.error('❌ Erro ao iniciar o servidor:', err);
        process.exit(1);
    }
    console.log(`🚀 Servidor rodando em ${address}`);
});
