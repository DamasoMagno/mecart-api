import { Router } from "express";
import { z } from "zod";
export const productRoute = Router();

import { prisma } from "../lib/prisma";
import { AuthenticateUser } from "../middlwares/Authenticate";

productRoute.use(AuthenticateUser);

productRoute.post('/', async (req, res) => {
  const cartSchema = z.object({
    name: z.string(),
    price: z.number().min(0),
    quantity: z.number().min(1),
    cartId: z.string().uuid(),
  });

  const { name, price, quantity, cartId } = cartSchema.parse(req.body);

  await prisma.product.create({
    data: {
      name,
      price,
      quantity,
      cartId
    }
  });

  return res.status(201).send();
})

productRoute.get('/', async (req, res) => {
  const products = await prisma.product.findMany();

  return res.status(200).send(products);
});

productRoute.get('/:productId', async (req, res) => {
  const paramsSchema = z.object({
    productId: z.string(),
  });

  const { productId } = paramsSchema.parse(req.params);

  const product = await prisma.product.findUniqueOrThrow({
    where: {
      id: productId
    }
  });

  return res.status(200).send(product);
});

productRoute.delete('/:productId', async (req, res) => {
  const paramsSchema = z.object({
    productId: z.string(),
  });

  const { productId } = paramsSchema.parse(req.params);

  const productExists = await prisma.product.findFirst({ where: { id: productId } });

  if (!productExists) {
    return res.status(400).send({ message: "Product removed" });
  }

  await prisma.product.delete({
    where: {
      id: productId
    }
  });

  return res.status(200).send();
});

productRoute.patch('/:productId', async (req, res) => {
  const findProductSchema = z.object({
    productId: z.string(),
  });

  const cartSchema = z.object({
    name: z.string().optional(),
    price: z.number().min(0).optional(),
    quantity: z.number().min(0).optional(),
  });

  const { productId } = findProductSchema.parse(req.params);
  const { name, price, quantity } = cartSchema.parse(req.body);

  if (!name && !price && !quantity) {
    return res.status(400).send({ error: "None field sended" })
  }

  const dataUpdated = {
    name,
    price,
    quantity
  }

  await prisma.product.update({
    where: {
      id: productId
    },
    data: dataUpdated
  });

  return res.status(200).send();
}
);