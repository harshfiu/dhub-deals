import { Deal } from "@/types/deal";

export const DEALS: Deal[] = [
  {
    id: "1",
    title: "20% Off All Orders",
    discountType: "percentage",
    discountValue: "20% Off",
    description:
      "Get 20% off your entire order — dine in, takeaway, or delivery. No minimum spend required.",
    terms: "Valid once per customer per day. Cannot be combined with other offers.",
    startDate: "2026-03-15",
    endDate: "2026-03-25",
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
    restaurant: {
      name: "Burger Republic",
      logoUrl:
        "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=80&q=80",
      address: "142 West 36th St, New York, NY 10018",
      phone: "+1 (212) 555-0192",
      websiteUrl: "https://example.com/burgerrepublic",
      cuisineTag: "Burgers",
      rating: 4.7,
    },
  },
  {
    id: "2",
    title: "Buy 1 Get 1 Free Pizza",
    discountType: "bogo",
    discountValue: "Buy 1 Get 1",
    description:
      "Order any large pizza and get a second one of equal or lesser value absolutely free.",
    terms: "Valid on large pizzas only. Dine-in and takeaway. Weekdays only.",
    startDate: "2026-03-18",
    endDate: "2026-03-28",
    imageUrl:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
    restaurant: {
      name: "Napoli Pizzeria",
      logoUrl:
        "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=80&q=80",
      address: "58 Mulberry St, New York, NY 10013",
      phone: "+1 (212) 555-0847",
      cuisineTag: "Pizza",
      rating: 4.5,
    },
  },
  {
    id: "3",
    title: "$5 Off Orders Above $30",
    discountType: "flat",
    discountValue: "$5 Off",
    description:
      "Spend $30 or more and save $5 instantly. Great for family orders and group lunches.",
    terms: "Minimum spend $30. Valid for dine-in, takeaway, and online orders.",
    startDate: "2026-03-10",
    endDate: "2026-03-31",
    imageUrl:
      "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80",
    restaurant: {
      name: "The Sushi Garden",
      logoUrl:
        "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=80&q=80",
      address: "301 Park Ave, New York, NY 10022",
      phone: "+1 (212) 555-0374",
      websiteUrl: "https://example.com/sushigarden",
      cuisineTag: "Sushi",
      rating: 4.8,
    },
  },
  {
    id: "4",
    title: "Free Dessert with Any Main",
    discountType: "bogo",
    discountValue: "Free Dessert",
    description:
      "Order any main course and choose a complimentary dessert from our menu — on the house!",
    terms: "One dessert per main course ordered. Dine-in only.",
    startDate: "2026-03-19",
    endDate: "2026-03-22",
    imageUrl:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80",
    restaurant: {
      name: "Café Lumière",
      logoUrl:
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=80&q=80",
      address: "77 Columbus Ave, New York, NY 10023",
      phone: "+1 (212) 555-0921",
      cuisineTag: "Café & Desserts",
      rating: 4.6,
    },
  },
  {
    id: "5",
    title: "25% Off Tacos & Burritos",
    discountType: "percentage",
    discountValue: "25% Off",
    description:
      "Enjoy a quarter off all tacos and burritos. Perfect for taco Tuesdays or any day, honestly.",
    terms: "Valid on tacos and burritos only. Not valid with combo meals.",
    startDate: "2026-03-17",
    endDate: "2026-03-24",
    imageUrl:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80",
    restaurant: {
      name: "Los Compadres",
      logoUrl:
        "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=80&q=80",
      address: "220 E 14th St, New York, NY 10003",
      phone: "+1 (212) 555-0653",
      websiteUrl: "https://example.com/loscompadres",
      cuisineTag: "Mexican",
      rating: 4.4,
    },
  },
  {
    id: "6",
    title: "Lunch Special — 15% Off",
    discountType: "percentage",
    discountValue: "15% Off",
    description:
      "Beat the rush with our lunch special. 15% off everything on the menu from 11am–3pm.",
    terms: "Valid Monday to Friday, 11am–3pm only.",
    startDate: "2026-03-01",
    endDate: "2026-03-31",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    restaurant: {
      name: "The Garden Bistro",
      logoUrl:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=80&q=80",
      address: "88 Spring St, New York, NY 10012",
      phone: "+1 (212) 555-0418",
      cuisineTag: "American",
      rating: 4.3,
    },
  },
];
