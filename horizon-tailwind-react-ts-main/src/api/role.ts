import { API_BASE_URL } from "service/api.config";

export interface RolePayload {
    id?: number;
    name: string;
    description?: string;
    active?: boolean;
    permissions?: Array<number | { id: number }>;
}

export interface FetchRolesParams {
    page?: number;
    size?: number;
    keyword?: string;
    active?: boolean;
}

export const fetchRoles = async (params: FetchRolesParams = {}, token?: string | null) => {
    const { page = 1, size = 10, keyword, active } = params;
    const query = new URLSearchParams({ page: String(page), size: String(size) });
    if (keyword) query.append('keyword', keyword);
    if (typeof active === 'boolean') query.append('active', String(active));

    const response = await fetch(`${API_BASE_URL}/api/v1/roles?${query.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
    });
    return response;
};

export const fetchRoleById = async (roleId: number, token?: string | null) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/roles/${roleId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
    });
    return response;
};

export const createRole = async (payload: RolePayload, token?: string | null) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/roles`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
    });
    return response;
};

export const updateRole = async (payload: RolePayload, token?: string | null) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/roles`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
    });
    return response;
};

export const deleteRoleById = async (roleId: number, token?: string | null) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/roles/${roleId}`, {
        method: 'DELETE',
        headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
    });
    return response;
};

export const updateRolePermissions = async (roleId: number, permissionIds: number[], token?: string | null) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/roles/${roleId}/permissions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ permissionIds }),
    });
    return response;
};
