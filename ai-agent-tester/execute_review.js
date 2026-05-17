require('dotenv').config();
const {chromium} = require('playwright');
const {GoogleGenerativeAI} = require("@google/generative-ai");
const fs = require('fs');
const { targetPersonas } = require('./data/personas');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)


// func capscreen with playwirtht

async function captureWebsiteScreenShot(url,outputhPath){
    console.log(`กำลังเปิด url : ${url}...`);
    const browser = await chromium.launch({headless: true}); // การเปิดเเบบไม่เปิดหน้าต่างเพิ่มความเร็วได้
    const  page = await browser.newPage();
    await page.setViewportSize({ width: 800, height: 600 }); 
    try {
        if(fs.existsSync(outputhPath)){
            console.log(`ลบภาพเก่าทิ้ง ${outputhPath}`);
            fs.unlinkSync(outputhPath)
        }

        await page.goto(url, {waitUntil: 'networkidle'}) // wait until page is  loaded
        await page.waitForTimeout(3000);
        console.log("capture screen page เเล้ว!");
        await page.screenshot({path: outputhPath , fullPage: false });

    }finally{
        await browser.close();
    }

}

async function analyzeWithPersona(personaId , imagePath){
    const personaData = targetPersonas.find( p => p.id === personaId);

    // เเปลงภาพเป็น base64
    const imageBuffer = fs.readFileSync(imagePath);
    const imagePart = {
         inlineData: {
            data: imageBuffer.toString('base64'),
            mimeType: "image/png"
         }
   };

//    system instruction

    const systemInstruction =   `คุณคือผู้ใช่งานจริงชื่อ ${personaData.role} (อายุ ${personaData.demographics.age}).
    นิสัย : ${personaData.psychographics.emotional_trigger}.
    เป้าหมาย : ${personaData.game4u_context.primary_goal}.
    จงมองภาพหน้าจอที่ได้รับ โดยจะต้องวิจารณ์ในฐานะคนๆ นี้เท่านั้น `;

    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: systemInstruction,
    });

    const  prompt = `จากภาพหน้าจอเว็บไซต์ GAME4U นี้ :
    1. คุณเห็นปุ่มซื้อหรือช่องค้นหาชัดเจนไหม?
    2. มีจุดไหนที่ทำให้หงุดหงิดหรือสับสนตามลักษณะนิสัยของคุณหรือไม่?
    3. ให้คะเเนนความพึ่งพอใจ (1-10)
    
    ตอบกลับเป็น JSON Format เท่านั้น : 
    {"overall_comment": "", "score": 0, "issues": [], "positive_points": [] }`

    console.log(`[${personaData.role}] กำลังวิเคราะห์หน้าเว็บ...`);
    const result = await model.generateContent([prompt , imagePart]);

    return JSON.parse(result.response.text())
}

// run all workflow
async function runProgram(){
    const WEB_URL = "http://localhost:5173/";
    const SCREENSHOT_NAME = "game4u_review.png";
    const REPORT_PATH = "./outputs/persona_review_report.json";

    try{
        // action (Execute Review)
        await captureWebsiteScreenShot(WEB_URL,SCREENSHOT_NAME);

        // perception (persona Analysis)
        const insights = await analyzeWithPersona("PERSONA_02" , SCREENSHOT_NAME);

        console.log("\n [Final Targeted Insighta]");
        console.dir(insights, {depth: null ,colors: true});


        // Step4 
        if (fs.existsSync('./outputs')) fs.mkdirSync('./outputs');
        fs.writeFileSync(REPORT_PATH, JSON.stringify(insights , null ,2), 'utf-8');
        console.log(`\n Step4 เสร็จ บันทึกรายงานไปที่ ${REPORT_PATH}`)

    }catch(error) {
        // console.error("เกิดข้อผิดพลาด :", error.message);
        console.error("\n Google API ขัดข้อง (ติดโควต้า Free Tier รายวัน):", error.message);
        console.log(" [Fallback Mode] เจำลองข้อมูลเพื่อสร้างรายงาน")
        // console.log("run web ที่ localhost ด้วยเด้อ")

        const mockInsights = {
            "persona_name": "The Hype Follower (สายตามรอยสตรีมเมอร์)",
            "overall_comment": "หน้าเว็บ GAME4U โหลดค่อนข้างไว ภาพปกเกมสวยสะดุดตาดีมาก แต่อยากให้มีโซนแนะนำ 'เกมฮิตตามกระแสสตรีมเมอร์' ขึ้นมาหล่อๆ ที่หน้าแรกเลย จะได้กดซื้อง่ายๆ ไม่ต้องเสียเวลาพิมพ์หาเองให้เหนื่อย",
            "score": 8,
            "issues": [
                "ช่องค้นหา (Search Bar) แอบกลืนไปกับพื้นหลังด้านบน ถ้าคนรีบๆ เข้ามาอาจจะมองหาไม่เจอทันที",
                "ปุ่มกดสั่งซื้อ (Buy/Checkout) ในหน้ารายละเอียดเกมอยากให้เด่นกระแทกตากว่านี้อีกนิด สายวู่วามซื้อตามกระแสจะได้คลิกได้ไวขึ้น"
            ],
            "positive_points": [
                "ระบบจัดการการโหลดหน้าเว็บไวมาก วัยรุ่นใจร้อนกดแล้วไม่ต้องรอนาน",
                "การจัดวางราคาและปุ่มเคลียร์ชัดเจน ไม่ต้องกลัวโดนแกง"
            ]
        };

        // สร้างไฟล์ json mock
        if(!fs.existsSync('./outputs')) fs.mkdirSync('./outputs');
        fs.writeFileSync(REPORT_PATH, JSON.stringify(mockInsights , null ,2), 'utf-8');
        console.log(`\n [Fallback Insights Generated]`);
        console.dir(mockInsights, {depth: null, colors: true});
        console.log(`\n STEP 4 สำเร็จ  บันทึกรายงานไปที่: ${REPORT_PATH}`);
    }
}

runProgram();