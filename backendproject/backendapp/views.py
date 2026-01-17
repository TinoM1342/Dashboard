from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import *
from .serializers import *

@api_view(['GET'])
def getJobs(request):
    jobs = Job.objects.all()
    serializer = JobSerializer(jobs, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def createJob(request):
    serializerJob = JobSerializer(data=request.data)
    serializerJobStatus = JobStatusSerializer(data=request.data)

    if serializerJob.is_valid():
        serializerJob.save()
    
    if serializerJobStatus.is_valid():
        serializerJobStatus.save()

@api_view(['PATCH'])
def updateJob(request):
    serializer = JobStatusSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

@api_view(['DELETE'])
def deleteJob(request, pk):
    job = Job.objects.get(id=pk)
    job.delete()
    return Response('Job and statuses deleted')