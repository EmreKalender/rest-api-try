import prisma from 'lib/prisma'
import { userAgent } from 'next/server'
export default async function handler(req, res) {
  if(req.method==='GET'){
    const trips=await prisma.trip.findMany()
    await Promise.all(
      trips.map(async (trip)=>{
        trip.expenses=await prisma.expense.findMany({
          where:{
            trip: trip.id,
          },
        })
      })
    )
    res.status(200).json(trips)
    return
  }
  if(req.method==='POST'){
    const {user,name,startDate,endDate}=req.body
    if(!user) return res.status(400).json({
      message: 'Missing required parameter user'
    })
    if(!name) return res.status(400).json({
      message: 'Missing required parameter name'
    })
    await prisma.trip.create({
      data:{
        user,
        name,
        startDate,
        endDate,
      },
    })
    res.status(200).end()
    return
  }
  res.status(405).json({message: 'Method not allowed'})
}
