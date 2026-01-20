from django.db import models

class Job(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Job {self.id}: {self.name}"
    
    @property
    def current_status(self):
        """Returns latest status for this job, used in serializer"""
        latest = self.jobStatus.order_by('-timestamp').first()
        return latest.status_type if latest else "UNKNOWN"
    
    class Meta:
        indexes = [
            models.Index(
                fields=['name'],  
                include=['created_at'],  
                name='job_name_covering_idx'
            ),
        ]

class JobStatus(models.Model):
    class StatusTypes(models.TextChoices):
        PENDING = "Pending"
        RUNNING = "Running"
        COMPLETED = "Completed"
        FAILED = "Failed"

    id = models.AutoField(primary_key=True)
    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name='jobStatus',
        verbose_name='Job Status Entry'
    )    
    status_type = models.CharField(
        max_length=25, 
        choices=StatusTypes.choices,
        default=StatusTypes.PENDING
        )
    timestamp = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-timestamp'] #latest first
        verbose_name_plural = "Job Statuses"
        indexes = [
            models.Index(
                fields=['job', '-timestamp'],  # Key columns (matches common queries and ordering)
                include=['status_type'],  # Covering column (frequently selected)
                name='jobstatus_latest_covering_idx'
            ),
        ]

    def __str__(self):
        return f"{self.job} - {self.status_type} at {self.timestamp}"