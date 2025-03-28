import { defineEventHandler } from 'h3'
import pool from '../../config/db'
import { ResultSetHeader } from 'mysql2'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  try {
    // ตรวจสอบว่าแม่บ้านว่างในเวลาที่ต้องการจองหรือไม่
    const [existingBookings] = await pool.query(
      `SELECT id FROM bookings 
       WHERE maid_id = ? 
       AND date = ? 
       AND time = ? 
       AND status != 'cancelled'`,
      [body.maidId, body.date, body.time]
    )

    if (Array.isArray(existingBookings) && existingBookings.length > 0) {
      throw createError({
        statusCode: 400,
        message: 'แม่บ้านไม่ว่างในเวลาที่เลือก กรุณาเลือกเวลาอื่น'
      })
    }

    // เพิ่มข้อมูลการจอง
    const [result] = await pool.query(
      `INSERT INTO bookings (
        customer_id, 
        maid_id, 
        date, 
        time, 
        status, 
        price
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        body.customerId,
        body.maidId,
        body.date,
        body.time,
        body.status || 'pending', // ถ้าไม่ระบุให้เป็น pending
        body.price
      ]
    ) as [ResultSetHeader, any]

    // อัพเดทสถานะแม่บ้านเป็น 'busy' ถ้าสถานะการจองเป็น 'confirmed'
    if (body.status === 'confirmed') {
      await pool.query(
        'UPDATE maids SET status = ? WHERE id = ?',
        ['busy', body.maidId]
      )
    }

    return { 
      id: result.insertId,
      message: 'เพิ่มการจองสำเร็จ'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'เกิดข้อผิดพลาดในการเพิ่มการจอง'
    })
  }
}) 