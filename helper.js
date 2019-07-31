const uniqid = require('uniqid');

const prepareItemsForHashing = items => items.reduce((acc, curr) => {
  return acc + curr.productSKU + curr.quantity + Number(curr.price).toFixed(2);
}, '');

const prepareDataForHashing = ({
  merchantCode, merchantRefNumber, customerProfileId = '', items = [], expiry = '', mobile = '', email = '', secureHashKey
}) => {
  return merchantCode +
    merchantRefNumber +
    customerProfileId +
    prepareItemsForHashing(items) +
    expiry +
    mobile +
    email +
    secureHashKey;
};

const prepareMessageForHashing = ({
  fawryRefNumber, merchantRefNum, paymentAmount, 
  orderAmount, orderStatus, paymentMethod, 
  paymentRefrenceNumber = '', secureHashKey
}) => {
  return fawryRefNumber +
    merchantRefNum +
    Number(paymentAmount).toFixed(2) +
    Number(orderAmount).toFixed(2) +
    orderStatus + 
    paymentMethod + 
    paymentRefrenceNumber + secureHashKey
};

module.exports = {
  prepareDataForHashing,
  prepareMessageForHashing
};