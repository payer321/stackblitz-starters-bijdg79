const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 3010;

app.use(express.static('static'));

let taxRate = 5;
let discountPercentage = 10;  
let loyaltyRate = 2;

app.get( "/cart-total",( req, res ) => {
  let newItemPrice = parseFloat(req.query.newItemPrice);
  let cartTotal = parseFloat(req.query.cartTotal);
  let newCartTotal = cartTotal + newItemPrice;
  res.send(newCartTotal.toString());
});
 function membershipdiscount(cartTotal,isMember) {
   if (isMember){
   return  cartTotal - cartTotal*discountPercentage/100;
 } else {
   return cartTotal;
 }
 }
 app.get("/membership-discount", (req, res) => {
   let isMember = req.query.isMember === "true";
   let cartTotal = parseFloat(req.query.cartTotal);
   res.send(membershipdiscount(cartTotal,isMember).toString());
 })
app.get("/calculate-tax", (req, res) =>{
  let cartTotal = parseFloat(req.query.cartTotal);
  res.send((cartTotal * taxRate/100).toString());
})


function calculateDeliveryDays(shippingMethod, distance) {
if (shippingMethod === "standard") {
    return distance / 50;
  } else if (shippingMethod === "express") {
    return distance / 100;
  } else {
    return "Invalid shipping method";
  }
}

app.get("/estimate-delivery", (req, res) => {
  let shippingMethod = req.query.shippingMethod;
  let distance = parseFloat(req.query.distance);
res.send(calculateDeliveryDays(shippingMethod, distance).toString());
});

app.get( "/shipping-cost",( req, res ) => {
  let weight  = parseFloat(req.query.weight );
  let distance  = parseFloat(req.query.distance );
  let shippingcost = weight * distance * 0.1;
  res.send(shippingcost.toString());
});

app.get( "/loyalty-points",( req, res ) => {
  let purchaseAmount   = parseFloat(req.query.purchaseAmount  );
  let loyalpoints = purchaseAmount * loyaltyRate;
  res.send(loyalpoints.toString());
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
