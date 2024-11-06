const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();

async function seedingProject() {
  const rawData = fs.readFileSync("prisma/data/dataProject.json");
  const data = JSON.parse(rawData);
  console.log(data);
  await prisma.project.createMany({ data });
}

seedingProject()
  .catch((e) => {
    console.log(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
