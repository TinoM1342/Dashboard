from django.urls import path
from . import views

urlpatterns = [
    path('jobs/', views.job_list, name='job-list'),
    path('jobs/', views.job_create, name='job-create'),  # POST to same path
    path('jobs/<int:pk>/', views.job_update, name='job-update'),
    path('jobs/<int:pk>/', views.job_delete, name='job-delete'),
]