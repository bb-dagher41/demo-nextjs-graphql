import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient()

const links = [
    {
      category: "Open Source",
      description: "Fullstack React framework",
      id: "8a9020b2-363b-4a4f-ad26-d6d55b51bqes",
      image_url: "https://nextjs.org/static/twitter-cards/home.jpg",
      title: "Next.js",
      url: "https://nextjs.org",
    },
    {
      category: "Open Source",
      description: "Next Generation ORM for TypeScript and JavaScript",
      id: "2a3121b2-363b-4a4f-ad26-d6c35b41bade",
      image_url: "https://www.prisma.io/images/og-image.png",
  
      title: "Prisma",
      url: "https://prisma.io",
    },
    {
      category: "Open Source",
      description: "Utility-fist css framework",
      id: "6a9122b2-363b-4a4f-ad26-d6c55b51baed",
      image_url:
        "https://tailwindcss.com/_next/static/media/twitter-large-card.85c0ff9e455da585949ff0aa50981857.jpg",
      title: "TailwindCSS",
      url: "https://tailwindcss.com",
    },
    {
      category: "Open Source",
      description: "GraphQL implementation ",
      id: "2ea8cfb0-44a3-4c07-bdc2-31ffa135ea78",
      image_url: "https://www.apollographql.com/apollo-home.jpg",
      title: "Apollo GraphQL",
      url: "https://apollographql.com",
    },
  ];

async function main() {
  await prisma.user.create({
    data: {
      email: `testemail@gmail.com`,
      role: 'ADMIN',
    },
  })

  await prisma.link.createMany({
    data: links,
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })