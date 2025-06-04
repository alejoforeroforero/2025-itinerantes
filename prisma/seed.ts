import { PrismaClient } from '@prisma/client';
import { slugify } from '../src/utils/slugify';

const prisma = new PrismaClient();

const productos = [
  {
    nombre: "Camiseta Básica Algodón",
    description: "Camiseta 100% algodón, cómoda y versátil para el día a día",
    inStock: 50,
    price: 25000,
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dCUyMHNoaXJ0fGVufDB8fDB8fHww"]
  },
  {
    nombre: "Jeans Slim Fit",
    description: "Jeans modernos con corte slim fit, perfectos para cualquier ocasión",
    inStock: 35,
    price: 45000,
    images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amVhbnN8ZW58MHx8MHx8fDA%3D"]
  },
  {
    nombre: "Zapatillas Deportivas",
    description: "Zapatillas cómodas para deporte y uso diario",
    inStock: 40,
    price: 65000,
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8fDA%3D"]
  },
  {
    nombre: "Chaqueta Denim",
    description: "Chaqueta de mezclilla clásica, perfecta para el clima templado",
    inStock: 25,
    price: 55000,
    images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amFja2V0fGVufDB8fDB8fHww"]
  },
  {
    nombre: "Reloj Elegante",
    description: "Reloj analógico con diseño minimalista y elegante",
    inStock: 15,
    price: 72000,
    images: ["https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2F0Y2h8ZW58MHx8MHx8fDA%3D"]
  },
  {
    nombre: "Bolso de Cuero",
    description: "Bolso de cuero genuino con diseño moderno",
    inStock: 20,
    price: 68000,
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFnfGVufDB8fDB8fHww"]
  },
  {
    nombre: "Gafas de Sol",
    description: "Gafas de sol con protección UV y diseño moderno",
    inStock: 30,
    price: 35000,
    images: ["https://images.unsplash.com/photo-1577803645773-f96470509666?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3VuZ2xhc3Nlc3xlbnwwfHwwfHx8MA%3D%3D"]
  },
  {
    nombre: "Cinturón de Cuero",
    description: "Cinturón de cuero genuino con hebilla metálica",
    inStock: 45,
    price: 15000,
    images: ["https://images.unsplash.com/photo-1624222247344-550fb60583f1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVsdHxlbnwwfHwwfHx8MA%3D%3D"]
  },
  {
    nombre: "Bufanda de Lana",
    description: "Bufanda de lana suave y abrigada",
    inStock: 40,
    price: 12000,
    images: ["https://images.unsplash.com/photo-1608256246200-53e376f7fd1a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2NhcmZ8ZW58MHx8MHx8fDA%3D"]
  },
  {
    nombre: "Gorra Casual",
    description: "Gorra ajustable con diseño moderno",
    inStock: 50,
    price: 8000,
    images: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FwfGVufDB8fDB8fHww"]
  },
  {
    nombre: "Pulsera de Plata",
    description: "Pulsera de plata 925 con diseño minimalista",
    inStock: 25,
    price: 28000,
    images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnJhY2VsZXR8ZW58MHx8MHx8fDA%3D"]
  },
  {
    nombre: "Cartera de Cuero",
    description: "Cartera de cuero con múltiples compartimentos",
    inStock: 30,
    price: 32000,
    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2FsbGV0fGVufDB8fDB8fHww"]
  },
  {
    nombre: "Paraguas Compacto",
    description: "Paraguas plegable resistente al viento",
    inStock: 35,
    price: 18000,
    images: ["https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dW1icmVsbGF8ZW58MHx8MHx8fDA%3D"]
  },
  {
    nombre: "Mochila Escolar",
    description: "Mochila resistente con múltiples compartimentos",
    inStock: 40,
    price: 42000,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFja3BhY2t8ZW58MHx8MHx8fDA%3D"]
  },
  {
    nombre: "Corbata de Seda",
    description: "Corbata de seda con diseño clásico",
    inStock: 20,
    price: 22000,
    images: ["https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGllfGVufDB8fDB8fHww"]
  },
  {
    nombre: "Calcetines de Algodón",
    description: "Pack de 3 pares de calcetines de algodón",
    inStock: 100,
    price: 5000,
    images: ["https://images.unsplash.com/photo-1586350977771-0508c3c2fbcb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c29ja3N8ZW58MHx8MHx8fDA%3D"]
  },
  {
    nombre: "Guantes de Cuero",
    description: "Guantes de cuero genuino para hombre",
    inStock: 25,
    price: 28000,
    images: ["https://images.unsplash.com/photo-1614975058789-41316d0e2cc9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2xvdmVzfGVufDB8fDB8fHww"]
  },
  {
    nombre: "Pendientes de Perla",
    description: "Pendientes con perlas naturales",
    inStock: 15,
    price: 45000,
    images: ["https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZWFycmluZ3N8ZW58MHx8MHx8fDA%3D"]
  },
  {
    nombre: "Collar de Oro",
    description: "Collar de oro 18k con diseño elegante",
    inStock: 10,
    price: 68000,
    images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmVja2xhY2V8ZW58MHx8MHx8fDA%3D"]
  },
  {
    nombre: "Anillo de Diamante",
    description: "Anillo con diamante natural certificado",
    inStock: 5,
    price: 72000,
    images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmluZ3xlbnwwfHwwfHx8MA%3D%3D"]
  },
  {
    nombre: "Cinturón de Tela",
    description: "Cinturón de tela con hebilla metálica",
    inStock: 35,
    price: 12000,
    images: ["https://images.unsplash.com/photo-1624222247344-550fb60583f1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVsdHxlbnwwfHwwfHx8MA%3D%3D"]
  },
  {
    nombre: "Gafas de Lectura",
    description: "Gafas de lectura con montura ligera",
    inStock: 40,
    price: 25000,
    images: ["https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2xhc3Nlc3xlbnwwfHwwfHx8MA%3D%3D"]
  },
  {
    nombre: "Sombrero de Paja",
    description: "Sombrero de paja para el verano",
    inStock: 30,
    price: 18000,
    images: ["https://images.unsplash.com/photo-1572307480813-ceb0e59d8325?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGF0fGVufDB8fDB8fHww"]
  },
  {
    nombre: "Pañuelo de Seda",
    description: "Pañuelo de seda con estampado floral",
    inStock: 25,
    price: 15000,
    images: ["https://images.unsplash.com/photo-1589810635657-232948472d98?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2NhcmZ8ZW58MHx8MHx8fDA%3D"]
  },
  {
    nombre: "Cartera de Cuero Sintético",
    description: "Cartera de cuero sintético con diseño moderno",
    inStock: 45,
    price: 28000,
    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2FsbGV0fGVufDB8fDB8fHww"]
  },
  {
    nombre: "Reloj Deportivo",
    description: "Reloj deportivo con múltiples funciones",
    inStock: 20,
    price: 58000,
    images: ["https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2F0Y2h8ZW58MHx8MHx8fDA%3D"]
  },
  {
    nombre: "Bolso de Playa",
    description: "Bolso de playa resistente al agua",
    inStock: 35,
    price: 22000,
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFnfGVufDB8fDB8fHww"]
  },
  {
    nombre: "Gafas de Sol Polarizadas",
    description: "Gafas de sol con lentes polarizadas",
    inStock: 30,
    price: 42000,
    images: ["https://images.unsplash.com/photo-1577803645773-f96470509666?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3VuZ2xhc3Nlc3xlbnwwfHwwfHx8MA%3D%3D"]
  },
  {
    nombre: "Cinturón de Cuero Elástico",
    description: "Cinturón de cuero con elástico para mayor comodidad",
    inStock: 40,
    price: 18000,
    images: ["https://images.unsplash.com/photo-1624222247344-550fb60583f1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVsdHxlbnwwfHwwfHx8MA%3D%3D"]
  },
  {
    nombre: "Bufanda de Seda",
    description: "Bufanda de seda con estampado geométrico",
    inStock: 25,
    price: 28000,
    images: ["https://images.unsplash.com/photo-1608256246200-53e376f7fd1a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2NhcmZ8ZW58MHx8MHx8fDA%3D"]
  }
];

