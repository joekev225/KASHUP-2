import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

export const transactionSchema = z.object({
  amount: z.number().positive('Le montant doit être positif'),
})

export const withdrawalSchema = z.object({
  amount: z.number().positive('Le montant doit être positif'),
  bankAccount: z.string().min(10, 'Le numéro de compte bancaire doit contenir au moins 10 caractères'),
})
