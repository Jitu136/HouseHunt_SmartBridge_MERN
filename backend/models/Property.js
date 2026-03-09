const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String], // Array of image URLs
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    listingType: {
      type: String,
      enum: ['Rent', 'Sale'],
      required: true,
    },
    propertyType: {
      type: String,
      enum: ['Apartment', 'Villa', 'House', 'PG'],
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    size: {
      type: Number, // In sq.ft or sq.m
      required: true,
    },
    amenities: {
      type: [String], // e.g., Parking, WiFi, Furnished
      default: [],
    },
    contactPhone: {
      type: String,
      required: true,
    },
    contactEmail: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model('Property', propertySchema);
module.exports = Property;
