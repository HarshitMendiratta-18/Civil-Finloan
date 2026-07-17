import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// In-memory database loaded from data.json
let db = {
  allservices: [],
  members: []
};

// Helper to load db
const loadDb = () => {
  try {
    const dataPath = path.join(__dirname, '../data.json');
    if (fs.existsSync(dataPath)) {
      const content = fs.readFileSync(dataPath, 'utf8');
      db = JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading data.json:", err);
  }
};

// Load initial data
loadDb();

// Add missing IDs to services if not present
db.allservices = db.allservices.map((service, index) => {
  return {
    id: index + 1,
    ...service
  };
});

// Auth Routes
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = db.members.find(m => 
    ((m.userID && m.userID.toLowerCase() === email.toLowerCase()) || 
     (m.user && m.user.toLowerCase() === email.toLowerCase())) && 
    m.password === password
  );

  if (user) {
    const normalizedUser = {
      id: user.id,
      userID: user.userID || user.user,
      fullName: user.fullName || "",
      mobile: user.mobile,
      password: user.password,
      role: user.userID === 'admin' ? 'ADMIN' : 'USER'
    };
    res.json({
      user: normalizedUser,
      token: 'mock-jwt-token-for-' + normalizedUser.userID
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/v1/auth/register', (req, res) => {
  const { fullName, email, mobile, password } = req.body;
  
  const exists = db.members.find(m => 
    (m.userID && m.userID.toLowerCase() === email.toLowerCase()) ||
    (m.user && m.user.toLowerCase() === email.toLowerCase())
  );

  if (exists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newMember = {
    userID: email,
    fullName: fullName || "",
    mobile: Number(mobile),
    password: password,
    id: db.members.length + 1
  };

  db.members.push(newMember);
  
  try {
    fs.writeFileSync(path.join(__dirname, '../data.json'), JSON.stringify(db, null, 2));
  } catch (e) {
    console.log("Could not write to data.json (normal in serverless)");
  }

  res.status(201).json({
    user: newMember,
    token: 'mock-jwt-token-for-' + newMember.userID
  });
});

app.put('/api/v1/auth/update', (req, res) => {
  const { id, fullName, mobile, password } = req.body;
  const userIndex = db.members.findIndex(m => m.id === id);

  if (userIndex !== -1) {
    db.members[userIndex].fullName = fullName;
    db.members[userIndex].mobile = Number(mobile);
    if (password) {
      db.members[userIndex].password = password;
    }

    try {
      fs.writeFileSync(path.join(__dirname, '../data.json'), JSON.stringify(db, null, 2));
    } catch (e) {
      console.log("Could not write to data.json");
    }

    const updatedUser = {
      id: db.members[userIndex].id,
      userID: db.members[userIndex].userID || db.members[userIndex].user,
      fullName: db.members[userIndex].fullName,
      mobile: db.members[userIndex].mobile,
      password: db.members[userIndex].password,
      role: db.members[userIndex].userID === 'admin' ? 'ADMIN' : 'USER'
    };

    res.json({
      user: updatedUser,
      token: 'mock-jwt-token-for-' + updatedUser.userID
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Services Routes
app.get('/api/v1/services', (req, res) => {
  res.json(db.allservices);
});

app.post('/api/v1/services', (req, res) => {
  const { type, code, description, imgUrl } = req.body;
  const newService = {
    id: db.allservices.length + 1,
    type,
    code,
    description,
    imgUrl: imgUrl || "",
    detail: []
  };

  db.allservices.push(newService);
  try {
    fs.writeFileSync(path.join(__dirname, '../data.json'), JSON.stringify(db, null, 2));
  } catch (e) {}

  res.status(201).json(newService);
});

app.post('/api/v1/services/:serviceId/detail', (req, res) => {
  const { serviceId } = req.params;
  const { type, min, max, tenure, rate } = req.body;

  const serviceIndex = db.allservices.findIndex(s => s.id === Number(serviceId));
  if (serviceIndex !== -1) {
    const newDetail = {
      id: db.allservices[serviceIndex].detail.length + 1,
      type,
      min: Number(min),
      max: Number(max),
      tenure: isNaN(Number(tenure)) ? tenure : Number(tenure),
      rate: Number(rate)
    };

    db.allservices[serviceIndex].detail.push(newDetail);
    try {
      fs.writeFileSync(path.join(__dirname, '../data.json'), JSON.stringify(db, null, 2));
    } catch (e) {}

    res.status(201).json(db.allservices[serviceIndex]);
  } else {
    res.status(404).json({ message: 'Service not found' });
  }
});

// Fallback for Vercel Serverless
app.use((req, res) => {
  res.status(404).json({ message: 'API Route Not Found' });
});

export default app;
