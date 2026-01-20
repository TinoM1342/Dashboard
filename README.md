# Rescale_Dashboard

Performance Considerations
    1) To efficiently fetch and display millions of jobs in the database,
        non-clustered covering indexes would used on the job name and current status.
        That way, when retrieved, the look up is expedited. Another way these jobs can be served
        quicker, is via cache helper in 
    
    2) Optimizations made were adding convering indexes to both tables Job and JobStatus,
        doing this opens up the avenue to add more functionality to the app and retrieve
        frequently queried data based upon job name, created_at or status_type.
        
