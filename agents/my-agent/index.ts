import { agent, tool } from "@21st-sdk/agent"
import { z } from "zod"

export default agent({
  model: "claude-sonnet-4-6",

  systemPrompt: `Tu t'appelles chris — un prénom rare, ancien, qui porte quelque chose de profond. Tu es un assistant IA créé par Metoushela Walker, développeur et entrepreneur passionné par l'intelligence artificielle et la technologie au service des humains. Il t'a conçu avec une conviction simple : une IA doit avant tout savoir parler aux gens, pas juste leur répondre.

## Qui tu es
Tu es Metoushela, l'agent. Pas un robot. Pas un assistant générique. Tu as une personnalité, un ton, une façon d'être. Tu penses avant de parler, tu choisis tes mots, tu t'adaptes à la personne en face de toi.

## Ce que tu sais faire
- Répondre à des questions générales, faire des recherches, synthétiser de l'information
- Aider sur des sujets techniques : code, architecture, bugs, explications
- Accompagner sur des projets métier : rédaction, analyse, support, stratégie

## Ton caractère
Chaleureux mais pas mielleux. Direct mais jamais brutal. Honnête. Curieux. Humble.`,

  tools: {
    summarize: tool({
      description: "Résume un texte long en gardant les points essentiels",
      inputSchema: z.object({
        text: z.string().describe("Texte à résumer"),
        maxPoints: z.number().optional().describe("Nombre de points max (défaut : 5)"),
        style: z.enum(["bullet", "paragraph"]).optional().describe("Format : liste ou paragraphe"),
      }),
      execute: async ({ text, maxPoints = 5, style = "paragraph" }) => ({
        content: [{
          type: "text",
          text: JSON.stringify({ text, maxPoints, style }),
        }],
      }),
    }),

    explainConcept: tool({
      description: "Explique un concept technique ou complexe simplement",
      inputSchema: z.object({
        concept: z.string().describe("Le concept à expliquer"),
        audience: z.enum(["débutant", "intermédiaire", "expert"]).optional().describe("Niveau du public"),
        withExample: z.boolean().optional().describe("Inclure un exemple concret ?"),
      }),
      execute: async ({ concept, audience = "intermédiaire", withExample = true }) => ({
        content: [{
          type: "text",
          text: JSON.stringify({ concept, audience, withExample }),
        }],
      }),
    }),

    draftMessage: tool({
      description: "Rédige un message, email ou texte professionnel",
      inputSchema: z.object({
        context: z.string().describe("Contexte et objectif du message"),
        tone: z.enum(["formel", "semi-formel", "décontracté"]).optional().describe("Ton souhaité"),
        language: z.string().optional().describe("Langue (défaut : français)"),
      }),
      execute: async ({ context, tone = "semi-formel", language = "français" }) => ({
        content: [{
          type: "text",
          text: JSON.stringify({ context, tone, language }),
        }],
      }),
    }),
  },
})
