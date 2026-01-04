# Wanderlust - Airbnb Clone

A full-stack vacation rental application built with Node.js, Express, and MongoDB Atlas. Users can browse listings, filter by category, view interactive maps, and manage their own properties.

## 🚀 Quick Start

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Edit .env with your credentials (MongoDB, Cloudinary)
nano .env

# 3. Install & run
npm install
npm start
```

Visit `http://localhost:3006`

**For complete setup & deployment guide:** See [SETUP_AND_DEPLOYMENT.md](SETUP_AND_DEPLOYMENT.md)

---

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure signup/login using Passport.js with local strategy
- **Property Listings**: Browse and search vacation rental properties
- **Category Filtering**: Filter listings by categories (Beach, Mountains, Pools, Camping, Farms, Arctic, Castles, Rooms, Iconic Cities, Trending)
- **Interactive Maps**: View property locations on Leaflet maps with OpenStreetMap tiles
- **Geocoding**: Automatic location-to-coordinates conversion using Nominatim API
- **Price Display**: Toggle to show prices with 15% tax included
- **Image Upload**: Upload property images using Cloudinary
- **Reviews System**: Users can leave and view reviews on listings
- **Session Management**: MongoDB-backed session storage with express-session

### User Features
- User profiles and authentication
- Create, read, update, and delete (CRUD) listings
- Post and manage reviews
- Persistent login sessions

## 🛠️ Tech Stack

### Backend
- **Express.js** - Web application framework
- **Node.js** - JavaScript runtime (>=14.0.0)
- **Mongoose** - MongoDB object modeling
- **MongoDB Atlas** - Cloud database
- **Passport.js** - Authentication middleware

### Frontend
- **EJS** - Templating engine
- **Bootstrap 5.3.8** - CSS framework
- **Font Awesome 7.0.1** - Icon library
- **Leaflet.js 1.9.4** - Interactive maps
- **Nominatim API** - Free geocoding service

### Additional Libraries
- **connect-mongo** - MongoDB session store
- **multer** - File upload middleware
- **multer-storage-cloudinary** - Cloudinary storage integration
- **joi** - Data validation
- **dotenv** - Environment variable management
- **express-session** - Session management
- **connect-flash** - Flash messages
- **method-override** - HTTP method override

## 📁 Project Structure

```
MAJORPROJECT/
├── app.js                 # Main Express server
├── middleware.js          # Custom middleware functions
├── schema.js             # Joi validation schemas
├── package.json          # Project dependencies
├── .env                  # Environment variables (not in repo)
│
├── config/
│   └── cloudinary.js     # Cloudinary configuration
│
├── models/
│   ├── listing.js        # Listing schema with category & location
│   ├── review.js         # Review schema
│   └── user.js           # User schema with Passport authentication
│
├── controllers/
│   ├── listing.js        # Listing route handlers
│   ├── review.js         # Review route handlers
│   └── user.js           # User authentication handlers
│
├── routes/
│   ├── listing.js        # Listing routes
│   ├── review.js         # Review routes
│   └── user.js           # User authentication routes
│
├── views/
│   ├── layouts/
│   │   └── boilerplate.ejs   # Main layout template
│   ├── includes/
│   │   ├── navbar.ejs        # Navigation bar
│   │   ├── footer.ejs        # Footer
│   │   └── flash.ejs         # Flash message display
│   ├── listings/
│   │   ├── index.ejs         # List all listings with filters
│   │   ├── new.ejs           # Create new listing
│   │   ├── edit.ejs          # Edit listing
│   │   └── show.ejs          # View listing details
│   └── users/
│       ├── signup.ejs        # User registration
│       └── login.ejs         # User login
│
├── public/
│   ├── css/
│   │   └── style.css         # Custom styles
│   └── js/
│       └── script.js         # Client-side interactions
│
└── utils/
    ├── ExpressError.js       # Custom error class
    └── wrapAsync.js          # Async error wrapper
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js >= 14.0.0
- npm or yarn
- MongoDB Atlas account
- Cloudinary account

### 1. Clone and Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
ATLAS_DB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
```

