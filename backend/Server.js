// JS/Server.js

// Importa os módulos necessários
const express = require('express'); // Framework para criar um servidor web
const mysql = require('mysql2'); // Biblioteca para conexão com MySQL
const multer = require('multer'); // Middleware para upload de arquivos
const cors = require('cors'); // Middleware para permitir requisições de diferentes origens
const path = require('path'); // Módulo para lidar com caminhos de diretórios
const os = require('os'); // Módulo para obter informações do sistema operacional
const qrcode = require('qrcode'); // Biblioteca para gerar QR Codes

// Função para obter os endereços IP das interfaces de rede
function getNetworkIPs() {
    const interfaces = os.networkInterfaces();
    const ips = [];

    for (let interfaceName in interfaces) {
        for (let iface of interfaces[interfaceName]) {
            // Mude `iface.internal` para `!iface.internal`
            // Isso garante que você pegue IPs que não são internos (como 127.0.0.1)
            if (iface.family === 'IPv4' && !iface.internal) {
                ips.push(iface.address);
            }
        }
    }
    // Se não encontrar nenhum IP de rede, ainda retorna 127.0.0.1 como fallback
    return ips.length ? ips : ['127.0.0.1'];
}

const networkIPs = getNetworkIPs();
console.log(`Endereços IP disponíveis: ${networkIPs.join(',')}\n`);

// Gera QR Codes para cada IP disponível
networkIPs.forEach(ip => {
    qrcode.toString(ip, { type: 'terminal', scale: 0.4, width: 150, height: 150 }, (err, url) => {
        if (err) {
            console.error('Erro ao gerar QR Code para IP', ip, ':', err);
        } else {
            console.log(`IP: ${ip}`);
            console.log(url, '\n');
        }
    });
});

// Configuração da conexão com MySQL
const db = mysql.createConnection({
    host: 'localhost',    // Endereço do banco de dados
    user: 'root',        // Usuário do banco
    password: 'etecembu@123', // Senha do banco
    database: 'ordemservico', // Nome do banco
    port: 3306,           // Porta padrão do MySQL
});

// Estabelece a conexão com o banco de dados
db.connect((err) => {
    if (err) {
        throw err; // Caso ocorra erro, exibe mensagem e encerra
    }
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
});

// Criação do servidor Express
const app = express();
app.use(express.json()); // Permite processamento de requisições JSON
app.use(cors()); // Libera acesso para requisições de diferentes domínios

// Configuração para servir arquivos estáticos
app.use('/src/img', express.static(path.join(__dirname, 'src/img')));

// Define a porta do servidor
const PORT = 3006;

// Rota para inserção de dados no banco
app.post('/insert', multer().single('foto'), (req, res) => {
    const { nome, email, maquina } = req.body; // Obtém os dados enviados
    const foto = req.file ? req.file.path : null; // Verifica se há uma imagem anexada

    // Define a consulta SQL para inserir os dados
    const query = 'INSERT INTO servicos (nome, email, maquina) VALUES (?, ?, ?)';
    const values = [nome, email, maquina];

    // Executa a consulta no banco de dados
    db.query(query, values, (err) => {
        if (err) {
            console.error('Erro ao inserir:', err);
            return res.status(500).json({ message: 'Erro ao inserir dados no banco de dados!', error: err });
        }

        console.log('Registro inserido com sucesso!');
        res.json({ message: 'Registro inserido com sucesso!' });
    });
});

// Inicia o servidor na porta definida e disponibiliza IPs
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT} e disponível nas redes: ${networkIPs.join(',')}`);
});