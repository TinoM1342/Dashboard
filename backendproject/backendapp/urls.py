from django.urls import path
from . import views

urlpatterns = [
    path('jobs/<str:pk>', views.getJobs),
    path('jobs', views.createJob),
    path('jobs', views.updateJob),
    path('jobs', views.deleteJob)
]