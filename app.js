
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('picture'));
const readJson2=fs.readFileSync('./data/departement.json');
const readJson3=fs.readFileSync('./data/salarie.json');

let list=JSON.parse(readJson2);
let list1=JSON.parse(readJson3);
app.set('views', './views'); // specify the views directory
app.set('view engine', 'ejs'); 
// register the template engine

app.use(express.static(__dirname + '/views'));
//app.use(express.static('pages'));


//departement
app.get('/departement',(req,resp)=>{

		resp.render('departement',{list,error:"Ajouter département"});
});
/// ADD DEPARTEMENT
app.post('/addDepartement',function(req,resp){
	if(req.body.Nom==="" || req.body.chef_département==="" || req.body.description===""){
		resp.redirect('/departement/');
	}
	else{
		list.push({
				"Nom":req.body.Nom,
				"chef_département":req.body.chef_département,
			   "description":req.body.description,
			   "idmatricule":list.length+1
			});
			fs.writeFile('data/departement.json',JSON.stringify(list,null,5),(err)=>{
				console.log(err);
			});
			resp.redirect('/departement/');
	}
});

//salarie
app.get('/salarie/:Nom/:Matricule',(req,resp)=>{
	var {Nom}= req.params;
	var {Matricule}=req.params;

	for(var j=0;j<list.length;j++){
	 if(list[j].idmatricule==Matricule){
		resp.render('salarie',{list1,text:"Ajouter Salarie",departement:Nom,Matricule});
		console.log(list[j].idmatricule +"==" + Matricule);
		console.log(list[j].Nom +"==" +Nom);
	}
}
});
// ADD Salarie
app.post('/addSalarie',function(req,resp){
	console.log( req.body.departement+"/" + req.body.Matricule);
	if(req.body.nom=="" || req.body.Prenom=="" || req.body.Age=="" || req.body.salarie==""){
		resp.redirect('/salarie/'+ req.body.departement+"/" + req.body.Matricule);
	}
	else{
	for(var i in list){
		if(list[i].idmatricule==req.body.Matricule){
		list1.push({
				"Matricule":req.body.Matricule,
				"id":list1.length +1,
				"nom":req.body.nom,
				"Prenom":req.body.Prenom,
			   "Age":req.body.Age,
			   "salaire":req.body.salaire
			});
			fs.writeFile('data/salarie.json',JSON.stringify(list1,null,5),(err)=>{
				console.log(err);
			});
			resp.redirect('/salarie/'+ req.body.departement+"/" + req.body.Matricule);
	}
}
}
});
app.listen(port, () => console.log(`youcode listening on port ${port}!`));
