"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Progress }  from "../components/ui/progress"

function SubmissionProgressCard({ assignment, submission, onSubmit, onProgressUpdate }) {


  const isLate = submission?.status === "late"
  const isSubmitted = submission?.submitted

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="line-clamp-2">{assignment.title}</CardTitle>
        <CardDescription className="line-clamp-2">{assignment.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{submission?.progress || 0}%</span>
          </div>
          <Progress value={submission?.progress || 0} className="h-2" />
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${submission?.progress || 0}%` }}
            />
          </div>
        </div>

        <div className="text-sm space-y-1">
          <p className="text-muted-foreground">Due Date</p>
          <p className={`font-medium ${isLate ? "text-orange-600" : ""}`}>
            {new Date(assignment.dueDate).toLocaleDateString()}
            {isLate && " (Late)"}
          </p>
        </div>

        <div className="text-sm space-y-1">
          <p className="text-muted-foreground">Status</p>
          <p className={`font-medium ${isSubmitted ? " text-caribbeangreen-400" : "text-yellow-100"}`}>
            {submission?.status === "graded"
              ? "Graded"
              : isSubmitted
              ? "Submitted"
              : "Not Submitted"}
          </p>
        </div>

        {submission?.feedback && (
          <div className="text-sm space-y-1 p-2 bg-secondary rounded">
            <p className="text-muted-foreground">Feedback</p>
            <p>{submission.feedback}</p>
            {submission.grade !== undefined && (
              <p className="font-medium">Grade: {submission.grade}%</p>
            )}
          </div>
        )}

        <div className="flex gap-2 flex-col sm:flex-row">
          {!isSubmitted && (
            <>
              <Button onClick={onSubmit} className="sm:w-auto">
                Submit
              </Button>
            </>
          )}
          {assignment.driveLink && (
            <a href={assignment.driveLink} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                View Details
              </Button>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default SubmissionProgressCard
