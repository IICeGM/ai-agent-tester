require('dotenv').config(); // load api key 
const {GoogleGenerativeAI} = require('@google/generative-ai');
const {targetPersonas} = require('./data/personas');
const { response } = require('express');

// Check if an API key exists
if(!process.env.GEMINI_API_KEY){
    console.error("ไม่พบ API Key ");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// func สมอง ของ AI Agent 
// รับ id ของ persona เเล้วคืนค่าเป็น model gemini 

function createPersonaAgent(persona){
    // find persona data from personas.js
    const personaData = targetPersonas.find(p => p.id === personaId);

    if(!personaData){
        throw new Error(`Persona with ID ${personaId} not found`);
    }

    // design system instruction (prompt)
    const systemInstruction = `
        คุณคือ AI Agent ที่สวมบทบาทเป็นผู้ใช้งานตามข้อมูลโปรไฟล์นี้อย่างเคร่งครัด ห้ามหลุดจากบทบาทนี้เด็ดขาด:
        - ชื่อ/บทบาท : ${personaData.role}
        - ข้อมูลพื้นฐาน : ${personaData.demographics.age} ปี, อาชีพ : ${personaData.demographics.occupation }, รายได้ : ${personaData.demographics.income_level}
        - ความเชี่ยวชาญด้าน IT: ${personaData.tech_profile.tech_savviness}, ใช้อุปกรณ์: ${personaData.tech_profile.device_used}
        - ความคุ้นเคยกับ E-commerce: ${personaData.tech_profile.familiarity_with_e_commerce}
        - พฤติกรรมและอารมณ์: ระดับความอดทน ${personaData.psychographics.patience_level}, สิ่งที่กระตุ้นอารมณ์: ${personaData.psychographics.emotional_trigger}
        - เป้าหมายหลักบนเว็บ GAME4U: ${personaData.game4u_context.primary_goal}
        - จุดที่ทำให้หงุดหงิด (Pain Points): ${personaData.game4u_context.pain_points}\

        เวลาที่คุณประเมิณหน้าจอ Ux/Ui ให้มองเเละรู้สึกเหมือนคนนี้จริงๆ 100% ถ้าเจอสิ่งที่ขัดใจ หรือไม่ชอบ ตามลักษณะนิสัยนี้ ให้วิจารณ์ตรงๆ ไม่ต้องรักษาน้ำใจผู้พัฒนา

    `;

    // กำหนดค่าเเละสร้าง model 
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        systemInstruction: systemInstruction, // สมองเเละบทบาท
        generationConfig: {
            temperature: 0.7,  // ให้คะแนนความสร้างสรรค์เพื่อให้ตอบเหมือนคนจริงๆ
            responseMimeType: "application/json", // 

        }
    });
    
    console.log(`เตรียมความพร้อม AI Agent: [${personaData.role}] สำเร็จ `)

    // คืนค่า agent ที่พร้อมใช้งานกลับไป
    return { 
        personaInfo: personaData,
        model : model
    };

    // ส่วนทดสอบว่า agent จำบทบาทตัวเองได้ไหม
    async function testAgentInitialization(){
        console.log("---- เริ่มทดสอบ AI Agent ----")

        // try made agent สายตาม steamer
        const agent = createPersonaAgent("PERSONA_02");

        // try made a easy quesiton  to check role
        const prompt = `
        ตอบกลับเป็น JSON Format: { "thought": "ความคิดของคุณในหัวตอนนี้", "answer": "คำตอบของคุณ" }
        คำถาม: คุณรู้สึกยังไงถ้าเว็บ GAME4U ไม่มีระบบจ่ายเงินผ่าน QR Code?
    `;

    try {
        const result = await agent.model.generateContent(prompt);
        console.log("\n คำตอบจาก agent: ")
        console.log(JSON.parse(result.response.text()));

    }catch(error){
        console.error("เกิดข้อผิดพลาดในการ test: ", error)
    }
    }
}
testAgentInitialization();