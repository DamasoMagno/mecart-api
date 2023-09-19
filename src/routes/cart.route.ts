import { Router } from "express";
import { z } from "zod";
export const cartRoute = Router();

import { prisma, Prisma } from "../lib/prisma";
import { AuthenticateUser } from "../middlwares/Authenticate";

cartRoute.use(AuthenticateUser);

cartRoute.post('/', async (req, res) => {
  const { userId } = req;

  const cartSchema = z.object({
    title: z.string(),
    limit: z.number().min(0),
  });

  const { limit, title } = cartSchema.parse(req.body);

  await prisma.cart.create({
    data: {
      title,
      limit: new Prisma.Decimal(limit),
      userId
    }
  });

  return res.status(201).send();
});

cartRoute.get('/', async (req, res) => {
  const userId = req.userId;

  const searchCartSchema = z.object({
    title: z.string().optional(),
  });

  const { title } = searchCartSchema.parse(req.query);

  const carts = await prisma.cart.findMany({
    where: {
      userId,
      title: {
        contains: title
      }
    },
    include: {
      products: true
    }
  });

  return res.status(200).json(carts);
}
);

cartRoute.get('/:cartId', async (req, res) => {
  const findCartSchema = z.object({
    cartId: z.string(),
  });

  const { cartId } = findCartSchema.parse(req.params);
  const { userId } = req;

  const cart = await prisma.cart.findUniqueOrThrow({
    where: {
      id: cartId,
      userId
    }
  });

  return res.status(200).json(cart);
});

cartRoute.patch('/:cartId', async (req, res) => {
  const findCartSchema = z.object({
    cartId: z.string(),
  });

  const cartSchema = z.object({
    title: z.string().optional(),
    limit: z.number().min(0).optional()
  });

  const { limit, title } = cartSchema.parse(req.body);
  const { cartId } = findCartSchema.parse(req.params);

  if (!limit && !title) {
    return res.status(400).send({ error: "None field sended" })
  }

  await prisma.cart.update({
    where: {
      id: cartId
    },
    data: {
      title,
      limit
    }
  });

  return res.status(200).send();
});

cartRoute.delete('/:cartId', async (req, res) => {
  const paramsSchema = z.object({
    cartId: z.string(),
  });

  try {
    const { cartId } = paramsSchema.parse(req.params);

    await prisma.cart.delete({
      where: {
        id: cartId
      }
    });
  } catch (error) {
    console.log(error);
  }

  return res.status(200).send();
});