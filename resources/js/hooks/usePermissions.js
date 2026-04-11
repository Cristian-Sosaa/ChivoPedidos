import { usePage } from '@inertiajs/react';

export function usePermissions() {
    const { auth } = usePage().props;
    const user = auth?.user;

    function can(permission) {
        if (!user?.permissions) return false;
        return user.permissions.includes(permission);
    }

    function hasRole(role) {
        if (!user?.roles) return false;
        return user.roles.includes(role);
    }

    function isAdmin() {
        return hasRole('admin');
    }

    return { can, hasRole, isAdmin, user };
}