import prisma from "@/db";
import type { AuthenticatedRequest } from "../middleware/auth.ts";
import { Response } from "express";

export const getConversations = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { status } = req.query;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const conversations = await prisma.conversation.findMany({
      where,
      include: {
        candidate: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({
      error: "Failed to fetch conversations",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getConversation = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        candidate: true,
      },
    });

    if (!conversation) {
      return res.status(404).json({
        error: "Conversation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({
      error: "Failed to fetch conversation",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
