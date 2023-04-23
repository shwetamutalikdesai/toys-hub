const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); // import path module

const app = express();

app.set('view engine', 'ejs');


mongoose.connect('mongodb://db:27017/toys-hub', {
  useNewUrlParser: true
}).then(() => {
  console.log('Connected to database');
}).catch((error) => {
  console.log('Error connecting to database', error);
});




const orderSchema = new mongoose.Schema({
  name: String,
  email: String,
  address: String,
  toy: String,
  amount: Number
});

const Order = mongoose.model('Order', orderSchema);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/checkout', (req, res) => {
  const { toy, amount } = req.query;
  res.render('checkout', { toy, amount });
});

app.post('/checkout', (req, res) => {
  const order = new Order({
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
    toy: req.body.toy,
    amount: req.body.amount
  });

  order.save().then(() => {
    console.log('Order saved to database');
    res.redirect('/');
  }).catch((error) => {
    console.log('Error saving order to database', error);
    res.redirect('/');
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
