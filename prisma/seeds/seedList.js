const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();

async function seedingList() {
  const rawData = fs.readFileSync("prisma/data/dataList.json");
  const data = JSON.parse(rawData);
  console.log(data);
  await prisma.list.createMany({ data });
}

seedingList()
  .catch((e) => {
    console.log(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
