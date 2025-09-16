import ApiService from '../service/api.service';
import { API_ENDPOINTS } from '../service/api.config';

// Types
export interface Course {
    id: number;
    name: string;
    intro: string;
    diffLevel: number;
    recomLevel: number;
    courseType: string;
    speciField: string;
    lessonIds?: number[];
}

export interface Lesson {
    id: number;
    name: string;
    skillType: string;
    description?: string;
    content?: string;
    difficulty?: number;
}

export interface ApiResponse<T> {
    result?: T;
    data?: T;
    message?: string;
    success?: boolean;
    content?: T;
}

// Course API service
class CourseApiService {
    private api = ApiService();

    // Get all courses
    async getCourses(): Promise<Course[]> {
        try {
            const response = await this.api.get<ApiResponse<Course[]>>(API_ENDPOINTS.ADMIN.COURSE);
            return response.result || response.data || [];
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw error;
        }
    }

    // Get course by ID
    async getCourseById(id: number): Promise<Course> {
        try {
            const response = await this.api.get<ApiResponse<Course>>(`${API_ENDPOINTS.ADMIN.COURSE}/${id}`);
            return response.result || response.data;
        } catch (error) {
            console.error('Error fetching course:', error);
            throw error;
        }
    }

    // Get multiple courses by IDs
    async getCoursesByIds(ids: number[]): Promise<Course[]> {
        try {
            const coursesPromises = ids.map(id => this.getCourseById(id));
            const courses = await Promise.all(coursesPromises);
            return courses;
        } catch (error) {
            console.error('Error fetching courses by IDs:', error);
            throw error;
        }
    }

    // Create new course
    async createCourse(courseData: Omit<Course, 'id'>): Promise<Course> {
        try {
            const response = await this.api.post<ApiResponse<Course>>(API_ENDPOINTS.ADMIN.COURSE, courseData);
            return response.result || response.data;
        } catch (error) {
            console.error('Error creating course:', error);
            throw error;
        }
    }

    // Update course
    async updateCourse(id: number, courseData: Partial<Course>): Promise<Course> {
        try {
            const response = await this.api.put<ApiResponse<Course>>(`${API_ENDPOINTS.ADMIN.COURSE}/${id}`, courseData);
            return response.result || response.data;
        } catch (error) {
            console.error('Error updating course:', error);
            throw error;
        }
    }

    // Delete course
    async deleteCourse(id: number): Promise<void> {
        try {
            await this.api.delete(`${API_ENDPOINTS.ADMIN.COURSE}/${id}`);
        } catch (error) {
            console.error('Error deleting course:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const courseApiService = new CourseApiService();
export default courseApiService;
