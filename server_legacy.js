
import {fastify } from 'fastify'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const server = fastify() 



//escolhe o tipo de iteração tatoo

server.post('/changetype', async (request, reply) => {
    try {
        const jsonFilePath = path.join(process.cwd(), 'data.json'); // Caminho do arquivo JSON na root do projeto
        const newData = request.body; // Obtém todo o corpo da requisição

        if (!newData || Object.keys(newData).length === 0) {
            return reply.status(400).send({ error: 'Os dados para atualização são obrigatórios' });
        }

        // Lendo o JSON existente
        let jsonData = {};
        
        if (fs.existsSync(jsonFilePath)) {
            const fileContent = fs.readFileSync(jsonFilePath, 'utf8');
            jsonData = JSON.parse(fileContent);
        }

        // Atualizando todo o JSON
        jsonData = { ...jsonData, ...newData };

        // Salvando as alterações
        fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
        console.log("POST chamado")

        return reply.status(200).send({ message: 'JSON atualizado com sucesso', data: jsonData });
    } catch (error) {
        console.error('Erro ao atualizar JSON:', error);
        return reply.status(500).send({ error: 'Erro interno no servidor' });
    }
});

server.get('/getdata', async (request, reply) => {

    const jsonFilePath = path.join(process.cwd(), 'data.json'); 
    try {
        if (!fs.existsSync(jsonFilePath)) {
            return reply.status(404).send({ error: 'Arquivo JSON não encontrado' });
        }

        const fileContent = fs.readFileSync(jsonFilePath, 'utf8');
        const jsonData = JSON.parse(fileContent);
        console.log("GET chamado")
        return reply.status(200).send({ data: jsonData });
    } catch (error) {
        console.error('Erro ao obter JSON:', error);
        return reply.status(500).send({ error: 'Erro interno no servidor' });
    }
});


server. listen({
    port:3333.
})