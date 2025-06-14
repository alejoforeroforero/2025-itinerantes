# 2025 Itinerantes

A comprehensive e-commerce platform for managing store services and products, built with modern web technologies. This full-stack application provides store management capabilities, user authentication, payment processing, and a rich content management system.

## ✨ Features

- **Store Management**: Complete product catalog with categories, inventory, and pricing
- **User Authentication**: Secure login/registration with NextAuth.js
- **Payment Processing**: Integrated PayPal payment gateway
- **Content Management**: Rich text editor for product descriptions and content
- **Image Management**: Cloudinary integration for optimized image storage
- **Admin Dashboard**: Comprehensive admin panel for store management
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Dynamic state management with Zustand
- **Type Safety**: Full TypeScript implementation

## 🛠 Tech Stack

- **Framework**: Next.js 15.3.1
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Yup
- **Payment Processing**: PayPal
- **Rich Text Editor**: Lexical
- **Image Management**: Cloudinary
- **Deployment**: Docker

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.17 or later) - [Download here](https://nodejs.org/)
- **Docker & Docker Compose** - [Download here](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download here](https://git-scm.com/)

You'll also need accounts for:
- **Cloudinary** - [Sign up here](https://cloudinary.com/)
- **PayPal Developer** - [Sign up here](https://developer.paypal.com/)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/2025-itinerantes.git
cd 2025-itinerantes
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.template .env
```

Update the `.env` file with your configuration:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5436/itinerantes-db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key"

# Admin Configuration
ALLOWED_EMAIL="admin@yourdomain.com"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# PayPal Configuration
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
PAYPAL_MODE="sandbox" # Use "live" for production

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Database Setup

Start the PostgreSQL database with Docker:

```bash
docker compose up -d postgres
```

Generate Prisma client and push schema:

```bash
npm run prisma:generate
npm run prisma:push
```

Seed the database with initial data:

```bash
npm run prisma:seed
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 🐳 Docker Deployment

### Development with Docker

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

### Production Deployment

```bash
# Build production image
docker build -t itinerantes-app .

# Run with production environment
docker compose -f compose.prod.yml up -d
```

## 📁 Project Structure

```
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable UI components
│   ├── lib/             # Utility functions and configurations
│   ├── hooks/           # Custom React hooks
│   ├── store/           # Zustand state management
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Helper functions
├── prisma/
│   ├── schema.prisma    # Database schema
│   ├── migrations/      # Database migrations
│   └── seed.ts         # Database seeding script
├── public/              # Static assets
├── compose.yaml         # Docker Compose configuration
├── Dockerfile          # Docker build configuration
└── tailwind.config.js  # Tailwind CSS configuration
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build application for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint code analysis |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:push` | Push schema changes to database |
| `npm run prisma:seed` | Seed database with initial data |
| `npm run prisma:studio` | Open Prisma Studio database GUI |
| `npm run prisma:reset` | Reset database and re-seed |

## 🔐 Authentication & Authorization

The application uses NextAuth.js for authentication with the following features:

- **Email/Password authentication**
- **OAuth providers** (configurable)
- **Role-based access control**
- **Admin dashboard protection**

### Admin Access

Set the `ALLOWED_EMAIL` environment variable to your email address to gain admin access to the dashboard.

## 💾 Database Management

### Viewing Data

Access Prisma Studio for a visual database interface:

```bash
npm run prisma:studio
```

### Schema Changes

1. Modify `prisma/schema.prisma`
2. Generate migration:
   ```bash
   npx prisma migrate dev --name your-migration-name
   ```
3. Apply changes:
   ```bash
   npm run prisma:push
   ```

### Database Reset

To reset the database and re-seed:

```bash
npm run prisma:reset
```

## 🎨 Styling

The project uses Tailwind CSS for styling:

- **Responsive design** with mobile-first approach
- **Custom components** in `src/components/ui/`
- **Dark mode support** (if configured)
- **Custom color palette** defined in `tailwind.config.js`

## 🔄 State Management

Zustand is used for client-side state management:

- **Store definitions** in `src/store/`
- **Persistent storage** for cart and user preferences
- **Type-safe** state with TypeScript

## 📸 Image Management

Cloudinary integration provides:

- **Automatic image optimization**
- **Responsive image delivery**
- **Upload widget integration**
- **Transformation capabilities**

## 💳 Payment Integration

PayPal integration includes:

- **Sandbox and live environments**
- **Secure payment processing**
- **Order tracking**
- **Webhook handling**

## 🚨 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check if PostgreSQL is running
docker compose ps

# Restart database service
docker compose restart postgres
```

**Environment Variables Not Loading**
- Ensure `.env` file is in the root directory
- Restart the development server after changes
- Check for typos in variable names

**Prisma Client Issues**
```bash
# Regenerate Prisma client
npm run prisma:generate

# Reset database if needed
npm run prisma:reset
```

**Port Already in Use**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📝 API Documentation

The application provides REST API endpoints:

- **Products**: `/api/products`
- **Orders**: `/api/orders`
- **Users**: `/api/users`
- **Payments**: `/api/payments`

For detailed API documentation, visit `/api/docs` when running the application.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search [existing issues](https://github.com/your-username/2025-itinerantes/issues)
3. Create a [new issue](https://github.com/your-username/2025-itinerantes/issues/new)

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

---

Made with ❤️ by the Alejandro Forero 