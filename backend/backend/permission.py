from rest_framework.permissions import BasePermission
from api.models import UserRole

class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return UserRole.objects.filter(
            user=request.user,
            role__in=["Admin", "Master"]
        ).exists()