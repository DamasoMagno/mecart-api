import { Router } from "express";
import { compare, hash } from "bcrypt";
import { z } from "zod";
import { sign } from "jsonwebtoken";

export const userRoute = Router();
import { prisma } from "../lib/prisma";

userRoute.post('/', async (req, res) => {
  const cartSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, name, password } = cartSchema.parse(req.body);

  const checkUserWithSameEmail = await prisma.user.findFirst({
    where: {
      email
    }
  });

  if (checkUserWithSameEmail) {
    return res.status(400).send({ error: "User already exists" });
  }

  const passwordHashed = await hash(password, 8);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHashed
    }
  });

  return res.status(201).send(user);
});

userRoute.post('/login', async (req, res) => {
  const cartSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = cartSchema.parse(req.body);

  const checkUseEmailExists = await prisma.user.findFirst({
    where: {
      email
    }
  });

  if (!checkUseEmailExists) {
    return res.status(400).send({ error: "User don't " });
  }

  const comparePassword = await compare(password, checkUseEmailExists.password);

  if (!comparePassword) {
    return res.status(400).send({ error: "Password is not valid" });
  }

  const token = sign(
    {}, 
    "575ae83ad709c84f7f89aaa02ff950d7", 
    {
      subject: checkUseEmailExists.id,
      expiresIn: "60s"
    }
  );

  return res.send({
    user: checkUseEmailExists,
    token
  })
});