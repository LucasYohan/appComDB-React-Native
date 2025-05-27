//Importação dos modulos
const express = require('express')
const mysql = require('mysql')
const multer = ('multer')
const cors = ('cors')
const path = ('path')
const os = ('os')
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