const express = require('express')
const app = express();
const { receiveMessageOnPort } = require('worker_threads');
const { error } = require('console');
const mongoose = require('mongoose')
// const {userModel} = require('./models/addUser')



// Establishing a db connection to mydb -> database
mongoose.connect('mongodb://localhost:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

// Eror handling in case of error connection
const db =  mongoose.connection
db.on('error',(error)=>{
    console.log(`Mongdb Connection Error`)
})
db.on('open',()=>{
    console.log(`Connected to Mongodb`)
})


const userSchema = new mongoose.Schema({
     id: Number,
     name:String,
     address:String,
   
  });
const userModel = mongoose.model('users', userSchema);





app.use((req,res,err,next)=>{
    console.log(err)
    res.status(500).send('Something went wrong.')
    next();
})


// get method to for homepage
app.get('/',(req,res)=>{
    // console.log(data)
    res.status(200).send("Rest Apis")
})



// get method to fetch the data
app.get('/users',async(req,res)=>{

    try {
        const users = await userModel.find({})
        res.status(200).send(users)
    } catch (error) {
        console.log(error)
        res.status(500).send('Could not fetch')
    }

   
})


// get method to fetch data through request parameters
app.get('/users/:id',async(req,res)=>{
   const {id} = req.params


   try {
       const user = await userModel.find({id:Number(id)})
    
       if(user.length === 0)
            res.status(200).send("Users doesn't Exists")
       else
            res.status(200).send(user)
    
   } catch (error) {
        console.log("Error occured : "+error)
   }

})




// Post method to insert dummy data 
app.post('/users/add',async(req,res)=>{

    
    try {
        const user = new userModel({id:111,name:'NewName',address:"Riana Aurila"})
        await user.save()
        res.send(user).status(201)
        
    } catch (error) {
        console.log("Error occured ->"+error)   
        res.send('Operation Failed').status(500)
    }

})







// put request to modify the data
app.put('/users/:uid', async(req, res) => { 

    const id = Number(req.params.uid)
    try {
        const op = await userModel.findOneAndReplace({id:id},{name:'net',id:id,address:'Whole item has been changed via put'},{new:true})
        if (op ===null) {
            res.status(200).send('User does not  exists for put operation')
        } else {
            res.status(200).send('Put performed with : '+op)
        }
    
    } catch (error) {
        console.log(error)
        res.status(500).send("Operation failed")
    }

    
  })





// patch request to modify the data
app.patch('/users/:uid', async(req, res) => { 

    const {uid} =req.params  
    
    try {
        const updateUser = await userModel.findOneAndUpdate({id:uid},{address:'Address has been patched.',name :"farq hai"},{new:true})
        if(updateUser!=null)
            res.status(201).send(updateUser)
        else
            res.status(200).send('User not found')
    } catch (error) {
        console.log(error)
        res.status(500).send('patch failed')
    }
    

})




app.delete('/users/:id',async(req,res)=>{
    const {id} = req.params

    
    try {
        const deleteUser = await userModel.findOneAndDelete({id:Number(id)})
        if(deleteUser!=null)
            res.status(200).send("Deleted")
        else
            res.status(200).send('User not found')
        
    } catch (error) {
        console.log(error)
        res.status(500).send('Operation failed')
    }
    
})

// used basically for cross origin resource sharing
app.options('/users', (req, res) => {
    res.header('Allow', 'GET, POST, PUT, OPTIONS,');
    console.log(res)
    res.status(200).send("Options");
  });



app.listen(5000,()=>{
    console.log('Server is running at http://127.0.0.1:5000')
})


