//Dependencias
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const knex = require("./database/database")


//View engine
app.set('view engine', 'ejs');

//static
app.use(express.static('public'));

//Body Parser
app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

//Rotas

app.get("/",(req, res)=>{
    res.render("index")
})


//Rotas de cadastro de compras
app.get("/compras",(req, res)=>{
    res.render("compras")
})

app.post("/compras/cadastro",async (req,res)=>{
    var usuario = req.body.nome;
    var item = req.body.item;
    var valor = req.body.valor
    var preco = parseFloat(valor)
    var dia = req.body.dia
    await knex.raw(`INSERT INTO compras(usuario, item, valor, data_compra) VALUES('${usuario}','${item}','${preco}', '${dia}')`).then(data =>{
        console.log("Compra inserida na tabela", data)
        res.redirect("/amostra")
    }).catch(err =>{
        console.log(err)
    })
})


//rota para visualizar as compras feitas
app.get("/amostra", async(req, res)=>{
    var amostra = await knex.raw('SELECT usuario, item, valor, DATE_FORMAT(data_compra,"%y/%m/%d") as data FROM compras')
    console.log(amostra[0])
    res.render('tabela',{amostra: amostra[0]})
})


//rota para entrada de valores
app.get("/entrada", async(req,res)=>{
    var entrada =  await knex.raw('SELECT nome, motivo, valor_entrada, DATE_FORMAT(data_entrada,"%y/%m/%d") as data FROM entrada')
    console.log(entrada[0])
    res.render("entrada", {entradas: entrada[0]})
})

app.post("/entrada/cadastro", async (req, res) =>{
    var nome = req.body.name
    var valorEntrada = req.body.valorEntrada
    var valorReal = parseFloat(valorEntrada)
    var motivo =  req.body.motivo
    var dia =  req.body.dia

    await knex.raw(`INSERT INTO entrada(nome, motivo, data_entrada, valor_entrada) VALUES('${nome}', '${motivo}', '${dia}', '${valorReal}')`).then(data =>{
        console.log("Valor inserido na tabela", data)
        res.redirect("/entrada")
    }).catch(err =>{
        console.log(err)
    })

})


//rota para visualizar o saldo da data selecionada
app.get("/saldo", async(req,res)=>{
    var soma_compra = await knex.raw('SELECT SUM(valor) FROM compras')
    var soma_entrada = await knex.raw('SELECT SUM(valor_entrada) FROM entrada')
    console.log(soma_entrada[0][0]['SUM(valor_entrada)'])
    console.log(soma_compra[0][0]['SUM(valor)'])
    var total = (soma_entrada[0][0]['SUM(valor_entrada)']) - (soma_compra[0][0]['SUM(valor)'])
    console.log(total)
    res.render("saldo",{total: total})
})

//Server
app.listen(8080, ()=>{
    console.log("Server Rodando")
})