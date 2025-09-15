import { API_BASE_URL } from "service/api.config";
import { useAuth } from "hooks/useAuth";
import { User, LearningResult, CombinedLearningResult } from "views/admin/learning/learning.results";
const token = useAuth();
const fetchUsers = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/users`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        return data.result || []
    } catch (error) {
        console.error("Error fetching users:", error);
    }
};

const fetchLearningResults = async (userId: number, userList: User[]) => {
    try {
        const endpoint = userId === -1
            ? `${API_BASE_URL}/api/v1/admin/learning-results`
            : `${API_BASE_URL}/api/v1/learning-results/user/${userId}`;

        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch learning results`);
        }

        const responseData = await response.json();

        if (userId === -1) {
            if (responseData && responseData.data.content && Array.isArray(responseData.data.content)) {
                const combinedResults: CombinedLearningResult[] = await Promise.all(
                    responseData.data.content.map(async (result: LearningResult) => {
                        const user = userList.find(u => u.id === result.userId) || {
                            id: result.userId || 0,
                            name: 'Unknown',
                            email: '',
                            phone: null,
                            speciField: null,
                            avatar: null,
                            englishlevel: null
                        };

                        return {
                            ...result,
                            user
                        };
                    })
                );

                return combinedResults
            } else {
                return []
            }
        } else {
            if (responseData && responseData.data) {
                const selectedUser = userList.find(u => u.id === userId) || {
                    id: userId,
                    name: 'Unknown',
                    email: '',
                    phone: null,
                    speciField: null,
                    avatar: null,
                    englishlevel: null
                };

                if (Array.isArray(responseData.data)) {
                    const combinedResults: CombinedLearningResult[] = responseData.data.map((result: LearningResult) => ({
                        ...result,
                        user: selectedUser
                    }));
                    return combinedResults
                } else {
                    const combinedResult: CombinedLearningResult = {
                        ...responseData.data,
                        user: selectedUser
                    };
                    return ([combinedResult]);
                }
            } else {
                return []
            }
        }
    } catch (error) {
        console.error(`Error fetching learning results:`, error);
        return ([])
    }
};

export { fetchUsers, fetchLearningResults }