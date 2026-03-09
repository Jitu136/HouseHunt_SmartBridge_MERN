const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Models
const User = require('./models/User');
const Property = require('./models/Property');
const Message = require('./models/Message');

// Load env vars
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/househunt');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Message.deleteMany();
    await Property.deleteMany();
    await User.deleteMany();

    // Create a mock user password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('123456', salt);

    // Create Mock Users
    const users = await User.insertMany([
      {
        name: 'John Landlord',
        email: 'john@example.com',
        password,
        role: 'Landlord/Seller',
        phone: '123-456-7890'
      },
      {
        name: 'Agent Smith',
        email: 'smith@example.com',
        password,
        role: 'Agent',
        phone: '987-654-3210'
      },
      {
        name: 'Jane Tenant',
        email: 'jane@example.com',
        password,
        role: 'Tenant/Buyer',
        phone: '555-555-5555'
      }
    ]);

    const landlordId = users[0]._id;
    const agentId = users[1]._id;

    // Create Mock Properties
    const properties = await Property.insertMany([
      {
        owner: agentId,
        title: 'Downtown Loft Studio',
        description: 'Exposed brick, soaring high ceilings, and oversized windows frame stunning views of the city skyline in this chic downtown loft.',
        images: [
          'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        ],
        address: '456 Main St, Unit 4B',
        city: 'New York',
        price: 3200,
        listingType: 'Rent',
        propertyType: 'Apartment',
        bedrooms: 1,
        bathrooms: 1,
        size: 950,
        amenities: ['Gym', 'Doorman', 'Rooftop Lounge', 'Elevator', 'In-Unit Washer/Dryer'],
        contactPhone: users[1].phone
      },
      {
        owner: landlordId,
        title: 'Cozy Family House in Suburbs',
        description: 'Perfect family home situated in a quiet cul-de-sac. Features a large backyard, updated kitchen, and proximity to top-rated schools.',
        images: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        ],
        address: '789 Oak Tree Lane',
        city: 'Austin',
        price: 650000,
        listingType: 'Sale',
        propertyType: 'House',
        bedrooms: 4,
        bathrooms: 3,
        size: 2800,
        amenities: ['Backyard', 'Garage', 'Fireplace', 'Central Air', 'Porch'],
        contactPhone: users[0].phone
      },
      {
        owner: agentId,
        title: 'Student/Professional PG Setup',
        description: 'Affordable, fully furnished PG accommodation with high-speed internet, daily cleaning services, and home-cooked meals included.',
        images: [
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        ],
        address: '101 University Way',
        city: 'Boston',
        price: 950,
        listingType: 'Rent',
        propertyType: 'PG',
        bedrooms: 1,
        bathrooms: 1,
        size: 300,
        amenities: ['WiFi', 'Furnished', 'Meals Included', 'Cleaning Service', 'AC'],
        contactPhone: users[1].phone
      },
      {
        owner: landlordId,
        title: 'Beachfront Condo',
        description: 'Wake up to the sound of waves in this spectacular 2-bedroom beachfront condo. Features a wraparound balcony and private beach access.',
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        ],
        address: '888 Ocean View Dr',
        city: 'Miami',
        price: 4500,
        listingType: 'Rent',
        propertyType: 'Apartment',
        bedrooms: 2,
        bathrooms: 2,
        size: 1200,
        amenities: ['Ocean View', 'Balcony', 'Pool', 'Fitness Center', 'Private Beach Access'],
        contactPhone: users[0].phone
      },
      {
        owner: landlordId,
        title: 'Mountain Cabin Retreat',
        description: 'Cozy cabin nestled in the mountains with a wood-burning fireplace, cedar deck, and panoramic views of the forest.',
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1505692794400-3ddc4c157516?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        ],
        address: '321 Pine Ridge Rd',
        city: 'Denver',
        price: 2200,
        listingType: 'Rent',
        propertyType: 'House',
        bedrooms: 3,
        bathrooms: 2,
        size: 1600,
        amenities: ['Fireplace', 'Hot Tub', 'Hiking Trails', 'Mountain Views', 'Outdoor Grill'],
        contactPhone: users[0].phone
      },
      {
        owner: agentId,
        title: 'Urban Studio with Skyline View',
        description: 'Compact studio steps from the best restaurants and nightlife, featuring floor-to-ceiling windows with sweeping city views.',
        images: [
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80'
        ],
        address: '210 Skyline Ave, Apt 15C',
        city: 'Chicago',
        price: 1850,
        listingType: 'Rent',
        propertyType: 'Apartment',
        bedrooms: 1,
        bathrooms: 1,
        size: 550,
        amenities: ['City View', 'Pet Friendly', 'Gym Access', 'Washer/Dryer', 'Rooftop Terrace'],
        contactPhone: users[1].phone
      }
    ]);

    // Create Mock Messages
    await Message.insertMany([
      {
        sender: users[2]._id,
        receiver: landlordId,
        property: properties[1]._id,
        message: 'Hi John, I love your family home listing. Can I schedule a visit this weekend?',
        contactPhone: users[2].phone,
        contactEmail: users[2].email,
      },
      {
        sender: agentId,
        receiver: landlordId,
        property: properties[1]._id,
        message: 'Hey John, I have a client looking for a family home. Can we discuss pricing?',
        contactPhone: users[1].phone,
        contactEmail: users[1].email,
      },
      {
        sender: landlordId,
        receiver: users[2]._id,
        property: properties[1]._id,
        message: 'Thanks for reaching out Jane. Please send me your availability for a tour.',
        contactPhone: users[0].phone,
        contactEmail: users[0].email,
      },
    ]);

    console.log('Database successfully seeded with mock data!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();
