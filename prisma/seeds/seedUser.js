const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();

async function seedingUser() {
    const rawData = fs.readFileSync("prisma/data/dataUser.json");
    const data = JSON.parse(rawData);
console.log(data)
    await prisma.user.createMany({data})
}

seedingUser()
    .catch((e) => {
        console.log(e)
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
