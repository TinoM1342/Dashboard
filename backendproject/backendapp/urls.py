from django.urls import path
from . import views

urlpatterns = [
    path('jobs/', views.jobs, name='jobs'),  # Handles GET (list) and POST (create)
    path('jobs/<int:pk>/', views.job_detail, name='job-detail'),  # Handles PATCH (update) and DELETE (delete)
]