import { defineEventHandler } from 'h3'
import pool from '../../config/db'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const body = await readBody(event)
  try {
    await pool.query(
      'UPDATE customers SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?',
      [body.name, body.email, body.phone, body.address, id]
    )
    return { message: 'อัพเดทข้อมูลสำเร็จ' }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'เกิดข้อผิดพลาดในการอัพเดทข้อมูล'
    })
  }
}) 