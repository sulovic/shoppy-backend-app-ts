import { Router, Request, Response } from "express";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  // Placeholder - replace with prisma DB call
  const users = [
    { id: 1, username: "alice" },
    { id: 2, username: "bob" },
  ];
  res.json(users);
});

export default router;
