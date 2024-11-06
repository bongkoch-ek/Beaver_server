const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();

async function seedingTask() {
  const rawData = fs.readFileSync("prisma/data/dataTask.json");
  const data = JSON.parse(rawData);
  console.log(data);
  await prisma.task.createMany({ data });
}

seedingTask()
  .catch((e) => {
    console.log(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
