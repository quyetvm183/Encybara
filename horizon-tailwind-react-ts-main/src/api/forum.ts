import { API_BASE_URL } from "service/api.config";
import { IDiscussion, IDiscussionReply, ILesson } from "views/admin/forum/forum";


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
export { fetchLessonDiscussions };