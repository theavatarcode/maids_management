import { defineEventHandler } from 'h3'
import pool from '../../config/db'

export default defineEventHandler(async () => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, c.name as customer_name, m.name as maid_name
      FROM reviews r
      LEFT JOIN customers c ON r.customer_id = c.id
      LEFT JOIN maids m ON r.maid_id = m.id
    `)
    return { reviews: rows }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลรีวิว'
    })
  }
}) 