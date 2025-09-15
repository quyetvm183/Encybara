import { API_BASE_URL } from "service/api.config";
export interface IPermission {
    id?: number;
    name?: string;
    apiPath?: string;
    method?: string;
    module?: string;

    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;

}

export const updatePermissions = async (permission: any) => {
    const update = fetch(`${API_BASE_URL}/api/v1/permissions`, { // Thêm id vào URL
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(permission),
    });
    return update;
}
export const createPermissions = async (permission: any) => {
    const create = fetch(`${API_BASE_URL}/api/v1/permissions`, { // Thêm id vào URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(permission),
    });
    return create;
}
export const fetchPermissions = async () => {
    const data = fetch(`${API_BASE_URL}/api/v1/permissions?page=1&size=1000`);
    return data;
}
export const deletePermissions = async (id: number) => {
    const deleteData = fetch(`${API_BASE_URL}/api/v1/permissions/${id}`, {
        method: 'DELETE',
    });
    return deleteData
}