export interface ToolNode {
    id: string;
    title: string;
    iconType: 'idea' | 'package' | 'logo' | 'booth' | 'calc';
    status: 'locked' | 'unlocked' | 'completed';
    stars: number; // 0-3
    position: { x: number; y: number }; // Percentage relative to container
    badges: string[];
    hint?: string;
    requiredTask?: string; // For locked state tooltip
}

export interface UserProfile {
    username: string;
    companyName: string;
    avatarUrl: string;
}
