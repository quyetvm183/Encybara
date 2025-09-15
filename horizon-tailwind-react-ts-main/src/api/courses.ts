import { API_BASE_URL } from "service/api.config";
import { useAuth } from "hooks/useAuth";
import { method } from "lodash";
import { stringify } from "querystring";
const token = useAuth();
export const fetchCourses = async (courseId: number) => {
    const courses = fetch(`${API_BASE_URL}/api/v1/courses/${courseId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
    return courses
}
export const updateCourses = async (courses: any, courseId: number) => {
    const course = fetch(`${API_BASE_URL}/api/v1/courses/${courseId}`,
        {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(courses)
        }
    )
    return course
}
export const createCourses = async (courses: any, courseId: number) => {
    const course = fetch(`${API_BASE_URL}/api/v1/courses/${courseId}`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(courses)
        }
    )
    return course
}