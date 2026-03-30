require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Bid = require('./models/Bid');
const Transaction = require('./models/Transaction');
const ServiceProvider = require('./models/ServiceProvider');
const MarketInfo = require('./models/MarketInfo');
const Rating = require('./models/Rating');
const { users, productTemplates, providerTemplates, marketInfoTemplates } = require('./data/sampleData');

const importData = async () => {
  try {
    await connectDB();

    await Transaction.deleteMany();
    await Bid.deleteMany();
    await Product.deleteMany();
    await ServiceProvider.deleteMany();
    await MarketInfo.deleteMany();
    await Rating.deleteMany();
    await User.deleteMany();

    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }

    const userByEmail = createdUsers.reduce((acc, user) => {
      acc[user.email] = user;
      return acc;
    }, {});

    const adminUser = userByEmail['admin@govihanda.lk'];
    const farmerOne = userByEmail['farmer1@govihanda.lk'];
    const farmerTwo = userByEmail['farmer2@govihanda.lk'];
    const buyerOne = userByEmail['buyer1@govihanda.lk'];
    const buyerTwo = userByEmail['buyer2@govihanda.lk'];
    const providerOne = userByEmail['provider1@govihanda.lk'];
    const providerTwo = userByEmail['provider2@govihanda.lk'];

    const createdProducts = await Product.insertMany([
      { ...productTemplates[0], farmer: farmerOne._id, harvestDate: new Date('2026-03-15') },
      { ...productTemplates[1], farmer: farmerTwo._id, harvestDate: new Date('2026-03-20') },
      { ...productTemplates[2], farmer: farmerOne._id, harvestDate: new Date('2026-03-22') },
      { ...productTemplates[3], farmer: farmerTwo._id, harvestDate: new Date('2026-03-18') },
      { ...productTemplates[4], farmer: farmerOne._id, harvestDate: new Date('2026-03-10') },
    ]);

    const soldProduct = createdProducts.find((p) => p.status === 'sold');
    const openProduct = createdProducts.find((p) => p.status === 'open');

    const acceptedBid = await Bid.create({
      product: soldProduct._id,
      buyer: buyerOne._id,
      bidAmount: 250,
      quantityRequested: 120,
      message: 'Can collect tomorrow morning.',
      status: 'accepted',
    });

    await Bid.create({
      product: openProduct._id,
      buyer: buyerTwo._id,
      bidAmount: 170,
      quantityRequested: 80,
      message: 'Looking for weekly supply if quality is consistent.',
      status: 'pending',
    });

    await Transaction.create({
      product: soldProduct._id,
      bid: acceptedBid._id,
      farmer: soldProduct.farmer,
      buyer: buyerOne._id,
      agreedPrice: acceptedBid.bidAmount,
      quantity: acceptedBid.quantityRequested,
      totalAmount: acceptedBid.bidAmount * acceptedBid.quantityRequested,
      paymentStatus: 'paid',
      deliveryStatus: 'in_transit',
      storageStatus: 'arranged',
      transactionStatus: 'active',
      notes: 'Sample seeded transaction for dashboard testing.',
    });

    await ServiceProvider.insertMany([
      {
        ...providerTemplates[0],
        user: providerOne._id,
        approvedBy: adminUser._id,
        approvedAt: new Date(),
      },
      {
        ...providerTemplates[1],
        user: providerTwo._id,
      },
    ]);

    await MarketInfo.insertMany(
      marketInfoTemplates.map((record) => ({
        ...record,
        source: 'GoviHanda Seed Data',
        addedBy: adminUser._id,
      }))
    );

    console.log('\nSample data imported successfully.');
    console.log('\nSample login accounts (password for all: Password123!):');
    console.log('- Admin: admin@govihanda.lk');
    console.log('- Farmer: farmer1@govihanda.lk, farmer2@govihanda.lk');
    console.log('- Buyer: buyer1@govihanda.lk, buyer2@govihanda.lk');
    console.log('- Provider: provider1@govihanda.lk, provider2@govihanda.lk');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Seeder import failed: ${error.message}`);
    await mongoose.connection.close();
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Transaction.deleteMany();
    await Bid.deleteMany();
    await Product.deleteMany();
    await ServiceProvider.deleteMany();
    await MarketInfo.deleteMany();
    await Rating.deleteMany();
    await User.deleteMany();
    console.log('All data destroyed.');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Seeder destroy failed: ${error.message}`);
    await mongoose.connection.close();
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
