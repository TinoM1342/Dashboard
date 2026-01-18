from django.urls import path
from . import views

urlpatterns = [
    path('jobs/', views.jobList, name='job-list'),
    path('jobs/', views.jobCreate, name='job-create'),  # POST to same path
    path('jobs/<int:pk>/', views.jobUpdate, name='job-update'),
    path('jobs/<int:pk>/', views.jobDelete, name='job-delete'),
]