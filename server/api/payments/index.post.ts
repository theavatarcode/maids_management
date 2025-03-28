import { defineEventHandler } from 'h3'
import pool from '../../config/db'
import { ResultSetHeader } from 'mysql2'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  try {
    const [result] = await pool.query(
      'INSERT INTO payments (booking_id, amount, payment_method, status) VALUES (?, ?, ?, ?)',
      [body.bookingId, body.amount, body.paymentMethod, body.status]
    ) as [ResultSetHeader, any]
    return { id: result.insertId }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'เกิดข้อผิดพลาดในการเพิ่มการชำระเงิน'
    })
  }
}) 