### 3. Start the Application
```bash
npm start
# or with nodemon for development
npx nodemon app.js
```

The application will be available at `http://localhost:3006`

##  Database Schema

### User Model
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (encrypted),
  createdAt: Date
}
```

### Listing Model
```javascript
{
  title: String,
  description: String,
  image: Object (Cloudinary),
  price: Number,
  location: String,
  country: String,
  category: String (enum),
  geometry: GeoJSON Point,
  owner: ObjectId (User reference),
  reviews: [ObjectId] (Review references),
  createdAt: Date
}
```

### Review Model
```javascript
{
  comment: String,
  rating: Number,
  author: ObjectId (User reference),
  listing: ObjectId (Listing reference),
  createdAt: Date
}
```

## 🗺️ Key Features Explained

### Category Filtering
Listings are categorized for easy filtering. Click category buttons on the listings page to filter by:
- Beach, Mountains, Pools, Camping, Farms, Arctic, Castles, Rooms, Iconic Cities, Trending

### Price Tax Toggle
Toggle button on listings page displays prices with 15% tax included when activated. Preference is saved to browser's localStorage.

### Map Integration
Each listing displays an interactive map showing the property location using:
- **Leaflet.js** - Interactive mapping library
- **OpenStreetMap** - Free map tiles
- **Nominatim API** - Free geocoding (address to coordinates)

### Session Management
Sessions are stored in MongoDB Atlas using connect-mongo, ensuring users remain logged in across server restarts.

## 🔐 Security Features

- Password encryption using Passport.js local strategy
- Session-based authentication
- CSRF protection with method-override
- Input validation with Joi schema
- Secure Cloudinary integration

## 📝 API Endpoints

### Listings
- `GET /listings` - Get all listings (with optional category filter)
- `GET /listings/new` - New listing form
- `POST /listings` - Create listing
- `GET /listings/:id` - View listing details
- `GET /listings/:id/edit` - Edit listing form
- `PATCH /listings/:id` - Update listing
- `DELETE /listings/:id` - Delete listing

### Reviews
- `POST /listings/:id/reviews` - Add review
- `DELETE /listings/:id/reviews/:reviewId` - Delete review

### Users
- `GET /signup` - Signup form
- `POST /signup` - Register user
- `GET /login` - Login form
- `POST /login` - Authenticate user
- `GET /logout` - Logout user

## 🚀 Deployment

For production deployment:
1. Set environment variables on the hosting platform
2. Ensure MongoDB Atlas connection string is secure
3. Configure Cloudinary credentials
4. Update the redirect URL in the application (port 3006 → production domain)

## 📦 Dependencies

See `package.json` for complete list. Key packages:
- express (4.21.2)
- mongoose (9.0.2)
- passport.js (0.7.0)
- ejs (3.1.10)
- bootstrap (5.3.8)
- leaflet (1.9.4)

## 🎨 Styling

The application uses:
- Bootstrap 5.3.8 for responsive layout
- Custom CSS in `public/css/style.css`
- Font Awesome 7.0.1 for icons
- Pink accent color (#FF385C) for interactive elements

## 📚 Documentation

- Model definitions: `/models`
- Route handlers: `/controllers`
- API routes: `/routes`
- Frontend templates: `/views`
- Styles: `/public/css/style.css`
- Client-side logic: `/public/js/script.js`

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify `ATLAS_DB_URL` in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure database user has appropriate permissions

### Cloudinary Upload Fails
- Verify Cloudinary credentials in `.env`
- Check file size limits
- Ensure correct folder structure in Cloudinary

### Map Not Displaying
- Check browser console for errors
- Verify Nominatim API is accessible
- Ensure listing has valid location data

## 📄 License

ISC License

## 👨‍💻 Author

Anji

---

**Version:** 1.0.0  
**Last Updated:** January 2026
