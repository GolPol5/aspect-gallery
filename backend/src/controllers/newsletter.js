import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const schema = z.object({
  email: z.string().email(),
  source: z.enum(['footer', 'exhibitions']),
});

export async function subscribe(req, res) {
  const data = schema.parse(req.body);

  await prisma.newsletterSubscriber.upsert({
    where: { email: data.email },
    update: {},
    create: data,
  });

  res.json({ message: 'Subscribed successfully' });
}
