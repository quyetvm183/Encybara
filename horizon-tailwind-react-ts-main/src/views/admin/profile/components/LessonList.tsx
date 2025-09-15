import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAuth } from "hooks/useAuth";
import React, { useEffect, useRef, useState } from "react";
import { Button, message, Popconfirm } from "antd";
import ModuleLesson from "./module.lesson";
import { notification } from "antd";
import { fetchCourseById, addCourseLessons, removeCourseLesson, deleteLessonById } from "api/lesson";
export interface Lesson {
    id: number;
    name: string;
    skillType: string;
    questionIds: number[];
}

interface LessonListProps {
    lessons: Lesson[];
    courseId: number;
    fetchLessons: () => void;
}

const LessonList: React.FC<LessonListProps> = ({ lessons, courseId, fetchLessons }) => {
    const { token } = useAuth();
    const [openModal, setOpenModal] = useState(false);
    const [selectedLessons, setSelectedLessons] = useState<number[]>([]);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    useEffect(() => {
        const fetchCourseLessons = async () => {
            try {
                const response = await fetchCourseById(courseId, token);
                const data = await response.json();
                if (response.ok) {
                    const courseLessonIds = data.data.lessonIds;
                    setSelectedLessons(courseLessonIds);
                }
            } catch (error) {
                console.error("Error fetching course lessons:", error);
            }
        };

        fetchCourseLessons();
    }, [courseId, token]);
    const toggleSelectLesson = async (lessonId: number) => {
        const isSelected = selectedLessons.includes(lessonId);

        if (isSelected) {
            try {
                const response = await removeCourseLesson(courseId, lessonId, token);

                if (response.ok) {
                    setSelectedLessons(prevSelected => prevSelected.filter(id => id !== lessonId));
                    message.success("Lesson removed successfully");
                } else {
                    notification.error({
                        message: "Error",
                        description: "Failed to remove lesson",
                        placement: "topRight",
                    });

                }
            } catch (error) {
                console.error("Error removing lesson:", error);
            }
        } else {
            try {
                const response = await addCourseLessons(courseId, [lessonId], token);
                if (response.ok) {
                    setSelectedLessons(prevSelected => [...prevSelected, lessonId]);
                    notification.success({
                        message: "Add lesson successfully",
                        placement: "topLeft",
                    });
                } else {
                    notification.error({
                        message: "Error",
                        description: "Failed to add lesson",
                        placement: "topRight",
                    });
                }
            } catch (error) {
                console.error("Error adding lesson:", error);
            }
        }
    };

    const handleEditLesson = (lesson: Lesson) => {
        setSelectedLesson(lesson);
        setOpenModal(true);
    };
    const handleDeleteLesson = async (lessonId: number) => {
        try {
            const response = await deleteLessonById(lessonId, token);
            if (response.ok) {
                message.success("Lesson removed successfully");
                fetchLessons();
            } else {
                message.error("Failed to remove lesson");
            }
        } catch (error) {
            console.error("Error removing lesson:", error);
        }
    };

    return (
        <div className="bg-white">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Lesson List</h3>
                <Button type="primary" className="hover:opacity-90" onClick={() => setOpenModal(true)}>Add Lesson</Button>
            </div>

            <div className="mt-8">
                <div className="max-h-[250px] overflow-y-auto">
                    <table className="w-full">
                        <thead className="sticky top-0 bg-gray-50 z-10">
                            <tr className="!border-px !border-gray-400">
                                <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">Choose</th>
                                <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">ID</th>
                                <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">Name</th>
                                <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">Skill Type</th>
                                <th className="border-b border-gray-200 pb-2 pr-4 pt-4 text-start">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lessons.map((lesson) => (
                                <tr key={lesson.id} className="hover:bg-gray-50">
                                    <td className="border-b border-gray-200 py-3 pr-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedLessons.includes(lesson.id)}
                                            onChange={() => toggleSelectLesson(lesson.id)}
                                        />
                                    </td>
                                    <td className="border-b border-gray-200 py-3 pr-4">{lesson.id}</td>
                                    <td className="border-b border-gray-200 py-3 pr-4">{lesson.name}</td>
                                    <td className="border-b border-gray-200 py-3 pr-4">{lesson.skillType}</td>
                                    <td className="border-b border-gray-200 py-3 pr-4">
                                        <EditOutlined
                                            style={{
                                                fontSize: 20,
                                                color: '#ffa500',
                                            }}
                                            type=""
                                            onClick={() => {
                                                handleEditLesson(lesson)
                                            }} />
                                        <Popconfirm
                                            placement="leftTop"
                                            title={"Confirm delete lesson"}
                                            description={"Are you sure you want to delete this lesson ?"}
                                            onConfirm={() => handleDeleteLesson(lesson.id)}
                                            okText="Ok"
                                            cancelText="Cancel"
                                        >
                                            <span style={{ cursor: "pointer", margin: "0 10px" }}>
                                                <DeleteOutlined
                                                    style={{
                                                        fontSize: 20,
                                                        color: '#ff4d4f',
                                                    }} />
                                            </span>
                                        </Popconfirm>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {openModal && (
                <ModuleLesson
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    reloadTable={fetchLessons}
                    listLesson={selectedLesson}
                    setListLesson={setSelectedLesson}
                />
            )}
        </div>
    );
};

export default LessonList;