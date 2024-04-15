const mongoose=require("mongoose")
const initData=require("./data.js")
const Listing= require("../model/Listing.js")

main().then(()=>
{
    console.log("Connection was succesfull")
    }).catch(err => 
        console.log(err));
    async function main() {
      await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
};
let initDB=async ()=>{
   await Listing.deleteMany({});
   await Listing.insertMany(initData.data);
   console.log("saved")
};
initDB();