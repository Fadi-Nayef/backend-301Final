const express =require ('express');
const cors = require ('cors');
require ('dotenv').config();
const server = express();
server.use(cors());
server.use(express.json());

const port = process.env.PORT;
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/digimons', {useNewUrlParser: true, useUnifiedTopology: true});

const digimonsSchema = new mongoose.Schema({
    name: String,
    img:String,
    level:String
  });

  const MydigimonsModel = mongoose.model('digimons', digimonsSchema);
server.get('/',(req,res)=>{
    res.send('ALIVE')
})

server.post('/addtofav',addToFavHandler);
server.get('/getFav',getFavHandler);
server.delete('/deleteDigimon/:id',deleteHandler)
server.put('/updateDigimon/:id',updateHandler);

function updateHandler(req,res){
    const {name,image,level} = req.body;
    const {id}=req.params;
    MydigimonsModel.findOne({_id:id},(err,data)=>{
            data.name=name,
            data.img=image,
            data.level=level,
            data.save().then(()=>{MydigimonsModel.find({},(err,newData)=>{
    
                res.send(newData)
            })
        })
    })
}


function deleteHandler(req,res){
    const {id}=req.params;
    MydigimonsModel.remove({_id:id},(err,firstdata)=>{
        MydigimonsModel.find({},(err,data)=>
        {
            res.send(data)
        })
    })
}
function getFavHandler(req,res){
MydigimonsModel.find({},(err,data)=>{
    res.send(data)
})
}

function addToFavHandler (req,res){
    console.log(req.body);
    const {name,img,level}=req.body;
    const newDig= new MydigimonsModel({
        name:name,
        img:img,
        level:level
    })
    console.log(newDig);
    newDig.save();
}


server.listen((port),console.log(`server listining on PORT ${port}`));