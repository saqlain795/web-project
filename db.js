const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "data", "dairyfarm.json");

// ============ DEFAULT / SEED DATA ============

const defaultData = {
  products: [
    { id: 1, name: "Fresh Farm Milk", price: 250, unit: "Liter", category: "DAIRY" },
    { id: 2, name: "Pure Farm Butter", price: 3000, unit: "1kg", category: "DAIRY" },
    { id: 3, name: "Fresh Farm Cheese", price: 2500, unit: "1kg", category: "DAIRY" },
  ],
  animals: [
    { id: 1, type: "cow", name: "Healthy Dairy Cow", age: "3 Years", milk_production: "12 Liter/day", price: 250000, status: "AVAILABLE" },
    { id: 2, type: "cow", name: "Premium Dairy Cow", age: "4 Years", milk_production: "15 Liter/day", price: 320000, status: "AVAILABLE" },
    { id: 3, type: "cow", name: "Healthy Brown Cow", age: "3.5 Years", milk_production: "10 Liter/day", price: 450000, status: "AVAILABLE" },
    { id: 4, type: "buffalo", name: "Premium Male Buffalo", age: "4 Years", milk_production: null, price: 350000, status: "AVAILABLE" },
    { id: 5, type: "buffalo", name: "Healthy Buffalo", age: "3 Years", milk_production: "10 Liter/day", price: 300000, status: "AVAILABLE" },
  ],
  orders: [],
  animal_inquiries: [],
  contact_messages: [],
  _nextIds: { orders: 1, animal_inquiries: 1, contact_messages: 1 },
};

// ============ LOAD / SAVE ============

function ensureDataFile() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
  }
}

function load() {
  ensureDataFile();
  const raw = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(raw);
}

function save(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ============ PUBLIC API ============

function getProducts() {
  return load().products;
}

function getAnimals(type) {
  const animals = load().animals;
  return type ? animals.filter((a) => a.type === type) : animals;
}

function createOrder({ customerName, phone, address, paymentMethod, items }) {
  const data = load();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderId = data._nextIds.orders++;

  const order = {
    id: orderId,
    customer_name: customerName,
    phone,
    address,
    payment_method: paymentMethod,
    total,
    status: "PENDING",
    created_at: new Date().toISOString(),
    items: items.map((item) => ({
      product_name: item.name,
      price: item.price,
      unit: item.unit,
      quantity: item.quantity,
    })),
  };

  data.orders.unshift(order);
  save(data);

  return { orderId, total };
}

function getOrders() {
  return load().orders;
}

function updateOrderStatus(id, status) {
  const data = load();
  const order = data.orders.find((o) => o.id === Number(id));
  if (!order) return false;
  order.status = status;
  save(data);
  return true;
}

function createAnimalInquiry({ animalName, animalPrice, customerName, phone, message }) {
  const data = load();
  const inquiryId = data._nextIds.animal_inquiries++;

  const inquiry = {
    id: inquiryId,
    animal_name: animalName,
    animal_price: animalPrice,
    customer_name: customerName,
    phone,
    message,
    status: "NEW",
    created_at: new Date().toISOString(),
  };

  data.animal_inquiries.unshift(inquiry);
  save(data);

  return inquiryId;
}

function getAnimalInquiries() {
  return load().animal_inquiries;
}

function createContactMessage({ name, phone, message }) {
  const data = load();
  const messageId = data._nextIds.contact_messages++;

  const entry = {
    id: messageId,
    name,
    phone,
    message,
    status: "NEW",
    created_at: new Date().toISOString(),
  };

  data.contact_messages.unshift(entry);
  save(data);

  return messageId;
}

function getContactMessages() {
  return load().contact_messages;
}

module.exports = {
  getProducts,
  getAnimals,
  createOrder,
  getOrders,
  updateOrderStatus,
  createAnimalInquiry,
  getAnimalInquiries,
  createContactMessage,
  getContactMessages,
};
