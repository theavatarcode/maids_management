import { defineEventHandler } from 'h3'
import pool from '../../config/db'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const body = await readBody(event)
  try {
    await pool.query(
      'UPDATE bookings SET status = ? WHERE id = ?',
      [body.status, id]
    )
    return { message: 'อัพเดทสถานะสำเร็จ' }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'เกิดข้อผิดพลาดในการอัพเดทสถานะ'
    })
  }
}) 