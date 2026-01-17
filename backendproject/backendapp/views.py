from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Job, JobStatus
from .serializers import (JobListSerializer, JobCreateUpdateSerializer, JobStatusSerializer)


@api_view(['GET'])
def jobList(request):
    """GET /api/jobs - List all jobs with current status"""
    jobs = Job.objects.all()
    serializer = JobListSerializer(jobs, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def jobCreate(request):
    """POST /api/jobs - Create job + initial PENDING status"""
    serializerJob = JobCreateUpdateSerializer(data=request.data)
    
    if serializerJob.is_valid():
        serializerJob.save()

        JobStatus.objects.create(
            job=job,
            status_type=JobStatus.StatusTypes.PENDING
        )

        return Response(JobListSerializer(job).data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
def jobUpdate(request, pk):
    """PATCH /api/jobs/<id>/ - Update job + create new status entry"""
    try:
        job = Job.objects.get(pk=pk)
    except Job.DoesNotExist:
        return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = JobCreateUpdateSerializer(job,data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()

        new_status = request.data.get('status_type')
        if new_status in dict(JobStatus.StatusTypes.choices):
            JobStatus.objects.create(
                job=job,
                status_type=new_status
            )
        
        return Response(JobListSerializer(job).data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def jobDelete(request, pk):
    """DELETE /api/jobs/<id>/ - Delete job (cascades to JobStatus)"""
    try:
        job = Job.objects.get(pk=pk)
        job.delete()
        return Response({"message": "Job and all statuses deleted"}, status=status.HTTP_204_NO_CONTENT)
    except Job.DoesNotExist:
        return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)