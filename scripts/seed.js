require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');
const bcrypt = require('bcryptjs');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting database seed...');

  const hashedPassword = await bcrypt.hash('driver123', 10);

  const driver = await prisma.user.upsert({
    where: { email: 'driver@kevincab.co.ke' },
    update: {},
    create: {
      email: 'driver@kevincab.co.ke',
      password: hashedPassword,
      name: 'John Kamau',
      role: 'driver',
      phone: '+254712345678',
    },
  });

  console.log('Created driver user:', driver.email);

  const sampleBooking = await prisma.booking.create({
    data: {
      customerName: 'Jane Wanjiku',
      customerPhone: '+254723456789',
      pickupLocation: 'JKIA Terminal 1A',
      destination: 'Westlands, Nairobi',
      serviceType: 'Economy (4 Seater)',
      bookingDate: new Date('2024-03-15T10:00:00'),
      status: 'pending',
    },
  });

  console.log('Created sample booking:', sampleBooking.id);

  // Seed Hero Section
  const heroSection = await prisma.heroSection.create({
    data: {
      title: 'Your Trusted Ride Across Kenya',
      subtitle: 'KEVINCAB',
      description: 'Experience premium taxi services with professional drivers. Available 24/7 for airport transfers, city rides, and inter-county trips.',
      ctaText: 'Book Your Ride',
      isActive: true,
    },
  });

  console.log('Created hero section');

  // Seed About Section
  const aboutSection = await prisma.aboutSection.create({
    data: {
      title: 'About KEVINCAB',
      subtitle: 'Kenya\'s Premier Taxi Network',
      description: 'Since 2018, KEVINCAB has been providing reliable, safe, and comfortable transportation services across Kenya. Our fleet of modern vehicles and professional drivers ensure you reach your destination safely and on time. We pride ourselves on excellent customer service, competitive rates, and a commitment to making every journey memorable.',
      isActive: true,
    },
  });

  console.log('Created about section');

  // Seed Services
  const services = await prisma.service.createMany({
    data: [
      {
        title: 'Airport Transfers',
        description: 'Reliable pick-up and drop-off services to all major airports in Kenya. Professional drivers, flight tracking, and meet & greet service.',
        icon: 'Flight',
        price: 'From KES 2,500',
        isActive: true,
        order: 1,
      },
      {
        title: 'City Rides',
        description: 'Quick and convenient transportation within the city. Perfect for business meetings, shopping trips, or exploring the city.',
        icon: 'LocationCity',
        price: 'From KES 500',
        isActive: true,
        order: 2,
      },
      {
        title: 'Inter-County Trips',
        description: 'Long-distance travel made comfortable. Travel between counties with our spacious vehicles and experienced drivers.',
        icon: 'Explore',
        price: 'Custom Quote',
        isActive: true,
        order: 3,
      },
      {
        title: 'Corporate Services',
        description: 'Dedicated transportation solutions for businesses. Monthly packages, event transportation, and executive services available.',
        icon: 'Business',
        price: 'Contact Us',
        isActive: true,
        order: 4,
      },
    ],
  });

  console.log('Created services');

  // Seed Contact Info
  const contactInfo = await prisma.contactInfo.create({
    data: {
      email: 'info@kevincab.co.ke',
      phone: '+254 712 345 678',
      address: 'Nairobi CBD, Kenya',
      workingHours: 'Available 24/7',
      isActive: true,
    },
  });

  console.log('Created contact info');

  // Seed Social Media
  const socialMedia = await prisma.socialMedia.createMany({
    data: [
      {
        platform: 'Facebook',
        url: 'https://facebook.com/kevincab',
        isActive: true,
        order: 1,
      },
      {
        platform: 'Twitter',
        url: 'https://twitter.com/kevincab',
        isActive: true,
        order: 2,
      },
      {
        platform: 'Instagram',
        url: 'https://instagram.com/kevincab',
        isActive: true,
        order: 3,
      },
    ],
  });

  console.log('Created social media links');

  // Seed Site Settings
  const siteSettings = await prisma.siteSettings.create({
    data: {
      siteName: 'KEVINCAB',
      primaryColor: '#FFD700',
      secondaryColor: '#000000',
    },
  });

  console.log('Created site settings');

  console.log('\n✅ Database seeded successfully!');
  console.log('\n🔑 Driver Login Credentials:');
  console.log('Email: driver@kevincab.co.ke');
  console.log('Password: driver123');
  console.log('\n📊 CMS Data:');
  console.log('- Hero Section: Created');
  console.log('- About Section: Created');
  console.log('- Services: 4 services added');
  console.log('- Contact Info: Created');
  console.log('- Social Media: 3 platforms added');
  console.log('- Site Settings: Created');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
