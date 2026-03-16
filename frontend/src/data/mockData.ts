  import { Book, User, Order } from '../types';

  export const mockBooks: Book[] = [
    {
      id: '1',
      title: 'The Midnight Library',
      author: 'Matt Haig',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1764337500043-e9171c903617?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXJzJTIwZmljdGlvbnxlbnwxfHx8fDE3NjU2MzY0MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'A dazzling novel about all the choices that go into a life well lived. Between life and death there is a library, and within that library, the shelves go on forever.',
      category: 'Fiction',
      stock: 45,
      rating: 4.5,
      reviews: [
        {
          id: 'r1',
          userId: '2',
          userName: 'Sarah Johnson',
          rating: 5,
          comment: 'Absolutely beautiful and thought-provoking! A must-read.',
          date: '2025-11-15'
        },
        {
          id: 'r2',
          userId: '3',
          userName: 'Mike Chen',
          rating: 4,
          comment: 'Very engaging story with deep philosophical themes.',
          date: '2025-11-20'
        }
      ],
      publishedDate: '2025-10-01'
    },
    {
      id: '2',
      title: 'Atomic Habits',
      author: 'James Clear',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1598301257982-0cf014dabbcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGJvb2tzfGVufDF8fHx8MTc2NTYzNjQzMnww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'An easy and proven way to build good habits and break bad ones. Transform your life with tiny changes that deliver remarkable results.',
      category: 'Self-Help',
      stock: 30,
      rating: 4.8,
      reviews: [
        {
          id: 'r3',
          userId: '3',
          userName: 'Mike Chen',
          rating: 5,
          comment: 'Life-changing book! Highly practical and actionable.',
          date: '2025-10-25'
        }
      ],
      publishedDate: '2025-09-15'
    },
    {
      id: '3',
      title: 'A Brief History of Time',
      author: 'Stephen Hawking',
      price: 19.99,
      image: 'https://images.unsplash.com/photo-1642428668784-43cdfca2813e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwYm9va3N8ZW58MXx8fHwxNzY1NjM2NDMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'From the Big Bang to black holes, explore the universe with one of the greatest minds of our time.',
      category: 'Science',
      stock: 20,
      rating: 4.6,
      reviews: [],
      publishedDate: '2025-08-10'
    },
    {
      id: '4',
      title: 'The Silent Patient',
      author: 'Alex Michaelides',
      price: 22.99,
      image: 'https://images.unsplash.com/photo-1574671992738-e1a462d1ec7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxteXN0ZXJ5JTIwbm92ZWx8ZW58MXx8fHwxNzY1NTQ4NzQwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'A shocking psychological thriller about a woman who shoots her husband and then never speaks another word.',
      category: 'Mystery',
      stock: 35,
      rating: 4.4,
      reviews: [
        {
          id: 'r4',
          userId: '2',
          userName: 'Sarah Johnson',
          rating: 4,
          comment: 'Gripping thriller with an unexpected twist!',
          date: '2025-11-05'
        }
      ],
      publishedDate: '2025-11-01'
    },
    {
      id: '5',
      title: 'The Name of the Wind',
      author: 'Patrick Rothfuss',
      price: 27.99,
      image: 'https://images.unsplash.com/photo-1614544048536-0d28caf77f41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwYm9va3N8ZW58MXx8fHwxNzY1NjM2NDMzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'The tale of Kvothe, a legendary figure in a world of magic and adventure. A beautifully written epic fantasy.',
      category: 'Fantasy',
      stock: 25,
      rating: 4.7,
      reviews: [
        {
          id: 'r5',
          userId: '3',
          userName: 'Mike Chen',
          rating: 5,
          comment: 'Best fantasy book I have ever read. The prose is poetry!',
          date: '2025-10-30'
        },
        {
          id: 'r6',
          userId: '2',
          userName: 'Sarah Johnson',
          rating: 5,
          comment: 'Cannot wait for the third book. Absolutely magical!',
          date: '2025-11-12'
        }
      ],
      publishedDate: '2025-11-20'
    },
    {
      id: '6',
      title: 'Educated',
      author: 'Tara Westover',
      price: 26.99,
      image: 'https://images.unsplash.com/photo-1764337500043-e9171c903617?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXJzJTIwZmljdGlvbnxlbnwxfHx8fDE3NjU2MzY0MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'A memoir about a young woman who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.',
      category: 'Biography',
      stock: 18,
      rating: 4.9,
      reviews: [],
      publishedDate: '2025-09-20'
    },
    {
      id: '7',
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      price: 28.99,
      image: 'https://images.unsplash.com/photo-1642428668784-43cdfca2813e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwYm9va3N8ZW58MXx8fHwxNzY1NjM2NDMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'A brief history of humankind from the Stone Age to the modern age. Explores how Homo sapiens came to dominate the world.',
      category: 'History',
      stock: 40,
      rating: 4.6,
      reviews: [
        {
          id: 'r7',
          userId: '2',
          userName: 'Sarah Johnson',
          rating: 5,
          comment: 'Mind-blowing perspective on human history!',
          date: '2025-10-18'
        }
      ],
      publishedDate: '2025-11-25'
    },
    {
      id: '8',
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      price: 25.99,
      image: 'https://images.unsplash.com/photo-1642428668784-43cdfca2813e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwYm9va3N8ZW58MXx8fHwxNzY1NjM2NDMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'A lone astronaut must save the earth from disaster in this incredible new science-based thriller from the author of The Martian.',
      category: 'Science Fiction',
      stock: 50,
      rating: 4.8,
      reviews: [],
      publishedDate: '2025-12-01'
    }
  ];

  export const mockUsers: User[] = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@bookstore.com',
      password: 'admin123',
      isAdmin: true,
      address: '123 Admin Street, City',
      phone: '+1234567890'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      password: 'user123',
      isAdmin: false,
      address: '456 User Avenue, Town',
      phone: '+1234567891'
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@example.com',
      password: 'user123',
      isAdmin: false,
      address: '789 Reader Lane, Village',
      phone: '+1234567892'
    }
  ];

  export const mockOrders: Order[] = [
    {
      id: 'ORD001',
      userId: '2',
      items: [
        { book: mockBooks[0], quantity: 1 },
        { book: mockBooks[1], quantity: 2 }
      ],
      total: 84.97,
      deliveryAddress: '456 User Avenue, Town',
      paymentMethod: 'eSewa',
      status: 'delivered',
      date: '2025-11-10'
    },
    {
      id: 'ORD002',
      userId: '3',
      items: [
        { book: mockBooks[4], quantity: 1 }
      ],
      total: 27.99,
      deliveryAddress: '789 Reader Lane, Village',
      paymentMethod: 'COD',
      status: 'shipped',
      date: '2025-12-01'
    }
  ];
