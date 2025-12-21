export interface LogoWizardData {
    businessName: string;
    businessType?: "food" | "crafts" | "toys" | "accessories" | "diy";
    logoStyle?: "wordmark" | "symbol" | "emblem" | "mascot";
    colorPalette?: "pastel" | "bold" | "earth" | "bright" | "premium";
    vibe?: "cheerful" | "premium" | "minimal" | "playful" | "traditional";
    icon?: "star" | "fire" | "leaf" | "lightning" | "heart" | "animal";
    slogan?: string;
}

export type LogoGenerationPlan = "free" | "premium";

export interface GeneratedLogo {
    id: string;
    imageUrl: string;
    prompt: string;
    createdAt: string;
    plan: LogoGenerationPlan;
}

export interface LogoGenerationResponse {
    logos: GeneratedLogo[];
    plan: LogoGenerationPlan;
}

export interface LogoGenerationError {
    error: string;
    details?: string;
}
