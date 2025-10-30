"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getAllAssignments,
  getSubmissionsByStudent,
  getStudentProgress,
  submitAssignment,
  updateSubmissionProgress,
} from "../lib/data_store";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import  SubmissionProgressCard  from "../_components/SubmissionProgressCard";

function StudentDashboard() {
  const { user, logout } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(null);
  const [assignments] = useState(() => getAllAssignments());
  const [submissions] = useState(() => getSubmissionsByStudent(user?.id || ""));
  const [progress] = useState(() => getStudentProgress(user?.id || ""));

  const handleSubmit = (assignmentId) => {
    submitAssignment(assignmentId, user?.id || "");
    setShowConfirmation(null);
    window.location.reload();
  };

  const handleProgressUpdate = (assignmentId, newProgress) => {
    updateSubmissionProgress(assignmentId, user?.id || "", newProgress);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Assignment Manager</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
          </div>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-richblack-600 font-bold">{progress.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Submitted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{progress.submitted}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progress.averageProgress}%</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Assignments</h2>
          {assignments.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">No assignments yet</CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignments.map((assignment) => {
                const submission = submissions.find((s) => s.assignmentId === assignment.id);
                return (
                  <SubmissionProgressCard
                    key={assignment.id}
                    assignment={assignment}
                    submission={submission}
                    onSubmit={() => setShowConfirmation(assignment.id)}
                    onProgressUpdate={(progress) => handleProgressUpdate(assignment.id, progress)}
                  />
                );
              })}
            </div>
          )}
        </div>

        {showConfirmation && (
          <div className="fixed   inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-richblack-200 bg-opacity-10 backdrop-blur-sm">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Confirm Submission</CardTitle>
                <CardDescription>Are you sure you want to submit this assignment?</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button onClick={() => handleSubmit(showConfirmation)} className="flex-1">
                  Confirm
                </Button>
                <Button onClick={() => setShowConfirmation(null)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}


export default StudentDashboard;