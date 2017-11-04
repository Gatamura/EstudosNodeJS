module.exports = function(app){

    app.post('/servicos/correios', function(req,res){

        var dados_correio = req.body;

        console.log(dados_correio);

        var SoapCorreios = new app.servicos.correiosSOAPClient()
        SoapCorreios.prazoEntrega(dados_correio,function(err,results){
            
            res.status(201).json(results)
        })

    })

}