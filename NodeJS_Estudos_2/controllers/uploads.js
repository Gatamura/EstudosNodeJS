const fs = require('fs');

module.exports = function(app){

    app.post('/upload/imagem',function(req,res){
        
        console.log('recebendo a imagem...');

        var filename = req.headers.filename;
        req.pipe(fs.createWriteStream('files/' + filename))
                .on('finish', function(){
                    console.log('terminamos de escrever o arquivo...')
                    res.status(201).send('arquivo escrito!')
                })


    })

}