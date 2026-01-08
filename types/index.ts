export type ReviewType = "security" | "performance" | "readability" | "testing" | "general";

export interface CodeReview {
    id: string;
    code: string;
    language: string;
    reviewType: ReviewType;
    aiResponse: string;
    timestamp: number;
    title?: string;
}

export interface ReviewRequest {
    code: string;
    language: string;
    reviewType: ReviewType;
}