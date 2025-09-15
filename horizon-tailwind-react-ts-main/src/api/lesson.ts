import { API_BASE_URL } from "service/api.config";
import { Lesson } from "views/admin/profile/components/LessonList";

export const fetchCourseById = async (courseId: number, token: string | null) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/courses/${courseId}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }
    );
    return response;
};

export const addCourseLessons = async (courseId: number, lessonIds: number[], token: string | null) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/courses/${courseId}/lessons`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lessonIds }),
    });
    return response;
};

export const removeCourseLesson = async (courseId: number, lessonId: number, token: string | null) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/courses/${courseId}/lessons`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lessonId }),
    });
    return response;
};

export const deleteLessonById = async (lessonId: number, token: string | null) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/lessons/${lessonId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });
    return response;
};

export const fetchLessons = async (token: string | null, page = 1, size = 1000) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/lessons?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response;
};

export const fetchQuestions = async (token: string | null, page = 1, size = 1000) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/questions?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response;
};

export const addLessonQuestions = async (lessonId: number, questionIds: number[], token: string | null) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/lessons/${lessonId}/questions`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questionIds }),
    });
    return response;
};

export const removeLessonQuestion = async (lessonId: number, questionId: number, token: string | null) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/lessons/${lessonId}/questions`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questionId }),
    });
    return response;
};

export const updateLessonById = async (lessonId: number, lesson: Partial<Lesson>, token: string | null) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/lessons/${lessonId}`, {
        method: 'PUT',
        body: JSON.stringify(lesson),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    return response;
};

export const createLesson = async (lesson: Partial<Lesson>, token: string | null) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/lessons`, {
        method: 'POST',
        body: JSON.stringify(lesson),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    return response;
};

