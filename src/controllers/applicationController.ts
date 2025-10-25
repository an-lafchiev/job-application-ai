import z from "zod";
import { Request, Response } from "express";
import { ConversationStatus } from "@prisma/client";
import prisma from "@/db";
import type { createConversationSchema } from "@/routes/index";

type JobApplication = z.infer<typeof createConversationSchema>;

export const handleNewApplication = async (req: Request, res: Response) => {
  try {
    const application: JobApplication = req.body;
    const result = await createConversationFromApplication(application);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    if (result.data) {
      return res.status(201).json({
        success: true,
        conversation: result.data.conversation,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const checkActiveConversation = async (candidateId: string) => {
  const conversations = await prisma.conversation.findMany({
    where: {
      candidateId: candidateId,
      status: {
        in: [ConversationStatus.CREATED, ConversationStatus.ONGOING],
      },
    },
  });

  if (!conversations.length) {
    return false;
  }

  return true;
};

const checkDuplicateApplication = async (
  candidateId: string,
  jobId: string
) => {
  const conversations = await prisma.conversation.findMany({
    where: {
      candidateId: candidateId,
      jobId: jobId,
    },
  });

  if (!conversations.length) {
    return false;
  }

  return true;
};
const validateConversationCreation = async (application: JobApplication) => {
  const { candidate_id, job_id } = application;
  const hasActiveConversation = await checkActiveConversation(candidate_id);
  if (hasActiveConversation) {
    return {
      success: false,
      data: null,
      error:
        "Candidate already has an active conversation (CREATED or ONGOING)",
    };
  }

  const hasJobApplication = await checkDuplicateApplication(
    candidate_id,
    job_id
  );

  if (hasJobApplication) {
    return {
      success: false,
      data: null,
      error: "Candidate has already applied for this job",
    };
  }

  return {
    success: true,
    data: null,
    error: null,
  };
};

const createConversation = async (application: JobApplication) => {
  const { candidate, candidate_id, job_id } = application;

  await prisma.candidate.upsert({
    where: { id: candidate_id },
    update: {},
    create: {
      id: candidate_id,
      firstName: candidate.first_name,
      lastName: candidate.last_name,
      emailAddress: candidate.email_address,
      phoneNumber: candidate.phone_number,
    },
  });

  const conversation = await prisma.conversation.create({
    data: {
      jobId: job_id,
      status: ConversationStatus.CREATED,
      candidate: {
        connect: { id: candidate_id },
      },
    },
  });

  return conversation;
};

const createConversationFromApplication = async (
  application: JobApplication
) => {
  const validation = await validateConversationCreation(application);

  if (!validation.success) {
    return validation;
  }

  const conversation = createConversation(application);

  return {
    success: true,
    error: null,
    data: { conversation },
  };
};
