var soap = require('soap');

function SoapCorreios(){
    this._soap = soap.createClient;
    this._url = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl'
}

SoapCorreios.prototype.prazoEntrega = function(dadosEntrega,callback){
this._soap(this._url, function(erro,cliente){

    cliente.CalcPrazo(dadosEntrega ,callback)
})}

module.exports = function(){
    return SoapCorreios;
}