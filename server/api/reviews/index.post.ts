import { defineEventHandler } from 'h3'
import pool from '../../config/db'
import { ResultSetHeader } from 'mysql2'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  try {
    const [result] = await pool.query(
      'INSERT INTO reviews (booking_id, customer_id, maid_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [body.bookingId, body.customerId, body.maidId, body.rating, body.comment]
    ) as [ResultSetHeader, any]
    
    // อัพเดทคะแนนเฉลี่ยของแม่บ้าน
    await pool.query(`
      UPDATE maids 
      SET rating = (
        SELECT AVG(rating) 
        FROM reviews 
        WHERE maid_id = ?
      )
      WHERE id = ?
    `, [body.maidId, body.maidId])

    return { id: result.insertId }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'เกิดข้อผิดพลาดในการเพิ่มรีวิว'
    })
  }
}) 