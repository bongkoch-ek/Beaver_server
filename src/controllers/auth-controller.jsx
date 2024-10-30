
const {jwt,bcrypt } = require('../model')
const prisma = require('../configs/prisma')
const createError = require('../utils/createError')


exports.register = async (req, res, next) => {
    try {
        const { email,displayname, password,confirmpassword, firstname, lastname,  } = req.body; 

        if (!email) {
            return createError(400, "Email is required!!"); 
        }
     

        if (!password) {
            return createError(400, "Password is required!!"); 
        }

        if (password !== confirmpassword) {
            return createError(400, "Password do not match ")
        }

        // ตรวจสอบว่า email นั้นมีอยู่ในฐานข้อมูลหรือยัง
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        // หากมีผู้ใช้ที่ใช้ email นี้อยู่แล้ว
        if (user) {
            return createError(400, "Email already exists"); 
        }

        // แฮช (hash) รหัสผ่านด้วย bcrypt
        const hashPassword = await bcrypt.hash(password, 10); // แฮชรหัสผ่าน

        // สร้างผู้ใช้ใหม่ในฐานข้อมูล
        await prisma.user.create({
            data: {
                email: email,           
                displayname: displayname ,
                password: hashPassword,
                fullname : firstname + '' + lastname,
            }
        });

      
        res.send('Register Success');

    } catch (err) {
        next(err);
    }
}


exports.login = async (req, res, next) => {
    try {

        const { email , password } = req.body; 

        // ตรวจสอบว่า username มีอยู่ในฐานข้อมูลหรือไม่
        const user = await prisma.user.findFirst({
            where: {
                email : email
            }
        });

        // หากไม่พบผู้ใช้หรือผู้ใช้ถูกปิดการใช้งาน (enabled: false)
        if (!user || !user.enabled) {
            return createError(400, "User Not found or not Enabled"); 
        }

        // ตรวจสอบความถูกต้องของรหัสผ่านที่ผู้ใช้กรอกมา
        const isMatch = await bcrypt.compare(password, user.password); // เปรียบเทียบรหัสผ่านที่กรอกกับที่เก็บในฐานข้อมูล
        if (!isMatch) {
            return createError(400, "Password Invalid!!"); 
        }

        // สร้างข้อมูล Payload สำหรับการสร้าง Token
        const payload = {
            id: user.id,      
            email: user.email,   
            displayname: user.displayname,
            fullname: user.fullname,   
            profileimage: user.profileimage,
            createdat : user.createdat,
            updatedat : user.updatedat
        };

        // สร้าง JWT Token โดยใช้ข้อมูล payload และ secret key ที่เก็บในไฟล์ .env
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: '30d' // กำหนดอายุของ Token เป็น 30 วัน
        }, (err, token) => { // callback function ที่จะถูกเรียกเมื่อสร้าง token เสร็จ
            if (err) {
                return createError(500, "Server Error"); 
            }
            res.json({ payload, token }); // ส่งข้อมูล payload และ token กลับไปยัง client
        });

    } catch (err) {
        next(err);
    }

};