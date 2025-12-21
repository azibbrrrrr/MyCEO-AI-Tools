import type { VercelRequest, VercelResponse } from "@vercel/node";
import Replicate from "replicate";

// Types
interface LogoWizardData {
    businessName: string;
    businessType?: "food" | "crafts" | "toys" | "accessories" | "diy";
    logoStyle?: "wordmark" | "symbol" | "emblem" | "mascot";
    colorPalette?: "pastel" | "bold" | "earth" | "bright" | "premium";
    vibe?: "cheerful" | "premium" | "minimal" | "playful" | "traditional";
    icon?: "star" | "fire" | "leaf" | "lightning" | "heart" | "animal";
    slogan?: string;
}

type LogoGenerationPlan = "free" | "premium";

// Helper function to build a prompt from logo wizard data
function buildPrompt(data: LogoWizardData, variation: number): string {
    const parts: string[] = [];

    parts.push(`A professional logo design for "${data.businessName}"`);

    if (data.businessType) {
        const typeMap: Record<string, string> = {
            food: "food business",
            crafts: "handmade crafts business",
            toys: "toy business",
            accessories: "accessories business",
            diy: "DIY business",
        };
        parts.push(`for a ${typeMap[data.businessType]}`);
    }

    if (data.logoStyle) {
        const styleMap: Record<string, string> = {
            wordmark: "wordmark style (text-based)",
            symbol: "symbol/icon style",
            emblem: "emblem style (badge-like)",
            mascot: "mascot style (character-based)",
        };
        parts.push(`in ${styleMap[data.logoStyle]}`);
    }

    if (data.colorPalette) {
        const colorMap: Record<string, string> = {
            pastel: "soft pastel colors",
            bold: "bold vibrant colors",
            earth: "earth tones and natural colors",
            bright: "bright and energetic colors",
            premium: "sophisticated premium colors",
        };
        parts.push(`with ${colorMap[data.colorPalette]}`);
    }

    if (data.vibe) {
        const vibeMap: Record<string, string> = {
            cheerful: "cheerful and friendly",
            premium: "premium and luxurious",
            minimal: "minimal and clean",
            playful: "playful and fun",
            traditional: "traditional and classic",
        };
        parts.push(`with a ${vibeMap[data.vibe]} vibe`);
    }

    if (data.icon) {
        const iconMap: Record<string, string> = {
            star: "star icon",
            fire: "fire icon",
            leaf: "leaf icon",
            lightning: "lightning icon",
            heart: "heart icon",
            animal: "animal icon",
        };
        parts.push(`featuring a ${iconMap[data.icon]}`);
    }

    if (data.slogan) {
        parts.push(`with the tagline "${data.slogan}"`);
    }

    parts.push(`- Variation ${variation + 1}`);
    parts.push("high quality, vector style, clean design, professional, modern");

    const prompt = parts.join(", ");
    console.log(prompt);
    return prompt;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 10000
): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error: any) {
            const isRateLimitError = error?.response?.status === 429;
            const isLastRetry = i === maxRetries - 1;

            if (isRateLimitError && !isLastRetry) {
                const retryAfter = error?.response?.headers?.get?.("retry-after");
                const delayMs = retryAfter
                    ? parseInt(retryAfter) * 1000 + 1000
                    : baseDelay * Math.pow(2, i);

                console.log(`Rate limited. Retrying after ${delayMs}ms...`);
                await delay(delayMs);
                continue;
            }

            throw error;
        }
    }
    throw new Error("Max retries exceeded");
}

export default async function handler(
    request: VercelRequest,
    response: VercelResponse
) {
    if (request.method !== "POST") {
        return response.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { logoWizardData, plan = "free" } = request.body as {
            logoWizardData: LogoWizardData;
            plan?: LogoGenerationPlan;
        };

        if (!logoWizardData || !logoWizardData.businessName) {
            return response.status(400).json({ error: "Business name is required" });
        }

        const replicate = new Replicate({
            auth: process.env.REPLICATE_API_TOKEN,
        });

        const basePrompt = buildPrompt(logoWizardData, 0);

        let output: any;

        if (plan === "premium") {
            output = await retryWithBackoff(async () => {
                return (await replicate.run("black-forest-labs/flux-schnell", {
                    input: {
                        prompt: basePrompt,
                        aspect_ratio: "1:1",
                        output_format: "png",
                        output_quality: 100,
                        num_outputs: 3,
                        num_inference_steps: 4,
                        go_fast: true,
                        disable_safety_checker: false,
                    },
                })) as any;
            });
        } else {
            output = await retryWithBackoff(async () => {
                return (await replicate.run("black-forest-labs/flux-schnell", {
                    input: {
                        prompt: basePrompt,
                        aspect_ratio: "1:1",
                        output_format: "webp",
                        output_quality: 80,
                        num_outputs: 3,
                        num_inference_steps: 4,
                        go_fast: true,
                        disable_safety_checker: false,
                    },
                })) as any;
            });
        }

        const logos = [];

        if (Array.isArray(output)) {
            for (let i = 0; i < output.length; i++) {
                const item = output[i];
                const imageUrl = typeof item === "string" ? item : item.url();

                logos.push({
                    id: `logo-${i + 1}-${Date.now()}`,
                    imageUrl: imageUrl,
                    prompt: basePrompt,
                    createdAt: new Date().toISOString(),
                    plan: plan,
                });
            }
        } else {
            const imageUrl = typeof output === "string" ? output : output.url();
            logos.push({
                id: `logo-1-${Date.now()}`,
                imageUrl: imageUrl,
                prompt: basePrompt,
                createdAt: new Date().toISOString(),
                plan: plan,
            });
        }

        return response.status(200).json({ logos, plan });
    } catch (error) {
        console.error("Error generating logos:", error);
        return response.status(500).json({
            error: "Failed to generate logos",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
