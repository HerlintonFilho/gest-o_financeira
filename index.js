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
        res.redirect("/")
    }).catch(err =>{
        console.log(err)
    })
})

app.get("/amostra", async(req, res)=>{
    var amostra = await knex.raw('SELECT * FROM compras')
    console.log(amostra[0])
    res.render('tabela',{amostra: amostra[0]})
})

app.get("/saldo", (req,res)=>{
    res.render("saldo")
})

//Server
app.listen(8080, ()=>{
    console.log("Server Rodando")
})