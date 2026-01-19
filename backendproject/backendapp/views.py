from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Job, JobStatus
from .serializers import (JobListSerializer, JobCreateUpdateSerializer, JobStatusSerializer)


@api_view(['GET', 'POST'])
def jobs(request):
    """Handles GET /api/jobs/ (list) and POST /api/jobs/ (create)"""
    if request.method == 'GET':
        jobs_list = Job.objects.all()
        serializer = JobListSerializer(jobs_list, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = JobCreateUpdateSerializer(data=request.data)
        
        if serializer.is_valid():
            job = serializer.save()
            
            JobStatus.objects.create(
                job=job,
                status_type=JobStatus.StatusTypes.PENDING
            )
            
            return Response(JobListSerializer(job).data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH', 'DELETE'])
def job_detail(request, pk):
    """Handles PATCH /api/jobs/<id>/ (update) and DELETE /api/jobs/<id>/ (delete)"""
    try:
        job = Job.objects.get(pk=pk)
    except Job.DoesNotExist:
        return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'PATCH':
        serializer = JobCreateUpdateSerializer(job, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()

            new_status = request.data.get('status_type')
            if new_status and new_status in [choice[0] for choice in JobStatus.StatusTypes.choices]:
                JobStatus.objects.create(
                    job=job,
                    status_type=new_status
                )
            
            return Response(JobListSerializer(job).data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        job.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)