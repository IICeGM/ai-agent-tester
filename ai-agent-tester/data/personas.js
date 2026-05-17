// เก็บข้อมูล persona ในรูปเเบบ array of obj

const { kMaxLength } = require("node:buffer");

const targetPersonas = [
    {
        id: "PERSONA_01",
        role: "The Hardcore Gamer",
        demographics: { // กำหนดข้อมูลพื้นฐาน
            age: 21,
            occupation : "นักศึกษา",
            income_level : "ปานกลาง (เก็บเงินซื้อเองที่ได้จากพ่อเเม่หรือจากการทำ part time )"
        },
        tech_profile: { // skill การใช้ tech
            tech_savviness: "High",
            device_used : "Gaming Pc or Gaming Labtop",
            familiarity_with_e_commerce: "ชินกับการซื้อเกมกับ steam เเละ epic games"
        },
        psychographics: {
            patience_level: "ต่ำ (ต้องการความสะดวกรวดเร็ว ไม่อยากคลิกหน้าจอหลายรอบ)",
            emotional_trigger: "จะหงุดหงิดเมื่อพบกับสถานการณ์ที่จะต้องหาปุ่มซื้อ ปุ่มเพื่อคลิกลงตระกร้าสินค้า หากหาเเยก เเละ เมื่อระบุ system requirements ไม่ชัดเจนพอ"
        },
        game4u_context: {
            primary_goal : "เข้ามาหาหรือเลือกซื้อเกมระดับ AAA เกมใหม่ที่ออก เเละต้องการดูรีวิวจากผู้ใช้งานคนอื่นๆ ประกอบการตัดสินใจ",
            pain_point : "ไม่ชอบเว็บที่โหลดภาพช้า หรือขั้นตอนจ่ายเงินที่ยุ่งยาก "
        }
    },
    {
        id: "PERSONA_02",
        role: "The Hype Follower (สายตามรอยสตรีมเมอร์)",
        demographics: {
            age: 18,
            occupation: "นักเรียน / นักศึกษา",
            income_level: "ปานกลาง (มีงบจำกัด บางครั้งต้องรอช่วงเทศกาลลดราคา)"
        },
        tech_profile: {
            tech_savviness: "ปานกลางถึงสูง (สิงอยู่ใน Twitch, YouTube, Discord เป็นหลัก)",
            device_used: "Gaming Laptop ระดับเริ่มต้น ",
            familiarity_with_e_commerce: "ซื้อของออนไลน์เก่ง คล่องแคล่วกับการสแกนจ่ายด้วย QR Code / PromptPay มากกว่าบัตรเครดิต"
        },
        psychographics: {
            patience_level: "ต่ำมาก (วัยรุ่นใจร้อน โดนป้ายยามาแล้วอยากเล่นเดี๋ยวนี้ จะได้ไปคุยกับเพื่อนรู้เรื่อง)",
            emotional_trigger: "ตัดสินใจซื้อด้วยอารมณ์  ซื้อตามกระแส (FOMO - Fear Of Missing Out)"
        },
        game4u_context: {
            primary_goal: "เข้าเว็บมาเพื่อพิมพ์ชื่อเกมที่เพิ่งดูสตรีมเมอร์เล่นเมื่อคืนลงในช่องค้นหา และคาดหวังว่าเว็บจะมีหมวด 'เกมฮิต/เกมกำลังมาแรง ' แนะนำไว้เลย",
            pain_points: "ถ้าระบบค้นหา (Search Bar) พิมพ์ผิดนิดเดียวแล้วหาเกมไม่เจอ จะหงุดหงิดและออกไปเว็บอื่นทันที และไม่ชอบอ่าน Text รายละเอียดเกมยาวๆ ต้องการเห็นแค่ภาพปก ราคา และปุ่มกดซื้อที่ชัดเจน"
        }
    }

];

module.exports = {targetPersonas};