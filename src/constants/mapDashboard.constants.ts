import { ToolNode, UserProfile } from '../types/mapDashboard.types';

export const CURRENT_USER: UserProfile = {
    username: "SuperCEO_2024",
    companyName: "Young Innovators Inc.",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4" // Cartoon avatar
};

export const TOOL_NODES: ToolNode[] = [
    {
        id: '1',
        title: "Create Product Idea",
        iconType: 'idea',
        status: 'unlocked',
        stars: 3,
        position: { x: 15, y: 35 },
        badges: ['green', 'gold', 'blue'],
    },
    {
        id: '2',
        title: "Packaging Idea",
        iconType: 'package',
        status: 'unlocked',
        stars: 3,
        position: { x: 30, y: 60 },
        badges: ['green', 'gold', 'blue'],
    },
    {
        id: '3',
        title: "AI Logo Maker",
        iconType: 'logo',
        status: 'unlocked',
        stars: 3,
        position: { x: 50, y: 30 },
        badges: ['green', 'gold', 'blue'],
        hint: "AI-Powered Hint"
    },
    {
        id: '4',
        title: "Booth Ready Mode",
        iconType: 'booth',
        status: 'locked',
        stars: 0,
        position: { x: 70, y: 35 },
        badges: [],
        requiredTask: "Complete Packaging Idea to unlock"
    },
    {
        id: '5',
        title: "Profit Calculator",
        iconType: 'calc',
        status: 'locked',
        stars: 0,
        position: { x: 88, y: 40 },
        badges: [],
        requiredTask: "Complete Booth Ready Mode to unlock"
    }
];
