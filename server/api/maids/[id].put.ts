import { defineEventHandler } from 'h3'
import pool from '../../config/db'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const body = await readBody(event)
  
  try {
    // แยก serviceAreasInput ออกมาเป็น array และแปลงเป็น JSON
    const serviceAreas = body.serviceAreasInput
      .split(',')
      .map((area: string) => area.trim())
      .filter((area: string) => area)

    // อัพเดทข้อมูลในฐานข้อมูล
    await pool.query(
      `UPDATE maids 
       SET name = ?, 
           email = ?, 
           phone = ?, 
           image = ?,
           status = ?, 
           service_areas = ?
       WHERE id = ?`,
      [
        body.name,
        body.email,
        body.phone,
        body.image,
        body.status,
        JSON.stringify(serviceAreas),
        id
      ]
    )

    return { 
      message: 'อัพเดทข้อมูลแม่บ้านสำเร็จ',
      serviceAreas // ส่งกลับ array ของพื้นที่บริการที่อัพเดท
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'เกิดข้อผิดพลาดในการอัพเดทข้อมูล'
    })
  }
}) 