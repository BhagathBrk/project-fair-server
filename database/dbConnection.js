const mongoose = require('mongoose')

const connectionString = process.env.DBCONNECTIONSTRING

mongoose.connect(connectionString).then(res=>{
    console.log("MongoDB atlas connected with pf server");
    
}).catch(err=>{
    console.log("MongoDB atlas connection failed");
    console.log(err);
    
})