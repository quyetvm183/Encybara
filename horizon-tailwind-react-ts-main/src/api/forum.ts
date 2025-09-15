import { API_BASE_URL } from "service/api.config";
import { IDiscussion, IDiscussionReply, ILesson, ICourseReview, ICourseReviewStats } from "views/admin/forum/forum";


const fetchLessonDiscussions = async () => {
    try {
        const lessonsRes = await fetch(`${API_BASE_URL}/api/v1/lessons?size=200`);
        const lessonsData = await lessonsRes.json();

        // Fetch và lọc lessons có discussions
        const lessonsWithDiscussions = await Promise.all(
            lessonsData.data.content.map(async (lesson: ILesson) => {
                const discussionsRes = await fetch(
                    `${API_BASE_URL}/api/v1/discussions/lesson/${lesson.id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                        }
                    }
                );
                const discussionsData = await discussionsRes.json();

                // Chỉ lấy parent discussions (không có parentId)
                const parentDiscussions = discussionsData.data.content.filter(
                    (d: IDiscussion) => !d.parentId
                );

                if (parentDiscussions.length > 0) {
                    // Add user info cho parent discussions
                    const discussionsWithUsers = await Promise.all(
                        parentDiscussions.map((discussion: IDiscussion) => addUserInfo(discussion))
                    );
                    console.log("discussionsWithUsers", discussionsWithUsers);
                    return {
                        id: lesson.id,
                        name: lesson.name,
                        discussions: discussionsWithUsers
                    };
                }
                return null;
            })
        );

        return lessonsWithDiscussions;
    } catch (error) {
        console.error("Error fetching lessons and discussions:", error);
        return [];
    }
};

// Recursive function to add user info to discussion and replies
const addUserInfo = async (item: IDiscussionReply): Promise<IDiscussionReply> => {
    try {
        const userRes = await fetch(`${API_BASE_URL}/api/v1/users/${item.userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
            }
        });
        const userData = await userRes.json();

        // Recursively process replies
        const repliesWithUsers = await Promise.all(
            (item.replies || []).map(reply => addUserInfo(reply))
        );

        return {
            ...item,
            author: {
                name: userData.name,
                avatar: "https://randomuser.me/api/portraits/men/1.jpg"
            },
            replies: repliesWithUsers
        };
    } catch (error) {
        console.error(`Error fetching user data for discussion ${item.id}:`, error);
        return item;
    }
};
// Fetch all courses
const fetchCourses = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/api/v1/courses?size=1000`);
        const data = await res.json();
        return data.data.content || [];
    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
};

// Fetch reviews by course ID
const fetchReviewsByCourse = async (course: any): Promise<ICourseReview[]> => {
    try {
        const res = await fetch(`${API_BASE_URL}/api/v1/reviews/course/${course.id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
            }
        });
        const data = await res.json();

        // Fetch thông tin user cho mỗi review
        const reviewsWithUserInfo = await Promise.all(
            data.data.content.map(async (review: ICourseReview) => {
                const userRes = await fetch(`${API_BASE_URL}/api/v1/users/${review.userId}?page=1&size=4`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                    }
                });
                const userData = await userRes.json();

                return {
                    ...review,
                    author: {
                        id: userData.id,
                        name: userData.name,
                        avatar: "https://randomuser.me/api/portraits/men/1.jpg"
                    },
                    course: {
                        id: course.id,
                        name: course.name
                    }
                };
            })
        );

        return reviewsWithUserInfo;
    } catch (error) {
        console.error(`Error fetching reviews for course ${course.id}:`, error);
        return [];
    }
};

// Calculate course review statistics
const calculateReviewStats = (reviews: ICourseReview[]): ICourseReviewStats => {
    const totalReviews = reviews.length;
    const sumRatings = reviews.reduce((sum, review) => sum + review.numStar, 0);
    const averageRating = totalReviews > 0 ? sumRatings / totalReviews : 0;

    // Tính phân bố rating
    const distribution = {
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };
    reviews.forEach(review => {
        distribution[review.numStar as keyof typeof distribution]++;
    });

    // Tính top courses
    const courseStats = new Map<number, { name: string, totalRating: number, count: number }>();
    reviews.forEach(review => {
        if (review.course) {
            const current = courseStats.get(review.course.id) || {
                name: review.course.name,
                totalRating: 0,
                count: 0
            };
            courseStats.set(review.course.id, {
                name: review.course.name,
                totalRating: current.totalRating + review.numStar,
                count: current.count + 1
            });
        }
    });

    const topCourses = Array.from(courseStats.entries())
        .map(([id, stats]) => ({
            id,
            name: stats.name,
            rating: stats.totalRating / stats.count,
            reviewCount: stats.count
        }))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);

    return {
        totalReviews,
        averageRating,
        ratingDistribution: distribution,
        topCourses
    };
};

// Fetch all course reviews with statistics
const fetchAllCourseReviews = async (): Promise<{ reviews: ICourseReview[], stats: ICourseReviewStats }> => {
    try {
        const courses = await fetchCourses();
        const allReviews: ICourseReview[] = [];

        // Fetch reviews for each course
        for (const course of courses) {
            const courseReviews = await fetchReviewsByCourse(course);
            allReviews.push(...courseReviews);
        }

        const stats = calculateReviewStats(allReviews);

        return { reviews: allReviews, stats };
    } catch (error) {
        console.error("Error fetching all course reviews:", error);
        return {
            reviews: [],
            stats: {
                totalReviews: 0,
                averageRating: 0,
                ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                topCourses: []
            }
        };
    }
};
export { fetchLessonDiscussions, fetchCourses, fetchReviewsByCourse, calculateReviewStats, fetchAllCourseReviews };