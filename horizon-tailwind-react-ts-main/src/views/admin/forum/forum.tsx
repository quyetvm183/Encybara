import { Row, Col, Card, Form, Select, Table, Badge, Tag, Statistic, Input, DatePicker, Space, Progress, Tabs, List, Collapse, Avatar } from 'antd';
import { ArrowUpOutlined, MessageOutlined, EyeOutlined, LikeOutlined, StarOutlined, PlusOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { Button } from 'antd';
import { Rate } from 'antd';
import { API_BASE_URL } from 'service/api.config';
import { Comment as AntdComment } from '@ant-design/compatible';
import { FaDiscord, FaComments, FaStar } from 'react-icons/fa';
import { fetchLessonDiscussions, fetchAllCourseReviews } from 'api/forum';

export interface IDiscussionStats {
    totalDiscussions: number;
    totalComments: number;
    activeUsers: number;
    topCategories: { name: string, count: number }[];
    recentTrends: {
        daily: number;
        weekly: number;
        monthly: number;
    };
}

export interface IDiscussionReply {
    id: number;
    userId: number;
    lessonId: number;
    content: string;
    numLike: number;
    replies: IDiscussionReply[];
    author?: {
        name: string;
        avatar: string;
    };
    createdAt?: string;
    parentId?: number;
}

export interface IDiscussion extends IDiscussionReply {
    status: 'ACTIVE' | 'PENDING' | 'REPORTED' | 'HIDDEN';
}

export interface ICourseReviewStats {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: {
        [key: number]: number;
    };
    topCourses: {
        id: number;
        name: string;
        rating: number;
        reviewCount: number;
    }[];
}

export interface ICourseReview {
    id: number;
    userId: number;
    courseId: number;
    reContent: string;
    reSubject: string;
    numStar: number;
    numLike: number;
    status: 'CONTRIBUTING' | 'CONTENT' | 'MISTAKE';
    author?: {
        id: number;
        name: string;
        avatar: string;
    };
    course?: {
        id: number;
        name: string;
    };
    createdAt?: Date;
}

export interface ILesson {
    id: number;
    name: string;
    discussions: IDiscussion[];
}

const ForumManagement = () => {
    const [activeTab, setActiveTab] = useState('discussions');

    const DiscussionsTab = () => {
        const [loading, setLoading] = useState(false);
        const [lessons, setLessons] = useState<ILesson[]>([]);

        useEffect(() => {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const lessonDiscussData = await fetchLessonDiscussions();
                    setLessons(lessonDiscussData.filter(Boolean));
                } catch (error) {
                    console.error('Error fetching discussions:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }, []);

        return (
            <div>
                <List
                    loading={loading}
                    dataSource={lessons}
                    grid={{ gutter: 16, column: 2 }}
                    renderItem={lesson => (
                        <List.Item>
                            <Collapse
                                style={{
                                    width: '100%',
                                    background: 'transparent'
                                }}
                            >
                                <Collapse.Panel
                                    style={{
                                        border: '1px solid #e8e8e8',
                                        borderRadius: '8px',
                                        marginBottom: '12px',
                                        background: 'white',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                    }}
                                    header={
                                        <Space direction="vertical" style={{ width: '100%' }}>
                                            <Space>
                                                <span style={{
                                                    fontWeight: 'bold',
                                                    background: 'linear-gradient(45deg, #4776E6, #8E54E9)',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent'
                                                }}>
                                                    {lesson.name}
                                                </span>
                                                <Badge
                                                    count={lesson.discussions.length}
                                                    style={{
                                                        background: '#4776E6',
                                                        boxShadow: '0 2px 4px rgba(71,118,230,0.3)'
                                                    }}
                                                />
                                            </Space>
                                            {lesson.discussions[0] && (
                                                <div style={{ color: 'rgba(0, 0, 0, 0.65)', fontSize: '14px' }}>
                                                    <Space>
                                                        <Avatar size="small" src={lesson.discussions[0].author?.avatar} />
                                                        <span>{lesson.discussions[0].content.substring(0, 100)}{lesson.discussions[0].content.length > 100 ? '...' : ''}</span>
                                                    </Space>
                                                </div>
                                            )}
                                        </Space>
                                    }
                                    key={lesson.id}
                                >
                                    {lesson.discussions.map(discussion => (
                                        <Card
                                            key={discussion.id}
                                            style={{ marginBottom: 8 }}
                                            bodyStyle={{ padding: 6 }}
                                        >
                                            <AntdComment
                                                author={discussion.author?.name}
                                                avatar={<Avatar src={discussion.author?.avatar} />}
                                                content={discussion.content}
                                                datetime={discussion.createdAt}
                                                actions={[
                                                    <Space key="actions">
                                                        <span><LikeOutlined /> {discussion.numLike}</span>
                                                        <span>
                                                            <MessageOutlined /> {discussion.replies?.length || 0} replies
                                                        </span>
                                                    </Space>
                                                ]}
                                            />
                                            {(discussion.replies?.length > 0) && (
                                                <Collapse ghost style={{ padding: 0 }}>
                                                    <Collapse.Panel header="View replies" key="1">
                                                        {discussion.replies?.map(reply => (
                                                            <AntdComment
                                                                key={reply.id}
                                                                author={reply.author?.name}
                                                                avatar={<Avatar src={reply.author?.avatar} />}
                                                                content={reply.content}
                                                                datetime={reply.createdAt}
                                                                actions={[
                                                                    <Space key="actions">
                                                                        <span><LikeOutlined /> {reply.numLike}</span>
                                                                    </Space>
                                                                ]}
                                                            />
                                                        ))}
                                                    </Collapse.Panel>
                                                </Collapse>
                                            )}
                                        </Card>
                                    ))}
                                </Collapse.Panel>
                            </Collapse>
                        </List.Item>
                    )}
                />
            </div>
        );
    };

    const CourseReviewsTab = () => {
        const [loading, setLoading] = useState(false);
        const [reviews, setReviews] = useState<ICourseReview[]>([]);
        const [stats, setStats] = useState<ICourseReviewStats>({
            totalReviews: 0,
            averageRating: 0,
            ratingDistribution: {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0
            },
            topCourses: []
        });

        // Pagination states
        const [pagination, setPagination] = useState({
            current: 1,
            pageSize: 10,
            total: 0,
            showSizeChanger: true,
            showTotal: (total: number, range: [number, number]) =>
                `${range[0]}-${range[1]} of ${total} reviews`,
            pageSizeOptions: ['5', '10', '20', '50']
        });

        useEffect(() => {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const { reviews: allReviews, stats: reviewStats } = await fetchAllCourseReviews();
                    setReviews(allReviews);
                    setStats(reviewStats);
                    setPagination(prev => ({
                        ...prev,
                        total: allReviews.length
                    }));
                } catch (error) {
                    console.error("Error when fetch data:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }, []);

        const handleTableChange = (page: number, size: number) => {
            setPagination(prev => ({
                ...prev,
                current: page,
                pageSize: size
            }));
        };

        const renderReviewContent = (record: ICourseReview) => (
            <Space direction="vertical">
                <div>
                    <span style={{ fontWeight: 500 }}>{record.course?.name}</span>
                    {record.status === 'MISTAKE' && (
                        <Tag color="red" style={{ marginLeft: 8 }}>
                            Reported
                        </Tag>
                    )}
                </div>
                <p style={{ margin: 0 }}>{record.reContent}</p>
                <Space>
                    <span><LikeOutlined /> {record.numLike} likes</span>
                </Space>
            </Space>
        );

        return (
            <div>
                {/* Stats Overview */}
                <Row gutter={[16, 16]} className="mb-6">
                    {/* Column 1: Total Reviews & Average Rating */}
                    <Col span={4}>
                        <Space direction="vertical" style={{ width: '100%' }} size={16}>
                            <Card>
                                <Statistic
                                    title="Total Reviews"
                                    value={stats.totalReviews}
                                    prefix={<MessageOutlined />}
                                />
                            </Card>
                            <Card>
                                <Statistic
                                    title="Average Rating"
                                    value={stats.averageRating}
                                    prefix={<StarOutlined />}
                                    precision={1}
                                />
                                <Rate
                                    disabled
                                    value={stats.averageRating}
                                    allowHalf
                                    style={{
                                        fontSize: 14,
                                        color: '#fadb14'
                                    }}
                                />
                            </Card>
                        </Space>
                    </Col>

                    {/* Column 2: Rating Distribution */}
                    <Col span={6}>
                        <Card title="Rating Distribution" style={{ height: '100%' }}>
                            {Object.entries(stats.ratingDistribution).reverse().map(([rating, count]) => (
                                <div key={rating} style={{ marginBottom: 8 }}>
                                    <Space align="center" style={{ width: '100%' }}>
                                        <span style={{ width: 60 }}>{rating} stars</span>
                                        <Progress
                                            percent={Math.round((count / stats.totalReviews) * 100)}
                                            strokeColor="#fadb14"
                                            size="small"
                                            style={{ flex: 1, margin: 0 }}
                                            format={percent => `${percent}%`}
                                        />
                                    </Space>
                                </div>
                            ))}
                        </Card>
                    </Col>

                    {/* Column 3: Top Rated Courses */}
                    <Col span={14}>
                        <Card
                            title="Top Rated Courses"
                            style={{ height: '100%' }}
                            bodyStyle={{
                                height: 'calc(100% - 58px)',
                                overflowY: 'auto',
                                paddingRight: 8
                            }}
                        >
                            <Row gutter={[8, 8]}>
                                {stats.topCourses.slice(0, 4).map((course, index) => (
                                    <Col span={12} key={course.id}>
                                        <Card
                                            size="small"
                                            bordered={false}
                                            style={{
                                                background: '#f5f5f5',
                                                height: '100%'
                                            }}
                                        >
                                            <div>
                                                <h4 style={{
                                                    margin: '0 0 8px 0',
                                                    fontSize: '14px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {course.name}
                                                </h4>
                                                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                                                    <Rate
                                                        disabled
                                                        defaultValue={course.rating}
                                                        style={{ fontSize: 12 }}
                                                    />
                                                </Space>
                                            </div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Card>
                    </Col>
                </Row>

                {/* Reviews Table */}
                <Table
                    loading={loading}
                    dataSource={reviews}
                    pagination={{
                        ...pagination,
                        onChange: handleTableChange,
                        onShowSizeChange: handleTableChange
                    }}
                    columns={[
                        {
                            title: 'Review',
                            key: 'review',
                            render: renderReviewContent
                        },
                        {
                            title: 'Author',
                            key: 'author',
                            render: (_, record) => (
                                <Space direction="vertical">
                                    <Space>
                                        {record.author && (
                                            <>
                                                <img
                                                    src={record.author.avatar}
                                                    alt={record.author.name}
                                                    style={{ width: 32, height: 32, borderRadius: '50%' }}
                                                />
                                                <span>{record.author.name}</span>
                                            </>
                                        )}
                                    </Space>
                                    <small>Completed course on {new Date().toLocaleDateString()}</small>
                                </Space>
                            )
                        },
                        {
                            title: 'Status',
                            key: 'status',
                            render: (_, record) => {
                                const colors = {
                                    CONTRIBUTING: 'green',
                                    CONTENT: 'gold',
                                    MISTAKE: 'red',
                                };
                                return <Tag color={colors[record.status]}>{record.status}</Tag>;
                            }
                        },
                        {
                            title: 'Rating',
                            key: 'numStar',
                            render: (_, record) => (
                                <Rate disabled defaultValue={record.numStar} style={{ marginLeft: 8 }} />
                            )
                        }
                    ]}
                />
            </div>
        );
    };

    return (
        <div>
            <div style={{
                marginBottom: 16,
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 20,
                background: 'linear-gradient(to right, #4776E6, #8E54E9)',
                padding: '20px',
                borderRadius: '12px',
                color: 'white'
            }}>
                <div>
                    <h2 style={{
                        color: 'white',
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <FaDiscord size={24} />
                        Forum Management
                    </h2>
                    <p style={{ margin: '8px 0 0 0', opacity: 0.8 }}>
                        Manage all discussions and reviews in one place
                    </p>
                </div>
            </div>

            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                    {
                        key: 'discussions',
                        label: (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaComments />
                                Discussions
                            </span>
                        ),
                        children: <DiscussionsTab />
                    },
                    {
                        key: 'reviews',
                        label: (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaStar />
                                Course Reviews
                            </span>
                        ),
                        children: <CourseReviewsTab />
                    }
                ]}
                type="card"
                style={{
                    marginBottom: '20px'
                }}
            />
        </div>
    );
};

export default ForumManagement;