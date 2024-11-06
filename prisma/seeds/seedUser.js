const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs")

async function seedingUser() {
    const rawData = fs.readFileSync("prisma/data/dataUser.json");
    const data = JSON.parse(rawData);
// console.log(data)
    for( item of data ) {
        const hashPassword = await bcrypt.hash(item.password,10)
        item.password = hashPassword 
    }
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
