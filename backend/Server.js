//Importação dos modulos
const express = require('express')
const mysql = require('mysql2')
const multer = require('multer')
const cors = require('cors')
const path = require('path')
const os = require('os')
const qrcode = require('qrcode')

//Função para obter os endereços IP das interfaces
function getNetworkIPs() {
    const interfaces = os.networkInterfaces();
    const ips = [];

    //Itera sobre as interfaces para encontrar os endereços IPV4
    for (let interfaceName in interfaces) {
        for (let iface of interfaces[interfaceName]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                ips.push(iface.address);
            }
        }
    }

    //Retorna os endereços IP disponiveis ou localhost caso não encontre
    return ips.length ? ips : ['127.0.0.1'];
}

const networksIPs = getNetworkIPs();
console.log(`Endereços IP disponiveis: ${networksIPs.join(', ')}\n`);

// Gera QR Codes para cada IP disponivel
networksIPs.forEach(ip => {
    qrcode.toString(ip, { type: 'terminal', scale: 0.4, width: 150, height: 150 }, (err, url) => {
        if (err) {
            console.error('Erro ao gerar o QR Code para IP', ip, ':', err);
        } else {
            console.log(`IP: ${ip}`);
            console.log(url, '\n');
        }
    })
})

//Criação do servidor Express
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "etecembu@123",
    database: "ordemservico",
    port: 3306,
});

//Estabelece a conexão com o banco de dados
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conexão com o banco de dados estabelecida com sucesso');
});

//Criação do servidor Express
const app = express();
app.use(express.json());
app.use(cors());

//Configuração para servir arquivos estaticos
app.use('/src/img/', express.static(path.join(__dirname, 'src/img')));

//Define a porta do servidor
const PORT = 3006;

//Inicia o servidor na porta definida e disponibiliza IPs
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT} e disponível nas redes: ${networksIPs.join(',')}`);
});

//Rota para inserção de dados no banco
app.post('/insert', multer().single('foto'), (req, res) => {
    const { nome, email, maquina } = req.body;
    const foto = req.file ? req.file.path : null

    //Define consulta SQL para inserir os dados
    const query = 'INSERT INTO servico (nome, email, maquina) VALUES (?,?,?)';
    const values = [nome, email, maquina];

    console.log(values)

    //Executa a consulta no banco de dados
    db.query(query, values, (err) => {
        if (err) {
            console.error('Erro ao inserir:', err)
            return res.status(500).json({ message: 'Erro ao inserir ' })
        }
        console.log('Registro inserido com sucesso!');
        res.json({ message: 'Registro inserido com sucesso!' });
    });
});

//Inicia o servidor em callback
app.listen(3006, () => {
    console.log('Servidor rodando na porta 3006');
});