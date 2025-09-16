import { API_BASE_URL } from "service/api.config";

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
import ApiService from '../service/api.service';

// Types
export interface Lesson {
    id: number;
    name: string;
    skillType: string;
    description?: string;
    content?: string;
    difficulty?: number;
    courseId?: number;
}

export interface ApiResponse<T> {
    result?: T;
    data?: T;
    message?: string;
    success?: boolean;
    content?: T;
}

// Lesson API service
class LessonApiService {
    private api = ApiService();

    // Get all lessons
    async getLessons(): Promise<Lesson[]> {
        try {
            const response = await this.api.get<ApiResponse<Lesson[]>>('/api/v1/lessons');
            return response.result || response.data || [];
        } catch (error) {
            console.error('Error fetching lessons:', error);
            throw error;
        }
    }

    // Get lesson by ID
    async getLessonById(id: number): Promise<Lesson> {
        try {
            const response = await this.api.get<ApiResponse<Lesson>>(`/api/v1/lessons/${id}`);
            return response.result || response.data;
        } catch (error) {
            console.error('Error fetching lesson:', error);
            throw error;
        }
    }

    // Get multiple lessons by IDs
    async getLessonsByIds(ids: number[]): Promise<Lesson[]> {
        try {
            const lessonsPromises = ids.map(id => this.getLessonById(id));
            const lessons = await Promise.all(lessonsPromises);
            return lessons;
        } catch (error) {
            console.error('Error fetching lessons by IDs:', error);
            throw error;
        }
    }

    // Get lessons by course ID
    async getLessonsByCourseId(courseId: number): Promise<Lesson[]> {
        try {
            // First get the course to get lesson IDs
            const courseResponse = await this.api.get<ApiResponse<{ lessonIds: number[] }>>(`/api/v1/courses/${courseId}`);
            const lessonIds = courseResponse.data?.lessonIds || courseResponse.result?.lessonIds || [];

            if (lessonIds.length === 0) {
                return [];
            }

            // Then get the lesson details
            return await this.getLessonsByIds(lessonIds);
        } catch (error) {
            console.error('Error fetching lessons by course ID:', error);
            throw error;
        }
    }

    // Create new lesson
    async createLesson(lessonData: Omit<Lesson, 'id'>): Promise<Lesson> {
        try {
            const response = await this.api.post<ApiResponse<Lesson>>('/api/v1/lessons', lessonData);
            return response.result || response.data;
        } catch (error) {
            console.error('Error creating lesson:', error);
            throw error;
        }
    }

    // Update lesson
    async updateLesson(id: number, lessonData: Partial<Lesson>): Promise<Lesson> {
        try {
            const response = await this.api.put<ApiResponse<Lesson>>(`/api/v1/lessons/${id}`, lessonData);
            return response.result || response.data;
        } catch (error) {
            console.error('Error updating lesson:', error);
            throw error;
        }
    }

    // Delete lesson
    async deleteLesson(id: number): Promise<void> {
        try {
            await this.api.delete(`/api/v1/lessons/${id}`);
        } catch (error) {
            console.error('Error deleting lesson:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const lessonApiService = new LessonApiService();
export default lessonApiService;

