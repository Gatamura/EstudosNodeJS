var cluster = require('cluster');
var os = require('os');

//PERGUNTA QUANTOS NUCLEOS O PC TEM
var cpus = os.cpus();


console.log('executando thread...')

if(cluster.isMaster){
    console.log('thread master...')

    cpus.forEach(() => {
        cluster.fork()
    })

    cluster.on('listening',function(worker){
        console.log('Cluster connectado: ' + worker.process.pid)
    })

    //CASO UM NO SE PERCA PARA CHAMAR ELE NOVAMENTE

    cluster.on('exit', worker => {
        console.log('Cluster %d desconectado: ', worker.process.pid)
        cluster.fork();
    })

    //PARA MATAR UM PROCESSO E TESTAR
    //KILL -9 (NUMERODOCLUSTER)

} else {
    
    console.log('thread slave...')
    require('./index.js')

}

// FILHO = SLAVE