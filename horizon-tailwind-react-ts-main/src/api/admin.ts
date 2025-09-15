import { API_BASE_URL } from "service/api.config";

export interface IAdmin {
    id?: number;
    name: string;
    email: string;
    password?: string;
    field?: string;
    role?: {
        id: number;
        name: string;
    };
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface IRole {
    id: number;
    name: string;
}

export interface IRoleOption {
    label: string;
    value: string;
}

export interface ApiResponse<T> {
    success: boolean;
    result: T;
    message?: string;
}

// Lấy danh sách admins
export const fetchAdmins = async (): Promise<IAdmin[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/admins`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse<IAdmin[]> = await response.json();
        return data.result || [];
    } catch (error) {
        console.error("Error fetching admins:", error);
        throw new Error("Failed to fetch admins");
    }
};

// Tạo admin mới
export const createAdmin = async (admin: Omit<IAdmin, 'id'>): Promise<IAdmin> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/admins`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
            },
            body: JSON.stringify(admin),
        });

        const data: ApiResponse<IAdmin> = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to create admin');
        }

        return data.result;
    } catch (error) {
        console.error("Error creating admin:", error);
        throw error;
    }
};

// Cập nhật admin
export const updateAdmin = async (admin: IAdmin): Promise<IAdmin> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/admins`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
            },
            body: JSON.stringify(admin),
        });

        const data: ApiResponse<IAdmin> = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to update admin');
        }

        return data.result;
    } catch (error) {
        console.error("Error updating admin:", error);
        throw error;
    }
};

// Xóa admin
export const deleteAdmin = async (id: number): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/admins/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to delete admin');
        }
    } catch (error) {
        console.error("Error deleting admin:", error);
        throw error;
    }
};

export const fetchRoleList = async (name: string): Promise<IRoleOption[]> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/roles`);
    const data = await res.json();
    console.log("data", data);
    if (data) {

        const list = data.result;
        const temp = list.map((item: any) => {
            return {
                label: item.name as string,
                value: item.id as string
            }
        })
        return temp;
    } else return [];
}
// Helper function để validate admin data
export const validateAdmin = (admin: Partial<IAdmin>): string[] => {
    const errors: string[] = [];

    if (!admin.name?.trim()) {
        errors.push("Name is required");
    }

    if (!admin.email?.trim()) {
        errors.push("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(admin.email)) {
        errors.push("Email format is invalid");
    }

    if (!admin.id && !admin.password?.trim()) {
        errors.push("Password is required for new admin");
    }

    if (!admin.field?.trim()) {
        errors.push("Field is required");
    }

    if (!admin.role?.id) {
        errors.push("Role is required");
    }

    return errors;
};