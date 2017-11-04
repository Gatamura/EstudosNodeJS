var memcached = require('memcached');

function createMemcachedClient(){
    var cliente = new memcached('localhost:11211', {
        retries: 10,
        retry: 10000,
        remove: true

     
})
    return cliente;
}

// cliente.set('pagamento-20', {id:20}, 60000, function(erro){
//     console.log('chave adicionada ao cache da memoria: pagamento - 20')
// })

// cliente.get('pagamento-20', function(erro,response){
//     if(erro || !response){
//         console.log('MISS - Dados nao encontrados!')
//     } else {
//         console.log('HIT - Dados: ' + JSON.stringify(response))
//     }
//})

module.exports = function(){
    return createMemcachedClient;
}