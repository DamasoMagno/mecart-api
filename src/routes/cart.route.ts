import { Router } from "express";
import { z } from "zod";
export const cartRoute = Router();

import { prisma } from "../lib/prisma";
import { authenticateUser } from "../middlwares/authenticate";

cartRoute.use(authenticateUser);

cartRoute.post('/', async (request, response) => {
  const { userId } = request;

  const cartSchema = z.object({
    title: z.string(),
    limit: z.number().min(0),
  });

  const { limit, title } = cartSchema.parse(request.body);

  await prisma.cart.create({
    data: {
      title,
      limit,
      userId
    }
  });

  return response
    .status(201)
    .send();
});

cartRoute.get('/', async (request, response) => {
  const { userId } = request;

  const searchCartSchema = z.object({
    title: z.string().optional(),
  });

  const { title } = searchCartSchema.parse(request.query);

  const carts = await prisma.cart.findMany({
    where: {
      title: {
        contains: title
      },
      userId
    },
    include: {
      products: true
    }
  });

  return response
    .status(200)
    .json(carts);
});

cartRoute.get('/:cartId', async (request, response) => {
  const findCartSchema = z.object({
    cartId: z.string(),
  });

  const { cartId } = findCartSchema.parse(request.params);
  const { userId } = request;

  const cart = await prisma.cart.findUniqueOrThrow({
    where: {
      id: cartId,
      userId
    }
  });

  return response
    .status(200)
    .json(cart);
});

cartRoute.patch('/:cartI', async (request, response) => {
  const findCartSchema = z.object({
    cartId: z.string(),
  });

  const cartSchema = z.object({
    title: z.string().optional(),
    limit: z.number().optional()
  });

  const cart = cartSchema.parse(request.body);
  const { cartId } = findCartSchema.parse(request.params);

  await prisma.cart.update({
    where: {
      id: cartId
    },
    data: { ...cart }
  });

  return response
    .status(204)
    .send();
});

cartRoute.delete('/:cartId', async (req, res) => {
  const paramsSchema = z.object({
    cartId: z.string(),
  });

  const { cartId } = paramsSchema.parse(req.params);

  await prisma.cart.delete({
    where: {
      id: cartId,
      userId: req.userId
    }
  });

  return res.status(204).send();
});