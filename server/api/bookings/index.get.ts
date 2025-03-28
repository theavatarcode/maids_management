import { defineEventHandler } from 'h3'
import pool from '../../config/db'

export default defineEventHandler(async () => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, c.name as customer_name, m.name as maid_name 
      FROM bookings b
      LEFT JOIN customers c ON b.customer_id = c.id
      LEFT JOIN maids m ON b.maid_id = m.id
    `)
    return { bookings: rows }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการจอง'
    })
  }
}) 