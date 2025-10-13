import React, { useState, useEffect } from "react";
import { IAdmin } from "api/admin";
import InputField from "components/fields/InputField";
import IconProvider from "components/icons/IconProvider";
import Select from "components/ui/Select";

export interface AdminFormData extends Omit<IAdmin, 'id'> {
  password?: string;
  roleId?: number;
}

export interface AdminFormProps {
  initialValues?: IAdmin;
  mode: 'create' | 'edit';
  onSubmit: (values: AdminFormData) => void;
  disabled?: boolean;
}

interface Role {
  id: number;
  name: string;
}

const AdminForm: React.FC<AdminFormProps> = ({
  initialValues,
  mode,
  onSubmit,
  disabled = false
}) => {
  const [formData, setFormData] = useState<AdminFormData>({
    name: initialValues?.name || '',
    email: initialValues?.email || '',
    field: initialValues?.field || '',
    roleId: initialValues?.role?.id
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AdminFormData, string>>>({});
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  // Load roles on mount
  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        // Replace with your actual API call
        const response = await fetch('/api/roles');
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error('Failed to fetch roles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof AdminFormData, string>> = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (mode === 'create' && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.roleId) {
      newErrors.roleId = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof AdminFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        error={errors.name}
        startIcon={<IconProvider name="person" size={20} />}
        disabled={disabled}
        required
      />

      <InputField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        error={errors.email}
        startIcon={<IconProvider name="mail" size={20} />}
        disabled={disabled}
        required
      />

      <InputField
        label="Field"
        name="field"
        value={formData.field || ''}
        onChange={handleInputChange}
        error={errors.field}
        startIcon={<IconProvider name="role" size={20} />}
        disabled={disabled}
      />

      <Select
        label="Role"
        value={formData.roleId}
        options={roles.map(role => ({
          value: role.id,
          label: role.name
        }))}
        onChange={(value) => {
          setFormData(prev => ({ ...prev, roleId: value as number }));
          if (errors.roleId) {
            setErrors(prev => ({ ...prev, roleId: undefined }));
          }
        }}
        error={errors.roleId}
        disabled={disabled || loading}
        required
      />

      {mode === 'create' && (
        <InputField
          label="Password"
          name="password"
          type="password"
          value={formData.password || ''}
          onChange={handleInputChange}
          error={errors.password}
          startIcon={<IconProvider name="lock" size={20} />}
          disabled={disabled}
          required
        />
      )}
    </form>
  );
};

export default AdminForm;