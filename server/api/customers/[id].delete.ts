import { defineEventHandler } from 'h3'
import pool from '../../config/db'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  try {
    await pool.query('DELETE FROM customers WHERE id = ?', [id])
    return { message: 'ลบข้อมูลสำเร็จ' }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'เกิดข้อผิดพลาดในการลบข้อมูล'
    })
  }
}) 