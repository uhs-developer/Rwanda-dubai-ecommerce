export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[]; // Multiple images for product gallery
  category: string;
  subcategory: string;
  rating: number;
  reviews: number;
  description: string;
  specifications: Record<string, string>;
  inStock: boolean;
  brand: string;
  tags: string[];
  features?: string[];
}

export interface Category {
  id: string;
  name: string;
  image: string;
  subcategories: string[];
  parentId?: string;
}

export const categories: Category[] = [
  {
    id: "electronics",
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300",
    subcategories: ["Smartphones", "Laptops", "Tablets", "Audio", "Cameras", "Gaming"]
  },
  {
    id: "auto-parts",
    name: "Auto Parts",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300",
    subcategories: ["Toyota", "Honda", "Hyundai", "BMW", "Mercedes", "Nissan"]
  },
  {
    id: "home-appliances",
    name: "Home Appliances",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300",
    subcategories: ["Kitchen", "Laundry", "Air Conditioning", "Small Appliances"]
  },
  {
    id: "tools",
    name: "Tools & Equipment",
    image: "https://images.unsplash.com/photo-1530209625688-2b0cc4c4a05b?w=400&h=300",
    subcategories: ["Hand Tools", "Power Tools", "Measuring", "Safety Equipment"]
  }
];

