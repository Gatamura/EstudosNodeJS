const logger = require('../servicos/logger');

module.exports = function(app){

  //GET

  app.get('/pagamentos', function(req, res){
    console.log('Recebida requisicao de teste na porta 3000.')
    res.send('OK.');
  });

  //CONSULTAR PAGAMENTOS

  app.get('/pagamentos/:id', function(req,res){

    var id = req.params.id;

    var memcachedClient = new app.servicos.memcachedClient();

    // memcachedClient.set('pagamento-' +id, {id}, 60000, function(erro){
    //   console.log('Novo dado adicionado no cache: pagamento-'+id  )
    // })

    console.log('Consultando pagamento de id: ' + id);
    // logger.info('Consultando pagamento de id: ' + id);

    memcachedClient.get('pagamento-' + id, function(erro,retorno){
      if(erro || !retorno){
        console.log('MISS - Dados nao encontrados')
        var connection = app.persistencia.connectionFactory();
        var produtosDao = new app.persistencia.PagamentoDao(connection);
    
        produtosDao.buscaPorId(id,function(err,results){
          if(err){
            res.status(400).send(err)
            return;
          } else {
            console.log('Consulta realizada pelo id: ' +id)
            res.status(200).json(results)
            return;
          }
        })
      } else {
        console.log('HIT - Dados encontrados: ' + JSON.stringify(retorno))
        // logger.info('HIT - Dados encontrados: ' + JSON.stringify(retorno))

        res.status(200).json(retorno)
        return
      }
    })

  })

  //DELETE

  app.delete('/pagamentos/pagamento/:id', function(req,res){

    let pagamento = {};
    let id = req.params.id;

    pagamento.id = id;

    var connection = app.persistencia.connectionFactory();
    var produtosDao = new app.persistencia.PagamentoDao(connection);

    produtosDao.deletar(pagamento,function(error){
      if(error){
        res.status(500).send(error);
      } else {
        res.send(pagamento);
      }
    })

  })

  //PUT

  app.put('/pagamentos/pagamento/:id', function(req,res){

    let pagamento = {};
    let id = req.params.id;

    pagamento.id = id;
    pagamento.status = 'CONFIRMADO';

    var connection = app.persistencia.connectionFactory();
    var produtosDao = new app.persistencia.PagamentoDao(connection);

    produtosDao.atualiza(pagamento,function(error,results){
      if(error){
        res.status(500).send(error)
      } else {
        res.send(pagamento);
      }
    })

  })

  // POST

  app.post('/pagamentos/pagamento', function(req, res){


    req.assert("pagamento.forma_de_pagamento",
        "Forma de pagamento eh obrigatorio").notEmpty();
    req.assert("pagamento.valor",
      "Valor eh obrigatorio e deve ser um decimal")
        .notEmpty().isFloat();

    var erros = req.validationErrors();

    if (  erros){
      console.log('Erros de validacao encontrados');
      return;
    }

    var pagamento = req.body['pagamento'];

    console.log(pagamento)

    console.log('processando uma requisicao de um novo pagamento');

    pagamento.status = 'CRIADO';
    pagamento.data = new Date;

    var connection = app.persistencia.connectionFactory();
    var pagamentoDao = new app.persistencia.PagamentoDao(connection);

    pagamentoDao.salva(pagamento, function(erro, resultado){
      if(erro){
        console.log('Erro ao inserir no banco:' + erro);
        res.status(500).send(erro);
      } else {
        pagamento.id = resultado.insertId;
      console.log('pagamento  criado');

      var memcachedClient = new app.servicos.memcachedClient();
      
          memcachedClient.set('pagamento-' +pagamento.id, pagamento, 60000, function(erro){
            console.log('Novo dado adicionado no cache: pagamento-'+pagamento.id  )
          })

      if(pagamento.forma_de_pagamento == 'cartao'){
        var cartao = req.body['cartao'];

        console.log('forma de pagamento eh cartao');

        var clienteCartoes = new app.servicos.clienteCartoes();
        clienteCartoes.autoriza(cartao, function(excepted,request,response,retorno){
          if(excepted){
            console.log(excepted);
            res.status(400).send(excepted)
            return;
          } 
          console.log(retorno);

          var results = {
            status_do_pagamento: pagamento,
            dados_do_cartao: retorno,
            links: [{
              href: 'http://localhost:3000/pagamentos/pagamento/' + pagamento.id,
              relation: 'Rota para confirmar o pagamento',
              method: 'PUT'
            },{
              href: 'http://localhost:3000/pagamentos/pagamento/' + pagamento.id,
              relation: 'Rota para cancelar o pagamento',
              method: 'DELETE'
            }]
          }
          res.status(201).json(results);
          return;
        })
      
      } else {
        
        res.location('/pagamentos/pagamento/' + pagamento.id);
  
        var results = {
          status_do_pagamento : pagamento,
          links : [{
            href: 'http://localhost:3000/pagamentos/pagamento/' + pagamento.id,
            relation: 'Rota para confirmar o pagamento',
            method: 'PUT'
          },{
            href: 'http://localhost:3000/pagamentos/pagamento/' + pagamento.id,
            relation: 'Rota para cancelar o pagamento',
            method: 'DELETE'
          }
        ]
        }
  
        res.status(201).json(results);
     
      }

    }
    });

  });
}
