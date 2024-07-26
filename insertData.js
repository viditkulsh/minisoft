require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const Account = require('./models/account');

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

async function insertData() {
  try {
    const user = new User({
      name: "Alex Peterson",
      mail: "alex@gmail.com",
      mobile: "9900000090",
      contact: ["alex@gmail.com", "9900000090"]
    });
    await user.save();

    const account = new Account({
      user: {
        name: user.name,
        mail: user.mail,
        uuid: user.uuid
      },
      account: {
        number: "1234567812345678",
        branch: "SBIN00000009",
        bank: "state bank of india"
      },
      balance: {
        number: 5000,
        currency: "INR"
      }
    });
    await account.save();

    console.log('Data inserted successfully');
  } catch (error) {
    console.log('Error inserting data:', error);
  } finally {
    mongoose.disconnect();
  }
}

insertData();
