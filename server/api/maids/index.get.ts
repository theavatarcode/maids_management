import { defineEventHandler } from 'h3'
import pool from '../../config/db'

export default defineEventHandler(async () => {
  try {
    const [rows] = await pool.query('SELECT * FROM maids')
    return { maids: rows }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลแม่บ้าน'
    })
  }
}) 