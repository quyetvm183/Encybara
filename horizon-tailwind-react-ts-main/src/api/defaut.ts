import { API_BASE_URL } from "service/api.config";

const fetchUser = async () => {
    const res = await fetch(`${API_BASE_URL}/api/v1/users`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
            }
        }
    );
    const data = await res.json();
    return data.meta.total;
};
const fetchCourse = async () => {
    const res = await fetch(`${API_BASE_URL}/api/v1/courses`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
            }
        }
    );
    const data = await res.json();
    return data.data.totalElements;
};
const fetchQuestion = async () => {
    const res = await fetch(`${API_BASE_URL}/api/v1/questions`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',

            }
        }
    );
    const data = await res.json();
    return data.data.totalElements;
};
const fetchLesson = async () => {
    const res = await fetch(`${API_BASE_URL}/api/v1/lessons`,
        {
            method: 'GET',
        }
    );
    const data = await res.json();
    return data.data.totalElements;
};
export { fetchUser, fetchCourse, fetchQuestion, fetchLesson };