async function main() {
  console.log('🌱 Seeding database...');

  // Limpiar datos existentes
  console.log('🧹 Cleaning up existing data...');
  await prisma.producto.deleteMany();
  await prisma.categoria.deleteMany();

  // Crear categorías
  const categorias = [
    { nombre: 'Ropa' },
    { nombre: 'Accesorios' },
    { nombre: 'Calzado' },
    { nombre: 'Joyería' }
  ];

  for (const categoria of categorias) {
    await prisma.categoria.create({
      data: {
        ...categoria,
        slug: slugify(categoria.nombre)
      }
    });
  }

  // Crear productos
  for (const producto of productos) {
    let categorias = [];
    
    // Asignar categorías según el tipo de producto
    if (producto.nombre.toLowerCase().includes('zapatillas')) {
      categorias = [{ slug: 'calzado' }];
    } else if (
      producto.nombre.toLowerCase().includes('anillo') ||
      producto.nombre.toLowerCase().includes('collar') ||
      producto.nombre.toLowerCase().includes('pendientes') ||
      producto.nombre.toLowerCase().includes('pulsera')
    ) {
      categorias = [{ slug: 'joyeria' }];
    } else if (
      producto.nombre.toLowerCase().includes('camiseta') ||
      producto.nombre.toLowerCase().includes('jeans') ||
      producto.nombre.toLowerCase().includes('chaqueta') ||
      producto.nombre.toLowerCase().includes('bufanda') ||
      producto.nombre.toLowerCase().includes('corbata') ||
      producto.nombre.toLowerCase().includes('calcetines')
    ) {
      categorias = [{ slug: 'ropa' }];
    } else {
      categorias = [{ slug: 'accesorios' }];
    }

    await prisma.producto.create({
      data: {
        ...producto,
        slug: slugify(producto.nombre),
        categorias: {
          connect: categorias
        }
      }
    });
  }

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 