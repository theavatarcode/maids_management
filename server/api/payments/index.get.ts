import { defineEventHandler } from 'h3'
import pool from '../../config/db'

export default defineEventHandler(async () => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, b.customer_id, b.maid_id, c.name as customer_name
      FROM payments p
      LEFT JOIN bookings b ON p.booking_id = b.id
      LEFT JOIN customers c ON b.customer_id = c.id
    `)
    return { payments: rows }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการชำระเงิน'
    })
  }
}) 