import { defineEventHandler } from 'h3'
import pool from '../../config/db'
import { ResultSetHeader } from 'mysql2'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  try {
    const [result] = await pool.query(
      'INSERT INTO maids (name, email, phone, status, image, service_areas) VALUES (?, ?, ?, ?, ?)',
      [body.name, body.email, body.phone, body.status, body.image, JSON.stringify(body.serviceAreas)]
    ) as [ResultSetHeader, any]
    return { id: result.insertId }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูลแม่บ้าน'
    })
  }
}) 