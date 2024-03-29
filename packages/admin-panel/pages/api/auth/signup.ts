import type { NextApiRequest, NextApiResponse } from 'next';
import Admin from '../../../models/adminModel';
import { IAdmin } from '../../../types';
import dbConnect from '../../../lib/dbConnect';
import {z} from 'zod'

const userInputSchema=z.object({
  username:z.string().min(3).max(40),
  password:z.string().min(6).max(20)
})

type AdminType=z.infer<typeof userInputSchema>

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();
    const parsedInput=userInputSchema.safeParse(req.body)
    if(!parsedInput.success){
      return res.status(400).json({messsage:"Incorrect input"})
    }
    const admin: AdminType = parsedInput.data;
    const existingUser = await Admin.findOne({ username: admin.username });
    if (existingUser) {
      res.status(403).send('username already exists');
    } else {
      const newUser = new Admin(admin);
      await newUser.save();
      res
        .status(201)
        .json({ message: 'User created successfully'});
    }
  } catch (error) {
    console.log(error);
  }
}
