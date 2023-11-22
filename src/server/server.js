const express=require('express');

const cors=require('cors')

const app=express();

app.use(cors())

const mongoose=require("mongoose");

app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Hello Express");
})



const mongourl="URL OF MONGODB"

mongoose.connect(mongourl,{
    useNewUrlParser:true,
})
.then(()=>{console.log("Connected to Databse")})
.catch((e)=>console.log(e));


const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

require("./user_details.js");

const User=mongoose.model("User");

app.post("/register",async(req,res)=>{
 const {name, pass} = req.body;
 console.log(name,pass);
 try{
  await User.create({
    username:name,
    password:pass,
    purchased_pdfs:["pdf1","pdf2"]
  })
  res.send({status:"Ok"})
 }catch (error){
  console.log(error)
  res.send({status:"error"})
 }
})

app.post('/login-user', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // User exists, send the list of purchased PDFs
    return res.status(200).json({ purchased_pdfs: user.purchased_pdfs });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


const stripe = require('stripe')('your_stripe_secret_key');

// Handle payment
app.post('/pay', async (req, res) => {
  const { username, password, pdfName, amount } = req.body;

  try {
    // Find the user by username and email
    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects the amount in cents
      currency: 'usd',
      description: `Purchase of ${pdfName}`,
      payment_method: req.body.payment_method,
      confirm: true,
    });

    // Update user's purchased_pdfs array with the purchased pdfName
    user.purchased_pdfs.push(pdfName);
    await user.save();

    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});