export const products: Product[] = [
  // Apple Products
  {
    id: "1",
    name: "iPhone 15 Pro Max 256GB",
    price: 1299,
    originalPrice: 1399,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800",
      "https://images.unsplash.com/photo-1678685147647-6f97dc0eed81?w=800&h=800"
    ],
    category: "electronics",
    subcategory: "Smartphones",
    rating: 4.8,
    reviews: 2156,
    description: "The most advanced iPhone ever with titanium design, A17 Pro chip, and revolutionary camera system. Experience the future of mobile technology.",
    specifications: {
      "Display": "6.7-inch Super Retina XDR",
      "Storage": "256GB",
      "Camera": "48MP Main, 12MP Ultra Wide, 12MP Telephoto",
      "Battery": "Up to 29 hours video playback",
      "Chip": "A17 Pro",
      "Material": "Titanium"
    },
    inStock: true,
    brand: "Apple",
    tags: ["flagship", "premium", "5g", "camera"],
    features: ["Face ID", "MagSafe", "Wireless Charging", "Water Resistant"]
  },
  {
    id: "2",
    name: "MacBook Air M3 13-inch",
    price: 1099,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800"
    ],
    category: "electronics",
    subcategory: "Laptops",
    rating: 4.9,
    reviews: 1834,
    description: "Supercharged by the M3 chip, the MacBook Air is incredibly fast and efficient with all-day battery life.",
    specifications: {
      "Chip": "Apple M3 8-core CPU",
      "Memory": "8GB Unified Memory",
      "Storage": "256GB SSD",
      "Display": "13.6-inch Liquid Retina",
      "Battery": "Up to 18 hours",
      "Weight": "2.7 pounds"
    },
    inStock: true,
    brand: "Apple",
    tags: ["laptop", "m3", "ultralight", "productivity"],
    features: ["Touch ID", "MagSafe 3", "2x Thunderbolt", "1080p FaceTime HD camera"]
  },
  {
    id: "3",
    name: "iMac 24-inch M3",
    price: 1299,
    originalPrice: 1399,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400",
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800",
      "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&h=800"
    ],
    category: "electronics",
    subcategory: "Computers",
    rating: 4.7,
    reviews: 892,
    description: "Strikingly thin design powered by M3 chip. Perfect for creativity and productivity in vibrant colors.",
    specifications: {
      "Display": "24-inch 4.5K Retina",
      "Chip": "Apple M3",
      "Memory": "8GB",
      "Storage": "256GB SSD",
      "Camera": "1080p FaceTime HD",
      "Audio": "Six-speaker sound system"
    },
    inStock: true,
    brand: "Apple",
    tags: ["desktop", "all-in-one", "creative", "4k"],
    features: ["Touch ID", "Magic Keyboard", "Magic Mouse", "Studio-quality mics"]
  },

  // Hyundai Auto Parts
  {
    id: "4",
    name: "Hyundai Elantra Brake Pads Front",
    price: 89,
    originalPrice: 120,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400",
    images: [
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=800",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=800"
    ],
    category: "auto-parts",
    subcategory: "Hyundai",
    rating: 4.6,
    reviews: 456,
    description: "Premium ceramic brake pads designed specifically for Hyundai Elantra 2017-2024 models. Superior stopping power.",
    specifications: {
      "Material": "Ceramic",
      "Compatibility": "Hyundai Elantra 2017-2024",
      "Position": "Front",
      "Warranty": "2 years",
      "Part Number": "58101-F2A00"
    },
    inStock: true,
    brand: "Akebono",
    tags: ["brake-pads", "ceramic", "oem", "safety"],
    features: ["Low noise", "Low dust", "Extended wear", "Temperature resistant"]
  },
  {
    id: "5",
    name: "Hyundai Tucson Air Filter",
    price: 35,
    originalPrice: 45,
    image: "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400&h=400",
    category: "auto-parts",
    subcategory: "Hyundai",
    rating: 4.4,
    reviews: 328,
    description: "High-flow air filter for Hyundai Tucson 2016-2024. Improves engine performance and fuel efficiency.",
    specifications: {
      "Compatibility": "Hyundai Tucson 2016-2024",
      "Material": "High-flow paper",
      "Filtration": "99.5% efficiency",
      "Warranty": "1 year",
      "Part Number": "28113-D3300"
    },
    inStock: true,
    brand: "K&N",
    tags: ["air-filter", "performance", "oem", "efficiency"],
    features: ["Washable", "Reusable", "Increased airflow", "Better acceleration"]
  },

  // Samsung Electronics
  {
    id: "6",
    name: "Samsung Galaxy S24 Ultra",
    price: 1199,
    originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800"
    ],
    category: "electronics",
    subcategory: "Smartphones",
    rating: 4.7,
    reviews: 1567,
    description: "The ultimate Android experience with S Pen, advanced AI features, and pro-grade cameras.",
    specifications: {
      "Display": "6.8-inch Dynamic AMOLED 2X",
      "Storage": "256GB",
      "Camera": "200MP Main + 12MP Ultra Wide + 10MP Telephoto",
      "Battery": "5000mAh",
      "Processor": "Snapdragon 8 Gen 3",
      "RAM": "12GB"
    },
    inStock: true,
    brand: "Samsung",
    tags: ["android", "s-pen", "camera", "flagship"],
    features: ["S Pen included", "100x Zoom", "IP68", "Wireless charging"]
  },

  // Sony Audio
  {
    id: "7",
    name: "Sony WH-1000XM5 Headphones",
    price: 349,
    originalPrice: 399,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400",
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=800",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800"
    ],
    category: "electronics",
    subcategory: "Audio",
    rating: 4.9,
    reviews: 1456,
    description: "Industry-leading noise canceling with premium sound quality and all-day comfort.",
    specifications: {
      "Type": "Over-ear wireless",
      "Noise Canceling": "Active",
      "Battery Life": "30 hours",
      "Connectivity": "Bluetooth 5.2",
      "Weight": "250g",
      "Driver": "30mm"
    },
    inStock: true,
    brand: "Sony",
    tags: ["headphones", "noise-canceling", "wireless", "premium"],
    features: ["Multipoint connection", "Quick charge", "Touch controls", "Speak-to-chat"]
  },

  // More products for variety
  {
    id: "8",
    name: "iPad Pro 12.9-inch M2",
    price: 1099,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400",
    category: "electronics",
    subcategory: "Tablets",
    rating: 4.8,
    reviews: 892,
    description: "The ultimate iPad experience with M2 chip power and stunning Liquid Retina XDR display.",
    specifications: {
      "Display": "12.9-inch Liquid Retina XDR",
      "Chip": "Apple M2",
      "Storage": "128GB",
      "Camera": "12MP Wide, 10MP Ultra Wide",
      "Battery": "Up to 10 hours",
      "Connectivity": "Wi-Fi 6E, 5G"
    },
    inStock: true,
    brand: "Apple",
    tags: ["tablet", "professional", "m2", "creativity"],
    features: ["Apple Pencil support", "Magic Keyboard compatible", "Face ID", "USB-C"]
  },
  {
    id: "9",
    name: "Bosch Professional Drill GSB 18V",
    price: 159,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400",
    category: "tools",
    subcategory: "Power Tools",
    rating: 4.8,
    reviews: 645,
    description: "Professional 18V cordless drill with brushless motor and 2 batteries for maximum productivity.",
    specifications: {
      "Voltage": "18V",
      "Battery": "2 x 2.0Ah Li-ion",
      "Chuck": "13mm",
      "Torque": "65 Nm",
      "Weight": "1.7 kg",
      "Speed": "0-500/1600 rpm"
    },
    inStock: true,
    brand: "Bosch",
    tags: ["drill", "professional", "cordless", "heavy-duty"],
    features: ["Brushless motor", "LED light", "Quick release chuck", "Belt clip"]
  },
  {
    id: "10",
    name: "LG OLED55C3 55-inch TV",
    price: 1399,
    originalPrice: 1599,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400",
    category: "electronics",
    subcategory: "TVs",
    rating: 4.9,
    reviews: 1234,
    description: "Stunning OLED display with perfect blacks and infinite contrast. Smart TV with webOS platform.",
    specifications: {
      "Screen Size": "55 inches",
      "Resolution": "4K UHD (3840 x 2160)",
      "HDR": "Dolby Vision, HDR10",
      "Smart TV": "webOS 23",
      "Connectivity": "4 HDMI, 3 USB",
      "Audio": "40W 2.2ch"
    },
    inStock: true,
    brand: "LG",
    tags: ["oled", "4k", "smart-tv", "gaming"],
    features: ["Perfect blacks", "120Hz", "Gaming mode", "Magic Remote"]
  }
];

// Category-specific product collections
export const appleProducts = products.filter(p => p.brand === "Apple");
export const hyundaiParts = products.filter(p => p.subcategory === "Hyundai");
export const samsungProducts = products.filter(p => p.brand === "Samsung");
export const audioProducts = products.filter(p => p.subcategory === "Audio");

export const featuredProducts = products.slice(0, 6);
export const bestSellers = products.slice(2, 8);
export const newArrivals = products.slice(1, 7);

// Filter options for product listing
export const filterOptions = {
  brands: Array.from(new Set(products.map(p => p.brand))),
  priceRanges: [
    { label: "Under $100", min: 0, max: 100 },
    { label: "$100 - $500", min: 100, max: 500 },
    { label: "$500 - $1000", min: 500, max: 1000 },
    { label: "$1000+", min: 1000, max: Infinity }
  ],
  ratings: [5, 4, 3, 2, 1],
  availability: ["In Stock", "Out of Stock"]
};