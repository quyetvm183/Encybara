import ApiService from '../service/api.service';
import { API_ENDPOINTS } from '../service/api.config';

// Types
export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    speciField: string;
    englishlevel: string;
}

export interface Review {
    id: number;
    userId: number;
    courseId: number;
    reContent: string;
    reSubject: string;
    numStar: number;
    numLike: number;
    status: string;
}

export interface Schedule {
    id: number;
    userId: number;
    courseId: number;
    isDaily: boolean;
    scheduleTime: string;
}

export interface Enrollment {
    id: number;
    userId: number;
    courseId: number;
    enrollmentDate: string;
    status: string;
}

export interface StudyResult {
    id: number;
    diffLevel: number;
    comLevel: number;
    totalPoints: number;
    sessionId: number;
}

export interface ApiResponse<T> {
    result?: T;
    data?: T;
    message?: string;
    success?: boolean;
    content?: T;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

// User API service
class UserApiService {
    private api = ApiService();

    // Get all users
    async getUsers(): Promise<User[]> {
        try {
            const response = await this.api.get<ApiResponse<User[]>>(API_ENDPOINTS.ADMIN.MANAGE_USERS);
            return response.result || [];
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    // Get user by ID
    async getUserById(id: number): Promise<User> {
        try {
            const response = await this.api.get<ApiResponse<User>>(`${API_ENDPOINTS.ADMIN.MANAGE_USERS}/${id}`);
            return response.result;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    }

    // Create new user
    async createUser(userData: Omit<User, 'id'>): Promise<User> {
        try {
            const response = await this.api.post<ApiResponse<User>>(API_ENDPOINTS.ADMIN.MANAGE_USERS, userData);
            return response.result;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    // Update user
    async updateUser(id: number, userData: Partial<User>): Promise<User> {
        try {
            const response = await this.api.put<ApiResponse<User>>(`${API_ENDPOINTS.ADMIN.MANAGE_USERS}/${id}`, userData);
            return response.result;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    // Delete user
    async deleteUser(id: number): Promise<void> {
        try {
            await this.api.delete(`${API_ENDPOINTS.ADMIN.MANAGE_USERS}/${id}`);
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    // Get user enrollments
    async getUserEnrollments(userId: number, page: number = 1, size: number = 100): Promise<PaginatedResponse<Enrollment>> {
        try {
            const response = await this.api.get<ApiResponse<PaginatedResponse<Enrollment>>>(`/api/v1/enrollments/user/${userId}?page=${page}&size=${size}`);
            return response.data || response.content || { content: [], totalElements: 0, totalPages: 0, size: 0, number: 0 };
        } catch (error) {
            console.error('Error fetching user enrollments:', error);
            throw error;
        }
    }

    // Get user reviews
    async getUserReviews(userId: number, page: number = 1, size: number = 100): Promise<Review[]> {
        try {
            const response = await this.api.get<ApiResponse<PaginatedResponse<Review>>>(`/api/v1/reviews/user/${userId}?page=${page}&size=${size}`);
            return response.data?.content || response.content?.content || [];
        } catch (error) {
            console.error('Error fetching user reviews:', error);
            throw error;
        }
    }

    // Get user schedules
    async getUserSchedules(userId: number, page: number = 1, size: number = 100): Promise<Schedule[]> {
        try {
            const response = await this.api.get<ApiResponse<PaginatedResponse<Schedule>>>(`/api/v1/schedules/user/${userId}?page=${page}&size=${size}`);
            return response.data?.content || response.content?.content || [];
        } catch (error) {
            console.error('Error fetching user schedules:', error);
            throw error;
        }
    }

    // Get lesson results for user
    async getLessonResults(userId: number, lessonId: number): Promise<StudyResult[]> {
        try {
            const response = await this.api.get<ApiResponse<PaginatedResponse<StudyResult>>>(`/api/v1/lesson-results/user/${userId}/lesson/${lessonId}`);
            return response.data?.content || response.content?.content || [];
        } catch (error) {
            console.error('Error fetching lesson results:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const userApiService = new UserApiService();
export default userApiService;
