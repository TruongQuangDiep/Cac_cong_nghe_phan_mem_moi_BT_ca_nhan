// src/models/index.js
import mongoose from 'mongoose';
import User from './user.js'; // Nhớ đuôi .js
import Product from './product.js';

const db = {};
db.mongoose = mongoose;
db.User = User;
db.Product = Product;

export default db;
