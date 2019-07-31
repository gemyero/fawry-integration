const express = require('express');
const crypto = require('crypto');
const uniqid = require('uniqid');
const { prepareDataForHashing } = require('./helper');

const computeHashSHA256 = data => crypto
  .createHash('sha256')
  .update(data)
  .digest('hex');

function run() {
  const language = 'ar-eg';
  const merchantCode = '1tSa6uxz2nSL2tCkXCgN7A==';
  const merchantRefNumber = uniqid.time();
  const customerProfileId = uniqid.time();
  const successPageUrl = process.env.SUCCESS_PAGE_URL || 'http://localhost:4000/successUrl';
  const failerPageUrl = process.env.FAILER_PAGE_URL || 'http://localhost:4000/failerUrl';
  const items = [
    { productSKU: uniqid.time(), description: 'product 1', price: '50', quantity: '2' },
    { productSKU: uniqid.time(), description: 'product 2', price: '70', quantity: '1' }
  ];

  const data = prepareDataForHashing({
    merchantCode,
    merchantRefNumber,
    customerProfileId,
    items,
    expiry: '2',
    mobile: '01091492532',
    email: 'mohamedgr91@gmail.com',
    secureHashKey: '25c89e69999d4cb8b6ba8b43dec3ea25',
  });

  const hash = computeHashSHA256(data);

  const prodBaseUrl = 'https://www.atfawry.com/ECommercePlugin/FawryPay.jsp';
  const sandboxBaseUrl = 'https://atfawry.fawrystaging.com/ECommercePlugin/FawryPay.jsp';

  const url = `${sandboxBaseUrl}?chargeRequest={"language":"ar-eg","merchantCode":"${merchantCode}","merchantRefNumber":"${merchantRefNumber}","customer":{"name":"Mohamed Gamal","mobile":"01091492532","email":"mohamedgr91@gmail.com", "customerProfileId":"${customerProfileId}"},"order":{"description":"test bill inq", "expiry": "2", "orderItems":${JSON.stringify(items)}},"signature":"${hash}"}&successPageUrl=${successPageUrl}&failerPageUrl=${failerPageUrl}`;

  return url;
  //   console.log(`
  // merchantCode: 1tSa6uxz2nSL2tCkXCgN7A==
  // merchantRefNumber: ${merchantRefNumber}
  // customerProfileId: ${customerProfileId}
  // Item code:  3124124 
  // Quantity: 2
  // Price: 50.00
  // Expiry: 2
  // Mobile: 01091492532
  // Email: mohamedgr91@gmail.com
  // Secure hash key:  25c89e69999d4cb8b6ba8b43dec3ea25
  // ****************************************************

  // resulting data before hash:
  // ***************************
  // ${data}

  // resulting hash:
  // **************
  // ${hash}

  // resulting request:
  // ******************
  // ${url}

  // ERROR:
  // ******
  // 9903 : حدث خطا

  // `);
}

const app = express();

app.use(express.static('public'));
app.use(express.json());

app.get('/payLink', (req, res) => {
  const url = run();
  res.redirect(url);
});

app.get('/successUrl', (req, res) => {
  res.send({ chargeResponse: JSON.parse(req.query.chargeResponse) });
});

app.get('/failerUrl', (req, res) => {
  res.send(req.query);
});

app.get('/serverCallbackV2', (req, res) => {
  res.send('in get callback');
});

app.post('/serverCallbackV2', (req, res) => {
  console.log(req.body);
  res.send('in post callback');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('server starts...'));