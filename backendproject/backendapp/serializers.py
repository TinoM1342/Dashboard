from rest_framework import serializers
from .models import Job, JobStatus

class JobStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobStatus
        fields = ['id', 'status_type', 'timestamp']

class JobListSerializer(serializers.ModelSerializer):
    current_status = serializers.CharField(read_only=True)

    class Meta:
        model = Job
        fields = ['id', 'name', 'created_at', 'updated_at', 'current_status']

class JobCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['id', 'name']
        