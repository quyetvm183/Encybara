import { API_BASE_URL } from "service/api.config";

export interface QuestionChoicePayload {
    id?: number;
    choiceContent: string;
    choiceKey: boolean;
}

export interface QuestionPayload {
    id?: number;
    quesContent: string;
    keyword: string;
    quesType: string;
    skillType: string;
    point: number;
    quesMaterial: string;
    questionChoices: QuestionChoicePayload[];
}

export const createQuestion = async (question: QuestionPayload, token?: string | null) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/questions`, {
        method: 'POST',
        body: JSON.stringify(question),
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
    });
    return response;
};

export const updateQuestion = async (question: QuestionPayload, token?: string | null) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/questions`, {
        method: 'PUT',
        body: JSON.stringify(question),
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
    });
    return response;
};

export const deleteQuestionById = async (questionId: number, token?: string | null) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/questions/${questionId}`, {
        method: 'DELETE',
        headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
    });
    return response;
};

export interface FetchQuestionsParams {
    page?: number;
    size?: number;
    point?: number | string;
    quesType?: string;
    skillType?: string;
    keyword?: string;
}

export const fetchQuestions = async (params: FetchQuestionsParams = {}, token?: string | null) => {
    const { page = 1, size = 10, point, quesType, skillType, keyword } = params;
    const query = new URLSearchParams({ page: String(page), size: String(size) });
    if (point !== undefined) query.append('point', String(point));
    if (quesType) query.append('quesType', quesType);
    if (skillType) query.append('skillType', skillType);
    if (keyword) query.append('keyword', keyword);

    const response = await fetch(`${API_BASE_URL}/api/v1/questions?${query.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
    });
    return response;
};

export interface AssignMaterialPayload {
    materLink: string;
    materType: string;
    questionId: number;
}

export const assignMaterialToQuestion = async (payload: AssignMaterialPayload, token?: string | null) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/material/assign/question`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
    });
    return response;
};

export const deleteMaterialById = async (materialId: number, token?: string | null) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/material/${materialId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
    });
    return response;
};

export const getMaterialsByQuestion = async (questionId: number, token?: string | null) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/material/questions/${questionId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
    });
    return response;
};
