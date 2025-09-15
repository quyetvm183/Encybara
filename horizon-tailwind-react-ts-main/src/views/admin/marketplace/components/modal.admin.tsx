import { ModalForm, ProForm, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, message, notification } from "antd";
import { useState, useEffect } from "react";
import { DebounceSelect } from "./debouce.select";
import {
    IAdmin,
    IRoleOption,
    createAdmin,
    updateAdmin,
    fetchRoleList,
    validateAdmin
} from "api/admin";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IAdmin | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

const ModalAdmin = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const [roles, setRoles] = useState<IRoleOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataInit?.id) {
            const formData = {
                ...dataInit,
                role: dataInit.role ? {
                    label: dataInit.role.name,
                    value: dataInit.role.id.toString()
                } : undefined
            };
            form.setFieldsValue(formData);
        }
    }, [dataInit, form]);

    const submitAdmin = async (valuesForm: any) => {
        const { name, email, password, field, role } = valuesForm;

        // Validate form data
        const adminData = {
            name,
            email,
            password,
            field,
            role: role ? { id: parseInt(role.value), name: role.label } : undefined
        };

        const errors = validateAdmin(adminData);
        if (errors.length > 0) {
            notification.error({
                message: 'Validation Error',
                description: errors.join(', '),
            });
            return;
        }

        setLoading(true);
        try {
            if (dataInit?.id) {
                // Update existing admin
                const updateData: IAdmin = {
                    id: dataInit.id,
                    name,
                    email,
                    password,
                    field,
                    role: { id: parseInt(role.value), name: role.label }
                };

                await updateAdmin(updateData);
                message.success("Admin updated successfully");
            } else {
                // Create new admin
                const createData = {
                    name,
                    email,
                    password,
                    field,
                    role: { id: parseInt(role.value), name: role.label }
                };

                await createAdmin(createData);
                message.success("Admin created successfully");
            }

            handleReset();
            reloadTable();
        } catch (error) {
            notification.error({
                message: 'Operation Failed',
                description: error instanceof Error ? error.message : 'Unknown error occurred',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        form.resetFields();
        setDataInit(null);
        setRoles([]);
        setOpenModal(false);
    };

    const fetchRoleOptions = async (search: string = ""): Promise<IRoleOption[]> => {
        try {
            return await fetchRoleList(search);
        } catch (error) {
            console.error('Error fetching roles:', error);
            notification.error({
                message: 'Failed to load roles',
                description: 'Please try again later'
            });
            return [];
        }
    };

    const fieldOptions = [
        { label: 'Information Technology', value: 'IT' },
        { label: 'Construction', value: 'CONSTRUCTION' },
        { label: 'Economics', value: 'ECONOMIC' },
        { label: 'Electrical Engineering', value: 'ELECTRICITY' },
    ];

    return (
        <ModalForm
            title={
                <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                            {dataInit?.id ? 'U' : 'C'}
                        </span>
                    </div>
                    <span>{dataInit?.id ? "Update Admin" : "Create New Admin"}</span>
                </div>
            }
            open={openModal}
            modalProps={{
                onCancel: handleReset,
                destroyOnClose: true,
                width: 900,
                keyboard: false,
                maskClosable: false,
                okText: dataInit?.id ? "Update Admin" : "Create Admin",
                cancelText: "Cancel",
                confirmLoading: loading,
            }}
            scrollToFirstError={true}
            preserve={false}
            form={form}
            onFinish={submitAdmin}
            layout="horizontal"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
        >
            <Row gutter={16}>
                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Email Address"
                        name="email"
                        rules={[
                            { required: true, message: 'Email is required' },
                            { type: 'email', message: 'Please enter a valid email address' }
                        ]}
                        placeholder="Enter email address"
                        disabled={loading}
                        fieldProps={{
                            size: 'large',
                        }}
                    />
                </Col>
                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText.Password
                        disabled={dataInit?.id ? true : false}
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: dataInit?.id ? false : true,
                                message: 'Password is required'
                            },
                            {
                                min: 6,
                                message: 'Password must be at least 6 characters'
                            }
                        ]}
                        placeholder={dataInit?.id ? "Cannot change password" : "Enter password"}
                        fieldProps={{
                            size: 'large',
                        }}
                        extra={dataInit?.id ? "Password cannot be changed when editing" : "Minimum 6 characters"}
                    />
                </Col>
            </Row>

            <Row gutter={16}>
                <Col lg={8} md={8} sm={24} xs={24}>
                    <ProFormText
                        label="Display Name"
                        name="name"
                        rules={[
                            { required: true, message: 'Display name is required' },
                            { min: 2, message: 'Name must be at least 2 characters' }
                        ]}
                        placeholder="Enter display name"
                        disabled={loading}
                        fieldProps={{
                            size: 'large',
                        }}
                    />
                </Col>
                <Col lg={8} md={8} sm={24} xs={24}>
                    <ProFormSelect
                        label="Field"
                        name="field"
                        options={fieldOptions}
                        rules={[{ required: true, message: 'Please select a field' }]}
                        placeholder="Select field"
                        disabled={loading}
                        fieldProps={{
                            size: 'large',
                        }}
                    />
                </Col>
                <Col lg={8} md={8} sm={24} xs={24}>
                    <ProForm.Item
                        name="role"
                        label="Role"
                        rules={[{ required: true, message: 'Please select a role' }]}
                    >
                        <DebounceSelect
                            allowClear
                            showSearch
                            placeholder="Select or search role"
                            fetchOptions={fetchRoleOptions}
                            onChange={(newValue: any) => {
                                setRoles(newValue ? [newValue] : []);
                            }}
                            style={{ width: '100%' }}
                            size="large"
                            disabled={loading}
                        />
                    </ProForm.Item>
                </Col>
            </Row>

            {/* Display current data for editing */}
            {dataInit?.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Current Information:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium">Created:</span> {dataInit.createdAt || 'N/A'}
                        </div>
                        <div>
                            <span className="font-medium">Last Updated:</span> {dataInit.updatedAt || 'N/A'}
                        </div>
                    </div>
                </div>
            )}
        </ModalForm>
    );
};

export default ModalAdmin;