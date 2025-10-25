import type { Request, Response } from "express";
import { generateToken } from "@/utils/jwt";
import { comparePasswords, hashPassword } from "@/utils/passwords";
import prisma from "@/db";

export const register = async (req: Request, res: Response) => {
  try {
    const hashedPassword = await hashPassword(req.body.password);

    const user = await prisma.user.create({
      data: {
        ...req.body,
        password: hashedPassword,
      },
    });

    const token = await generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    return res.status(201).json({
      message: "User created",
      user,
      token,
    });
  } catch (e) {
    console.error("Registration error", e);
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidatedPassword = await comparePasswords(password, user.password);

    if (!isValidatedPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = await generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    return res.status(201).json({
      message: "Login success",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (e) {
    console.error("Loging error", e);
    res.status(500).json({ error: "Failed to login" });
  }
};
