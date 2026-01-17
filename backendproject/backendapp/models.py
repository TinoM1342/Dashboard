from django.db import models

class Job(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class JobStatus(models.Model):
    id = models.IntegerField(primary_key=True)
    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name='jobStatus',
        verbose_name='JobStatus Job'
    ),
    class Status_Types(models.TextChoices):
        PENDING = "Pending"
        RUNNING = "Running"
        COMPLETED = "Completed"
        FAILED = "Failed"
    status_type = models.TextField(max_length=25, choices=Status_Types.choices)
    timestamp = models.DateTimeField(auto_now=True)