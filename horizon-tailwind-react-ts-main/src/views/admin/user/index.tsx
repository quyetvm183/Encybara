import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserProfile from "./components/UserProfile";
import { useAuth } from "hooks/useAuth";
import Access from "../access";
import { App } from 'antd';
import { userApiService, User, Review, Schedule } from "api/user";
import { courseApiService, Course } from "api/course";
const UserProfilePage: React.FC = () => {
    const { message, notification } = App.useApp();
    const { token } = useAuth();
    const { userId } = useParams<{ userId: string }>();
    const [userData, setUserData] = useState<User | null>(null);
    const [coursesData, setCoursesData] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reviewsData, setReviewsData] = useState<Review[]>([]);
    const [scheduleData, setScheduleData] = useState<Schedule[]>([]);

    useEffect(() => {
        console.log("Fetched User ID:", userId);

        if (!userId) {
            console.error("User ID is undefined or empty");
            setError("Invalid User ID");
            setLoading(false);
            return;
        }

        const fetchUserData = async () => {
            try {
                setLoading(true);

                // Fetch user data
                const user = await userApiService.getUserById(parseInt(userId));
                setUserData(user);

                // Fetch user enrollments and get course details
                const enrollments = await userApiService.getUserEnrollments(parseInt(userId));
                const courseIds = enrollments.content.map(item => item.courseId);

                if (courseIds.length > 0) {
                    const courses = await courseApiService.getCoursesByIds(courseIds);
                    setCoursesData(courses);
                }

                // Fetch user reviews and schedules in parallel
                const [reviews, schedules] = await Promise.all([
                    userApiService.getUserReviews(parseInt(userId)),
                    userApiService.getUserSchedules(parseInt(userId))
                ]);

                setReviewsData(reviews);
                setScheduleData(schedules);

            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to fetch data");
                message.error("Failed to load user data");
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchUserData();
        }
    }, [token, userId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-gray-500">Loading user profile...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-gray-500">User not found</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <UserProfile
                user={userData}
                courses={coursesData}
                reviews={reviewsData}
                schedules={scheduleData}
            />
        </div>
    );
};

export default () => (
    <App>
        <UserProfilePage />
    </App>
);
